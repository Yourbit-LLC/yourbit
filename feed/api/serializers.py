from rest_framework import serializers
from ..models import *

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class InteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InteractionHistory
        fields='__all__'
