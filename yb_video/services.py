import mux_python
from mux_python.rest import ApiException
from django.db import models
from django.utils import timezone
from django.conf import settings
from yb_accounts.models import Account as User
from yb_profile.models import Profile
from yb_video.models import Video

configuration = mux_python.Configuration()
configuration.username = settings.MUX_TOKEN_ID
configuration.password = settings.MUX_TOKEN_SECRET

def get_mux_url(request):
    api_instance = mux_python.DirectUploadsApi(mux_python.ApiClient(configuration))
   
    create_asset_request = mux_python.CreateAssetRequest(playback_policy=[mux_python.PlaybackPolicy.PUBLIC], video_quality="basic")
    create_upload_request = mux_python.CreateUploadRequest(timeout=3600, new_asset_settings=create_asset_request, cors_origin="*")
    create_upload_response = api_instance.create_direct_upload(create_upload_request)
    try:
        api_response = create_upload_response
        print(api_response)
        return api_response
    except ApiException as e:
        print("Exception when calling VideoUrlApi->create_video_url: %s\n" % e)


def send_video_to_mux(request):
    # Get the direct upload URL from Mux
    if request.user.is_authenticated:
        from yb_photo.models import VideoThumbnail
        upload_url = get_mux_url(request)
        user_profile = Profile.objects.get(username=request.user.active_profile)
        new_video = Video.objects.create(
            user=request.user,
            upload_status="preparing",
            storage_type="mx",
            upload_id=upload_url.data.id,
        )

        new_thumbnail = VideoThumbnail.objects.create(
            storage_type="mx",
            profile=user_profile,
            upload_id = upload_url.data.id
        )

        new_thumbnail.save()

        new_video.thumbnail = new_thumbnail

        print(f"New video created with upload ID: {new_video.upload_id}")

        new_video.save()

        # Return the upload URL to the client
        return {"url" : upload_url.data.url, "new_video": new_video}

def generate_mux_thumbnails(choose = False, time = 0):
    selected_time = ""
    
    if choose == True:
        selected_time = f"&time={time}"

    return {
        "tiny_thumbnail": f"https://image.mux.com/AHImOcQOggaGqe2FxQ6qGZhizlBzJmY5nJNLvyWCvqA/thumbnail.png?width=214&height=121{selected_time}",
        "small_thumbnail": f"https://image.mux.com/AHImOcQOggaGqe2FxQ6qGZhizlBzJmY5nJNLvyWCvqA/thumbnail.png?width=214&height=121{selected_time}",
        "medium_thumbnail": f"https://image.mux.com/AHImOcQOggaGqe2FxQ6qGZhizlBzJmY5nJNLvyWCvqA/thumbnail.png?width=214&height=121{selected_time}",
        "large_thumbnail": f"https://image.mux.com/AHImOcQOggaGqe2FxQ6qGZhizlBzJmY5nJNLvyWCvqA/thumbnail.png?width=214&height=121{selected_time}",
        "xlarge_thumbnail": f"https://image.mux.com/AHImOcQOggaGqe2FxQ6qGZhizlBzJmY5nJNLvyWCvqA/thumbnail.png?width=214&height=121{selected_time}"
    }

    