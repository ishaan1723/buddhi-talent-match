import sys
import os

# Adjust path to import app packages
sys.path.append(os.path.abspath(os.path.dirname(__file__) + '/../..'))

from app.database.connection import get_db_cursor
from app.auth.security import hash_password
from app.services.matching import calculate_match_score

def create_test_accounts():
    print("--- CREATING TEST USER ACCOUNTS ---")
    
    company_email = "jainishaan1723@gmail.com"
    company_pass = "123456789"
    
    freelancer_email = "17ishaanjain@gmail.com"
    freelancer_pass = "12345678"
    
    try:
        with get_db_cursor() as cursor:
            # 1. Clean existing test data for these specific emails
            print("Cleaning any existing test entries for these emails...")
            cursor.execute("DELETE FROM matches WHERE job_id IN (SELECT id FROM jobs WHERE posted_by = %s);", (company_email,))
            cursor.execute("DELETE FROM matches WHERE freelancer_id IN (SELECT id FROM freelancers WHERE email = %s);", (freelancer_email,))
            cursor.execute("DELETE FROM jobs WHERE posted_by = %s;", (company_email,))
            cursor.execute("DELETE FROM freelancers WHERE email = %s;", (freelancer_email,))
            cursor.execute("DELETE FROM users WHERE email IN (%s, %s);", (company_email, freelancer_email))
            
            # 2. Insert Company User
            print(f"Creating Company user: {company_email}...")
            comp_hash = hash_password(company_pass)
            cursor.execute("""
                INSERT INTO users (full_name, email, password_hash, account_type)
                VALUES (%s, %s, %s, 'company')
                RETURNING id;
            """, ("Ishaan Jain (Company)", company_email, comp_hash))
            company_user_id = cursor.fetchone()[0]
            
            # 3. Insert Freelancer User
            print(f"Creating Freelancer user: {freelancer_email}...")
            free_hash = hash_password(freelancer_pass)
            cursor.execute("""
                INSERT INTO users (full_name, email, password_hash, account_type)
                VALUES (%s, %s, %s, 'freelancer')
                RETURNING id;
            """, ("Ishaan Jain (Developer)", freelancer_email, free_hash))
            freelancer_user_id = cursor.fetchone()[0]
            
            # 4. Insert Job requirement posted by Company
            print("Creating Job requirement posted by company...")
            job_title = "Lead AI RAG Specialist (LangChain / Hybrid Search)"
            job_desc = "We are seeking a developer to construct a retrieval-augmented generation pipeline. The candidate will work on optimizing vector query latency, metadata filtering, and sentence window chunking. Python expertise is required."
            job_budget = 3800.0
            job_kpis = "Reduce search query response times by 40% and build automated sentence window parsing."
            
            cursor.execute("""
                INSERT INTO jobs (title, description, budget, kpi_expectations, posted_by, duration, deadline, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, 'open')
                RETURNING id;
            """, (job_title, job_desc, job_budget, job_kpis, company_email, "3 Months", "July 31, 2026"))
            job_id = cursor.fetchone()[0]
            
            # 5. Insert Freelancer Profile details
            print("Creating Freelancer profile...")
            f_name = "Ishaan Jain"
            f_skill = "Python, LangChain, Vector Indexes, Hybrid Search, LlamaIndex"
            f_rate = 3200.0
            f_resume = "Experienced ML engineer building high-performance search indexes, semantic chunking retrievals, and RAG architectures."
            f_kpi_achieved = "Reduced vector index search query latency by 45% using hybrid retrievals and sentence clustering."
            f_proud = "Built a RAG chatbot serving 50k concurrent requests with zero query latency lag."
            f_headline = "Lead AI & RAG Engineer"
            f_portfolio = "https://github.com/ishaan-ai-projects"
            
            cursor.execute("""
                INSERT INTO freelancers (name, email, linkedin_url, primary_skill, experience, hourly_rate, resume_text, kpi_achieved, proud_situation, headline, portfolio_url, rating)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 5.0)
                RETURNING id;
            """, (f_name, freelancer_email, "https://linkedin.com/in/ishaan-jain-ai", f_skill, 5, f_rate, f_resume, f_kpi_achieved, f_proud, f_headline, f_portfolio))
            freelancer_id = cursor.fetchone()[0]
            
            # 6. Calculate Match & Insert pre-approved matches row (with customized demo matching score)
            print("Computing compatibility score & AI reasoning...")
            score, reasoning = calculate_match_score(
                job_text=f"{job_title} {job_desc}",
                job_budget=job_budget,
                freelancer_rate=f_rate,
                primary_skill=f_skill,
                resume_text=f_resume,
                kpi_achieved=f_kpi_achieved,
                proud_situation=f_proud,
                experience=5,
                kpi_expectations=job_kpis
            )
            
            # Override semantic score for high-fidelity demo representation
            demo_score = 96.5
            demo_reasoning = "Strong past KPI alignment with target requirements. Excellent situational problem-solving track record. Requested hourly rate fits within job budget constraints. Provides solid industry experience (5 years)."
            print(f"Match computed: {score}% -> Overridden to: {demo_score}%")
            
            cursor.execute("""
                INSERT INTO matches (job_id, freelancer_id, match_score, ai_reasoning, status)
                VALUES (%s, %s, %s, %s, 'approved');
            """, (job_id, freelancer_id, demo_score, demo_reasoning))
            
            print("--- SEEDING OF SPECIFIC TEST ACCOUNTS COMPLETED SUCCESSFULLY ---")
            
    except Exception as e:
        print(f"Error seeding test accounts: {e}")

if __name__ == "__main__":
    create_test_accounts()
