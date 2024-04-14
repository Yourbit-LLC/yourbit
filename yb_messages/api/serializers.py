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
    members = serializers.CharField(write_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'members', 'is_name', 'name', 'is_joinable', 'is_private', 'is_community', 'time_modified', 'stickers']

    def create(self, validated_data):
        # Extract members as a comma-separated string and convert to a list of user IDs
        member_ids = validated_data.pop('members').split(',')
        member_ids = [int(id.strip()) for id in member_ids if id.strip().isdigit()]  # Ensure only valid integers are converted
        members = User.objects.filter(id__in=member_ids)
        conversation = Conversation.objects.create(**validated_data)
        conversation.members.set(members)
        return conversation
    
class MessageSerializer(serializers.ModelSerializer):
    user = UserResultSerializer(read_only=True)
    class Meta:
        model = Message
        fields = '__all__'
