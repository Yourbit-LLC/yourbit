# serializers.py
from rest_framework import serializers
from yb_video.models import Video

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'video', 'ext_id', 'thumbnail', 'uploaded', 'modified', 'user']