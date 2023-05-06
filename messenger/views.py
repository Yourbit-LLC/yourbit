from sndhdr import SndHeaders
from django.shortcuts import render, redirect
from django.views import View
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from .forms import *
from .models import *
from user_profile.models import Profile
from django.db.models import Q
from rest_framework.decorators import api_view

# Create your views here.
#Render messages page
class Messages(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        context = {
            "location": "inbox",
            'space':'global',
            'filter':'all',
            'sort':'chrono'
        }

        return render(request, 'main/home.html', context)

class SendMessage(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):
        conversation = request.POST.get("conversation")
        receiver = request.POST.get("receiver")
        receiver = User.objects.get(username=receiver)
        body = request.POST.get("body")
        sender = request.user
        user_first = sender.first_name
        user_last = sender.last_name
        user_name = user_first + " " + user_last
        new_message = Message()

        new_message.conversation = Conversation.objects.get(id=conversation)
        new_message.sender_user = sender
        new_message.receiver_user = receiver
        new_message.body = body
        new_message.save()
        created_at = new_message.time
        
        new_notification = Notification.objects.create(to_user = receiver, from_user = request.user, message = new_message, type=6);
        return JsonResponse({'user_name':user_name, 'body':body, 'created_at':created_at})

class ConversationView(View):
    def get(self, request, id, *args, **kwargs):
        conversation = Conversation.objects.get(id=id)
        messages = Message.objects.filter(conversation = conversation).order_by('-time')
        context={'messages':messages, 'conversation':conversation}

        unseen_messages = conversation.unseen_messages.all()

        for message in unseen_messages:
            if message.receiver_user == request.user:
                if message.is_read == False:
                    message.is_read = True
                    message.save()

        conversation.unseen_messages.clear()

        return render(request, 'messenger/conversation.html', context)

class NewConversationView(View):
    def get(self, request, *args, **kwargs):
        user = request.user
        user_profile = Profile.objects.get(user=user)
        connections = user.profile.connections.all()
        form = CreateConversation()
        context = {
            'form' : form,
            'connections':connections,

        }
        return render(request, 'messenger/create_conversation.html', context)
    def post(self, request, *args, **kwargs):
        convo_form = CreateConversation()
        new_conversation = convo_form.save(commit=False)
        username = request.POST.get('username')
        print(username)
        try:

            receiver_user = User.objects.get(username=username)
            if Conversation.objects.filter(sender_user=request.user, receiver_user=receiver_user).exists():
                conversation = Conversation.objects.filter(sender=request.user, receiver_user=receiver_user)
                return redirect('conversation', pk=conversation.pk)
            elif Conversation.objects.filter(sender_user=receiver_user, receiver_user = request.user).exists():
                conversation = Conversation.objects.filter(sender=receiver_user, receiver_user=request.user)
                return redirect('conversation', pk=conversation.pk)

            new_conversation.sender_user = request.user
            new_conversation.receiver_user = receiver_user
            new_conversation.save()
            conversation = Conversation.objects.get(sender_user=request.user)
            return JsonResponse({'conversation_id':conversation.id})
        
        except:
            return redirect('new-conversation')

@api_view(['GET'])
def check_existing_conversation(request, username):
    num_commas = username.count(",")
    
    if num_commas == 1:
        print(num_commas, " comma found")
        username = username.replace(",", "")
        username = username.replace(" ", "")
        print("id: ", "'",username,"'")


    user = request.user
    receiver_user = User.objects.get(username=username)

    try:
        conversation = Conversation.objects.get(sender=user, receiver=receiver_user)
        response = {'is_conversation':True, "conversation_recipient":receiver_user.username, "conversation_id":conversation.id}
    
    except Conversation.DoesNotExist:
        response = {"is_conversation":False}

   
    return JsonResponse(response)

@api_view(['GET'])
def check_new_messages(request, id):
    from .api.serializers import MessageSerializer
    user = request.user
    this_conversation = Conversation.objects.get(id=id)
    new_messages = this_conversation.unseen_messages.all()

    

    this_conversation.unseen_messages.clear()

    if len(new_messages) > 0:
        messages_serialized = MessageSerializer(new_messages, many=True)
        response = {"is_messages":True, "messages":messages_serialized.data}
    else:
        response = {"is_messages":False}
    return JsonResponse(response)