from django.urls import path, re_path
from .views import *
from user_profile.api.viewsets import follow, requestFriend, updateTimezone, likeBit, dislikeBit, commentBit, shareBit
from .utils import subdomain_reverse

support_home_url = subdomain_reverse('', subdomain='support')
support_faq_url = subdomain_reverse('faq', subdomain='support')
support_contact_url = subdomain_reverse('contact', subdomain='support')

urlpatterns = [
    
    path('api/submit/bug/', CreateBugReport.as_view()),
    path('api/submit/feature/', CreateFeatureRequest.as_view()),
    path('api/submit/user/', CreateUserReport.as_view()),
    path('', Support.as_view(), name='support'),
]