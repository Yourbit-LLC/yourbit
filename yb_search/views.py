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
from main.views import initialize_session
from django.views import View

#initialize environment variables
import environ
env = environ.Env()
environ.Env.read_env()

#External Search API Keys
giphy_api_key = env('GIPHY_API_KEY')

def search(request):
    
    #Get query and filter from request
    query = request.GET.get('query')
    search_filter = request.GET.get('filter')

    #Filter for bit results
    bit_results = []
    bit_body_filter = Bit.objects.filter(body__icontains = query)
    for result in bit_body_filter:
        if result not in bit_results:
            bit_results.append(result)
    bit_title_filter = Bit.objects.filter(title__icontains = query)
    for result in bit_title_filter:
        if result not in bit_results:   
            bit_results.append(result)

            
    #Return count of bit results
    bit_result_count = len(bit_results)

    #Filter for user results
    user_results = []
    username_filter = User.objects.filter(username__icontains = query)
    for result in username_filter:
        this_profile = Profile.objects.get(user=result)
        if this_profile not in user_results:
            user_results.append(this_profile)

    user_profile_filter = Profile.objects.filter(display_name__icontains = query)
    for result in user_profile_filter:
        if result not in user_results:
            user_results.append(result)


    #Return count of user results
    user_result_count = len(user_results)

    serialized_users = ProfileResultSerializer(user_results, many=True).data

    #Return total count of results
    result_count = user_result_count + bit_result_count

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



    return JsonResponse({'results_found': True, 'result_count':result_count, 'results':serialized_users})


    
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
                    'start_function': 'yb_openSpotlight()',    
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