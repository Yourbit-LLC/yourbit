from rest_framework import serializers
from ..models import Notification
from YourbitAccounts.api.serializers import UserSerializer
from messenger.api.serializers import MessageSerializer

class NotificationSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(many=False, read_only = True)
    class Meta:
        model = Notification
        fields = '__all__'

class MessageNotificationSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(many=False, read_only = True)
    message = MessageSerializer(many=False, read_only = True)

    class Meta:
        model = Notification
        fields = '__all__'
