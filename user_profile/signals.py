from django.dispatch import receiver
from django.db.models.signals import post_save
from YourbitAccounts.models import Account as User
from settings.models import MySettings, FeedSettings, PrivacySettings
from user_profile.models import Custom, Profile, Bit
from main.models import TaskManager
from feed.models import InteractionHistory
from rewards.models import Rewards


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
        rewards = Rewards(user=instance)
        rewards.save()
        history = InteractionHistory(user=instance, profile=user_profile)
        history.save()
        custom = Custom(profile=user_profile)
        custom.save()
        task_manager = TaskManager(user = instance)
        task_manager.save()
        user_profile.follows.add(instance.profile)
        user_profile.save()

# @receiver(post_save, sender=Bit)
# def update_feeds(sender, instance, created, **kwargs):
#     user_profile = instance.profile
#     # followers = Profile.objects.prefetch_related("interaction_history").filter( = user_profile)
#     friends_list = user_profile.connections.all()
#     friends = Profile.objects.filter(profile__in = friends_list)

#     # for follower in followers:
#     #     interaction_history = follower.interactions
#     #     interaction_history.unfed_bits.add(instance)
#     #     interaction_history.unseen_bits.add(instance)

#     for friend in friends:
#         friend_user = friend.user
#         interaction_history = friend_user.interaction_history
#         interaction_history.unfed_bits.add(instance)
#         interaction_history.unseen_bits.add(instance)


