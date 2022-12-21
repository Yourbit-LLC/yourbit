from rest_framework import viewsets
from rest_framework.response import Response
from ..models import Community
from .serializers import CommunitySerializer

class CommunityViewSet(viewsets.ViewSet):
    def get_queryset(self, request):
        pass
    def list(self, request):
        queryset = Community.objects.all()

        serializer_class = CommunitySerializer(queryset, many=True)
        return Response(serializer_class.data)

    def retrieve(self, request, pk=None):

        this_community = Community.objects.get(pk=pk)
        
        serializer_class = CommunitySerializer(this_community, many=False)

        return Response(serializer_class.data)

    def destroy(self, request, pk=None):
        this_community = Community.objects.get(pk=pk)
        this_community.delete()

        return Response('Community was deleted')
    