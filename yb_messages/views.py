from django.shortcuts import render
from .models import *
from django.db.models import Q
from operator import attrgetter
from itertools import chain
from django.views import View

def message_inbox(request):
    user = request.user

    # Fetch conversations. Django querysets are lazy, and won't hit the database here.
    conversations = Conversation.objects.filter(members=user).sort_by('-time_modified')



    context = {
        'conversations': conversations,
        
    }

    print(context)

    return render(request, "yb_messages/messages.html", context)

def new_conversation_template(request):
    return render(request, "yb_messages/create_conversation.html", {})

class ConversationView(View):
    def get(self, request, *args, **kwargs):
        user = request.user

        #Get type data from url
        conversation_type = kwargs['type']

        conversation_id = kwargs['conversation_id']

        conversation = Conversation.objects.get(id=conversation_id)

        messages = conversation.messages.all()

        context = {
            'messages': messages,
            'conversation': conversation,
        }

        return render(request, "yb_messages/conversation.html", context)

    def post(self, request, *args, **kwargs):
        user = request.user
        conversation_id = kwargs['conversation_id']

        conversation = Conversation.objects.get(id=conversation_id)

        message = request.POST.get('message')

        new_message = Message(
            sender=user,
            body=message,
        )

        new_message.save()

        conversation.messages.add(new_message)

        messages = conversation.messages.all()

        context = {
            'messages': messages,
            'conversation': conversation,
        }

        return render(request, "yb_messages/conversation.html", context)