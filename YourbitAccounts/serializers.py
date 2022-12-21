from rest_framework import serializers
from .models import Account as User

class UserSerializer(serializers.ModelSerializer):

    class Meta: 
        model = User
        fields = ['first_name', 'last_name', 'username']