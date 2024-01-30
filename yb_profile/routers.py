from rest_framework.routers import DefaultRouter
from .api.viewsets import *

router = DefaultRouter()
router.register(r'profile', ProfileViewset, basename='profile')



# Add more endpoints as needed
urlpatterns = router.urls
