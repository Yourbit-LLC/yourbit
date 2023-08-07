

#                   feed/views.py
#                   11/11/2022
#                   Yourbit, LLC

#        Associated Yourbit Library: bits.py



#External imports
from cgitb import text
from django.shortcuts import render
from django.views import View
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, FileResponse
from django.views.decorators.http import condition
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from itertools import chain
from operator import attrgetter
from django.db.models import Q
import markdown
import pytz
import os
import requests
import boto3
import environ

from botocore.exceptions import ClientError


#Internal Imports
from user_profile.models import Profile, Bit
from YourbitAccounts.models import Account as User
from .builders import BuildBit
from .forms import *


# Create your views here.
class Home(View):
    def get(self, request, *args, **kwargs):
        context = {
            'location': 'home',
            'space':'global',
            'filter':'all',
            'sort':'chrono'
            
        }
        return render(request, "main/home.html", context)

class ChatSpace(View):
    def get(self, request, *args, **kwargs):
        context = {
            'location': 'home',
            'space': 'chat',
            'filter':'all',
            'sort':'chrono'
        }
        return render(request, "main/home.html", context)

class VideoSpace(View):
    def get(self, request, *args, **kwargs):
        context = {
            'location':'home',
            'space':'video',
            'filter':'all',
            'sort':'chrono'
        }
        return render(request, "main/home.html", context)

class PhotoSpace(View):
    def get(self, request, *args, **kwargs):
        context = {
            'location':'home',
            'space':'video'
        }   
        return render(request, "main/home.html", context)

#############################################################
##                                                         ##
##                         Yourbit                         ##
##                     Feed Generation                     ##
##                                                         ##
#############################################################

class Feed(View):
    def get(self, request, tz, type, id, sort, filter, *args, **kwargs):
        
        #Global Variables
        profile = Profile.objects.get(user=request.user)
        custom = Profile.objects.get(user=request.user)
        
        #Get active quick settings
        user_colors_on = custom.user_colors_on
        wallpaper_on = custom.wallpaper_on
        default_theme_on = custom.default_theme_on
        
        #Collect Connections
        friends = profile.connections.all()        
        following = profile.follows.all()
        friend_pool = []
        following_pool = []
        for following in following:
            following_pool.append(following.user)
        for friend in friends:
            friend_pool.append(friend.user)   
        friend_pool.append(request.user)

        #Create sorting variables
        
        sorter_list = []
        bitstream = {}

##############################
#                            #
#      Sorting Functions     #
#                            #
##############################
#           Yourbit          #
##############################

        #Chronological sort function
        def sort_chrono(sorter_list):
            if len(sorter_list) > 1:

                bit_pool = sorted(
                    chain(sorter_list[0], sorter_list[1]), key=attrgetter('time'), reverse=True
                )

            elif len(sorter_list) == 0:
                bit_pool = '<h2 class="not-found-message" id="no-bit">No bits found.</h2>'
                

            else:
                bit_pool = sorter_list[0]

            return bit_pool

        #Sort Top
        def sort_top(sorter_list):
            return None
            #uses reputation not like values
            #reputation rating = (likes + positive comments) - (dislikes + negative comments)
            #Reputation rating is calculated on each user interaction and stored in bits
        
        
