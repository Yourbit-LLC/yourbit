from django.shortcuts import render
from .models import *
from django.db.models import Q
from operator import attrgetter
from itertools import chain
from django.views import View

def message_inbox(request):
    user = request.user

    # Fetch conversations. Django querysets are lazy, and won't hit the database here.
    solo_conversations = OneToOneConversation.objects.filter(sender=user)
    group_conversations = GroupConversation.objects.filter(members=user)

    # Check if both querysets are empty
    if not solo_conversations.exists() and not group_conversations.exists():
        conversations = False
        conversation_list = None
        print("no conversations")
    else:
        # Combine and sort the conversations
        conversations = True
        conversation_list = sorted(
            chain(solo_conversations, group_conversations), 
            key=attrgetter('time_modified'), 
            reverse=True
        )
        print("some conversations")

    context = {
        'conversations': conversations,
        'results': conversation_list,
    }

    print(context)

    return render(request, "yb_messages/messages.html", context)

def new_conversation_template(request):
    return render(request, "yb_messages/create_conversation.html", {})

class ConversationView(View):
    def get(self, request, *args, **kwargs):
        user = request.user
        conversation_id = kwargs['conversation_id']
        conversation = Conversation.objects.get(id=conversation_id)

        if conversation.is_group:
            group_conversation = GroupConversation.objects.get(id=conversation_id)
            messages = Message.objects.filter(conversation=group_conversation)
        else:
            one_to_one_conversation = OneToOneConversation.objects.get(id=conversation_id)
            messages = Message.objects.filter(conversation=one_to_one_conversation)

        context = {
            'messages': messages,
            'conversation': conversation,
        }

        return render(request, "yb_messages/conversation.html", context)

    def post(self, request, *args, **kwargs):
        user = request.user
        conversation_id = kwargs['conversation_id']
        conversation_type = kwargs['conversation_type']

        conversation = None

        if conversation_type == 'group':
            conversation = GroupConversation.objects.get(id=conversation_id)
        else:
            conversation = OneToOneConversation.objects.get(id=conversation_id)

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