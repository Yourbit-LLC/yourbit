from django.db import models

# Create your models here.
class UserSession(models.Model):
    user = models.ForeignKey('yb_accounts.Account', related_name='sessions', on_delete=models.CASCADE)
    session_key = models.CharField(max_length=100, blank=True)
    session_data = models.TextField()
    current_context = models.CharField(default="self", max_length=100, blank=True) #self for users own profile, use orbit handle for orbits
    session_key_hash = models.CharField(max_length=100, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.session_key}"
    
    class Meta:
        verbose_name = "User Session"
        verbose_name_plural = "User Sessions"