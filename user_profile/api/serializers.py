from rest_framework import serializers
from YourbitAccounts.api.serializers import UserSerializer, UserResultSerializer
from ..models import *
import pytz
from datetime import datetime

class CustomBitSerializer(serializers.ModelSerializer):

    class Meta:
        model = Custom
        fields = [
            'image',
            'image_thumbnail_large',
            'image_thumbnail_small',
            'primary_color', 
            'accent_color',
            'title_color', 
            'text_color',
            'feedback_icon_color',
            'feedback_background_color',
            'paragraph_align',

        ]
class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields='__all__'

class BitIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bit
        fields = [
            'id',
        ]
class BitSerializer(serializers.ModelSerializer):
    user = UserResultSerializer(many=False, read_only = True)
    custom = CustomBitSerializer(many = False, read_only = True)
    photos = PhotoSerializer(many=True, read_only=True)
    # time =  serializers.DateTimeField(format="%B %d, %Y / @%I:%M %p")
    
    class Meta:
        model = Bit
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        user_tz_str = self.context.get('user_tz')
        this_time = instance.time
        user_tz = pytz.timezone(user_tz_str)
        if user_tz:
            created_at = this_time.astimezone(user_tz)
            ret['time'] = created_at.strftime("%B %d, %Y / @%I:%M %p")
        return ret

class CustomResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Custom
        fields = [
            'image',
            'image_thumbnail_large',
            'image_thumbnail_small',
            'primary_color',
            'accent_color',
            'title_color'
        ]

class ProfileSerializer(serializers.ModelSerializer):
    user = UserResultSerializer(many=False, read_only = True)
    custom = CustomResultSerializer(many=False, read_only=True)
    class Meta:
        model = Profile
        fields = '__all__'

class ProfileResultSerializer(serializers.ModelSerializer):
    user = UserResultSerializer(many=False, read_only = True)
    custom = CustomResultSerializer(many=False, read_only=True)
    class Meta:
        model = Profile
        fields = [
            'id',
            'user',
            'custom'
        ]


class CustomizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Custom
        fields="__all__"