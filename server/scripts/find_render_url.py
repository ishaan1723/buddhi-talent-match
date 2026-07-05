import requests
import re

url = "https://buddhi-talent-match.vercel.app/"
try:
    print("Fetching homepage...")
    r = requests.get(url)
    html = r.text
    
    # Find all JS scripts
    js_files = re.findall(r'src="(/_next/static/chunks/[^"]+\.js)"', html)
    js_files += re.findall(r'src="(/_next/static/[^"]+\.js)"', html)
    
    print(f"Found {len(js_files)} JS script references.")
    found = False
    for js in js_files:
        js_url = f"https://buddhi-talent-match.vercel.app{js}"
        js_r = requests.get(js_url)
        if "onrender.com" in js_r.text:
            urls = re.findall(r'https?://[a-zA-Z0-9.-]+\.onrender\.com', js_r.text)
            print("FOUND ONRENDER URLS:", urls)
            found = True
            break
            
    if not found:
        # Check standard config JS chunk if we can search for API_URL
        print("Searching raw html...")
        urls = re.findall(r'https?://[a-zA-Z0-9.-]+\.onrender\.com', html)
        if urls:
            print("FOUND ONRENDER URLS in HTML:", urls)
        else:
            print("No onrender.com references found.")
except Exception as e:
    print("Error:", e)
