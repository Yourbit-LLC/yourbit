from django.urls import path, re_path
from .views import *
from user_profile.api.viewsets import follow, requestFriend, updateTimezone, likeBit, dislikeBit, commentBit, shareBit
from django.views.generic import TemplateView
from YourbitAccounts.views import Onboarding

urlpatterns = [
        #REST API EndPoints
        path('api/connect/follow/', follow, name='follow'),
        path('api/connect/friend/', requestFriend, name='add-friend'),
        path('api/widget/timezone/', updateTimezone, name='update-tz'),
        path('api/interact/like/', likeBit, name="like_bit"),
        path('api/contrast/', AutoColorizeText.as_view(), name="contrast_text"),
        path('api/enhance/', EnhanceText.as_view(), name="share_bit"),
        path('api/interact/dislike/', dislikeBit, name="dislike_bit"),
        path('api/interact/comment/', commentBit, name="comment_bit"),
        path('api/add_friend/', acceptFriend, name="add_friend"),
        path('api/create/cluster/', CreateCluster.as_view(), name="create_cluster"),
        
        #Templates
        path('templates/profile/', TemplateView.as_view(template_name='user_profile/profile.html')),
        path('templates/customize-html/', TemplateView.as_view(template_name = 'user_profile/personalize_profile.html')),
        path('templates/connections-html/', TemplateView.as_view(template_name='user_profile/connections.html')),
        path('templates/my-stuff-html/', TemplateView.as_view(template_name='user_profile/my_stuff.html')),
        path('templates/history-html/', TemplateView.as_view(template_name="user_profile/history.html")),
        path('templates/create-menu-html/', TemplateView.as_view(template_name="user_profile/create_menu.html")),
        
        #Django Views
        path('connections/', ConnectionList.as_view(), name='connections'),
        path('publish/', Publish.as_view(), name="publish"),
        path('edit/', EditBit.as_view(), name="edit-bit"),
        path('history/<str:action>/', HistoryView.as_view(), name="history"),
        path('customize/', Personalization.as_view(), name="personalize"),
        path('custom/first_visit/', CustomNewUser.as_view(), name="onboarding"),
        path('stuff/', MyStuff.as_view(), name="stuff"),
        path('visibility/', QuickVisibility.as_view(), name="get-visibility"),
        path('<str:username>/', ProfileView.as_view(), name="view-profile"),
]