from rest_framework.routers import DefaultRouter
from .api.viewsets import NotificationViewSet, NotificationCoreViewSet

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet)
router.register(r'notification-core', NotificationCoreViewSet)

# Add more endpoints as needed
urlpatterns = router.urls
