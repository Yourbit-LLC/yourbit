
from feed.forms import CommentForm
from feed.models import InteractionHistory
from user_profile.models import Profile, Bit
from notifications.models import Notification


def FeedUI(request):
    if request.user.is_authenticated:
        write_comment = CommentForm()
        profile = Profile.objects.get(user=request.user)
        interactions = InteractionHistory.objects.get(profile=profile)

        notifications = Notification.objects.filter(to_user = request.user)
        notification_length = len(notifications)
        liked_bits = interactions.liked_bits.all()
        disliked_bits = interactions.disliked_bits.all()
        friends = profile.connections.all()        
        friend_pool = []
        for friend in friends:
            friend_pool.append(friend.user)   
        friend_pool.append(request.user) 
        global_bit_pool = Bit.objects.filter(user__in = friend_pool).order_by('-time')
        chat_bit_pool = Bit.objects.filter(user__in = friend_pool, type = 'chat').order_by('-time')
        photo_bit_pool = Bit.objects.filter(user__in = friend_pool, type='photo').order_by('-time')
        video_bit_pool = Bit.objects.filter(user__in = friend_pool, type = 'video').order_by('-time')
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