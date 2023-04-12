from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(BugReport)
admin.site.register(UserReport)
admin.site.register(FeatureRequest)