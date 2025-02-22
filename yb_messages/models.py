from django.db import models
from django.utils import timezone
from yb_accounts.models import Account as User
from django.contrib.postgres.fields import ArrayField as ArrayField
from main.models import EncryptedTextField
from main.models import get_cipher
from cryptography.fernet import InvalidToken
# Create your models here.

class MessageCore(models.Model):
    """
        MessageCore is the model that stores the settings for messages for a user. It
        is also responsible for tracking conversations associated to the user in a manner
        thats easier to query.
    """
    profile = models.ForeignKey('yb_profile.Profile', related_name='message_core', on_delete=models.CASCADE, blank=True)
    #message settings
    # 1 = everyone, 2 = friends, 3 = no one
    receive_from = models.IntegerField(default=1)
    
    blocked_users = models.ManyToManyField('yb_profile.Profile', blank=True, related_name='blocked_senders')
    muted_user_conversations = models.ManyToManyField('Conversation', blank=True, related_name='muted_user_conversations')
    muted_community_conversations = models.ManyToManyField('Conversation', blank=True, related_name='muted_community_conversations')
    start_by_phone = models.BooleanField(default=False)
    start_by_email = models.BooleanField(default=False)
    start_by_username = models.BooleanField(default=False)
    start_by_name = models.BooleanField(default=False)
    conversations = models.ManyToManyField("Conversation", blank=True, related_name = "user_conversations")

class Conversation(models.Model):
    """
        Conversation is the model that stores the messages between two users. It also stores
        the settings for the conversation between the two or more users.
    """
    is_name = models.BooleanField(default = False)
    name = models.CharField(max_length=100, default = "Untitled Conversation")
    members = models.ManyToManyField('yb_profile.Profile', related_name='user_members', blank=True)
    can_join = models.IntegerField(default=0) # 0 = no one, 1 = friends, 2 = everyone
    members_can_invite = models.BooleanField(default=False)
    
    is_community = models.BooleanField(default=False)
        
    from_user_color = models.CharField(max_length=100, default="#1E90FF")
    to_user_color = models.CharField(max_length=100, default="rgb(65, 65, 65)")
    
    time = models.DateTimeField(default=timezone.now)
    time_modified = models.DateTimeField(default=timezone.now)
    
    stickers = models.ManyToManyField('ChatSticker', blank=True)
    messages = models.ManyToManyField('Message', related_name="messages", blank=True)

#Conversations are parent to messages in the database model. 
# Organizes messages between one set of users

#Message is contained in a conversation
class Message(models.Model):
    """
        Message is the model that stores the message between two users. It also stores
        the status for the message between the two or more users.
    """
    conversation = models.ForeignKey('Conversation', related_name='conversation', on_delete=models.CASCADE, default=None)
    from_user = models.ForeignKey('yb_profile.Profile', related_name="sender", on_delete=models.CASCADE, blank=True)
    body = EncryptedTextField(blank=True, null=True)
    videos = models.ManyToManyField('yb_video.Video', blank=True)
    images = models.ManyToManyField('yb_photo.Photo', blank=True)
    time = models.DateTimeField(default=timezone.now)
    
    is_read = models.BooleanField(default=False)

    @property
    def decrypted_body(self):
        """Automatically decrypts the body when accessed"""

        cipher = get_cipher()
        try:
            decrypted_text = cipher.decrypt(self.body.encode()).decode()
            return decrypted_text  # This forces decryption
        except InvalidToken:
            return ""  # Return empty string if decryption fails

class ChatSticker(models.Model):
    user = models.ForeignKey(User, related_name='chat_stickers', on_delete=models.CASCADE, default=None)
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


