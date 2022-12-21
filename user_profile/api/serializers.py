from rest_framework import serializers
from YourbitAccounts.serializers import UserSerializer
from ..models import *

class CustomBitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Custom
        fields = [
            'image', 
            'primary_color', 
            'title_color', 
            'text_color',
            'feedback_icon_color',
            'feedback_background_color',
            'paragraph_align',

            ]

class BitSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only = True)
    custom = CustomBitSerializer(many = False, read_only = True)
    
    class Meta:
        model = Bit
        fields = '__all__'

class CustomResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Custom
        fields = [
            'image',
            'primary_color',
            'accent_color',
            'title_color'
        ]

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only = True)
    custom = CustomResultSerializer(many=False, read_only=True)
    class Meta:
        model = Profile
        fields = '__all__'

class ProfileResultSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only = True)
    custom = CustomResultSerializer(many=False, read_only=True)
    class Meta:
        model = Profile
        fields = [
            'id',
            'user',
            'custom'
        ]

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields='__all__'

class CustomizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Custom
        fields="__all__"