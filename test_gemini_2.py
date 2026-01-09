import requests
import json

API_KEY = "AIzaSyA2tUi8nmIuV0ySVg4lT7J4647omL6c-Cs"
MODEL = "gemini-2.0-flash"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

payload = {
    "contents": [{
        "parts": [{"text": "Hello, are you working?"}]
    }]
}
headers = {"Content-Type": "application/json"}

try:
    print(f"Testing {MODEL}...")
    response = requests.post(URL, headers=headers, json=payload)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Success!")
        print(response.json()['candidates'][0]['content']['parts'][0]['text'])
    else:
        print("Failed!")
        print(response.text)
except Exception as e:
    print(f"Error: {e}")
