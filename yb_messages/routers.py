from rest_framework.routers import DefaultRouter
from yb_messages.api.viewsets import MessageViewSet, ConversationViewSet

router = DefaultRouter()

router.register(r'messages', MessageViewSet, basename='message')
router.register(r'conversations', ConversationViewSet, basename='conversation')

urlpatterns = router.urls