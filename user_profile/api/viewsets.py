from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from user_profile.api.serializers import BitSerializer, BitIDSerializer, ProfileSerializer
from .serializers import *
from rest_framework.response import Response
from django.db.models import Q
from operator import attrgetter
from django_filters.rest_framework import DjangoFilterBackend
from ..forms import ColorForm, BackgroundPictureUpload, ProfilePictureUpload
from rest_framework.decorators import api_view
from rest_framework.response import Response
from user_profile.models import *
from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser

class ProfileViewSet(viewsets.ViewSet):
    def get_queryset(self):
        from itertools import chain
        this_profile = Profile.objects.get(user=self.request.user)
        if self.request.query_params:
            filter = self.request.query_params.get("filter")
            print(filter)
            this_profile = Profile.objects.get(user=self.request.user)
            
            if filter == "all":
                friend_list = this_profile.connections.all()
                follow_list = this_profile.follows.all()

                profile_list = sorted(
                chain(friend_list, follow_list), key=attrgetter('id'), reverse=False
            )
            elif filter == "friends":
                profile_list = this_profile.connections.all()

            elif filter == "following":
                profile_list = this_profile.follows.all()

            elif filter == "followers":
                profile_list = this_profile.followers.all()
                

        if self.request.query_params.get("user"):
            this_id = self.request.query_params.get("user")
            this_user = User.objects.get(username = this_id)
            this_profile = Profile.objects.get(user=this_id)
            
            if filter == "all":
                friend_list = this_profile.connections.all()
                follow_list = this_profile.follows.all()

                profile_list = sorted(
                chain(friend_list, follow_list), key=attrgetter('user.first_name'), reverse=False
            )
            if filter == "friends":
                profile_list = this_profile.connections.all()

            if filter == "following":
                profile_list = this_profile.follows.all()
            
            if filter == "followers":
                profile_list = this_profile.followers.all()

        return profile_list

    def list(self, request):
        profile_list = self.get_queryset()
        print(profile_list)
        if len(profile_list) == 1:
            serializer_class = ProfileSerializer(profile_list, many = True)
            print(serializer_class.data)
            return Response({'results_found':True, 'results':serializer_class.data})

        elif len(profile_list) > 1:
            serializer_class = ProfileSerializer(profile_list, many = True)
            return Response({'results_found':True, 'results':serializer_class.data})
        else:
            this_user = request.user.first_name
            from api.dialogue_processors import getDialogue
            message = getDialogue("no_friends", None, request.user.first_name, None)
            return Response({'results_found':False, 'message':message})

    def retrieve(self, request, pk):
        queryset = Profile.objects.all()
        user = User.objects.get(username = pk)
        profile = get_object_or_404(queryset, user=user)
        serializer_class = ProfileSerializer(profile, many=False)
        print(serializer_class)
        return Response(serializer_class.data)
        

    def create(self):
        pass

########################################################################################################

#                                             Start Bits

########################################################################################################


