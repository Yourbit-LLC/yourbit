from django.shortcuts import render
from django.views import View
from .forms import BitForm
from django.http import JsonResponse, HttpResponse
from .models import *


# Create your views here.
def bit_builder_view(request):
    bit_form = BitForm()
    print("bit_builder_view")
    return render(request, "yb_bits/yb_bitBuilder.html", {"bit_form":bit_form, "build_mode":"create"})

def edit_bit_view(request, pk):
    this_bit = Bit.objects.get(pk=pk)
    bit_form = BitForm(instance=this_bit)
    return render(request, "yb_bits/yb_bitBuilder.html", {"bit_form":bit_form, "build_mode":"edit"})

def bitstream_view(request):
    return render(request, "yb_bits/yb_bitStream.html")

def set_user_bitstreams(request, *args, **kwargs):
    for user in User.objects.all():
        fails = 0
        try:
            user_profile = Profile.objects.get(user=user)
            bitstream = BitStream.objects.get(profile=user_profile)
        except:
            bitstream = BitStream(profile=user_profile)
            fails += 1
            bitstream.save()

    return HttpResponse("Bitstreams set for all users: " + str(fails) + " fails")

# class PublishMediaBit(View):
    
#     def post(request, *args, **kwargs):
#         from yb_photo.models import Photo
#         from yb_photo.utility import generate_large_thumbnail, generate_medium_thumbnail, generate_small_thumbnail, generate_tiny_thumbnail
    
#         if type == 'photo':

#             #Get file from request
#             source_file = request.FILES.get('photo')

#             #Create photo instance
#             new_photo = Photo()

#             #Set new photo file to object
#             new_photo.image = source_file

#             #512x512
#             new_photo.large_thumbnail = generate_large_thumbnail(request, source_file)
            
#             #256x256
#             new_photo.medium_thumbnail = generate_medium_thumbnail(request, source_file)
            
#             #128x128
#             new_photo.small_thumbnail = generate_small_thumbnail(request, source_file)

#             #Assign photo object to user
#             new_photo.user = request.user

#             #Save photo object
#             new_photo.save()
            

#             if body != 'yb-no-body':
#                 new_bit.body = body
            
#         else:

#             video = request.FILES.get('video')

#             # Generate a unique file name using uuid or any other logic
#             unique_filename = str(uuid.uuid4()) + os.path.splitext(video.name)[1]

#             video_object.video.save(unique_filename, video)

#             video_object = Video.objects.create(
#                 user=request.user, 
#                 video = video, 
#                 video_key = unique_filename
#             )

#             if request.FILES.get('thumbnail_image'):
#                 thumbnail_image = request.FILES.get('thumbnail_image')
#                 print(thumbnail_image)
#                 video_object.thumbnail_image = thumbnail_image

#             # else:
#             #     video_object.thumbnail_image = generate_video_thumbnail(video)

#             video_object.save()

#             new_bit.video.add(video_object)
         

class CreateCluster(View):

    def get(self, request):
        return render(request, "yb_bits/create_cluster.html")

    def post(self, request, *args, **kwargs):
        from yb_bits.models import Cluster
        from yb_bits.api.serializers import ClusterSerializer
        from django.http import JsonResponse
    
        cluster_name = request.POST.get("name")
        cluster_type = request.POST.get("type")

        new_cluster = Cluster(profile = request.user.profile, name = cluster_name, type=cluster_type)
        new_cluster.save()

        serialized_cluster = ClusterSerializer(new_cluster, many=False)

        return JsonResponse({"status": "success", "cluster": serialized_cluster.data})
    
def bit_focus_view(request, pk, *args, **kwargs):
    this_bit = Bit.objects.get(pk=pk)
    return render(request, "yb_bits/yb_bit_focus.html", {"bit":this_bit})


def comment_history_view(request, *args, **kwargs):
    profile = Profile.objects.get(user=request.user)
    interaction_history = InteractionHistory.objects.get(profile=profile)
    interactions = interaction_history.commented_on.all()
    context = {
        'interactions':interactions
    }
    return render(request, "yb_bits/yb_comment_list.html", context)

def watch_history_view(request, *args, **kwargs):
    profile = Profile.objects.get(user=request.user)
    interaction_history = InteractionHistory.objects.get(profile=profile)
    interactions = interaction_history.watched.all()
    context = {
        'interactions':interactions
    }
    return render(request, "yb_bits/yb_watch_list.html", context)


def sort_panel_view(request, *args, **kwargs):
    return render(request, "yb_bits/yb_sort_panel.html")

def filter_panel_view(request, *args, **kwargs):
    return render(request, "yb_bits/yb_filter_panel.html")

