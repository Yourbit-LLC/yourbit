from django.db import models
from YourbitAccounts.models import Account as User
from django.utils import timezone

# Create your models here.
class Community(models.Model):
    founder = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    admins = models.ManyToManyField(User, related_name="+", blank=True)
    title = models.CharField(max_length=200)
    followers = models.ManyToManyField(
        "self",
        related_name="followed_by",
        symmetrical=False,
        blank = True
    )
    about = models.CharField(max_length=500)
    time = models.DateTimeField(default=timezone.now)

    #Is linked refers to linked community pages. For example, a business page that is linked to many product pages
    is_linked = models.BooleanField(default=False)

    #Community group refers to the group that links all associated pages
    community_group = models.ManyToManyField('CommunityGroup', blank=True)
    school = models.CharField(max_length = 150)
    company = models.CharField(max_length=150)
    year_founded = models.DateTimeField(default=timezone.now)

#   Types:
#       1=General,
#       2=Interest, 
#       3=School Organization, 
#       4=Workplace Organization, 
#       5=Product/Service (Specific), 
#       6=Business,

    type = models.IntegerField(default = 0)

    #Spaces, meaning default content space: 1=Universal, 2=Chat, 3=Video, 4=Photo
    space = models.IntegerField(default = 0)
    
class Custom(models.Model):

    #Profile Connections
    profile = models.OneToOneField('Community', related_name='custom', blank=True, on_delete=models.CASCADE)

    #Profile Images
    image_uploaded = models.BooleanField(default=False)
    image = models.ImageField(upload_to='media/', default="media/blenderlogo.png")
    background_image = models.ImageField(upload_to='media/', blank=True, default="media/aqua_default_theme.png")

    #bits
    bit_background = models.CharField(max_length=50, default = "#4b4b4b")
    title_color = models.CharField(max_length=50, default="#ffffff")
    text_color = models.CharField(max_length=50, default="#ffffff")
    feedback_icon_color = models.CharField(max_length=50, default="#000000")
    feedback_background_color = models.CharField(max_length=50, default="#ffffff")

    #UI
    background_color = models.CharField(max_length=50, default="#323232")
    accent_color = models.CharField(max_length=50, default="#ffffff")
    icon_color = models.CharField(max_length=50, default="#ffffff")

    #Quick Appearance Settings
    user_colors_on = models.BooleanField(default=True)
    wallpaper_on = models.BooleanField(default=True)
    default_theme_on = models.BooleanField(default=False)

class CommunityGroup(models.Model):
    users = models.ManyToManyField(User, blank=True)
    organization = models.CharField(max_length=200)
