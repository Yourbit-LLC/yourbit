from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from user_profile.api.serializers import BitSerializer
from .serializers import *
from rest_framework.response import Response
from django.db.models import Q
from operator import attrgetter
from django.http import JsonResponse
from rest_framework.renderers import JSONRenderer
from rest_framework.decorators import api_view

class CommentViewSet(viewsets.ViewSet):
    def get_queryset(self, request):
        if request.query_params:
            this_id = request.query_params.get("id")
            this_bit = Bit.objects.get(id=this_id)
            these_comments = Comment.objects.get(bit = this_bit)

            serializer_class = CommentSerializer(these_comments, many = True)

            return Response(serializer_class.data)

        else:
            these_comments = Comment.objects.get(user = request.user)
            return Response(serializer_class.data)

    def list(self, request):
        these_comments = self.get_queryset()

        serializer_class = CommentSerializer(these_comments, many = True)

        return Response(serializer_class.data)

    def create(self, request):
        this_id = request.POST.get("this_id")

        body = request.POST.get("body")

        this_bit = Bit.objects.get(pk=this_id)

        this_user = request.user

        new_comment = Comment()

        new_comment.sender = this_user

        new_comment.body = body

        new_comment.bit(this_bit)

        new_comment.save()

        serializer_class = CommentSerializer(new_comment, many=False)

        return Response(serializer_class.data)

    def update(self, request, pk=None):
        this_comment = Comment.objects.get(pk=pk)

        if this_comment.sender == request.user:
            new_comment = request.POST.get("body")
            this_comment.body = new_comment
            this_comment.save()

            serializer_class = CommentSerializer(this_comment, many = False)
            return Response(serializer_class.data)

        else:
            return Response("Unauthorized Request.")

    def destroy(self, request, pk=None):
        this_comment = Comment.objects.get(id = pk)
        this_comment.delete()

        return Response('Comment Deleted Successfully.')

class InteractionViewSet(viewsets.ViewSet):
    def list(self, request):
        these_interactions = InteractionHistory(user=request.user)

        serializer_class = InteractionSerializer(these_interactions, many=False)

        return Response(serializer_class.data)
        
    def retrieve(self, request, pk = None):
        these_interactions = InteractionHistory(id = pk)

        serializer_class = InteractionSerializer(these_interactions, many=False)

        return Response(serializer_class.data)

    def update(self, request):
        interactions = InteractionHistory.objects.get(user=request.user)
        this_id = request.POST.get("this_id")
        this_bit = Bit.objects.get(id = this_id)
        

        if this_bit not in interactions.interacted_with.all():
            interactions.interacted_with.add(this_bit)

        this_action = request.POST.get("this_action")

        if this_action == "like":
            
            interactions.liked_bits.add(this_bit)


        if this_action == "dislike":

            interactions.disliked_bits.add(this_bit)

        if this_action == "comment":

            interactions.commented_on.add(this_bit)

        if this_action == "share":

            interactions.shared_bits.add(this_bit)

        if this_action == "donate":

            interactions.bit_donation.add(this_bit)

        if this_action == "fed":
            updateFed(request)

        if this_action == "seen":
            updateSeen(request)

def updateFed(request):
    this_id = request.POST.get("this_id")
    interaction_history = InteractionHistory.objects.get(user = request.user)
    this_bit = Bit.objects.get(id=this_id)
    interaction_history.unfed_bits.remove(this_bit)


def updateSeen(request):  
    this_id = request.POST.get("this_id")
    this_bit = Bit.objects.get(id=this_id)
    interaction_history = InteractionHistory.objects.get(user=request.user)
    interaction_history.unseen_bits.remove(this_bit)
    interaction_history.seen_bit.add(this_bit)

def updateInteracted(request):
    this_id = request.POST.get("this_id")
    this_bit = Bit.objects.get(id = this_id)
    interaction_history = InteractionHistory.objects.get(user = request.user)
    interaction_history.interacted_with.add(this_bit)