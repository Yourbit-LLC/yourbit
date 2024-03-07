from django.dispatch import receiver
from django.db.models.signals import post_save
from yb_accounts.models import Account as User
from yb_messages.models import Message 
from yb_notify.models import Notification
from yb_bits.models import BitLike, BitComment
from yb_profile.models import FriendRequest
from yb_notify.models import NotificationCore

#Create a notification on creation of message

def addToCore(notification, profile):
    notification_core = NotificationCore.objects.get(profile = profile)
    notification_core.unseen_notifications.add(notification)
    notification_core.save()

@receiver(post_save, sender=Message)
def create_message_notification(sender, instance, created, **kwargs):
    if created:
        conversation = instance.conversation
        members = conversation.members.all()
        for member in members:
            if member != instance.profile.user:
                notification = Notification(
                    to_user = member.display_name,
                    body = instance.body,
                    type = 6,
                    link = "/messages/" + str(conversation.id),
                    profile = instance.profile,
                    conversation = conversation
                )

                notification.save()

                addToCore(notification, member)

#Create a notification on like of a bit
@receiver(post_save, sender=BitLike)
def create_bit_like_notification(sender, instance, created, **kwargs):
    if created:
        bit = instance.bit
        notification = Notification(
            to_user = bit.profile,
            body = instance.user.username + " has liked your bit",
            type = 1,
            link = "/bits/" + str(bit.id),
            profile = bit.profile
        )
        notification.save()

        addToCore(notification, bit.profile)

#Create a notification on creation of bit comment
@receiver(post_save, sender=BitComment)
def create_bit_comment_notification(sender, instance, created, **kwargs):
    if created:
        bit = instance.bit
        notification = Notification(
            to_user = bit.profile,
            body = instance.user.username + " has commented on your bit",
            type = 2,
            link = "/bits/" + str(bit.id),
            profile = bit.profile
        )
        notification.save()

        addToCore(notification, bit.profile)

#Create a notification on friend request
@receiver(post_save, sender=FriendRequest)
def create_friend_request_notification(sender, instance, created, **kwargs):
    if created:
        notification = Notification(
            to_user = instance.to_user,
            body = instance.from_user.user.username + " has sent you a friend request",
            type = 5,
            link = "/profile/" + str(instance.from_user.user.username),
        )

        notification.save()

        addToCore(notification, instance.to_user)

#Create a notification on friend request acceptance
@receiver(post_save, sender=FriendRequest)
def create_friend_accept_notification(sender, instance, created, **kwargs):
    if instance.accepted:
        notification = Notification(
            to_user = instance.from_user,
            body = instance.to_user.user.username + " has accepted your friend request",
            type = 5,
            link = "/profile/" + str(instance.to_user.user.username),
            profile = instance.from_user
        )

        notification.save()

        addToCore(notification, instance.from_user)

