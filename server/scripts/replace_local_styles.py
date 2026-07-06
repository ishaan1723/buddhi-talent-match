import os

target_dir = r"client/src"

replacements = {
    "background-color: #cbdfff;": "background-color: var(--bg-light);",
    "background-color: #cbdfff !important;": "background-color: var(--bg-light) !important;",
    "background-color: #ffffff;": "background-color: var(--bg-white);",
    "background-color: #ffffff !important;": "background-color: var(--bg-white) !important;",
    "background: #ffffff;": "background: var(--bg-white);",
    "background: #ffffff !important;": "background: var(--bg-white) !important;",
    "color: #101828;": "color: var(--text-dark);",
    "color: #101828 !important;": "color: var(--text-dark) !important;",
    "color: #222325;": "color: var(--text-dark);",
    "color: #222325 !important;": "color: var(--text-dark) !important;",
    "color: #64748b;": "color: var(--text-muted);",
    "color: #64748b !important;": "color: var(--text-muted) !important;",
    "color: #62646a;": "color: var(--text-muted);",
    "color: #62646a !important;": "color: var(--text-muted) !important;",
    "border: 1px solid #e2e8f0;": "border: 1px solid var(--border-color);",
    "border: 1px solid #e2e8f0 !important;": "border: 1px solid var(--border-color) !important;",
    "border-bottom: 1px solid #e2e8f0;": "border-bottom: 1px solid var(--border-color);",
    "border-right: 1px solid #e2e8f0;": "border-right: 1px solid var(--border-color);"
}

for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith((".js", ".css")):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            modified = False
            for old, new in replacements.items():
                if old in content:
                    content = content.replace(old, new)
                    modified = True
            
            if modified:
                print(f"Updated styles in: {filepath}")
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)

print("Done converting local page styles to CSS variables!")
