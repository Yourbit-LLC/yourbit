from rest_framework import viewsets
from rest_framework.response import Response
from settings.models import *
from .serializers import *

class FeedSettingsViewSet(viewsets.ModelViewSet):

    def get_queryset(self):
        
        return FeedSettings.objects.filter(settings=MySettings.objects.get(user=self.request.user))
    
    def list(self, request, *args, **kwargs):
        feed_settings = self.get_queryset()
        serializer = FeedSettingsSerializer(feed_settings, many=False)
        return Response(serializer.data)