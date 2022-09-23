from locale import currency
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
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt


import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY
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

class GetComments(View):
    def get(self, request, *args, **kwargs):
        bit_id = request.get('bit_id')
        bit = Bit.objects.get(pk=bit_id)
        comments = {}
        iteration = 0
        for comment in bit.comments:
            comment_user = comment.user
            comment_user_first = comment_user.first_name
            comment_user_last = comment_user.last_name
            comment_user_name = comment_user_first + comment_user_last

            comment_body = comment.comment
            comment_date = comment.created_on
            iteration += 1

            comments.update({
                comment + iteration: 
                {
                    'user_name':comment_user_name, 
                    'body':comment_body, 
                    'created_at':comment_date 
                }})

        return JsonResponse({'comments':comments})

        

            


#Profile Page
class ProfileView(View):
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
        action = request.POST.get('action')
        user_profile = Profile.objects.get(user = request.user)
        print(action)
        if action == 'image_upload':
            option = request.POST.get('field')
            value = request.FILES.get('value')

            if option == 'background_image':
                user_profile.background_image = value
                user_profile.save()

            if option == 'profile_image':
                user_profile.image = value
                user_profile.save()


        if action == 'color_change': 
            option = request.POST.get('field')
            value = request.POST.get('value')
            print(option)
            if option == 'primary':
                user_profile.bit_background = value
                user_profile.save()
            
            if option == 'secondary':
                user_profile.accent_color = value
                user_profile.save()

            if option == 'icon':
                user_profile.icon_color = value
                user_profile.save()

            if option == 'feedback_icon':
                user_profile.feedback_icon_color = value
                user_profile.save()

            if option == 'feedback_icon_background':
                user_profile.feedback_background_color = value
                user_profile.save()

            if option == 'paragraph_font':
                user_profile.text_color = value
                user_profile.save()

            if option == 'title_font':
                user_profile.title_color = value
                user_profile.save()

        if action == 'text_edit':
            option = request.POST.get('field')
            value = request.POST.get('value')
            if option == 'para-align':
                user_profile.paragraph_align = value
                user_profile.save()

        return JsonResponse({'success':'success'})


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

#def search_list(request):

#Legacy profile interaction view, delete later

class ProfileInteract(LoginRequiredMixin, View):
    def post(self, request, pk, *args, **kwargs):
   
        if 'request_friend' in request.POST:
            user = request.user
            from_user = User.objects.get(id = user.id)
            to_user = User.objects.get(pk = pk) 
            connect_request = Notification.objects.get_or_create(from_user = from_user, to_user = to_user, notification_type=4)
            return JsonResponse({'success':'success'})

        if 'accept_friend' in request.POST:
            connect_request = Notification.objects.get(pk = pk)
            user1_profile = Profile.objects.get(user = request.user)
            user2_profile = Profile.objects.get(user = connect_request.from_user)
            user1_profile.connections.add(user2_profile)
            user2_profile.connections.add(user1_profile)
            connect_request.delete()
            return JsonResponse({'name': connect_request.from_user})

#Actual search results view when search is clicked

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



