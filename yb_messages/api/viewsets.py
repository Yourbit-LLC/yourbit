
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from yb_accounts.models import Account as User
from yb_messages.models import *
from yb_profile.models import UserProfile
from .serializers import *
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import update_last_login
from django.utils import timezone
from django.db.models import Q

#Viewset for chat bits
# views.py
from rest_framework import generics, viewsets
from rest_framework.response import Response

#Message Viewsets
class MessageCoreViewSet(viewsets.ModelViewSet):
    queryset = MessageCore.objects.all()
    serializer_class = MessageCoreSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return MessageCore.objects.filter(profile=self.request.user.profile)
    
    def perform_create(self, serializer):
        serializer.save(profile=self.request.user.profile)

class OneToOneConversationViewSet(viewsets.ModelViewSet):
    queryset = OneToOneConversation.objects.all()
    serializer_class = OneToOneConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return OneToOneConversation.objects.filter(profile=self.request.user.profile)
    
    def perform_create(self, serializer):
        serializer.save(profile=self.request.user.profile)

class GroupConversationViewSet(viewsets.ModelViewSet):
    queryset = GroupConversation.objects.all()
    serializer_class = GroupConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return GroupConversation.objects.filter(profile=self.request.user.profile)
    
    def perform_create(self, serializer):
        serializer.save(profile=self.request.user.profile)

class OneToOneMessageViewSet(viewsets.ModelViewSet):
    queryset = OneToOneMessage.objects.all()
    serializer_class = OneToOneMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return OneToOneMessage.objects.filter(profile=self.request.user.profile)
    
    def perform_create(self, serializer):
        serializer.save(profile=self.request.user.profile)

class GroupMessageViewSet(viewsets.ModelViewSet):
    queryset = GroupMessage.objects.all()
    serializer_class = GroupMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return GroupMessage.objects.filter(profile=self.request.user.profile)
    
    def perform_create(self, serializer):
        serializer.save(profile=self.request.user.profile)

