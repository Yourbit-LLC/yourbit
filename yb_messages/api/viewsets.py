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
    
    def perform_create(self, serializer):
        profile = Profile.objects.get(username=self.request.user.active_profile)
        serializer.save(profile=profile)


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

        members_split = members.split(",")
        print(members_split)

        start = 0

        for member in members_split:
            print(str(start) + ": " + member)

            if member == '':
                members_split.remove(member)
                
        members_split.append(str(self.request.user.id))

        print("Members: " + str(members_split))

        member_profiles = []
        for member in members_split:
            member_profiles.append(Profile.objects.get(id=member))

        print("Member Profiles: " + str(member_profiles))

        # Check if the conversation already exists with the same members

        # try:
        print("Trying to find existing conversation")
        existing_conversations = Conversation.objects.filter(members__in=member_profiles)

        if existing_conversations.exists():
            
            filtered_conversations = []
            for conversation in existing_conversations:

                conversation_members = conversation.members.all()
                if all(member in member_profiles for member in conversation_members) and len(conversation_members) == len(member_profiles):
                    filtered_conversations.append(conversation)

            if filtered_conversations:
                print("Existing conversation found")
                serializer = ConversationSerializer(filtered_conversations[0], many=False)
                print("Serializer data" + serializer.data)
                return Response(serializer.data)
        
            else:

                if str(self.request.user.id) not in members:
                    members += str(self.request.user.id)
                serializer.save(members=members)

                new_conversation = Conversation.objects.get(id=serializer.data['id'])

                for member in new_conversation.members.all():
                    message_core = MessageCore.objects.get(profile = member)
                    message_core.conversations.add(new_conversation)
                    message_core.save()

                print(serializer.data)

                return Response(serializer.data)
        else:

            if str(self.request.user.id) not in members:
                members += str(self.request.user.id)

            serializer.save(members=members)

            new_conversation = Conversation.objects.get(id=serializer.data['id'])

            for member in new_conversation.members.all():
                message_core = MessageCore.objects.get(profile = member)
                message_core.conversations.add(new_conversation)
                message_core.save()

            print(serializer.data)

            return Response(serializer.data)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Message.objects.filter(conversation__members=self.request.user)
    
    def perform_create(self, serializer):
        this_id = self.request.data.get("id")  # Use parentheses () instead of square brackets []
        conversation = Conversation.objects.get(id=this_id)
        body = self.request.data.get("body")  # Use parentheses () instead of square brackets []
        from_user = Profile.objects.get(username=self.request.user.active_profile)
        print(self.request.data.get("is_images"))

        if self.request.data.get("is_images"):
            from yb_photo.utility import upload_image_cf
            attached_image = upload_image_cf(self.request, "general")
            serializer.save(from_user=from_user, body=body, conversation=conversation, images=[attached_image])

        elif self.request.data.get("is_videos"):
            from yb_video.services import save_video
            video = save_video(self.request, self.request.FILES["video"])
            video.save()
            serializer.save(from_user=from_user, body=body, conversation=conversation, videos=[video])

        else:
            serializer.save(from_user=from_user, body=body, conversation=conversation)
        

        new_message = Message.objects.get(id=serializer.data['id'])
        conversation.messages.add(new_message)
        conversation.save()
        
