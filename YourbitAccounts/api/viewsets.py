from django.shortcuts import get_object_or_404
from YourbitAccounts.models import Account as User
from rest_framework import viewsets
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    def list(self, request):
        self.queryset = User.objects.all()
        serializer = UserSerializer(self.queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        self.queryset = User.objects.all()
        self.user = get_object_or_404(self.queryset, pk=pk)
        serializer = UserSerializer(self.user, many=False)
        return Response(serializer.data)
    

