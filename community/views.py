from django.shortcuts import render
from django.views import View
from YourbitAccounts.models import Account as User
from user_profile.models import Bit, Profile
from .forms import *

# Create your views here.
class CommunityList(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'community/communities.html')
    
class CreateCommunity(View):
    def post(self, request, *args, **kwargs):
        name = request.POST.get['community_name']
        creator = request.user
        admin = creator
        community_info = request.POST.get['about']
        page_type = request.POST.get['type']
        company = request.POST.get['company']

        community_form = CommunityForm()
        new_community = community_form.save(commit=False)

class CommunityView(View):
    def get(self, request, username, *args, **kwargs):
        profile_user = User.objects.get(username = username)
        profile = Profile.objects.get(user=profile_user)
        user_bits = Bit.objects.filter(user=profile_user).order_by('-created_at')
        user_profile = Profile.objects.get(user=request.user)
        user_connections = user_profile.connections.all()
        profile_id=str(profile_user.id)
        print(profile_id)
        #forms
        # profile_bit_pool = sorted(
        # chain(profile_chat, profile_photo),
        # key=attrgetter('created_at'), reverse=True)

        context = {
            'profile' : profile,
            'profile_posts': user_bits,
            'user_connections': user_connections,
            'profile_id':profile_id,
        }

        return render(request, "user_profile/profile.html", context)
