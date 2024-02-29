from rest_framework import serializers
from yb_messages.models import *
from yb_accounts.models import Account as User
from yb_accounts.api.serializers import UserResultSerializer
import pytz

class MessageCoreSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = MessageCore
        fields = '__all__'

class ConversationSerializer(serializers.ModelSerializer):
    user = UserResultSerializer(read_only=True)
    class Meta:
        model = Conversation
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    user = UserResultSerializer(read_only=True)
    class Meta:
        model = Message
        fields = '__all__'
