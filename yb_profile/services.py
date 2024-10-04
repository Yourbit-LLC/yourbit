from yb_settings.models import *
from yb_rewards.models import *
from yb_messages.models import MessageCore
from yb_systems.models import TaskManager
from yb_customize.models import *
from main.models import UserSession
from yb_profile.models import *
from yb_bits.models import InteractionHistory
from yb_notify.models import NotificationCore
from yb_photo.models import Wallpaper, Photo
from django.templatetags.static import static


def initialize_orbit(request, orbit):
        #Initialize User Settings Modules
        settings = MySettings(orbit=orbit)
        feed = FeedSettings(settings=settings)
        feed.save()
        privacy = PrivacySettings(settings = settings)
        privacy.save()
        notifications = NotificationSettings(settings = settings)
        notifications.save()
        history = InteractionHistory(orbit=orbit)
        history.save()
        profile_info = OrbitInfo(orbit=orbit)
        profile_info.save()

        message_core = MessageCore(orbit = orbit)
        message_core.save()

        #Initialize Task Manager for user continuity
        task_manager = TaskManager(orbit = orbit)
        task_manager.save()

        #Initialize Notification Core for managing user notifications
        notification_core = NotificationCore(orbit = orbit)
        notification_core.save()

        
        #Initialize Customization Modules
        from yb_photo.utility import process_image
        custom_core = CustomCore(orbit=orbit)

        try:
            default_profile_image = process_image(orbit, static("images/main/default-profile-image.png"), static("images/main/default-profile-image.png"), False)
        except:
            default_profile_image = Photo.objects.get(pk=36)
        #Set the image and image thumbnail fields to static file for default_profile_image.png
        
        custom_core.profile_image = default_profile_image
        default_wallpaper = Wallpaper(orbit = orbit)
        default_wallpaper.save()
        custom_core.wallpaper = default_wallpaper
        default_theme = Theme(name = "Default", author = request.user)
        default_theme.save()
        custom_core.theme = default_theme
        custom_core.save()

        custom_ui = CustomUI(theme=default_theme)
        custom_ui.save()

        custom_bit = CustomBit(theme=default_theme, images = custom_core)
        custom_bit.save()

        custom_splash = CustomSplash(theme=default_theme)
        custom_splash.save()

 
