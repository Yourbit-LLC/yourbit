from rest_framework.routers import DefaultRouter
from .api.viewsets import *

router = DefaultRouter()
router.register(r'profile', ProfileViewset, basename='profile')
router.register(r'connect/friend/', FriendRequestViewset, basename='friend_request')



# Add more endpoints as needed
urlpatterns = router.urls
