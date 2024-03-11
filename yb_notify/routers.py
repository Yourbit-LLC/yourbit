from rest_framework.routers import DefaultRouter
from .api.viewsets import NotificationViewSet

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet)

# Add more endpoints as needed
urlpatterns = router.urls
