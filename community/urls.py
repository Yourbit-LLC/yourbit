from django.urls import path, re_path
from .views import *

urlpatterns = [
    path('communities/', CommunityList.as_view(), name='list-communities'),
    path('create/', CreateCommunity.as_view(), name='create-community')
]