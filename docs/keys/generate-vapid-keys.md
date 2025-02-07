# 🔑 Generating and Using VAPID Keys in Django

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

## 🔧 Using VAPID Keys in Django

### 1️⃣ Install `python-dotenv`

If not already installed, add `python-dotenv` to your project:

```sh
pip install python-dotenv
```

### 2️⃣ Load the `.env` File in `settings.py`

Modify `settings.py` to load the VAPID keys:

```python
import os
from dotenv import load_dotenv

load_dotenv()

VAPID_PUBLIC_KEY = os.getenv("VAPID_PUBLIC_KEY")
VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY")
VAPID_ADMIN_EMAIL = os.getenv("VAPID_ADMIN_EMAIL", "admin@example.com")
```

### 3️⃣ Using VAPID Keys in Web Push Notifications

When sending a web push notification, pass the keys like this:

```python
from pywebpush import webpush

webpush(
    subscription_info=subscription,
    data="Hello, this is a push notification!",
    vapid_private_key=VAPID_PRIVATE_KEY,
    vapid_claims={"sub": "mailto:" + VAPID_ADMIN_EMAIL},
)
```

---

By keeping your VAPID keys in a `.env` file, you enhance security and prevent accidental exposure in version control. 🚀  