class BitViewSet(viewsets.ViewSet):

    #Define Serializer class user_profile.serializers.BitSerializer
    serializer_class = BitSerializer

    parser_classes = [FileUploadParser, MultiPartParser, FormParser]

    #Define get queryset for filtering by url query params
    def get_queryset(self):
        from itertools import chain
        user_profile = Profile.objects.get(user = self.request.user)

        #Check for query params, if query params then identify which are contained
        if self.request.query_params:
            print("params found")
            type = self.request.query_params.get('type')
            this_filter = self.request.query_params.get('filter')
            sort = self.request.query_params.get('sort')
            print(type + "\n\n" + this_filter + "\n\n" + sort + "\n\n")
            start = int(self.request.query_params.get('start'))
            end = int(start)+5

            #Check if query param defines profile parameter, if so retrieve bits pertaining to a specific profile
            if self.request.query_params.get("profile"):
                this_username = self.request.query_params.get("profile")
                this_user = User.objects.get(username = this_username)
                this_profile = Profile.objects.get(user = this_user)
                
                request_profile = Profile.objects.get(user=self.request.user)
                user_connections = request_profile.connections.all()
                
                if this_profile in user_connections:

                #Check if type = global, there is no global classification for bits in database, this means get bits of all types
                    if type == "global":
                        bit_pool = Bit.objects.filter(profile = this_profile).order_by("-time")
    
                    #If bits aren't global use data from query params to filter bit by type
                    else:
                        bit_pool = Bit.objects.filter(profile = user_profile, type=type).order_by("-time")
    
                        bit_pool = sorted(
                            chain(my_bits, friends_bits, follow_bits, all_bits), key=attrgetter('time'), reverse=True
                    )
                else:
                    if this_profile == request_profile:
                        bit_pool = Bit.objects.filter(profile = this_profile).order_by("-time")
                    
                    else:
                        bit_pool = Bit.objects.filter(profile = user_profile, is_public = True).order_by("-time")

            else:
                #Dataset is used for aggregating results based on filters within saved or interacted bits
                if self.request.query_params.get("dataset"):
                    dataset = self.request.query_params.get("dataset")
                    from feed.models import InteractionHistory
                    these_interactions = InteractionHistory.objects.get(user = self.request.user)
                    
                    #If dataset=liked filter by liked bits
                    if dataset == "liked":

                        bit_pool = these_interactions.liked_bits.all().order_by("-time")
                    
                    #if dataset=disliked filter by disliked bits
                    if dataset == "disliked":
                        bit_pool = these_interactions.disliked_bits.all().order_by("-time")
                    
                    #if dataset=commented filter by bits commented on
                    if dataset == "commented":
                        bit_pool = these_interactions.commented_on.all().order_by("-time")
                    
                    #If dataset=shared filter by bits shared
                    if dataset == "shared":
                        bit_pool = these_interactions.shared_bits.all().order_by("-time")
                    
                    #If dataset=saved get folder param, then retrieve bits in saved folder
                if self.request.query_params.get("cluster"):
                    from user_profile.models import Cluster
                    cluster_id = self.request.query_params.get("cluster")
                    this_cluster = Cluster.objects.get(id = cluster_id)
                    bit_pool = this_cluster.bits.all().order_by("-time")
                    





                else:
                    #Check type param, if global get all post types, if else, get post based on type
                    if type == "global":
                        unsorted_list = []
                        
                        my_bits = Bit.objects.filter(profile = user_profile)

                        if this_filter != None:
                            #split filter by hyphens
                            this_filter = this_filter.split("-")
                            print(this_filter)

                            for item in this_filter:
                                if item == "fr":
                                    friends_bits = Bit.objects.prefetch_related('custom', 'user').filter(profile__in = user_profile.connections.all()).order_by("-time")
                                    for bit in friends_bits:
                                        if bit not in unsorted_list:
                                            unsorted_list.append(bit)
                                    

                                if item == "ff":
                                    follow_bits = Bit.objects.prefetch_related('custom', 'user').filter(profile__in = user_profile.connections.all()).order_by("-time")
                                    for bit in follow_bits:
                                        if bit not in unsorted_list:
                                            unsorted_list.append(bit)

                                if item == "p":
                                    public_bits = Bit.objects.prefetch_related('custom', 'user').filter(is_public = True).order_by("-time")
                                    for bit in public_bits:
                                        if bit not in unsorted_list:
                                            unsorted_list.append(bit)

                                if item == "me":
                                    my_bits = Bit.objects.prefetch_related('custom', 'user').filter(profile = user_profile).order_by("-time")
                                    for bit in my_bits:
                                        if bit not in unsorted_list:
                                            unsorted_list.append(bit)
                        else:
                            print("filter query error")

                        bit_pool = sorted(
                            chain(unsorted_list), key=attrgetter('time'), reverse=True)

                    else:
                        my_bits = Bit.objects.filter(profile = user_profile, type=type)
                        friends_bits = Bit.objects.prefetch_related('custom', 'user').filter(profile__in = user_profile.connections.all(), type = type).order_by("-time")
                        follow_bits = Bit.objects.prefetch_related('custom', 'user').filter(profile__in = user_profile.connections.all(), type=type).order_by("-time")
                        all_bits = Bit.objects.prefetch_related('custom', 'user').filter(is_public = True, type=type).order_by('-like_count')

                        #Aggregate and sort posts into pool
                        bit_pool = sorted(
                            chain(my_bits, friends_bits, follow_bits, all_bits), key=attrgetter('time'), reverse=True
                    )

                
        #Else, a users on profile, filter bits by user_profile
        else:
            #Aggregate and sort posts in pool
            bit_pool = Bit.objects.filter(profile = user_profile)

        return bit_pool
        
    
    #List bits by queryset
    def list(self, request):
        from feed.models import InteractionHistory
        this_profile = Profile.objects.get(user = request.user)
        interaction_history = InteractionHistory.objects.get(user = request.user)
        user_tz = this_profile.current_timezone
        bit_pool = self.get_queryset()
        bit_id_pool = []
        for bit in bit_pool:
            bit_id_pool.append(bit.id)

        #Get liked bits from queryset
        liked_bits = BitIDSerializer(interaction_history.liked_bits.filter(id__in = bit_id_pool), many=True)

        #Get disliked bits from queryset
        disliked_bits = BitIDSerializer(interaction_history.disliked_bits.filter(id__in = bit_id_pool), many=True)

        #Get commented bits from queryset
        commented_bits = BitIDSerializer(interaction_history.commented_on.filter(id__in = bit_id_pool), many=True)

        #Get shared bits from queryset
        shared_bits = BitIDSerializer(interaction_history.shared_bits.filter(id__in = bit_id_pool), many=True)

        #Check if bit pool is empty

        print(bit_pool)
        if len(bit_pool) == 0:
            from api.dialogue_processors import no_bits_found
            import random
            selector = random.randrange(0, len(no_bits_found))
            response_message = no_bits_found[selector]
            print(response_message)
            return Response({"bits_found":False, "message":response_message})

        else:
            serializer_class = BitSerializer(bit_pool, many=True, context={'user_tz':user_tz})
            return Response({
                "bits_found":True, 
                "liked_bits": liked_bits.data, 
                "disliked_bits":disliked_bits.data, 
                "commented_bits":commented_bits.data, 
                "shared_bits":shared_bits.data,
                "content":serializer_class.data
            })
        
        


    def create(self, request):
        #Import Bit form from user_profile
        from user_profile.forms import BitForm
        from user_profile.models import Profile, Custom
        from user_profile.api.serializers import BitSerializer

        

        print(request)
        #Get bit form
        bit_form = BitForm()

        #Create new bit instance
        new_bit = bit_form.save(commit=False)

        #Get user profile
        user_profile = Profile.objects.get(user = request.user)

        #Get title from request.post
        title = request.data.get('title')
        print(title)
        #Get body from request.post
        body = request.data.get('body')

        #Get type from request.post
        type = request.data.get('type')

        #Declare contains video link to check for linked videos from third party
        contains_video_link = False

        new_bit.contains_video_link = contains_video_link

        #Set new type to type
        new_type = type
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

            #Apply new type to bit
            new_bit.type = new_type

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
        new_bit.profile = user_profile

        
        #Apply Customizations from profile
        new_bit.custom = Custom.objects.get(profile=user_profile)

        #Save bit
        new_bit.save()
        
        #Serialize new bit
        bit_serialized = BitSerializer(new_bit, many=False)

        #Return response
        return Response(bit_serialized.data)
    
    def update(self, request, pk):
        print(request.data)
        change = request.data.get('action')
        this_id = request.data.get("this_id")
        print(this_id)
        this_bit = Bit.objects.get(id=pk)
        user = self.request.user
        if change == 'title':
            title = request.POST.get("title")
            if this_bit.has_title == False:
                this_bit.has_title = True
            this_bit.title = title

            


        if change == 'body':
            body = request.POST.get('body')
            this_bit.body = body

        if change == 'like':
            from feed.models import Interaction, InteractionHistory
            these_interactions = InteractionHistory.objects.get(user = user)
            these_likes = these_interactions.liked_bits.all()
            these_dislikes = these_interactions.disliked_bits.all()
            is_disliked = False
            is_liked = False

            if this_bit in these_likes:
                is_liked = True

            if this_bit in these_dislikes:
                is_disliked = True

            if is_liked:
                this_bit.likes.remove(user)
                these_interactions.liked_bits.remove(this_bit)
                action = "unlike"
            
            else:
                if is_disliked:
                    this_bit.dislikes.remove(user)
                    these_interactions.disliked_bits.remove(this_bit)
                
                this_bit.likes.add(user)
                these_interactions.liked_bits.add(this_bit)
                action = "like"
            
            new_interaction = Interaction(action_class = 1, action_sub_class = 7, bit = this_bit, from_user = user, to_user = this_bit.user)
            new_interaction.save()

            serialized_bit = BitSerializer(this_bit, many=False)

            return Response({"action":action, "this_bit":serialized_bit.data})

        if change == 'dislike':
            from feed.models import Interaction, InteractionHistory
            these_interactions = InteractionHistory.objects.get(user = user)
            these_likes = these_interactions.liked_bits.all()
            these_dislikes = these_interactions.disliked_bits.all()
            is_disliked = False
            is_liked = False

            if this_bit in these_likes:
                is_liked = True

            if this_bit in these_dislikes:
                is_disliked = True
                

            if is_disliked:
                this_bit.dislikes.remove(user)
                these_interactions.disliked_bits.remove(this_bit)
                action = "undislike"
            
            else:
                if is_liked:
                    this_bit.likes.remove(user)
                    these_interactions.liked_bits.remove(this_bit)
                
                this_bit.dislikes.add(user)
                these_interactions.disliked_bits.add(this_bit)
                action = "dislike"

            new_interaction = Interaction(action_class = 1, action_sub_class = 8, bit = this_bit, from_user = user, to_user = this_bit.user)
            new_interaction.save()

            serialized_bit = BitSerializer(this_bit, many=False)

            return Response({"action":action, "this_bit":serialized_bit.data})

        if change == "comment":
            from feed.models import Comment
            this_bit = Bit.objects.get(id=pk)
            this_comment = request.data.get("body")

            new_comment = Comment(sender = user, bit=this_bit, body = this_comment)

            new_comment.save()

            from feed.api.serializers import CommentSerializer
            serialized_comment = CommentSerializer(new_comment, many=False)

            return Response(serialized_comment.data)



        if change == "share":
            from feed.models import Interaction, InteractionHistory
            these_interactions = InteractionHistory.objects.get(user = user)
            this_bit.shares.add(user)

            new_interaction = Interaction(action_class = 1, action_sub_class = 12, bit = this_bit, from_user = user, to_user = this_bit.user)
            new_interaction.save()
            

        this_bit.save()

        

    def retrieve(self, request, pk=None):
        self.queryset = Bit.objects.all()
        self.bit = get_object_or_404(self.queryset, pk=pk)
        user_profile = Profile.objects.get(user = request.user)
        current_timezone = user_profile.current_timezone

        serializer_class = BitSerializer(self.bit, many=False, context = {"user_tz":current_timezone})

        return Response(serializer_class.data)

    def destroy(self, request, pk):
        this_bit = Bit.objects.get(id=pk)
        this_bit.delete()
        return Response('Bit deleted successfully')
