import requests
import json
import sys

# Flush stdout to ensure we see output immediately
sys.stdout.reconfigure(encoding='utf-8')

API_KEY = "AIzaSyA2tUi8nmIuV0ySVg4lT7J4647omL6c-Cs"
# URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={API_KEY}"
# Use the exact URL we use in the app
URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={API_KEY}"

payload = {
    "contents": [{
        "parts": [{"text": "Hello"}]
    }]
}
headers = {"Content-Type": "application/json"}

print(f"--- START TEST ---")
try:
    response = requests.post(URL, headers=headers, json=payload)
    print(f"Status: {response.status_code}")
    print("Response Text:")
    print(response.text)
except Exception as e:
    print(f"EXCEPTION: {e}")
print(f"--- END TEST ---")
