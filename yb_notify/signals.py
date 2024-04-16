from django.dispatch import receiver
from django.db.models.signals import post_save
from yb_accounts.models import Account as User
from yb_messages.models import Message
from yb_notify.models import Notification
from yb_bits.models import BitLike, BitComment
from yb_profile.models import FriendRequest
from yb_notify.models import NotificationCore
from webpush import send_user_notification

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
            if member != instance.user:
                notification = Notification(
                    to_user = member.display_name,
                    body = instance.body,
                    type = 6,
                    link = "/messages/" + str(conversation.id),
                    profile = instance.user.profile,
                    conversation = conversation,
                    title = "New Message",
                    notify_class = 1

                )

                notification.save()

                addToCore(notification, member)

                #Send Push Notification
                payload = {"head": "New Message", "body": instance.body, "icon": "/static/images/2023-logo-draft.png"}
                send_user_notification(user=member, payload=payload, ttl=1000)

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
            title = "New Like",
            notify_class = 2


        )
        notification.save()

        addToCore(notification, bit.profile)

        #Send Push Notification
        # payload = {"head": "New Like", "body": instance.user.username + " has liked your bit", "icon": "/static/images/2023-logo-draft.png"}
        # send_user_notification(user=bit.profile.user, payload=payload, ttl=1000)

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
            title = "New Comment",
            notify_class = 2
        )
        notification.save()

        addToCore(notification, bit.profile)

        #Send Push Notification
        # payload = {"head": "New Comment", "body": instance.user.username + " has commented on your bit", "icon": "/static/images/2023-logo-draft.png"}
        # send_user_notification(user=bit.profile.user, payload=payload, ttl=1000)


#Create a notification on friend request
@receiver(post_save, sender=FriendRequest)
def create_friend_request_notification(sender, instance, created, **kwargs):
    if created:
        notification = Notification(
            to_user = instance.to_user,
            from_user = instance.from_user,
            body = instance.from_user.user.username + " has sent you a friend request",
            type = 4,
            link = "/profile/" + str(instance.from_user.user.username),
            title = "New Friend Request",
            notify_class = 0,
            friend_request = instance
        )

        notification.save()

        addToCore(notification, instance.to_user)

        #Send Push Notification
        # payload = {"head": "New Friend Request", "body": instance.from_user.user.username + " has sent you a friend request", "icon": "/static/images/2023-logo-draft.png"}
        # send_user_notification(user=instance.to_user.user, payload=payload, ttl=1000)

#Create a notification on friend request acceptance
@receiver(post_save, sender=FriendRequest)
def create_friend_accept_notification(sender, instance, created, **kwargs):
    if instance.accepted:
        notification = Notification(
            to_user = instance.from_user,
            from_user = instance.to_user,
            body = instance.to_user.user.username + " has accepted your friend request",
            type = 5,
            link = "/profile/" + str(instance.to_user.user.username),
            title = "Friend Request Accepted",
            notify_class = 0,
            friend_request = instance
        )

        notification.save()

        addToCore(notification, instance.from_user)

        #Send Push Notification
        # payload = {"head": "Friend Request Accepted", "body": instance.to_user.user.username + " has accepted your friend request", "icon": "/static/images/2023-logo-draft.png"}
        # send_user_notification(user=instance.from_user.user, payload=payload, ttl=1000)



