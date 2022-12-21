

#                   api/views.py
#                   11/19/2022
#                   Yourbit, LLC


from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.renderers import JSONRenderer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import *
from django.db.models import Q
from operator import attrgetter


# Create your views here.
#Overview
@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'User Profile':'/api/get/profile/',
        'Profile by ID': '/api/get/profile/<int:id>/',
        'bit':'/api/get/bit/id/'

    }

######################################################################################################

#                                            Start Profile

######################################################################################################


####################
# Get User Profile #
####################
@api_view(['GET'])
def userProfile(request):

    #Import from user_profile
    from user_profile.models import Profile
    from user_profile.api.serializers import ProfileSerializer
    user = request.user
    if user.is_authenticated:
        #Get profile bby request.user (login required)
        this_profile = Profile.objects.get(user=request.user)

        #Serialize result
        serializer = ProfileSerializer(this_profile, many=False)

        #Return Response
        return Response(serializer.data)

    else:
        return Response({'error':{'type': 'auth_error', 'message': 'Profile not found. Please login to Yourbit Network.'}})


#####################
# Get Profile By ID #
#####################
@api_view(['GET'])
def profile(request, this_id):

    #Import from user_profile
    from user_profile.models import Profile
    from user_profile.api.serializers import ProfileSerializer
    user = request.user
    
    #Get profile by this_id
    this_profile = Profile.objects.get(id=this_id)

    #Serialize Result
    serialized_profile = ProfileSerializer(this_profile, many=False)

    #Return Response
    return Response(serialized_profile.data)


########################
# Get User Connections #
########################
@api_view(['GET'])
def connections(request, filter_by):

    #Import from user_profile
    from user_profile.models import Profile
    from user_profile.api.serializers import ProfileResultSerializer
    
    user = request.user
    
    if user.is_authenticated: 
        #Get Profile
        this_profile = Profile.objects.get(user = user)

        #Check filters: all, friends, following
        if filter_by == "all":
            from itertools import chain
            #Get friends and following
            friends = this_profile.connections.all()
            following = this_profile.follows.all()
            
            #Chain Results
            these_connections = sorted(
                chain(friends, following), key=attrgetter('user.first_name'), reverse=False
            )

        if filter_by == "friends": 
            #Get friends
            these_connections = this_profile.connections.all()

        if filter_by == "following":
            #Get following
            these_connections = this_profile.follows.all()

        #Serialize Results
        serialized_results = ProfileResultSerializer(these_connections, many=True)

        #Return response
        return Response(serialized_results.data)
    
    else:
        return Response({'error':{'type':'auth_error', 'message':'Profile not found. Please log into the Yourbit Network'}})


##############################
# Get photos from User by ID #
##############################
# Gets photos by user ID
@api_view(['GET'])
def photos(request, this_id):

    from YourbitAccounts.models import Account as User
    from user_profile.models import Photo
    from user_profile.api.serializers import PhotoSerializer

    #Get this user by ID
    this_user = User.objects.get(id = this_id)

    #Filter photos by this user
    these_photos = Photo.objects.filter(user = this_user)

    #Serialize Results
    serialized_photos = PhotoSerializer(these_photos, many=True)

    #Return Response
    return Response(serialized_photos.data)


###############################
# List Likes (Requires Login) #
###############################
#
# Gets likes for current user
#
@api_view(['GET'])
def listLikes(request):

    #from feed import Interaction History
    from feed.models import InteractionHistory
    from user_profile.api.serializers import BitSerializer
    
    user = request.user

    if user.is_authenticated:
        #Set interactions = to user interaction history 
        these_interactions = InteractionHistory.objects.get(user = request.user)
        these_likes = these_interactions.liked_bits
        
        serialized_bits = BitSerializer(these_likes, many=True)

        return Response(serialized_bits.data)

    else:
        return Response({'error':{'type':'auth_error', 'message': 'Profile not found. Please log in to the Yourbit Network.'}})