########################################################################################################
#                                               End Bits
########################################################################################################










########################################################################################################

#                                             Start Photos

########################################################################################################


class PhotoViewSet(viewsets.ViewSet):
    def list(self, request):
        user_photos = Photo.objects.filter(user = self.request.user) 
        serializer_class = PhotoSerializer(user_photos, many = True)

        return Response(serializer_class.data)

########################################################################################################
#                                               End Photos
########################################################################################################





class CustomizationViewSet(viewsets.ViewSet):
    def list(self, request):
        user_profile = Profile.objects.get(user = request.user)
        customization = Custom.objects.get(profile = user_profile)

        serializer_class = CustomizeSerializer(customization, many = False)

        return Response(serializer_class.data)
    def retrieve(self, request, pk=None):
        user_profile = Profile.objects.get(user = request.user)
        customization = Custom.objects.get(profile = user_profile)

        serializer_class = CustomizeSerializer(customization, many = False)

        return Response(serializer_class.data)

    def create(self, request):
        user_profile = Profile.objects.get(user=request.user)
        custom = Custom.objects.get(profile = user_profile)
        profile_image_form = ProfilePictureUpload()
        background_image_form = BackgroundPictureUpload()
        action = request.data.get('action')
        print(action)
        if action == 'image_upload':
            option = request.data.get('field')
            value = request.FILES.get('value')
            print(option)
            print(value)
            if option == 'background_image':
                custom.background_image = value
                custom.save()

            if option == 'profile_image':
                custom.image = value
                custom.save()

        if action == 'color_change': 
            option = request.POST.get('field')
            value = request.POST.get('value')
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

        return Response('Customization Settings Successfully Updated!')

