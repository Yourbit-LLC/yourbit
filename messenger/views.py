from sndhdr import SndHeaders
from django.shortcuts import render, redirect
from django.views import View
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from .forms import *
from .models import *
from user_profile.models import Profile
from django.db.models import Q


# Create your views here.
#Render messages page
class Messages(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        user = request.user
        user_profile = Profile.objects.get(user=user)
        conversations = Conversation.objects.select_related('receiver_user').filter(Q(sender_user = user)|Q(receiver_user = user))
        is_conversation = False
        if conversations.count != 0:
            is_conversation = True
        connections = user.profile.connections.all()
        message_form = NewMessage()

        context = {
            "is_conversation": is_conversation,
            "conversations" : conversations,
            "connections" : connections,
            
            }
        return render(request, 'messenger/messages.html', context)

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
        return JsonResponse({'user_name':user_name, 'body':body, 'created_at':created_at})

class ConversationView(View):
    def get(self, request, id, *args, **kwargs):
        conversation = Conversation.objects.get(id=id)
        messages = Message.objects.filter(conversation = conversation).order_by('-time')
        context={'messages':messages, 'conversation':conversation}

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