##################################
# List Dislikes (Requires Login) #
##################################
# Gets likes for current user
@api_view(['GET'])
def listDisikes(request):

    #from feed import Interaction History
    from feed.models import InteractionHistory
    from user_profile.api.serializers import BitSerializer
    
    #Set interactions = to user interaction history 
    these_interactions = InteractionHistory.objects.get(user = request.user)
    these_dislikes = these_interactions.disliked_bits
    
    serialized_bits = BitSerializer(these_dislikes, many=True)

    return Response(serialized_bits.data)


################################
# List Shares (Requires Login) #
################################
# Gets likes for current user
@api_view(['GET'])
def listShares(request):

    #from feed import Interaction History
    from feed.models import InteractionHistory
    from user_profile.api.serializers import BitSerializer
    
    user = request.user

    if user.is_authenticated:
        #Set interactions = to user interaction history 
        these_interactions = InteractionHistory.objects.get(user = request.user)
        these_shares = these_interactions.shared_bits
        
        #Serialize bit results
        serialized_bits = BitSerializer(these_shares, many=True)

        return Response(serialized_bits, many=True)
    
    else:
        return Response({'error':{'type':'auth_error', 'message': 'Profile not found. Please log in to the Yourbit Network.'}})



########################################################################################################
#                                               End Profile
########################################################################################################




#                                   ---Space Intentionally Left Blank---





########################################################################################################

#                                             Start User Feed

########################################################################################################


######################
# Get User Bitstream #
######################
#
# Meta: feed timeline postlist posts bitlist bits 
#
@api_view(['GET'])
def bitstream(request, type, filter, sort, start):

    from user_profile.models import Profile, Bit, Photo
    from user_profile.api.serializers import BitSerializer
    
    user = request.user

    if user.is_authenticated:
        #Get Profile by request.user
        profile = Profile.objects.get(user = request.user)
        #Check Filters: All, Friends, Following
        if filter == 'all':    
            public_end = start + 3
            connection_end = start + 5
            from itertools import chain
            #Get Friends
            friends = profile.connections.all()
            #Initialize friend pool
            friend_pool = []
            #Include request.user to get current users posts
            friend_pool.append(request.user)

            if len(friends) > 0:

                #For each friend append to friend pool
                for this_friend in friends:
                    friend_pool.append(this_friend.user) 
                
            #Create unsorted bitpools by filtering bits
            private_bit_pool = Bit.objects.prefetch_related('user', 'custom').filter(user__in = friend_pool).order_by('-time')[start:connection_end]
            
            #Initialize following pool
            following_pool = []
            if len(following) > 0:
                #Get following
                following = profile.follows.all()

                #For each follow in following append to following pool
                for this_follow in following:
                    following_pool.append(this_follow.user)

            #Get follow bitpool
            follow_bit_pool = Bit.objects.prefetch_related('user', 'custom').filter(user__in = following_pool, is_public = True).order_by('-time')[start:connection_end]

            #Get Public Bit Pool by top liked
            public_bit_pool = Bit.objects.prefetch_related('user', 'custom').filter(is_public = True).order_by('-like_count')[start:public_end]
            
            #Chain results and sort by time
            bit_pool = sorted(
                chain(private_bit_pool, follow_bit_pool, public_bit_pool), key=attrgetter('time'), reverse=True
            )

        if filter == 'friends':
            #Get Friends
            friends = profile.connections.all()

            #For friend in friends append to friend pool
            if len(friends) > 0:
                #Assemble friend pool
                friend_pool = []
                for friend in friends:
                    friend_pool.append(friend.user) 
                
                #Filter bits by friends
                bit_pool = Bit.objects.select_related('user').filter(user__in = friend_pool).order_by('-time')
            
            else:
                return Response('Looks like you need more friends. Add some now!')


        if filter == 'following':
            #Get following
            following = profile.follows.all()

            if len(following) > 0:
                #Initialize following pool
                following_pool = []

                #For follow in following append to follow pool
                for follow in following:
                    following_pool.append(follow.user)

                #Get public bits for all followed accounts sorted by time
                bit_pool = Bit.objects.select_related('user').filter(user__in = following_pool, is_public = True).order_by('-time')
                print(bit_pool)

            else:
                return Response("Hmm, doesn't seem like theres anything here. Go ahead and follow someone!")

        #Serialize bitstream results
        bs_serialized = BitSerializer(bit_pool, many=True)

        #Return response
        return Response(bs_serialized.data)
    
    else:
        bit_pool = Bit.objects.select_related('user', 'custom').filter(is_public=True).order_by('-like_count')



