from django.contrib import admin

from social.models import Comment, Feed, Customizations, Bit, Profile, ConnectRequest

# Register your models here.
admin.site.register(Bit)
admin.site.register(Profile)
admin.site.register(Comment)
admin.site.register(ConnectRequest)
admin.site.register(Customizations)
admin.site.register(Feed)