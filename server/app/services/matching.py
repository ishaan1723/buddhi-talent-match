import logging
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from app.config import settings
from app.database.connection import get_db_cursor

logger = logging.getLogger(__name__)

def calculate_local_tfidf_similarity(text1: str, text2: str) -> float:
    """Calculates cosine similarity between two texts using a local TF-IDF model."""
    try:
        vectorizer = TfidfVectorizer()
        tfidf = vectorizer.fit_transform([text1, text2])
        sim = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        return float(sim)
    except Exception as e:
        logger.error(f"Error in TF-IDF calculation: {e}")
        return 0.0

def get_text_embedding(text: str) -> list:
    """
    Generates a vector embedding for a given text.
    Falls back to a dummy list if no keys are configured.
    """
    if settings.AI_PROVIDER == "openai" and settings.OPENAI_API_KEY:
        try:
            from langchain_openai import OpenAIEmbeddings
            embeddings = OpenAIEmbeddings(
                openai_api_key=settings.OPENAI_API_KEY,
                model="text-embedding-3-small"
            )
            return embeddings.embed_query(text)
        except Exception as e:
            logger.error(f"Failed to generate OpenAI embedding: {e}")
            
    elif settings.AI_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
        try:
            from langchain_google_genai import GoogleGenAIEmbeddings
            embeddings = GoogleGenAIEmbeddings(
                google_api_key=settings.GEMINI_API_KEY,
                model="models/text-embedding-004"
            )
            return embeddings.embed_query(text)
        except Exception as e:
            logger.error(f"Failed to generate Gemini embedding: {e}")
            
    # If no keys or errors occur, return a dummy vector (will use TF-IDF for scores)
    return [0.0] * 10 

def get_similarity(text1: str, text2: str) -> float:
    """Computes similarity using either vector embeddings (if configured) or local TF-IDF."""
    if not text1 or not text2 or not text1.strip() or not text2.strip():
        return 0.0
        
    emb1 = get_text_embedding(text1)
    emb2 = get_text_embedding(text2)
    
    # If valid embeddings generated (i.e. length is greater than dummy length of 10)
    if len(emb1) > 10 and len(emb2) > 10:
        try:
            v1 = np.array(emb1).reshape(1, -1)
            v2 = np.array(emb2).reshape(1, -1)
            return float(cosine_similarity(v1, v2)[0][0])
        except Exception as e:
            logger.error(f"Failed to calculate vector similarity: {e}")
            
    # Fallback to local TF-IDF (free, accurate, offline)
    return calculate_local_tfidf_similarity(text1, text2)

def calculate_match_score(
    job_text: str,
    job_budget: float,
    freelancer_rate: float,
    primary_skill: str,
    resume_text: str,
    kpi_achieved: str,
    proud_situation: str,
    kpi_expectations: str = None
) -> float:
    """
    Calculates the final composite match score (%) between a freelancer and a job post.
    Prioritizes KPI achievements (40%) and proud accomplishments (40%) over general keywords (20%).
    Matches freelancer's KPI directly against job's expected KPIs if defined.
    """
    # 1. Evaluate field availability and calculate sub-similarities
    kpi_sim = 0.0
    has_kpi = False
    if kpi_achieved and kpi_achieved.strip():
        # Compare achieved KPIs directly to job's KPI expectations if present, else fallback to full job details
        kpi_target = kpi_expectations if (kpi_expectations and kpi_expectations.strip()) else job_text
        kpi_sim = get_similarity(kpi_achieved, kpi_target)
        has_kpi = True
        
    proud_sim = 0.0
    has_proud = False
    if proud_situation and proud_situation.strip():
        proud_sim = get_similarity(proud_situation, job_text)
        has_proud = True
        
    general_text = f"{primary_skill or ''} {resume_text or ''}".strip()
    general_sim = 0.0
    has_general = False
    if general_text:
        general_sim = get_similarity(general_text, job_text)
        has_general = True
        
    # 2. Apply weighted matrix with dynamic fallback allocation
    if has_kpi and has_proud and has_general:
        # Full profile: 40% KPI, 40% Accomplishment, 20% General keywords
        semantic_score = (kpi_sim * 0.40) + (proud_sim * 0.40) + (general_sim * 0.20)
    elif has_kpi and has_general:
        # No proud situation: Split 70% KPI / 30% General
        semantic_score = (kpi_sim * 0.70) + (general_sim * 0.30)
    elif has_proud and has_general:
        # No KPI: Split 70% Accomplishment / 30% General
        semantic_score = (proud_sim * 0.70) + (general_sim * 0.30)
    elif has_kpi and has_proud:
        # No general keywords/resume: Split 50% KPI / 50% Accomplishment
        semantic_score = (kpi_sim * 0.50) + (proud_sim * 0.50)
    elif has_general:
        # Only general resume text: 100% General keywords
        semantic_score = general_sim
    elif has_kpi:
        semantic_score = kpi_sim
    elif has_proud:
        semantic_score = proud_sim
    else:
        semantic_score = 0.0

    # 3. Budget Alignment (20% of final score)
    if freelancer_rate <= job_budget:
        budget_score = 1.0
    else:
        budget_score = job_budget / freelancer_rate

    # Final Match: 80% Weighted Semantic Score + 20% Budget Score
    final_score = (semantic_score * 0.8) + (budget_score * 0.2)
    return round(final_score * 100, 2)

