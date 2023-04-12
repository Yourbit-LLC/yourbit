import requests

endpoint = "https://www.httpbin.org/anything"
response = requests.get(endpoint)

print(response.json())