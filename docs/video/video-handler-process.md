# 🎞️ **Handling Video API’s on Yourbit**
This file is intended to explain how Yourbit interacts with video API’s to retrieve, present, and deliver your video to users on Yourbit. This will help understand how the action map uses media API's in media handling processes.

## Publishing Videos
  - When a video is submitted for upload, Yourbit will:
      - Request a direct upload link from the video service provider
      - Create a video object in the database
      - Assign the upload ID from the direct upload request to the video object
      - If the video is being submitted as a bit, the new bit is created and set to status="pending"
      - The upload link is then returned to the client.
  - The client application will use the provided link to begin uploading the video in chunks
  - At different points in the process a video service will return a webhook notification.
  - Once Yourbit receives a webhook notification of status="ready" an asset ID is extracted from that response and attached to the video object
  - If an associated bit is being created, set the status of the bit to "live"
  - Playback links are created using the playback_url schema specified in the action map and saved to the video object

## Delivering Videos

### In Messages:
  - Video object is retrieved in the database by ID attached to message
  - The `playback_url` is retrieved from the video object and returned to the client
  - The client renders a video element with source set as the `playback_url`

### In Bits:
  - Video object is retrieved using the ID stored in the attached video field of the bit
  - The `playback_URL` is retirieved from the video object
  - A video player HTML template is rendered containing a `video` element with the video `playback_url` as the `src`

## Handling Thumbnails


## Attaching to a Bit


## Handling Messages
