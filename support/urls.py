from django.urls import path, re_path
from .views import *
from user_profile.api.viewsets import follow, requestFriend, updateTimezone, likeBit, dislikeBit, commentBit, shareBit


urlpatterns = [
    path('api/submit/bug/', CreateBugReport.as_view()),
    path('api/submit/feature/', CreateFeatureRequest.as_view()),
    path('api/submit/user/', CreateUserReport.as_view()),
]