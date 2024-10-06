from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse, HttpResponse
import requests
import jwt
import datetime
from YourbitGold.settings import env
import os
from django.views.decorators.csrf import csrf_exempt
from yb_video.services import get_mux_url
from yb_video.models import Video
import json


# Create your views here.


UPLOAD_DIR = "/media/temp/video_uploads/"



CLOUDFLARE_STREAM_API = f"https://api.cloudflare.com/client/v4/accounts/{env('CLOUDFLARE_STREAM_ACCOUNT_ID')}/stream"

def generate_cloudflare_token(video_id):
    # Create JWT token payload
    payload = {
        "sub": video_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=30),
        "kid": "your_key_id",
        "iss": "your_service_name",
        "jti": "random_generated_id"
    }

    # Generate token using your secret
    token = jwt.encode(payload, "your_secret_key", algorithm="HS256")

    # Secure playback URL with token
    return f"https://watch.cloudflarestream.com/{video_id}?token={token}"


@csrf_exempt
def get_cloudflare_upload_url(request):
    print("Requesting upload URL from Cloudflare Stream API")
    upload_length = request.META.get('HTTP_UPLOAD_LENGTH')
    upload_metadata = request.META.get('HTTP_UPLOAD_METADATA')
    

    print(upload_length)
    print(upload_metadata)
    

    if request.method == 'POST':
        headers = {
            "Authorization": f"Bearer {env('CLOUDFLARE_STREAM_API_KEY')}",
            "Tus-Resumable": "1.0.0",
            "Upload-Length": upload_length,
            "Upload-Metadata": upload_metadata,
        }

        stream_api_url = f"https://api.cloudflare.com/client/v4/accounts/{env('CLOUDFLARE_STREAM_ACCOUNT_ID')}/stream?direct_user=true"

        print(env('CLOUDFLARE_STREAM_API_KEY'))

        
        print("Requesting upload URL from Cloudflare Stream API")
        
        response = requests.post(stream_api_url, headers=headers)
        if response.status_code == 200:
            # Extract the upload URL from Cloudflare's response
            upload_url = response.json().get("result", {}).get("uploadURL")

            # Return the upload URL in the `Location` header for Uppy Tus
            return HttpResponse(status=200, headers={"Location": upload_url})
        
        else:
            # Handle error from Cloudflare API
            return JsonResponse({"error": "Failed to get upload URL"}, status=response.status_code)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)
def video_upload_test(request):
    return render(request, 'video_upload_test_mux.html')

def get_secure_video_url(request, video_id):
    token_url = generate_cloudflare_token(video_id)
    return JsonResponse({"secure_url": token_url})


def upload_video_to_cloudflare(request):
    if request.method == 'POST':
        video_file = request.FILES.get('video')
        
        # Send the video file to Cloudflare Stream API
        headers = {
            "Authorization": f"Bearer {settings.CLOUDFLARE_API_KEY}",
            "Content-Type": "application/json"
        }

        try:
            # Send the video file directly to Cloudflare
            response = requests.post(
                CLOUDFLARE_STREAM_API,
                headers=headers,
                files={'file': video_file}
            )

            # Check if the upload was successful
            if response.status_code == 200:
                video_data = response.json()
                return JsonResponse({"status": "success", "data": video_data})
            else:
                return JsonResponse({"status": "error", "message": response.json()}, status=400)

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def upload_chunk(request):
    if request.method == "POST":
        chunk = request.FILES.get("file")
        chunk_index = int(request.POST.get("chunkIndex"))
        total_chunks = int(request.POST.get("totalChunks"))
        file_name = request.POST.get("fileName") + str(chunk_index)

        # Create a directory for the file chunks if it doesn't exist
        upload_path = os.path.join(UPLOAD_DIR, file_name)
        if not os.path.exists(upload_path):
            os.makedirs(upload_path)

        # Save the chunk to the temp directory
        chunk_file = os.path.join(upload_path, f"chunk_{chunk_index}")
        with open(chunk_file, "wb") as f:
            for chunk_part in chunk.chunks():
                f.write(chunk_part)

        # Track uploaded chunks (you could use a database model for this)
        received_chunks = len([f for f in os.listdir(upload_path) if f.startswith("chunk_")])
        
        # Check if all chunks are uploaded
        if received_chunks == total_chunks:
            # Combine chunks into the final file
            final_file_path = os.path.join(UPLOAD_DIR, file_name)
            with open(final_file_path, "wb") as final_file:
                for i in range(total_chunks):
                    chunk_file = os.path.join(upload_path, f"chunk_{i}")
                    with open(chunk_file, "rb") as cf:
                        final_file.write(cf.read())

            # After combining, send the video to Cloudflare (next step)
            return JsonResponse({"status": "complete", "file": final_file_path})

        return JsonResponse({"status": "partial", "message": f"Received chunk {chunk_index} of {total_chunks}"})

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def mux_upload_endpoint(request):
    # Get the direct upload URL from Mux
    if request.user.is_authenticated:
        from yb_photo.models import VideoThumbnail
        upload_url = get_mux_url(request)

        new_video = Video.objects.create(
            user=request.user,
            upload_status="preparing",
            storage_type="mx",
            upload_id=upload_url.data.id,
        )

        new_thumbnail = VideoThumbnail.objects.create(
            storage_type="mx",
            profile=request.user.profile,
        )

        new_thumbnail.save()

        new_video.thumbnail = new_thumbnail

        print(f"New video created with upload ID: {new_video.upload_id}")

        new_video.save()

        # Return the upload URL to the client
        return JsonResponse({"upload_url": upload_url.data.url, "upload_id":new_video.upload_id})
    
    return JsonResponse({"error": "User is not authenticated"}, status=401)

def update_video_status(request, video_id):
    # Update the video status in the database
    video = Video.objects.get(id=video_id)
    video.upload_status = request.POST.get("status")
    video.save()
    
    return JsonResponse({"status": "success", "message": "Video status updated"})

@csrf_exempt
def ready_upload(request):
    print("Webhook request received...")

    jsondata = request.body
    data = json.loads(jsondata)
    print(data)
    # Get the video ID from the request
    if data["type"] == "video.asset.ready":

        print("Upload is ready for playback")
        playback_id = data["data"]["playback_ids"][0]["id"]
        video_url = f"https://stream.mux.com/{playback_id}.m3u8"

        thumbnail_url = f"https://image.mux.com/{playback_id}/thumbnail.png?width=960&height=540&time=1"

        print(f"Playback ID: {playback_id}")
        print(f"Video URL: {video_url}")

        # Update the video status to 'ready' in the database
        video = Video.objects.get(upload_id=data["data"]["upload_id"])
        video.upload_status = "ready"
        video.ext_id = playback_id
        video.ext_url = video_url
        video.save()

        # Update the thumbnail URL in the database
        thumbnail = video.thumbnail
        thumbnail.ext_url = thumbnail_url
        thumbnail.save()
        
        return HttpResponse('success')
    
    return JsonResponse({"error": "Invalid request type"}, status=400)


def video_setup_template(request):
    return render(request, 'video_setup.html')