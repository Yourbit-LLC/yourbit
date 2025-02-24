from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import json
from django.utils import timezone

# Create your models here.
class MyAccountManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        if not username:
            raise ValueError("Users ust have a username")

        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )

        user.setPassword(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, first_name, last_name, dob, password):
        user = self.model(
            email=self.normalize_email(email),
            password=password,
            username=username,
            first_name = first_name,
            last_name = last_name,
            dob=dob,

        )

        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class Account(AbstractBaseUser):
    #General Information
    email = models.EmailField(verbose_name="email", max_length=150, unique=True)
    username = models.CharField(max_length=30, unique=True)
    display_username = models.CharField(max_length=30, default=None)
    first_name = models.CharField(max_length=150, default = None)
    last_name = models.CharField(max_length=150, default = None)
    phone_number = models.CharField(max_length=15, null=True, blank=True, default = None)
    dob = models.DateField(max_length=12, default= None)

    active_profile = models.CharField(max_length=150, default="self")
    
    #Timekeeper
    date_joined = models.DateTimeField(verbose_name='date-joined', auto_now_add=True)
    last_login = models.DateTimeField(verbose_name='last-login', auto_now=True)   
    
    #Staff Permissions
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_supervisor = models.BooleanField(default=False)

    #Voter permissions
    is_voter = models.BooleanField(default=False)
    is_council = models.BooleanField(default=False)
    
    #Verification
    email_confirmed = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=150, null=True, default = "None")
    phone_number_verified = models.BooleanField(default=False)

    #Setup
    onboarding_complete = models.BooleanField(default=False)
    first_login = models.BooleanField(default=True)
    
    #Terms and Conditions Compliance
    terms_accepted = models.BooleanField(default=False)
    #terms_signature_date = models.DateField(max_length=12, default= timezone.now)
    
    #Privacy Policy Compliance
    privacy_accepted = models.BooleanField(default=False)
    #privacy_signature_date = models.DateField(max_length=12, default= timezone.now)

    #User Policy Compliance
    is_active = models.BooleanField(default=True) 
    negative_strikes = models.IntegerField(default=0)
    positive_actions = models.IntegerField(default=0)
    api_key = models.CharField(max_length=150, default=None, null=True)


    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name', 'dob',]

    objects = MyAccountManager()

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True