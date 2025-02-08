#   **Action Map Introduction**

#   For more information on the action map, go to "docs/modifying/action_map.md"

# Video Services
# 
# Services like Mux or Cloudflare Stream
# 
# The most basic requirements for third party video services include a 
# view url, preview url, upload url, and modify url.

# If needed, the video service handlers can be modified in: 
# "yb_video/utility.py"
#
# Modifying the above file will allow you to change the required parameters
# for communicating with your specific video API, improper setup may result in
# client side errors.

video_service = {
    
    # URL Schema for retrieving a video for playback
    "playback_url": "https://player.mux.com/{playback_id}", 

    # If available, a URL schema for retrieving previews, if not Yourbit will fall back to image service
    "preview_url": "https://image.mux.com/{playback_id}/thumbnail.png?width=214&height=121&time=1",

    # Video upload URL schema, this must be for a direct upload endpoint
    "upload_url": "https://api.mux.com/video/v1/uploads",

    # URL schema for video thumbnails
    "thumbnail_url": "https://image.mux.com/{playback_id}/thumbnail.png?width=214&height=121&time=1",
    
    # URL to modify an existing upload
    "modify_url": "",

    # URL schema to delete an uploaded asset
    "delete_url": "",
    
    # Webhook status is used to query the json sent with a webhook for the upload status
    # This should be the exact path to the status indicating "ready" on upload complete.
    "webhook_status": "status",

}


# Image Services
# 
# Services like Cloudflare Images
# 
# The image service must provide image thumbnail variants consistent with 
# yourbits expected thumbnail variants. You may choose any size for thumnail 
# variants, however, higher resolutions may impact performance. For guidelines 
# on how Yourbit sizes thumnails, check out the documentation on Image Services.

image_service = {
    
    # URL Schema for fetching full sized images
    "retrieve": "https://imagedelivery.net/{IMAGE_ACCOUNT_HASH}/{image_id}/{variant}",
    
    # URL Schema for uploading a video 
    "upload": "https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_STREAM_ACCOUNT_ID}/images/v1",

    # URL Schema for modifying an existing upload 
    "modify": "",
}

# Sticker Service
#
# Services like Giphy 
#
# Stickers on Yourbit are still under construction, so there are no features 
# implemented regarding that. You can place the search and retrieval URL's to 
# your desired sticker service here. If the sticker service requires an API key,
# place that in environment variables.

sticker_service = {
    
    # URL Schema for Searching the collection
    "search": "https://api.giphy.com/v1/stickers/search?q={query}",  
}


# Bot Challenges:
  
# Services like reCAPTHCA, Turnstile, and HCAPTCHA

# The bot challenge service requires a secret and a site key, add 
# them as CHALLENGE_SECRET_KEY and CHALLENGE_SITE_KEY in the environment
# variables 

bot_challenge_service = {
    # URL for verifying tokens sent by the client side bot challenge
    "verify_url": "https://challenges.cloudflare.com/turnstile/v0/siteverify",
}
