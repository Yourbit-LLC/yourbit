
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from yb_accounts.models import Account as User
from yb_messages.models import *
from yb_profile.models import Profile
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


class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Conversation.objects.filter(members=self.request.user)
    
    def perform_create(self, serializer):
        from yb_messages.models import MessageCore

        # Automatically add the request.user to the conversation members
        members = serializer.validated_data.get('members', [])

        print(members)

        if str(self.request.user.id) not in members:
            members += str(self.request.user.id)
        serializer.save(members=members)

        new_conversation = Conversation.objects.get(id=serializer.data['id'])

        for member in new_conversation.members.all():
            message_core = MessageCore.objects.get(profile = member.profile)
            message_core.conversations.add(new_conversation)
            message_core.save()

        return Response(serializer.data)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Message.objects.filter(conversation__members=self.request.user)
    
    def perform_create(self, serializer):

        conversation = Conversation.objects.get(id=self.request.data.get["id"])
        body = self.request.data.get["body"]

        serializer.save(from_user=self.request.user, body=body)

        new_message = Message.objects.get(id=serializer.data['id'])

        conversation.messages.add(new_message)
        conversation.save()

        


