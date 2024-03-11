
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import filters
from ..models import Notification
from .serializers import NotificationSerializer
from django.shortcuts import get_object_or_404

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

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.read = True
        notification.save()
        serializer = NotificationSerializer(notification)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        notifications = Notification.objects.filter(to_user=request.user)
        notifications.update(read=True)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def mark_all_unread(self, request):
        notifications = Notification.objects.filter(to_user=request.user)
        notifications.update(read=False)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def delete_all(self, request):
        notifications = Notification.objects.filter(to_user=request.user)
        notifications.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def delete(self, request, pk=None):
        notification = self.get_object()
        notification.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'])
    def delete_read(self, request):
        notifications = Notification.objects.filter(to_user=request.user, read=True)
        notifications.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'])
    def delete_unread(self, request):
        notifications = Notification.objects.filter(to_user=request.user, read=False)
        notifications.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)