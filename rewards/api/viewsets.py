from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from .serializers import *
from ..models import *

class RewardsViewSet(viewsets.ViewSet):
    def retrieve(self, request, pk=None):
        this_rewards = Rewards.objects.get(pk=pk)

        serializer_class = RewardSerializer(this_rewards, many=False)

        return Response(serializer_class.data)

    def update(self, request):

        ADD_VALUES = {
            #Actions
            'rate' : 1,
            'share' : 2,
            'comment' : 5,
            'write_bit' : 5,
            'upload_video' : 10,

            #Achievements
            'first_bit' : 100,
            'first_video' : 100,
            'first_photo' : 100,
            'first_friend': 100,
            'first_follower' : 100,
            'invite_user' : 1000

        }


        this_rewards = Rewards.objects.get(user = request.user)
        type = request.POST.get("type") #bit, profile, achievement
        action = request.POST.get("action") #add, subtract
        value = request.POST.get("value") #see value list

        if action == 'add':
            if type == 'bit':
                this_id = request.POST.get("this_id")
                this_bit = Bit.objects.get(id=this_id)
                this_rewards.rewards_earned += ADD_VALUES[value]
                this_rewards.point_balance += ADD_VALUES[value]

                if value == 'rate':
                    this_rewards.earned_rates.add(this_bit)

                if value == 'comment':
                    this_rewards.earned_comments.add(this_bit)

                
                if value == 'share':
                    this_rewards.earned_shares.add(this_bit)
            
            if type == 'profile':
                this_rewards.rewards_earned += ADD_VALUES[value]


            if type == 'achievement':
                this_rewards.rewards_earned += ADD_VALUES[value]

            return Response('Rewards Points Added.')

        if action == 'subtract':
            this_amount = request.POST.get("this_amount")
            this_rewards.point_balance -= this_amount
            
            return Response('Rewards Points Subtracted.')




            

        