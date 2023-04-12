from rest_framework import serializers
from ..models import *
import pytz
from datetime import datetime


class CommentSerializer(serializers.ModelSerializer):
    from user_profile.api.serializers import UserSerializer, CustomResultSerializer
    
    user = UserSerializer(many=False, read_only = True)
    custom = CustomResultSerializer(many = False, read_only = True)
    #time =  serializers.DateTimeField(format="%B %d, %Y / @%I:%M %p")
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        user_tz_str = self.context.get('user_tz')
        print("\n\n\n"+user_tz_str+"\n\n\n")
        this_time = instance.time
        user_tz = pytz.timezone(user_tz_str)
        if user_tz:
            created_at = this_time.astimezone(user_tz)
            ret['time'] = created_at.strftime("%B %d, %Y / @%I:%M %p")
        return ret
    
    class Meta:
        model = Comment
        fields = '__all__'

class InteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InteractionHistory
        fields='__all__'
