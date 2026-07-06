import os

target_dir = r"client/src/pages"

replacements = {
    # Navbar dark tech glassmorphism replacements
    "background-color: var(--bg-white);": "background-color: var(--bg-light) !important;",
    "background: rgba(255, 255, 255, 0.85);": "background: rgba(5, 8, 17, 0.85) !important;",
    "background-color: #ffffff;": "background-color: var(--bg-light) !important;",
    "background: #ffffff;": "background: var(--bg-light) !important;",
    
    # Text dark tech contrast adjustments
    "color: var(--text-dark);": "color: var(--text-dark) !important;",
    "color: #101828;": "color: var(--text-dark) !important;",
    
    # CTA Secondary Button fixes (Ghost Button style on dark backgrounds)
    ".btn-secondary {\n          background-color: var(--bg-white);\n          color: var(--text-dark);\n          border: 1px solid var(--border-color);\n        }": 
    ".btn-secondary {\n          background-color: rgba(255, 255, 255, 0.05) !important;\n          color: #ffffff !important;\n          border: 1px solid rgba(255, 255, 255, 0.2) !important;\n          backdrop-filter: blur(8px);\n        }\n        .btn-secondary:hover {\n          background-color: #ffffff !important;\n          color: #050811 !important;\n          border-color: #ffffff !important;\n          box-shadow: 0 0 20px rgba(255, 255, 255, 0.2) !important;\n        }",
    
    # Logo brightness filter to render white logo text on dark navbar
    ".logo-img {\n          height: 40px;\n          width: auto;\n          display: block;\n          object-fit: contain;\n        }":
    ".logo-img {\n          height: 40px;\n          width: auto;\n          display: block;\n          object-fit: contain;\n          filter: brightness(0) invert(1);\n        }",
    
    ".logo-img {\n          height: 42px;\n          width: auto;\n          display: block;\n          object-fit: contain;\n        }":
    ".logo-img {\n          height: 42px;\n          width: auto;\n          display: block;\n          object-fit: contain;\n          filter: brightness(0) invert(1);\n        }",

    ".logo-img-small {\n          height: 26px;\n          width: auto;\n          display: block;\n          object-fit: contain;\n        }":
    ".logo-img-small {\n          height: 26px;\n          width: auto;\n          display: block;\n          object-fit: contain;\n          filter: brightness(0) invert(1);\n        }"
}

for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith(".js"):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Change home container background to bg-light instead of bg-white
            if file == "index.js":
                content = content.replace("background-color: var(--bg-white);", "background-color: var(--bg-light) !important;")
            
            modified = False
            for old, new in replacements.items():
                if old in content:
                    content = content.replace(old, new)
                    modified = True
            
            if modified:
                print(f"Facelifted styles in: {filepath}")
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)

print("Done applying Dark Tech layout styling!")
