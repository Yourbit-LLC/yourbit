# serializers.py
from rest_framework import serializers
from yb_video.models import Video
from yb_photo.models import VideoThumbnail
from yb_photo.api.serializers import VideoThumbnailSerializer

class VideoSerializer(serializers.ModelSerializer):
    thumbnail = VideoThumbnailSerializer(many=False, read_only = True)
    class Meta:
        model = Video
        fields = ['id', 'video', 'ext_id', 'thumbnail', 'uploaded', 'modified', 'user']