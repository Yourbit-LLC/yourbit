import json
import os
import jwt
import time
import hashlib
import hmac
import base64
import crypto  # For RSA signing
from urllib.parse import urlparse
from yb_extensions.action_map import video_service


def extract_provider_from_url(url):
    """Extracts the base domain from a URL and maps it to a provider."""
    domain_to_provider = {
        "mux.com": "mux",
        "cloudflarestream.com": "cloudflare_stream",
        "cloudfront.net": "aws_cloudfront",
        "vimeo.com": "vimeo",
        "azure.net": "azure"
    }

    parsed_url = urlparse(url)
    domain = parsed_url.netloc

    for known_domain in domain_to_provider:
        if known_domain in domain:
            return domain_to_provider[known_domain]

    return None  # Unknown provider

def sign_url(url, **kwargs):
    """Signs the URL using JWT (HS256/RS256) or RSA (AWS CloudFront)."""
    provider = extract_provider_from_url(url)

    if not provider:
        return url  # No signing required if provider isn't mapped

    service_config = video_service

    if not service_config.get("requires_signature", False):
        return url  # No signing required

    algorithm = service_config.get("signing_algorithm", "HS256")
    secret = os.getenv(service_config.get("signing_secret", ""), "")
    key_id = os.getenv(service_config.get("key_id", ""), "")

    if algorithm in ["HS256", "RS256"]:
        # JWT Signing (Mux, Cloudflare, Vimeo, Azure)
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

def get_action_url(action, **kwargs):
    """
        Retrieves the API endpoint URL, signs it if required, and formats parameters.
            - Supports dynamic parameters (e.g., {video_id}).
            - Signs the URL if the service requires it.
            - Returns None if the action is not available.
    """
    service_config = video_service
    url_template = service_config.get(action, "")

    # If action is missing or empty, return None
    if not url_template:
        return None

    # Format URL with parameters
    formatted_url = url_template.format(**kwargs)

    # Sign URL if needed
    signed_url = sign_url(formatted_url, **kwargs)

    return signed_url