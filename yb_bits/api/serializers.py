#Serializers define the API representation.

# Path: bits\api\serializers.py

from rest_framework import serializers
from yb_bits.models import *
from yb_photo.api.serializers import PhotoSerializer
from yb_video.api.serializers import VideoSerializer
from yb_accounts.models import Account as User
import pytz
from django.utils.timezone import make_aware, get_default_timezone

from yb_accounts.api.serializers import UserSerializer
from yb_profile.api.serializers import ProfileResultSerializer

# serializers.py
class BitSerializer(serializers.ModelSerializer):
    from yb_accounts.api.serializers import UserBitSerializer
    from yb_customize.api.serializers import CustomBitSerializer
    from yb_photo.api.serializers import PhotoSerializer
    
    user = UserBitSerializer(read_only=True)
    profile = ProfileResultSerializer(read_only=True)
    custom = CustomBitSerializer(read_only=True)
    
    # Custom serializer fields for counts
    like_count = serializers.SerializerMethodField()
    dislike_count = serializers.SerializerMethodField()
    share_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_disliked = serializers.SerializerMethodField()

    body = serializers.SerializerMethodField()

    photos = PhotoSerializer(many=True, read_only = True)
    video_upload = VideoSerializer(many=False, read_only = True)
    
    time =  serializers.DateTimeField(format="%B %d, %Y / @%I:%M %p")

    class Meta:
        model = Bit
        fields = '__all__'
        read_only_fields = [
            'id', 
            'user', 
            'time', 
            'like_count', 
            'dislike_count', 
            'share_count', 
            'comment_count',
            'is_liked',
            'watch_count',
        ]

    # Methods to calculate counts
    def get_like_count(self, obj):
        return obj.likes.count()

    def get_dislike_count(self, obj):
        return obj.dislikes.count()

    def get_share_count(self, obj):
        return obj.shares.count()

    def get_comment_count(self, obj):
        return obj.comments.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user:
            return obj.likes.filter(user=request.user).exists()
        return False
    
    def get_is_disliked(self, obj):
        request = self.context.get('request')
        if request and request.user:
            return obj.dislikes.filter(user=request.user).exists()
        return False
    
    def get_body(self, obj):
        #Get with line breaks
        return obj.body.replace('\n', '<br>')
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        user_tz_str = self.context.get('user_tz')
        this_time = instance.time
        user_tz = pytz.timezone(user_tz_str)
        if user_tz:
            created_at = this_time.astimezone(user_tz)
            ret['time'] = created_at.strftime("%B %d, %Y / @%I:%M %p")
        return ret

class CreateBitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bit
        fields = '__all__'


class BitStickerSerializer(serializers.ModelSerializer):

    class Meta:
        model = BitSticker
        fields = '__all__'


class BitLikeSerializer(serializers.ModelSerializer):

    class Meta:
        model = BitLike
        fields = '__all__'

class BitDislikeSerializer(serializers.ModelSerializer):

    class Meta:
        model = BitDislike
        fields = '__all__'


    
class ClusterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cluster
        fields = '__all__'



class BitCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    time = serializers.DateTimeField(format="%B %d, %Y @%I:%M %p", required=False)

    class Meta:
        model = BitComment
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        user_tz_str = self.context.get('user_tz', None)
        
        if not self.context.get('is_creating', False):
            # Ensure instance.time is timezone-aware
            this_time = instance.time
            if this_time and not this_time.tzinfo:
                # If this_time is naive, make it aware with the default timezone
                this_time = make_aware(this_time, get_default_timezone())

            # Convert time to user's timezone if valid, else use default timezone
            try:
                user_tz = pytz.timezone(user_tz_str) if user_tz_str else get_default_timezone()
                created_at = this_time.astimezone(user_tz)
                print(created_at.strftime("%B %d, %Y @ %I:%M %p"))
                ret['time'] = created_at.strftime("%B %d, %Y @ %I:%M %p")
                
            except pytz.UnknownTimeZoneError:
                # Handle unknown timezone by using a default or logging an error
                # For now, let's just use the default timezone
                #print error
                print('Unknown timezone error')
                ret['time'] = this_time.strftime("%B %d, %Y @ %I:%M %p")

        return ret

    def create(self, validated_data):
        # Set the context to indicate creation
        self.context['is_creating'] = True
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Set the context to indicate updating
        self.context['is_creating'] = False
        return super().update(instance, validated_data)