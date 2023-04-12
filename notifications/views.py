from django.shortcuts import render
from django.views import View
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from user_profile.models import Profile, Bit
from django.db.models import Q
from .models import *


# Create your views here.

#####################################################
#                    Notifications                  #
#####################################################

#Notify Other Users
class Notify(View):
    def post(self, request, *args, **kwargs):

        #Get request data
        notification_type = request.POST.get('type')
        to_user = request.POST.get('to_user')
        
        #get from user profile
        from_user = request.user
        from_user_profile = Profile.objects.get(user = from_user)

        #Get user and name
        to_user = User.objects.get(id = to_user)
        first_name = to_user.first_name
        last_name = to_user.last_name
        name = first_name + last_name

        #Get to user profile
        to_user_profile = Profile.objects.get(user=to_user)

        #Type 1 notification = Like/Dislike
        if notification_type == 1:
            bit_id = request.POST.get('bit')
            new_notification = Notification(to_user = to_user_profile, bit=bit, from_user = from_user_profile, notification_type=notification_type)
            new_notification.save()

        #Type 2 notification = Comment
        elif notification_type == 2:
            bit_id = request.POST.get('bit')
            bit = Bit.objects.get(id=bit_id)
            new_notification = Notification(to_user = to_user_profile, bit=bit, from_user = from_user_profile, notification_type=notification_type)
            new_notification.save()

        else:    
            new_notification = Notification(to_user = to_user_profile, from_user = from_user_profile, notification_type=notification_type)
        
        if to_user_profile.alerted_notifications == True:
            to_user_profile.alerted_notifications = False
        return JsonResponse({'to_user': name})

#Check if there are notifications
class NotificationStatus(View):
    def get(self, request, *args, **kwargs):
        user = request.user
        profile = Profile.objects.get(user=user)
        current_alerted_notifications = profile.alerted_notifications
        
        
        return JsonResponse({'status': current_alerted_notifications})

#Send notifications to client
class GetNotifications(View):

    def post(self, request, *args, **kwargs):    
        print("""
    
            
                    --Success--
            Get notification request received
            
            
        """)
        user = request.user
        user_id = user.id
        profile = Profile.objects.get(user = request.user)
        #Get and sort all notifications
        notification_pool = Notification.objects.filter(to_user = profile).order_by('time')
        print(notification_pool)
        request_list = []
        connect_notifications = {}
        notifications_list = {}
        iteration = 0
        
        #Package JSON response, but first check if there are notifications
        if notification_pool:

            #Add each notification to the list
            for notification in notification_pool:
                
                if notification.notification_type == 1:
                    from_user_profile = notification.from_user
                    from_user = from_user_profile.user
                    first_name = from_user.first_name
                    last_name = from_user.last_name
                    name = first_name + last_name
                    username = from_user.username
                    bit = notification.bit
                    bit = bit.id
                    time = notification.time
                    iteration += 1
                    rate_notification = 'notification' + str(iteration)
                    notifications_list.update(
                        {
                            rate_notification : 
                                {
                                    'id' : notification.id, 
                                    'time' : time,
                                    'from_user': name, 
                                    'type' : 'rate', 
                                    'bit' : bit
                                }
                        }
                    )

                elif notification.notification_type == 2:
                    print('A comment')
                    from_user_profile = notification.from_user
                    from_user = from_user_profile.user
                    first_name = from_user.first_name
                    last_name = from_user.last_name
                    name = first_name + last_name
                    username = from_user.username
                    bit = notification.bit
                    bit = bit.id
                    time = notification.time
                    comment = notification.comment
                    comment_text = comment.comment
                    iteration += 1
                    comment_notification = 'notification' + str(iteration)
                    notifications_list.update(
                        {
                            comment_notification : 
                            {
                                'id' : notification.id, 
                                'time' : time, 
                                'from_user': name, 
                                'type' : 'comment', 
                                'bit' : bit, 
                                'comment': comment_text
                            }
                        }
                    )

                elif notification.notification_type == 3:
                    print('A follow')
                    from_user_profile = notification.from_user
                    from_user = from_user_profile.user
                    first_name = from_user.first_name
                    last_name = from_user.last_name
                    name = first_name + last_name
                    username = from_user.username
                    time = notification.time
                    iteration += 1
                    follow_notification = 'notification' + str(iteration)
                    notifications_list.update(
                        {
                            follow_notification : 
                            {
                                'id' : notification.id, 
                                'time' : time, 
                                'from_user': name, 
                                'type' : 'follow'
                            }
                        }
                    )       
                
                elif notification.notification_type == 4:
                    from_user_profile = notification.from_user
                    from_user = from_user_profile.user
                    first_name = from_user.first_name
                    last_name = from_user.last_name
                    name = first_name + " " + last_name
                    username = from_user.username
                    profile_id = from_user.id
                    time = notification.time
                    iteration += 1
                    connect_notification = 'notification' + str(iteration)
                    notifications_list.update(
                        {
                            connect_notification : 
                            {
                                'id' : notification.id, 
                                'time' : time, 
                                'username':username, 
                                'type': 'connect', 
                                'from_user': name, 
                                'profile_id':profile_id
                            }
                        }
                    )
                

                elif notification.notification_type == 5:
                    from_user_profile = notification.from_user
                    from_user = from_user_profile.user
                    first_name = from_user.first_name
                    last_name = from_user.last_name
                    name = first_name + last_name
                    username = from_user.username
                    time = notification.time
                    iteration += 1
                    accept_notification = 'notification' + str(iteration)
                    notifications_list.update(
                        {
                            accept_notification : 
                            {
                                'id' : notification.id, 
                                'time' : time, 
                                'from_user' : name, 
                                'type' : 'accept_request'
                            }
                        }
                    )

                else:
                    from_user_profile = notification.from_user
                    from_user = from_user_profile.user
                    first_name = from_user.first_name
                    last_name = from_user.last_name
                    name = first_name + " " + last_name
                    username = from_user.username
                    time = notification.time
                    iteration += 1
                    message_notification = 'notification' + str(iteration)
                    notifications_list.update(
                        {
                            accept_notification : 
                        {
                                'id' : notification.id, 
                                'time' : time, 
                                'from_user' : name, 
                                'type' : 'message',
                            }
                        }
                    )


        return JsonResponse(notifications_list)


class Count(View):
    def get(self, request, *args, **kwargs):
       
        user = request.user
        profile = Profile.objects.get(user=user)
        
        message_notifications = Notification.objects.filter(to_user=user, type=6).count()
        
        connection_notifications = Notification.objects.filter(to_user=user, type=4).count()
        connection_notifications += Notification.objects.filter(to_user=user, type=5).count()
        connection_notifications += Notification.objects.filter(to_user=user, type=3).count()
        
        print("\n\n" + "Connection Notifications: " + str(connection_notifications) + "\n\n")
        general_notifications = Notification.objects.filter(to_user=user, type=1).count()
        general_notifications += Notification.objects.filter(to_user=user, type=2).count()
        general_notifications += Notification.objects.filter(to_user=user, type=7).count()

        return JsonResponse({'message_count': message_notifications, 'connection_count': connection_notifications, 'general_count': general_notifications})