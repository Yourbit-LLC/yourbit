from .models import Video
from yb_profile.models import Profile

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