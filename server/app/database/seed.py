import sys
import os

# Adjust path to import app packages
sys.path.append(os.path.abspath(os.path.dirname(__file__) + '/../..'))

from app.database.connection import get_db_cursor
from app.services.matching import run_match_for_job

def seed_database():
    print("--- STARTING DATABASE SEEDING ---")
    
    # 1. Apply schema migrations in an isolated transaction block
    print("Step 1: Applying database schema migrations...")
    try:
        with get_db_cursor() as cursor:
            # Set short lock timeout so we don't hang if there are table locks
            cursor.execute("SET lock_timeout = '8s';")
            cursor.execute("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS duration VARCHAR(100);")
            cursor.execute("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS deadline VARCHAR(100);")
            cursor.execute("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'open';")
            cursor.execute("ALTER TABLE freelancers ADD COLUMN IF NOT EXISTS headline VARCHAR(150);")
            cursor.execute("ALTER TABLE freelancers ADD COLUMN IF NOT EXISTS portfolio_url VARCHAR(255);")
            cursor.execute("ALTER TABLE freelancers ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2) DEFAULT 5.0;")
            cursor.execute("ALTER TABLE matches ADD COLUMN IF NOT EXISTS ai_reasoning TEXT;")
        print("Migrations checked and applied successfully.")
    except Exception as e:
        print(f"Non-fatal migration check warning: {e}. Moving on to seeding data.")

    # 2. Seed Jobs, Freelancers, and Matches in a separate transaction block
    print("Step 2: Inserting data and calculating matches...")
    try:
        with get_db_cursor() as cursor:
            # Clean old data
            print("Cleaning old matches, jobs, and freelancers data...")
            cursor.execute("DELETE FROM matches;")
            cursor.execute("DELETE FROM jobs;")
            cursor.execute("DELETE FROM freelancers;")
            
            # Insert high-fidelity Jobs
            print("Seeding new AI job requirements...")
            jobs_to_insert = [
                (
                    "Senior RAG Engineer (LangChain / LlamaIndex)",
                    "We are seeking an expert to construct a scalable retrieval-augmented generation pipeline. The candidate will work on document parsing, sentence window retrieval, and integrating metadata filters. The ideal developer has experience with vector databases and prompt engineering.",
                    3500.0,
                    "Reduce query latency of internal document searches by 40% and build automated chunking parser.",
                    "recruiter@buddhi.com",
                    "3 Months",
                    "July 30, 2026",
                    "open"
                ),
                (
                    "Computer Vision Expert for Image Segmentation",
                    "We need an ML engineer to build a neural network pipeline for quality assurance defect classification. You will design, train, and deploy deep learning models to categorize defects in factory manufacturing lines.",
                    6000.0,
                    "Achieve defect detection classification accuracy >98% and run inference under 40ms.",
                    "recruiter@buddhi.com",
                    "6 Months",
                    "Immediate",
                    "open"
                ),
                (
                    "NLP Researcher for Text Summarization",
                    "Looking for a backend NLP specialist to build a microservice summarizing complex financial and news documents daily. Experience with Hugging Face transformers, fine-tuning BERT models, and deploying async FastAPI tasks is required.",
                    4500.0,
                    "Build text summarization microservice handling 100,000+ daily documents with average API latency <100ms.",
                    "recruiter@buddhi.com",
                    "2 Months",
                    "Expired",
                    "closed"
                )
            ]
            
            inserted_job_ids = []
            for job in jobs_to_insert:
                cursor.execute("""
                    INSERT INTO jobs (title, description, budget, kpi_expectations, posted_by, duration, deadline, status)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id;
                """, job)
                inserted_job_ids.append(cursor.fetchone()[0])
            
            # Insert high-fidelity Freelancers
            print("Seeding elite AI freelancers...")
            freelancers_to_insert = [
                (
                    "Ishaan Jain",
                    "freelancer@buddhi.com",
                    "https://linkedin.com/in/ishaan-jain-ai",
                    "LLM Orchestration, LangChain, LlamaIndex, Vector Database Indexing",
                    4,
                    2800.0,
                    "Experienced ML engineer specialized in vector embeddings, index clustering, prompt engineering, and RAG architectures.",
                    "Reduced vector index query latency by 45% and scaled RAG pipelines for enterprise document searches.",
                    "Built a document ingestion pipeline handling 50k concurrent document uploads without backend crashes.",
                    "Senior AI Engineer & RAG Specialist",
                    "https://github.com/ishaan-ai-developer",
                    5.0
                ),
                (
                    "Siddharth Mehta",
                    "sid@example.com",
                    "https://linkedin.com/in/sid-mehta-cv",
                    "Computer Vision, PyTorch, OpenCV, TensorRT",
                    5,
                    3200.0,
                    "CV engineer developing object detection, image segmentation, and deep neural network pipelines. Skilled in GPU model optimization.",
                    "Achieved 98.4% accuracy on production image defect detection and reduced inference times to 32ms.",
                    "Redesigned CV model inference pipeline using TensorRT, saving $12,000/month in AWS cloud GPU costs.",
                    "Computer Vision & Deep Learning Engineer",
                    "https://github.com/sid-cv-projects",
                    4.9
                ),
                (
                    "Aishwarya Roy",
                    "aishwarya@example.com",
                    "https://linkedin.com/in/aishwarya-nlp",
                    "Hugging Face, BERT, Transformers, LLM fine-tuning",
                    3,
                    2500.0,
                    "NLP developer fine-tuning Hugging Face transformer classification models, text summarizers, and text extraction parsers.",
                    "Built text summarizer API handling 120,000 daily news articles with latency under 80ms.",
                    "Optimized Hugging Face pipeline transformer runtime, reducing CPU memory overhead by 50%.",
                    "NLP Developer & LLM Engineer",
                    "https://github.com/aishwarya-nlp",
                    4.8
                )
            ]
            
            for f in freelancers_to_insert:
                cursor.execute("""
                    INSERT INTO freelancers (name, email, linkedin_url, primary_skill, experience, hourly_rate, resume_text, kpi_achieved, proud_situation, headline, portfolio_url, rating)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
                """, f)
                
            print("Successfully inserted jobs and freelancers into Supabase.")
            
            # Trigger the matching engine for each inserted job to populate the matches table
            print("Running AI semantic matcher for all jobs...")
            for job_id in inserted_job_ids:
                run_match_for_job(job_id)
                
            # Pre-approve sample matches
            print("Pre-approving sample matches for company dashboard view...")
            cursor.execute("""
                UPDATE matches 
                SET status = 'approved'
                WHERE job_id = %s 
                  AND freelancer_id IN (
                      SELECT id FROM freelancers 
                      WHERE email IN ('freelancer@buddhi.com', 'aishwarya@example.com')
                  );
            """, (inserted_job_ids[0],))
            
            cursor.execute("""
                UPDATE matches 
                SET status = 'approved'
                WHERE job_id = %s 
                  AND freelancer_id = (SELECT id FROM freelancers WHERE email = 'aishwarya@example.com');
            """, (inserted_job_ids[2],))
            
            print("--- DATABASE SEEDING COMPLETED SUCCESSFULLY ---")
            
    except Exception as e:
        print(f"Error seeding database data: {e}")

if __name__ == "__main__":
    seed_database()
