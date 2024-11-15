from django.shortcuts import render
from .models import *
from django.db.models import Q
from operator import attrgetter
from itertools import chain
from django.views import View
from main.views import initialize_session
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.core.paginator import Paginator
import json

from yb_profile.models import Profile

def message_inbox(request):
    from .models import MessageCore
    user = request.user

    active_profile = request.user.active_profile
    this_profile = Profile.objects.get(username = active_profile)

    try:
        message_core = MessageCore.objects.get(profile = this_profile) 

    except:
        message_core = MessageCore.objects.create(profile = this_profile)

    try:
        conversations = message_core.conversations.all().order_by("-time_modified")
        onload = None 

    except:
        conversations = message_core.conversations.all().order_by("-time_modified")
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
            

            print(conversation.id)

            preview_message = Message.objects.filter(conversation = conversation).last()
            
            if preview_message.from_user == user:
                preview_text = "<b>You:</b> " + preview_message.body[:150] + '...'

            else:
                preview_text = preview_message.from_user.user.first_name + ": " + preview_message.body[:150] + '...' 
            conversation_data.append({"id": conversation.id, "time":conversation.time_modified, "preview": preview_text})

            

            if conversation.is_name == True:
                conversation_data[iteration]["name"] = conversation.name
                conversation_data[iteration]["image"] = this_profile.custom.profile_image.small_thumbnail_ext
            else:
                if len(conversation.members.all()) > 2:
                    display_name = ""
                    contact_iteration = 1

                    for member in conversation.members.all():
                        this_display_name = member.display_name.split(" ")
                        
                        if member != this_profile:
                            if conversation.members.count() == 3:
                                if contact_iteration == 1:
                                    display_name += this_display_name[0] + " " + this_display_name[1][0] + "." + " and "
                                    contact_iteration += 1
                                
                                else:
                                    display_name += this_display_name[0] + " " + this_display_name[1][0]  + "."


                            else:

                                if contact_iteration <= conversation.members.count()-1:
                                    display_name += this_display_name[0] + " " + this_display_name[1][0]  + "." + ", "
                                    contact_iteration += 1

                                else:
                                    display_name += " and " + this_display_name[0] + " " + this_display_name[1][0]  + "."



                    conversation_data[iteration]["name"] = display_name
                    conversation_data[iteration]["image"] = this_profile.custom.profile_image.small_thumbnail_ext
                    conversation_data[iteration]["is_group"] = True

                else:
                    for member in members:
                        print(member.display_name)
                        print(this_profile.display_name)
                        if member !=  this_profile:
                            conversation_data[iteration]["name"] = member.display_name
                            if member.custom.profile_image.storage_type == "yb":
                                conversation_data[iteration]["image"] = member.custom.profile_image.small_thumbnail.url
                            else:
                                conversation_data[iteration]["image"] = member.custom.profile_image.small_thumbnail_ext
                            conversation_data[iteration]["is_group"] = False

            iteration += 1

    context = {
        "conversations": is_conversations,
        'results': conversation_data,
        'onload': onload,
        
        
    }

    print(context)

    return render(request, "yb_messages/messages.html", context)

class ConversationSettings(View):
    def get(self, request, id, *args, **kwargs):
        this_conversation = Conversation.objects.get(id = id)
        return render(request, "yb_messages/conversation_settings.html", context={"conversation": this_conversation})

    def post(self, request, id, *args, **kwargs):
        print(request.POST)
        this_conversation = Conversation.objects.get(id = id)
        this_conversation.name = request.POST["name"]
        
        if this_conversation.name != "Untitled Conversation":
            this_conversation.is_name = True

        else:
            this_conversation.is_name = False

        if request.POST["from-user-color"]:
            this_conversation.from_user_color = request.POST["from-user-color"]
        
        else:
            print("From user color missing")

        
        if request.POST["to-user-color"]:
            this_conversation.to_user_color = request.POST["to-user-color"]
        
        else:
            print("To user color missing")

        # this_conversation.is_joinable = True if request.POST["is-joinable"] == "on" else False
        # this_conversation.members_can_invite = True if request.POST["members-can-invite"] == "on" else Fals
        # e
        this_conversation.save()
        
        return render(request, "yb_messages/conversation_settings.html", context={"conversation": this_conversation})

