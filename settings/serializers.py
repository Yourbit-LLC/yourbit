from rest_framework import serializers
from settings.models import PrivacySettings, FeedSettings

class PrivacySettingsSerializer(serializers.modelSerializer):
    class Meta:
        model = PrivacySettings
        fields = '__all__'

class FeedSettingsSerializer(serializers.modelSerializer):
    class Meta:
        model = FeedSettings
        fields = '__all__'

