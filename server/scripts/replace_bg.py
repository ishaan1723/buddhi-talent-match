import os

target_dir = r"client/src"
old_color = "#f8fafc"
new_color = "#eef4ff"

for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith((".js", ".css")):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            if old_color in content:
                print(f"Replacing in: {filepath}")
                updated = content.replace(old_color, new_color)
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(updated)
print("Done replacing background colors!")
