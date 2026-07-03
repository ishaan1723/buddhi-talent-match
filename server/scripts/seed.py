import os
import sys

# Add the server directory to python path to allow absolute imports of app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import psycopg2
from app.database.connection import get_db_cursor, init_db_pool, close_db_pool

# Mock Freelancer Data
MOCK_FREELANCERS = [
    ("Rohan Mehta", "rohan.mehta@example.com", "https://www.linkedin.com/in/rohan-mehta-ai", "LLM Integrations", 3, 45.00),
    ("Priya Sharma", "priya.sharma@example.com", "https://www.linkedin.com/in/priya-cv", "Computer Vision", 4, 60.00),
    ("Aarav Patel", "aarav.patel@example.com", "https://www.linkedin.com/in/aarav-langchain", "LangChain & Agents", 2, 40.00),
    ("Sneha Reddy", "sneha.reddy@example.com", "https://www.linkedin.com/in/sneha-ds", "Data Science & NLP", 5, 75.00),
    ("Vikram Singh", "vikram.singh@example.com", "https://www.linkedin.com/in/vikram-llm", "LLM Finetuning", 3, 55.00)
]

# Mock Job Data
MOCK_JOBS = [
    (
        "Need Python Dev to build an AI chatbot",
        "We are looking for a developer to build a smart customer support chatbot. The chatbot needs to read our internal PDF files and answer user queries. Experience with LangChain, Python, and OpenAI API is highly preferred.",
        50.00
    ),
    (
        "Computer Vision Expert for Image Segmentation",
        "Looking for an ML engineer to build an image classification and object detection pipeline for manufacturing defect detection. Must be highly skilled in PyTorch, OpenCV, and convolutional neural networks.",
        70.00
    ),
    (
        "NLP Engineer for Text Summarization",
        "We need a backend developer to build a text processing service. The goal is to summarize financial news articles daily. Experience with Hugging Face transformers, BERT models, and FastAPI is required.",
        55.00
    )
]

def seed_database():
    print("Initializing connection pool...")
    init_db_pool()
    
    try:
        with get_db_cursor() as cursor:
            # Clear old mock data to avoid unique violations and keep clean state
            print("Clearing existing data...")
            cursor.execute("TRUNCATE matches, freelancers, jobs RESTART IDENTITY CASCADE;")
            
            # Insert Freelancers
            print("Inserting mock freelancers...")
            freelancer_query = """
            INSERT INTO freelancers (name, email, linkedin_url, primary_skill, experience, hourly_rate)
            VALUES (%s, %s, %s, %s, %s, %s);
            """
            for freelancer in MOCK_FREELANCERS:
                cursor.execute(freelancer_query, freelancer)
                print(f"Inserted Freelancer: {freelancer[0]}")
                
            # Insert Jobs
            print("Inserting mock jobs...")
            job_query = """
            INSERT INTO jobs (title, description, budget)
            VALUES (%s, %s, %s);
            """
            for job in MOCK_JOBS:
                cursor.execute(job_query, job)
                print(f"Inserted Job: {job[0]}")
                
            print("Database seeding completed successfully!")
            
    except Exception as e:
        print(f"Seeding failed: {e}")
    finally:
        close_db_pool()

if __name__ == "__main__":
    seed_database()
