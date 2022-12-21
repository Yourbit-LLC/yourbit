from django.shortcuts import render
from django.views import View
from django.http import JsonResponse
from .models import *
from user_profile.models import Profile, Bit
from feed.models import Comment
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin

# Create your views here.

class SearchResults(View):
    def post(self, request, query, *args, **kwargs):
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
        return render(request, "search/search_results.html", context)

class PreSearch(View):
    def post(self, request, *args, **kwargs):
        #stuff
        if "submit-search" in request.POST:
            searched = request.POST.get('query')
        else:
            searched = request.POST['query']
        print(searched)
        user_results_working = []
        user_results = {}
        end_results = {}
        user_first_name_filter = User.objects.select_related('profile').filter(first_name__icontains = searched)
        for result in user_first_name_filter:
            if result not in user_results_working:
                user_results_working.append(result)
                first_name = result.first_name
                last_name = result.last_name
                username = result.username
                profile = result.profile
                custom  = profile.custom
                image = custom.image.url
                name = first_name + " " + last_name
                user_results.update({username: {'name' : name, 'image' : image}})

        user_last_name_filter = User.objects.select_related('profile').filter(last_name__icontains = searched)
        for result in user_last_name_filter:
            if result not in user_results_working:
                user_results_working.append(result)
                first_name = result.first_name
                last_name = result.last_name
                username = result.username
                profile = result.profile
                custom  = profile.custom
                image = custom.image.url
                name = first_name + " " + last_name
                user_results.update({username: {'name' : name, 'image' : image}})

        username_filter = User.objects.select_related('profile').filter(username__icontains = searched)
        for result in username_filter:
            if result not in user_results_working:
                user_results_working.append(result)
                first_name = result.first_name
                last_name = result.last_name
                username = result.username
                profile = result.profile
                custom  = profile.custom
                image = custom.image.url
                name = first_name + " " + last_name
                user_results.update({username: {'name' : name, 'image' : image}})

        print(user_results)
        response = {'user_results': user_results}
        if "submit-search" in request.POST:
            context = {"user_results" : user_results_working}
            return render(request, 'search/search_results.html', context)
        else:
            return JsonResponse(response)
