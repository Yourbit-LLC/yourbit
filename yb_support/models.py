from django.db import models
from yb_accounts.models import Account as User

# Create your models here.

class Note(models.Model):
    subject = models.CharField(max_length=1000, blank=True, default=None)
    body = models.CharField(max_length=1000, blank=True, default=None)
    time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=1000, blank=True, default=None)

class Issue(models.Model):
    subject = models.CharField(max_length=1000, blank=True, default=None)
    body = models.CharField(max_length=1000, blank=True, default=None)
    time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=1000, blank=True, default="pending")
    priority = models.CharField(max_length=1000, blank=True, default="yellow") #red = critical error, yellow = minor issue, green = completed


class SupportCase(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=1000, blank=True, default=None)
    body = models.CharField(max_length=1000, blank=True, default=None)
    time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=1000, blank=True, default="pending")

    upvote_count = models.IntegerField(default=0)
    is_open = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Support Cases"
        abstract = True

class BugReport(SupportCase):
    notes = models.ManyToManyField(Note, blank=True, related_name="bug_notes")
    upvotes = models.ManyToManyField(User, blank=True, related_name="bug_upvotes")

    def __str__(self):
        return f"{self.subject} - Submitted by: {self.user.username}"
    
    class Meta:
        verbose_name = "Bug Report"
        verbose_name_plural = "Bug Reports"
    
    
    
class UserReport(SupportCase):
    from yb_bits.models import Bit
    notes = models.ManyToManyField(Note, blank=True, related_name="user_report_notes")
    
    bit = models.ForeignKey(Bit, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "User Report"
        verbose_name_plural = "User Reports"

class FeatureRequest(SupportCase):
    notes = models.ManyToManyField(Note, blank=True, related_name="feature_notes")
    upvotes = models.ManyToManyField(User, blank=True, related_name="feature_upvotes")

    class Meta:
        verbose_name = "Feature Request"
        verbose_name_plural = "Feature Requests"