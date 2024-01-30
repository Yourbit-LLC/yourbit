#API Viewsets
from rest_framework import viewsets, generics
from yb_photo.models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import update_last_login
from django.utils import timezone
from yb_profile.models import UserProfile as Profile
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle

class PhotoUploadView(generics.CreateAPIView):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer

class PhotoViewSet(viewsets.ModelViewSet):
    
    serializer_class = PhotoSerializer

    # Add rate limits to this viewset
    throttle_classes = [UserRateThrottle, AnonRateThrottle]
    
    def create(self, request):
        
        serializer = PhotoSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) 
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        #Import verify_access function to verify user access permissions
        from yb_profile.resources import get_object_permissions
        
        try:
            #Get photo
            photo = Photo.objects.get(id=pk)
            
            #Get user profile
            user_profile = Profile.objects.get(user=request.user)

            #Verify permission
            permission = get_object_permissions(user_profile, photo)

            if permission:

                #Serialize Photo
                serializer = PhotoSerializer(photo)

                #Get stickers
                stickers = PhotoSticker.objects.filter(photo=photo)
                sticker_serializer = PhotoStickerSerializer(stickers, many=True)
                
                #Return photo and stickers
                content = {"photo": serializer.data, "stickers": sticker_serializer.data}
                return Response(content, status=status.HTTP_200_OK)
            
            else:
                #Return 401
                return Response(status=status.HTTP_401_UNAUTHORIZED)

        except:
            #Return 404
            return Response(status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        #Delete photo
        photo = Photo.objects.get(id=pk, user=request.user)
        photo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, pk=None):
        #Update photo
        try:
            #Get photo
            photo = Photo.objects.get(id=pk, user=request.user)
            serializer = PhotoSerializer(photo, data=request.data)
        except:
            #Return 404
            return Response(status=status.HTTP_404_NOT_FOUND)

        #Validate and save
        if serializer.is_valid():
            serializer.save()
            #Return 202
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED) 
        else:
            #Return 400
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

