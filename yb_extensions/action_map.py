#  **Action Map Introduction**

#   The action map keeps track of all of the API actions across 
#   different services in yourbit. Yourbit contains several built 
#   in services that can be modified. In order for these services 
#   to function, yourbit needs to know the proper request URL's to 
#   understand how to interact with your API. The action map lets you 
#   map request urls from Yourbits media retrieval functions to 
#   alternative API's for media handling, as well as configure API 
#   actions for community created features.

#   Warning: The action map is not a place for storing keys use variables 
#   where keys are required in the url. Modify keys using the environment 
#   variables.



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
    "playback": "", 

    # If necessary, a URL schema for retrieving video data
    "retrieve": "",

    # If available, a URL schema for retrieving previews, if not Yourbit will fall back to image service
    "preview": "",

    # Video upload URL schema, this must be for a direct upload endpoint
    "upload": "",

    # URL to modify an existing upload
    "modify": "" 
    
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
    "retrieve": "",
    
    # URL Schema for fetching small thumbnails
    "smallThumbnail": "",
    
    # URL Schema for fetching medium thumnails
    "mediumThumnail": "", 
    
    # URL Schema for fetching large thumbnails
    "largeThumbnail": "",
    
    # URL Schema for uploading a video 
    "upload": "",

    # URL Schema for modifying an existing upload 
    "modify": "",
}

# Sticker Service
#
# Services like Giphy 
#
# Stickers on yourbit are still under construction, so there are no features 
# implemented regarding that. You can place the search and retrieval URL's to 
# your desired sticker service here.

sticker_service = {
    
    # URL Schema for Searching the collection
    "search": "", 
    
    # URL Schema for Retrieving a single sticker
    "retrieve" : "" 
}


# Bot Challenges:
#  
# Services like reCAPTHCA, Turnstile, and HCAPTCHA
# 
# The bot challenge service requires a secret and a site key, add 
# them as CHALLENGE_SECRET_KEY and CHALLENGE_SITE_KEY in the environment
# variables 

bot_challenge_service = {

    # URL for verifying tokens sent by the client side bot challenge
    "verify_url": "",

}
