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
        friend_requests = ConnectRequest.objects.filter(to_user = request.user)
        customs = Customizations.objects.get(profile = profile)
        wallpaper_on = customs.wallpaper_on
        notification_length = len(friend_requests)
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
        user_image = profile.image.url
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
            'friend_requests':friend_requests,
            'wallpaper_on': wallpaper_on,

        }
    else:
        return {}

