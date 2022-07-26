import profile
from django.forms import RadioSelect
from django.shortcuts import render, redirect
from django.views import View
from .forms import *
from itertools import chain
from operator import attrgetter
from django.utils.timezone import localtime
from django.views.generic.edit import UpdateView, DeleteView
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from django.views.generic.base import ContextMixin
#from PIL import Image

# Create your views here. 
# class CoreUIMixIn(ContextMixin, View):
#     def get_context_data(self, **kwargs):
#         context = super(CoreUIMixIn, self).get_context_data(**kwargs)
#         chatbit_form = ChatBitForm()
#         search_bar = SearchBar()
#         write_comment = CommentForm()
#         friend_requests = ConnectRequest.objects.filter(to_user = request.user)
#         notification_length = len(friend_requests)

#Render view for homepage

class Home(View):
    def get(self, request, *args, **kwargs):
        return render(request, "social/home.html")

#Create Bit

class CreateBit(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        last_page = request.GET.get('last_page', '/')
        bit_form = BitForm()
        context = { 
            'last_page':last_page,
            'bit_form':bit_form,
        }
        return render(request, 'social/create_bit.html', context)
    
    def post(self, request, *args, **kwargs):
        
        bit_form = BitForm(request.POST, request.FILES)
        
        if bit_form.is_valid():
            bit_type = request.POST.get('bit_type')
            new_bit = bit_form.save(commit=False)
            new_bit.bit_type = bit_type
            new_bit.user = request.user
            new_bit.save()
            bits = Bit.objects.all()
        last_page = request.POST.get('last_page', '/')
        return HttpResponseRedirect(last_page)

#Bit details expanded

class BitDetailView(View):
    def get(self, request, pk, *args, **kwargs):
        write_comment = CommentForm()
        bit = Bit.objects.get(pk=pk)


        context = {
            'bit': bit,
            'write_comment': write_comment,
        }

        return render(request, 'social/bit_detail.html', context)

    def post(self, request, pk, *args, **kwargs):
        write_comment = CommentForm()

#class VideoBitDetail(View):


# def create_chat_bit(request):
#     if request.method == "POST":
#         chatbit_form = ChatBitForm(request.POST or None)
#         if form.is_valid():
#             ChatBit = chatbit_form.save(commit=False)
#             ChatBit.user = request.user
#             ChatBit.save()
#             return redirect("social/home.html")
#     form = ChatBitForm()
#     return render(request, "social/home.html", {"form" : form})

#def set_profile_image(request):

#ChatSpace

class ChatSpace(View):
    def get(self, request, *args, **kwargs):
    
        return render(request, "social/chatspace.html")

        #Prepare feed by pooling and sorting. The bit_pool will be referenced on front end to retrieve posts
        # friend_bits = Bit.objects.filter(profile__in = friends)
    #     bits = sorted(
    #    chain(friend_bits, user_bits),
    #    key=attrgetter('created_at'), reverse=True)
        #photobit_form = PhotoBitForm()
        #videobit_form = VideoBitForm()



        #     bit_pool = sorted(
        # chain(chat_bits, photo_bits, video_bits),
        # key=attrgetter('created_at'), reverse=True)

        # if 'publish_bit' in request.POST:
        #     if chatbit_form.is_valid():
        #         new_bit = chatbit_form.save(commit=False)
        #         new_bit.user = request.user
        #         new_bit.save()
        #         bits = Bit.objects.all()


#VideoSpace

class VideoSpace(View):
    def get(self, request, *args, **kwargs):
        return render(request, "social/videospace.html")

#PhotoSpace

class PhotoSpace(View):
    def get(self, request, *args, **kwargs):
        return render(request, "social/photospace.html")

#Profile Page

class ProfileView(View):
    def get(self, request, pk, *args, **kwargs):
        profile = Profile.objects.get(pk=pk)
        view_user = profile.user
        user_bits = Bit.objects.filter(user=view_user).order_by('-created_at')
        user_profile = Profile.objects.get(user=request.user)
        user_connections = user_profile.connections.all()
        profile_id=str(pk)
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

        return render(request, "social/profile.html", context)

#Yourbit rewards

class Rewards(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):
        user = request.user
        profile = Profile.objects.get(user = user)
        point_balance = profile.point_balance
        share_points = profile.share_points
        level = profile.level
        context = {
            'point_balance':point_balance,
            'level': level,
            'share_points': share_points

        }
        return render(request, "social/rewards.html")

#Render user settings page

class Settings(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):
        return render(request, "social/settings.html")


#Render personization page
class Personalization(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):

        profile_image_form = ProfilePictureUpload()
        background_image_form = BackgroundPictureUpload()
        user_photos = Bit.objects.filter(user = request.user, bit_type="photo")
        color_form = ColorForm(instance=request.user.profile)
        context = {
            'profile_image_form': profile_image_form,
            'background_image_form' : background_image_form,
            'user_photos' : user_photos,
            'color_form':color_form,


        }
        return render(request, "social/personalize_profile.html", context)

    def post(self, request, *args, **kwargs):
        profile_image_form = ProfilePictureUpload()
        background_image_form = BackgroundPictureUpload()

        if 'profile_image_button' in request.POST:
            profile_image_form = ProfilePictureUpload(request.POST, request.FILES, instance=request.user.profile)
            if profile_image_form.is_valid():
                profile_image_form.save()
                return redirect("personalize")

        if 'background_image_button' in request.POST:
            background_image_form = BackgroundPictureUpload(request.POST, request.FILES, instance=request.user.profile)
            if background_image_form.is_valid():
                background_image_form.save()
                return redirect("personalize")

        if 'colors' in request.POST:
            color_form = ColorForm(request.POST, instance=request.user.profile)
            if color_form.is_valid():
                color_form.save()
                return redirect("personalize")

        context = {
            'profile_image_form': profile_image_form,
            'background_image_form' : background_image_form,
            'color_form':color_form,


        }
        return redirect("personalize")


#Legacy like and dislike view, delete later

class Interact(LoginRequiredMixin, View):

    def post(self, request, pk, *args, **kwargs):

        profile = Profile.objects.get(user=request.user)
        bit = Bit.objects.get(pk=pk) 
        interacted_with = profile.interacted_with.all()
        liked_bits = profile.liked_bits.all()

        if 'like' in request.POST:

            is_disliked = False

            for dislike in bit.dislikes.all():
                if dislike == request.user:
                    is_disliked = True
                    break

            if is_disliked:
                bit.dislikes.remove(request.user)
                profile.disliked_bits.remove(bit)

            is_liked = False

            for like in bit.likes.all():
                if like == request.user:
                    is_liked = True
                    break

            if not is_liked:
                bit.likes.add(request.user)
                profile.liked_bits.add(bit)

                if bit not in interacted_with:
                    profile.interacted_with.add(bit)

                

            if is_liked:
                bit.likes.remove(request.user)
                profile.liked_bits.remove(bit)

        if 'dislike' in request.POST:
            is_liked = False

            for like in bit.likes.all():
                if like == request.user:
                    is_liked = True
                    break

            if is_liked:
                bit.likes.remove(request.user)
                profile.liked_bits.remove(bit)
                

            is_disliked = False

            for dislike in bit.dislikes.all():
                if dislike == request.user:
                    is_liked = True
                    break

            if not is_disliked:
                bit.dislikes.add(request.user)
                profile.disliked_bits.add(bit)

            if is_disliked:
                bit.dislikes.remove(request.user)
                profile.disliked_bits.remove(bit)


        next = request.POST.get('next', '/')
        return HttpResponseRedirect(next)


#Legacy write comment view, delete later

class WriteComment(LoginRequiredMixin, View):
    def post(self, request, pk, *args, **kwargs):
        chat = Bit.objects.get(pk=pk)
        comment_form = CommentForm(request.POST)
        new_comment = comment_form.save(commit=False)
        new_comment.user = request.user
        new_comment.bit = chat
        new_comment.save()

        chat.comments.add(new_comment)

        next = request.POST.get('next', '/')
        return HttpResponseRedirect(next)



#def search_list(request):

# def profile_list(request):
#     profiles = Profile.objects.exclude(user=request.user)
#     return render(request, "social/profile_list.html", {"profiles" : profiles})

# def profile(request, pk):
#     profile = Profile.objects.get(pk=pk)

#     if request.method == "POST":
#         current_user_profile = request.user.profile
#         data = request.POST
#         action = data.get("follow")
#         if action == "follow":
#             current_user_profile.follows.add(profile)

#         elif action == "unfollow":
#             current_user_profile.follows.remove(profile)

#         elif action == "connect-friend":
#             current_user_profile.friends_with.add(profile)

#         elif action == "connect-work":
#             current_user_profile.works_with.add(profile)

#         elif action == "connect-family":
#             current_user_profile.related_to.add(profile)


#         current_user_profile.save()

#     return render(request, "social/profile.html", {"profile": profile})

#Legacy profile interaction view, delete later

class ProfileInteract(LoginRequiredMixin, View):
    def post(self, request, pk, *args, **kwargs):
   
        if 'request_friend' in request.POST:
            user = request.user
            from_user = User.objects.get(id = user.id)
            to_user = User.objects.get(pk = pk) 
            connect_request = ConnectRequest.objects.get_or_create(from_user = from_user, to_user = to_user)
            return redirect('home')

        if 'accept_friend' in request.POST:
            connect_request = ConnectRequest.objects.get(pk = pk)
            user1_profile = Profile.objects.get(user = request.user)
            user2_profile = Profile.objects.get(user = connect_request.from_user)
            user1_profile.connections.add(user2_profile)
            user2_profile.connections.add(user1_profile)
            connect_request.delete()
            return redirect('home')

#Search results view

class SearchResults(View):
    def post(self, request, *args, **kwargs):
        search_form = SearchBar(request.POST)
        if search_form.is_valid():

            searched = search_form.cleaned_data['query']
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
            }
            return render(request, "social/search_results.html", context)

