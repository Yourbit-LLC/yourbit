from django.contrib import admin
from .models import Issue, BugReport, UserReport, FeatureRequest

# Register your models here.
admin.site.register(Issue)
admin.site.register(BugReport)
admin.site.register(UserReport)
admin.site.register(FeatureRequest)