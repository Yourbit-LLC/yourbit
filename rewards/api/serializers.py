from rest_framework import serializers
from ..models import *

class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model=Rewards
        fields = '__all__'