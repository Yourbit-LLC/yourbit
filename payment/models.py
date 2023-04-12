from django.db import models
from YourbitAccounts.models import Account as User
from django.utils import timezone

# Create your models here.
class Receipts(models.Model):
    user = models.ForeignKey(User, blank = True, on_delete=models.CASCADE)
    time = models.DateTimeField(default = timezone.now)
    amount = models.FloatField(default=0.00)
    item = models.CharField(max_length=150, blank = True)
    