#Render messages page

class Messages(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        user = request.user
        user_profile = Profile.objects.get(user=user)
        conversations = user_profile.conversations.all()
        connections = user.profile.connections.all()
        message_form = NewMessage()

        context = {
            "conversations" : conversations,
            "connections" : connections,
            
            }
        return render(request, 'social/messages.html', context)

    def post(self, request, pk, *args, **kwargs):
        message_form = NewMessage(request.POST)
        if message_form.is_valid():
            from_user = request.user
            to_user = User.objects.get(pk=pk)
            from_user_profile = Profile.objects.get(user=from_user)
            to_user_profile = Profile.objects.get(user=to_user)
            
#Render mystuff page

class MyStuff(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        user = request.user
        profile = Profile.objects.get(user=user)
        liked_bits = profile.liked_bits.all()

        return render(request, 'social/my_stuff.html') 
        
#Render history page

class HistoryView(LoginRequiredMixin, View):
    def get(self, request, action, *args, **kwargs):
        user = request.user
        profile = Profile.objects.get(user=user)

        if action == 'all':
            
            return render(request, 'social/history.html')
        
        if action == 'liked':
            
            return render(request, 'social/history.html')

        if action == 'disliked':
            
            return render(request, 'social/history.html')

        if action == 'watched':
            
            return render(request, 'social/history.html')

        if action == 'comments':
            
            return render(request, 'social/history.html')

#Handle ajax requests for liking bits

class LikeBit(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):
        #Get request user profile for updating
        profile = Profile.objects.get(user=request.user)

        #Get bit ID from request and use to get bit
        bit_id = request.POST['bit_id']
        bit = Bit.objects.get(pk=bit_id)

        #Get bit user and find profile
        bit_user = bit.user
        bit_profile = bit_user.profile

        #Get accent colors
        accent_color = bit_profile.accent_color
        icon_color = bit_profile.feedback_icon_color

        #information needed to update rewards
        interacted_with = profile.interacted_with.all()
        liked_bits = profile.liked_bits.all()

        print("accent color: ", accent_color)

        liked_bits = profile.liked_bits.all()
        is_disliked = False

        for dislike in bit.dislikes.all():
            if dislike == request.user:
                is_disliked = True
                break

        if is_disliked:
            bit.dislikes.remove(request.user)
            profile.disliked_bits.remove(bit)


        is_liked = False

        for like in bit.likes.all():
            if like == request.user:
                is_liked = True
                break

        if not is_liked:
            bit.likes.add(request.user)
            profile.liked_bits.add(bit)
            like_count = bit.likes.count()
            dislike_count = bit.dislikes.count()
            
            if bit not in interacted_with:
                profile.interacted_with.add(bit)
                balance = profile.point_balance
                earnings = profile.rewards_earned
                balance = balance + 10
                earnings = earnings + 10
                profile.point_balance = balance
                profile.rewards_earned = earnings
                profile.save()

            return JsonResponse({'action':'like', 'accent_color':accent_color,'icon_color': icon_color, 'like_count': like_count, 'dislike_count': dislike_count})
        
        if is_liked:
            bit.likes.remove(request.user)
            profile.liked_bits.remove(bit)
            like_count = bit.likes.count()
            dislike_count = bit.dislikes.count()

            return JsonResponse({'action':'unlike', 'accent_color':accent_color,'icon_color': icon_color, 'like_count': like_count, 'dislike_count': dislike_count})

class DislikeBit(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):
        #Get request user profile for updating
        profile = Profile.objects.get(user=request.user)
        interacted_with = profile.interacted_with.all()

        #Get bit ID from request and use to get bit
        bit_id = request.POST['bit_id']
        bit = Bit.objects.get(pk=bit_id)

        #Get bit user and find profile
        bit_user = bit.user
        bit_profile = bit_user.profile

        #Get accent colors
        accent_color = bit_profile.accent_color
        icon_color = bit_profile.feedback_icon_color



        print("accent color: ", accent_color)

        liked_bits = profile.liked_bits.all()
        is_disliked = False
        
        is_liked = False

        for like in bit.likes.all():
            if like == request.user:
                is_liked = True
                break

        if is_liked:
            bit.likes.remove(request.user)
            profile.liked_bits.remove(bit)
            

        is_disliked = False

        for dislike in bit.dislikes.all():
            if dislike == request.user:
                is_disliked = True
                break

        if not is_disliked:
            bit.dislikes.add(request.user)
            profile.disliked_bits.add(bit)
            like_count = bit.likes.count()
            dislike_count = bit.dislikes.count()
            if bit not in interacted_with:
                profile.interacted_with.add(bit)
                balance = profile.point_balance
                earnings = profile.rewards_earned
                balance = balance + 10
                earnings = earnings + 10
                profile.point_balance = balance
                profile.rewards_earned = earnings
                profile.save()
            
            return JsonResponse({'action':'dislike', 'accent_color':accent_color,'icon_color': icon_color, 'like_count':like_count, 'dislike_count': dislike_count})

        if is_disliked:
            bit.dislikes.remove(request.user)
            profile.disliked_bits.remove(bit)
            like_count = bit.likes.count()
            dislike_count = bit.dislikes.count()
            return JsonResponse({'action':'undislike', 'accent_color':accent_color,'icon_color': icon_color, 'like_count':like_count, 'dislike_count': dislike_count})

class AddComment(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):

        #Retrieve data from request
        bit_id = request.POST.get('bit_id')
        comment = request.POST.get('comment')
        print(comment)

        #Get commenting user information
        profile = Profile.objects.get(user=request.user)
        user_first = request.user.first_name
        user_last = request.user.last_name
        commented_on = profile.commented_on.all()

        #Retrieve bit from database
        bit = Bit.objects.get(pk=bit_id)

        #Get bit author and profile
        bit_user = bit.user        
        bit_profile = bit_user.profile

        #Get bit author color scheme
        accent_color = bit_profile.accent_color
        icon_color = bit_profile.feedback_icon_color

        if bit not in commented_on:
            profile.commented_on.add(bit)
            balance = profile.point_balance
            earnings = profile.rewards_earned
            balance = balance + 15
            earnings = earnings + 15
            profile.point_balance = balance
            profile.rewards_earned = earnings
            profile.save()
        
        #Submit comment from data
        comment_form = CommentForm()
        new_comment = comment_form.save(commit=False)
        new_comment.user = request.user
        new_comment.bit = bit
        new_comment.comment = comment
        new_comment.save()


        

        #Add comment to bit relationsips for faster query
        bit.comments.add(new_comment)

        #Get list of comments
        comment_count = bit.comments.count()

        return JsonResponse({'accent_color':accent_color, 'icon_color':icon_color, 'comment_count':comment_count, 'user_first':user_first, 'user_last':user_last})

class Feed(View):
    def get(self, request, type, id, *args, **kwargs):
        #recieve type string from url and check what type of feed the user is looking for
        profile = Profile.objects.get(user=request.user)
        customs = Customizations.objects.get(profile=profile)
        user_colors_on = customs.user_colors_on
        wallpaper_on = customs.wallpaper_on
        default_theme_on = customs.default_theme_on
        friends = profile.connections.all()        
        following = profile.follows.all()
        friend_pool = []
        following_pool = []
        for following in following:
            following_pool.append(following.user)
        for friend in friends:
            friend_pool.append(friend.user)   
        friend_pool.append(request.user)
        
        print("id:" + id)

        if type == 'global':
            bit_pool = Bit.objects.filter(user__in = friend_pool).order_by('-created_at')
            profile = False

        if type == 'chatspace':
            bit_pool = Bit.objects.filter(user__in = friend_pool, bit_type = 'chat').order_by('-created_at')
            profile = False

        if type == 'photospace':
            bit_pool = Bit.objects.filter(user__in = friend_pool, bit_type='photo').order_by('-created_at')
            profile = False

        if type == 'videospace':
            bit_pool = Bit.objects.filter(user__in = friend_pool, bit_type = 'video').order_by('-created_at')
            profile = False

        if type == "profile":
            bit_pool = Bit.objects.filter(user=id).order_by('-created_at')
            profile = True
        
        if type == 'profile-global':
            bit_pool = Bit.objects.filter(user = id).order_by('-created_at')
            profile = True

        if type == 'profile-chatspace':
            bit_pool = Bit.objects.filter(user = id, bit_type = 'chat').order_by('-created_at')
            profile = True

        if type == 'profile-photospace':
            bit_pool = Bit.objects.filter(user = id, bit_type='photo').order_by('-created_at')
            profile = True

        if type == 'profile-videospace':
            bit_pool = Bit.objects.filter(user = id, bit_type = 'video').order_by('-created_at')
            profile = True
        
        context = {
            'bit_pool':bit_pool,
            'profile':profile,
            'user_colors_on': user_colors_on,
            'wallpaper_on': wallpaper_on,
            'default_theme_on': default_theme_on,
        }

        return render(request, 'social/feed.html', context)

class QuickVisibility(View):
    def get(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user)
        customizations = Customizations.objects.get(profile = profile)
        bit_colors_on = customizations.user_colors_on
        wallpaper_on = customizations.wallpaper_on
        default_theme_on = customizations.default_theme_on

        return JsonResponse({'bit_colors_on':bit_colors_on, 'wallpaper_on':wallpaper_on, 'default_theme_on': default_theme_on})

    def post(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user)
        customs = Customizations.objects.get(profile = profile)
        wallpaper = 'none'
        action = request.POST['button_name']
        print('action' + action)

        if action == 'bitColor':
            if customs.user_colors_on:
                customs.user_colors_on = False
                customs.save()
                toggle = 'off'

            else:
                customs.user_colors_on = True
                customs.save()
                toggle = 'on'

        if action == 'wallpaper':
            if customs.wallpaper_on:
                customs.wallpaper_on = False
                customs.save()
                toggle = 'off'

            else:
                customs.wallpaper_on = True
                customs.save()
                wallpaper = profile.background_image.url
                toggle = 'on'


        if action == 'defaultTheme':
            if customs.default_theme_on:
                customs.default_theme_on = False
                customs.save()
                toggle = 'off'

            else:
                customs.default_theme_on = True
                customs.save()
                toggle = 'on'
        
        bit_colors_on = customs.user_colors_on
        wallpaper_on = customs.wallpaper_on
        default_theme_on = customs.default_theme_on
        return JsonResponse({'bit_colors_on':bit_colors_on, 'wallpaper_on':wallpaper_on, 'default_theme_on': default_theme_on, 'toggle': toggle, 'wallpaper': wallpaper})

class NotificationStatus(View):
    def get(self, request, *args, **kwargs):
        connect_request_pending = False
        requests = ConnectRequest.objects.filter(to_user=request.user)
        notifications_len = len(requests)
        if requests:
            connect_request_pending = True
        
        
        return JsonResponse({'status': connect_request_pending, 'notification_len': notifications_len,})

class GetNotifications(View):
    def get(self, request, *args, **kwargs):
        connect_requests = ConnectRequest.objects.filter(to_user=request.user)
        request_list = []
        notifications = []
        for request in connect_requests:
            request_list.append(request)
        notifications.append(request_list)

        return JsonResponse({'notifications', notifications})


            


############################## 
#                            #
#-----      Tests       -----#
#                            #
##############################

class DynamicFeedTest(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'social/test-feed-page.html')