def run_match_for_job(job_id: int):
    """Matches a newly created job against all existing freelancers in the database."""
    try:
        with get_db_cursor() as cursor:
            # 1. Fetch Job Details (including kpi_expectations)
            cursor.execute("SELECT id, title, description, budget, kpi_expectations FROM jobs WHERE id = %s;", (job_id,))
            job = cursor.fetchone()
            if not job:
                return
            
            job_id, job_title, job_desc, job_budget, kpi_expectations = job
            job_text = f"{job_title} {job_desc}"
            
            # 2. Fetch all Freelancers
            cursor.execute("SELECT id, name, primary_skill, hourly_rate, resume_text, kpi_achieved, proud_situation FROM freelancers;")
            freelancers = cursor.fetchall()
            
            # 3. Calculate match score and insert/update matches table
            match_query = """
            INSERT INTO matches (job_id, freelancer_id, match_score, status)
            VALUES (%s, %s, %s, 'pending')
            ON CONFLICT (job_id, freelancer_id) 
            DO UPDATE SET match_score = EXCLUDED.match_score;
            """
            
            for f in freelancers:
                f_id, f_name, f_skill, f_rate, resume_text, kpi_achieved, proud_situation = f
                
                score = calculate_match_score(
                    job_text=job_text,
                    job_budget=float(job_budget),
                    freelancer_rate=float(f_rate),
                    primary_skill=f_skill,
                    resume_text=resume_text,
                    kpi_achieved=kpi_achieved,
                    proud_situation=proud_situation,
                    kpi_expectations=kpi_expectations
                )
                cursor.execute(match_query, (job_id, f_id, score))
                
        logger.info(f"Finished calculating KPI-weighted matches for Job ID: {job_id}")
    except Exception as e:
        logger.error(f"Error running match for job: {e}")

def run_match_for_freelancer(freelancer_id: int):
    """Matches a newly registered freelancer against all existing jobs in the database."""
    try:
        with get_db_cursor() as cursor:
            # 1. Fetch Freelancer Details
            cursor.execute("SELECT id, name, primary_skill, hourly_rate, resume_text, kpi_achieved, proud_situation FROM freelancers WHERE id = %s;", (freelancer_id,))
            freelancer = cursor.fetchone()
            if not freelancer:
                return
            
            f_id, f_name, f_skill, f_rate, resume_text, kpi_achieved, proud_situation = freelancer
            
            # 2. Fetch all Jobs (including kpi_expectations)
            cursor.execute("SELECT id, title, description, budget, kpi_expectations FROM jobs;")
            jobs = cursor.fetchall()
            
            # 3. Calculate match score and insert/update matches table
            match_query = """
            INSERT INTO matches (job_id, freelancer_id, match_score, status)
            VALUES (%s, %s, %s, 'pending')
            ON CONFLICT (job_id, freelancer_id) 
            DO UPDATE SET match_score = EXCLUDED.match_score;
            """
            
            for job in jobs:
                job_id, job_title, job_desc, job_budget, kpi_expectations = job
                job_text = f"{job_title} {job_desc}"
                
                score = calculate_match_score(
                    job_text=job_text,
                    job_budget=float(job_budget),
                    freelancer_rate=float(f_rate),
                    primary_skill=f_skill,
                    resume_text=resume_text,
                    kpi_achieved=kpi_achieved,
                    proud_situation=proud_situation,
                    kpi_expectations=kpi_expectations
                )
                cursor.execute(match_query, (job_id, f_id, score))
                
        logger.info(f"Finished calculating KPI-weighted matches for Freelancer ID: {freelancer_id}")
    except Exception as e:
        logger.error(f"Error running match for freelancer: {e}")
