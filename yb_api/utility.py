
# Create your views here.
from rest_framework_api_key.models import APIKey

# Generate a new API key

def generate_api_key():
    """
    Generate a new API key.
    """
    api_key, key = APIKey.objects.create_key(name="Your API Key Name")

    print(f"The API key is: {key}")

    return key


