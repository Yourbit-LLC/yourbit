from django.db import models
from yb_accounts.models import Account as User
from django.utils import timezone

# Create your models here.
class SearchHistory(models.Model):
    query = models.CharField(max_length = 200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created = models.DateTimeField(default=timezone.now)