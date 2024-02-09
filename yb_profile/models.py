from django.db import models
from yb_accounts.models import Account as User

#import timezone from django 
from django.utils import timezone

# Create your models here.

class Profile(models.Model):
    # Add shared fields here
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # Add individual user-specific fields here (e.g., gender, motto, user_bio)
    gender = models.CharField(max_length=100, blank=True)
    
    friends = models.ManyToManyField(
        "self",
        related_name="friends_with",
        symmetrical=False,
        blank=True
    )

    family = models.ManyToManyField(
        "self",
        related_name="related_to",
        symmetrical=False,
        blank=True
    )
    
    is_private = models.BooleanField(default=False)
    is_briefings = models.BooleanField(default=False)

        #System information
    current_timezone = models.CharField(max_length=150, default="America/NewYork")
    alerted_notifications = models.BooleanField(default=False)

    display_name = models.CharField(max_length=150, default="")
    username = models.CharField(max_length=150, default="")

    followers = models.ManyToManyField(
        "self",
        related_name="followed_by",
        symmetrical=False,
        blank=True
    )

    follows = models.ManyToManyField(
        "self",
        related_name="following",
        symmetrical=False,
        blank=True
    )
    
    def follow(self, profile):
        """Follow another user profile."""
        self.follows.add(profile)
        profile.followers.add(self)

    def unfollow(self, profile):
        """Unfollow another user profile."""
        self.follows.remove(profile)
        profile.followers.remove(self)

    def is_following(self, profile):
        """Check if this user is following the given profile."""
        return self.follows.filter(id=profile.id).exists()

    bio = models.CharField(max_length=500, blank=True)
    motto = models.CharField(max_length=100, blank=True)

    space_focus = models.CharField(max_length=100, default="global") #What type of content the user or community primarily focuses on
    is_orbit = models.BooleanField(default=False) #If the user is an orbit, they will be able to see the orbits of their followers

    # Add any other user-specific fields

    def __str__(self):
        return self.user.username
    
class Orbit(models.Model):
    #Model for a community profile
    profile = models.ManyToManyField(Profile, related_name='orbit', blank=True)
    date_started = models.DateField(default=timezone.now)
    location_started = models.CharField(max_length = 150)
    team_size = models.IntegerField(default = 1)


class ProfileInfo(models.Model):

    #Contact Info
    email = models.EmailField(max_length=150)
    phone_number = models.CharField(max_length=150)
    address = models.CharField(max_length=150)
    website = models.CharField(max_length=150)

    #Location
    city = models.CharField(max_length = 150)
    state = models.CharField(max_length = 150)
    country = models.CharField(max_length = 150)

    #Shared industry sector field
    industry = models.CharField(max_length=150)

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

    
class OrbitInfo(models.Model):
    profile = models.OneToOneField(Orbit, related_name='community_profile_info', blank=True, on_delete=models.CASCADE)
    date_started = models.DateField(default=timezone.now)
    location_started = models.CharField(max_length = 150)
    team_size = models.IntegerField(default = 1)

class Inventory(models.Model):
    
    profile = models.OneToOneField(Profile, related_name='inventory', blank=True, on_delete=models.CASCADE)
    
    #Add inventory items here
    clusters = models.ManyToManyField('yb_bits.Cluster', related_name='inventory', blank=True)
    continuums = models.ManyToManyField('yb_bits.Continuum', related_name='inventory', blank=True)
    themes = models.ManyToManyField('yb_customize.Theme', related_name='inventory', blank=True)
    # fonts = models.ManyToManyField('yb_customize.Font', related_name='inventory', blank=True)
    bits = models.ManyToManyField('yb_bits.Bit', related_name='inventory', blank=True)

class FriendRequest(models.Model):
    #Model for friend requests
    from_user = models.ForeignKey(Profile, related_name = "from_user", on_delete=models.CASCADE)
    to_user = models.ForeignKey(Profile, related_name = "to_user", on_delete=models.CASCADE)
    accepted = models.BooleanField(default=False)
    status = models.CharField(max_length=100, default="pending")
    time = models.DateTimeField(default=timezone.now)

    