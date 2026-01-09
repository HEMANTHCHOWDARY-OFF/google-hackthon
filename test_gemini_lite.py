import requests
import json

API_KEY = "AIzaSyA2tUi8nmIuV0ySVg4lT7J4647omL6c-Cs"
MODEL = "gemini-2.0-flash-lite"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

payload = {
    "contents": [{
        "parts": [{"text": "Hello"}]
    }]
}
headers = {"Content-Type": "application/json"}

try:
    print(f"Testing {MODEL}...")
    response = requests.post(URL, headers=headers, json=payload)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Success!")
    else:
        print("Failed!")
        print(response.text)
except Exception as e:
    print(f"Error: {e}")
