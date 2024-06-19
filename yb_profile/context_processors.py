
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
    from yb_customize.models import CustomCore, CustomBit, CustomUI
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
        
        wallpaper_enabled = custom.wallpaper_on
        wallpaper_object = custom.wallpaper
        wallpaper = wallpaper_object.background_image
        try:
            wallpaper_mobile = wallpaper_object.background_mobile
        except:
            wallpaper_mobile = None

        try:
            wallpaper_desktop = wallpaper_object.background_desktop
        except:
            wallpaper_desktop = None


        if custom.ui_colors_on:
            custom_ui = CustomUI.objects.get(theme=theme)

        else:
            custom_ui = None


        context = {
            'profile_image': profile_image,
            'profile_thumbnail_small': profile_thumbnail_small,
            'profile_thumbnail_medium': profile_thumbnail_medium,
            'profile_thumbnail_large': profile_thumbnail_large,
            'display_name': display_name,
            'username': username,
            'wallpaper': wallpaper,
            'wallpaper_mobile': wallpaper_mobile,
            'wallpaper_desktop': wallpaper_desktop,
            'custom_core': custom,
            'wallpaper_enabled': wallpaper_enabled,
            'custom_ui': custom_ui,
        }

        bit_colors_on = custom.bit_colors_on


        if bit_colors_on:
            custom_bit = CustomBit.objects.get(theme=theme)
            context['custom_bit'] = custom_bit

        return context

    else:
        return {}
