from django.db import models
from yb_accounts.models import Account as User

#import timezone from django 
from django.utils import timezone

# Create your models here.

class Profile(models.Model):
    # Add shared fields here
    user = models.ForeignKey(User, related_name="owned_profile", on_delete=models.CASCADE)
    managers = models.ManyToManyField(User, blank=True, related_name="managers")

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
    
    is_orbit = models.BooleanField(default=False)
    is_private = models.BooleanField(default=False)
    public_messages = models.BooleanField(default=False)
    is_briefings = models.BooleanField(default=False)

    #System information
    current_timezone = models.CharField(max_length=150, default="America/New_York")
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
    

    blocked_users = models.ManyToManyField(
        "self",
        related_name="blocked",
        symmetrical=False,
        blank=True
    )

    def add_friend(self, profile):
        """Add a friend to this user profile."""
        self.friends.add(profile)
        profile.friends.add(self)

    def remove_friend(self, profile):
        """Remove a friend from this user profile."""
        self.friends.remove(profile)
        profile.friends.remove(self)

    def block_user(self, profile):
        """Block another user profile."""
        self.blocked_users.add(profile)
        profile.blocked_users.add(self)

    def is_blocked(self, profile):
        """Check if this user is blocked by the given profile."""
        return self.blocked_users.filter(id=profile.id).exists()
    
    def unblock_user(self, profile):
        """Unblock another user profile."""
        self.blocked_users.remove(profile)
        profile.blocked_users.remove(self)
    
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
    
    def is_friends_with(self, profile):
        """Check if this user is friends with the given profile."""
        return self.friends.filter(id=profile.id).exists()
    
    def is_family_with(self, profile):
        """Check if this user is family with the given profile."""
        return self.family.filter(id=profile.id).exists()
    
    def is_followed_by(self, profile):
        """Check if this user is followed by the given profile."""
        return self.followers.filter(id=profile.id).exists()

    bio = models.CharField(max_length=500, blank=True, null=True)
    motto = models.CharField(max_length=100, blank=True, null=True)

    space_focus = models.CharField(max_length=100, default="global") #What type of content the user or community primarily focuses on

    managed_orbits = models.ManyToManyField('self', related_name='managed_orbits', blank=True)
    restrict_friends = models.BooleanField(default=False)
    friend_code = models.CharField(max_length=100, blank=True, null=True)
    friend_requests = models.ManyToManyField('FriendRequest', related_name='friend_requests', blank=True)
    # Add any other user-specific fields

    def __str__(self):
        return self.username
    


class ProfileInfo(models.Model):
    profile = models.OneToOneField(Profile, related_name='profile_info', blank=True, on_delete=models.CASCADE)

    #Contact Info
    email = models.EmailField(max_length=150)
    phone_number = models.CharField(max_length=150)
    address = models.CharField(max_length=150)
    website = models.CharField(max_length=150)
    twitter_handle = models.CharField(max_length=150)
    facebook_handle = models.CharField(max_length=150)
    instagram_handle = models.CharField(max_length=150)
    linkedin_handle = models.CharField(max_length=150)
    tiktok_handle = models.CharField(max_length=150)
    youtube_handle = models.CharField(max_length=150)
    snapchat_handle = models.CharField(max_length=150)

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
    current_job = models.CharField(max_length=150)
    current_role = models.CharField(max_length=150)
    year_started = models.IntegerField(default = 0)

    first_job = models.CharField(max_length=150)
    first_role = models.CharField(max_length=150)
    first_year_started = models.IntegerField(default = 0)


    #Relationships
    relationship_status = models.CharField(max_length = 100, default = 'Single')

    
class OrbitInfo(models.Model):
    profile = models.OneToOneField(Profile, related_name='community_profile_info', blank=True, on_delete=models.CASCADE)
    email = models.CharField(max_length=150)
    date_started = models.DateField(default=timezone.now)
    location_started = models.CharField(max_length = 150)
    team_size = models.IntegerField(default = 1)

class Inventory(models.Model):
    
    profile = models.OneToOneField(Profile, related_name='inventory', blank=True, on_delete=models.CASCADE)
    
    #Add inventory items here
    clusters = models.ManyToManyField('yb_bits.Cluster', related_name='inventory', blank=True)
    continuums = models.ManyToManyField('yb_bits.Continuum', related_name='inventory', blank=True)
    # themes = models.ManyToManyField('yb_customize.Theme', related_name='inventory', blank=True)
    # fonts = models.ManyToManyField('yb_customize.Font', related_name='inventory', blank=True)
    bits = models.ManyToManyField('yb_bits.Bit', related_name='inventory', blank=True)

class FriendRequest(models.Model):
    #Model for friend requests
    from_user = models.ForeignKey(Profile, related_name = "from_user", on_delete=models.CASCADE)
    to_user = models.ForeignKey(Profile, related_name = "to_user", on_delete=models.CASCADE)
    accepted = models.BooleanField(default=False)
    status = models.CharField(max_length=100, default="pending")
    message = models.CharField(max_length = 200, blank=True)
    time = models.DateTimeField(default=timezone.now)


class SessionProfile(models.Model):
    #Model for session profiles
    session_key = models.CharField(max_length=150, default="")
    session_start = models.DateTimeField(default=timezone.now)
    session_end = models.DateTimeField(default=timezone.now)
    session_duration = models.IntegerField(default=0)
    session_active = models.BooleanField(default=False)

class PageAccess(models.Model):
    #Model for page access
    profile = models.OneToOneField(SessionProfile, related_name='page_access', blank=True, on_delete=models.CASCADE)
    page = models.CharField(max_length=150, default="")
    previous_page = models.CharField(max_length=150, default="")
    button_used = models.CharField(max_length=150, default="")
    time = models.DateTimeField(default=timezone.now)

class AnonymousProfile(models.Model):
    #Model for anonymous profiles
    profile = models.OneToOneField(Profile, related_name='anonymous_profile', blank=True, on_delete=models.CASCADE)
    session_profiles = models.ManyToManyField(SessionProfile, related_name='session_profiles', blank=True)