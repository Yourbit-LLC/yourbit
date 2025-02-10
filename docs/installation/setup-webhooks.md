# Setting Up a Secure Tunnel and Configuring Webhooks in Yourbit

Yourbit requires a publicly accessible URL to receive webhooks. If you're developing locally, you can set up a secure tunnel using `ngrok` or `Cloudflare Tunnel`. This guide will walk you through setting up a secure tunnel and configuring environment variables to receive webhooks.

---

## 1. Setting Up a Secure Tunnel

### Using ngrok

1. **Install ngrok**
   ```sh
   # Download and install ngrok (Linux/macOS)
   curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
   echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
   sudo apt update && sudo apt install ngrok
   ```
   Or visit [ngrok's website](https://ngrok.com/download) for installation instructions for your OS.

2. **Authenticate ngrok** (sign up at [ngrok.com](https://ngrok.com) if needed)
   ```sh
   ngrok authtoken YOUR_NGROK_AUTH_TOKEN
   ```

3. **Start the Tunnel**
   ```sh
   ngrok http 8000
   ```
   This will generate a public URL like `https://randomsubdomain.ngrok.io`.

### Using Cloudflare Tunnel

1. **Install Cloudflare Tunnel**
   ```sh
   # Install Cloudflare Tunnel (Linux/macOS)
   curl -fsSL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
   chmod +x cloudflared
   sudo mv cloudflared /usr/local/bin/
   ```
   Or follow [Cloudflare’s official guide](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/) for your OS.

2. **Authenticate and Set Up a Tunnel**
   ```sh
   cloudflared tunnel login
   cloudflared tunnel create yourbit-tunnel
   ```

3. **Run the Tunnel**
   ```sh
   cloudflared tunnel --url http://localhost:8000
   ```
   This will provide a public URL under `https://your-tunnel-id.trycloudflare.com`.

---

## 2. Configuring Environment Variables for Webhooks

Once you have a secure public URL, update Yourbit’s `.env` file with the webhook URL.

1. **Open `.env` file** (or create one if it doesn’t exist)
   ```sh
   nano .env
   ```

2. **Add the webhook URL**
   ```ini
   WEBHOOK_URL=https://your-generated-url.ngrok.io/webhooks
   ```
   or if using Cloudflare Tunnel:
   ```ini
   WEBHOOK_URL=https://your-tunnel-id.trycloudflare.com/webhooks
   ```

3. **Restart Yourbit’s Server**
   ```sh
   source .env
   python manage.py runserver
   ```

---

## 3. Testing Webhooks

Use `cURL` or Postman to test if Yourbit correctly receives webhooks.

```sh
curl -X POST "$WEBHOOK_URL" -H "Content-Type: application/json" -d '{"event": "test"}'
```

If the server logs show a received request, the setup is successful.

---

## 4. Security Considerations

- **Use HTTPS**: Ensure your production webhook URLs use `https://` to encrypt data.
- **Restrict Allowed Hosts**: In `settings.py`, add the ngrok or Cloudflare domain to `ALLOWED_HOSTS`:
  ```python
  ALLOWED_HOSTS = ['your-generated-url.ngrok.io', 'your-tunnel-id.trycloudflare.com']
  ```
- **Verify Webhook Signatures**: If the webhook sender supports signing requests, validate them to ensure authenticity.

---

## 5. Automating Tunnel Setup (Optional)

To automate tunnel creation, add the following to a startup script:

```sh
# Start tunnel and export the URL to .env
ngrok http 8000 --log=stdout > ngrok.log &
sleep 5  # Wait for ngrok to start
export WEBHOOK_URL=$(grep -oE "https://[a-zA-Z0-9]+\.ngrok\.io" ngrok.log)
echo "WEBHOOK_URL=$WEBHOOK_URL" > .env
```

This ensures a new tunnel is automatically configured every time your server starts.

---

## Conclusion
By setting up a secure tunnel and configuring environment variables, Yourbit can reliably receive webhooks during development. For production, consider hosting on a server with a public HTTPS endpoint.

For further support, visit the [Yourbit GitHub repository](https://github.com/Yourbit-LLC/yourbit).
