from django.db import models
from yb_accounts.models import Account as User
from django.utils import timezone
#import array from postgres
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class ExtensionPermissions(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    open_ai_allowed = models.BooleanField(default=False)
    google_allowed = models.BooleanField(default=False)
    amazon_allowed = models.BooleanField(default=False)
    twitter_allowed = models.BooleanField(default=False)
    youtube_allowed = models.BooleanField(default=False)
    

class Extension(models.Model):
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    icon = models.ImageField(blank = True, upload_to='media/extensions/icons/%Y/%m/%d/%H:%M')
    image = models.ImageField(blank = True, upload_to='media/extensions/images/%Y/%m/%d/%H:%M')
    url = models.CharField(max_length=200)
    script_source = models.CharField(max_length=200)
    time = models.DateTimeField(default=timezone.now)
    version = models.CharField(max_length=200)
    modified = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    verified = models.BooleanField(default=False)



class InstalledExtension(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    permission = models.ForeignKey(ExtensionPermissions, on_delete=models.CASCADE, related_name="installed_extension")
    allowed = models.BooleanField(default=False)
    time = models.DateTimeField(default=timezone.now)
    active = models.BooleanField(default=False)
    

