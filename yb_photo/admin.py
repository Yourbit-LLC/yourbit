from django.contrib import admin
from .models import Photo, Wallpaper
from django.contrib.auth.admin import UserAdmin

# Register your models here.


class PhotoAdmin(UserAdmin):
    list_display = ('id', 'profile.username')
    search_fields = ('profile.username')

    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()

admin.site.register(Photo)
admin.site.register(Wallpaper)