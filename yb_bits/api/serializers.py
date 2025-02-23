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
    title = serializers.SerializerMethodField()

    photos = PhotoSerializer(many=True, read_only = True)
    video_upload = VideoSerializer(many=False, read_only = True)
    
    time =  serializers.DateTimeField(format="%B %d, %Y / @%I:%M %p")

    class Meta:
        model = Bit
        fields = [
            'id',
            'profile',
            'display_name',
            'custom',
            'title',
            'body',
            'photos',
            'video_upload',
            'time',
            'type',
            'like_count',
            'dislike_count',
            'share_count',
            'comment_count',
            'is_liked',
            'is_disliked',
            'watch_count',
            'is_public',
            'is_tips'

        ]
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
            if request.user.is_authenticated:
                this_profile = Profile.objects.get(username=request.user.active_profile)
                return obj.likes.filter(profile=this_profile).exists()
        return False
    
    def get_is_disliked(self, obj):
        request = self.context.get('request')
        if request and request.user:
            if request.user.is_authenticated:
                this_profile = Profile.objects.get(username=request.user.active_profile)
                return obj.dislikes.filter(profile=this_profile).exists()
        return False
    
    def get_body(self, obj):
        #Get with line breaks
        if obj.is_public:
            return obj.public_body.replace('\n', '<br>')
        else:
            return obj.decrypted_body.replace('\n', '<br>')
        
    def get_title(self, obj):
        if obj.is_public:
            return obj.public_title
        else:
            return obj.decrypted_title
        
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        user_tz_str = self.context.get('user_tz')
        print("This timezone: " + user_tz_str)
        this_time = instance.time
        user_tz = pytz.timezone(user_tz_str)
        if user_tz:
            created_at = this_time.astimezone(user_tz)
            ret['time'] = created_at.strftime("%B %d, %Y / @%I:%M %p")
        return ret

class CreateBitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bit
        fields = ['is_public', 'profile', 'user', 'custom', 'time', 'type']

    def create(self, validated_data):
        """
        Overriding the create method to store body/title in 
        protected or public fields based on `is_public`
        """
        is_public = validated_data.get("is_public", False)  # Default to private if not provided
        title = validated_data.pop("title", "")
        body = validated_data.pop("body", "")

        if is_public:
            validated_data["public_title"] = title
            validated_data["public_body"] = body
            validated_data["protected_title"] = None  # Ensure protected fields are empty
            validated_data["protected_body"] = None
        else:
            validated_data["protected_title"] = title
            validated_data["protected_body"] = body
            validated_data["public_title"] = ""  # Ensure public fields are empty
            validated_data["public_body"] = ""

        return Bit.objects.create(**validated_data)

    def update(self, instance, validated_data):
        is_public = validated_data.get("is_public", instance.is_public)  # Keep existing setting if not provided
        title = validated_data.pop("title", instance.public_title if is_public else instance.protected_title)
        body = validated_data.pop("body", instance.public_body if is_public else instance.protected_body)

        if is_public:
            instance.public_title = title
            instance.public_body = body
            instance.protected_title = None
            instance.protected_body = None
        else:
            instance.protected_title = title
            instance.protected_body = body
            instance.public_title = ""
            instance.public_body = ""

        instance.save()
        return instance

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
    profile = ProfileResultSerializer(read_only=True)

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