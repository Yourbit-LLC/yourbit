from django.db import models
from django.utils import timezone
from YourbitAccounts.models import Account as User
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill, SmartResize

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    
    followers = models.ManyToManyField(
        "self",
        related_name="followed_by",
        symmetrical=False,
        blank = True
    )
    follows = models.ManyToManyField(
        "self",
        related_name="following",
        symmetrical=False,
        blank=True
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

    #System information
    current_timezone = models.CharField(max_length=150, default="America/NewYork")
    alerted_notifications = models.BooleanField(default=False)
    user_events = models.ManyToManyField('UserEvent', related_name='user_events', blank=True)



    def __str__(self):
        return self.user.username

class Cluster(models.Model):
    name = models.CharField(max_length=100)
    profile = models.ForeignKey('Profile', on_delete= models.CASCADE, related_name = 'cluster', null=True)
    type = models.CharField(max_length=100, default="all")
    bits = models.ManyToManyField('Bit', related_name = 'clustered_bit', blank=True)
    custom = models.OneToOneField('Custom', on_delete=models.CASCADE, related_name='cluster', null=True)
    bit_count = models.IntegerField(default=0)

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
        'Profile', related_name="bits", on_delete=models.CASCADE, default=None
    )

    user = models.ForeignKey(
        User, related_name="bits", on_delete=models.CASCADE, default=None
    )
    to_users = models.ManyToManyField(
        User,  blank=True, related_name='mentioned'
    )
    
    has_title = models.BooleanField(default=False)
    title = models.CharField(max_length=140, blank=True)
    video = models.ManyToManyField('Video', related_name='videos', blank=True)

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

    #View Counts track the total amount of times a bit has been within the viewport for longer than 1.5s
    view_count = models.IntegerField(default = 0)

    #New Views track the amount of non-repeat views of this bit
    new_views = models.IntegerField(default=0)

    #Options booleans
    is_public = models.BooleanField(default=False)
    is_tips = models.BooleanField(default=False)
    is_title =models.CharField(max_length=10, default='none')

    #Links and widgets
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
    image = models.ImageField(blank = True, upload_to='media/profile/source_photos/%Y/%m/%d/%H:%M')
    user = models.ForeignKey(User, related_name = "photo", on_delete=models.DO_NOTHING, blank=True)
    small_thumbnail = models.ImageField(blank = True, upload_to='media/profile/small_thumbnails/%Y/%m/%d/%H:%M')
    medium_thumbnail = models.ImageField(blank = True, upload_to='media/profile/medium_thumbnails/%Y/%m/%d/%H:%M')
    large_thumbnail =  models.ImageField(blank = True, upload_to='media/profile/large_thumbnails/%Y/%m/%d/%H:%M')
    uploaded = models.DateTimeField(default=timezone.now)

class PhotoSticker(models.Model):
    #Model for sticker placement on a photo
    photo = models.ForeignKey(Photo, related_name = "photo_sticker", on_delete=models.CASCADE, blank=True)
    sticker = models.CharField(max_length=50, default="")
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
    
    created = models.DateTimeField(default=timezone.now)


class Video(models.Model):
    #Model for attached video to bit
    video = models.FileField(blank = True, upload_to='media/profile/videos/%Y/%m/%d/%H:%M')
    user = models.ForeignKey(User, related_name = "video", on_delete=models.DO_NOTHING, blank=True)
    thumbnail_image = models.ImageField(blank = True, upload_to='media/profile/videos/thumbnails/%Y/%m/%d/%H:%M')
    uploaded = models.DateTimeField(default=timezone.now)
    
    #Watch count tracks the amount of times a video bit has been watched for at least 80% length
    watch_count = models.IntegerField(default = 0)
    ## VIDEO BIT ONLY ##
    
    #New watches tracks the amount of non-repeat watches of this Video Bit
    new_watches = models.IntegerField(default = 0)

    video_key = models.CharField(max_length=100, blank=True)
    ## VIDEO BIT ONLY ##
    
