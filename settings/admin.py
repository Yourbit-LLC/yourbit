from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(PrivacySettings)
admin.site.register(FeedSettings)
admin.site.register(NotificationSettings)