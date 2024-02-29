from django.db import models
from django.utils import timezone
from yb_accounts.models import Account as User
from django.contrib.postgres.fields import ArrayField as ArrayField

# Create your models here.

class MessageCore(models.Model):
    profile = models.ForeignKey('yb_profile.Profile', related_name='message_core', on_delete=models.CASCADE, blank=True)
    #message settings
    # 1 = everyone, 2 = friends, 3 = no one
    receive_from = models.IntegerField(default=1)
    
    blocked_users = models.ManyToManyField(User, blank=True, related_name='blocked_users')
    muted_user_conversations = models.ManyToManyField('Conversation', blank=True, related_name='muted_user_conversations')
    muted_community_conversations = models.ManyToManyField('Conversation', blank=True, related_name='muted_community_conversations')
    allowed_communities = models.ManyToManyField('yb_profile.Orbit', blank=True, related_name='allowed_communities')
    blocked_communities = models.ManyToManyField('yb_profile.Orbit', blank=True, related_name='blocked_communities')
    start_by_phone = models.BooleanField(default=False)
    start_by_email = models.BooleanField(default=False)
    start_by_username = models.BooleanField(default=False)
    start_by_name = models.BooleanField(default=False)

class Conversation(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(User, related_name='members')
    is_joinable = models.BooleanField(default=False)
    is_private = models.BooleanField(default=False)
    is_community = models.BooleanField(default=False)
    time_modified = models.DateTimeField(default=timezone.now)
    stickers = models.ManyToManyField('ChatSticker', blank=True)
#Conversations are parent to messages in the database model. 
# Organizes messages between one set of users

#Message is contained in a conversation
class Message(models.Model):
    conversation = models.ForeignKey('Conversation', related_name='messages', on_delete=models.CASCADE)
    body = models.CharField(max_length = 1500)
    videos = models.ManyToManyField('yb_video.Video', blank=True)
    images = models.ManyToManyField('yb_photo.Photo', blank=True)
    documents = ArrayField(models.FileField(upload_to='media/message_files', blank=True))
    time = models.DateTimeField(default=timezone.now)
    
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-time']
        abstract = True

class ChatSticker(models.Model):
    user = models.ForeignKey(User, related_name='chat_stickers', on_delete=models.CASCADE)
    sticker = models.CharField(max_length=150, default="")
    x = models.IntegerField(default=0)
    y = models.IntegerField(default=0)
    width = models.IntegerField(default=0)
    height = models.IntegerField(default=0)
    rotation = models.IntegerField(default=0)
    z_index = models.IntegerField(default=0)
    animation = models.CharField(max_length=100, default="static")
    loop_animation = models.BooleanField(default=False)
    animation_delay = models.IntegerField(default=0)
    animation_duration = models.IntegerField(default=0)
    
    time = models.DateTimeField(default=timezone.now)