class ClusterVS(viewsets.ViewSet):
    def list(self, request):
        user_profile = Profile.objects.get(user = request.user)
        clusters = Cluster.objects.filter(profile = user_profile)
        
        if len(clusters) > 0:
        
            serializer_class = ClusterSerializer(clusters, many = True)


            return Response({"is_clusters" : True, "cluster_list": serializer_class.data})
        
        else:
            return Response({"is_clusters" : False})

    def retrieve(self, request, pk=None):
        user_profile = Profile.objects.get(user = request.user)
        cluster = Cluster.objects.get(id=pk)
        serializer_class = ClusterSerializer(cluster, many = False)
        

        return Response(serializer_class.data)

    def create(self, request):
        user_profile = Profile.objects.get(user = request.user)
        cluster = Cluster(profile = user_profile)
        cluster.save()

        return Response('Cluster Created Successfully!')

    def destroy(self, request, pk=None):
        cluster = Cluster.objects.get(id=pk)
        cluster.delete()

        return Response('Cluster Deleted Successfully!')
    
@api_view(["POST"])
def requestFriend(request):
    from notifications.models import Notification
    from YourbitAccounts.models import Account as User
    username = request.data.get("user_id")
    to_user = User.objects.get(username=username)
    new_notification = Notification(type = 4, to_user=to_user, from_user = request.user)
    new_notification.save()
    return Response({"Response":"Added user as friend"})
    
