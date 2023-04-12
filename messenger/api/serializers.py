from rest_framework import serializers
from messenger.models import *

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class ConversationSerializer(serializers.ModelSerializer):
    from user_profile.api.serializers import UserSerializer, CustomResultSerializer
    sender = UserSerializer(many=False, read_only = True)
    receiver = UserSerializer(many=False, read_only = True)
    receiver_custom = CustomResultSerializer(many=False, read_only=True)
    class Meta:
        model = Conversation
        fields = '__all__'