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
        fields = ['id', 'members', 'is_name', 'name', 'can_join', 'is_community', 'time_modified']

    def create(self, validated_data):
        from yb_profile.models import Profile
        # Extract members as a comma-separated string and convert to a list of user IDs
        member_ids = validated_data.pop('members').split(',')
        member_ids = [int(id.strip()) for id in member_ids if id.strip().isdigit()]  # Ensure only valid integers are converted
        members = Profile.objects.filter(id__in=member_ids)
        conversation = Conversation.objects.create(**validated_data)
        conversation.members.set(members)
        return conversation
    
class MessageSerializer(serializers.ModelSerializer):
    from yb_photo.api.serializers import PhotoSerializer
    from yb_video.api.serializers import VideoSerializer

    user = UserResultSerializer(read_only=True)
    images = PhotoSerializer(many=True, read_only=True)
    videos = VideoSerializer(many=True, read_only=True)
    body = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = '__all__'

    def get_body(self, obj):
        return obj.decrypted_body
