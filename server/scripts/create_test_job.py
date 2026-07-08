import psycopg2

db_url = "postgresql://postgres.viycgkveyvpxfmmqikbg:buddhi-talent-match@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"

try:
    print("Connecting to database to insert test job...")
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    # Check if a matching job already exists, if not, insert it
    check_query = "SELECT id FROM jobs WHERE title = %s;"
    cursor.execute(check_query, ("Computer Vision & PyTorch Expert",))
    job = cursor.fetchone()
    
    if not job:
        insert_query = """
        INSERT INTO jobs (title, description, budget)
        VALUES (%s, %s, %s)
        RETURNING id;
        """
        cursor.execute(insert_query, (
            "Computer Vision & PyTorch Expert",
            "We are seeking a senior developer with experience in convolutional neural networks, OpenCV, PyTorch, and image segmentation models to build defect detection pipelines.",
            4000.0
        ))
        job_id = cursor.fetchone()[0]
        conn.commit()
        print(f"Test job created successfully with ID: {job_id}")
        
        # Trigger matching engine to run matches for this new job
        from app.services.matching import run_match_for_job
        # Since matching requires the cursor, let's call it
        print("Recalculating matches for this new job...")
        run_match_for_job(job_id)
        print("Matching complete!")
    else:
        print("Test job already exists in the database.")
        
    cursor.close()
    conn.close()
except Exception as e:
    print("Error inserting test job:", e)
