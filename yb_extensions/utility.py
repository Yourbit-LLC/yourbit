import json
import os
import jwt
import time
import hashlib
import hmac
import base64
import crypto  # For RSA signing

def load_action_map(config_path="config.json"):
    """Loads the action map from a JSON file and applies environment variables."""
    try:
        with open(config_path, "r") as file:
            action_map = json.load(file)
    except FileNotFoundError:
        action_map = {"video_services": {}}

    # Inject environment variables where necessary
    for service, config in action_map.get("video_services", {}).items():
        if "signing_secret" in config:
            env_secret = os.getenv(config["signing_secret"], "")
            action_map["video_services"][service]["signing_secret"] = env_secret
        if "key_id" in config:
            env_key_id = os.getenv(config["key_id"], "")
            action_map["video_services"][service]["key_id"] = env_key_id

    return action_map

# Load configuration
universal_action_map = load_action_map()
def sign_url(provider, url, **kwargs):
    """Signs the URL using JWT (HS256/RS256) or RSA (AWS CloudFront)."""
    service_config = universal_action_map["video_services"].get(provider, {})
    
    if not service_config.get("requires_signature", False):
        return url  # No signing required

    algorithm = service_config.get("signing_algorithm", "HS256")
    secret = service_config.get("signing_secret", "")
    key_id = service_config.get("key_id", "")

    if algorithm in ["HS256", "RS256"]:
        # JWT Signing (Mux, Cloudflare Stream, Vimeo, Azure)
        exp_time = int(time.time()) + 600  # Token valid for 10 minutes
        claims = {"exp": exp_time}

        if key_id:
            claims["kid"] = key_id  # Some services require a key ID

        token = jwt.encode(claims, secret, algorithm=algorithm)
        return f"{url}?token={token}"

    elif algorithm == "RSA":
        # RSA Signing for AWS CloudFront
        private_key_path = secret  # Path to private key file
        with open(private_key_path, "r") as key_file:
            private_key = key_file.read()

        policy = {
            "Statement": [
                {
                    "Resource": url,
                    "Condition": {"DateLessThan": {"AWS:EpochTime": int(time.time()) + 600}}
                }
            ]
        }

        policy_b64 = base64.urlsafe_b64encode(json.dumps(policy).encode()).decode()
        signer = crypto.create_signer("SHA1")
        signer.update(policy_b64.encode())
        signature = base64.urlsafe_b64encode(signer.sign(private_key)).decode()

        return f"{url}?Policy={policy_b64}&Signature={signature}&Key-Pair-Id={key_id}"

    return url  # No valid signing method found


def get_action_url(action, provider=None, **kwargs):
    """
    Retrieves the API endpoint URL, signs it if required, and formats parameters.
    - Supports dynamic parameters (e.g., {video_id}).
    - Signs the URL if the service requires it.
    - Returns None if the action is not available.
    """
    service_config = universal_action_map["video_services"].get(provider, {})
    url_template = service_config.get(action, "")

    # If action is missing or empty, return None
    if not url_template:
        return None

    # Format URL with parameters
    formatted_url = url_template.format(**kwargs)

    # Sign URL if needed
    signed_url = sign_url(provider, formatted_url, **kwargs)

    return signed_url


# Example Usage:
mux_signed_url = get_action_url("playback_url", provider="mux", playback_id="12345")
cloudflare_signed_url = get_action_url("upload_url", provider="cloudflare_stream", ACCOUNT_ID="abcd")
aws_signed_url = get_action_url("playback_url", provider="aws_cloudfront", video_id="example.mp4")

print(mux_signed_url)
print(cloudflare_signed_url)
print(aws_signed_url)
