from django.db import models

# Create your models here.
class Ploppable(models.Model):
    name = models.CharField(max_length=255, unique=True)
    type = models.IntegerField(default=0)  # 0 = sticker, 1 = element, 2 = canvas widget
    description = models.TextField()
    
    #Contents
    image = models.ImageField(upload_to='ploppables/images/')
    url = models.URLField(max_length=255, blank=True, null=True)
    
    #Placement and Sizing
    x_position = models.IntegerField(default=0)
    y_position = models.IntegerField(default=0)
    width = models.IntegerField(default=100)
    height = models.IntegerField(default=100)
    
    #Information
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='ploppables')

    def __str__(self):
        return self.name