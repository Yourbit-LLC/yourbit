from rest_framework.routers import DefaultRouter
from .api.viewsets import NotificationViewSet, NotificationCoreViewSet, NotificationDevice

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notifications')
router.register(r'notification-core', NotificationCoreViewSet, basename='notification-core')
router.register(r'subscribe', NotificationDevice, basename='subscribe')

# Add more endpoints as needed
urlpatterns = router.urls