########################################################################################################
#                                           End User Feed
########################################################################################################





#                                 ---Space Intentionally Left Blank---





########################################################################################################

#                                             Start Bits

########################################################################################################


#################
# Get Bit by ID #
#################
#
# Gets information on specified bit by ID
#
@api_view(['GET'])
def bit(request, this_id):

    from user_profile.models import Bit
    from user_profile.api.serializers import BitSerializer

    #Get bit object by this_id
    this_bit = Bit.objects.prefetch_related('custom', 'user').get(id=this_id)
    
    #Serialize result
    bit_serialized = BitSerializer(this_bit, many=False)

    #return Response
    return Response(bit_serialized.data)


#####################
# Publish a new bit #
#####################
@api_view(['POST'])
def newBit(request):

    #Import Bit form from user_profile
    from user_profile.forms import BitForm
    from user_profile.models import Profile, Custom
    from user_profile.api.serializers import BitSerializer

    #Get bit form
    bit_form = BitForm()

    #Create new bit instance
    new_bit = bit_form.save(commit=False)

    #Get user profile
    user_profile = Profile.objects.get(user = request.user)

    #Get title from request.post
    title = request.POST.get('title')

    #Get body from request.post
    body = request.POST.get('body')

    #Get type from request.post
    type = request.POST.get('type')

    #Declare contains video link to check for linked videos from third party
    contains_video_link = False

    #Apply Type
    new_bit.bit_type = type
#   _______________
    #If type = chat
#   ***************
    if type == 'chat':

        #Check if title
        if title != 'yb-no-title':
            new_bit.title = title

        ## Youtube Links ##
#       **---------------**

        #Check if youtube.com or youtu.be in body
        if 'youtube.com' in body or 'youtu.be' in body:
            #If in body split by spaces
            split_bit = body.split(' ')
            print(split_bit)

            #Find video_id
            for word in split_bit:
                #Find link by v=
                if 'v=' in word:
                    
                    #Set contains video link to true
                    contains_video_link = True
                    
                    #Get position of v=
                    position = word.index('v=')

                    #Set position to v= + 2
                    position = position + 2

                    #Set video ID to URL segment
                    video_id = word[position:len(word)]

                    #Create an extend widget containing video embed
                    new_bit.extend_widget = '<iframe style="margin-top: 5px;" width="98%" height="fit-content" src="https://www.youtube.com/embed/'+ video_id +'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
                    
                    #Rejoin bit body
                    body = ' '.join(split_bit)
                    
                    #Apply contains video link setting
                    new_bit.contains_video_link = True

                    #Redefine bit type
                    new_type ='video_link'
                    break
                
                #If youtu.be in word, this is a tiny URL link but still contains the same ID
                elif 'youtu.be' in word:
                    #Set contains video link to true
                    contains_video_link = True

                    #Search for e/
                    position= word.index('e/')

                    #Set position to e/ + 2
                    position = position + 2

                    #Locate video id in URL
                    video_id = word[position:len(word)]

                    #Create extend widget containing video embed
                    new_bit.extend_widget = '<iframe style="margin-top: 5px;" width="98%" height="fit-content" src="https://www.youtube.com/embed/'+ video_id +'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
                    
                    #Rejoin body
                    body = ' '.join(split_bit)

                    #Apply video link setting
                    new_bit.contains_video_link = True

                    #Redefine bit type
                    new_type ='video_link'
                    break
                
                #For native embedded videos
                elif 'embed' in word:
                    #Set contains video link to True
                    contains_video_link = True
                    
                    #Apply Setting
                    new_bit.contains_video_link = True
                    
                    #Create Extend widget
                    new_bit.extend_widget = word
                    
                    #Redefine Bit type
                    new_type ='video_link'
                    break

        #Apply Body
        new_bit.body = body 

    #If bit type = photo
    ####################

    elif type == 'photo':
        #Import photo model
        from user_profile.models import Photo

        #Get file from request
        image = request.FILES.get('photo')

        #Create photo instance
        new_photo = Photo()

        #Set new photo file to object
        new_photo.image = image

        #Assign photo object to user
        new_photo.user = request.user

        #Add photo to bit photos
        new_bit.photos.add(new_photo)
        
        
        #Check if body
        if body != 'yb-no-body':
            new_bit.body = body

    #If video bit
    #############
    else:
        #Get files from request.post
        video = request.FILES.get('video')

        #Apply video to new bit
        new_bit.video = video
    
    #Assign new bit to request.user
    new_bit.user = request.user 

    
    #Apply Customizations from profile
    new_bit.custom = Custom.objects.get(profile=user_profile)

    #Save bit
    new_bit.save()
    
    #Serialize new bit
    bit_serialized = BitSerializer(new_bit, many=False)

    #Return response
    return Response(bit_serialized.data)



