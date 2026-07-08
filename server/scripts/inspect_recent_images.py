import os
from PIL import Image

brain_dir = r"C:\Users\jaini\.gemini\antigravity\brain\52940010-b2ce-40c4-93c4-4b4e96f3fec5"

png_files = []
for file in os.listdir(brain_dir):
    if file.endswith(".png"):
        filepath = os.path.join(brain_dir, file)
        mtime = os.path.getmtime(filepath)
        png_files.append((file, mtime, filepath))

# Sort by modification time descending
png_files.sort(key=lambda x: x[1], reverse=True)

print("Recent PNG files:")
for name, mtime, path in png_files[:5]:
    try:
        img = Image.open(path)
        print(f" - {name} | Size: {img.size} | Time: {mtime}")
    except Exception as e:
        print(f" - {name} | Error: {e}")
