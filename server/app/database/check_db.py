import sys
import os

sys.path.append(os.path.abspath(os.path.dirname(__file__) + '/../..'))

from app.database.connection import get_db_cursor

def check_db():
    print("--- CHECKING DATABASE CONTENTS ---")
    try:
        with get_db_cursor() as cursor:
            # Check users
            cursor.execute("SELECT id, email, account_type FROM users;")
            print("Users:", cursor.fetchall())
            
            # Check jobs
            cursor.execute("SELECT id, title, posted_by, status FROM jobs;")
            print("Jobs:", cursor.fetchall())
            
            # Check freelancers
            cursor.execute("SELECT id, name, email FROM freelancers;")
            print("Freelancers:", cursor.fetchall())
            
            # Check matches
            cursor.execute("SELECT m.id, m.job_id, m.freelancer_id, m.match_score, m.status, j.posted_by, f.email FROM matches m JOIN jobs j ON m.job_id = j.id JOIN freelancers f ON m.freelancer_id = f.id;")
            print("Matches:", cursor.fetchall())
    except Exception as e:
        print("Error checking DB:", e)

if __name__ == "__main__":
    check_db()
