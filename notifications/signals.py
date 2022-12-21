from django.dispatch import receiver
from django.db.models.signals import post_save
from feed.models import Comment, Interaction
from .models import Notification
from messenger.models import Message

#Interaction notifications are send on creation of the interaction object
#In order to recognize likes and dislikes
@receiver(post_save, sender = Interaction)
def InteractionNotification(sender, instance, created, **kwargs):
    if created:
        #Notifications are not sent for Class 1 interactions: Activity
        if instance.action_class != 1:

            #Create a notification for a Class 2 interaction: Rate
            if instance.action_class == 2:

                this_notification = Notification(type=1, bit=instance.bit, to_user = instance.to_user, )
            
            #Create a notification for a Class 3 interaction: Comment
            if instance.action_class == 3:
                this_notification = Notification(type=2, bit = instance.bit, to_user=instance.to_user, from_user = instance.from_user, comment=instance)
                this_notification.save()

            #Create notification for a class 5 interaction: Donate
            if instance.action_class == 5:
                if instance.bit:
                    this_notification = Notification(type=7, bit = instance.bit, to_user=instance.to_user, from_user = instance.from_user)

                else:
                    this_notification = Notification(type=7, to_user=instance.to_user, from_user = instance.from_user)

@receiver(post_save, sender = Message)
def MessageNotification(sender, instance, created, **kwargs):
    if created:
        this_notification = Notification(type=6, to_user=instance.to_user, message = instance, from_user = instance.from_user)

        this_notification.save()


        

