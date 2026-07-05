import psycopg2
import sys

db_url = "postgresql://postgres.viycgkveyvpxfmmqikbg:buddhi-talent-match@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"

try:
    print("Connecting to Supabase PostgreSQL database...")
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    print("\n--- Freelancers ---")
    cursor.execute("SELECT id, name, email, primary_skill, hourly_rate FROM freelancers ORDER BY id DESC LIMIT 5;")
    for row in cursor.fetchall():
        print(row)
        
    print("\n--- Jobs ---")
    cursor.execute("SELECT id, title, budget FROM jobs ORDER BY id DESC LIMIT 5;")
    for row in cursor.fetchall():
        print(row)
        
    print("\n--- Matches ---")
    cursor.execute("SELECT id, job_id, freelancer_id, match_score, status FROM matches ORDER BY id DESC LIMIT 5;")
    for row in cursor.fetchall():
        print(row)
        
    cursor.close()
    conn.close()
    print("\nConnection closed successfully.")
except Exception as e:
    print("Database connection error:", e, file=sys.stderr)
