from django.dispatch import receiver
from django.db.models.signals import post_save
from yb_accounts.models import Account as User
from yb_settings.models import MySettings, FeedSettings, PrivacySettings, NotificationSettings
from yb_profile.models import Profile, ProfileInfo
from yb_systems.models import TaskManager
from yb_rewards.models import Rewards
from yb_customize.models import CustomCore, Theme
from yb_notify.models import NotificationCore
from yb_bits.models import InteractionHistory, Bit, BitStream
from yb_photo.models import Photo, Wallpaper

# def create_profile(sender, instance, created, **kwargs):
#     if created:
#         user_profile = Profile(user=instance)
#         user_profile.save()
#         customizations = Customizations(profile=user_profile)
#         customizations.save()
#         user_profile.follows.set([instance.profile.id])
#         user_profile.save()

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        user_profile = Profile(user=instance)
        user_profile.save()
        settings = MySettings(user=instance, profile=user_profile)
        settings.save()
        feed = FeedSettings(settings=settings)
        feed.save()
        privacy = PrivacySettings(settings = settings)
        privacy.save()
        notifications = NotificationSettings(settings = settings)
        notifications.save()
        rewards = Rewards(user=instance)
        rewards.save()
        history = InteractionHistory(user=instance, profile=user_profile)
        history.save()
        profile_info = ProfileInfo(profile=user_profile)
        profile_info.save()
        custom_core = CustomCore(profile=user_profile)
        default_profile_image = Photo(profile = user_profile, is_community = False)
        default_profile_image.save()
        custom_core.profile_image = default_profile_image
        default_wallpaper = Wallpaper(profile = user_profile)
        default_wallpaper.save()
        custom_core.wallpaper = default_wallpaper
        custom_core.save()
        default_theme = Theme(name = "Default", author = instance)
        task_manager = TaskManager(user = instance)
        task_manager.save()
        notification_core = NotificationCore(profile = user_profile)
        notification_core.save()
        user_profile.save()

@receiver(post_save, sender=Bit)
def update_feeds(sender, instance, created, **kwargs):
    user_profile = instance.profile
    followers_list = user_profile.followers.all()
    followers = BitStream.objects.filter(profile__in = followers_list)
    friends_list = user_profile.friends.all()
    friends = BitStream.objects.filter(profile__in = friends_list)

    if len(followers) > 0:

        for follower in followers:
            
            follower.unfed_bits.add(instance)
            follower.unseen_bits.add(instance)

    if len(friends) > 0:
        for friend in friends:
            
            friend.unfed_bits.add(instance)
            friend.unseen_bits.add(instance)
