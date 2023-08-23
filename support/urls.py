from django.urls import path, re_path
from .views import *
from user_profile.api.viewsets import follow, requestFriend, updateTimezone, likeBit, dislikeBit, commentBit, shareBit
from django.urls import reverse

support_faq_url = reverse('faq', subdomain='support')
support_contact_url = reverse('contact', subdomain='support')

urlpatterns = [
    
    path('api/submit/bug/', CreateBugReport.as_view()),
    path('api/submit/feature/', CreateFeatureRequest.as_view()),
    path('api/submit/user/', CreateUserReport.as_view()),
    path('', Support.as_view(), name='support'),
]