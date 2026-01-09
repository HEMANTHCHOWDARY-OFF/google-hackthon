import requests
import json

API_KEY = "AIzaSyA2tUi8nmIuV0ySVg4lT7J4647omL6c-Cs"
URL = f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"

print(f"Auditing models for key ending in ...{API_KEY[-4:]}")

try:
    response = requests.get(URL)
    print(f"Status Code: {response.status_code}")
    
    with open("models_audit.json", "w") as f:
        f.write(response.text)
        
    if response.status_code == 200:
        data = response.json()
        model_names = [m.get('name') for m in data.get('models', [])]
        print("Found models:")
        for name in model_names:
            print(name)
    else:
        print("Error response saved to models_audit.json")

except Exception as e:
    print(f"Exception: {e}")