####################
#                  #
#      Pooling     #
#                  #
####################
#
        # Pooling is step one of the bit delivery process
        # Receives bits from all friends and following
        #
        # Types: chat, video, photo
        
        #If global space is active space
        if type == 'global':
            sorter_list = []
            friends = profile.connections.all()        
            following = profile.follows.all()
            friend_pool = []
            following_pool = []
            for following in following:
                following_pool.append(following.user)
            for friend in friends:
                friend_pool.append(friend.user)   
            friend_pool.append(request.user)
            
            #Filter
            if filter == 'all':
                private_bit_pool = Bit.objects.select_related('user').filter(user__in = friend_pool).order_by('-time')
                follow_bit_pool = Bit.objects.select_related('user').filter(user__in = following_pool, is_public = True).order_by('-time')

                sorter_list.append(private_bit_pool)
                sorter_list.append(follow_bit_pool)
                print(sorter_list)
            
            if filter == 'friends':
                private_bit_pool = Bit.objects.select_related('user').filter(user__in = friend_pool).order_by('-time')

                sorter_list.append(private_bit_pool)
            if filter == 'following':
                follow_bit_pool = Bit.objects.select_related('user').filter(user__in = following_pool, is_public = True).order_by('-time')
            
            
            profile = False
            feed_type = 'Global Space'

            #Sort
            if sort == "chrono":
                bit_pool = sort_chrono(sorter_list)
        
            if sort == "top":
                bit_pool = sort_top(sorter_list)
        
        #If global space is not active space
        else:
            sorter_list = []
            friends = profile.connections.all()        
            following = profile.follows.all()
            friend_pool = []
            following_pool = []
            for following in following:
                following_pool.append(following.user)
            for friend in friends:
                friend_pool.append(friend.user)   
            friend_pool.append(request.user)

            #Filter bits
            if filter == 'all':
                private_bit_pool = Bit.objects.select_related('user').filter(user__in = friend_pool, type=type).order_by('-time')
                follow_bit_pool = Bit.objects.select_related('user').filter(user__in = following_pool, is_public = True).order_by('-time')

                sorter_list.append(private_bit_pool)
                sorter_list.append(follow_bit_pool)
            
            if filter == 'friends':
                private_bit_pool = Bit.objects.select_related('user').filter(user__in = friend_pool, type=type).order_by('-time')

                sorter_list.append(private_bit_pool)
            
            if filter == 'following':
                follow_bit_pool = Bit.objects.select_related('user').filter(user__in = following_pool, is_public = True, type=type).order_by('-time')
            
            #Sort Bits
            if sort == "chrono":
                bit_pool = sort_chrono(sorter_list)
            
            if sort == "top":
                bit_pool = sort_top(sorter_list)

        #If profile
        if profile == 'false':
        
            if type == 'global':
                user = User.objects.get(id=id)
                this_profile = Profile.objects.get(user = user)
                if this_profile in profile.connections.all:
                    private_bit_pool = Bit.objects.select_related('user', 'custom').filter(user=id, is_public = False).order_by('-time')
                    follow_bit_pool = Bit.objects.select_related('user', 'custom').filter(user=id, is_public = True).order_by('-time')
                
                if this_profile in profile.follows.all: 
                    follow_bit_pool = Bit.objects.select_related('user', 'custom').filter(user=id, is_public = True).order_by('-time')

                profile = True
                
                feed_type = user.first_name + "'s Global Space"

            else:
                if this_profile in profile.connections.all:
                    private_bit_pool = Bit.objects.select_related('user', 'custom').filter(user=id, is_public = False, type=type).order_by('-time')
                    follow_bit_pool = Bit.objects.select_related('user', 'custom').filter(user=id, is_public = True, type=type).order_by('-time')
                
                if this_profile in profile.follows.all: 
                    follow_bit_pool = Bit.objects.select_related('user', 'custom').filter(user=id, is_public = True, type=type).order_by('-time')

                profile = True
                user = User.objects.get(id=id)
                feed_type = user.first_name + "'s Chat Space"