class NewConversation(View):
    def get(self, request, *args, **kwargs):
        user = request.user
        user_profile = Profile.objects.get(user=user)
        connections = user.profile.connections.all()
        form = NewConversation()
        context = {
            'form' : form,
            'connections':connections,

        }
        return render(request, 'social/create_conversation.html', context)
    def post(self, request, *args, **kwargs):
        form = NewConversation(request.POST)
        username = request.POST.get('username')

        try:

            receiver_user = User.objects.get(username=username)
            if Conversation.objects.filter(sender=request.user, receiver_user=receiver_user).exists():
                conversation = Conversation.objects.filter(sender=request.user, receiver_user=receiver_user)
                return redirect('conversation', pk=conversation.pk)
            elif Conversation.objects.filter(sender=receiver_user, receiver_user = request.user).exists():
                conversation = Conversation.objects.filter(sender=receiver_user, receiver_user=request.user)
                return redirect('conversation', pk=conversation.pk)

            if form.is_valid():
                coversation = Conversation(
                    user=request.user,
                    receiver = receiver_user

                )
                conversation.save()

                return redirect('conversation', pk=conversation.pk)
        
        except:
            return redirect('create-thread')


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
        from_user = request.user
        print(from_user)
        from_user_id = from_user.id
        #Get bit ID from request and use to get bit
        bit_id = request.POST['bit_id']
        bit = Bit.objects.get(pk=bit_id)

        #Get bit user and find profile
        bit_user = bit.user
        bit_user_id = bit_user.id
        bit_profile = Profile.objects.get(user=bit_user)

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

            return JsonResponse({'action':'like', 'from_user': from_user_id, 'to_user': bit_user_id, 'accent_color':accent_color,'icon_color': icon_color, 'like_count': like_count, 'dislike_count': dislike_count})
        
        if is_liked:
            bit.likes.remove(request.user)
            profile.liked_bits.remove(bit)
            like_count = bit.likes.count()
            dislike_count = bit.dislikes.count()

            return JsonResponse({'action':'unlike', 'from_user': from_user_id, 'to_user': bit_user_id, 'accent_color':accent_color,'icon_color': icon_color, 'like_count': like_count, 'dislike_count': dislike_count})

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
        from_user = request.user
        from_user_id = from_user.id
        print(comment)

        #Get commenting user information
        profile = Profile.objects.get(user=request.user)
        user_first = from_user.first_name
        user_last = from_user.last_name
        commented_on = profile.commented_on.all()

        #Retrieve bit from database
        bit = Bit.objects.get(pk=bit_id)

        #Get bit author and profile
        bit_user = bit.user
        to_user_id = bit_user.id   
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
        bit.save()

        #Get list of comments
        comment_count = bit.comments.count()
        user_name = user_first + " " + user_last
        return JsonResponse({'accent_color':accent_color, 'icon_color':icon_color, 'comment_count':comment_count, 'to_user': to_user_id, 'from_user' : from_user_id, 'from_user_name':user_name})

