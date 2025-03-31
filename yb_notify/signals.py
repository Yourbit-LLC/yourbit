from django.dispatch import receiver
from django.db.models.signals import post_save
from yb_accounts.models import Account as User
from yb_messages.models import Message
from yb_notify.models import Notification, Announcement
from yb_bits.models import BitLike, BitComment
from yb_profile.models import FriendRequest, Profile
from yb_notify.models import NotificationCore
from webpush import send_user_notification

from yb_support.models import BugReport, FeatureRequest

#Create a notification on creation of message

def addToCore(notification, profile):
    notification_core = NotificationCore.objects.get(profile = profile)
    notification_core.unseen_notifications.add(notification)
    notification_core.save()

@receiver(post_save, sender=Announcement)
def create_announcement_notification(sender, instance, created, **kwargs):
    if created:
        
        for user in User.objects.all():
            user_profile = Profile.objects.get(username=user.active_profile)
            notification = Notification(
                from_user = Profile.objects.get(username = "achaney55"),
                to_user = user_profile,
                body = instance.body,
                type = 7,
                link = "/announcements/",
                title = instance.title,
                notify_class = 0
            )

            notification.save()

            addToCore(notification, user_profile)

            #Send Push Notification
            payload = {
                "title": instance.title, 
                "body": instance.body, 
                "icon": "/static/images/2023-logo-draft.png",
                'tag': 'yourbit',
                'actions': [
                    {
                        'action': 'open_url',
                        'title': 'Open Yourbit',
                        'icon': '/static/images/yourbit_logo.png'
                    }
                ],
                
                'url': '/notify/',
                
                
            }
            send_user_notification(user=user, payload=payload, ttl=1000)

@receiver(post_save, sender=BugReport)
def create_bug_report_notification(sender, instance, created, **kwargs):
    if created:
        for user in User.objects.filter(is_admin = True):
            user_profile = Profile.objects.get(username=user.active_profile)
            notification = Notification(
                from_user = Profile.objects.get(username = "achaney55"),
                to_user = user_profile,
                body = instance.body,
                type = 0,
                link = "/support/",
                title = instance.subject,
                notify_class = 0
            )

            notification.save()

            addToCore(notification, user_profile)

            #Send Push Notification
            payload = {
                "title": "New Bug Report: " + instance.subject, 
                "body": instance.body, 
                "icon": "/static/images/2023-logo-draft.png",
                'tag': 'yourbit',
                'actions': [
                    {
                        'action': 'open_url',
                        'title': 'Open Yourbit',
                        'icon': '/static/images/yourbit_logo.png'
                    }
                ],
                
                'url': '/notify/',
                
                
            }
            send_user_notification(user=user, payload=payload, ttl=1000)

@receiver(post_save, sender=FeatureRequest)
def create_feature_request_notification(sender, instance, created, **kwargs):
    if created:
        for user in User.objects.filter(is_admin = True):
            user_profile = Profile.objects.get(username=user.active_profile)
            notification = Notification(
                from_user = Profile.objects.get(username = "achaney55"),
                to_user = user_profile,
                body = instance.body,
                type = 0,
                link = "/support/",
                title = instance.subject,
                notify_class = 0
            )

            notification.save()

            addToCore(notification, user_profile)

            #Send Push Notification
            payload = {
                "title": "New Feature Request: " + instance.subject, 
                "body": instance.body, 
                "icon": "/static/images/2023-logo-draft.png",
                'tag': 'yourbit',
                'actions': [
                    {
                        'action': 'open_url',
                        'title': 'Open Yourbit',
                        'icon': '/static/images/yourbit_logo.png'
                    }
                ],
                
                'url': '/notify/',
                
            }
            send_user_notification(user=user, payload=payload, ttl=1000)

@receiver(post_save, sender=Message)
def create_message_notification(sender, instance, created, **kwargs):

    if created:
        conversation = instance.conversation
        members = conversation.members.all()
        for member in members:
            if member != instance.from_user:

                notification = Notification(
                    to_user = member,
                    from_user = instance.from_user,
                    body = instance.decrypted_body[:100],
                    type = 6,
                    link = "/messages/" + str(conversation.id),
                    conversation = conversation,
                    title = "Message from " + instance.from_user.display_name[:50],
                    notify_class = 1
                )

                notification.save()

                addToCore(notification, member)

                # #Send Push Notification
                payload = {
                    "title": "New Message from " + instance.from_user.display_name, 
                    "body": "They said: " + '"' + instance.body[:100] + '"', 
                    "icon": "/static/images/2023-logo-draft.png",
                    'tag': 'yourbit',
                    'actions': [
                        {
                            'action': 'open_url',
                            'title': 'Open Yourbit',
                            'icon': '/static/images/yourbit_logo.png'
                        }
                    ],
                    
                    'url': '/messages/',
                    
                    
                }
                send_user_notification(user=member.user, payload=payload, ttl=1000)

