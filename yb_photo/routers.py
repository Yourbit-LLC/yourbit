from rest_framework.routers import DefaultRouter
from .api.viewsets import *

router = DefaultRouter()
router.register(r'photos', PhotoViewSet, basename='photo')
router.register(r'wallpaper', WallpaperViewSet, basename='wallpaper')

# Add more endpoints as needed
urlpatterns = router.urls