@api_view(["POST"])
def follow(request):
    from notifications.models import Notification
    from YourbitAccounts.models import Account as User
    print("Endpoint Reached")
    that_id = request.data.get("user_id")
    that_user = User.objects.get(id = that_id)

    this_profile = Profile.objects.get(user = request.user)
    that_profile = Profile.objects.get(user = that_user)

    this_profile.follows.add(that_profile)
    this_profile.save()

    that_profile.followers.add(this_profile)
    that_profile.save()
    
    new_notification = Notification(type = 3, to_user = that_profile, from_user = this_profile)
    new_notification.save()
    return Response({"Response":"Successfully followed user"})

@api_view(["POST"])
def updateTimezone(request):
    this_profile = Profile.objects.get(user=request.user)
    this_timezone = request.data.get("user_tz")
    print(this_timezone)
    this_profile.current_timezone = this_timezone
    this_profile.save()
    return Response({"Response":"Timezone successfully updated"})

@api_view(["POST"])
def likeBit(request):
    from feed.models import InteractionHistory, Interaction
    this_id = request.data.get("bit_id")
    this_bit = Bit.objects.get(id = this_id)

    interaction_history = InteractionHistory.objects.get(user = request.user)
    
    # If the user has already liked the bit, remove the like and delete the interaction
    if this_bit in interaction_history.liked_bits.all():
        interaction_history.liked_bits.remove(this_bit)
        existing_interaction = Interaction.objects.get(bit = this_bit, from_user=request.user, action_class = 1, action_sub_class = 7)
        existing_interaction.delete()
        this_bit.like_count -= 1
        this_bit.likes.remove(request.user)
        result = "removed"
    # If the user has not liked the bit, add the like and create a new interaction
    else:
        from notifications.models import Notification
        # If the user has disliked the bit, remove the dislike and delete the interaction
        if this_bit in interaction_history.disliked_bits.all():
            
            interaction_history.disliked_bits.remove(this_bit)
            existing_interaction = Interaction.objects.get(bit = this_bit, from_user=request.user, action_class = 1, action_sub_class = 8)
            existing_interaction.delete()
            this_bit.dislike_count -= 1
            this_bit.dislikes.remove(request.user)

    
                
        new_notification = Notification(type = 1, to_user = this_bit.user, from_user = request.user, bit = this_bit)
        new_notification.save()
        
        # Add the like to interaction history
        interaction_history.liked_bits.add(this_bit)
        
        # Create a new interaction
        new_interaction = Interaction.objects.create(from_user = request.user, to_user = this_bit.user, action_class = 1, action_sub_class = 7, bit = this_bit)
        new_interaction.save()
        
        # Update the like count
        this_bit.like_count += 1
        this_bit.likes.add(request.user)
        result = "added"


    # If the user has disliked the bit, remove the dislike from interaction history
    if this_bit not in interaction_history.interacted_with.all():
        interaction_history.interacted_with.add(this_bit)

    # If the user has already interacted with the bit, update the time
    else:
        this_item = interaction_history.interacted_with.get(id = this_id)
        this_item.time = timezone.now()
        this_item.save()

    # Save the interaction history
    interaction_history.save()
    # Save the bit
    this_bit.save()

    like_count = this_bit.like_count
    dislike_count = this_bit.dislike_count

    return Response({"interaction": result, "dislike_count":dislike_count, "like_count":like_count})

