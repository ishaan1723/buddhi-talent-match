import os
import sys

# Force the database URL environment variable so Pydantic settings loads it
os.environ["DATABASE_URL"] = "postgresql://postgres.viycgkveyvpxfmmqikbg:buddhi-talent-match@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"

# Add the server directory to python path to allow absolute imports of app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database.connection import init_db_pool, close_db_pool
from app.services.matching import run_match_for_freelancer

if __name__ == "__main__":
    init_db_pool()
    try:
        print("Running matching engine for Freelancer ID: 1...")
        run_match_for_freelancer(1)
        print("Done!")
    except Exception as e:
        print("Execution failed:", e)
    finally:
        close_db_pool()
