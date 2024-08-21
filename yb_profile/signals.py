from django.dispatch import receiver
from django.db.models.signals import post_save
from yb_accounts.models import Account as User
from yb_settings.models import MySettings, FeedSettings, PrivacySettings, NotificationSettings
from yb_profile.models import Profile, ProfileInfo
from yb_systems.models import TaskManager
from yb_rewards.models import Rewards
from yb_customize.models import CustomCore, Theme, CustomUI, CustomBit
from yb_notify.models import NotificationCore
from yb_bits.models import InteractionHistory, Bit, BitStream
from yb_photo.models import Photo, Wallpaper
from yb_messages.models import MessageCore
from django.templatetags.static import static

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
        default_display_name = instance.first_name + " " + instance.last_name
        #Initialize User Profile to act as parent for all user data
        user_profile = Profile(user=instance, username = instance.username, display_name = default_display_name)
        user_profile.save()

        #Initialize User Settings Modules
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

        message_core = MessageCore(profile = user_profile)
        message_core.save()

                #Initialize Task Manager for user continuity
        task_manager = TaskManager(user = instance)
        task_manager.save()

        #Initialize Notification Core for managing user notifications
        notification_core = NotificationCore(profile = user_profile)
        notification_core.save()
        user_profile.save()

        bitstream = BitStream(user = instance, profile = user_profile)
        bitstream.save()

        #Initialize Customization Modules
        from yb_photo.utility import process_image
        custom_core = CustomCore(profile=user_profile)

        try:
            default_profile_image = process_image(instance, static("images/main/default-profile-image.png"), static("images/main/default-profile-image.png"), False)
        except:
            default_profile_image = Photo.objects.get(pk=36)
        #Set the image and image thumbnail fields to static file for default_profile_image.png
        
        custom_core.profile_image = default_profile_image
        default_wallpaper = Wallpaper(profile = user_profile)
        default_wallpaper.save()
        custom_core.wallpaper = default_wallpaper
        default_theme = Theme(name = "Default", author = instance)
        default_theme.save()
        custom_core.theme = default_theme
        custom_core.save()

        custom_ui = CustomUI(theme=default_theme)
        custom_ui.save()

        custom_bit = CustomBit(theme=default_theme, images = custom_core)
        custom_bit.save()


@receiver(post_save, sender=Bit)
def update_feeds(sender, instance, created, **kwargs):
    user_profile = instance.profile
    followers_list = user_profile.followers.all()
    followers = BitStream.objects.filter(profile__in = followers_list)
    friends_list = user_profile.friends.all()
    friends = BitStream.objects.filter(profile__in = friends_list)

    if len(followers) > 0:

        for follower in followers:
            this_interaction_history = InteractionHistory.objects.get(profile = follower.profile)
            this_interaction_history.add(instance)
            follower.unseen_bits.add(instance)

    if len(friends) > 0:
        for friend in friends:
            this_interaction_history = InteractionHistory.objects.get(profile = friend.profile)
            this_interaction_history.unfed_bits.add(instance)
            friend.unseen_bits.add(instance)
