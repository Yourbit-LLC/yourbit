# 📡 **Yourbit Video Service API Documentation**
This document explains how Yourbit integrates with external video services to handle uploads, generate playback links, and manage video metadata. The video service interacts with **Mux** and **Cloudflare Stream** to process video content.

## **Overview**
The `services.py` module contains helper functions for:
- Requesting direct upload URLs.
- Handling chunked video uploads.
- Generating secure playback URLs.
- Storing metadata such as asset IDs and thumbnails.
- Managing authentication via API keys.

---

## **Authentication and API Keys**
Yourbit securely interacts with **Mux** and **Cloudflare Stream** using API keys, which are configured using **environment variables** in Django settings.

| Environment Variable | Purpose | Provider |
|----------------------|---------|------------|
| `MUX_TOKEN_ID` | Authentication for API requests | Mux |
| `MUX_TOKEN_SECRET` | Secret key for API requests | Mux |
| `MUX_SIGNING_KEY` | Key for signing secure URLs | Mux |
| `MUX_PRIVATE_KEY` | Private key for signing requests | Mux |
| `VIDEO_CDN_TOKEN` | API token for video service authentication | Cloudflare |
| `VIDEO_CDN_SECRET` | Secret key for the video service | Cloudflare |
| `CLOUDFLARE_STREAM_API_KEY` | API key for Cloudflare Stream | Cloudflare |

These keys are **never hardcoded** and are instead loaded dynamically from environment variables.

Example:
```python
video_token_id = settings.VIDEO_CDN_TOKEN
video_token_secret = settings.VIDEO_CDN_SECRET
```

Mux API configuration:
```python
config = Configuration()
config.access_token_id = settings.MUX_TOKEN_ID
config.secret_key = settings.MUX_TOKEN_SECRET
video_api = VideoApi(configuration=config)
```

Cloudflare authentication for TUS upload requests:
```python
headers = {
    "Authorization": f"Bearer {settings.CLOUDFLARE_STREAM_API_KEY}",
    "Tus-Resumable": "1.0.0",
}
```

---

## **Direct Upload Requests**
Yourbit supports direct uploads via **Mux** and **Cloudflare Stream**.

### **Requesting an Upload URL**
- Yourbit requests a direct upload URL from the selected video service.
- The upload URL is sent back to the client, which then starts a chunked upload.

Example (Mux):
```python
def get_mux_url():
    api_instance = mux_python.DirectUploadsApi(mux_python.ApiClient(configuration))
    create_asset_request = mux_python.CreateAssetRequest(playback_policy=[mux_python.PlaybackPolicy.PUBLIC], video_quality="basic")
    create_upload_request = mux_python.CreateUploadRequest(timeout=3600, new_asset_settings=create_asset_request, cors_origin="*")
    create_upload_response = api_instance.create_direct_upload(create_upload_request)
    return create_upload_response
```

Example (Cloudflare):
```python
def get_cloudflare_upload_url(request):
    headers = {
        "Authorization": f"Bearer {settings.CLOUDFLARE_STREAM_API_KEY}",
        "Tus-Resumable": "1.0.0",
    }
    response = requests.post(CLOUDFLARE_STREAM_API, headers=headers)
    return response.json()
```

---

## **Handling Webhook Notifications**
Once the upload is completed, the external service sends a webhook to Yourbit to confirm that the video is **ready** for playback.

Webhook handling function:
```python
@csrf_exempt
def ready_upload(request):
    jsondata = request.body
    data = json.loads(jsondata)

    if data[video_service["webhook_status"]] == "ready":
        playback_id = data["data"]["playback_ids"][0]["id"]
        video_url = safe_fstring(video_service["playback_url"], {"playback_id": playback_id})

        video = Video.objects.get(upload_id=data["data"]["upload_id"])
        video.upload_status = "ready"
        video.ext_id = playback_id
        video.ext_url = video_url
        video.save()
        
        return HttpResponse('success')

    return JsonResponse({"error": "Invalid request"}, status=400)
```
Once the webhook is processed:
- The video status changes from `preparing` to `ready`.
- The `playback_url` is generated and stored in the database.

---

## **Generating Secure Playback URLs**
Yourbit ensures secure video playback by signing URLs using JWT (JSON Web Token).

### **Mux Signed URL Generation**
```python
def generate_signed_url(asset_id, expiration=3600):
    base_url = f"https://stream.mux.com/{asset_id}.m3u8"

    signing_key_id = settings.MUX_SIGNING_KEY
    signing_secret = settings.MUX_PRIVATE_KEY

    payload = {
        "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=expiration),
    }
    token = jwt.encode(payload, signing_secret, algorithm="HS256", headers={"kid": signing_key_id})

    return f"{base_url}?token={token}"
```

### **Cloudflare Signed URL**
```python
def generate_cloudflare_token(video_id):
    payload = {
        "sub": video_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=30),
        "kid": "your_key_id",
        "iss": "your_service_name",
    }

    token = jwt.encode(payload, "your_secret_key", algorithm="HS256")
    return f"https://watch.cloudflarestream.com/{video_id}?token={token}"
```

These signed URLs ensure that unauthorized users cannot access the video directly.

---

## **The Role of the Action Map**
The **action map** (`yb_extensions.action_map`) is used to define service-specific API endpoints dynamically. This allows Yourbit to switch between different video providers without modifying core logic.

### **Example Action Map Entries**
```python
video_service = {
    "upload_url": "https://api.mux.com/video/v1/uploads",
    "webhook_status": "data.status",
    "playback_url": "https://stream.mux.com/{playback_id}.m3u8",
    "thumbnail_url": "https://image.mux.com/{playback_id}/thumbnail.png",
}
```
If a provider is changed, only the **action map** needs updating.

---

## **Saving Video Data to the Database**
Once a video is uploaded, metadata is stored in the `Video` model.

```python
def save_video(request, video):
    new_video = Video(user=request.user, video=video)
    new_video.save()
    return new_video
```
Video metadata includes:
- `storage_type` (local, Mux, Cloudflare)
- `upload_id` (used to track upload progress)
- `ext_url` (playback URL)
- `ext_id` (external asset ID)

---

## **Thumbnail Generation**
Thumbnails are generated automatically based on the video.

**Mux Thumbnails:**
```python
def generate_mux_thumbnails(choose=False, time=0):
    selected_time = f"&time={time}" if choose else ""
    return {
        "medium_thumbnail": f"https://image.mux.com/{playback_id}/thumbnail.png?width=214{selected_time}",
    }
```
Cloudflare Stream provides a thumbnail URL in the webhook response.

---

## **Conclusion**
Yourbit’s video service efficiently handles video uploads, processing, and playback through Mux and Cloudflare Stream. The **action map** allows dynamic configuration, and **secure authentication** ensures protected video access.

This modular approach allows Yourbit to support **multiple providers** with minimal code changes. 🚀