def customize_panel_view(request, *args, **kwargs):
    return render(request, "yb_bits/yb_customize_panel.html")

def list_clusters(request, *args, **kwargs):
    profile = Profile.objects.get(user=request.user)
    clusters = Cluster.objects.filter(profile=profile)
    if not clusters:
        is_clusters = False
    else :
        is_clusters = True

    context = {
        'is_clusters':is_clusters,
        'clusters':clusters,
        'page_action':"viewing",
    }
    return render(request, "yb_bits/yb_cluster_list.html", context)

def select_clusters(request, bit_id, *args, **kwargs):
    profile = Profile.objects.get(user=request.user)
    
    this_bit = Bit.objects.get(pk=bit_id)

    clusters = Cluster.objects.filter(profile=profile, type__in=[this_bit.type, "any"])

    if not clusters:
        is_clusters = False
    else :
        is_clusters = True

    context = {
        'is_clusters':is_clusters,
        'clusters':clusters,
        'bit_id':bit_id,
        'page_action':"selecting",
    }
    return render(request, "yb_bits/cluster_select.html", context)


def cluster_view(request, id, *args, **kwargs):
    this_cluster = Cluster.objects.get(pk=id)
    bits = this_cluster.bits.all()
    
    if not bits:
        is_bits = False
    else:
        is_bits = True

    return render(request, "yb_bits/yb_cluster_view.html", {"cluster":this_cluster, "is_bits":is_bits, "click_handler":"yb_viewBit(", "bits":bits})

def bit_options_menu(request, id, *args, **kwargs):
    this_bit = Bit.objects.get(pk=id)
    option_set = [] 

    add_to_cluster_button = {
        "label":"Add to Cluster",
        "name": "add",
        "type": "bit-option",
        "object_id": this_bit.id,
        "action":f"yb_listClusters({this_bit.id})",
    }
    option_set.append(add_to_cluster_button)

    hide_bit_button = {
        "label":"Hide Bit",
        "name": "hide",
        "type": "bit-option",
        "object_id": this_bit.id,
        "action":f"yb_hideBit({this_bit.id})",
    }
    option_set.append(hide_bit_button)

    if this_bit.profile.user == request.user:
        #edit bit, add to cluster, hide bit, delete bit
            edit_bit_button = {
                "label":"Edit Bit",
                "name": "edit",
                "type": "bit-option",
                "object_id": this_bit.id,
                "action":f"yb_navigateTo('2way', 'edit-bit', {this_bit.id})",
            }

            delete_bit_button = {
                "label":"Delete Bit",
                "name": "delete",
                "type": "bit-option",
                "object_id": this_bit.id,
                "action":f"yb_deleteBit({this_bit.id})",
            }

            option_set.append(edit_bit_button)
            option_set.append(delete_bit_button)
            
    else:

        #report bit, hide bit
        report_bit_button = {
            "label":"Report Bit",
            "name": "report",
            "type": "bit-option",
            "object_id": this_bit.id,
            "action":f"yb_reportBit({this_bit.id})",
        }
        option_set.append(report_bit_button)

    context = {
        "menu_name": "Bit Options",
        "option_set":option_set,
    }
        
    return render(request, "main/options_menu.html", context)

def delete_cluster(request, *args, **kwargs):
    if request.method != "POST":
        return JsonResponse({"status":"failed"})
    
    else:
        this_id = request.POST.get("id")
        cluster = Cluster.objects.get(pk=this_id)
        cluster.delete()
        return JsonResponse({"status":"success"})
    
def add_to_cluster(request, *args, **kwargs):
    if request.method != "POST":
        return JsonResponse({"status":"failed"})
    
    else:
        cluster_id = request.POST.get("cluster_id")
        bit_id = request.POST.get("bit_id")

        print("bit_id", bit_id)
        
        this_cluster = Cluster.objects.get(pk=cluster_id)
        this_bit = Bit.objects.get(pk=bit_id)
        this_cluster.bits.add(this_bit)
        this_cluster.save()

        return JsonResponse({"status":"success", "cluster_name":this_cluster.name})
    
def remove_from_cluster(request, *args, **kwargs):
    if request.method != "POST":
        return JsonResponse({"status":"failed"})
    
    else:
        cluster_id = request.POST.get("cluster_id")
        bit_id = request.POST.get("bit_id")
        
        this_cluster = Cluster.objects.get(pk=cluster_id)
        this_bit = Bit.objects.get(pk=bit_id)
        this_cluster.bits.remove(this_bit)
        this_cluster.save()

        return JsonResponse({"status":"success", "cluster_name":this_cluster.name})