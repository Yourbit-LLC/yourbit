from rest_framework import serializers

from yb_notify.models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Notification
        fields = '__all__'