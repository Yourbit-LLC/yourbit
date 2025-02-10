import mux_python
from mux_python import Configuration
from mux_python.rest import ApiException
from django.db import models
from django.utils import timezone
from django.conf import settings
from yb_accounts.models import Account as User
from yb_profile.models import Profile
from yb_video.models import Video
import requests
from requests.auth import HTTPBasicAuth
from yb_extensions.action_map import video_service
import jwt
import datetime

"""
    The services.py file is used to define the functions 
    that will be used to interact with video service API's
    installed to Yourbit. Modify this file to adapt to your
    service API when needed.

"""

configuration = mux_python.Configuration()
video_token_id = settings.VIDEO_CDN_TOKEN
video_token_secret = settings.VIDEO_CDN_SECRET


def generate_signed_url(asset_id, expiration=3600):
    """
    Generate a signed playback URL for a Mux video asset.

    Args:
        asset_id (str): The Mux asset ID.
        expiration (int): Expiration time in seconds for the signed URL.

    Returns:
        str: A signed URL for the asset.
    """
    try:
        # Playback URL base
        base_url = f"https://stream.mux.com/{asset_id}.m3u8"

        # Signing key
        signing_key_id = settings.MUX_SIGNING_KEY
        signing_secret = settings.MUX_PRIVATE_KEY

        # Create the token
        payload = {
            "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=expiration),
        }
        token = jwt.encode(payload, signing_secret, algorithm="HS256", headers={"kid": signing_key_id})

        # Generate signed URL
        signed_url = f"{base_url}?token={token}"
        return signed_url
    except Exception as e:
        raise ValueError(f"Failed to generate signed URL: {e}")


def get_video_by_id(video_id):
    return Video.objects.get(id=video_id)

def get_video_by_profile(profile):
    return Video.objects.filter(profile=profile)

def get_video_by_profile_id(profile_id):
    profile = Profile.objects.get(id=profile_id)
    return Video.objects.filter(profile=profile)

def save_video(request, video):
    
    new_video = Video(user=request.user, video=video)
    new_video.save()
    
    return new_video

def get_direct_upload_url():
    """
        The function get_upload_url is used to request a direct upload URL
        from a provided video service using the URL defined in the action map.
    """
    url = video_service["upload_url"]
    headers = {"Content-Type": "application/json"}
    data = {
        "new_asset_settings": {
            "playback_policy": ["public"],
            "video_quality": "basic"
        },
        "cors_origin": "*"
    }

    try:
        response = requests.post(url, json=data, headers=headers, auth=HTTPBasicAuth(video_token_id, video_token_secret))
        response.raise_for_status()  # Raise an error for non-200 responses
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error creating Mux upload URL: {e}")
        return None

def get_video_web_token(video_id):
    import jwt
    import base64
    import time

    my_id = video_id              # Enter the id for which you would like to get counts here
    my_id_type = "playback_id"         # Enter the type of ID provided in my_id; one of video_id | asset_id | playback_id | live_stream_id
    signing_key_id = settings.MUX_SIGNING_KEY # Enter your signing key id here
    private_key_base64 = settings.MUX_PRIVATE_KEY # Enter your base64 encoded private key here

    private_key = base64.b64decode(private_key_base64)

    payload = {
        'sub': my_id,
        'aud': my_id_type,
        'exp': int(time.time()) + 3600, # 1 hour
    }
    headers = {
        'kid': signing_key_id
    }

    encoded = jwt.encode(payload, private_key, algorithm="RS256", headers=headers)
    
    print(encoded)
    
    return encoded


def send_video_to_cdn(request):

    if request.user.is_authenticated:
        from yb_photo.models import VideoThumbnail

        # Get direct upload URL from service provider
        upload_url = get_direct_upload_url(request)

        # Get profile object by users active profile
        user_profile = Profile.objects.get(username=request.user.active_profile)
        
        # Create a new video object with the upload URL
        new_video = Video.objects.create(
            user=request.user,
            upload_status="preparing",
            storage_type="mx",
            upload_id=upload_url.data.id,
        )

        # Create a new thumbnail object for the video
        new_thumbnail = VideoThumbnail.objects.create(
            storage_type="mx",
            profile=user_profile,
            upload_id = upload_url.data.id
        )

        # Save the new thumbnail object
        new_thumbnail.save()

        # Set the newly generated thumbnail as the video thumbnail
        new_video.thumbnail = new_thumbnail

        print(f"New video created with upload ID: {new_video.upload_id}")

        # Save the new video object
        new_video.save()

        # Return the upload URL to the client
        return {"url" : upload_url.data.url, "new_video": new_video}

def generate_video_thumbnails(choose = False, time = 0):
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

# Legacy Code

# def get_mux_url(request):

    # """
    #     The function get_mux_url is used to request a direct upload URL using the
    #     Mux-Python SDK. This function is used to request a direct upload URL from
    #     Mux and is used to upload videos to the Mux CDN.
        
    # """
#     api_instance = mux_python.DirectUploadsApi(mux_python.ApiClient(configuration))
   
#     create_asset_request = mux_python.CreateAssetRequest(playback_policy=[mux_python.PlaybackPolicy.PUBLIC], video_quality="basic")
#     create_upload_request = mux_python.CreateUploadRequest(timeout=3600, new_asset_settings=create_asset_request, cors_origin="*")
#     create_upload_response = api_instance.create_direct_upload(create_upload_request)
#     try:
#         api_response = create_upload_response
#         print(api_response)
#         return api_response
#     except ApiException as e:
#         print("Exception when calling VideoUrlApi->create_video_url: %s\n" % e)



# def get_mux_data(video_id):
#     """
#         The function get_mux_data is used to request data about a video asset
#         from the Mux API using the Mux-Python SDK. This function is used to 
#         request data about a video asset from Mux and is used to retrieve 
#         information about a video asset from the Mux CDN.
        
#     """
#     api_instance = mux_python.AssetsApi(mux_python.ApiClient(configuration))
#     try:
#         api_response = api_instance.get_asset(video_id)
#         print(api_response)
#         return api_response
#     except ApiException as e:
#         print("Exception when calling VideoApi->get_video: %s\n" % e)
