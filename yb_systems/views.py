
from django.shortcuts import render, redirect
from django.views import View
from django.utils.timezone import localtime
from django.views.generic.edit import UpdateView, DeleteView
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from .models import TaskManager
from django.core.mail import send_mail
from yb_profile.models import Profile
#import response from dajngo
from django.http import HttpResponse



class EmailTest(View):
    def get(self, request, *args, **kwargs):
        send_mail(
            'Hello from Yourbit!',
            "This is a test of Yourbit's Email System",
            "test@yourbit.me",
            ['aus.chaney@gmail.com'],
            fail_silently=False,
        )
        
class GetTasks(View):
    def get(self, request, *args, **kwargs):
        user = request.user
        task_manager = TaskManager.objects.get(user = user)
        home_task = task_manager.home_task
        message_task = task_manager.message_task
        comment_task = task_manager.comment_task
        profile_task = task_manager.profile_task
        video_task = task_manager.video_task
        tasks = {}

        if home_task:
            last_space = task_manager.last_space
            tasks.update({'#home-task':last_space})
        
        if message_task:
            conversation_data = task_manager.conversation.all
            conversations = []
            for conversation in conversation_data:
                conversations.append(conversation.id)
            tasks.update({'#message-task':conversations})
        
        if comment_task:
            comment_data = task_manager.recent_comment.all
            bits = []
            for bit in comment_data:
                bits.append(bit.id)

            tasks.update({'#comment-task':bits})

        if profile_task:
            profile_data = task_manager.recent_profile.all
            profiles = []
            for profile in profile_data:
                profiles.append(profile.id)
            
            tasks.update({'#profile-task':profiles})

        if video_task:
            suspended_videos = task_manager.video.all
            last_video = task_manager.last_video
            videos = []
            for video in suspended_videos:
                videos.append(video)

            tasks.update({'#video-task': {'last_video':last_video, 'suspended_videos':videos}})

class CurrentTask(View):
    def get(self, request, *args, **kwargs):
        task_manager = TaskManager.objects.get(user=request.user)
        current_task = task_manager.current_page
        current_data = task_manager.current_data

        JsonResponse({'current_data':current_data, 'current_task':current_task})

def SyncTask(request, *args, **kwargs):
    active_profile = Profile.objects.get(username=request.user.active_profile)
    task_manager = TaskManager.objects.get(user=active_profile)
    task_manager.current_space = request.POST.get('space')
    task_manager.current_page = request.POST.get('current_page')
    task_manager.current_data = request.POST.get('current_data')
    task_manager.current_container = request.POST.get('current_container')
    task_manager.save()
    return JsonResponse({'success':'success'})

class StartTask(View):
    def post(self, request, *args, **kwargs):
        task_manager = TaskManager.objects.get(user=request.user)
        task = request.POST.get['task']
        
        this_task = request.POST.get['this_task']
        task_manager.last_task = this_task

        current_url = request.POST.get['current_url']
        task_manager.last_url = current_url

        if task == '#home-task':
            space = request.POST.get['space']
            
            
            task_manager.last_space = space
            task_manager.home_task = True

        if task == '#message-task':
            this_conversation = request.POST.get['conversation']
            
            task_manager.message_task = True
            task_manager.conversation.add(this_conversation)

        if task == '#comment-task':
            this_comment = request.POST.get['comment']
            
            task_manager.comment_task = True
            task_manager.recent_comment.add(this_comment)

        if task == '#profile-task':
            this_profile = request.POST.get['profile']

            task_manager.profile_task = True
            task_manager.recent_profile = this_profile
        
        if task =='#video-task':
            this_video = request.POST.get['video']

            task_manager.video_task = True
            task_manager.last_video = this_video
            task_manager.video.add(this_video)

class EndTask(View):
    def post(self, request, *args, **kwargs):
        JsonResponse({'success':'success'})


class Maintenance(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'social/maintenance.html')
#Asynchronous Search queries on mobile for search suggestions


############################## 
#                            #
#-----      Tests       -----#
#                            #
##############################

class DynamicFeedTest(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'social/test-feed-page.html')



def updateTimezone(request, *args, **kwargs):
    this_profile = Profile.objects.get(username=request.user.active_profile)
    this_timezone = request.POST.get("timezone")
    print("running timezone update:" + this_timezone)
    this_profile.current_timezone = this_timezone
    this_profile.save()
    return HttpResponse({"Response":"Timezone successfully updated"})

