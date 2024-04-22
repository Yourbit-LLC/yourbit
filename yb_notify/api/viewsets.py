
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import filters
from ..models import Notification, NotificationCore, UserDevice, PushSubscription
from .serializers import NotificationSerializer, NotificationCoreSerializer, UserDeviceSerializer, NotificationSubscriptionSerializer
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = NotificationSerializer

    def list(self, request, *args, **kwargs):
        from yb_profile.models import Profile
        user_profile = Profile.objects.get(user=request.user)  # Assuming the user is authenticated
        queryset = Notification.objects.filter(to_user=user_profile)

        #Filter by query param
        user_filter = self.request.query_params.get('notify_class', None)

        if user_filter is not '':
            queryset = queryset.filter(notify_class=user_filter)

        serializer = NotificationSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Notification.objects.all()
        notification = get_object_or_404(queryset, pk=pk)
        serializer = NotificationSerializer(notification)
        return Response(serializer.data)
    
class NotificationCoreViewSet(viewsets.ModelViewSet):
    queryset = NotificationCore.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = NotificationCoreSerializer

    def get_queryset(self):
        return self.queryset.filter(profile=self.request.user.profile)
    
    #Get unseen notification count
    @action(detail=False, methods=['get'])
    def unseen_count(self, request, *args, **kwargs):
        notification_core = self.get_queryset().first()
        count = notification_core.unseen_notifications.count()
        return Response({'count': count})
    
    #Check if there are unseen notifications return true or false
    @action(detail=False, methods=['get'])
    def has_unseen(self, request, *args, **kwargs):
        notification_core = self.get_queryset().first()
        if notification_core.unseen_notifications.count() > 0:
            return Response({'has_unseen': True})
        else:
            return Response({'has_unseen': False})
        
    #Mark all notifications as seen
    @action(detail=False, methods=['post'])
    def mark_all_seen(self, request, *args, **kwargs):
        notification_core = self.get_queryset().first()

        #Update the has seen field in each notification
        notification_core.unseen_notifications.all().update(has_seen=True)
        
        #Add all unseen notifications to seen notifications
        notification_core.seen_notifications.add(*notification_core.unseen_notifications.all())
        
        #Clear the unseen notifications
        notification_core.unseen_notifications.clear()
        notification_core.save()

        #Return a response
        return Response({'status': 'all notifications marked as seen'})
    
    #Mark a single notification as seen
    @action(detail=False, methods=['post'])
    def mark_seen(self, request, *args, **kwargs):
        notification_core = self.get_queryset().first()

        #Update the has seen field in the notification
        notification_core.unseen_notifications.filter(id=request.data['id']).update(has_seen=True)

        #Add the notification to seen notifications
        notification_core.seen_notifications.add(*notification_core.unseen_notifications.filter(id=request.data['id']))

        #Remove the notification from unseen notifications
        notification_core.unseen_notifications.remove(*notification_core.unseen_notifications.filter(id=request.data['id']))
        

        notification_core.save()

        #Return a response
        return Response({'status': 'notification marked as seen'})


class NotificationDevice(viewsets.ModelViewSet):
    queryset = UserDevice.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = UserDeviceSerializer

    def get_queryset(self):
        return self.queryset.filter(profile=self.request.user.profile)
    
    #Register a device
    @action(detail=False, methods=['post'])
    def register(self, request, *args, **kwargs):
        device_data = request.data["device"]
        
        print(request.data)

        device = UserDevice.objects.get_or_create(
            user=request.user,
            device_id=device_data['device_id'],
            device_type=device_data['device_type'],
            device_name = device_data['device_name']
        )

        subscription = PushSubscription.objects.create(
            device = device,
            endpoint=device_data['subscription']['endpoint'],
            p256dh=device_data['subscription']['keys']['p256dh'],
            auth=device_data['subscription']['keys']['auth'],
            user_device=device
        )

        subscription.save()

        return Response({'status': 'device registered'})
    
    #Unregister a device
    @action(detail=False, methods=['post'])
    def unregister(self, request, *args, **kwargs):
        profile = self.request.user.profile
        device_id = request.data['device_id']
        
        device = UserDevice.objects.get(user=request.user, device_id=device_id)
        push_subscription = PushSubscription.objects.get(device=device)
        
        push_subscription.delete()
        device.delete()

        return Response({'status': 'device unregistered'})
    
    #Send a test notification
    @action(detail=False, methods=['post'])
    def send_test(self, request, *args, **kwargs):
        profile = self.request.user.profile
        devices = UserDevice.objects.filter(user=request.user)
        for device in devices:
            device.send_test_notification(device.device_type)

        return Response({'status': 'test notification sent'})
