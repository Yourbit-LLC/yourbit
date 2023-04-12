from rest_framework import serializers
from settings.models import PrivacySettings, FeedSettings

class PrivacySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacySettings
        fields = '__all__'

class FeedSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedSettings
        fields = '__all__'

