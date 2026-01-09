import requests
import json

API_KEY = "AIzaSyA2tUi8nmIuV0ySVg4lT7J4647omL6c-Cs"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={API_KEY}"

payload = {
    "contents": [{
        "parts": [{"text": "Hello, this is a test."}]
    }]
}

headers = {"Content-Type": "application/json"}

try:
    print(f"Testing API Key: {API_KEY}...")
    response = requests.post(URL, headers=headers, json=payload)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Success!")
        print(response.json())
    else:
        print("Failed!")
        print(response.text)
except Exception as e:
    print(f"Error: {e}")
