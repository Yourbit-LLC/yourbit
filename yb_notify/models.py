# Create your models here.
from django.db import models
from django.utils import timezone
from yb_accounts.models import Account as User
from yb_customize.models import CustomCore
from yb_bits.models import BitComment, Bit
from yb_messages.models import Message

class NotificationCore(models.Model):
    profile = models.ForeignKey('yb_profile.Profile', on_delete=models.CASCADE, related_name='notification_profile')
    unseen_notifications = models.ManyToManyField('Notification', related_name='unseen_notifications', blank=True)
    seen_notifications = models.ManyToManyField('Notification', related_name='seen_notifications', blank=True)

class UserDevice(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    device_id = models.CharField(max_length=255) # Unique ID for the device
    device_type = models.CharField(max_length=50) # E.g., 'iOS', 'Android', 'Web'
    last_active = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'device_id')

    def send_message_web(self, message):
        from webpush import send_user_notification
        # Send a message to the device

        # For example, you might use the `webpush` library to send a push notification
        # to a web browser
        send_user_notification(
            user=self.user,
            payload={
                'head': 'New message',
                'body': message,
            },
            ttl=1000,
        )
    
    def send_message_ios(self, message):
        # Send a message to the device
        import httpx
        import json

        # Enable HTTP/2 support in httpx
        client = httpx.Client(http2=True)

        # Your device token
        device_token = self.device_id

        # The URL for the APNs request
        url = f"https://api.push.apple.com/3/device/{device_token}"

        # The payload of your push notification
        data = json.dumps({
            "aps": {
                "alert": message
            }
        })

        # The headers for the APNs request
        headers = {
            "apns-push-type": "alert",
            "apns-expiration": "0",
            "apns-priority": "10",
            "apns-topic": "yourbit.me"
        }

        # Sending the POST request to the APNs server
        response = client.post(url, headers=headers, content=data)

        # Printing the response status code and body
        print(response.status_code)
        print(response.text)

        # Close the client

        client.close()


    


class PushSubscription(models.Model):
    user_device = models.ForeignKey(UserDevice, on_delete=models.CASCADE)
    endpoint = models.URLField(max_length=500)
    p256dh = models.CharField(max_length=100) # Public key
    auth = models.CharField(max_length=100) # Auth secret
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('endpoint', 'p256dh', 'auth')

# Create your models here.
class Notification(models.Model):

    #Notification type 1 = like, 2 = comment, 3 = follow, 4 = friend request received, 5 = friend request accepted, 6 = message, 7 = donation
    type = models.IntegerField()

    notify_class = models.IntegerField(default=0) #0 = people, 1 = Messages, 2 = bits
    
    #User Details
    display_name = models.CharField(max_length=100, blank=True, null=True) #used for display name, user may set real name or username
    is_community = models.BooleanField(default=False)
    to_user = models.ForeignKey('yb_profile.Profile', related_name='notification_to', on_delete=models.CASCADE, null=True) #connected to profile so users personal information cannot be retrieved
    title = models.CharField(max_length=100, blank=True, null=True)
    body = models.CharField(max_length=300, blank=True, null=True)
    from_user = models.ForeignKey('yb_profile.Profile', related_name='notification_from_user', on_delete=models.CASCADE, null=True) #connected to profile so users personal information cannot be retrieved
    from_community = models.ForeignKey('yb_profile.Orbit', related_name='notification_from_community', on_delete=models.CASCADE, blank=True, null=True)
    
    #Notification Details
    custom = models.ForeignKey(CustomCore, on_delete=models.CASCADE, related_name='+', blank=True, null=True)
    time = models.DateTimeField(default=timezone.now)
    has_seen = models.BooleanField(default=False)

    #Friend Request Details
    friend_request = models.ForeignKey('yb_profile.FriendRequest', on_delete=models.CASCADE, related_name='+', blank=True, null=True)

    #Bit Details
    bit = models.ForeignKey(Bit, on_delete=models.CASCADE, related_name='+', blank=True, null=True)
    comment = models.ForeignKey(BitComment, on_delete=models.CASCADE, related_name='+', blank=True, null=True)

    #Message Details
    conversation = models.ForeignKey('yb_messages.Conversation', on_delete=models.CASCADE, related_name='+', blank=True, null=True)
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='+', blank=True, null=True)

    link = models.CharField(max_length=100, blank=True, null=True)