###################
#                 #
#     STAGING     #
#                 #
###################


    #Phase 2 Feed

        #Staging prepares each bit for assembly 
        #then submits it to the build bit function

        #Once assembled the packaged bit is attached to the full 
        #html body for return to front end via Json Response
        
        #In staging, each bit is assigned a position value
        #The position value tells javascript where the bit
        #is in the organization.

        #Organize pool by date before being packaged for delivery. 
        position = 0
        
        # md = markdown.Markdown(safe_mode = True, extensions=['urlize'])
        feed_html = ''
        
        for bit in bit_pool:
            #Bit information is constructed into bit elements, these
            #elements are then passed to build bit for assembly

        #Initialize Bit Package
            bit_elements = {}
            custom = bit.custom
            user = bit.user
        
        #Bit Information
            information = {}
            

            #0 Bit ID
            bit_id = bit.id
            information.update({'bit_id':bit_id})

            #19 Time
            tz = tz.replace("-", "/")
            print(tz)
            user_tz = pytz.timezone(tz)
            local_time = bit.time.astimezone(user_tz)
            local_time = user_tz.normalize(local_time)
            print(local_time)
            information.update({'time':local_time})


            #20 Position
            information.update({'position':position})

            #1 Profile Image
            profile_img = bit.custom.image_thumbnail_small.url
            information.update({'profile_image': profile_img})

            #2 Type
            bit_type = bit.type
            information.update({'bit_type':bit_type})

        #Author Information
            #3 Name
            first_name = user.first_name
            last_name = user.last_name
            name = first_name + " " + last_name
            information.update({'name':name})

            #4 Username
            username = bit.user.username
            information.update({'username': username})
            
            bit_elements.update({'information':information})

        #Text Content
            bit_text = {}

            #5 Title
            title = bit.title
            bit_text.update({'title': title})

            #6 Body
            body = bit.body
            bit_text.update({'body':body})

            bit_elements.update({'bit_text':bit_text})

        #Multimedia Content

            bit_video = {}
            #7 Video
            if bit_type == 'video':
                video = bit.video.url
            else:
                video = None
            bit_video.update({'video':video})
            
            #8 Photos
            if bit_type == 'photo':
                bit_photos = []
                photo_count = 0 
                for photo in bit.photos.all():
                    large_thumbnail = photo.feed_thumbnail.url
                    bit_photos.append(large_thumbnail)
                    photo_count +=1
                
                bit_elements.update({'bit_photos':bit_photos})
            

        #Interaction Data

            interaction_data = {}
            #9 Likes
            likes = bit.likes.all()   
            if len(likes) < 1:
                like_count = 0
            else:
                like_count = likes.count
            interaction_data.update({'like_count':like_count})

            #10 Dislikes
            dislikes = bit.likes.all()
            if len(dislikes) < 1:
                dislike_count = 0
            else:
                dislike_count = dislikes.count
            interaction_data.update({'dislike_count':dislike_count})

        #User Interaction Information
            

            if user in likes:
                is_liked = feedback_icon_color

            else:
                is_liked = 'rgba(0,0,0,0)'
            interaction_data.update({'is_liked':is_liked})
            
            #18 is_disliked
            if user in dislikes:
                is_disliked = feedback_icon_color
            
            else:
                is_disliked = 'rgba(0, 0, 0, 0)'
            interaction_data.update({'is_disliked':is_disliked})

            #11 Comments
            comments = Comment.objects.filter(bit = bit)
            comment_count = comments.count
            interaction_data.update({'comment_count':comment_count})
            bit_elements.update({'interaction_data':interaction_data})

    #Customizations
            customization_data = {}
            #12 Title Color
            title_color = custom.title_color
            customization_data.update({'title_color':title_color})
            
            #13 Text Color
            text_color = custom.text_color
            customization_data.update({'text_color':text_color})
            
            #14 Accent Color
            accent_color = custom.accent_color
            customization_data.update({'accent_color':accent_color})
            
            #15 Feedback Icon Color
            feedback_icon_color = custom.icon_color
            customization_data.update({'feedback_icon_color':feedback_icon_color})
            
            #16 Background Color
            background_color = custom.bit_background
            customization_data.update({'background_color':background_color})
        #Extensions
            if bit_type == 'video_link':
                video_widget = bit.extend_widget
                bit_elements.update({'extend_widget':video_widget})

            bit_elements.update({'customization_data':customization_data})

            packaged_bit = BuildBit(bit_elements)

            feed_html += packaged_bit
                      

        
        return JsonResponse({'html':feed_html})




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
            comment_date = comment.time
            iteration += 1

            comments.update({
                comment + iteration: 
                {
                    'user_name':comment_user_name, 
                    'body':comment_body, 
                    'time':comment_date 
                }})

        return JsonResponse({'comments':comments})

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
        feedback_icon_background = bit_profile.custom.feedback_background_color
        icon_color = bit_profile.custom.feedback_icon_color

        #information needed to update rewards
        interacted_with = profile.interacted_with.all()
        liked_bits = profile.liked_bits.all()


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

            JsonResponse({
                'html':
                    f"""
                        <button type="button" class="feedback-icon-active" style="background-color: {feedback_icon_background};" data-catid="{bit_id}" name = "like" id="like{bit_id}"><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="active-like-icon-{bit_id}" style="fill:{icon_color}" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg></button>           
                    """
            })

        
        if is_liked:
            bit.likes.remove(request.user)
            profile.liked_bits.remove(bit)
            like_count = bit.likes.count()
            dislike_count = bit.dislikes.count()

            JsonResponse({
                'html':
                    f"""
                        <button type="button" class="feedback-icon" name = "like" id="like{bit_id}" data-catid="{bit_id}"><svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="like-icon-{bit_id}" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 17.5Q13.775 17.5 15.137 16.525Q16.5 15.55 17.1 14H15.45Q14.925 14.9 14.025 15.45Q13.125 16 12 16Q10.875 16 9.975 15.45Q9.075 14.9 8.55 14H6.9Q7.5 15.55 8.863 16.525Q10.225 17.5 12 17.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg></button>
                    """
            })


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
        feedback_icon_background = bit_profile.custom.feedback_background_color
        icon_color = bit_profile.custom.feedback_icon_color

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
            
            return JsonResponse({
                'html':
                    f"""
                        <button type="button" style="background-color: {feedback_icon_background};" data-catid="{id}" class="feedback-icon-active" name = "dislike" id="dislike{id}">
                            <svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                                <path id="active-dislike-icon-{id}" style="fill:{icon_color};" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 13.5Q10.225 13.5 8.863 14.475Q7.5 15.45 6.9 17H8.55Q9.075 16.1 9.975 15.55Q10.875 15 12 15Q13.125 15 14.025 15.55Q14.925 16.1 15.45 17H17.1Q16.5 15.45 15.137 14.475Q13.775 13.5 12 13.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/>
                            </svg>
                        </button>
                    """
                })

        if is_disliked:
            bit.dislikes.remove(request.user)
            profile.disliked_bits.remove(bit)
            like_count = bit.likes.count()
            dislike_count = bit.dislikes.count()
            return JsonResponse({
                'html':
                    f"""
                        <button type="button" class="feedback-icon" name = "dislike" id="dislike{bit_id}" data-catid="{bit_id}">
                        <svg id="feedback-icon-source" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path id="dislike-icon-{bit_id}" d="M15.5 11Q16.15 11 16.575 10.575Q17 10.15 17 9.5Q17 8.85 16.575 8.425Q16.15 8 15.5 8Q14.85 8 14.425 8.425Q14 8.85 14 9.5Q14 10.15 14.425 10.575Q14.85 11 15.5 11ZM8.5 11Q9.15 11 9.575 10.575Q10 10.15 10 9.5Q10 8.85 9.575 8.425Q9.15 8 8.5 8Q7.85 8 7.425 8.425Q7 8.85 7 9.5Q7 10.15 7.425 10.575Q7.85 11 8.5 11ZM12 13.5Q10.225 13.5 8.863 14.475Q7.5 15.45 6.9 17H8.55Q9.075 16.1 9.975 15.55Q10.875 15 12 15Q13.125 15 14.025 15.55Q14.925 16.1 15.45 17H17.1Q16.5 15.45 15.137 14.475Q13.775 13.5 12 13.5ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/>
                            </svg>
                        </button>
                        
                    """})


