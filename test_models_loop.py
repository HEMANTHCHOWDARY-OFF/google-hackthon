import requests
import json

API_KEY = "AIzaSyA2tUi8nmIuV0ySVg4lT7J4647omL6c-Cs"
MODELS = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro",
    "gemini-1.5-pro-latest",
    "gemini-pro",
    "gemini-1.0-pro"
]

headers = {"Content-Type": "application/json"}
payload = {
    "contents": [{
        "parts": [{"text": "Hello"}]
    }]
}

print("Testing models...")
for model in MODELS:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}"
    try:
        response = requests.post(url, headers=headers, json=payload)
        print(f"[{model}] Status: {response.status_code}")
        if response.status_code == 200:
            print(f"SUCCESS with {model}!")
            break
    except Exception as e:
        print(f"[{model}] Error: {e}")
