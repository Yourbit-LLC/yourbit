#Django imports
from django.shortcuts import render
from django.views import View
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from rest_framework.decorators import api_view
from rest_framework.response import Response
#YB Code Imports
from notifications.models import Notification
from .forms import ColorForm
from .models import *
from .forms import *
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import requests
from settings.models import PrivacySettings
from django.utils import dateformat, timezone
import openai

openai.api_key = "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"

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
            "profile_username":that_user
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

@api_view(["POST"])
def acceptFriend(request):
    from notifications.models import Notification
    from YourbitAccounts.models import Account as User
    that_id = request.data.get("this_id")
    
    to_user = User.objects.get(id=that_id)

    this_profile = Profile.objects.get(user = request.user)
    that_profile = Profile.objects.get(user = to_user)

    try:
        this_notification = Notification.objects.get(to_user = request.user, from_user = to_user, type = 4)
        this_notification.delete()   

        this_profile.connections.add(that_profile)
        this_profile.save()

        that_profile.connections.add(this_profile)
        that_profile.save()
        
        new_notification = Notification(type = 5, to_user=to_user, from_user = request.user)
        new_notification.save()



        return JsonResponse({"success":True})
    except Notification.DoesNotExist:
        return JsonResponse("No friend request found.")



class MyStuff(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        context = {
            "location":"stuff",
            "space":"global",
            "sort":"chrono",
 
        }
        return render(request, "main/home.html", context)
       
        
class HistoryView(LoginRequiredMixin, View):
    def get(self, request, action, *args, **kwargs):
        user = request.user
        profile = Profile.objects.get(user=user)

        if action == 'all':
            context = {
                "location":"history",
                "space":"global",
                "filter":"all",
                "sort":"chrono"
            }
            return render(request, 'main/home.html', context)
        
        if action == 'liked':
            context = {
                "location":"history",
                "space":"global",
                "filter":"liked",
                "sort":"chrono"
            }         
            return render(request, 'main/home.html', context)

        if action == 'disliked':
            
            context = {
                "location":"history",
                "space":"global",
                "filter":"disliked",
                "sort":"chrono"
            }         
            return render(request, 'main/home.html', context)

        if action == 'watched':
            
            return render(request, 'main/home.html', context)

        if action == 'comments':
            
            return render(request, 'main/home.html', context)


class ConnectionList(View):
    def get(self, request, *args, **kwargs):
        context = {
            "location": "connections",
            'space':'global',
            'filter':'all',
            'sort':'chrono'
        }

        return render(request, 'main/home.html', context)

# Create your views here.
class Publish(View):
    def post(self, request, *args, **kwargs):
        new_bit = Bit()
        print(request.POST.get('type'))
        #Get user profile
        user_profile = Profile.objects.get(user = request.user)
        this_user = User.objects.get(id = request.user.id)
        new_bit.user = this_user
        new_bit.profile = user_profile
        #Apply Customizations from profile
        custom_object = Custom.objects.get(profile=user_profile)
        new_bit.custom = custom_object

        #Get scope
        scope = request.POST.get('scope')
        print(scope)
        if scope == 'private':
            new_bit.is_public = False
        else:
            new_bit.is_public = True

        #Get title from request.post
        title = request.POST.get('title')
        print(title)

        #Get body from request.post
        body = request.POST.get('body')
        print(body)

        #Get type from request.post
        type = request.POST.get('type')

        #Declare contains video link to check for linked videos from third party
        contains_video_link = False

        new_bit.contains_video_link = contains_video_link

        #Set new type to type
        new_type = type

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

            

            print(new_type)

        elif type == 'photo':

            #Get file from request
            image = request.FILES.get('photo')

            #Create photo instance
            new_photo = Photo()

            #Set new photo file to object
            new_photo.image = image

            #Assign photo object to user
            new_photo.user = request.user

            #Save photo object
            new_photo.save()
            

            if body != 'yb-no-body':
                new_bit.body = body
            
        else:
            video = request.FILES.get('video')
            new_bit.video = video
         
        new_bit.body = body
        new_bit.type = new_type
        new_bit.save()

        if type == 'photo':
            new_bit.photos.add(new_photo)
            new_bit.save()
        
        

        from user_profile.api.serializers import BitSerializer

        user_tz = user_profile.current_timezone
        serialized_bit = BitSerializer(new_bit, many=False, context={'user_tz':user_tz})
        return JsonResponse(serialized_bit.data)


class EditBit(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):
        from user_profile.api.serializers import BitSerializer
        action = request.POST.get('action')
        bit_id = request.POST.get('bit_id')
        bit = Bit.objects.get(id=bit_id)
        if action == '1':

            bit.title = request.POST.get('title')
            bit.save()

            status = 'success'
            edited = "title"
        elif action == '2':
            bit.body = request.POST.get('body')
            bit.save()

            status = 'success'
            edited = "body"
            
        elif action == '3':    
            bit.title = request.POST.get('title')
            bit.body = request.POST.get('body')
            bit.save()

            status = 'success'
            edited = "both"

        else:
            status = 'Not a valid action.'
            return JsonResponse({'status':status})
        
        user_tz = request.user.profile.current_timezone

        serializer_class = BitSerializer(bit, many=False, context={'user_tz':user_tz})

        return JsonResponse({'status':status, "edited":edited, "this_bit":serializer_class.data})


# Create your views here.

class Personalization(LoginRequiredMixin, View):
    #Render personization page
    def get(self, request, *args, **kwargs):

        profile_image_form = ProfilePictureUpload()
        background_image_form = BackgroundPictureUpload()
        color_form = ColorForm(instance=request.user.profile)
        is_new_user = request.user.profile.custom.is_new_user
        context = {
            'profile_image_form': profile_image_form,
            'background_image_form' : background_image_form,
            'color_form':color_form,
            "location":"customize",
            "space":"global",
            "filter":"all",
            "sort":"chrono",
            "is_new_user": is_new_user,


        }
        return render(request, "main/home.html", context)
    
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


            print(value)
            if option == 'background_image':

                #Full size background is stored in default value field
                full_size = value

                #Get mobile background file from submission
                mobile_background = Image.open(value)

                thumb_io = BytesIO()

                label = "mobile_background"
                large_thumbnail = mobile_background.resize((412, 869))
                large_thumbnail.save(thumb_io, format='PNG', quality=80)

                #Extract file name and save to custom model
                this_username = request.user.username
                this_uid = request.user.id
                timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
                this_filename = this_username + str(this_uid) + timestamp + label + ".png"
                inmemory_uploaded_file = InMemoryUploadedFile(thumb_io, None, this_filename, 'image/png', thumb_io.tell(), None)
                custom.background_mobile = inmemory_uploaded_file
                
                # #Desktop background file submission
                # desktop_upload = request.FILES.get('desktop_background')

                # desktop_background = Image.open(desktop_upload)

                # #Create large thumbnail
                # thumb_io = BytesIO()
                # label = "desktop_background"
                # large_thumbnail = desktop_background.resize((869, 412))
                # large_thumbnail.save(thumb_io, format='PNG', quality=80)
                # this_username = request.user.username
                # this_uid = request.user.id
                # timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
                # this_filename = this_username + str(this_uid) + timestamp + label + ".png"
                # inmemory_uploaded_file = InMemoryUploadedFile(thumb_io, None, this_filename, 'image/png', thumb_io.tell(), None)
                # custom.background_desktop = inmemory_uploaded_file

                
                #Save the full sized image
                custom.background_image = full_size
                custom.save()

            if option == 'profile_image':
                source_file = Image.open(value)


                #Create large thumbnail
                large_image = source_file.copy()
                lthumb_io = BytesIO()
                label = "thumbnail_large"
                large_thumbnail = large_image.resize((128, 128))
                large_thumbnail.save(lthumb_io, format='PNG', quality=80)
                this_username = request.user.username
                this_uid = request.user.id
                timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
                this_filename = this_username + str(this_uid) + timestamp + label + ".png"
                inmemory_uploaded_file = InMemoryUploadedFile(lthumb_io, None, this_filename, 'image/png', lthumb_io.tell(), None)
                custom.image_thumbnail_large = inmemory_uploaded_file

                #Create small thumbnail
                small_image = source_file.copy()
                sthumb_io = BytesIO()
                label = "thumbnail_small"
                small_thumbnail = small_image.resize((64, 64))
                small_thumbnail.save(sthumb_io, format='PNG', quality=80)
                this_username = request.user.username
                this_uid = request.user.id
                timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
                this_filename = this_username + str(this_uid) + timestamp + label + ".png"
                inmemory_uploaded_file = InMemoryUploadedFile(sthumb_io, None, this_filename, 'image/png', sthumb_io.tell(), None)
                custom.image_thumbnail_small = inmemory_uploaded_file

                #Rename and save full sized image
                
                full_image = source_file.copy()
                full_io = BytesIO()
                label = "non_compressed"
                full_image.save(full_io, format='PNG', quality=80)
                this_username = request.user.username
                this_uid = request.user.id
                timestamp = dateformat.format(timezone.now(), '%Y%m%d%-H:i-s')
                this_filename = this_username + str(this_uid) + timestamp + label + ".png"
                inmemory_uploaded_file = InMemoryUploadedFile(full_io, None, this_filename, 'image/png', full_io.tell(), None)
                custom.image = inmemory_uploaded_file

                custom.save()


        if action == 'color_change': 
            option = request.POST.get('field')
            value = request.POST.get('value')
            print(option)
            if option == 'primary':
                custom.primary_color = value
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
            if option == 'p_align':
                custom.paragraph_align = value
                custom.save()

        if action == 'background_effect':
            option = request.POST.get('field')
            value = request.POST.get('value')
            if option == 'blur':
                custom.background_blur = value
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

class EnhanceText(View):
    def post(self, request, *args, **kwargs):
        text = request.POST.get('text')
        print(text)
        text_length = request.POST.get('text_length')
        style = request.POST.get('style')

        final_prompt = "Make this post " + text_length + " in length, and more " + style + ": " + text

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role":"user", "content":final_prompt},

            ]
        )
        final_response =response['choices'][0]['message']
        print(response['choices'][0]['message'])
        return JsonResponse({'text': final_response['content']})
    
