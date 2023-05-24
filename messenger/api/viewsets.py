
# Messages Viewsets

from rest_framework import viewsets
from ..models import *
from .serializers import *
from rest_framework.response import Response

class MessageViewSet(viewsets.ViewSet):
    def list(self, request):

        queryset = Message.objects.filter(sender=request.user)

        if len(queryset) > 1:
            serializer_class = MessageSerializer(queryset, many=True)
            this_response = {"messages_found":True, "messages":serializer_class.data}
        elif len(queryset) == 1:
            serializer_class = MessageSerializer(queryset, many=False)
            this_response = {"messages_found":True, "messages":serializer_class.data}
        else:
            this_response = {"messages_found":False, "messages":"No conversations found."}
        
        return Response(this_response)

    def create(self, request):
        from notifications.models import Notification
        from user_profile.models import Custom, Profile
        new_message = Message()
        new_message.body = request.data.get("body")
        new_message.sender = request.user
      
        this_username = request.data.get("receiver")

        num_commas = this_username.count(",")
        
        if num_commas == 1:
            print(num_commas, " comma found")
            this_username = this_username.replace(",", "")
            this_username = this_username.replace(" ", "")
            print("id: ", "'",this_username,"'")

        sender_profile = Profile.objects.get(user = request.user)
        custom = Custom.objects.get(profile = sender_profile)
        
        new_message.sender_custom = custom
        print("username: ", this_username)
        receiver = User.objects.get(username = this_username)

        new_message.receiver = receiver
        new_message.save()



        if request.data.get("new_conversation") == False:
            this_conversation = Conversation.objects.get(sender = request.user, receiver = receiver)
            that_conversation = Conversation.objects.get(receiver = request.user, sender = receiver)
        else:
            this_conversation = Conversation.objects.create(sender = request.user, receiver = receiver, receiver_custom = receiver.profile.custom)
            that_conversation = Conversation.objects.create(receiver = request.user, sender = receiver, receiver_custom = custom)

        print(this_conversation)
        print(that_conversation)
        
        this_conversation.messages.add(new_message)
        that_conversation.unseen_messages.add(new_message)
        this_conversation.save()
        that_conversation.messages.add(new_message)
        that_conversation.save()

        
        new_notification = Notification(from_user = request.user, to_user = receiver, type = 6, message = new_message, conversation=that_conversation)
        new_notification.save()

        this_conversation_serialized = ConversationSerializer(this_conversation, many = False)
        message_serializer_class = MessageSerializer(new_message, many = False)

        return Response({"conversation": this_conversation_serialized.data, "message": message_serializer_class.data})

    def destroy(self, request, pk=None):
        from api.dialogue_processors import getDialogue
        this_message = Message.objects.get(id=pk)
        this_sender = this_message.sender
        if this_sender == request.user:
            this_user = request.user
            that_user = this_message.receiver

        else:
            this_user = request.user
            that_user = request.user

        this_message = getDialogue('delete', 'message', this_user, that_user)
        this_message.delete()

        return Response({"Message": 'Message Successfully Deleted.'})

class ConversationViewSet(viewsets.ViewSet):
    def get_queryset(self):
        filter_param = self.request.query_params.get('filter')
        if filter_param == "all":
            queryset = Conversation.objects.filter(sender=self.request.user)

        elif filter_param == "friends":
            from user_profile.models import Profile
            this_profile = Profile.objects.get(user = self.request.user)
            this_friends = this_profile.connections.all()
            this_friends_accounts = [x.user for x in this_friends]
            queryset = Conversation.objects.filter(sender=self.request.user, receiver__in = this_friends_accounts)

        elif filter_param == "following":
            from user_profile.models import Profile
            this_profile = Profile.objects.get(user = self.request.user)
            this_following = this_profile.follows.all()
            this_following_accounts = [x.user for x in this_following]
            queryset = Conversation.objects.filter(sender=self.request.user, receiver__in = this_following_accounts)

        elif filter_param == "public":
            from user_profile.models import Profile
            this_profile = Profile.objects.get(user = self.request.user)
            queryset = Conversation.objects.filter(sender=self.request.user)

        return queryset
    
    def list(self, request):
        queryset = self.get_queryset()

        

        if len(queryset) > 1:
            serializer_class = ConversationSerializer(queryset, many=True)
            this_response = {"convos_found":True, "convos":serializer_class.data}
        elif len(queryset) == 1:
            serializer_class = ConversationSerializer(queryset, many=True)
            print(serializer_class.data)
            this_response = {"convos_found":True, "convos":serializer_class.data}
        else:
            this_response = {"convos_found":False, "message":"No conversations found."}
        
        return Response(this_response)
        

    def destroy(self, request, pk=None):
        this_conversation = Conversation.objects.get(id = pk)

        this_conversation.delete()

        return Response('Conversation Successfully Deleted.')
    
    def retrieve(self, request, pk=None):
        this_conversation = Conversation.objects.get(id=pk)
        this_receiver = this_conversation.receiver
        this_receiver = this_receiver.first_name + " " + this_receiver.last_name
        these_messages = this_conversation.messages.all().order_by("-time")



        serializer_class = MessageSerializer(these_messages, many=True)

        return Response({"receiver": this_receiver, "messages": serializer_class.data})



