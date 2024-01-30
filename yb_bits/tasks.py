# tasks.py

from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Bit

@shared_task
def evaporate_bits():
    expiration_date = timezone.now()
    Bit.objects.filter(
        evaporate=True,
        evaporation_date__lte=expiration_date, 

    ).delete()