class AutoColorizeText(View):
    def post(self, request, *args, **kwargs):
        hex_code = request.POST.get('hex_code')

        final_prompt = f""" 
            You are an expert in color theory:

            list one possible option of a color as a hex code that contrasts well with {hex_code}. Keep wording to a minimum.
            
            
            """
        
        print(final_prompt)
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role":"system", "content":final_prompt},
            ]
        )

        final_response =response['choices'][0]['message']
        print(response['choices'][0]['message'])

        return JsonResponse({'text': final_response['content']})

class CreateCluster(View):
    def post(self, request):
        cluster_name = request.POST.get('name')
        print(cluster_name)
        type = request.POST.get("type")
        cluster = Cluster.objects.create(name=cluster_name, type=type, profile = request.user.profile)

        cluster.save()
        
        return JsonResponse({'success':'success', "name": cluster_name, "id": cluster.id})

class AddToCluster(View):
    def post(self, request):
        cluster_id = request.POST.get('cluster_id')
        post_id = request.POST.get('bit_id')
        cluster = Cluster.objects.get(id=cluster_id)
        bit = Bit.objects.get(id=post_id)
        cluster.bits.add(bit)
        cluster.bit_count = cluster.bit_count + 1
        cluster.save()

        return JsonResponse({'success':'success'})


class CustomNewUser(View):
    def get(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user)
        custom_object = Custom.objects.get(profile = profile)
        custom_object.is_new_user = False
        custom_object.save()
        
        return JsonResponse({'success':'success'})