# serializers.py
from rest_framework import viewsets, generics
from yb_video.models import Video
from .serializers import VideoSerializer


class VideoUploadView(generics.CreateAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
