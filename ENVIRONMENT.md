# Environment Variables Reference

This document lists all the environment variables required for the project.

## 🔑 **Required Variables**

| Variable Name                  | Description | Example Value |
|---------------------------------|-------------|---------------|
| `BUCKET_ACCESS_KEY`             | Access key for the media storage bucket. | `your-access-key` |
| `BUCKET_SECRET_KEY`             | Secret key for the media storage bucket. | `your-secret-key` |
| `MEDIA_BUCKET_NAME`             | Name of the media storage bucket. | `your-bucket-name` |
| `LINODE_BUCKET`                 | Name of the Linode storage bucket. | `your-linode-bucket` |
| `LINODE_BUCKET_REGION`          | Region of the Linode storage bucket. | `us-east` |
| `LINODE_BUCKET_ACCESS_KEY`      | Access key for the Linode storage bucket. | `your-linode-access-key` |
| `LINODE_BUCKET_SECRET_KEY`      | Secret key for the Linode storage bucket. | `your-linode-secret-key` |
| `DB_NAME`                       | Database name. | `your-database-name` |
| `DB_USER`                       | Database username. | `your-db-user` |
| `DB_PASSWORD`                   | Database password. | `your-db-password` |
| `DB_HOST`                       | Database host (e.g., `localhost` or a remote server). | `localhost` |
| `DB_PORT`                       | Database port. | `5432` |
| `EMAIL_HOST`                    | Email server host (e.g., for sending email). | `smtp.example.com` |
| `EMAIL_HOST_USER`               | Email server username. | `your-email@example.com` |
| `EMAIL_HOST_PASSWORD`           | Email server password. | `your-email-password` |
| `EMAIL_PORT`                    | Email server port (usually 587 for SMTP). | `587` |
| `STRIPE_PUBLIC_KEY`             | Stripe public API key for payments. | `pk_test_yourkey` |
| `STRIPE_SECRET_KEY`             | Stripe secret API key for payments. | `sk_test_yourkey` |
| `RECAPTCHA_PRIVATE_KEY`         | Private key for reCAPTCHA integration. | `your-recaptcha-private-key` |
| `RECAPTCHA_PUBLIC_KEY`          | Public key for reCAPTCHA integration. | `your-recaptcha-public-key` |
| `OPENAI_API_KEY`                | API key for OpenAI services. | `your-openai-api-key` |
| `GIPHY_API_KEY`                 | API key for Giphy integration. | `your-giphy-api-key` |
| `GIPHY_SDK_KEY`                 | SDK key for Giphy integration. | `your-giphy-sdk-key` |
| `VAPID_PUBLIC_KEY`              | VAPID public key for web push notifications. | `your-vapid-public-key` |
| `VAPID_PRIVATE_KEY`             | VAPID private key for web push notifications. | `your-vapid-private-key` |
| `VAPID_ADMIN_EMAIL`             | VAPID admin email for web push notifications. | `admin@example.com` |
| `CLOUDFLARE_STREAM_ACCOUNT_ID`  | Cloudflare Stream account ID for video streaming. | `your-cloudflare-account-id` |
| `CLOUDFLARE_STREAM_API_KEY`     | Cloudflare Stream API key for video streaming. | `your-cloudflare-api-key` |
| `CLOUDFLARE_IMAGES_API_KEY`     | Cloudflare Images API key for image management. | `your-cloudflare-images-api-key` |
| `CLOUDFLARE_ACCOUNT_HASH`       | Cloudflare account hash for Cloudflare API. | `your-cloudflare-account-hash` |
| `IMAGE_BASE_URL`                | Base URL for serving images via Cloudflare. | `https://images.example.com` |
| `TURNSTILE_SITE_KEY`            | Turnstile site key for Turnstile integration. | `your-turnstile-site-key` |
| `TURNSTILE_SECRET_KEY`          | Turnstile secret key for Turnstile integration. | `your-turnstile-secret-key` |
| `MUX_VIDEO_TOKEN`               | Mux video token for video streaming. | `your-mux-video-token` |
| `MUX_VIDEO_SECRET`              | Mux video secret for video streaming. | `your-mux-video-secret` |
| `MUX_WEBHOOK_SECRET`            | Webhook secret for Mux API integration. | `your-mux-webhook-secret` |
| `MUX_SIGNING_KEY`               | Mux signing key for secure media handling. | `your-mux-signing-key` |
| `MUX_PRIVATE_KEY`               | Mux private key for media handling. | `your-mux-private-key` |
| `DJANGO_SECRET_KEY`             | Django secret key for cryptographic operations. | `your-django-secret-key` |
| `ALLOWED_HOSTS`                 | Comma-separated list of allowed hosts. | `localhost,127.0.0.1,example.com` |
| `CSRF_TRUSTED_ORIGINS`         | Comma-separated list of trusted origins for CSRF. | `https://your-domain.com` |

---

## 🛠 **How to Set Up**
1. Copy `.env.example` to `.env`
2. Fill in the values as needed (use the keys from this document).
3. Load environment variables using `python-dotenv` (Django) or system settings.

**Note:** Ensure that the `.env` file is added to your `.gitignore` to avoid accidentally sharing sensitive information.
