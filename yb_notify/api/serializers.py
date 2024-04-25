from rest_framework import serializers

from yb_notify.models import Notification, NotificationCore
from yb_profile.api.serializers import ProfileResultSerializer

class NotificationSerializer(serializers.ModelSerializer):
    from_user = ProfileResultSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = '__all__'

class NotificationCoreSerializer(serializers.ModelSerializer):
    unseen_notifications = NotificationSerializer(many=True)
    seen_notifications = NotificationSerializer(many=True)

    class Meta:
        model = NotificationCore
        fields = '__all__'



