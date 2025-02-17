from django.db import models

# Create your models here.
from django.conf import settings
from cryptography.fernet import Fernet

# Create your models here.
def get_cipher():
    """Retrieve and validate the encryption key"""
    key = getattr(settings, "ENCRYPTION_KEY", None)
    
    if not key:
        raise ValueError("ENCRYPTION_KEY is not set in Django settings!")

    return Fernet(key.encode())
    

class EncryptedTextField(models.TextField):
    def from_db_value(self, value, expression, connection):
        """Decrypt value from the database"""
        if value is None or value == "":
            return value  # Avoid decrypting None or empty strings
        try:
            return get_cipher().decrypt(value.encode()).decode()
        except Exception as e:
            print(f"Decryption failed: {e}")  # Log decryption errors
            return value  # Return raw encrypted text instead of breaking

    def get_prep_value(self, value):
        """Encrypt before storing in the database"""
        if value is None or value == "":
            return value
        return get_cipher().encrypt(value.encode()).decode()

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