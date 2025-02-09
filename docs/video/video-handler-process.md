# 🎞️ **Handling Video API’s on Yourbit**
This file explains how Yourbit interacts with video APIs to retrieve, present, and deliver video content. It covers the media handling process and how the action map integrates with media APIs. The goal of Yourbits video API handling is to make it universal allowing developers to choose their provider in their own builds. 


## **Targeted Improvements:**

We are working on an integrated CDN service for videos and media as a free and local alternative to fall back to when either making contributions and testing in a local environment or when using an external, potentialy paid, provider is not preferred. Once this is complete, you will still be able to choose alternative media handling services using the action map, if desired.

## **Publishing Videos**
When a video is submitted for upload, Yourbit will:
  - Request a direct upload link from the video service provider (`Mux` or `Cloudflare`).
  - Create a `Video` object in the database with `upload_status="preparing"`.
  - Assign the `upload ID` received from the direct upload request to the `Video` object.
  - If the video is part of a bit, the bit is created and set to `status="pending"`.
  - The upload link is then returned to the client.
  
The client application will:
  - Use the provided link to begin uploading the video in chunks (`tus.js` is used for this in `video_setup.js` and `video_upload3.js`).
  - Once the upload completes, Yourbit waits for a webhook notification from the video service.

When Yourbit receives a `status="ready"` webhook:
  - The asset ID is extracted from the response and attached to the `Video` object.
  - If the video is associated with a bit, its `status` is updated to `live`.
  - A playback link is generated using the `playback_url` schema defined in the action map.
  - The video is now accessible for playback.

---

## **Delivering Videos**
Yourbit retrieves and delivers videos based on where they are used.

### **In Messages**
  - The video object is retrieved from the database using the ID attached to the message.
  - The `playback_url` is extracted and returned to the client.
  - The client renders a `<video>` element with the `playback_url` as its `src`.

### **In Bits**
  - The video object is retrieved using the ID stored in the bit's video field.
  - The `playback_url` is extracted and used to render the video player.
  - If the video is hosted externally (Mux, Cloudflare), a secure playback token is generated.

Yourbit’s video player:
  - Uses an HTML5 `<video>` element for self-hosted videos.
  - Uses `<mux-player>` when playing videos from Mux.
  - Renders metadata such as thumbnails, bit information, and user details.

The `player_view.html` file defines the UI for video playback.

---

## **Handling Thumbnails**
  - A thumbnail is automatically generated from the video using the `generate_mux_thumbnails()` function in `services.py`.
  - Thumbnails are stored in the `VideoThumbnail` model and linked to the `Video` object.
  - The first frame of the video can be extracted and converted into an image (`yb_getFirstFrame()` and `yb_frameToImage()` in `video_setup.js`).
  - Cloudflare and Mux can also provide thumbnail URLs, which are stored in the `ext_url` field.

---

## **Attaching to a Bit**
When a video is uploaded as part of a bit:
  - The bit object is created first.
  - The video upload process is triggered.
  - Once the video is ready, its asset ID and playback URL are linked to the bit.
  - The bit’s status changes from `pending` to `live`.

---

## **Handling Messages**
Videos in messages are processed similarly to bits:
  - The sender attaches a video file.
  - The video uploads and a temporary placeholder message is created.
  - Once the upload is complete and the video is ready, the message updates with the playback URL.

---

This documentation covers how Yourbit processes videos from upload to playback, the official build leverages Cloudflare and Mux for efficient media handling. 🚀

