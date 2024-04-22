from rest_framework import serializers

from yb_notify.models import Notification, NotificationCore, PushSubscription, UserDevice
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

class NotificationSubscriptionSerializer(serializers.Serializer):
    endpoint = serializers.CharField()
    p256dh = serializers.CharField()
    auth = serializers.CharField()


    class Meta:
        model = PushSubscription
        fields = '__all__'

class UserDeviceSerializer(serializers.Serializer):
    device_id = serializers.CharField()
    device_type = serializers.CharField()

    class Meta:
        model = UserDevice
        fields = '__all__'