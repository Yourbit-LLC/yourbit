from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from .serializers import *
from rest_framework.response import Response
from django.db.models import Q
from operator import attrgetter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from yb_profile.models import Profile
from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser
#import object does not exist
from django.core.exceptions import ObjectDoesNotExist


#Profile Viewset


class ProfileViewset(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileResultSerializer
    filter_backends = [DjangoFilterBackend]


    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = ProfileResultSerializer(instance)
        return Response(serializer.data)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        username = self.request.query_params.get('username')
        if username:
            queryset = queryset.filter(user__username=username)
        return queryset

    from django.core.exceptions import ObjectDoesNotExist

    @action(detail=True, methods=['post'])
    def follow(self, request, pk=None):
        """Endpoint to follow a user."""
        try:
            user_to_follow = self.get_object()

            if user_to_follow == request.user:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            
            elif user_to_follow.is_private:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            
            else:
                if user_to_follow in request.user.profile.follows.all():
                    return Response("Already Following User", status=status.HTTP_400_BAD_REQUEST)
                else:
                    request.user.profile.follow(user_to_follow)
                    return Response(status=status.HTTP_204_NO_CONTENT)
        
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def unfollow(self, request, pk=None):
        """Endpoint to unfollow a user."""
        try:
            user_to_unfollow = self.get_object()

            if user_to_unfollow == request.user:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            
            elif user_to_unfollow.profile.is_private:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            
            else:
                
                if user_to_unfollow not in request.user.profile.follows.all():
                    return Response("Not Following User", status=status.HTTP_400_BAD_REQUEST)
                
                else:        
                    request.user.profile.unfollow(user_to_unfollow)
                    return Response(status=status.HTTP_204_NO_CONTENT)
                
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=True, methods=['get'])
    def image(self, request, pk=None):
        profile = self.get_object()
        custom_core = CustomCore.objects.get(profile=profile)
        serialized_data = CustomProfileImageSerializer(custom_core).data

        return Response(serialized_data)



#Orbits Viewset


class OrbitViewset(viewsets.ModelViewSet):
    queryset = Orbit.objects.all()
    serializer_class = OrbitResultSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['handle', 'display_name']

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = OrbitResultSerializer(instance)
        return Response(serializer.data)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        username = self.request.query_params.get('username')
        if username:
            queryset = queryset.filter(handle=username)
        return queryset
    
    @action(detail=True, methods=['post'])
    def follow(self, request, pk=None):
        """Endpoint to follow a user."""

        #Try and get object by ID
        try:
            user_to_follow = self.get_object()

        #If object does not exist, return 404
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        #If user is trying to follow themselves, return 400
        if user_to_follow == request.user:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        #If user is trying to follow a private account, return 401
        elif user_to_follow.Orbit.is_private:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        else:
            #If user is already following the account, return 400
            if user_to_follow in request.user.Profile.follows.all():
                return Response("Already Following User", status=status.HTTP_400_BAD_REQUEST)
            
            #If user is not already following the account, follow the account
            else:
                request.user.Profile.follow(user_to_follow)
                return Response(status=status.HTTP_204_NO_CONTENT)
        
    @action(detail=True, methods=['post'])
    def unfollow(self, request, pk=None):
        """Endpoint to unfollow a user."""
        
        try:
            user_to_unfollow = self.get_object()

        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if user_to_unfollow == request.user:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        elif user_to_unfollow.Orbit.is_private:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        else:
            
            if user_to_unfollow not in request.user.Profile.follows.all():
                return Response("Not Following User", status=status.HTTP_400_BAD_REQUEST)
            
            else:        
                request.user.Profile.unfollow(user_to_unfollow)
                return Response(status=status.HTTP_204_NO_CONTENT)

        
    

#Profile Information Viewset
        

class ProfileInfoViewset(viewsets.ModelViewSet):
    queryset = ProfileInfo.objects.all()
    serializer_class = ProfileInfoSerializer
    filter_backends = [DjangoFilterBackend]
    

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = ProfileInfoSerializer(instance)
        return Response(serializer.data)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        username = self.request.query_params.get('username')
        if username:
            queryset = queryset.filter(user__username=username)
        return queryset
    

#Orbit information Viewset


class CommunityInfoViewset(viewsets.ModelViewSet):
    queryset = OrbitInfo.objects.all()
    serializer_class = OrbitInfoSerializer
    filter_backends = [DjangoFilterBackend]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = OrbitInfoSerializer(instance)
        return Response(serializer.data)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        username = self.request.query_params.get('username')
        if username:
            queryset = queryset.filter(handle=username)
        return queryset


#Friend Request Viewset
    
    
class FriendRequestViewset(viewsets.ModelViewSet):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer
    filter_backends = [DjangoFilterBackend]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = FriendRequestSerializer(instance)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        from yb_settings.models import MySettings, PrivacySettings
        from .serializers import ProfileResultSerializer
        to_user = request.data.get('to_user')
        print("\n\nCreating friend request to user: \n" + to_user + "\n\n")
        to_user_settings = MySettings.objects.get(user = to_user)

        to_user_privacy = PrivacySettings.objects.get(settings = to_user_settings)
        
        if to_user_privacy.searchable == False:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user_profile = Profile.objects.get(user = request.user)
        to_user_profile = Profile.objects.get(id = to_user)

        friend_request = serializer.save(from_user = user_profile, to_user = to_user_profile)

        to_profile = Profile.objects.get(user = to_user)

        to_profile.friend_requests.add(friend_request)

        return Response(status=status.HTTP_201_CREATED)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        username = self.request.query_params.get('username')
        if username:
            queryset = queryset.filter(to_user__username=username)
        return queryset
    
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None, *args, **kwargs):

        friend_request = self.get_object()

        # Assuming the FriendRequest model has 'from_user' and 'to_user' fields
        
        from_user = friend_request.from_user
        to_user = friend_request.to_user

        if to_user == request.user.profile:
            from_user.friends.add(to_user)
            to_user.friends.add(from_user)

            # Update or delete the friend request
            friend_request.accepted = True
            friend_request.save()

        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    
        return Response(status=status.HTTP_204_NO_CONTENT)

    
    @action(detail=True, methods=['post'])
    def decline(self, request, pk=None):
        friend_request = self.get_object()

        if friend_request.to_user == request.user:
            
            friend_request.delete()

        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        
        friend_request = self.get_object()

        if friend_request.from_user == request.user:
            friend_request.delete()  

        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        return Response(status=status.HTTP_204_NO_CONTENT)
