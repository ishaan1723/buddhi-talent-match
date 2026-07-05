import psycopg2
import sys

db_url = "postgresql://postgres.viycgkveyvpxfmmqikbg:buddhi-talent-match@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"

try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    print("Freelancers:")
    cursor.execute("SELECT id, name, created_at FROM freelancers;")
    for row in cursor.fetchall():
        print(row)
        
    print("\nJobs:")
    cursor.execute("SELECT id, title, created_at FROM jobs;")
    for row in cursor.fetchall():
        print(row)
        
    print("\nMatches:")
    cursor.execute("SELECT id, job_id, freelancer_id, created_at FROM matches;")
    for row in cursor.fetchall():
        print(row)
        
    cursor.close()
    conn.close()
except Exception as e:
    print("Error:", e, file=sys.stderr)
