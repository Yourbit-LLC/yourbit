from django.db import models
from django.utils import timezone
from yb_accounts.models import Account as User
from django.contrib.postgres.fields import ArrayField as ArrayField

# Create your models here.

class MessageCore(models.Model):
    profile = models.ForeignKey('yb_profile.UserProfile', related_name='message_core', on_delete=models.CASCADE, blank=True)
    #message settings
    # 1 = everyone, 2 = friends, 3 = no one
    receive_from = models.IntegerField(default=1)
    
    blocked_users = models.ManyToManyField(User, blank=True, related_name='blocked_users')
    muted_user_conversations = models.ManyToManyField('OneToOneConversation', blank=True, related_name='muted_user_conversations')
    muted_community_conversations = models.ManyToManyField('OneToOneConversation', blank=True, related_name='muted_community_conversations')
    allowed_communities = models.ManyToManyField('yb_profile.CommunityProfile', blank=True, related_name='allowed_communities')
    blocked_communities = models.ManyToManyField('yb_profile.CommunityProfile', blank=True, related_name='blocked_communities')
    start_by_phone = models.BooleanField(default=False)
    start_by_email = models.BooleanField(default=False)
    start_by_username = models.BooleanField(default=False)
    start_by_name = models.BooleanField(default=False)

#Conversations are parent to messages in the database model. 
# Organizes messages between one set of users
class BaseConversation(models.Model):
    
    name = models.CharField(max_length=100)
    time = models.DateTimeField(default=timezone.now)
    time_modified = models.DateTimeField(default=timezone.now)
    is_public = models.BooleanField(default=False)

    #Made messages many to many from conversation, so that each conversation can have its own set of messages,
    # allowing one user to delete without deleting both conversations.

    class Meta:
        ordering = ['-time_modified']
        abstract = True

#Conversation between two users
class OneToOneConversation(BaseConversation):
    message_core = models.ForeignKey('MessageCore', related_name='one_to_one_conversation', on_delete=models.CASCADE, blank=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
    receiver_custom = models.ForeignKey('yb_customize.CustomCore', on_delete=models.CASCADE, related_name='receiver_custom')
    messages = models.ManyToManyField('OneToOneMessage', blank = True, related_name='messages')
    unseen_messages = models.ManyToManyField('OneToOneMessage', blank = True, related_name='unseen_messages')

#Conversation between multiple users
class GroupConversation(BaseConversation):
    message_core = models.ForeignKey('MessageCore', related_name='group_conversation', on_delete=models.CASCADE, blank=True)
    members = models.ManyToManyField(User, related_name='group_members')
    is_joinable = models.BooleanField(default=False)
    messages = models.ManyToManyField('GroupMessage', blank = True, related_name='messages')
    unseen_messages = models.ManyToManyField('GroupMessage', blank = True, related_name='unseen_messages')

#Message is contained in a conversation
class Message(models.Model):
    body = models.CharField(max_length = 1500)
    videos = models.ManyToManyField('yb_video.Video', blank=True)
    images = models.ManyToManyField('yb_photo.Photo', blank=True)
    documents = ArrayField(models.FileField(upload_to='media/message_files', blank=True))
    time = models.DateTimeField(default=timezone.now)
    
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-time']
        abstract = True

class GroupMessage(Message):
    sender = models.ForeignKey(User, related_name='group_message_from', on_delete=models.CASCADE, null=True)
    conversation = models.ForeignKey(GroupConversation, related_name='message', blank=True, on_delete=models.CASCADE)
    sender_custom = models.ForeignKey('yb_customize.CustomCore', on_delete=models.CASCADE, related_name="+")

class OneToOneMessage(Message):
    sender = models.ForeignKey(User, related_name='one_to_one_message_from', on_delete=models.CASCADE, null=True)
    conversation = models.ForeignKey(OneToOneConversation, related_name='message', blank=True, on_delete=models.CASCADE)
    sender_custom = models.ForeignKey('yb_customize.CustomCore', on_delete=models.CASCADE, related_name="+")

class ChatSticker(models.Model):
    conversation = models.ForeignKey(OneToOneConversation, related_name='profile_splash_sticker', blank=True, on_delete=models.CASCADE)
    group_conversation = models.ForeignKey(GroupConversation, related_name='profile_splash_sticker', blank=True, on_delete=models.CASCADE)
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


