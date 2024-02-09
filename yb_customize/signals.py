
from django.dispatch import Signal
from django.dispatch import receiver
from django.db.models.signals import post_save, pre_save
from yb_profile.models import Profile, CommunityProfile
from yb_customize.models import *

# Define your signals here
@receiver(post_save, sender=Profile)
def create_profile(sender, instance, created, **kwargs):
    if created:
        theme = Theme(name="", author = instance.user)
        theme.save()
        
        #Create Custom Core Object which contains all settings for handling customizations
        custom = CustomCore(user_profile=instance)
        custom.theme = theme
        custom.save()
        
        #Create custom page object for customizations to profile page
        custom_page = CustomPage(custom=custom)
        custom_page.save()

        #Create custom menu object for customizations to profile menu
        custom_menu = CustomMenu(custom=custom)
        custom_menu.save()

        #Create custom ui object for customizations to profile ui
        custom_ui = CustomUI(custom=custom)
        custom_ui.save()

        #Create custom splash object for customizations to profile splash
        custom_colors = CustomSplash(custom=custom)
        custom_colors.save()

        #Create custom bit object for customizations to bits
        custom_bit = CustomBit(custom=custom)
        custom_bit.save()


# Define your signals here
@receiver(post_save, sender=CommunityProfile)
def create_profile(sender, instance, created, **kwargs):
    if created:
        theme = Theme(name="", author = instance.user)
        theme.save()
        
        custom = CustomCore(community_profile=instance)
        custom.theme = theme
        custom.save()
        
        custom_page = CustomPage(custom=custom)
        custom_page.save()

        custom_menu = CustomMenu(custom=custom)
        custom_menu.save()

        custom_ui = CustomUI(custom=custom)
        custom_ui.save()

        custom_colors = CustomSplash(custom=custom)
        custom_colors.save()

        custom_bit = CustomBit(custom=custom)
        custom_bit.save()