class BitDetailView(View):
    def get(self, request, pk, *args, **kwargs):
        write_comment = CommentForm()
        bit = Bit.objects.get(pk=pk)


        context = {
            'bit': bit,
            'write_comment': write_comment,
        }

        return render(request, 'user_profile/bit_detail.html', context)

    def post(self, request, pk, *args, **kwargs):
        write_comment = CommentForm()

def video_stream(request, video_id):
    env = environ.Env()
    environ.Env.read_env()

    this_bit = Bit.objects.get(pk=video_id)
    video_key = this_bit.video_key

    print(video_key)

    #Read AWS credentials from environment variables
    aws_access_key_id = env('LINODE_BUCKET_ACCESS_KEY')
    aws_secret_access_key = env('LINODE_BUCKET_SECRET_KEY')
    bucket_region = env('LINODE_BUCKET_REGION')

    s3 = boto3.client(
        's3',
        region_name=bucket_region, 
        aws_access_key_id=aws_access_key_id, 
        endpoint_url=f'https://{bucket_region}.linodeobjects.com',
        aws_secret_access_key=aws_secret_access_key
    )

    try:
        #Fetch the video object from the bucket
        response = s3.get_object(Bucket='objects-in-yourbit', Key='media/' + video_key)

        
        #Get the video content and set appropriate headers
        video_content = response['Body'].read()
        content_type = response['Content-Type'] = response['ContentType']

        # Create and return the file response
        response = FileResponse(video_content, content_type=content_type)
            
        # Set the 'Accept-Ranges' header to enable byte range requests
        response['Accept-Ranges'] = 'bytes'

        # Check for byte range requests
        if 'HTTP_RANGE' in request.META:
            range_header = request.META.get('HTTP_RANGE')
            video_size = os.path.getsize(video_content)
            start, end = parse_byte_range(range_header, video_size)

            if start is None:
                return HttpResponse(status=416)  # Requested range not satisfiable
            if start == 0 and end == video_size - 1:
                return response

            response.status_code = 206  # Partial Content
            response['Content-Range'] = f'bytes {start}-{end}/{video_size}'
            response['Content-Length'] = str(end - start + 1)
            video_content.seek(start)
            return response

        return response

    except ClientError as e:
        
        return HttpResponse(str(e), status=404)
        

    # video_file = open(video_path, 'rb')
    # response = FileResponse(video_file, content_type='video/mov')

    # # Set the 'Accept-Ranges' header to enable byte range requests
    # response['Accept-Ranges'] = 'bytes'

    # # Check for byte range requests
    # if 'HTTP_RANGE' in request.META:
    #     range_header = request.META.get('HTTP_RANGE')
    #     video_size = os.path.getsize(video_path)
    #     start, end = parse_byte_range(range_header, video_size)

    #     if start is None:
    #         return HttpResponse(status=416)  # Requested range not satisfiable
    #     if start == 0 and end == video_size - 1:
    #         return response

    #     response.status_code = 206  # Partial Content
    #     response['Content-Range'] = f'bytes {start}-{end}/{video_size}'
    #     response['Content-Length'] = str(end - start + 1)
    #     video_file.seek(start)
    #     return response

    # return response

def parse_byte_range(range_header, video_size):
    _, byte_range = range_header.split('=')
    start, end = byte_range.split('-')
    start = int(start) if start else 0
    end = int(end) if end else video_size - 1

    if start >= video_size or end >= video_size or start < 0 or end < 0 or start > end:
        return None, None

    return start, end