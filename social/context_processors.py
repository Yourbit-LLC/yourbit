from .models import *
from .forms import *
from django.urls import reverse
from django.contrib.auth import authenticate, login

def CoreUI(request):
    bit_form = BitForm()
    search_bar = SearchBar()
    return {'bit_form': bit_form, 'search_bar': search_bar}

def FeedUI(request):
    if request.user.is_authenticated:
        write_comment = CommentForm()
        profile = Profile.objects.get(user=request.user)

        notifications = Notification.objects.filter(to_user = profile)
        notification_length = len(notifications)
        liked_bits = profile.liked_bits.all()
        disliked_bits = profile.disliked_bits.all()
        friends = profile.connections.all()        
        friend_pool = []
        for friend in friends:
            friend_pool.append(friend.user)   
        friend_pool.append(request.user) 
        global_bit_pool = Bit.objects.filter(user__in = friend_pool).order_by('-created_at')
        chat_bit_pool = Bit.objects.filter(user__in = friend_pool, bit_type = 'chat').order_by('-created_at')
        photo_bit_pool = Bit.objects.filter(user__in = friend_pool, bit_type='photo').order_by('-created_at')
        video_bit_pool = Bit.objects.filter(user__in = friend_pool, bit_type = 'video').order_by('-created_at')
        return {
            'write_comment':write_comment,
            'notification_length':notification_length ,
            'liked_bits':liked_bits,
            'disliked_bits': disliked_bits,
            'global_bit_pool': global_bit_pool,
            'chat_bit_pool': chat_bit_pool,
            'photo_bit_pool':photo_bit_pool,
            'video_bit_pool': video_bit_pool,
            'friends':friends,
            'friend_pool':friend_pool,
            'notifications':notifications,
        }
    else:
        return {}

def Customization(request):
    if request.user.is_authenticated:
        custom = Profile.objects.get(user=request.user)
        user_image = custom.image

        #UI Settings
        accent_color = custom.accent_color
        icon_color = custom.icon_color
        feedback_icon_color = custom.feedback_icon_color
        background_color = custom.background_color

        #Community customization
        bit_background = custom.bit_background
        title_color = custom.title_color
        text_color = custom.text_color

        #Quick Appearance
        wallpaper_on = custom.wallpaper_on
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

        }


    else:
        return {}
