from django.db import models
from yb_accounts.models import Account as User
from django.utils import timezone

# Create your models here.
# class TestJournal(models.Model):
#     user = models.ForeignKey(User, related_name="test_journal", on_delete=models.CASCADE)
#     title = models.CharField(max_length=100, default="")
#     description = models.CharField(max_length=1000, default="")
#     time = models.DateTimeField(default=timezone.localtime)
#     modified = models.DateTimeField(default=timezone.localtime)

# class BugJournal(models.Model):
#     user = models.ForeignKey(User, related_name="test_journal", on_delete=models.CASCADE)
#     title = models.CharField(max_length=100, default="")
#     description = models.CharField(max_length=1000, default="")
#     time = models.DateTimeField(default=timezone.localtime)
#     modified = models.DateTimeField(default=timezone.localtime)

# class PlanJournal(models.Model):
#     user = models.ForeignKey(User, related_name="test_journal", on_delete=models.CASCADE)
#     title = models.CharField(max_length=100, default="")
#     description = models.CharField(max_length=1000, default="")
#     time = models.DateTimeField(default=timezone.localtime)
#     modified = models.DateTimeField(default=timezone.localtime)

# class JournalEntry(models.Model):
#     user = models.ForeignKey(User, related_name="test_journal", on_delete=models.CASCADE)
#     title = models.CharField(max_length=100, default="")
#     description = models.CharField(max_length=1000, default="")
#     rank = models.IntegerField(default=0)
#     time = models.DateTimeField(default=timezone.localtime)
#     modified = models.DateTimeField(default=timezone.localtime)

# class VariableEntry(models.Model):
#     user = models.ForeignKey(User, related_name="test_journal", on_delete=models.CASCADE)
#     name = models.CharField(max_length=100, default="")
#     value = models.CharField(max_length=1000, default="")
#     time = models.DateTimeField(default=timezone.localtime)
#     modified = models.DateTimeField(default=timezone.localtime)

# class FunctionEntry(models.Model):
#     user = models.ForeignKey(User, related_name="test_journal", on_delete=models.CASCADE)
#     title = models.CharField(max_length=100, default="")
#     description = models.CharField(max_length=9999, default="")
#     location = models.CharField(max_length=500, default="")
#     variables = models.ManyToManyField(VariableEntry, related_name="variables", blank=True)
#     time = models.DateTimeField(default=timezone.localtime)
#     modified = models.DateTimeField(default=timezone.localtime)

# class EndPointEntry(models.Model):
#     user = models.ForeignKey(User, related_name="test_journal", on_delete=models.CASCADE)
#     title = models.CharField(max_length=100, default="")
#     description = models.CharField(max_length=9999, default="")
#     supported_methods = models.CharField(max_length = 200, default="")
#     url = models.CharField(max_length=1000, default="")
#     time = models.DateTimeField(default=timezone.localtime)
#     modified = models.DateTimeField(default=timezone.localtime)