from django.shortcuts import render
from .models import *
from django.db.models import Q
from operator import attrgetter
from itertools import chain
from django.views import View
from main.views import initialize_session

from yb_profile.models import Profile

def message_inbox(request):
    from .models import MessageCore
    user = request.user

    profile = Profile.objects.get(user = user)

    try:
        message_core = MessageCore.objects.get(profile = profile) 

    except:
        message_core = MessageCore.objects.create(profile = profile)

    try:
        conversations = message_core.conversations.all()
        onload = None 

    except:
        conversations = message_core.conversations.all()
        onload = "yb_handleMessageClick()"

    if len(conversations) == 0:
        is_conversations = False

    else:
        is_conversations = True

    conversation_data = []

    if is_conversations:
        iteration = 0

        for conversation in conversations:

            members = conversation.members.all()

            conversation_data.append({"id": conversation.id, "time":conversation.time_modified})

            if conversation.is_name == True:
                conversation_data[iteration]["name"] = conversation.name
                conversation_data[conversation]["image"] = user.profile.custom.profile_image.small_thumbnail

            else:
                if len(conversation.members.all()) > 2:
                    conversation_data[iteration]["name"] = str(conversation.members.count()) + " People"
                    conversation_data[iteration]["image"] = user.profile.custom.profile_image.small_thumbnail

                else:
                    for member in members:
                        if member !=  request.user:
                            conversation_data[iteration]["name"] = member.profile.display_name
                            conversation_data[iteration]["image"] = member.profile.custom.profile_image.small_thumbnail.url

            iteration += 1

    context = {
        "conversations": is_conversations,
        'results': conversation_data,
        'onload': onload
        
    }

    print(context)

    return render(request, "yb_messages/messages.html", context)

def new_conversation_template(request):
    return render(request, "yb_messages/create_conversation.html", {})

class ConversationView(View):
    def get(self, request, id, *args, **kwargs):

        this_id = id
        
        context = {}

        this_conversation = Conversation.objects.get(id = this_id)
        messages = Message.objects.filter(conversation = this_conversation)

        members = this_conversation.members.all()

        context["conversation"] = this_conversation
        context["messages"] = messages

        if this_conversation.is_name == True:
            context["conversation_name"] = this_conversation.name

        else:
            if len(this_conversation.members.all()) > 2:
                context["conversation_name"] = str(this_conversation.members.count()) + " People"

            else:
                for member in members:
                    if member !=  request.user:
                        context["conversation_name"] = member.profile.display_name
            

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