@api_view(["POST"])
def dislikeBit(request):
    from feed.models import InteractionHistory, Interaction
    this_id = request.data.get("bit_id")
    this_bit = Bit.objects.get(id = this_id)

    interaction_history = InteractionHistory.objects.get(user = request.user)
    
    if this_bit in interaction_history.disliked_bits.all():
        interaction_history.disliked_bits.remove(this_bit)
        existing_interaction = Interaction.objects.get(bit = this_bit, from_user=request.user, action_class=1, action_sub_class=8)
        this_bit.dislike_count -= 1
        existing_interaction.delete()
        this_bit.likes.remove(request.user)
        result = "removed"
    else:
        # If the user has already liked the bit, remove the like and delete the interaction
        if this_bit in interaction_history.liked_bits.all():
            interaction_history.liked_bits.remove(this_bit)
            existing_interaction = Interaction.objects.get(bit = this_bit, from_user=request.user, action_class=1, action_sub_class=7)
            existing_interaction.delete()
            this_bit.like_count -= 1
            this_bit.likes.remove(request.user)
        interaction_history.disliked_bits.add(this_bit)
        new_interaction = Interaction.objects.create(from_user = request.user, to_user = this_bit.user, action_class = 1, action_sub_class = 8, bit = this_bit)
        new_interaction.save()
        this_bit.dislike_count += 1
        this_bit.dislikes.add(request.user)
        result = "added"

    if this_bit not in interaction_history.interacted_with.all():
        interaction_history.interacted_with.add(this_bit)
    else:
        this_item = interaction_history.interacted_with.get(id = this_id)
        this_item.time = timezone.now()
        this_item.save()

    interaction_history.save()
    this_bit.save()

    dislike_count = this_bit.dislike_count
    like_count = this_bit.like_count

    return Response({"interaction": result,"dislike_count":dislike_count, "like_count": like_count})
@api_view(["POST"])
def commentBit(request):
    from feed.models import InteractionHistory, Interaction, Comment
    from user_profile.models import Custom
    from feed.api.serializers import CommentSerializer
    from notifications.models import Notification
    this_id = request.data.get("bit_id")
    this_bit = Bit.objects.get(id = this_id)
    print("\n\n\nID:\n\n"+ this_id + "\n\n\n")
    body = request.data.get("comment")
    print(body)
    interaction_history = InteractionHistory.objects.get(user=request.user)
    new_comment = Comment.objects.create(user = request.user, bit=this_bit, body=body)
        
    this_profile = Profile.objects.get(user=request.user)
    custom = Custom.objects.get(profile = this_profile)
    new_comment.custom = custom

    new_comment.save()
    
    new_notification = Notification(type = 2, to_user = this_bit.user, from_user = request.user, comment = new_comment)
    new_notification.save()
    
    if this_bit not in interaction_history.interacted_with.all():
        new_interaction = Interaction.objects.create(bit=this_bit, from_user = request.user, to_user = this_bit.user, action_class=2, action_sub_class=10)
        interaction_history.interacted_with.add(this_bit)
        new_interaction.save()
    else:
        this_item = interaction_history.interacted_with.get(id = this_id)
        this_item.time = timezone.now()
        this_item.save()

    interaction_history.save()

    this_bit.comment_count += 1
    this_bit.save()


    current_timezone = this_profile.current_timezone
    serialized_comment = CommentSerializer(new_comment, many=False, context={"user_tz": current_timezone})

    return Response({"result": "success", "comment_count":this_bit.comment_count, "comment": serialized_comment.data})
def shareBit(request):
    pass