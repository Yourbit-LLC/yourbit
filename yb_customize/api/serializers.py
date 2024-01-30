
from rest_framework import serializers
from yb_customize.models import *
from yb_accounts.models import Account as User
from yb_photo.api.serializers import PhotoSerializer

class CustomCoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomCore
        fields="__all__"

class SlimCustomSerializer(serializers.ModelSerializer):
    profile_image = PhotoSerializer(many=False, read_only=True)
    class Meta:
        model = CustomCore
        fields = [
            'profile_image',
         
        ]

        
class CustomBitSerializer(serializers.ModelSerializer):
    images = SlimCustomSerializer(many=False, read_only=True)
    class Meta:
        model = CustomBit
        fields = '__all__'