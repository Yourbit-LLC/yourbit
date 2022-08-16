from django.dispatch import receiver
from django.db.models.signals import post_save
from YourbitAccounts.models import Account as User
from .models import Profile, Customizations, Feed

def create_profile(sender, instance, created, **kwargs):
    if created:
        user_profile = Profile(user=instance)
        user_profile.save()
        customizations = Customizations(profile=user_profile)
        customizations.save()
        user_profile.follows.set([instance.profile.id])
        user_profile.save()

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        user_profile = Profile(user=instance)
        user_profile.save()
        customizations = Customizations(profile=user_profile)
        feed = Feed(profile=user_profile)
        customizations.save()
        feed.save()
        user_profile.follows.add(instance.profile)
        user_profile.save()