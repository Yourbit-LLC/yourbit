from django.db import models
from django.utils import timezone
from YourbitAccounts.models import Account as User

#This file contains the database models for messages in Yourbit

# Create your models here.


#Conversations are parent to messages in the database model. Oganizes messages between one set of users
class Conversation(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
    time = models.DateTimeField(default=timezone.now)
    time_modified = models.DateTimeField(default=timezone.now)
    is_public = models.BooleanField(default=False)

    #Made messages many to many from conversation, so that each conversation can have its own set of messages,
    # allowing one user to delete without deleting both conversations.
    messages = models.ManyToManyField('Message', blank = True, related_name='messages')
    receiver_custom = models.ForeignKey('user_profile.Custom', on_delete=models.CASCADE, related_name='receiver_custom')
    unseen_messages = models.ManyToManyField('Message', blank = True, related_name='unseen_messages')

#Message is contained in a conversation
class Message(models.Model):
    sender = models.ForeignKey(User, related_name='message_to', on_delete=models.CASCADE, null=True)
    receiver = models.ForeignKey(User, related_name='message_from', on_delete=models.CASCADE)
    body = models.CharField(max_length = 1500)
    video = models.FileField(upload_to='media/message_attachments', blank=True)
    image = models.ImageField(upload_to='media/message_attachments', blank=True, null=True)
    document = models.FileField(upload_to='media/message_files', blank=True)
    time = models.DateTimeField(default=timezone.now)
    sender_custom = models.ForeignKey('user_profile.Custom', on_delete=models.CASCADE, related_name="+")
    is_read = models.BooleanField(default=False)

class GroupMessage(models.Model):
    sender = models.ForeignKey(User, related_name='group_message_to', on_delete=models.CASCADE, null=True)
    body = models.CharField(max_length = 1500)
    video = models.FileField(upload_to='media/message_attachments', blank=True)
    image = models.ImageField(upload_to='media/message_attachments', blank=True, null=True)
    document = models.FileField(upload_to='media/message_files', blank=True)
    time = models.DateTimeField(default=timezone.now)
    sender_custom = models.ForeignKey('user_profile.Custom', on_delete=models.CASCADE, related_name="+")
    read_by = models.ManyToManyField(User, related_name='read_by')

class GroupConversation(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(User, related_name='group_members')
    messages = models.ManyToManyField('GroupMessage', blank = True, related_name='group_messages')
    time = models.DateTimeField(default=timezone.now)
    time_modified = models.DateTimeField(default=timezone.now)
    is_public = models.BooleanField(default=False)
    
