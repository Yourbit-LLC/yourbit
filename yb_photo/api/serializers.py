#Serializers.py
from rest_framework import serializers
from yb_photo.models import *
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import update_last_login
from django.utils import timezone


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ['image', 'tiny_thumbnail', 'small_thumbnail', 'medium_thumbnail', 'large_thumbnail']

        
class PhotoStickerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhotoSticker
        fields = '__all__'