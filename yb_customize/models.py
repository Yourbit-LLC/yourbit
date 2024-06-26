from django.db import models
from yb_accounts.models import Account as User

# Create your models here.

#Core customization model, this is the model that will be used to 
# store top level settings and act as a parent to other customization models

class CustomCore(models.Model):

    #Profile Connections
    profile = models.OneToOneField('yb_profile.Profile', related_name='custom', blank=True, on_delete=models.CASCADE, null=True)
    is_new_user = models.BooleanField(default=True)

    #Universal profile image variables by reference to photo object
    profile_image = models.ForeignKey('yb_photo.Photo', related_name='custom', blank=True, on_delete=models.CASCADE, null=True)
 
    #Background images and universal background variables
    
    wallpaper = models.ForeignKey('yb_photo.Wallpaper', related_name='custom_background', on_delete = models.CASCADE, blank=True, null=True)
    wallpaper_blur = models.CharField(max_length=10, default="20")
    wallpaper_brightness = models.CharField(max_length=10, default="80")
    wallpaper_saturation = models.CharField(max_length=10, default="80")
    wallpaper_hue = models.CharField(max_length=10, default="0")
    
    #Quick Appearance Settings
    user_colors_on = models.BooleanField(default=False)
    wallpaper_on = models.BooleanField(default=False)
    default_theme_on = models.BooleanField(default=False)
    only_my_colors = models.BooleanField(default=False)
    ui_colors_on = models.BooleanField(default=False)
    text_colors_on = models.BooleanField(default=False)
    bit_colors_on = models.BooleanField(default=False)
    flat_mode_on = models.BooleanField(default=False)

    #Shared Appearance Settings
    #Color Syncing
    sync_title_colors = models.BooleanField(default=False)
    sync_text_colors = models.BooleanField(default=False)
    sync_primary_colors = models.BooleanField(default=False)
    sync_accent_colors = models.BooleanField(default=False)

    theme = models.ForeignKey('Theme', related_name='custom', on_delete = models.CASCADE, blank=True, null=True)

#Theme model, this is the model that will be used to store various themes 
# with foreign key to custom. All theme subtables will be linked here
class Theme(models.Model):
    name = models.CharField(max_length=50, default="untitled theme")
    author = models.OneToOneField(User, related_name='author', blank=True, on_delete=models.CASCADE)

class Font(models.Model): 
    name = models.CharField(max_length=50, default="Arial")
    file = models.FileField(upload_to='profile/fonts/%Y/%m/%d', blank=True, default="media/aqua_default_theme.png")

class CustomBase(models.Model):
    
    primary_color = models.CharField(max_length=50, default = "#4b4b4b")
    icon_color = models.CharField(max_length=50, default="#ffffff")
    accent_color = models.CharField(max_length=50, default="#ffffff")
    text_color = models.CharField(max_length=50, default="#ffffff")
    title_color = models.CharField(max_length=50, default="#ffffff")
    button_color = models.CharField(max_length=50, default="#ffffff")
    button_text_color = models.CharField(max_length=50, default="#000000")

    class Meta:
        abstract = True
    
#Theme subtables, these tables will be linked to the theme model
class CustomPage(CustomBase):
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE, default=None, related_name="custom_profile_page")
    logo_color = models.CharField(max_length=50, default="#ffffff")
    #Profile Name Options
    name_font = models.CharField(max_length=50, default="Arial")
    name_font_size = models.CharField(max_length=50, default="50")
    name_font_color = models.CharField(max_length=50, default="#ffffff")

    #Profile Username Options
    username_font = models.CharField(max_length=50, default="Arial")
    username_font_size = models.CharField(max_length=50, default="30")
    username_font_color = models.CharField(max_length=50, default="#ffffff")

    #Interaction buttons
    button_shape = models.IntegerField(default=0) #shape options = 0: circle, 1: square, 2: rounded square
    button_border_style = models.CharField(max_length=50, default="solid")
    button_border_color = models.CharField(max_length=50, default="#ffffff")


class CustomMenu(CustomBase):
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE, default=None, related_name="custom_main_menu")
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
    
    
class CustomUI(CustomBase):
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE, default=None, related_name="custom_ui")
    ui_theme_mode = models.CharField(max_length=50, default="dark")
    
    translucency = models.BooleanField(default=False)

    logo_color = models.CharField(max_length=50, default="#ffffff")

    blur = models.BooleanField(default=False)
    blur_amt = models.CharField(max_length=10, default="20")

    backdrop_brightness = models.CharField(max_length=10, default="80")
    

class CustomSplash(CustomBase):
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE, default=None, related_name="custom_splash")
    logo_color = models.CharField(max_length=50, default="#ffffff")

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
    button_border_style = models.CharField(max_length=50, default="solid")
    button_border_color = models.CharField(max_length=50, default="#ffffff")

class CustomBit(CustomBase):
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE, default=None, related_name="custom_bit")
    
    #Retrieve profile images from custom core, labeled images for easy memorization on front end, 
    images = models.ForeignKey(CustomCore, on_delete=models.CASCADE, default=None, related_name="custom_bit")
    paragraph_align = models.CharField(max_length=10, default = 'left')
    comment_text_color = models.CharField(max_length=50, default="#ffffff")
    name_color = models.CharField(max_length=50, default="#ffffff")
    username_color = models.CharField(max_length=50, default="#ffffff")
