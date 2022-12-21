from django.db import models
from YourbitAccounts.models import Account as User

# Create your models here.
class SearchHistory(models.Model):
    query = models.CharField(max_length = 200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