class Feed(View):
    def get(self, request, type, id, *args, **kwargs):
        #recieve type string from url and check what type of feed the user is looking for
        profile = Profile.objects.get(user=request.user)
        custom = Profile.objects.get(user=request.user)
        user_colors_on = custom.user_colors_on
        wallpaper_on = custom.wallpaper_on
        default_theme_on = custom.default_theme_on
        friends = profile.connections.all()        
        following = profile.follows.all()
        friend_pool = []
        following_pool = []
        for following in following:
            following_pool.append(following.user)
        for friend in friends:
            friend_pool.append(friend.user)   
        friend_pool.append(request.user)
        
        print("id: " + id)

        if type == 'global':
            friends = profile.connections.all()        
            following = profile.follows.all()
            friend_pool = []
            following_pool = []
            for following in following:
                following_pool.append(following.user)
            for friend in friends:
                friend_pool.append(friend.user)   
            friend_pool.append(request.user)
            private_bit_pool = Bit.objects.filter(user__in = friend_pool).order_by('-created_at')
            follow_bit_pool = Bit.objects.filter(user__in = following_pool, is_public = True).order_by('-created_at')
            profile = False
            feed_type = 'Global Space'

        if type == 'chatspace':
            friends = profile.connections.all()        
            following = profile.follows.all()
            friend_pool = []
            following_pool = []
            for following in following:
                following_pool.append(following.user)
            for friend in friends:
                friend_pool.append(friend.user)   
            friend_pool.append(request.user)
            private_bit_pool = Bit.objects.filter(user__in = friend_pool, bit_type = 'chat').order_by('-created_at')
            follow_bit_pool = Bit.objects.filter(user__in = following_pool, is_public = True, bit_type = 'chat').order_by('-created_at')
            profile = False
            feed_type = 'Chat Space'

        if type == 'photospace':
            friends = profile.connections.all()        
            following = profile.follows.all()
            friend_pool = []
            following_pool = []
            for following in following:
                following_pool.append(following.user)
            for friend in friends:
                friend_pool.append(friend.user)   
            friend_pool.append(request.user)
            private_bit_pool = Bit.objects.filter(user__in = friend_pool, bit_type='photo').order_by('-created_at')
            follow_bit_pool = Bit.objects.filter(user__in = following_pool, is_public = True, bit_type = 'photo').order_by('-created_at')
            profile = False
            feed_type = 'Photo Space'
        if type == 'videospace':
            friends = profile.connections.all()        
            following = profile.follows.all()
            friend_pool = []
            following_pool = []
            for following in following:
                following_pool.append(following.user)
            for friend in friends:
                friend_pool.append(friend.user)   
            friend_pool.append(request.user)
            private_bit_pool = Bit.objects.filter(Q(bit_type='video')|Q(bit_type='video_link'), user__in = friend_pool).order_by('-created_at')
            follow_bit_pool = Bit.objects.filter(Q(bit_type='video')|Q(bit_type='video_link'), user__in = following_pool, is_public = True).order_by('-created_at')
            profile = False
            feed_type = 'Video Space'

        if type == "profile":
            private_bit_pool = Bit.objects.filter(user=id, is_public = False).order_by('-created_at')
            follow_bit_pool = Bit.objects.filter(user=id, is_public = True).order_by('-created_at')
            profile = True
            user = User.objects.get(id=id)
            feed_type = user.first_name + "'s Global Space"
        
        if type == 'profile-global':
            private_bit_pool = Bit.objects.filter(user=id, is_public = False).order_by('-created_at')
            follow_bit_pool = Bit.objects.filter(user=id, is_public = True).order_by('-created_at')
            profile = True
            user = User.objects.get(id=id)
            feed_type = user.first_name + "'s Global Space"

        if type == 'profile-chatspace':
            private_bit_pool = Bit.objects.filter(user=id, is_public = False, bit_type = 'chat').order_by('-created_at')
            follow_bit_pool = Bit.objects.filter(user=id, is_public = True, bit_type='chat').order_by('-created_at')
            profile = True
            user = User.objects.get(id=id)
            feed_type = user.first_name + "'s Chat Space"

        if type == 'profile-photospace':
            private_bit_pool = Bit.objects.filter(user=id, is_public = False, bit_type = 'photo').order_by('-created_at')
            follow_bit_pool = Bit.objects.filter(user=id, is_public = True, bit_type='photo').order_by('-created_at')
            profile = True
            user = User.objects.get(id=id)
            feed_type = user.first_name + "'s Photo Space"

        if type == 'profile-videospace':
            private_bit_pool = Bit.objects.filter(user=id, is_public = False, bit_type = 'video').order_by('-created_at')
            follow_bit_pool = Bit.objects.filter(user=id, is_public = True, bit_type='video').order_by('-created_at')
            profile = True
            user = User.objects.get(id=id)
            feed_type = user.first_name + "'s Video Space"

        bit_pool = sorted(
            chain(private_bit_pool, follow_bit_pool), key=attrgetter('created_at'), reverse=True
            )
            

        print("""
    
            
                    --Success--
            Feed Generated Successfully
            
            
        """)

        context = {
            'bit_pool':bit_pool,
            'private_bit_pool': private_bit_pool,
            'public_bit_pool' : follow_bit_pool,
            'feed_type': feed_type,
            'profile':profile,
            'user_colors_on': user_colors_on,
            'wallpaper_on': wallpaper_on,
            'default_theme_on': default_theme_on,
        }

        return render(request, 'social/feed.html', context)

class QuickVisibility(View):
    def get(self, request, *args, **kwargs):
        custom = Profile.objects.get(user=request.user)
        
        bit_colors_on = custom.user_colors_on
        wallpaper_on = custom.wallpaper_on
        default_theme_on = custom.default_theme_on

        return JsonResponse({'bit_colors_on':bit_colors_on, 'wallpaper_on':wallpaper_on, 'default_theme_on': default_theme_on})

    def post(self, request, *args, **kwargs):
        custom = Profile.objects.get(user=request.user)
        wallpaper = 'none'
        action = request.POST['button_name']
        print('action' + action)

        if action == 'bitColor':
            if custom.user_colors_on:
                custom.user_colors_on = False
                custom.save()
                toggle = 'off'

            else:
                custom.user_colors_on = True
                custom.save()
                toggle = 'on'

        if action == 'wallpaper':
            if custom.wallpaper_on:
                custom.wallpaper_on = False
                custom.save()
                toggle = 'off'

            else:
                custom.wallpaper_on = True
                custom.save()
                wallpaper = profile.background_image.url
                toggle = 'on'


        if action == 'defaultTheme':
            if custom.default_theme_on:
                custom.default_theme_on = False
                custom.save()
                toggle = 'off'

            else:
                custom.default_theme_on = True
                custom.save()
                toggle = 'on'
        
        bit_colors_on = custom.user_colors_on
        wallpaper_on = custom.wallpaper_on
        default_theme_on = custom.default_theme_on
        return JsonResponse({'bit_colors_on':bit_colors_on, 'wallpaper_on':wallpaper_on, 'default_theme_on': default_theme_on, 'toggle': toggle, 'wallpaper': wallpaper})


