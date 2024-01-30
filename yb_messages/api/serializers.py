from rest_framework import serializers
from yb_messages.models import *
from yb_accounts.models import Account as User
import pytz

class MessageCoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageCore
        fields = '__all__'

class OneToOneConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OneToOneConversation
        fields = '__all__'

class GroupConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupConversation
        fields = '__all__'

class OneToOneMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = OneToOneMessage
        fields = '__all__'

class GroupMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMessage
        fields = '__all__'
        