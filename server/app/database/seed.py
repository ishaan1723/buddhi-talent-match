import sys
import os

# Adjust path to import app packages
sys.path.append(os.path.abspath(os.path.dirname(__file__) + '/../..'))

from app.database.connection import get_db_cursor
from app.services.matching import run_match_for_job

def seed_database():
    print("--- STARTING DATABASE SEEDING ---")
    
    # 1. Clean existing matches, jobs, and freelancers to ensure clean demo environment
    try:
        with get_db_cursor() as cursor:
            print("Cleaning old matches, jobs, and freelancers data...")
            cursor.execute("DELETE FROM matches;")
            cursor.execute("DELETE FROM jobs;")
            cursor.execute("DELETE FROM freelancers;")
            
            # 2. Insert high-fidelity Jobs
            print("Seeding new AI job requirements...")
            jobs_to_insert = [
                (
                    "Senior RAG Engineer (LangChain / LlamaIndex)",
                    "We are seeking an expert to construct a scalable retrieval-augmented generation pipeline. The candidate will work on document parsing, sentence window retrieval, and integrating metadata filters. The ideal developer has experience with vector databases and prompt engineering.",
                    3500.0,
                    "Reduce query latency of internal document searches by 40% and build automated chunking parser.",
                    "recruiter@buddhi.com"
                ),
                (
                    "Computer Vision Expert for Image Segmentation",
                    "We need an ML engineer to build a neural network pipeline for quality assurance defect classification. You will design, train, and deploy deep learning models to categorize defects in factory manufacturing lines.",
                    6000.0,
                    "Achieve defect detection classification accuracy >98% and run inference under 40ms.",
                    "recruiter@buddhi.com"
                ),
                (
                    "NLP Researcher for Text Summarization",
                    "Looking for a backend NLP specialist to build a microservice summarizing complex financial and news documents daily. Experience with Hugging Face transformers, fine-tuning BERT models, and deploying async FastAPI tasks is required.",
                    4500.0,
                    "Build text summarization microservice handling 100,000+ daily documents with average API latency <100ms.",
                    "recruiter@buddhi.com"
                ),
                (
                    "MLOps Platform Engineer (Kubernetes)",
                    "We are migrating our machine learning research training jobs to a distributed GPU cluster environment. Seeking an MLOps engineer experienced in Docker container orchestration, Kubeflow workflows, and auto-scaling compute pools.",
                    5000.0,
                    "Migrate PyTorch training pipelines to Kubernetes, reducing cluster idle computation time by 30%.",
                    "recruiter@buddhi.com"
                )
            ]
            
            inserted_job_ids = []
            for job in jobs_to_insert:
                cursor.execute("""
                    INSERT INTO jobs (title, description, budget, kpi_expectations, posted_by)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id;
                """, job)
                inserted_job_ids.append(cursor.fetchone()[0])
            
            # 3. Insert high-fidelity Freelancers
            print("Seeding elite AI freelancers...")
            freelancers_to_insert = [
                (
                    "Ishaan Jain",
                    "freelancer@buddhi.com",
                    "https://linkedin.com/in/ishaan-jain-ai",
                    "LLM Orchestration (LangChain / LlamaIndex)",
                    4,
                    2800.0,
                    "Experienced ML engineer specialized in vector embeddings, index clustering, prompt engineering, and RAG architectures.",
                    "Reduced vector index query latency by 45% and scaled RAG pipelines for enterprise document searches.",
                    "Built a document ingestion pipeline handling 50k concurrent document uploads without backend crashes."
                ),
                (
                    "Siddharth Mehta",
                    "sid@example.com",
                    "https://linkedin.com/in/sid-mehta-cv",
                    "Computer Vision & Deep Learning (PyTorch)",
                    5,
                    3200.0,
                    "CV engineer developing object detection, image segmentation, and deep neural network pipelines. Skilled in GPU model optimization.",
                    "Achieved 98.4% accuracy on production image defect detection and reduced inference times to 32ms.",
                    "Redesigned CV model inference pipeline using TensorRT, saving $12,000/month in AWS cloud GPU costs."
                ),
                (
                    "Aishwarya Roy",
                    "aishwarya@example.com",
                    "https://linkedin.com/in/aishwarya-nlp",
                    "Natural Language Processing (Transformers)",
                    3,
                    2500.0,
                    "NLP developer fine-tuning Hugging Face transformer classification models, text summarizers, and text extraction parsers.",
                    "Built text summarizer API handling 120,000 daily news articles with latency under 80ms.",
                    "Optimized Hugging Face pipeline transformer runtime, reducing CPU memory overhead by 50%."
                ),
                (
                    "Marcus Vance",
                    "marcus@example.com",
                    "https://linkedin.com/in/marcus-mlops",
                    "MLOps & Cluster Orchestration (Kubeflow / K8s)",
                    6,
                    4800.0,
                    "Platform engineer building and scaling model training infrastructure. Expert in CI/CD, dockerization, and GPU container pools.",
                    "Set up auto-scaling GPU cluster pools on AWS, saving 35% on idle computation resources.",
                    "Migrated legacy bare-metal model training setup to Kubeflow with zero downtime for active research teams."
                ),
                (
                    "Elena Rostova",
                    "elena@example.com",
                    "https://linkedin.com/in/elena-backend",
                    "Backend ML APIs (FastAPI / PostgreSQL)",
                    5,
                    2100.0,
                    "Backend engineer building fast API endpoints for machine learning microservices. Specialized in SQL query optimizations.",
                    "Migrated heavy SQL queries to Redis cache, reducing endpoint response times from 1.2s to 45ms.",
                    "Rescued database after connection pool deadlock crashed dashboard, restoring full operations in under 5 minutes."
                )
            ]
            
            for f in freelancers_to_insert:
                cursor.execute("""
                    INSERT INTO freelancers (name, email, linkedin_url, primary_skill, experience, hourly_rate, resume_text, kpi_achieved, proud_situation)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
                """, f)
                
            print("Successfully inserted jobs and freelancers into Supabase.")
            
            # 4. Trigger the matching engine for each inserted job to populate the matches table
            print("Running AI semantic matcher for all jobs...")
            for job_id in inserted_job_ids:
                run_match_for_job(job_id)
                
            # 5. Pre-approve one match to demonstrate the approved hires dashboard view
            # Let's approve freelancer 1 (Ishaan Jain) for job 1 (Senior RAG Engineer)
            print("Pre-approving sample match for recruiter portal demo...")
            cursor.execute("""
                UPDATE matches 
                SET status = 'approved'
                WHERE job_id = %s 
                  AND freelancer_id = (SELECT id FROM freelancers WHERE email = 'freelancer@buddhi.com');
            """, (inserted_job_ids[0],))
            
            print("--- DATABASE SEEDING COMPLETED SUCCESSFULLY ---")
            
    except Exception as e:
        print(f"Error seeding database: {e}")

if __name__ == "__main__":
    seed_database()
