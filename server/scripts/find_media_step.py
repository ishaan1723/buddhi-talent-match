import json
log_path = r"C:\Users\jaini\.gemini\antigravity\brain\52940010-b2ce-40c4-93c4-4b4e96f3fec5\.system_generated\logs\transcript.jsonl"
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        if "media__1783355576949" in line:
            print("Found match in line!")
            try:
                data = json.loads(line)
                print("Step:", data.get("step_index"))
                print("Content:", str(data.get("content"))[:500])
            except Exception as e:
                print("Error loading json:", e)
