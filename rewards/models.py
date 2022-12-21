from django.db import models
from YourbitAccounts.models import Account as User
from user_profile.models import Bit

# Create your models here.
class Rewards(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    rewards_earned = models.IntegerField(default=0)
    share_points = models.IntegerField(default=0)
    point_balance = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    rewards_earned = models.IntegerField(default=0)
    share_points = models.IntegerField(default=0)
    point_balance = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    active_perks = models.ManyToManyField('Perk', blank=True, related_name='active_perks')

    earned_rates = models.ManyToManyField('user_profile.Bit', blank=True, related_name='earned_likes')
    earned_comments = models.ManyToManyField('user_profile.Bit', blank=True, related_name='earned_comments')
    earned_shares = models.ManyToManyField('user_profile.Bit', blank=True, related_name='earned_shares')
    

class Perk(models.Model):
    name = models.CharField(max_length=500)
    description = models.CharField(max_length=1000)
    cost = models.IntegerField(default=0)
    duration = models.IntegerField(default=0)
    use_count = models.IntegerField(default=0)



