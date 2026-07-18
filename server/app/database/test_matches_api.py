import sys
import os

sys.path.append(os.path.abspath(os.path.dirname(__file__) + '/../..'))

from app.routers.matches import get_job_approved_matches

def test_api():
    print("--- TESTING GET APPROVED MATCHES FOR JOB 22 ---")
    try:
        res = get_job_approved_matches(22)
        print("API Response items:", len(res))
        for item in res:
            print("Item:", item.model_dump())
    except Exception as e:
        print("Error calling get_job_approved_matches:", e)

if __name__ == "__main__":
    test_api()
