# tasks.py

from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import FriendRequest

@shared_task
def delete_expired_friend_requests():
    expiration_date = timezone.now() - timedelta(days=30)
    FriendRequest.objects.filter(
        time__lte=expiration_date, 
        status='rejected'  # Assuming you have a status field
    ).delete()
