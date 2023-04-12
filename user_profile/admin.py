from django.contrib import admin
from user_profile.models import Profile, Bit, Photo, Custom, Cluster
# Register your models here.

admin.site.register(Profile)
admin.site.register(Bit)
admin.site.register(Photo)
admin.site.register(Custom)
admin.site.register(Cluster)