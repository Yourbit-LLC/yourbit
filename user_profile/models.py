from django.db import models
from django.utils import timezone
from YourbitAccounts.models import Account as User
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill, SmartResize


# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    field = models.CharField(max_length=150, default='hey')
    follows = models.ManyToManyField(
        "self",
        related_name="followed_by",
        symmetrical=False,
        blank = True
    )
    connections = models.ManyToManyField(
        "self",
        related_name="friends_with",
        symmetrical=False,
        blank = True
    )

    #About User
    gender = models.CharField(max_length = 100, blank=True)
    motto = models.CharField(max_length = 100, blank=True)
    user_bio = models.CharField(max_length = 500, blank=True)

    #Education
    currently_attending_hs = models.BooleanField(default=False)
    high_school = models.CharField(max_length = 150)
    year_graduated_hs = models.IntegerField(default = 0)
    currently_attending_u = models.BooleanField(default=False)
    college = models.CharField(max_length = 150, blank=True)
    year_graduated_u = models.IntegerField(default = 0)
    field_of_study = models.CharField(max_length = 150)

    #Location
    hometown = models.CharField(max_length = 150)
    country = models.CharField(max_length = 150)
    country_of_origin = models.CharField(max_length = 150)

    #Religion
    religion = models.CharField(max_length=150)
    place_of_worship = models.CharField(max_length = 150)

    #Workplace
    occupation = models.CharField(max_length=150)
    company = models.CharField(max_length=150)
    year_started = models.IntegerField(default = 0)

    #Relationships
    relationship_status = models.CharField(max_length = 100, default = 'Single')

    #Quick Appearance Settings
    user_colors_on = models.BooleanField(default=True)
    wallpaper_on = models.BooleanField(default=True)
    default_theme_on = models.BooleanField(default=False)

    alerted_notifications = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

class Cluster(models.Model):
    name = models.CharField(max_length=100)
    profile = models.ForeignKey('Profile', on_delete= models.CASCADE, related_name = 'cluster', null=True)
    bits = models.ManyToManyField('Bit', related_name = 'clustered_bit', blank=True)

class Group(models.Model):
    #types: 1=Famly 2=Friends 3=Work Group 4=School Group
    type = models.IntegerField()
    label = models.CharField(max_length = 200)
    users = models.ManyToManyField(User, blank=True)

#Models for bits and attachments below
#For Media Attachments see Below Bit
class Bit(models.Model):
    
    #Model for a Bit: A post on Yourbit
    profile = models.ForeignKey(
        'Profile', related_name="bits", on_delete=models.DO_NOTHING, default=None
    )

    user = models.ForeignKey(
        User, related_name="bits", on_delete=models.DO_NOTHING, default=None
    )
    to_users = models.ManyToManyField(
        User,  blank=True, related_name='mentioned'
    )
    
    has_title = models.BooleanField(default=False)
    title = models.CharField(max_length=140, blank=True)
    video = models.FileField(blank = True, upload_to = 'media/')

    photos = models.ManyToManyField('Photo', related_name='photos', blank=True)
    body = models.CharField(max_length=5000)
    time = models.DateTimeField(default=timezone.localtime)
    type = models.CharField(max_length=20, default="chat")

    likes = models.ManyToManyField(User, blank=True, related_name='likes')
    like_count = models.IntegerField(default=0)
    dislikes = models.ManyToManyField(User, blank=True, related_name='dislikes')
    dislike_count = models.IntegerField(default=0)
    shares = models.ManyToManyField(User, blank=True,related_name="shares")
    share_count = models.IntegerField(default=0)
    comment_count = models.IntegerField(default = 0)
    
    is_public = models.BooleanField(default=False)
    is_tips = models.BooleanField(default=False)
    is_title =models.CharField(max_length=10, default='none')


    contains_video_link = models.BooleanField(default=False)
    contains_news_link = models.BooleanField(default=False)
    contains_web_link = models.BooleanField(default=False)
    extend_widget = models.CharField(max_length = 1000, blank=True)
    video_widget = models.CharField(max_length = 1000, blank=True)
    custom = models.ForeignKey('Custom', on_delete=models.CASCADE, default=None)
    
    def __str__(self):
        return (
            f"{self.user}"
            f"({self.time: %Y-%m-%d %H:%M}): "
            f"{self.body[:30]}..."
        )

#Bit media attachments
class Photo(models.Model):
    #Model for attached photo to bit
    image = models.ImageField(blank = True, upload_to='media/profile/%Y/%m/%d/%H:%M')
    user = models.ForeignKey(User, related_name = "photo", on_delete=models.DO_NOTHING, blank=True)
    feed_thumbnail = ImageSpecField(source='image', processors=[SmartResize(600, 600)], format='PNG')
    grid_thumbnail = ImageSpecField(source='image', processors=[SmartResize(125, 125)], format='PNG')
    uploaded = models.DateTimeField(default=timezone.now)

class Custom(models.Model):

    #Profile Connections
    profile = models.OneToOneField('Profile', related_name='custom', blank=True, on_delete=models.CASCADE)

    #Profile Images
    image_uploaded = models.BooleanField(default=False)
    image = models.ImageField(upload_to='profile/image/%Y/%m/%d', default="media/blenderlogo.png")
    image_thumbnail_large = ImageSpecField(source='image', processors=[SmartResize(75, 75)], format='PNG')
    image_thumbnail_small = ImageSpecField(source='image', processors=[SmartResize(25, 25)], format='PNG')
    background_image = models.ImageField(upload_to='profile/background/%Y/%m/%d', blank=True, default="media/aqua_default_theme.png")
    background_mobile = ImageSpecField(source='background_image', processors=[SmartResize(877.5, 1899)], format='PNG')
    background_desktop = ImageSpecField(source='background_image', processors=[SmartResize(1280, 720)], format='PNG')

    #bits
    primary_color = models.CharField(max_length=50, default = "#4b4b4b")
    title_color = models.CharField(max_length=50, default="#ffffff")
    text_color = models.CharField(max_length=50, default="#ffffff")
    feedback_icon_color = models.CharField(max_length=50, default="#000000")
    feedback_background_color = models.CharField(max_length=50, default="#ffffff")
    paragraph_align = models.CharField(max_length=10, default = 'left')

    #UI
    background_color = models.CharField(max_length=50, default="#323232")
    accent_color = models.CharField(max_length=50, default="#ffffff")
    icon_color = models.CharField(max_length=50, default="#ffffff")

    #Quick Appearance Settings
    user_colors_on = models.BooleanField(default=True)
    wallpaper_on = models.BooleanField(default=True)
    default_theme_on = models.BooleanField(default=False)