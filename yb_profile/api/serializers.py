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
        fields = ['display_name', 'user', 'customcore']

    def get_customcore(self, obj):
        custom_core = CustomCore.objects.get(profile=obj)
        return SlimCustomSerializer(custom_core).data
class CommunityResultSerializer(serializers.ModelSerializer):
    
        customcore = serializers.SerializerMethodField()
    
        class Meta: 
            model = Orbit
            fields = ['display_name', 'customcore']
    
        def get_customcore(self, obj):
            """
            This method is called to get the value of the 'customcore' field.
            'obj' is the Profile instance that's being serialized.
            """
    
            if hasattr(obj, 'customcore'):  # Check if the Profile instance has a related CustomCore instance
                return SlimCustomSerializer(obj.custom).data  # If it does, serialize the CustomCore instance and return the serialized data
            return None  # If it doesn't, return None
        
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