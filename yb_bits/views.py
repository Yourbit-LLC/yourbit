from django.shortcuts import render
from django.views import View
from .forms import BitForm
from django.http import JsonResponse, HttpResponse
from .models import *


# Create your views here.
def bit_builder_view(request):
    bit_form = BitForm()
    return render(request, "yb_bits/yb_bitBuilder.html", {"bit_form":bit_form})

def bitstream_view(request):
    return render(request, "yb_bits/yb_bitStream.html")

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

        return JsonResponse({"cluster": serialized_cluster.data})
    
def bit_focus_view(request, pk, *args, **kwargs):
    this_bit = Bit.objects.get(pk=pk)
    return render(request, "yb_bits/yb_bit_focus.html", {"bit":this_bit})
