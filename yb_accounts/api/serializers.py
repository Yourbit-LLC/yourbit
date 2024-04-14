from rest_framework import serializers
from ..models import Account as User

class UserSerializer(serializers.ModelSerializer):

    class Meta: 
        model = User
        fields = ['id','first_name', 'last_name', 'username', 'email', 'phone_number', 'dob', 'date_joined', 'last_login', 'is_admin', 'is_staff', 'is_supervisor', 'is_voter', 'is_council', 'email_confirmed', 'phone_number_verified', 'terms_accepted', 'privacy_accepted']

class UserBitSerializer(serializers.ModelSerializer):

    class Meta: 
        model = User
        fields = ['username']

class UserResultSerializer(serializers.ModelSerializer):

    class Meta: 
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'is_admin']