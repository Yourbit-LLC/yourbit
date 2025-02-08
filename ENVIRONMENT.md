# Environment Variables Reference

This document lists all the environment variables required for the project.

Sections:

- How to Set Up
- Variables
- Guides


## 🛠 **How to Set Up**
**Create an environment file**

In the root (top) directory of your project. Create a file with the name `.env`. 

1. Copy `.env.example` to `.env`
2. Fill in the values as needed (use the keys from this document).
3. Load environment variables using `python-dotenv` (Django) or system settings.

**Note:** Ensure that the `.env` file is added to your `.gitignore` to avoid accidentally sharing sensitive information.


> **Note:** Never configure the settings.py file directly in production.

---

## 🔑 **Variables List**

| Variable Name                   | Description | Example Value |
|---------------------------------|-------------|---------------|
| `BUCKET_NAME`                   | Name of the Linode storage bucket. | `your-linode-bucket` |
| `BUCKET_REGION`                 | Region of the Linode storage bucket. | `us-east` |
| `BUCKET_ACCESS_KEY`             | Access key for the Linode storage bucket. | `your-linode-access-key` |
| `BUCKET_SECRET_KEY`             | Secret key for the Linode storage bucket. | `your-linode-secret-key` |
| `DB_NAME`                       | Database name. | `your-database-name` |
| `DB_USER`                       | Database username. | `your-db-user` |
| `DB_PASSWORD`                   | Database password. | `your-db-password` |
| `DB_HOST`                       | Database host (e.g., `localhost` or a remote server). | `localhost` |
| `DB_PORT`                       | Database port. | `5432` |
| `EMAIL_HOST`                    | Email server host (e.g., for sending email). | `smtp.example.com` |
| `EMAIL_HOST_USER`               | Email server username. | `your-email@example.com` |
| `EMAIL_HOST_PASSWORD`           | Email server password. | `your-email-password` |
| `EMAIL_PORT`                    | Email server port (usually 587 for SMTP). | `587` |
| `PAYMENT_PUBLIC_KEY`            | Stripe public API key for payments. | `pk_test_yourkey` |
| `PAYMENT_SECRET_KEY`            | Stripe secret API key for payments. | `sk_test_yourkey` |
| `AI_API_KEY`                    | API key for OpenAI services. | `your-openai-api-key` |
| `GIPHY_API_KEY`                 | API key for Giphy integration. | `your-giphy-api-key` |
| `GIPHY_SDK_KEY`                 | SDK key for Giphy integration. | `your-giphy-sdk-key` |
| `VAPID_PUBLIC_KEY`              | VAPID public key for web push notifications. | `your-vapid-public-key` |
| `VAPID_PRIVATE_KEY`             | VAPID private key for web push notifications. | `your-vapid-private-key` |
| `VAPID_ADMIN_EMAIL`             | VAPID admin email for web push notifications. | `admin@example.com` |
| `CLOUDFLARE_STREAM_ACCOUNT_ID`  | Cloudflare Stream account ID for video streaming. | `your-cloudflare-account-id` |
| `CLOUDFLARE_STREAM_API_KEY`     | Cloudflare Stream API key for video streaming. | `your-cloudflare-api-key` |
| `IMAGES_API_KEY`                | Cloudflare Images API key for image management. | `your-cloudflare-images-api-key` |
| `IMAGES_ACCOUNT_HASH`           | Cloudflare account hash for Cloudflare API. | `your-cloudflare-account-hash` |
| `IMAGE_BASE_URL`                | Base URL for serving images via Cloudflare. | `https://images.example.com` |
| `CHALLENGE_SITE_KEY`            | Turnstile site key for Turnstile integration. | `your-turnstile-site-key` |
| `CHALLENGE_SECRET_KEY`          | Turnstile secret key for Turnstile integration. | `your-turnstile-secret-key` |
| `VIDEO_CDN_TOKEN`               | Site token for video streaming. | `your-mux-video-token` |
| `VIDEO_CDN_SECRET`              | Secret Key for video streaming. | `your-mux-video-secret` |
| `VIDEO_WEBHOOK_SECRET`          | Webhook secret for Mux API integration. | `your-mux-webhook-secret` |
| `VIDEO_SIGNING_KEY`             | Video service signing key for secure media handling. | `your-mux-signing-key` |
| `VIDEO_PRIVATE_KEY`             | Video service private key for media handling. | `your-mux-private-key` |
| `DJANGO_SECRET_KEY`             | Django secret key for cryptographic operations. | `your-django-secret-key` |
| `ALLOWED_HOSTS`                 | Comma-separated list of allowed hosts. | `localhost,127.0.0.1,example.com` |
| `CSRF_TRUSTED_ORIGINS`          | Comma-separated list of trusted origins for CSRF. | `https://your-domain.com` |

---


## 📖 **Guides:**


**Add database credentials to `.env` file**
```env
# Database Configuration
DB_NAME=your-database-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432
```


**Add object storage bucket to `.env` file**
```env
# Bucket Storage Configuration
BUCKET_NAME=your-bucket-name
BUCKET_REGION=us-east
BUCKET_ACCESS_KEY=your-bucket-access-key
BUCKET_SECRET_KEY=your-bucket-secret-key
```

**Add video service credentials to `.env` file**
```env
# Video CDN Configuration
VIDEO_CDN_TOKEN=your-mux-video-token
VIDEO_CDN_SECRET=your-mux-video-secret

# Video Webhook and Signing Keys
VIDEO_WEBHOOK_SECRET=your-mux-webhook-secret
VIDEO_SIGNING_KEY=your-mux-signing-key
VIDEO_PRIVATE_KEY=your-mux-private-key
```

_Video service providers must be compatible with the HLS protocol._

**Add image service credentials to `.env` file**
```env
# Image CDN Images Configuration
IMAGES_API_KEY=your-cloudflare-images-api-key

# Image CDN Account Configuration
IMAGES_ACCOUNT_HASH=your-cloudflare-account-hash
IMAGE_BASE_URL=https://images.example.com
```

**Add email service credentials to `.env` file**
```env
# Email Server Configuration
EMAIL_HOST=smtp.example.com
EMAIL_HOST_USER=your-email@example.com
EMAIL_HOST_PASSWORD=your-email-password
EMAIL_PORT=587
```

**Add VAPID Credentials**
```env
# VAPID Keys for Push Notifications
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_ADMIN_EMAIL=admin@example.com
```

**Add bot prevention challenges**
```env
# Bot Prevention Configuration
CHALLENGE_SITE_KEY=your-turnstile-site-key
CHALLENGE_SECRET_KEY=your-turnstile-secret-key
```

**Generate and add a django-secret key**
```env
# Django Secret Key (Ensure this is secure!)
DJANGO_SECRET_KEY=your-django-secret-key
```

**Configure allowed hosts and trusted origins**
```env
# Allowed Hosts and CSRF Configuration
ALLOWED_HOSTS=localhost,127.0.0.1,example.com
CSRF_TRUSTED_ORIGINS=https://your-domain.com
```

