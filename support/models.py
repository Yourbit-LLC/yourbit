from django.db import models
from YourbitAccounts.models import Account as User

# Create your models here.


class Note(models.Model):
    subject = models.CharField(max_length=1000, blank=True, default=None)
    body = models.CharField(max_length=1000, blank=True, default=None)
    time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=1000, blank=True, default=None)

class BugReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=1000, blank=True, default=None)
    body = models.CharField(max_length=1000, blank=True, default=None)
    time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=1000, blank=True, default="Pending")
    notes = models.ManyToManyField(Note, blank=True, related_name="bug_support_notes")
    upvotes = models.ManyToManyField(User, blank=True, related_name="bug_upvotes")
    upvote_count = models.IntegerField(default=0)
    location = models.CharField(max_length=1000, blank=True, default=None)
    


class UserReport(models.Model):
    from user_profile.models import Bit
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reported_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reported_user")
    reported_bit = models.ForeignKey(Bit, blank=True, on_delete=models.CASCADE, related_name="reported_bit")
    subject = models.CharField(max_length=1000, blank=True, default=None)
    body = models.CharField(max_length=1000, blank=True, default=None)
    time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=1000, blank=True, default=None)
    notes = models.ManyToManyField(Note, blank=True, related_name="user_support_notes")
    upvotes = models.ManyToManyField(User, blank=True, related_name="user_upvotes")
    upvote_count = models.IntegerField(default=0)

class FeatureRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=1000, blank=True, default=None)
    body = models.CharField(max_length=1000, blank=True, default=None)
    time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=1000, blank=True, default=None)
    notes = models.ManyToManyField(Note, blank=True, related_name="feature_support_notes")
    upvotes = models.ManyToManyField(User, blank=True, related_name="feature_upvotes")
    upvote_count = models.IntegerField(default=0)
