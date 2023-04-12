from rest_framework import routers
from user_profile.api.viewsets import BitViewSet, ProfileViewSet
from django.urls import path, include
from api import legacy_views


urlpatterns = [
    #path('user_profile/<str:id>/media/get/videos/all/'),
    path('get/list/user/connections/<str:filter>/', legacy_views.connections, name='api-list-connections'), #Requires login, Connections include friends, following, communities, all
    path('get/messenger/conversations/', legacy_views.getConversations, name='api-list-conversations'), #Requires login, lists conversations
    

]

