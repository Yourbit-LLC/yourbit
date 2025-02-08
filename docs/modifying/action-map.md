## Action Map

The action map keeps track of all of the API actions across 
different services in yourbit. Yourbit contains several built 
in services that can be modified. In order for these services 
to function, yourbit needs to know the proper request URL's to 
understand how to interact with your API. The action map lets you 
map request urls from Yourbits media retrieval functions to 
alternative API's for media handling, as well as configure API 
actions for community created features.

> **Warning:** The action map is not a place for storing keys 
use variables in the URL schema when keys are required to be in the url. Modify keys 
using the environment variables in `.env`.

# Example Use
The following code snippet is an example taken from the `yb_extensions/action_map.py`. A video service is required
so this is prefilled with Yourbits default values.

In the following example, `playback_id` refers to the playback ID of a video asset typically returned in a webhook
from the video service on completion of an upload. 

```python
video_service = {
    
    # URL Schema for retrieving a video for playback
    "playback_url": "https://player.mux.com/{playback_id}", 

    # If available, a URL schema for retrieving previews, if not Yourbit will fall back to image service
    "preview_url": "https://image.mux.com/{playback_id}/thumbnail.png?width=214&height=121&time=1",

    # Video upload URL schema, this must be for a direct upload endpoint
    "upload_url": "https://api.mux.com/video/v1/uploads",

    # URL to cancel an upload in progress, the endpoint should expect a PUT request
    "cancel_upload_url": "https://api.mux.com/video/v1/uploads/{UPLOAD_ID}/cancel",

    # URL schema for video thumbnails
    "thumbnail_url": "https://image.mux.com/{playback_id}/thumbnail.png?width=214&height=121&time=1",
    
    # URL to modify an existing upload (if needed), the endpoint should expect a PATCH request
    "modify_url": "https://api.mux.com/video/v1/assets/{ASSET_ID}",

    # URL schema to delete an uploaded asset, the endpoint should expect a DELETE request
    "delete_url": "https://api.mux.com/video/v1/assets/{ASSET_ID}",
    
    # Webhook status is used to query the json sent with a webhook for the upload status
    # This should be the exact path to the status indicating "ready" on upload complete.
    "webhook_status": "status",

}

```

