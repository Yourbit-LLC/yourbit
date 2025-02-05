from .models import Video
from yb_profile.models import Profile
from mux_python import Configuration, VideoApi
import jwt
import datetime
from django.conf import settings

# Initialize Mux API
config = Configuration()
config.access_token_id = settings.MUX_TOKEN_ID
config.secret_key = settings.MUX_TOKEN_SECRET

video_api = VideoApi(configuration=config)

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