#####################################################
#                    Notifications                  #
#####################################################

#Notify Other Users
class Notify(View):
    def post(self, request, *args, **kwargs):

        #Get request data
        notification_type = request.POST.get('type')
        to_user = request.POST.get('to_user')
        
        #get from user profile
        from_user = request.user
        from_user_profile = Profile.objects.get(user = from_user)

        #Get user and name
        to_user = User.objects.get(id = to_user)
        first_name = to_user.first_name
        last_name = to_user.last_name
        name = first_name + last_name

        #Get to user profile
        to_user_profile = Profile.objects.get(user=to_user)

        #Type 1 notification = Like/Dislike
        if notification_type == 1:
            bit_id = request.POST.get('bit')
            new_notification = Notification(to_user = to_user_profile, bit=bit, from_user = from_user_profile, notification_type=notification_type)
            new_notification.save()

        #Type 2 notification = Comment
        elif notification_type == 2:
            bit_id = request.POST.get('bit')
            bit = Bit.objects.get(id=bit_id)
            new_notification = Notification(to_user = to_user_profile, bit=bit, from_user = from_user_profile, notification_type=notification_type)
            new_notification.save()

        else:    
            new_notification = Notification(to_user = to_user_profile, from_user = from_user_profile, notification_type=notification_type)
        
        if to_user_profile.alerted_notifications == True:
            to_user_profile.alerted_notifications = False
        return JsonResponse({'to_user': name})

#Check if there are notifications
class NotificationStatus(View):
    def get(self, request, *args, **kwargs):
        user = request.user
        profile = Profile.objects.get(user=user)
        current_alerted_notifications = profile.alerted_notifications
        
        
        return JsonResponse({'status': current_alerted_notifications})

