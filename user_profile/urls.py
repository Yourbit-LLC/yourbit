from django.urls import path, re_path
from . import views
from .views import *

urlpatterns = [
        path('follow/<str:handle>/', Follow.as_view(), name='follow'),
        path('add_friend/<str:username>/', AddFriend.as_view(), name='add-friend'),
        path('connections/', ConnectionList.as_view(), name='connections'),
        path('history/<str:action>/', HistoryView.as_view(), name="history"),
        path('collection/', MyStuff.as_view(), name="stuff"),
        path('publish/', Publish.as_view(), name="publish"),
        path('customize/', Personalization.as_view(), name="personalize"),
        path('visibility/', QuickVisibility.as_view(), name="get-visibility"),
        path('<str:username>/', ProfileView.as_view(), name="view-profile"),
]