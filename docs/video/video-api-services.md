# 📡 **Yourbit Video Service API Documentation**
This document explains how Yourbit integrates with external video services to handle uploads, generate playback links, and manage video metadata. The video service interacts with your `video_service` integration to process video content.

## **Overview**
The `services.py` module contains helper functions for:
- Requesting direct upload URLs.
- Handling chunked video uploads.
- Generating secure playback URLs.
- Storing metadata such as asset IDs and thumbnails.
- Managing authentication via API keys.

---

## **Authentication and API Keys**
Yourbit securely interacts with **Mux** using API keys, which are **configured via environment variables** in Django settings.

| Environment Variable | Purpose |
|----------------------|---------|
| `VIDEO_WEBHOOK_SECRET` | Secret key for webhook validation |
| `VIDEO_SIGNING_KEY` | Key for signing secure URLs |
| `VIDEO_PRIVATE_KEY` | Private key for signing requests |
| `VIDEO_CDN_TOKEN` | API token for the video service |
| `VIDEO_CDN_SECRET` | Secret key for the video service |

Example:
```python
video_token_id = settings.VIDEO_CDN_TOKEN
video_token_secret = settings.VIDEO_CDN_SECRET
```

## **Direct Upload Requests**
Yourbit supports direct uploads via **Mux**.

### **Requesting an Upload URL**
- Yourbit requests a direct upload URL from Mux.
- The upload URL is sent back to the client, which then starts a chunked upload.

Example:
```python
def get_direct_upload_url():
    """
    Request a direct upload URL from the video service using the action map.
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
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error creating Mux upload URL: {e}")
        return None
```

---

## **Handling Webhook Notifications**
Once the upload is completed, Mux sends a webhook to Yourbit to confirm that the video is **ready** for playback.

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
    """
    Generate a signed playback URL for a Mux video asset.
    """
    try:
        base_url = video_service.get("playback_url")
        signing_key_id = settings.VIDEO_SIGNING_KEY
        signing_secret = settings.VIDEO_PRIVATE_KEY

        payload = {
            "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=expiration),
        }
        token = jwt.encode(payload, signing_secret, algorithm="HS256", headers={"kid": signing_key_id})

        return f"{base_url}?token={token}"
    except Exception as e:
        raise ValueError(f"Failed to generate signed URL: {e}")
```

---

## **The Role of the Action Map**
The **action map** (`yb_extensions.action_map`) defines service-specific API endpoints dynamically. This allows Yourbit to switch between different video providers without modifying core logic.

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
- `storage_type` (local, Mux)
- `upload_id` (used to track upload progress)
- `ext_url` (playback URL)
- `ext_id` (external asset ID)

---

## **Thumbnail Generation**
Thumbnails are generated automatically based on the video.

**Mux Thumbnails:**
```python
def generate_video_thumbnails(choose=False, time=0):
    selected_time = f"&time={time}" if choose else ""
    return {
        "medium_thumbnail": f"https://image.mux.com/{playback_id}/thumbnail.png?width=214{selected_time}",
    }
```

---

## **Legacy Code**
The following legacy functions were previously used for direct Mux API requests but are no longer active:

<details>
<summary>Click to expand</summary>

### **Legacy: Mux Direct Upload URL Request**
```python
def get_mux_url(request):
    """
    Request a direct upload URL using the Mux-Python SDK.
    """
    api_instance = mux_python.DirectUploadsApi(mux_python.ApiClient(configuration))
    create_asset_request = mux_python.CreateAssetRequest(playback_policy=[mux_python.PlaybackPolicy.PUBLIC], video_quality="basic")
    create_upload_request = mux_python.CreateUploadRequest(timeout=3600, new_asset_settings=create_asset_request, cors_origin="*")
    create_upload_response = api_instance.create_direct_upload(create_upload_request)
    return create_upload_response
```

### **Legacy: Fetching Video Metadata from Mux**
```python
def get_mux_data(video_id):
    """
    Request data about a video asset from the Mux API.
    """
    api_instance = mux_python.AssetsApi(mux_python.ApiClient(configuration))
    try:
        api_response = api_instance.get_asset(video_id)
        return api_response
    except ApiException as e:
        print("Exception when calling VideoApi->get_video: %s\n" % e)
```

</details>

---

## **Conclusion**
Yourbit’s video service efficiently handles video uploads, processing, and playback through Mux. The **action map** allows dynamic configuration, and **secure authentication** ensures protected video access.

This modular approach allows Yourbit to support **multiple providers** with minimal code changes. 🚀