class Custom(models.Model):

    #Profile Connections
    profile = models.OneToOneField('Profile', related_name='custom', blank=True, on_delete=models.CASCADE)
    is_new_user = models.BooleanField(default=True)

    #Universal profile image variables
    image_uploaded = models.BooleanField(default=False)
    image = models.ImageField(upload_to='profile/image/%Y/%m/%d', default="media/blenderlogo.png")
    image_thumbnail_large = models.ImageField(upload_to='profile/image/compressed/%Y/%m/%d', default="media/blenderlogo.png")
    image_thumbnail_small = models.ImageField(upload_to='profile/image/compressed/%Y/%m/%d', default="media/blenderlogo.png")
    
    #Background images and universal background variables
    background_image = models.ImageField(upload_to='profile/background/%Y/%m/%d', blank=True, default="media/aqua_default_theme.png")
    background_mobile = models.ImageField(upload_to='profile/background/%Y/%m/%d', blank=True, default="media/aqua_default_theme.png")
    background_desktop = ImageSpecField(source='background_image', processors=[SmartResize(1280, 720)], format='PNG')
    background_blur = models.CharField(max_length=10, default="20")
    background_brightness = models.CharField(max_length=10, default="80")
    background_saturation = models.CharField(max_length=10, default="80")
    background_hue = models.CharField(max_length=10, default="0")
    
    #Quick Appearance Settings
    user_colors_on = models.BooleanField(default=True)
    wallpaper_on = models.BooleanField(default=True)
    default_theme_on = models.BooleanField(default=False)
    only_my_colors = models.BooleanField(default=False)
    ui_colors_on = models.BooleanField(default=True)
    text_colors_on = models.BooleanField(default=True)
    bit_colors_on = models.BooleanField(default=True)
    flat_mode_on = models.BooleanField(default=False)

    #Color Syncing
    sync_title_colors = models.BooleanField(default=False)
    sync_text_colors = models.BooleanField(default=False)
    sync_primary_colors = models.BooleanField(default=False)
    sync_accent_colors = models.BooleanField(default=False)



class CustomBit(models.Model):
    #bits
    custom = models.ForeignKey(Custom, on_delete=models.CASCADE, default=None, related_name="bit")
    primary_color = models.CharField(max_length=50, default = "#4b4b4b")
    title_color = models.CharField(max_length=50, default="#ffffff")
    text_color = models.CharField(max_length=50, default="#ffffff")
    feedback_icon_color = models.CharField(max_length=50, default="#000000")
    feedback_background_color = models.CharField(max_length=50, default="#ffffff")
    paragraph_align = models.CharField(max_length=10, default = 'left')
    comment_text_color = models.CharField(max_length=50, default="#ffffff")

class ProfilePageCustom(models.Model):
    custom = models.ForeignKey(Custom, on_delete=models.CASCADE, default=None, related_name="profile_page_custom")
    primary_color = models.CharField(max_length=50, default = "#4b4b4b")
    title_color = models.CharField(max_length=50, default="#ffffff")
    text_color = models.CharField(max_length=50, default="#ffffff")
    icon_color = models.CharField(max_length=50, default="#ffffff")
    button_color = models.CharField(max_length=50, default="#ffffff")
    button_text_color = models.CharField(max_length=50, default="#ffffff")

class MainMenuCustom(models.Model):
    custom = models.ForeignKey(Custom, on_delete=models.CASCADE, default=None, related_name = "menu")
    primary_color = models.CharField(max_length=50, default = "#4b4b4b")
    title_color = models.CharField(max_length=50, default="#ffffff")
    text_color = models.CharField(max_length=50, default="#ffffff")
    icon_color = models.CharField(max_length=50, default="#ffffff")
    button_color = models.CharField(max_length=50, default="#ffffff")
    button_text_color = models.CharField(max_length=50, default="#ffffff")
    
    #Background Effects
    menu_background_style = models.IntegerField(default=0) #style options = 0: solid, 1: gradient, 2: translucent
    menu_background_color = models.CharField(max_length=50, default="#ffffff")
    background_opacity = models.CharField(max_length=10, default="0.5")
    background_hue = models.CharField(max_length=10, default="0") #This will overwrite universal hue on profiles and splash pages

    #Profile Image Options
    image_shape = models.IntegerField(default=0) #shape options = 0: circle, 1: square, 2: rounded square
    
    #If image is a transparent png, this option will render alpha channel
    image_transparency = models.BooleanField(default=False)
    
    #Background color to bleed through transparent pngs
    image_background_color = models.CharField(max_length=50, default="#ffffff")
    
    #Borders
    image_border_style = models.CharField(max_length=50, default="solid")
    image_border_color = models.CharField(max_length=50, default="#ffffff")
    
    
class UICustom(models.Model):
    custom = models.ForeignKey(Custom, on_delete=models.CASCADE, default=None, related_name = "interface")
    primary_color = models.CharField(max_length=50, default="#323232")
    accent_color = models.CharField(max_length=50, default="#ffffff")
    icon_color = models.CharField(max_length=50, default="#ffffff")
    ui_theme_mode = models.CharField(max_length=50, default="dark")
    

