from rest_framework import viewsets
from rest_framework.response import Response
from ..models import Notification
from .serializers import NotificationSerializer

class NotificationViewset(viewsets.ViewSet):

    #Get query set from query params to filter only notifications for user
    def get_queryset(self, request):
        if request.query_params:
            type=request.query_params.get("type")
            queryset = Notification.objects.get(to_user = request.user, type = type)

            serializer_class = NotificationSerializer(queryset, many = True)

        else:
            queryset = Notification.objects.get(to_user = request.user)

    #Serialize and list results from query set
    def list(self, request):
        queryset = self.get_queryset()

        serializer_class = NotificationSerializer(queryset, many=True)

        return Response(serializer_class.data)

    #Retrieve a specific notification by ID
    def retrieve(self, request, pk=None):
        
        this_notification = Notification.objects.get(pk=pk)
        if request.user.is_authenticated:
            if this_notification.to_user == request.user:
                serializer_class = NotificationSerializer(this_notification, many=False)
                return Response(serializer_class.data)
            else:
                return Response("Unauthorized Request")

        else:
            return Response('You must be logged in to view notifications.')

    #Create a notification (For notifications that aren't attached to objects: followers)
    def create(self, request):
        type = request.POST.get("type")
        this_id = request.POST.get("this_id")

    #Delete notification by specified ID
    def destroy(self, request, pk=None):
        this_notification = Notification.objects.get(pk=pk)
        this_notification.delete()

        return Response('Notification successfully deleted.')
        

