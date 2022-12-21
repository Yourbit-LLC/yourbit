#Django imports
from django.shortcuts import render
from django.views import View
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin

#YB Code Imports
from notifications.models import Notification
from .forms import ColorForm
from .models import *
from .forms import *

from settings.models import PrivacySettings

##################################################################################################################

                        #############       User Profile Views      ##############
#                       
#                       This file contains the views for profiles and interaction
#                       tracking. Anything that keeps track of user activity belongs
#                       in this file.                          

##################################################################################################################


#Profile Page
class ProfileView(View):
    def get(self, request, username, *args, **kwargs):
        that_user = User.objects.get(username = username)
        this_profile = Profile.objects.get(user = that_user)
        context = {
            "location":"profile",
            "space":"global",
            "sort":"chrono",
            "profile_id": this_profile.id,
            "profile_username":that_user.username
        }
        return render(request, "main/home.html", context)

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
        
class MyStuff(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        user = request.user
        profile = Profile.objects.get(user=user)
        liked_bits = profile.liked_bits.all()

        return render(request, 'social/my_stuff.html') 
        
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


class ConnectionList(View):
    def get(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user)
        connections = profile.connections.all()
        following = profile.follows.all()
        context = {
            'connections':connections,
            'following':following,
        }
        return render(request, 'user_profile/connections.html', context)


# Create your views here.
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
        new_bit.bit_type = type
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
            new_photo = Photo()
            new_photo.image = image
            new_photo.user = request.user
            
            

            if body != 'yb-no-body':
                new_bit.body = body
            
        else:
            video = request.FILES.get('video')
            new_bit.video = video
        
        new_bit.user = request.user 

        
        #Apply Customizations from profile
        new_bit.custom = Custom.objects.get(profile=user_profile)

       
        new_bit.save()

        if type == 'photo':
            new_photo.bit = new_bit
            new_photo.save()

        return JsonResponse({'success':'success'}) 


# Create your views here.

class Personalization(LoginRequiredMixin, View):
    #Render personization page
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
        return render(request, "user_profile/personalize_profile.html", context)
    
    def post(self, request, *args, **kwargs):
        profile_image_form = ProfilePictureUpload()
        background_image_form = BackgroundPictureUpload()
        action = request.POST.get('action')
        user_profile = Profile.objects.get(user = request.user)
        custom = Custom.objects.get(profile = user_profile)
        print(action)
        if action == 'image_upload':
            option = request.POST.get('field')
            value = request.FILES.get('value')

            if option == 'background_image':
                custom.background_image = value
                custom.save()

            if option == 'profile_image':
                custom.image = value
                custom.save()


        if action == 'color_change': 
            option = request.POST.get('field')
            value = request.POST.get('value')
            print(option)
            if option == 'primary':
                custom.bit_background = value
                custom.save()
            
            if option == 'secondary':
                custom.accent_color = value
                custom.save()

            if option == 'icon':
                custom.icon_color = value
                custom.save()

            if option == 'feedback_icon':
                custom.feedback_icon_color = value
                custom.save()

            if option == 'feedback_icon_background':
                custom.feedback_background_color = value
                custom.save()

            if option == 'paragraph_font':
                custom.text_color = value
                custom.save()

            if option == 'title_font':
                custom.title_color = value
                custom.save()

        if action == 'text_edit':
            option = request.POST.get('field')
            value = request.POST.get('value')
            if option == 'para-align':
                custom.paragraph_align = value
                custom.save()

        return JsonResponse({'success':'success'})


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
                wallpaper = custom.background_image.url
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