class ProfileSplashCustom(models.Model):
    custom = models.ForeignKey(Custom, on_delete=models.CASCADE, default=None, related_name="profile_splash")
    primary_color = models.CharField(max_length=50, default = "#4b4b4b")
    title_color = models.CharField(max_length=50, default="#ffffff")
    text_color = models.CharField(max_length=50, default="#ffffff")
    icon_color = models.CharField(max_length=50, default="#ffffff")
    
    #Profile Name Options
    name_font = models.CharField(max_length=50, default="Arial")
    name_font_size = models.CharField(max_length=50, default="50")
    name_font_color = models.CharField(max_length=50, default="#ffffff")

    #Profile Username Options
    username_font = models.CharField(max_length=50, default="Arial")
    username_font_size = models.CharField(max_length=50, default="30")
    username_font_color = models.CharField(max_length=50, default="#ffffff")

    #Profile Image Options
    image_shape = models.IntegerField(default=0) #shape options = 0: circle, 1: square, 2: rounded square
    
    #If image is a transparent png, this option will make the background color visible
    image_transparency = models.BooleanField(default=False)
    
    #Borders
    image_border_style = models.CharField(max_length=50, default="solid")
    image_border_color = models.CharField(max_length=50, default="#ffffff")
    
    #Background color to bleed through transparent pngs
    image_background_color = models.CharField(max_length=50, default="#ffffff")
    
    #Splash backdrop
    backdrop_hue = models.CharField(max_length=50, default="0")
    backdrop_saturation = models.CharField(max_length=50, default="100")
    backdrop_opacity = models.CharField(max_length=50, default="0.5")

    #Interaction buttons
    button_shape = models.IntegerField(default=0) #shape options = 0: circle, 1: square, 2: rounded square
    button_color = models.CharField(max_length=50, default="#ffffff")
    button_text_color = models.CharField(max_length=50, default="#ffffff")
    button_border_style = models.CharField(max_length=50, default="solid")
    button_border_color = models.CharField(max_length=50, default="#ffffff")


class Continuum(models.Model):
    user = models.OneToOneField(User, related_name = "continuum", on_delete=models.DO_NOTHING, blank=True)
    profile = models.OneToOneField('Profile', related_name='continuum', blank=True, on_delete=models.CASCADE)
    
    title = models.CharField(max_length=100, default="Untitled Continuum")

    bits = models.ManyToManyField(Bit, related_name = "continuum", blank=True)
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(default=timezone.now)
    subscribers = models.ManyToManyField(User, related_name = "subscribed_users", blank=True)

class UserProfileInfo(models.Model):
    profile = models.OneToOneField('Profile', related_name='user_profile_info', blank=True, on_delete=models.CASCADE)

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
    industry = models.CharField(max_length=150)
    occupation = models.CharField(max_length=150)
    company = models.CharField(max_length=150)
    year_started = models.IntegerField(default = 0)

    #Relationships
    relationship_status = models.CharField(max_length = 100, default = 'Single')

class CommunityProfileInfo(models.Model):
    profile = models.OneToOneField('Profile', related_name='community_profile_info', blank=True, on_delete=models.CASCADE)

    community_name = models.CharField(max_length=150, default="Untitled Community")

    #Community Types: 1 = Generic, 2 = School, 3 = Business, 4 = Religion, 5 = Organization, 7 = Entertainment Media, 8 = Information Media, 9 = Government, 10 = Other
    community_type = models.IntegerField(default=1)

    #Privacy Levels: Public, Friends, Invite Only
    privacy_level = models.CharField(max_length=150, default="Public")



class UserEvent(models.Model):
    user = models.ForeignKey(User, related_name = "user_event", on_delete=models.DO_NOTHING, blank=True)
    
    """
        Event Types: 
            0 = Logged In
            1 = Logged Out
            2 = Followed 
            3 = Gained Follower
            4 = Added Friend
            5 = Searched
            6 = Sent Message
            7 = Read Notification
            8 = Closed Notification
            9 = Changed Color
            10 = Updated Profile Photo
            11 = Updated Profile Background
            12 = Changed Account Settings
            13 = Changed Profile Settings
            14 = Changed Feed Settings
            15 = Changed Notification Settings
            16 = Changed Privacy Settings
            17 = Changed Password
            18 = Changed Email
            19 = Changed Username
            20 = Changed Name
            21 = Changed Bio
            22 = New Continuum 
            23 = New Bit   

    """    
    type = models.IntegerField(default=0)
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(default=timezone.now)
    subscribers = models.ManyToManyField(User, related_name = "subscribed_users_event", blank=True)


class ProfileSplashSticker(models.Model):
    profile_splash = models.ForeignKey('ProfileSplashCustom', related_name='profile_splash_sticker', blank=True, on_delete=models.CASCADE)
    sticker = models.CharField(max_length=50, default="")
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
    
    created = models.DateTimeField(default=timezone.now)

class ProfilePageSticker(models.Model):
    profile_page = models.ForeignKey('ProfilePageCustom', related_name='profile_page_sticker', blank=True, on_delete=models.CASCADE)
    sticker = models.CharField(max_length=50, default="")
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
    
    created = models.DateTimeField(default=timezone.now)


