from rest_framework.routers import DefaultRouter
from .api.viewsets import BitViewSet, BitFeedAPIView, LikeViewSet, DislikeViewsSet, CommentViewSet

router = DefaultRouter()
router.register(r'bits', BitViewSet)
router.register(r'likes', LikeViewSet)
router.register(r'dislikes', DislikeViewsSet)
router.register(r'comments', CommentViewSet)

# Add more endpoints as needed
urlpatterns = router.urls
