#Viewsets for bits
#import q


# Path: bits\api\views.py

from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from yb_accounts.models import Account as User
from yb_bits.models import *
from yb_profile.models import Profile
from .serializers import *
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from rest_framework.authtoken.models import Token
from django.utils import timezone
from django.db.models import Q, Count
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied


#Viewset for chat bits
# views.py
from rest_framework import generics, viewsets
from rest_framework.response import Response
from yb_bits.models import Bit
from .serializers import BitSerializer, CreateBitSerializer, PhotoSerializer, VideoSerializer, BitCommentSerializer
from yb_video.models import Video
from yb_photo.models import Photo

from django.core.paginator import Paginator


class BitFeedAPIView(generics.ListAPIView):
    serializer_class = BitSerializer

    def get_queryset(self):
        user_profile = Profile.objects.get(username=self.request.user.active_profile)  # Assuming the user is authenticated

        print(self.request)
        # Get friends and followers
        friends = user_profile.friends.all()
        family = user_profile.family.all()
        follows = user_profile.follows.all()

        # Add logic to filter based on URL parameters
        filter_value = self.request.query_params.get('filter', None)
        filter_value = filter_value.split('-')

        #remove blank value at beginning from filter value
        filter_value.pop(0)
        print(filter_value)

        sort_value = self.request.query_params.get('sort')

        active_space = self.request.query_params.get('space')

        bitstream_object = BitStream.objects.get(profile=user_profile)
        hidden_bits = bitstream_object.hidden_bits.all()

        print(active_space)

        print(sort_value)

        #Check if profile is in request query params
        if 'profile' in self.request.query_params:
            #If so user wants bits for a specific profile
            profile_username = self.request.query_params.get('profile')
            profile = Profile.objects.get(user__username=profile_username)
            
            if profile.is_friends_with(user_profile) or profile.is_family_with(user_profile) or self.request.user == profile.user:
                if active_space != "global":
                    queryset = Bit.objects.filter(profile=profile, type = active_space).order_by(sort_value).exclude(id__in=hidden_bits)
                
                else:
                    queryset = Bit.objects.filter(profile=profile).order_by(sort_value).exclude(id__in=hidden_bits)
            else:
                queryset = Bit.objects.filter(profile=profile, is_public=True).order_by(sort_value).exclude(id__in=hidden_bits)
        else:            

            base_query = Q()
            
            # Check for friends (symmetrical relationship to profiles)
            if 'fr' in filter_value:
                friends = user_profile.friends.all()  # Assuming you have a many-to-many relationship for friends
                base_query |= Q(profile__in=friends)
            
            # Check for following (symmetrical relationship to profiles)
            if 'fo' in filter_value:
                following = user_profile.follows.all()  # Assuming a many-to-many relationship for following
                base_query |= Q(profile__in=following)
            
            # Check for communities (followed profiles where is_orbit is True)
            if 'co' in filter_value:
                following = user_profile.follows.all()
                communities = Profile.objects.filter(following__in=following, is_orbit=True)
                base_query |= Q(profile__in=communities)
            
            # Check for public bits (is_public field set to True)
            if 'p' in filter_value:
                base_query |= Q(is_public=True)
            
            # Check for the user's own posts (me)
            if 'me' in filter_value:
                base_query |= Q(profile=user_profile)
    
            # Check if the active space is not global
            if active_space != "global":
                # Add the type filter to the base query
                base_query &= models.Q(type=active_space)

            # Now apply the base_query to the queryset and finalize with distinct and order_by
                # Now get the bits/posts that match the constructed query

            if 'me' not in filter_value:
                if sort_value == "-like_count":
                    queryset = Bit.objects.filter(base_query).annotate(like_count=Count('likes')).distinct().order_by(sort_value).exclude(id__in=hidden_bits).exclude(profile=user_profile)  
                else:
                    queryset = Bit.objects.filter(base_query).distinct().order_by(sort_value).exclude(id__in=hidden_bits).exclude(profile=user_profile)
            else:
                if sort_value == "-like_count":
                    queryset = Bit.objects.filter(base_query).annotate(like_count=Count('likes')).distinct().order_by(sort_value).exclude(id__in=hidden_bits)    
                else:
                    queryset = Bit.objects.filter(base_query).distinct().order_by(sort_value).exclude(id__in=hidden_bits)

        print(queryset)

        p = Paginator(queryset, 8)

        page = self.request.query_params.get('page')

        print("\n\n" + page + "\n\n")

        if page:

            try:
                queryset = p.page(page)

            except:
                queryset = None


        # You may want to handle exceptions for invalid input or missing parameters

        return queryset  # Modify this to apply your filtering and sorting logic

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        this_profile = Profile.objects.get(username=self.request.user.active_profile)
        user_tz = this_profile.current_timezone

        print("user tz" + user_tz)
        page = self.paginate_queryset(queryset)
        if page is not None:
            print(queryset)
            if len(queryset < 2):
                return Response({"detail": "Invalid page number"}, status=status.HTTP_400_BAD_REQUEST)
            
            else:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

    
        serializer = self.get_serializer(queryset, many=True, context={'user_tz': user_tz,'request': request})
        return Response(serializer.data)

