
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
            this_response = {"convos_found":True, "convos":serializer_class.data}
        elif len(queryset) == 1:
            serializer_class = MessageSerializer(queryset, many=False)
            this_response = {"convos_found":True, "convos":serializer_class.data}
        else:
            this_response = {"convos_found":False, "message":"No conversations found."}

        return Response(this_response)

    def create(self, request):
        new_message = Message()
        new_message.body = request.POST.get("body")
        new_message.sender = request.user
        receiver = request.POST.get("receiver")
        new_message.receiver = receiver
        new_message.save()

        conversation1 = Conversation.objects.get_or_create(sender = request.user, receiver = receiver)
        conversation2 = Conversation.objects.get_or_create(receiver = request.user, sender = receiver)

        conversation1.add(new_message)
        conversation2.add(new_message)
        
        serializer_class = MessageSerializer(new_message, many = False)

        return Response(new_message)

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
    def list(self, request):
        queryset = Conversation.objects.filter(sender = request.user)

        serializer_class = ConversationSerializer(queryset, many=True)

        return Response(serializer_class.data)

    def destroy(self, request, pk=None):
        this_conversation = Conversation.objects.get(id = pk)

        this_conversation.delete()

        return Response('Conversation Successfully Deleted.')
    
    def retrieve(self, request, pk=None):
        this_conversation = Conversation.objects.get(id=pk)

        serializer_class = ConversationSerializer(this_conversation, many=False)

        return Response(serializer_class.data)



