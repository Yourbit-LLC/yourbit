from django.urls import path
from . import consumers  # Import your WebSocket consumer

websocket_urlpatterns = [
    path("ws/notifications/", consumers.NotificationConsumer.as_asgi()),
]