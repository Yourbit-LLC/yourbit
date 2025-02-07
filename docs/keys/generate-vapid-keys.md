# 🔑 Generating and Using VAPID Keys

VAPID (Voluntary Application Server Identification for Web Push) keys are used for authenticating push notifications sent to browsers. This guide explains how to generate VAPID keys and configure them using a `.env` file.

## ⚡ Generating VAPID Keys

You can generate a VAPID key pair using the `pywebpush` library.

### 1️⃣ Install `pywebpush`

If you haven't installed it yet, run:

```sh
pip install pywebpush
```

### 2️⃣ Generate VAPID Keys

Run the following Python command:

```sh
python -c "from py_vapid import Vapid; v = Vapid(); v.generate_keys(); print('VAPID_PUBLIC_KEY=' + v.public_key); print('VAPID_PRIVATE_KEY=' + v.private_key)"
```

This will output two keys:

```
VAPID_PUBLIC_KEY=BDh6F... (your public key)
VAPID_PRIVATE_KEY=abc123... (your private key)
```

## 📌 Storing VAPID Keys in a `.env` File

If you haven't already, create a `.env` file in your Django project root and add the keys and your admin email to your new or existing file:

```
VAPID_PUBLIC_KEY=BDh6F...(your public key)
VAPID_PRIVATE_KEY=abc123...(your private key)
VAPID_ADMIN_EMAIL=admin@example.com
```

Once this step is completed, Yourbit should be able to access your VAPID keys for serving web push notifications.

---

By keeping your VAPID keys in a `.env` file, you enhance security and prevent accidental exposure in version control. 🚀  
