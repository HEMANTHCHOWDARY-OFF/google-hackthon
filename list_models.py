import requests
import json

API_KEY = "AIzaSyA2tUi8nmIuV0ySVg4lT7J4647omL6c-Cs"
URL = f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"

try:
    print(f"Listing models with key: {API_KEY}...")
    response = requests.get(URL)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        models = response.json().get('models', [])
        for model in models:
            print(f"- {model['name']}")
    else:
        print("Failed!")
        print(response.text)
except Exception as e:
    print(f"Error: {e}")