#Create a notification on like of a bit
@receiver(post_save, sender=BitLike)
def create_bit_like_notification(sender, instance, created, **kwargs):
    if instance.user != instance.bit.profile.user:
        if created:
            bit = instance.bit
            profile = Profile.objects.get(username = instance.user.active_profile)
            notification = Notification(
                bit = bit,
                from_user = profile,
                to_user = bit.profile,
                body = profile.display_name + " has liked your bit",
                type = 1,
                link = "/bits/" + str(bit.id),
                title = "New Like",
                notify_class = 2


            )
            notification.save()

            addToCore(notification, bit.profile)

            #Send Push Notification

            if bit.title != "":
                notification_body = bit.title
            else:
                notification_body = bit.body[:100]

            payload = {
                "title": "New Like from " + profile.display_name, 
                "body" : notification_body, 
                "icon": "/static/images/2023-logo-draft.png",
                'tag': 'yourbit',
                'actions': [
                    {
                        'action': 'open_url',
                        'title': 'Open Yourbit',
                        'icon': '/static/images/yourbit_logo.png'
                    }
                ],
                
                'url': "/bits/" + str(bit.id),
                
            }
            send_user_notification(user=bit.profile.user, payload=payload, ttl=1000)

#Create a notification on creation of bit comment
@receiver(post_save, sender=BitComment)
def create_bit_comment_notification(sender, instance, created, **kwargs):
    if instance.profile != instance.bit.profile:
        if created:
            bit = instance.bit
            profile = instance.profile
            notification = Notification(
                bit = bit,
                to_user = bit.profile,
                from_user = profile,
                body = profile.display_name + " has commented on your bit",
                type = 2,
                link = "/bits/" + str(bit.id),
                title = "New Comment",
                notify_class = 2
            )
            notification.save()

            addToCore(notification, bit.profile)

            #Send Push Notification
            payload = {
                "title": "New Comment from " + profile.display_name, 
                "body": instance.body, 
                "icon": "/static/images/2023-logo-draft.png",
                'tag': 'yourbit',
                'actions': [
                    {
                        'action': 'open_url',
                        'title': 'Open Yourbit',
                        'icon': '/static/images/yourbit_logo.png'
                    }
                ],
                
                'url': '/notify/',
                
                
            }
            send_user_notification(user=bit.profile.user, payload=payload, ttl=1000)


#Create a notification on friend request
@receiver(post_save, sender=FriendRequest)
def create_friend_request_notification(sender, instance, created, **kwargs):
    if created:

        notification = Notification(
            to_user = instance.to_user,
            from_user = instance.from_user,
            body = instance.from_user.username + " has sent you a friend request",
            type = 4,
            link = "/profile/" + str(instance.from_user.username),
            title = "New Friend Request",
            notify_class = 0,
            friend_request = instance
        )

        notification.save()

        addToCore(notification, instance.to_user)

        #Send Push Notification
        payload = {
            "title": "New Friend Request", 
            "body": instance.from_user.username + " has sent you a friend request", 
            "icon": "/static/images/2023-logo-draft.png",
            'tag': 'yourbit',
            'actions': [
                {
                    'action': 'open_url',
                    'title': 'Open Yourbit',
                    'icon': '/static/images/yourbit_logo.png'
                }
            ],
            
            'url': '/notify/',
            
            }
        send_user_notification(user=instance.to_user.user, payload=payload, ttl=1000)

#Create a notification on friend request acceptance
@receiver(post_save, sender=FriendRequest)
def create_friend_accept_notification(sender, instance, created, **kwargs):
    if instance.accepted:
        notification = Notification(
            to_user = instance.from_user,
            from_user = instance.to_user,
            body = instance.to_user.username + " has accepted your friend request",
            type = 5,
            link = "/profile/" + str(instance.to_user.username),
            title = "Friend Request Accepted",
            notify_class = 0,
            friend_request = instance
        )

        notification.save()

        addToCore(notification, instance.from_user)

        #Send Push Notification
        payload = {
            "title": "Friend Request Accepted", 
            "body": instance.to_user.username + " has accepted your friend request", 
            "icon": "/static/images/2023-logo-draft.png",
            'tag': 'yourbit',
            'actions': [
                {
                    'action': 'open_url',
                    'title': 'Open Yourbit',
                    'icon': '/static/images/yourbit_logo.png'
                }
            ],
            
            'url': '/notify/',
            
            
            
            }
        send_user_notification(user=instance.from_user.user, payload=payload, ttl=1000)



