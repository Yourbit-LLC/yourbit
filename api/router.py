from rest_framework import routers
from user_profile.api.viewsets import BitViewSet, ProfileViewSet, PhotoViewSet, CustomizationViewSet
from feed.api.viewsets import CommentViewSet, InteractionViewSet
from messenger.api.viewsets import ConversationViewSet, MessageViewSet
from rewards.api.viewsets import RewardsViewSet
from notifications.api.viewsets import NotificationViewset
from community.api.viewsets import CommunityViewSet
from settings.api.viewsets import FeedSettingsViewSet
from YourbitAccounts.api.viewsets import UserViewSet
from django.urls import path, include
from api import legacy_views


router = routers.DefaultRouter()

router.register('users', UserViewSet, basename='user')
router.register('bits', BitViewSet, basename='bit')
router.register('profiles', ProfileViewSet, basename='profile')
router.register('photos', PhotoViewSet, basename='photo')
router.register('custom', CustomizationViewSet, basename='custom')
router.register('conversations', ConversationViewSet, basename='conversation')
router.register('messages', MessageViewSet, basename='message')
router.register('interactions', InteractionViewSet, basename='interaction')
router.register('comments', CommentViewSet, basename = 'comment')
router.register('rewards', RewardsViewSet, basename='reward')
router.register('notifications', NotificationViewset, basename='notification')
router.register('communities', CommunityViewSet, basename = 'community')
router.register('feed_settings', FeedSettingsViewSet, basename = 'feed_settings')

for url in router.urls:
    print(url, "\n")