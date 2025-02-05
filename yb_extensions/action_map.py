# The action map keeps track of all of the API actions across different services in yourbit. 
# Yourbit contains several built in services that can be modified. In order for these services to function,
# yourbit needs to know the proper request URL's to understand how to interact with your API. The action map 
# lets you map request urls from Yourbits media retrieval functions to alternative API's for media handling, 
# as well as configure API actions for community created features.

# Warning: The action map is not a place for storing keys use variables where keys are required in the url. Modify keys
# using the environment variables.

#The most basic requirements for third party video services include a view url, preview url, upload url, and modify url.

video_service = {
    "view": "",
    "preview": "",
    "upload": "",
    "modify": "",
}

# The image service must provide image thumbnail variants consistent with yourbits expected thumbnail variants.
# You may choose any size for thumnail variants, however, higher resolutions may impact performance. For guidelines
# on how Yourbit sizes thumnails, check out the documentation on Image Services.

image_service = {
    "view": "",
    "upload": "",
    "modify": ""
}



sticker_service = {
    "search": "",
    "retrieve" : "",
}

bot_challenge_service = {

}