#Send notifications to client
class GetNotifications(View):

    def post(self, request, *args, **kwargs):    
        print("""
    
            
                    --Success--
            Get notification request received
            
            
        """)
        user = request.user
        user_id = user.id
        profile = Profile.objects.get(user = request.user)
        #Get and sort all notifications
        notification_pool = Notification.objects.filter(to_user = profile).order_by('date')
        print(notification_pool)
        request_list = []
        connect_notifications = {}
        notifications_list = {}
        iteration = 0
        
        #Package JSON response, but first check if there are notifications
        if notification_pool:

            #Add each notification to the list
            for notification in notification_pool:
                
                if notification.notification_type == 1:
                    from_user_profile = notification.from_user
                    from_user = from_user_profile.user
                    first_name = from_user.first_name
                    last_name = from_user.last_name
                    name = first_name + last_name
                    username = from_user.username
                    bit = notification.bit
                    bit = bit.id
                    time = notification.date
                    iteration += 1
                    rate_notification = 'notification' + str(iteration)
                    notifications_list.update(
                        {
                            rate_notification : 
                                {
                                    'id' : notification.id, 
                                    'time' : time,
                                    'from_user': name, 
                                    'type' : 'rate', 
                                    'bit' : bit
                                }
                        }
                    )

                elif notification.notification_type == 2:
                    print('A comment')
                    from_user_profile = notification.from_user
                    from_user = from_user_profile.user
                    first_name = from_user.first_name
                    last_name = from_user.last_name
                    name = first_name + last_name
                    username = from_user.username
                    bit = notification.bit
                    bit = bit.id
                    time = notification.date
                    comment = notification.comment
                    comment_text = comment.comment
                    iteration += 1
                    comment_notification = 'notification' + str(iteration)
                    notifications_list.update(
                        {
                            comment_notification : 
                            {
                                'id' : notification.id, 
                                'time' : time, 
                                'from_user': name, 
                                'type' : 'comment', 
                                'bit' : bit, 
                                'comment': comment_text
                            }
                        }
                    )

                elif notification.notification_type == 3:
                    print('A follow')
                    from_user_profile = notification.from_user
                    from_user = from_user_profile.user
                    first_name = from_user.first_name
                    last_name = from_user.last_name
                    name = first_name + last_name
                    username = from_user.username
                    time = notification.date
                    iteration += 1
                    follow_notification = 'notification' + str(iteration)
                    notifications_list.update(
                        {
                            follow_notification : 
                            {
                                'id' : notification.id, 
                                'time' : time, 
                                'from_user': name, 
                                'type' : 'follow'
                            }
                        }
                    )       
                
                elif notification.notification_type == 4:
                    from_user_profile = notification.from_user
                    from_user = from_user_profile.user
                    first_name = from_user.first_name
                    last_name = from_user.last_name
                    name = first_name + " " + last_name
                    username = from_user.username
                    profile_id = from_user.id
                    time = notification.date
                    iteration += 1
                    connect_notification = 'notification' + str(iteration)
                    notifications_list.update(
                        {
                            connect_notification : 
                            {
                                'id' : notification.id, 
                                'time' : time, 
                                'username':username, 
                                'type': 'connect', 
                                'from_user': name, 
                                'profile_id':profile_id
                            }
                        }
                    )
                

                elif notification.notification_type == 5:
                    from_user_profile = notification.from_user
                    from_user = from_user_profile.user
                    first_name = from_user.first_name
                    last_name = from_user.last_name
                    name = first_name + last_name
                    username = from_user.username
                    time = notification.date
                    iteration += 1
                    accept_notification = 'notification' + str(iteration)
                    notifications_list.update(
                        {
                            accept_notification : 
                            {
                                'id' : notification.id, 
                                'time' : time, 
                                'from_user' : name, 
                                'type' : 'accept_request'
                            }
                        }
                    )

                else:
                    from_user_profile = notification.from_user
                    from_user = from_user_profile.user
                    first_name = from_user.first_name
                    last_name = from_user.last_name
                    name = first_name + " " + last_name
                    username = from_user.username
                    time = notification.date
                    iteration += 1
                    message_notification = 'notification' + str(iteration)
                    notifications_list.update(
                        {
                            accept_notification : 
                            {
                                'id' : notification.id, 
                                'time' : time, 
                                'from_user' : name, 
                                'type' : 'message',
                            }
                        }
                    )


        return JsonResponse(notifications_list)

class Publish(View):
    def post(self, request, *args, **kwargs):
        bit_form = BitForm()
        new_bit = bit_form.save(commit=False)
        user_profile = Profile.objects.get(user = request.user)
        title = request.POST.get('title')
        body = request.POST.get('body')
        type = request.POST.get('type')
        contains_video_link = False
        print(type)

        if type == 'chat':
            if title != 'yb-no-title':
                new_bit.title = title
            if 'youtube.com' in body or 'youtu.be' in body:
                split_bit = body.split(' ')
                print(split_bit)

                for word in split_bit:

                    if 'v=' in word:
                        contains_video_link = True
                        print(word)
                        position = word.index('v=')
                        position = position + 2
                        video_id = word[position:len(word)]
                        new_bit.extend_widget = '<iframe style="margin-top: 5px;" width="98%" height="fit-content" src="https://www.youtube.com/embed/'+ video_id +'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
                        body = ' '.join(split_bit)
                        print(body)
                        new_bit.contains_video_link = True
                        new_type ='video_link'
                        break

                    elif 'youtu.be' in word:
                        contains_video_link = True
                        position= word.index('e/')
                        position = position + 2
                        video_id = word[position:len(word)]
                        new_bit.extend_widget = '<iframe style="margin-top: 5px;" width="98%" height="fit-content" src="https://www.youtube.com/embed/'+ video_id +'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
                        body = ' '.join(split_bit)
                        new_bit.contains_video_link = True
                        new_type ='video_link'
                        break

                    elif 'embed' in word:
                        contains_video_link = True
                        new_bit.contains_video_link = True
                        new_bit.extend_widget = word
                        new_type ='video_link'
                        break

            
            new_bit.body = body 
            

        elif type == 'photo':
            image = request.FILES.get('photo')
            new_bit.image = image
            if body != 'yb-no-body':
                new_bit.body = body
            
        else:
            video = request.FILES.get('video')
            new_bit.video = video
        
        new_bit.user = request.user
        if contains_video_link:
            new_bit.bit_type = new_type
        else:
            new_bit.bit_type = type
        new_bit.save()

        

        return JsonResponse({'success':'success'}) 
            

