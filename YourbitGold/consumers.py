import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join a notification group (could be user-specific in production)
        self.group_name = "notifications"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the notification group
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        # Receive message from WebSocket
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # Send message to the group
        await self.channel_layer.group_send(
            self.group_name,
            {"type": "send_notification", "message": message}
        )

    async def send_notification(self, event):
        # Send message to WebSocket
        message = event["message"]
        await self.send(text_data=json.dumps({"message": message}))
