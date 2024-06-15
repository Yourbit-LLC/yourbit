# from celery import shared_task
# from django.utils import timezone
# from yb_bits.models import Bit

# @shared_task
# def auto_post(Bit_id):
#     try:
#         bit = Bit.objects.get(id=Bit_id)
#         bit.is_live = True
#         bit.time = timezone.now()
#         bit.save()
#     except Bit.DoesNotExist:
#         pass

# @shared_task
# def auto_delete(Bit_id):
#     try:
#         bit = Bit.objects.get(id=Bit_id)
#         bit.delete()
#     except bit.DoesNotExist:
#         pass