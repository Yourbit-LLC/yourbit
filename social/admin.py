from django.contrib import admin

from social.models import Comment, Feed, Bit, Profile, Notification, PrivacySettings

# Register your models here.
admin.site.register(Bit)
admin.site.register(Profile)
admin.site.register(Comment)
admin.site.register(Notification)
admin.site.register(Feed)
admin.site.register(PrivacySettings)