# 📌 **Video Service Integration Reference for Yourbit**

Yourbit supports flexible integration with third-party video services for **uploading, processing, and streaming videos**. Below is a reference list of services that can be integrated into Yourbit's **action map** and **video service API**.

---

## **Supported & Tested Services**
These services have been tested or referenced in Yourbit's development:

| Service | Features | Integration Status |
|---------|----------|---------------------|
| **Mux** | Video hosting, adaptive streaming, secure playback, automatic thumbnails | ✅ Integrated |
| **Cloudflare Stream** | Global CDN, chunked uploads, secure signed URLs, HLS playback | ✅ Partially Integrated |
| **Yourbit Native (Planned)** | Local video storage and streaming via self-hosted CDN | 🔄 In Development |

---

## **Potential Video Services for Integration**
The following services can be integrated into Yourbit **by modifying the action map and authentication settings**:

### **🎥 Commercial Video APIs**
| Service | Features | Potential Integration |
|---------|----------|----------------------|
| **Vimeo API** | High-quality streaming, privacy controls, monetization options | 🔹 Yes (API support) |
| **YouTube API** | Wide reach, embeddable videos, analytics, live streaming | 🔹 Limited (Embedding only) |
| **JW Player** | Customizable player, DRM protection, API-driven video management | 🔹 Yes (API support) |
| **Brightcove** | Enterprise-grade streaming, AI-powered recommendations | 🔹 Yes (API support) |

### **🚀 Open Source & Self-Hosted Alternatives**
| Service | Features | Potential Integration |
|---------|----------|----------------------|
| **MediaMTX** | Lightweight RTSP, RTMP, and WebRTC video streaming server | 🔹 Self-hosted option |
| **PeerTube** | Federated video hosting, decentralized network | 🔹 Yes (ActivityPub support) |
| **Nginx-RTMP** | Low-latency live streaming, self-hosted RTMP server | 🔹 Yes (Custom CDN) |
| **Owncast** | Self-hosted live streaming, chat integration | 🔹 Yes (Self-hosted option) |

---

## **Integration Considerations**
When adding a new video provider, developers should:
1. **Modify the action map** to reflect the correct API endpoints:
   ```python
   video_service = {
       "upload_url": "https://api.newservice.com/upload",
       "webhook_status": "data.status",
       "playback_url": "https://cdn.newservice.com/{playback_id}.m3u8",
       "thumbnail_url": "https://cdn.newservice.com/{playback_id}/thumbnail.png",
   }
   ```
2. **Configure API authentication**:
   - Store API keys in environment variables (`settings.py`).
   - Use secure authentication (OAuth, JWT, API tokens).

3. **Ensure compatibility with Yourbit's workflow**:
   - The service must support **direct upload URLs** or **chunked uploads**.
   - The service should provide **webhook callbacks** for processing updates.
   - The playback format must be **HLS (.m3u8) or MP4** for full compatibility.

---

## **Conclusion**
Yourbit’s modular video service allows **flexible integration** with different providers. Developers can extend support for **new video APIs** by updating the **action map** and **authentication settings**.

For further integration details, refer to the **`services.py`** documentation. 🚀
