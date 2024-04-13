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
from django.db.models import Q
from django.shortcuts import get_object_or_404


#Viewset for chat bits
# views.py
from rest_framework import generics, viewsets
from rest_framework.response import Response
from yb_bits.models import Bit
from .serializers import BitSerializer, CreateBitSerializer,PhotoSerializer, VideoSerializer, BitCommentSerializer
from yb_video.models import Video
from yb_photo.models import Photo

from django.core.paginator import Paginator


class BitFeedAPIView(generics.ListAPIView):
    serializer_class = BitSerializer

    def get_queryset(self):
        user_profile = Profile.objects.get(user=self.request.user)  # Assuming the user is authenticated

        # Get friends and followers
        friends = user_profile.friends.all()
        family = user_profile.family.all()
        follows = user_profile.follows.all()

        # Add logic to filter based on URL parameters
        filter_value = self.request.query_params.get('filter', None)
        sort_value = self.request.query_params.get('sort')

        active_space = self.request.query_params.get('space')

        print(active_space)


        print(sort_value)

        #Check if profile is in request query params
        if 'profile' in self.request.query_params:
            #If so user wants bits for a specific profile
            profile_username = self.request.query_params.get('profile')
            profile = Profile.objects.get(user__username=profile_username)
            
            if active_space != "global":
                queryset = Bit.objects.filter(profile=profile, type = active_space).order_by(sort_value)
            
            else:
                queryset = Bit.objects.filter(profile=profile).order_by(sort_value)
        
        else:            

           # Start with a base query that applies to all situations
            base_query = models.Q(profile__in=friends) | \
                        models.Q(profile__in=follows) | \
                        models.Q(is_public=True) | \
                        models.Q(user=self.request.user)

            # Check if the active space is not global
            if active_space != "global":
                # Add the type filter to the base query
                base_query &= models.Q(type=active_space)

            # Now apply the base_query to the queryset and finalize with distinct and order_by
            queryset = Bit.objects.filter(base_query).distinct().order_by(sort_value)

        print(queryset)

        p = Paginator(queryset, 8)

        page = self.request.query_params.get('page')

        print("\n\n" + page + "\n\n")

        if page:
            queryset = p.page(page)


        # You may want to handle exceptions for invalid input or missing parameters

        return queryset  # Modify this to apply your filtering and sorting logic

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        this_profile = Profile.objects.get(user=self.request.user)
        user_tz = this_profile.current_timezone

        print("user tz" + user_tz)
        page = self.paginate_queryset(queryset)
        if page is not None:
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
        user_profile = Profile.objects.get(user=self.request.user)
        custom_core = CustomCore.objects.get(profile=user_profile)
        theme = custom_core.theme
        
        try:
            custom_bit = CustomBit.objects.get(theme=theme)
        
        except CustomBit.DoesNotExist:
            custom_bit = CustomBit.objects.create(theme=theme, images = custom_core)

        if 'image' in request.FILES:
            from yb_photo.utility import process_image

            print("Creating a photobit.")
            
            photo_data = request.FILES['image']
            new_photo = process_image(request, photo_data, photo_data, False)
            new_photo.save()
            serializer.validated_data['photos'] = [new_photo]

        if 'video' in request.FILES:
            video_data = request.FILES['video']
            new_video = Video.objects.create(video=video_data, user=self.request.user)
            new_video.save()
            serializer.validated_data['video_upload'] = new_video

        #Add additional parameters
        serializer.save(
            display_name = user_profile.display_name, 
            user=self.request.user, 
            profile=user_profile, 
            custom=custom_bit
        )

        headers = self.get_success_headers(serializer.data)

        new_bit = Bit.objects.get(id=serializer.data['id'])
        rendered_bit = BitSerializer(new_bit, context={'user_tz': user_profile.current_timezone, 'request': request})

        return Response(rendered_bit.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        user_profile = Profile.objects.get(user=self.request.user)
        timezone = user_profile.current_timezone

        serializer = self.get_serializer(instance, context={'user_tz': timezone, 'request': request})
        return Response(serializer.data)
        

    
class LikeViewSet(viewsets.ModelViewSet):
    queryset = BitLike.objects.all()
    serializer_class = BitLikeSerializer

    def create(self, request, *args, **kwargs):
        bit_id = request.data.get('bit_id')
        bit = Bit.objects.get(id=bit_id)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        bit_like = serializer.save(bit=bit, user = self.request.user)
        bit.likes.add(bit_like)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class DislikeViewsSet(viewsets.ModelViewSet):
    queryset = BitDislike.objects.all()
    serializer_class = BitDislikeSerializer

    def create(self, request, *args, **kwargs):
        bit_id = request.data.get('bit_id')
        bit = Bit.objects.get(id=bit_id)
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
        serializer = self.get_serializer(data=request.data)
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
        user_profile = Profile.objects.get(user=request.user)
        timezone = user_profile.current_timezone

        serializer = self.get_serializer_context()
        serializer['user_tz'] = timezone

        return super().list(request, *args, **kwargs)
