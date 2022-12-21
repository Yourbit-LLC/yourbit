from django.db import models
from YourbitAccounts.models import Account as User

class TaskManager(models.Model):
    #Task manager models keep track of the users session state for restoration on login

    user = models.OneToOneField(User, related_name = 'tasks', on_delete=models.CASCADE)
    
    #Current Task: 0=Home, 1=Comment, 2=Message, 3=Profile, 4=Video
    last_task = models.IntegerField(default = 0)
    last_url = models.CharField(max_length=500)
    
    home_task = models.BooleanField(default = False)
    comment_task = models.BooleanField(default = False)
    message_task = models.BooleanField(default = False)
    profile_task = models.BooleanField(default = False)
    video_task = models.BooleanField(default = False)
    
    last_video = models.ManyToManyField('user_profile.Bit', related_name = 'last_video', blank=True)
    last_space = models.CharField(max_length = 10, blank=True)
    video = models.ManyToManyField('user_profile.Bit', related_name='videos', blank=True)
    recent_comment = models.ManyToManyField('user_profile.Bit', related_name = 'comment_sections', blank=True)
    conversation = models.ManyToManyField('messenger.Conversation', related_name = 'conversations', blank=True)
    recent_profile = models.ManyToManyField('user_profile.Profile', related_name='recent_profiles', blank=True)