class BitViewSet(viewsets.ModelViewSet):
    queryset = Bit.objects.all()
    serializer_class = BitSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateBitSerializer
        return BitSerializer

    def get_queryset(self):
        queryset = Bit.objects.all()

        # Add logic to filter based on URL parameters
        filter_value = self.request.query_params.get('filter', None)
        sort_value = self.request.query_params.get('sort', None)
        # Add other parameters as needed

        # You may want to handle exceptions for invalid input or missing parameters

        return queryset  # Modify this to apply your filtering and sorting logic

    def create(self, request, *args, **kwargs):
        from yb_customize.models import CustomCore
        from yb_bits.api.serializers import BitSerializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        #Get custom core for profile images
        user_profile = Profile.objects.get(username=self.request.user.active_profile)
        custom_core = CustomCore.objects.get(profile=user_profile)
        theme = custom_core.theme
        
        try:
            custom_bit = CustomBit.objects.get(theme=theme)
        
        except CustomBit.DoesNotExist:
            custom_bit = CustomBit.objects.create(theme=theme, images = custom_core)

        if 'image' in request.FILES:
            from yb_photo.utility import upload_image_cf

            print("Creating a photobit.")
            new_photo = upload_image_cf(request, "general") 
            serializer.validated_data['photos'] = [new_photo]

        if request.data.get("type") == "video":
            from yb_photo.models import VideoThumbnail
            upload_id = request.data.get("upload_id")
            video_object = Video.objects.get(upload_id=upload_id)
            serializer.validated_data['video_upload'] = video_object

            thumbnail_object = video_object.thumbnail
            thumbnail_option = request.data.get("thumbnail_option")

            if thumbnail_option == "choose":
                from yb_video.services import generate_mux_thumbnails
                thumbnail_frame = request.data.get("thumbnail_frame")
                thumbnails = generate_mux_thumbnails(True, thumbnail_frame)
                thumbnail_object.tiny_thumbnail_ext = thumbnails["tiny_thumbnail"]
                thumbnail_object.small_thumbnail_ext = thumbnails["small_thumbnail"]
                thumbnail_object.medium_thumbnail_ext = thumbnails["medium_thumbnail"]
                thumbnail_object.large_thumbnail_ext = thumbnails["large_thumbnail"]
                thumbnail_object.xlarge_thumbnail_ext = thumbnails['xlarge_thumbnail']

            elif thumbnail_option == "middle":
                from yb_video.services import generate_mux_thumbnails
                thumbnails = generate_mux_thumbnails(False)
                thumbnail_object.tiny_thumbnail_ext = thumbnails["tiny_thumbnail"]
                thumbnail_object.small_thumbnail_ext = thumbnails["small_thumbnail"]
                thumbnail_object.medium_thumbnail_ext = thumbnails["medium_thumbnail"]
                thumbnail_object.large_thumbnail_ext = thumbnails["large_thumbnail"]
                thumbnail_object.xlarge_thumbnail_ext = thumbnails['xlarge_thumbnail']

            else:
                from yb_photo.utility import upload_image_cf
                upload_image_cf(request, "video_thumbnail")

        scope = request.data.get('scope')
        if scope == 'public':
            is_public = True

        else:
            is_public = False

        #Add additional parameters
        serializer.save(
            display_name = user_profile.display_name, 
            user=self.request.user, 
            profile=user_profile, 
            custom=custom_bit,
            is_public=is_public
        )


        headers = self.get_success_headers(serializer.data)

        new_bit = Bit.objects.get(id=serializer.data['id'])
        rendered_bit = BitSerializer(new_bit, context={'user_tz': user_profile.current_timezone, 'request': request})

   
        new_bit.status = "ready"
        new_bit.is_live = True
        new_bit.save()

        return Response({"bit_info": rendered_bit.data}, status=status.HTTP_201_CREATED, headers=headers)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        user_profile = Profile.objects.get(username=self.request.user.active_profile)
        timezone = user_profile.current_timezone

        serializer = self.get_serializer(instance, context={'user_tz': timezone, 'request': request})
        return Response(serializer.data)
    


    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Check if the request user is the owner of the object
        if instance.user != request.user:
            raise PermissionDenied("You do not have permission to delete this object.")

        return super().destroy(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'])
    def hide(self, request, *args, **kwargs):
        instance = self.get_object()
        user_profile = Profile.objects.get(username=self.request.user.active_profile)
        bitstream_object = BitStream.objects.get(profile=user_profile)
        bitstream_object.hidden_bits.add(instance)
        bitstream_object.save()

        return Response({"status": "success"}, status=status.HTTP_200_OK)

    
class LikeViewSet(viewsets.ModelViewSet):
    queryset = BitLike.objects.all()
    serializer_class = BitLikeSerializer

    def create(self, request, *args, **kwargs):

        
        bit_id = request.data.get('bit_id')
        bit = Bit.objects.get(id=bit_id)
        
        if bit_dislike := BitDislike.objects.filter(bit=bit, user=self.request.user).first():
            bit.dislikes.remove(bit_dislike)
            bit_dislike.delete()
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            bit_like = serializer.save(bit=bit, user = self.request.user)
            bit.likes.add(bit_like)

        elif bit_like := BitLike.objects.filter(bit=bit, user=self.request.user).first():
            bit.likes.remove(bit_like)
            bit_like.delete()

        else:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            bit_like = serializer.save(bit=bit, user = self.request.user)
            bit.likes.add(bit_like)


        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class DislikeViewsSet(viewsets.ModelViewSet):
    queryset = BitDislike.objects.all()
    serializer_class = BitDislikeSerializer

    def create(self, request, *args, **kwargs):
        bit_id = request.data.get('bit_id')
        bit = Bit.objects.get(id=bit_id)

        
        if bit_like := BitLike.objects.filter(bit=bit, user=self.request.user).first():
            bit.likes.remove(bit_like)
            bit_like.delete()
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            bit_dislike = serializer.save(bit=bit, user = self.request.user)
            bit.dislikes.add(bit_dislike)

        #now for dislikes 
        elif bit_dislike := BitDislike.objects.filter(bit=bit, user=self.request.user).first():
            bit.dislikes.remove(bit_dislike)
            bit_dislike.delete()

        else:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            bit_dislike = serializer.save(bit=bit, user = self.request.user)
            bit.dislikes.add(bit_dislike)


        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = BitComment.objects.all().order_by('-time')
    serializer_class = BitCommentSerializer    

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data, context={'is_creating': True,'request': request})
        serializer.is_valid(raise_exception=True)
        
        bit_id = serializer.validated_data.get('bit')

        
        if isinstance(bit_id, Bit):
            bit = bit_id
        else:
            bit = get_object_or_404(Bit, pk=bit_id)
        
        comment = serializer.save(user=request.user)

        # Add the comment to the Bit instance
        bit.comments.add(comment)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        queryset = super().get_queryset()
        bit_id = self.request.query_params.get('bit_id')
        
        if bit_id:
            queryset = queryset.filter(bit=bit_id)
        
        return queryset
    def list(self, request, *args, **kwargs):

        user_profile = Profile.objects.get(username=request.user.active_profile)
        timezone = user_profile.current_timezone
        print(timezone)
        serializer = self.get_serializer_context()
        serializer['is_create'] = False
        serializer['user_tz'] = timezone

        return super().list(request, *args, **kwargs)
