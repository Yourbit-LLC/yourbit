from rest_framework import serializers
from ..models import *
from yb_customize.models import CustomCore
from yb_customize.api.serializers import SlimCustomSerializer
import pytz
from datetime import datetime

from yb_accounts.api.serializers import UserResultSerializer

class ProfileResultSerializer(serializers.ModelSerializer):

    customcore = serializers.SerializerMethodField()
    user = UserResultSerializer(read_only=True)

    class Meta: 
        model = Profile
        fields = ['id','display_name', 'username', 'user', 'customcore']

    def get_customcore(self, obj):
        custom_core = CustomCore.objects.get(profile=obj)
        return SlimCustomSerializer(custom_core).data

class ProfileInfoSerializer(serializers.ModelSerializer):

    class Meta: 
        model = ProfileInfo
        fields = '__all__'

class OrbitInfoSerializer(serializers.ModelSerializer):

    class Meta: 
        model = OrbitInfo
        fields = '__all__'

class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = ProfileResultSerializer(read_only=True)
    to_user = ProfileResultSerializer(read_only=True)
    class Meta: 
        model = FriendRequest
        fields = '__all__'

class CustomProfileImageSerializer(serializers.ModelSerializer):
    from yb_photo.api.serializers import PhotoSerializer
    profile_image = PhotoSerializer(read_only=True)
    class Meta: 
        model = CustomCore
        fields = ['profile_image']