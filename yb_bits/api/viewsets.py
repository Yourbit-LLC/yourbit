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
from rest_framework.parsers import JSONParser, MultiPartParser

#import json.loads
import json


#Viewset for chat bits
# views.py
from rest_framework import generics, viewsets
from rest_framework.response import Response
from yb_bits.models import Bit
from .serializers import BitSerializer, CreateBitSerializer, PhotoSerializer, VideoSerializer, BitCommentSerializer
from yb_video.models import Video
from yb_photo.models import Photo

from django.core.paginator import Paginator
from main.utility import generate_bs_filter_chain, update_bs_filter_chain
from rest_framework.permissions import IsAuthenticated, AllowAny
from yb_api.permissions import HasUserAPIKey
from yb_api.models import UserAPIKey  # Adjust import paths as needed
from main.models import get_cipher

class BitFeedAPIView(generics.ListAPIView):
    serializer_class = BitSerializer
    permission_classes = [AllowAny]  # Allow either session or API key-based auth

    def get_api_user(self):
        """Retrieve user associated with the API key or fall back to session-based authentication."""
        # First, try to authenticate using API key
        api_key = self.request.headers.get("Authorization", "").replace("Api-Key ", "")
        if api_key:
            try:
                user_api_key = UserAPIKey.objects.get_from_key(api_key)
                return user_api_key.profile.user  # Return the associated user from API key
            except UserAPIKey.DoesNotExist:
                pass

        # Fallback to session-based user (CSRF token required for this method)
        return self.request.user if self.request.user.is_authenticated else None

    def get_queryset(self):
        # Get the authenticated user, either from the API key or session
        user = self.get_api_user()
        if not user:
                
            # Profile-specific request
            if 'profile' in self.request.query_params:
                profile_username = self.request.query_params.get('profile')
                profile = Profile.objects.get(username=profile_username)

                # Check relationships with user
                queryset = Bit.objects.filter(profile=profile, is_public=True).order_by("-time")
            
            else:
                
                queryset = Bit.objects.filter(is_public=True).order_by('-time') # Return empty queryset if no user found

                        # Paginate
            paginator = Paginator(queryset, 4)
            page = self.request.query_params.get('page')
            
            try:
                queryset = paginator.page(page)
            except:
                queryset = None

            return queryset
        

        user_profile = Profile.objects.get(username=user.active_profile)
        print(self.request)

        # Retrieve friends, family, follows
        friends = user_profile.friends.all()
        family = user_profile.family.all()
        follows = user_profile.follows.all()

        # URL parameter filtering
        filter_value = self.request.query_params.get('filter', '').split('-')
        filter_value.pop(0)  # Remove blank value at start
        sort_value = self.request.query_params.get('sort')
        active_space = self.request.query_params.get('space')

        bitstream_object = BitStream.objects.get(profile=user_profile)
        hidden_bits = bitstream_object.hidden_bits.all()

        # Profile-specific request
        if 'profile' in self.request.query_params:
            profile_username = self.request.query_params.get('profile')
            profile = Profile.objects.get(username=profile_username)

            # Check relationships with user
            if profile.is_friends_with(user_profile) or profile.is_family_with(user_profile) or user == profile.user:
                queryset = Bit.objects.filter(profile=profile, type=active_space).order_by(sort_value).exclude(id__in=hidden_bits) if active_space != "global" else Bit.objects.filter(profile=profile).order_by(sort_value).exclude(id__in=hidden_bits)
            else:
                queryset = Bit.objects.filter(profile=profile, is_public=True).order_by(sort_value).exclude(id__in=hidden_bits)
            
        else:
            # Construct base query with filters
            base_query = Q()
            if filter_value != ['']:
                update_bs_filter_chain(user_profile, filter_value)

            # Apply filters for friends, follows, communities, public, and self posts
            if 'fr' in filter_value:
                base_query |= Q(profile__in=friends)
            if 'fo' in filter_value:
                base_query |= Q(profile__in=follows)
            if 'co' in filter_value:
                communities = Profile.objects.filter(following__in=follows, is_orbit=True)
                base_query |= Q(profile__in=communities)
            if 'p' in filter_value:
                base_query |= Q(is_public=True)
            if 'me' in filter_value:
                base_query |= Q(profile=user_profile)

            # Filter by space type if not global
            if active_space != "global":
                base_query &= Q(type=active_space)

            # Query with sorting and filtering
            exclude_user_profile = Q(profile=user_profile) if 'me' not in filter_value else Q()
            if sort_value == "-like_count":
                queryset = Bit.objects.filter(base_query).annotate(like_count=Count('likes')).distinct().order_by(sort_value).exclude(id__in=hidden_bits).exclude(exclude_user_profile)
            else:
                queryset = Bit.objects.filter(base_query).distinct().order_by(sort_value).exclude(id__in=hidden_bits).exclude(exclude_user_profile)

        print(queryset)

        # Paginate
        paginator = Paginator(queryset, 4)
        page = self.request.query_params.get('page')
        try:
            queryset = paginator.page(page)
        except:
            queryset = None

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        user = self.get_api_user()
        if not user:
            user_tz = request.query_params.get('timezone')

        else:
            user_profile = Profile.objects.get(username=user.active_profile)
            user_tz = user_profile.current_timezone
        
        page = self.paginate_queryset(queryset)

        if page is not None:
            if len(queryset) < 2:
                return Response({"detail": "Invalid page number"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True, context={'user_tz': user_tz, 'request': request})
        return Response(serializer.data)

class BitViewSet(viewsets.ModelViewSet):
    queryset = Bit.objects.all()
    serializer_class = BitSerializer
    parser_classes = [JSONParser, MultiPartParser]

    def get_serializer(self, *args, **kwargs):
        
        # Add context with user timezone and request in all serializer calls
        print(self.action)
        
        if self.action == 'create':
            return CreateBitSerializer(*args, **kwargs)
        
        else:
            kwargs['context'] = kwargs.get('context', {})
            user_profile = Profile.objects.get(username=self.request.user.active_profile)
            kwargs['context']['user_tz'] = user_profile.current_timezone
            kwargs['context']['request'] = self.request
            return super().get_serializer(*args, **kwargs)

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
        bit_data = request.data

        serializer = self.get_serializer(data=bit_data)
        serializer.is_valid(raise_exception=True)

        #Get custom core for profile images
        user_profile = Profile.objects.get(username=self.request.user.active_profile)
        custom_core = CustomCore.objects.get(profile=user_profile)
        theme = custom_core.theme
        
        print(bit_data)
        if bit_data.get("is_customized") == "true":
            custom_overrides = bit_data.get("custom_overrides")
            try:
                custom_bit = CustomBit.objects.create(
                    images = custom_core,
                    primary_color = custom_overrides.get("primary_color"),
                    accent_color = custom_overrides.get("accent_color"),
                    title_color = custom_overrides.get("title_color"),
                    text_color = custom_overrides.get("text_color"),
                    button_color = custom_overrides.get("button_color"),
                    button_text_color = custom_overrides.get("button_text_color"),
                    
                )
                
            except CustomBit.DoesNotExist:
                custom_bit = CustomBit.objects.create(theme=theme, images = custom_core)


        else:
            custom_bit = CustomBit.objects.get(theme=theme)
        

        if "photo" in request.FILES:
            from yb_photo.utility import upload_image_cf

            print("Creating a photobit.")
            new_photo = upload_image_cf(request, "general") 
            serializer.validated_data['photos'] = [new_photo]

        if bit_data.get("type") == "video":
            from yb_photo.models import VideoThumbnail

            upload_id = bit_data.get("upload_id")
            video_object = Video.objects.get(upload_id=upload_id)
            serializer.validated_data['video_upload'] = video_object

            thumbnail_object = video_object.thumbnail
            thumbnail_option = bit_data.get("thumbnail_option")

            if thumbnail_option == "choose":
                from yb_video.services import generate_video_thumbnails
                thumbnail_frame = bit_data.get("thumbnail_frame")
                thumbnails = generate_video_thumbnails(True, thumbnail_frame)
                thumbnail_object.tiny_thumbnail_ext = thumbnails["tiny_thumbnail"]
                thumbnail_object.small_thumbnail_ext = thumbnails["small_thumbnail"]
                thumbnail_object.medium_thumbnail_ext = thumbnails["medium_thumbnail"]
                thumbnail_object.large_thumbnail_ext = thumbnails["large_thumbnail"]
                thumbnail_object.xlarge_thumbnail_ext = thumbnails['xlarge_thumbnail']

            elif thumbnail_option == "middle":
                from yb_video.services import generate_video_thumbnails
                thumbnails = generate_video_thumbnails(False)
                thumbnail_object.tiny_thumbnail_ext = thumbnails["tiny_thumbnail"]
                thumbnail_object.small_thumbnail_ext = thumbnails["small_thumbnail"]
                thumbnail_object.medium_thumbnail_ext = thumbnails["medium_thumbnail"]
                thumbnail_object.large_thumbnail_ext = thumbnails["large_thumbnail"]
                thumbnail_object.xlarge_thumbnail_ext = thumbnails['xlarge_thumbnail']

            else:
                from yb_photo.utility import upload_image_cf
                upload_image_cf(request, "video_thumbnail")

        scope = bit_data.get('scope')
        if scope == 'public':
            is_public = True
            #Add additional parameters
            new_bit = serializer.save(
                display_name = user_profile.display_name, 
                user=self.request.user, 
                profile=user_profile, 
                custom=custom_bit,
                is_public=is_public,
                public_title = bit_data.get("title"),
                public_body = bit_data.get("body"),
            )

        else:
            is_public = False
            cipher = get_cipher()
            #Add additional parameters
            new_bit = serializer.save(
                display_name = user_profile.display_name, 
                user=self.request.user, 
                profile=user_profile, 
                custom=custom_bit,
                is_public=is_public,
                protected_title = cipher.encrypt(bit_data.get("title").encode()).decode(),
                protected_body = cipher.encrypt(bit_data.get("body").encode()).decode(),
            )





        headers = self.get_success_headers(serializer.data)

        rendered_bit = BitSerializer(new_bit, context={'user_tz': user_profile.current_timezone, 'request': request})

        if bit_data.get("is_scheduled") == "true":
            new_bit.status = "scheduled"
            new_bit.is_live = False
            new_bit.is_scheduled = True
            scheduled_date = bit_data.get("scheduled_date")
            scheduled_time = bit_data.get("scheduled_time")
            
            if scheduled_date and scheduled_time:
                scheduled_datetime_str = f"{scheduled_date} {scheduled_time}"
                scheduled_datetime = timezone.datetime.strptime(scheduled_datetime_str, "%Y-%m-%d %H:%M:%S")
                new_bit.scheduled_publish_time = scheduled_datetime

        else:
   
            new_bit.status = "ready"
            new_bit.is_live = True

        if bit_data.get("has_expiration") == "true":
            expiration_date = bit_data.get("expiration_date")
            expiration_time = bit_data.get("expiration_time")
            new_bit.evaporate = True
            expiration_datetime_str = f"{expiration_date} {expiration_time}"
            expiration_datetime = timezone.datetime.strptime(expiration_datetime_str, "%Y-%m-%d %H:%M:%S")
            new_bit.evapoation_date = expiration_datetime

        #Monetization Options
        new_bit.is_tips = True if bit_data.get("is_donations") == "true" else False
        new_bit.has_ads = True if bit_data.get("has_ads") == "true" else False
        new_bit.requires_subscription = True if bit_data.get("requires_subscription") == "true" else False
        new_bit.is_comments = True if bit_data.get("is_comments") == "true" else False
        new_bit.is_shareable = True if bit_data.get("is_shareable") == "true" else False
        new_bit.is_feedback = True if bit_data.get("is_feedback") == "true" else False

        new_bit.save()

        return Response({"bit_info": rendered_bit.data}, status=status.HTTP_201_CREATED, headers=headers)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
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
    
    @action(detail=True, methods=['get'])
    def comments(self, request, *args, **kwargs):
        bit = self.get_object()
        comments = bit.comments.all().order_by('-time')
        serializer = BitCommentSerializer(comments, many=True)
        return Response(serializer.data)
    

    
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
    
    #Endpoint to list out liked bits by a specific user and return serialized bits
    def list(self, request, *args, **kwargs):
        
        user_profile = Profile.objects.get(username=request.user.active_profile)
        queryset = Bit.objects.filter(likes__profile=user_profile).order_by('-time')

        #Check if page in query params
        if 'page' in request.query_params:
            page = request.query_params.get('page')
            p = Paginator(queryset, 4)

            try:
                queryset = p.page(page)

            except:
                queryset = None

            serializer = BitSerializer(queryset, many=True, context={'user_tz': user_profile.current_timezone, 'request': request})

        else:
            serializer = BitSerializer(queryset, many=True, context={'user_tz': user_profile.current_timezone, 'request': request})



        return Response(serializer.data)

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
    
    def list(self, request, *args, **kwargs):
        user_profile = Profile.objects.get(username=request.user.active_profile)
        queryset = Bit.objects.filter(dislikes__profile=user_profile).order_by('-time')
        serializer = BitSerializer(queryset, many=True, context={'user_tz': user_profile.current_timezone, 'request': request})
        return Response(serializer.data)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = BitComment.objects.all().order_by('-time')
    serializer_class = BitCommentSerializer    

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data, context={'is_creating': True,'request': request})
        serializer.is_valid(raise_exception=True)
        
        bit_id = serializer.validated_data.get('bit')

        profile = Profile.objects.get(username=request.user.active_profile)
        
        if isinstance(bit_id, Bit):
            bit = bit_id
        else:
            bit = get_object_or_404(Bit, pk=bit_id)
        
        comment = serializer.save(profile=profile)

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
