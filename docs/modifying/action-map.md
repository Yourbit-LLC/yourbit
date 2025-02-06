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
The following code snippet is an example taken from the `yb_extensions/action_map.py`

```python
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
```