def filter_contacts_list(request, contact_filter, query=None):
    """
    This view filters the contact list based on the filter passed in the URL.
    The filter can be "all", "friends", "following", "followers", or "orbits".
    If a query is provided, it searches contacts by the query; otherwise, it
    returns all connections for the selected filter.
    """
    # Retrieve the active user profile
    profile = Profile.objects.get(username=request.user.active_profile)

    connections = False  # Initialize connections variable

    # Helper function to filter by search query
    def apply_search_filter(queryset, query):
        if query:  # Apply search filter only if query is provided
            return queryset.filter(Q(username__icontains=query) | Q(full_name__icontains=query))
        return queryset  # Return original queryset if no query

    # Default results
    results = []

    if contact_filter == "all":
        friends = apply_search_filter(profile.friends.all(), query)
        following = apply_search_filter(profile.follows.all(), query)
        followers = apply_search_filter(profile.followers.all(), query)

        # Chain together all the querysets
        results = list(chain(friends, following, followers))
        connections = any([friends.exists(), following.exists(), followers.exists()])

    elif contact_filter == "friends":
        results = apply_search_filter(profile.friends.all(), query)
        connections = results.exists()

    elif contact_filter == "following":
        results = apply_search_filter(profile.follows.all(), query)
        connections = results.exists()

    elif contact_filter == "followers":
        results = apply_search_filter(profile.followers.all(), query)
        connections = results.exists()

    elif contact_filter == "orbits":
        orbits = profile.followers.filter(is_orbit=True)
        results = apply_search_filter(orbits, query)
        connections = results.exists()

    context = {
        "results": results,
        "connections": connections,
    }
    return render(request, "yb_messages/contact_list.html", context)

def new_conversation_template(request):
    """
        This view is used to render the new conversation 
        template and return it to client.
    """
    user = request.user 
    profile = Profile.objects.get(username=user.active_profile)
    friends = profile.friends.all()

    context = {}

    if len(friends) == 0:
        connections = False

    else:
        connections = True
        context["results"] = friends

    context["connections"] = connections

    return render(request, "yb_messages/create_conversation.html", context)

class ConversationView(View):
    def get(self, request, id, *args, **kwargs):

        this_id = id
        
        context = {}

        this_conversation = Conversation.objects.get(id = this_id)
        
        messages = Message.objects.filter(conversation = this_conversation).order_by("time")

        active_profile = Profile.objects.get(username = request.user.active_profile)

        
        # p = Paginator(messages, 10)

        # page = self.request.GET.get('page')

        # print("\n\n" + page + "\n\n")

        # if page:

        #     try:
        #         messages = p.page(page)

        #     except:
        #         messages = None


        members = this_conversation.members.all()

        context["conversation"] = this_conversation
        context["messages"] = messages

        if this_conversation.is_name == True:
            context["conversation_name"] = this_conversation.name

        else:
            if len(this_conversation.members.all()) > 2:
                    display_name = ""
                    contact_iteration = 1

                    for member in this_conversation.members.all():
                        this_display_name = member.display_name.split(" ")
                        
                        if member != active_profile:
                            if this_conversation.members.count() == 3:
                                if contact_iteration == 1:
                                    display_name += this_display_name[0] + " " + this_display_name[1][0] + "." + " and "
                                    contact_iteration += 1
                                
                                else:
                                    display_name += this_display_name[0] + " " + this_display_name[1][0]  + "."


                            else:

                                if contact_iteration <= this_conversation.members.count()-1:
                                    display_name += this_display_name[0] + " " + this_display_name[1][0]  + "." + ", "
                                    contact_iteration += 1

                                else:
                                    display_name += " and " + this_display_name[0] + " " + this_display_name[1][0]  + "."

                    context["conversation_name"] = display_name

            else:
                for member in members:
                    if member !=  active_profile:
                        context["conversation_name"] = member.display_name
        try:
            last_message = messages.last()
            last_id = last_message.id

            context["last_message"] = last_id
        except:
            last_id = 0

            

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
        

@api_view(['GET'])
def check_new_messages(request, id, last_message):
    from .api.serializers import MessageSerializer
    user = request.user
    this_conversation = Conversation.objects.get(id=id)
    active_profile = Profile.objects.get(username = user.active_profile)
    new_messages = Message.objects.filter(id__gt=int(last_message), conversation=this_conversation).exclude(from_user = active_profile)

    if len(new_messages) > 0:
        messages_serialized = MessageSerializer(new_messages, many=True)
        response = {"is_messages":True, "messages":messages_serialized.data}
    else:
        response = {"is_messages":False}
    
    
    return JsonResponse(response)

