from django.contrib import admin
from .models import Conversation, MessageCore, Message
# Register your models here.

admin.site.register(Conversation)
admin.site.register(MessageCore)
admin.site.register(Message)