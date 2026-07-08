import json

log_path = r"C:\Users\jaini\.gemini\antigravity\brain\52940010-b2ce-40c4-93c4-4b4e96f3fec5\.system_generated\logs\transcript.jsonl"

print("Searching for logo mentions in transcript.jsonl...")
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            content = data.get("content", "")
            if "Logo of AI Shop International" in content:
                print(f"Step {data.get('step_index')}: {content[:300]}")
                # Print neighboring fields or entire object if needed
                print(json.dumps(data, indent=2))
        except Exception as e:
            pass