class AddFriend(View):
    def post(self, request, *args, **kwargs):
        action = request.POST.get('action')
        notification_id = request.POST.get('id')

        if action == 'request_friend':
            user_id = request.POST.get('user_id')
            user = request.user
            user_profile = Profile.objects.get(user=request.user)
            receiving_profile = Profile.objects.get(user = user_id)
            from_user = User.objects.get(id = user.id)
            to_user = User.objects.get(pk = user_id) 
            first_name = to_user.first_name
            last_name = to_user.last_name
            name = first_name + " " + last_name
            connect_request = Notification.objects.get_or_create(from_user = user_profile, to_user = receiving_profile, notification_type = 4)
            return JsonResponse({'name': name})
        
        if action == 'accept_friend':
            connect_request = Notification.objects.get(id = notification_id)
            user1_profile = Profile.objects.get(user = request.user)
            from_user = connect_request.from_user
            from_user_id = from_user.id
            print(connect_request.from_user)
            user2_profile = Profile.objects.get(user = from_user_id)
            user1_profile.connections.add(user2_profile)
            user2_profile.connections.add(user1_profile)

            user2 = User.objects.get(id = from_user_id)
            from_user_first = user2.first_name
            from_user_last = user2.last_name
            from_user = from_user_first + " " + from_user_last
            connect_request.delete()
            return JsonResponse({'name': from_user})

        if action == 'deny_request':
            connect_request = Notification.objects.get(pk = notification_id)
            from_user = connect_request.from_user
            from_user_first = from_user.first_name
            from_user_last = from_user.last_name
            from_user = from_user_first + " " + from_user_last
            connect_request.delete()
            return JsonResponse({'name' : from_user})


class Follow(View):
    def post(self, request, *args, **kwargs):
        id = request.POST['profile']
        send_user = request.user
        send_user_profile = Profile.objects.get(user = send_user)
        recieve_profile = Profile.objects.get(pk=id)
        recieve_user = User.objects.get(pk=id)
        send_user_profile.follows.add(recieve_profile)

        recieve_user_first = recieve_user.first_name
        recieve_user_last = recieve_user.last_name
        recieve_user_name = recieve_user_first + " " + recieve_user_last
        print(recieve_user_name)
        return JsonResponse({'name':recieve_user_name})

