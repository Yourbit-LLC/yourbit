from django.contrib import admin
from .models import Conversation, MessageCore
# Register your models here.

admin.site.register(Conversation)
admin.site.register(MessageCore)