
from django.urls import reverse
from django.contrib.auth import authenticate, login
from user_profile.forms import BitForm
from search.forms import SearchBar
from user_profile.models import Profile, Custom

def CoreUI(request):
    bit_form = BitForm()
    search_bar = SearchBar()
    return {'bit_form': bit_form, 'search_bar': search_bar}

def Customization(request):
    if request.user.is_authenticated:
        profile = Profile.objects.get(user=request.user)
        custom = Custom.objects.get(profile=profile)
        user_image = custom.image

        #UI Settings
        accent_color = custom.accent_color
        icon_color = custom.icon_color
        feedback_icon_color = custom.feedback_icon_color
        background_color = custom.background_color
        feedback_background_color = custom.feedback_background_color

        #Community customization
        bit_background = custom.primary_color
        title_color = custom.title_color
        text_color = custom.text_color
        

        #Quick Appearance
        wallpaper_on = custom.wallpaper_on
        if wallpaper_on:
            wallpaper = custom.background_image
        user_colors_on = custom.user_colors_on
        default_theme_on = custom.default_theme_on
        return {
            'wallpaper_on': wallpaper_on,
            'user_image': user_image,
            'accent_color':accent_color,
            'icon_color':icon_color,
            'feedback_icon_color':feedback_icon_color,
            'background_color':background_color,
            'bit_background' : bit_background,
            'title_color':title_color,
            'text_color':text_color,
            'user_colors_on':user_colors_on,
            'default_theme_on':default_theme_on,
            'feedback_background_color':feedback_background_color,
            'user_wallpaper':wallpaper,

        }


    else:
        return {}