class Onboarding(View):
    def get(self,request, *args, **kwargs):        
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
        return render(request, 'social/onboarding.html', context)

    def post(self, request, *args, **kwargs):
        page = request.POST.get('page')
        page = int(page)
        print(page)
        user_profile = Profile.objects.get(user = request.user)
        if page == 0:
            print('images')
            profile_image_form = ProfilePictureUpload(instance=request.user)
            background_image_form = BackgroundPictureUpload(instance=request.user)
            profile_image = request.FILES.get('profile_image')
            background_image = request.FILES.get('background_image')
            if profile_image != None:
                user_profile.image = profile_image
                user_profile.save()
            if background_image != None:
                user_profile.background_image = background_image
                user_profile.save() 
            

        if page == 1:
            gender = request.POST.get('gender')
            bio = request.POST.get('bio')
            user_profile.gender = gender
            user_profile.user_bio = bio
            user_profile.save()


        if page == 2:
            privacy_settings = PrivacySettings.objects.get(user=request.user)
            name_visibility = request.POST.get('name_visibility')
            message_visibility = request.POST.get('message_availability')
            search_visibility = request.POST.get('search_visibility')
            followers_enabled = request.POST.get('followers_enabled')
            if followers_enabled == "on":
                privacy_settings.enable_followers = True
            else:
                privacy_settings.enable_followers = False
            if name_visibility == 'on':

                privacy_settings.real_name_visibility = True
            else:
                privacy_settings.real_name_visibility = False

            if message_visibility == "on":

                privacy_settings.message_availability = True
            
            else:
                privacy_settings.message_availability = False

            if search_visibility == "on":
                privacy_settings.search_by_name = True
            
            else:
                privacy_settings.search_by_name = False
            privacy_settings.save()
        
        if page == 3:
            user_colors_on = request.POST.get('user_colors_on')
            primary_color = request.POST.get('primary_color')
            accent_color = request.POST.get('accent_color')
            icon_color = request.POST.get('icon_color')
            feedback_icon_color = request.POST.get('feedback_icon_color')
            title_color = request.POST.get('title_color')
            text_color = request.POST.get('text_color')

            if user_colors_on == 'on':
                user_profile.user_colors_on = True
            else:
                user_profile.user_colors_on = False
            user_profile.bit_background = primary_color
            user_profile.title_color = title_color
            user_profile.text_color = text_color
            user_profile.accent_color = accent_color
            user_profile.icon_color = icon_color
            user_profile.feedback_icon_color = feedback_icon_color
            user_profile.save()
            
        return JsonResponse({'success':'success'})

class Maintenance(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'social/maintenance.html')
#Asynchronous Search queries on mobile for search suggestions

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
        user_first_name_filter = User.objects.filter(first_name__icontains = searched)
        for result in user_first_name_filter:
            if result not in user_results_working:
                user_results_working.append(result)
                first_name = result.first_name
                last_name = result.last_name
                username = result.username
                profile = Profile.objects.get(pk = result.id)
                image = profile.image.url
                name = first_name + " " + last_name
                user_results.update({username: {'name' : name, 'image' : image}})

        user_last_name_filter = User.objects.filter(last_name__icontains = searched)
        for result in user_last_name_filter:
            if result not in user_results_working:
                user_results_working.append(result)
                first_name = result.first_name
                last_name = result.last_name
                username = result.username
                profile = Profile.objects.get(pk = result.id)
                image = profile.image.url
                name = first_name + " " + last_name
                user_results.update({username: {'name' : name, 'image' : image}})

        username_filter = User.objects.filter(username__icontains = searched)
        for result in username_filter:
            if result not in user_results_working:
                user_results_working.append(result)
                first_name = result.first_name
                last_name = result.last_name
                username = result.username
                profile = Profile.objects.get(pk = result.id)
                image = profile.image.url
                name = first_name + " " + last_name
                user_results.update({username: {'name' : name, 'image' : image}})

        print(user_results)
        response = {'user_results': user_results}
        if "submit-search" in request.POST:
            context = {"user_results" : user_results_working}
            return render(request, 'social/search_results.html', context)
        else:
            return JsonResponse(response)


############################## 
#                            #
#-----      Tests       -----#
#                            #
##############################

class DynamicFeedTest(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'social/test-feed-page.html')


class StripeIntent(View):
    def post(self, request, *args, **kwargs):
        user = request.user
        user_profile = Profile.objects.get(user=user)
        amount = self.kwargs["amount"]
        print(amount)
        try:
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency='usd'
            )

            return JsonResponse({
                'clientSecret': intent['client_secret']
            })

        except Exception as e:
            return JsonResponse({'error': str(e)})


class Checkout(View):
    def get(self, request, *args, **kwargs):
        amount = self.kwargs["amount"]
        print(amount)
        context = {'amount':amount}
        return render(request, 'social/checkout.html', context)

class Donate(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'social/donate.html')

class ConnectionList(View):
    def get(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user)
        connections = profile.connections.all()
        following = profile.follows.all()
        context = {
            'connections':connections,
            'following':following,
        }
        return render(request, 'social/connections.html', context)

class CommunityList(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'social/communities.html')
    
    