##################################################
# Get user interactions with bit, login required #
##################################################
#
# This view is for updating the like and dislike buttons on bits in a bitstream
#
@api_view(['GET'])
def bitInteractions(request, this_id):

    from user_profile.models import Bit
    
    #Get bit by ID
    this_bit = Bit.objects.get(id = this_id)

    #Declare Variables is_liked and is_disliked
    is_liked = False
    is_disliked = False

    #Check if bit is in likes
    if request.user in this_bit.likes:
        #if in likes is liked = true
        is_liked = True

    #Check if bit in dislikes
    if request.user in this_bit.dislikes:
        #if in dislikes, disliked = True
        is_disliked = True

    #Generate response object
    response = {
        'is_liked':is_liked,
        'is_disliked':is_disliked
    }

    #Return Response
    return Response(response)

#####################################
# Delete a bit (requires user login #
#####################################
#
# API Call for deleting a bit from the database by ID
#
@api_view(['DELETE'])
def deleteBit(request):
    from user_profile.models import Bit
    
    user = request.user

    
    #Get this bit by this ID
    this_bit = Bit.objects.get(id=this_id)
    
    #Delete this bit
    this_bit.delete()

    #Return success response
    return Response('Bit has been Vaporized Successfully.')


########################################################################################################
#                                               End Bits
########################################################################################################





#                               ---This Space is Intentionally Left Blank---





########################################################################################################

#                                             Start Comments

########################################################################################################

####################
# Create a comment #
####################
#
# Create a new comment in bit database
#
@api_view(['POST'])
def createComment(request):
    #Import comment models from feed
    from feed.models import Comment
    from feed.api.serializers import CommentSerializer

    #Create comment instance
    this_comment = Comment()
    
    #Set sender to request.user
    this_comment.sender = request.user

    #Apply body to new_comment
    this_comment.body = request.POST.get("body")
    
    #Assign new comment to bit
    this_comment.bit = request.POST.get("this_id")
    this_comment.save()

    #Serialize comment
    serialized_comment = CommentSerializer(this_comment, many=False)

    #Return response
    return Response(serialized_comment.data)


#################
# List Comments #
#################
#
# Generate a list of comments on a bit, widget, or in bit detail view
#
@api_view(['GET'])
def listComments(request, this_id):
    #Import comment model from feed
    from feed.models import Comment
    from user_profile.models import Bit
    from feed.api.serializers import CommentSerializer
    
    #Set this bit to this_id
    this_bit = Bit.objects.get(id = this_id)

    #Filter comments associated with this bit
    these_comments = Comment.objects.filter(bit = this_bit)

    #Serialize comment results
    serialized_comments = CommentSerializer(these_comments, many=True)

    #Return response
    return Response(serialized_comments.data)


