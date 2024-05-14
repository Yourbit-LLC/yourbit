
from django.urls import reverse
from django.contrib.auth import authenticate, login
from yb_settings.models import MySettings

# def CoreUI(request):
#     bit_form = BitForm()
#     search_bar = SearchBar()
#     settings = None
#     default_public = False
    
#     if request.user.is_authenticated:
#         settings = MySettings.objects.get(profile=request.user.profile)
#         default_public = settings.privacy.default_public
    
#     return {
#         'bit_form': bit_form, 
#         'search_bar': search_bar,
#         'default_public': default_public,
#         'settings': settings
#         }

def Customization(request):
    from yb_profile.models import Profile
    from yb_customize.models import CustomCore, CustomBit
    if request.user.is_authenticated:
        profile = Profile.objects.get(user=request.user)
        custom = CustomCore.objects.get(profile=profile)

        theme = custom.theme
        
        profile_image_object = custom.profile_image
        profile_image = profile_image_object.image
        profile_thumbnail_small = profile_image_object.small_thumbnail.url
        profile_thumbnail_medium = profile_image_object.medium_thumbnail.url
        profile_thumbnail_large = profile_image_object.large_thumbnail.url

        display_name = profile.display_name
        username = profile.user.username
        
        wallpaper_object = custom.wallpaper
        wallpaper = wallpaper_object.background_image
        wallpaper_mobile = None
        wallpaper_desktop = None


        custom_bit = CustomBit.objects.get(theme=theme)

        return {
            'profile_image': profile_image,
            'profile_thumbnail_small': profile_thumbnail_small,
            'profile_thumbnail_medium': profile_thumbnail_medium,
            'profile_thumbnail_large': profile_thumbnail_large,
            'display_name': display_name,
            'username': username,
            'wallpaper': wallpaper,
            'wallpaper_mobile': wallpaper_mobile,
            'wallpaper_desktop': wallpaper_desktop,
            'custom_bit': custom_bit,
            'custom_core': custom

        }


    else:
        return {}
