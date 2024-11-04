import requests
#Import django settings
from django.conf import settings

def is_local_request(request):
    """
    Determines if the request is from a local environment based on the host.
    """
    host = request.get_host()
    return host.startswith('localhost') or host.startswith('127.0.0.1')

# This is the demo secret key. Replace with a secure key for production.
TURNSTILE_SECRET_KEY = settings.TURNSTILE_SECRET_KEY
TURNSTILE_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

def get_client_ip(request):
    """
    Retrieve the real IP address of the client.
    """
    return request.META.get('HTTP_CF_CONNECTING_IP') or request.META.get('REMOTE_ADDR')

def validate_turnstile_token(token, user_ip):
    """
    Django view to verify Cloudflare Turnstile token.
    """

    # Prepare payload for Cloudflare verification
    data = {
        'secret': TURNSTILE_SECRET_KEY,
        'response': token,
        'remoteip': user_ip
    }

    # Send request to Turnstile API for verification
    response = requests.post(TURNSTILE_URL, json=data)
    outcome = response.json()

    if outcome.get('success'):
        return True
    else:
        return False
    