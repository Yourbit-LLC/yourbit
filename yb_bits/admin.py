from django.contrib import admin
from .models import * 

# Register your models here.
admin.site.register(Bit)
admin.site.register(BitComment)
admin.site.register(Cluster)
admin.site.register(BitLike)
admin.site.register(BitDislike)
admin.site.register(BitStream)
