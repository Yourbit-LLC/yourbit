from django.shortcuts import render
from .models import *
from django.db.models import Q
from operator import attrgetter
from itertools import chain
from django.views import View
from main.views import initialize_session

def message_inbox(request):
    
    import requests

    # API endpoint URL
    url = "https://yourbit.me/messages/api/conversations/"

    # Making a GET request to the API
    response = requests.get(url)

    # Checking if the request was successful
    if response.status_code == 200:
        # The request was successful; you can process the response data
        conversations = response.json()
        print("Fetched conversations:", conversations)
    else:
        # There was an error fetching the data
        print("Failed to fetch data. Status code:", response.status_code, "Response:", response.text)



    context = {
        'conversations': response,
        
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
                    member = members[member]
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