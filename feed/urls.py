from django.urls import path, re_path
from . import views
from .views import *
from feed.api import views as api_views


urlpatterns = [
    path('api-widget/get/unfed/', api_views.checkUnfed, name="get-unfed"),
    path('chat/', ChatSpace.as_view(), name='chatspace'),
    path('video/', VideoSpace.as_view(), name='videospace'),
    path('photo/', PhotoSpace.as_view(), name='photospace'),
    path('bitstream/<str:tz>/<str:type>/<int:id>/<str:filter>/<str:sort>/', Feed.as_view(), name='feed'),
    path('interact/like/', LikeBit.as_view(), name='like'),
    path('interact/dislike/', DislikeBit.as_view(), name='dislike'),
    path('interact/comment/', AddComment.as_view(), name='addComment'),
    path('bit/<int:pk>', BitDetailView.as_view(), name='bit-detail'),
    path('home/', Home.as_view(), name='home'),
    path('', Home.as_view(), name='home'),
    # path('session/<str:type>/<int:id>/', Feed.as_view(), name='load-session-feed'),
    # path('profile/<str:type>/<int:id>/', Feed.as_view(), name='load-profile-feed')


]