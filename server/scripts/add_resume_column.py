import psycopg2

db_url = "postgresql://postgres.viycgkveyvpxfmmqikbg:buddhi-talent-match@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"

try:
    print("Connecting to database to execute schema migration...")
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    # Add resume_text column to freelancers table if it doesn't exist
    print("Adding resume_text column...")
    cursor.execute("ALTER TABLE freelancers ADD COLUMN IF NOT EXISTS resume_text TEXT;")
    conn.commit()
    print("Schema updated successfully!")
    
    cursor.close()
    conn.close()
except Exception as e:
    print("Failed to run schema migration:", e)
