from rest_framework import viewsets
from rest_framework.response import Response
from ..models import Notification
from .serializers import NotificationSerializer, MessageNotificationSerializer
from itertools import chain
from operator import attrgetter


class NotificationViewset(viewsets.ViewSet):

    #Get query set from query params to filter only notifications for user
    def get_queryset(self, request):


        user_profile = request.user
        if request.query_params:
            type=request.query_params.get("filter")
            if type == "connections":
                print("connections")
                queryset_1 = Notification.objects.filter(to_user = user_profile, type = 3)
                queryset_2 = Notification.objects.filter(to_user = user_profile, type = 4)
                queryset_3 = Notification.objects.filter(to_user = user_profile, type = 5)

                print(queryset_3)
                queryset = sorted(chain(queryset_1, queryset_2, queryset_3), key=attrgetter('time'), reverse=True)            

                print(queryset)
            elif type == "bits":
                queryset_1 = Notification.objects.filter(to_user = user_profile, type = 1)
                queryset_2 = Notification.objects.filter(to_user = user_profile, type = 2)
                queryset = sorted(chain(queryset_1, queryset_2), key=attrgetter('time'), reverse=True)              

            elif type == "messages":
                queryset = Notification.objects.filter(to_user = user_profile, type = 6).order_by('-time')



        else:
            queryset = Notification.objects.filter(to_user = user_profile).order_by('-time')


        return queryset

    #Serialize and list results from query set
    def list(self, request):
        queryset = self.get_queryset(request)
        type=request.query_params.get("filter")
        if len(queryset) == 0:
            return Response({"found_notifications": False, "message": "No notifications found."})
        
        else:
            if type == "messages":
                serializer_class = MessageNotificationSerializer(queryset, many=True)
                return Response({"found_notifications": True, "list" : serializer_class.data, "type": "messages"})
            
            else: 
                serializer_class = NotificationSerializer(queryset, many=True)
                print(serializer_class.data)
                return Response({"found_notifications": True, "list" : serializer_class.data})

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
        