####################
# Delete a comment #
####################
#
# 
#
@api_view(['DELETE'])
def deleteComment(request, this_id):
    #Get comment model from feed
    from feed.models import Comment

    #Get this comment by this ID
    this_comment = Comment.objects.get(id=this_id)
    
    #Delete this comment
    this_comment.delete()

    #Return response
    return Response('Comment has been Vaporized Successfully.')

#######################################################################################################
#                                             End Comments
#######################################################################################################





#                               ---This Space is Intentionally Left Blank---




#######################################################################################################

#                                            Start Messages

#######################################################################################################

#####################
# Get conversations #
#####################
@api_view(['POST'])
def getConversations(request):
    #Import conversation model
    from messenger.models import Conversation
    from messenger.api.serializers import ConversationSerializer

    #Filter conversations by request.user
    these_conversations = Conversation.objects.filter(sender = request.user)

    #Serialize list of conversation results
    serialized_conversations = ConversationSerializer(these_conversations, many=True)

    #Return response containing list of results
    return Response(serialized_conversations.data)


#######################
# Delete Conversation #
#######################
@api_view(['DELETE'])
def deleteConversation(request, this_id):
    #Import conversation model from messafes
    from messenger.models import Conversation

    #Get this conversation by this ID
    this_conversation = Conversation.objects.get(id=this_id)

    #Delete this conversation
    this_conversation.delete()

    #Return response
    return Response('Conversation successfully deleted.')


####################
# Create a Message #
####################
@api_view(['POST'])
def addMessage(request):
    #Import message models
    from messenger.models import Message, Conversation
    from messenger.api.serializers import MessageSerializer
    
    #Declare new message object
    this_message = Message()

    #Get Message Body and set it to message body in new_message
    this_message.body = request.POST.get("body")

    #Get receiver user
    other_user = request.POST.get("receiver")

    #set new message receiver as receiver_user
    this_message.receiver = other_user 
    this_message.save()

    #Get each users conversation and add new message to the conversation

    #Sender users conversation
    this_conversation = Conversation.objects.get_or_create(sender = request.user, receiver = other_user)
    this_conversation.messages.add(this_message)

    #Receiver users conversation
    that_conversation = Conversation.objects.get_or_create(sender = other_user, receiver = request.user)
    that_conversation.messages.add(this_message)

    #Serialize new message
    message_serialized = MessageSerializer(this_message, many = False)

    #Return new message in json response
    return Response(message_serialized.data)


####################
# Delete a Message #
####################
#
#
#
@api_view(['DELETE'])
def deleteMessage(request, this_id):
    #Import Message model
    from messenger.models import Message

    #Get message by this_id
    this_message = Message.objects.get(id=this_id)
    
    #Delete message
    this_message.delete()

    #Return response
    return Response('What Message?')


########################################################################################################
#                                             End Messages
########################################################################################################




#                               ---This space is Intentionally Left Blank---





########################################################################################################

#                                      ---Start Privacy Settings---

########################################################################################################

@api_view(['GET'])
def privacySettings(request):
    
    #From .models import privacy settings import privacy settings
    from settings.models import PrivacySettings
    from settings.serializers import PrivacySettingsSerializer

    #Set user to request.user
    user = request.user

    #Get this users privacy settings by user
    these_settings = PrivacySettings.objects.get(user = user)

    serialized_settings = PrivacySettingsSerializer(these_settings, many = False)

    return Response(serialized_settings.data)
@api_view(['GET'])
def feedSettings(request):

    from settings.models import FeedSettings
    from settings.serializers import FeedSettingsSerializer

    user = request.user

    these_settings = FeedSettings.objects.get(user = user)

    serialized_settings = FeedSettingsSerializer(these_settings, many=False)

    return Response(serialized_settings.data)


@api_view(['GET'])
def customizations(request):

    from user_profile.models import Custom
    from user_profile.api.serializers import CustomizationSerializer




