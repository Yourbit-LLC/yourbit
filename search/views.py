from django.shortcuts import render
from django.views import View
from django.http import JsonResponse, HttpResponse
from .models import *
from user_profile.models import Profile, Bit
from feed.models import Comment
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin

import requests


#initialize environment variables
import environ
env = environ.Env()
environ.Env.read_env()


giphy_api_key = env('GIPHY_API_KEY')

# Create your views here.

class SearchResults(View):
    def get(self, request, query, type, *args, **kwargs):
        from YourbitAccounts.api.serializers import UserSerializer
        print(query)
        last_page = request.GET.get('last_page', '/')
        searched = query
        user_results = []
        user_first_name_filter = User.objects.filter(first_name__icontains = searched)
        for result in user_first_name_filter:
            if result not in user_results:
                user_results.append(result)
        user_last_name_filter = User.objects.filter(last_name__icontains = searched)
        for result in user_last_name_filter:
            if result not in user_results:
                user_results.append(result)
        bit_results = []
        bit_body_filter = Bit.objects.filter(body__icontains = searched)
        for result in bit_body_filter:
            if result not in bit_results:
                bit_results.append(result)
        bit_title_filter = Bit.objects.filter(title__icontains = searched)
        for result in bit_title_filter:
            if result not in bit_results:   
                bit_results.append(result)

        user_result_count = len(user_results)
        bit_result_count = len(bit_results)
        result_count = user_result_count + bit_result_count
        context={
            'searched' : searched,
            "result_count" : result_count,
            'user_results': user_results, 
            'bit_results': bit_results, 
            'last_page': last_page,
        }
        serialized_users = UserSerializer(user_results, many=True).data
        return JsonResponse({'results_found': True, 'result_count':result_count, 'results':serialized_users})


class ContextSearch(View):
    #Context search takes user information into account to breakdown the most relevant results
    def post(self, request, *args, **kwargs):
        from itertools import chain
        query = request.POST.get('query')
        applied_filter = request.POST.get('type')

        print("filter" + applied_filter)
        
        if applied_filter == "all" or applied_filter == "bits":
            bit_type = request.POST.get('bit_type')
            bit_results = []
            connections = request.user.profile.connections.all()
            
            if bit_type == "all":
                bit_body_filter = Bit.objects.filter(body__icontains = query)
                bit_title_filter = Bit.objects.filter(title__icontains = query)
            
            else:
                bit_body_filter = Bit.objects.filter(body__icontains = query, type = bit_type)
                bit_title_filter = Bit.objects.filter(title__icontains = query, type = bit_type)

            for result in bit_body_filter:
                if result not in bit_results:

                    if result.user in connections:
                        bit_results.append(result)

                    elif result.user == request.user:
                        bit_results.append(result)

                    elif result.is_public:
                        bit_results.append(result)

                    else:
                        pass
            
            for result in bit_title_filter:
                if result not in bit_results:

                    if result.user in connections:
                        bit_results.append(result)

                    elif result.user == request.user:
                        bit_results.append(result)

                    elif result.is_public:
                        bit_results.append(result)

                    else:
                        pass
            
            if bit_results:
                results_found = True
            
            else:
                results_found = False

            

        if applied_filter == "all" or applied_filter == "user":
            from YourbitAccounts.api.serializers import UserSerializer
            from user_profile.api.serializers import ProfileResultSerializer
            user_results = []
            user_first_name_filter = User.objects.filter(first_name__icontains = query)
            for result in user_first_name_filter:
                if result not in user_results:
                    user_results.append(result.profile)
            user_last_name_filter = User.objects.filter(last_name__icontains = query)
            for result in user_last_name_filter:
                if result not in user_results:
                    user_results.append(result.profile)

            if user_results:
                results_found = True
            else: 
                results_found = False

            user_results = ProfileResultSerializer(user_results, many=True).data

            return JsonResponse({'results_found': results_found, 'user_results': user_results})

        if applied_filter == "all" or applied_filter == "comments":
            from feed.models import InteractionHistory
            
            comment_results = []
            user_profile = Profile.objects.get(user = request.user)

            these_interactions = InteractionHistory.objects.filter(user = user_profile)
            commented_bits = these_interactions.commented_on.all()


            comment_body_filter = Comment.objects.filter(bit__in = commented_bits, body__icontains = query)
            for result in comment_body_filter:
                if result not in comment_results:
                    comment_results.append(result)

            if comment_results.length > 0:
                results_found = True
            else:
                results_found = False

            return JsonResponse({'results_found': results_found, 'comment_results': comment_results})



        
def get_trending_stickers(request):
    headers = {
    'api_key': giphy_api_key,
    "limit": "40",
    "offset": "0"
    }
    url = 'https://api.giphy.com/v1/stickers/trending'

    response = requests.get( url, headers )

    data = response.json()
    return JsonResponse(data)

