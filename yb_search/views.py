from django.shortcuts import render

from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from django.db.models import F
from yb_bits.models import Bit
from yb_accounts.models import Account as User
from yb_profile.models import Profile
from yb_profile.api.serializers import ProfileResultSerializer
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
import requests
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from yb_accounts.api.serializers import UserResultSerializer
from main.utility import initialize_session
from django.views import View
from django.conf import settings

from django.db.models import Q

#initialize environment variables
import environ
env = environ.Env()
environ.Env.read_env()

#External Search API Keys
giphy_api_key = settings.STICKER_API_KEY

def search(request):
    
    #Get query and filter from request
    query = request.GET.get('query')
    

    # #Filter for bit results
    # bit_results = []
    # bit_body_filter = Bit.objects.filter(body__icontains = query)
    # for result in bit_body_filter:
    #     if result not in bit_results:
    #         bit_results.append(result)
    # bit_title_filter = Bit.objects.filter(title__icontains = query)
    # for result in bit_title_filter:
    #     if result not in bit_results:   
    #         bit_results.append(result)

            
    # #Return count of bit results
    # bit_result_count = len(bit_results)

    filter_value = request.GET.get('filter', None)
    search_filter = filter_value.split('-')

    user_results = []

    print(search_filter)
    
    if "us" in search_filter:
        #Filter for user results
        profile_objects = Profile.objects.filter(username__icontains = query)
        for result in profile_objects:
            if result not in user_results:
                user_results.append(result)

        user_profile_filter = Profile.objects.filter(display_name__icontains = query)
        for result in user_profile_filter:
            if result not in user_results:
                user_results.append(result)

    if "or" in search_filter:
        
        orbit_objects_by_username = Profile.objects.filter(username__icontains = query, is_orbit=True)
        for result in orbit_objects_by_username:
            if result not in user_results:
                user_results.append(result)

        orbit_objects_by_name = Profile.objects.filter(display_name__icontains = query, is_orbit=True)
        for result in orbit_objects_by_name:
            if result not in user_results:
                user_results.append(result)


        # serialized_orbits = OrbitResultSerializer(orbit_results, many=True).data

    #Return count of user results
    user_result_count = len(user_results)

    serialized_users = ProfileResultSerializer(user_results, many=True).data

    #Return total count of results

    #     # Calculate ranking scores based on search relevance
    # results = serialized_users.annotate(
    #     rank=SearchRank(F('search'), SearchQuery(query))
    # )

    # # Order results by ranking score (higher rank is more relevant)
    # results = results.order_by('-rank')

    # # Paginate results
    # page = request.GET.get('page')

    # # If page is not an integer, deliver first page.

    # paginator = Paginator(results, 10)

    # try:
    #     results = paginator.page(page)
    # except PageNotAnInteger:
    #     # If page is not an integer, deliver first page.
    #     results = paginator.page(1)
    # except EmptyPage:
    #     # If page is out of range, deliver last page of results.
    #     results = paginator.page(paginator.num_pages)


    # Process and return the search results



    return JsonResponse({'results_found': True, 'result_count':user_result_count, 'results':serialized_users})


    
    # if search_filter == 'bit':
    #     # Search both the 'body' and 'title' fields of the Bit model
    #     results = Bit.objects.select_related('photo_bit', 'video_bit').annotate(
    #         search=SearchVector('username', 'body', 'title', 'tags', config='english'),  # 'english' is an example configuration, use the appropriate one
    #     ).filter(search=SearchQuery(query))

    # elif search_filter == 'user':
    #     # Search the 'username' field of the User model
    #     results = User.objects.annotate(
    #         search=SearchVector('username', 'first_name', 'last_name', config='english'),  # 'english' is an example configuration, use the appropriate one
    #     ).filter(search=SearchQuery(query))

    # print(query + '\n')
    # print(search_filter + '\n')
    # print(results)

def contact_search(request, query, filter):
    user_results = []
    user_profile = Profile.objects.get(username = request.user.active_profile)
    if filter == 'all':
        username_filter = Profile.objects.filter(username__icontains = query, public_messages = True)
        for result in username_filter:
            this_profile = Profile.objects.get(user=result)
            if this_profile not in user_results:
                user_results.append(this_profile)

        user_profile_filter = Profile.objects.filter(Q(display_name__icontains=query) & (Q(public_messages=True) | Q(friends__in=user_profile.friends.all()))).distinct()
        for result in user_profile_filter:
            if result not in user_results:
                user_results.append(result)

    elif filter == 'friends':
        user_profile_filter = Profile.objects.filter(Q(friends__in=user_profile.friends.all())).distinct()
        for result in user_profile_filter:
            if result not in user_results:
                user_results.append(result)

    elif filter == 'public':
        username_filter = Profile.objects.filter(username__icontains = query, public_messages = True)
        for result in username_filter:
            this_profile = Profile.objects.get(user=result)
            if this_profile not in user_results:
                user_results.append(this_profile)

    elif filter == 'followers':
        user_profile_filter = Profile.objects.filter(Q(display_name__icontains=query) & (Q(public_messages=True) | Q(followers__in=user_profile.followers.all()))).distinct()
        for result in user_profile_filter:
            if result not in user_results:
                user_results.append(result)

    elif filter == 'following':
        user_profile_filter = Profile.objects.filter(Q(display_name__icontains=query) & (Q(public_messages=True) | Q(following__in=user_profile.following.all()))).distinct()
        for result in user_profile_filter:
            if result not in user_results:
                user_results.append(result)

    elif filter == 'orbits':
        user_profile_filter = Profile.objects.filter(Q(display_name__icontains=query) & (Q(public_messages=True) | Q(orbits__in=user_profile.orbits.all())), is_orbit = True).distinct()
        for result in user_profile_filter:
            if result not in user_results:
                user_results.append(result)


    serialized_users = ProfileResultSerializer(user_results, many=True).data
    
    result_count = len(user_results)

    return JsonResponse({'results_found': True, 'result_count':result_count, 'results':serialized_users})

#External search functions
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

def get_trending_gifs(request):
    headers = {
    'api_key': giphy_api_key,
    "limit": "40",
    "offset": "0"
    }
    url = 'https://api.giphy.com/v1/gifs/trending'

    response = requests.get( url, headers )

    data = response.json()
    return JsonResponse(data)

#Sticker search function with giphy api
def sticker_search(request):
    headers = {
    'api_key': giphy_api_key,
    "limit": "40",
    "offset": "0"
    }
    query = request.GET.get('query')
    url = 'https://api.giphy.com/v1/stickers/search?q=' + query

    response = requests.get( url, headers )

    data = response.json()
    return JsonResponse(data)

#Gif search function with giphy api
def gif_search(request):
    headers = {
    'api_key': giphy_api_key,
    "limit": "40",
    "offset": "0"
    }
    query = request.GET.get('query')
    url = 'https://api.giphy.com/v1/gifs/search?q=' + query

    response = requests.get( url, headers )

    data = response.json()
    return JsonResponse(data)


class SearchElement(View):
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
                    'start_function': 'yb_openSpotlight(); yb_startBitStream();',    
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
        

class NewSearchPage(View):
    def get(self, request, *args, **kwargs):
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
                    'start_function': "yb_navigateTo('content-container', 'search');",    
                },

            )
        else:
            return render(
                request, 
                "main/index.html",
                {
                    'space': 'global',
                    'filter': 'p',
                    'sort': '-time', 
                    'start_function': "yb_navigateTo('content-container', 'search');",    
                },
            )
        
def search_template(request):
    return render(request, 'search/yb_search.html')