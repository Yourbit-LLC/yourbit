from celery import shared_task
from django.utils import timezone
from yb_bits.models import Bit

@shared_task
def delete_expired_bits():
    deleted, _ = Bit.objects.filter(evaporation_time__lte=timezone.now()).delete()
    return f"Deleted {deleted} expired bits"