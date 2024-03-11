from rest_framework import serializers

from yb_notify.models import Notification
from yb_profile.api.serializers import ProfileResultSerializer

class NotificationSerializer(serializers.ModelSerializer):
    from_user = ProfileResultSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = '__all__'