from django.contrib import admin

from social.models import Comment, Feed, Customizations, Bit, Profile, Notification

# Register your models here.
admin.site.register(Bit)
admin.site.register(Profile)
admin.site.register(Comment)
admin.site.register(Notification)
admin.site.register(Customizations)
admin.site.register(Feed)