from django.shortcuts import render
from .models import *
from django.db.models import Q
from operator import attrgetter
from itertools import chain
from django.views import View
from main.views import initialize_session

def message_inbox(request):
    user = request.user

    # Fetch conversations. Django querysets are lazy, and won't hit the database here.
    conversations = Conversation.objects.filter(members=user).order_by('-time_modified')



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
    
class MessagePage(View):
    def get(self, request):
        
        if request.user.is_authenticated:
            init_params = initialize_session(request)
            return render(
                request, 
                "main/index.html",
                {
                    'first_login': request.user.first_login,
                    'location': init_params['last_location'],
                    'space': init_params['current_space'],
                    'filter': init_params['filter_chain'],
                    'sort': init_params['sort_by'],   
                    'start_function': 'yb_handleMessageClick(); yb_startBitStream();',    
                },

            )
        else:
            from yb_accounts.forms import RegistrationForm, LoginForm
            registration_form = RegistrationForm()
            login_form = LoginForm()
            return render(
                request,
                "registration/login.html",
                {
                    'state': 'home',
                    'registration_form': registration_form,
                    'login_form': login_form,
                }
            )