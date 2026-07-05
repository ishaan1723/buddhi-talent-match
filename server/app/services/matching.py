import logging
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from app.config import settings
from app.database.connection import get_db_cursor

logger = logging.getLogger(__name__)

# Fallback TF-IDF Matcher when no API keys are provided
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

def calculate_match_score(freelancer_text: str, job_text: str, freelancer_rate: float, job_budget: float) -> float:
    """
    Calculates the final match score (%) between a freelancer and a job.
    Includes semantic similarity AND budget alignment.
    """
    # 1. Semantic/Text Similarity (80% weight)
    # If embedding keys are available, we could do cosine similarity of embeddings.
    # Otherwise, we use our local TF-IDF matcher (highly reliable offline).
    text_sim = calculate_local_tfidf_similarity(freelancer_text, job_text)
    
    # 2. Budget Alignment (20% weight)
    # If freelancer is cheaper than or equal to budget, 100% budget score.
    # If freelancer is more expensive, reduce budget score proportionally.
    if freelancer_rate <= job_budget:
        budget_score = 1.0
    else:
        # e.g., if budget is 50 and rate is 100, budget score is 50/100 = 50%
        budget_score = job_budget / freelancer_rate
        
    final_score = (text_sim * 0.8) + (budget_score * 0.2)
    return round(final_score * 100, 2)

def run_match_for_job(job_id: int):
    """Matches a newly created job against all existing freelancers in the database."""
    try:
        with get_db_cursor() as cursor:
            # 1. Fetch Job Details
            cursor.execute("SELECT id, title, description, budget FROM jobs WHERE id = %s;", (job_id,))
            job = cursor.fetchone()
            if not job:
                return
            
            job_id, job_title, job_desc, job_budget = job
            job_text = f"{job_title} {job_desc}"
            
            # 2. Fetch all Freelancers
            cursor.execute("SELECT id, name, primary_skill, hourly_rate FROM freelancers;")
            freelancers = cursor.fetchall()
            
            # 3. Calculate match score and insert/update matches table
            match_query = """
            INSERT INTO matches (job_id, freelancer_id, match_score, status)
            VALUES (%s, %s, %s, 'pending')
            ON CONFLICT (job_id, freelancer_id) 
            DO UPDATE SET match_score = EXCLUDED.match_score;
            """
            
            for f in freelancers:
                f_id, f_name, f_skill, f_rate = f
                f_text = f"{f_name} expert in {f_skill}"
                
                score = calculate_match_score(f_text, job_text, float(f_rate), float(job_budget))
                cursor.execute(match_query, (job_id, f_id, score))
                
        logger.info(f"Finished calculating matches for Job ID: {job_id}")
    except Exception as e:
        logger.error(f"Error running match for job: {e}")

def run_match_for_freelancer(freelancer_id: int):
    """Matches a newly registered freelancer against all existing jobs in the database."""
    try:
        with get_db_cursor() as cursor:
            # 1. Fetch Freelancer Details
            cursor.execute("SELECT id, name, primary_skill, hourly_rate FROM freelancers WHERE id = %s;", (freelancer_id,))
            freelancer = cursor.fetchone()
            if not freelancer:
                return
            
            f_id, f_name, f_skill, f_rate = freelancer
            f_text = f"{f_name} expert in {f_skill}"
            
            # 2. Fetch all Jobs
            cursor.execute("SELECT id, title, description, budget FROM jobs;")
            jobs = cursor.fetchall()
            
            # 3. Calculate match score and insert/update matches table
            match_query = """
            INSERT INTO matches (job_id, freelancer_id, match_score, status)
            VALUES (%s, %s, %s, 'pending')
            ON CONFLICT (job_id, freelancer_id) 
            DO UPDATE SET match_score = EXCLUDED.match_score;
            """
            
            for job in jobs:
                job_id, job_title, job_desc, job_budget = job
                job_text = f"{job_title} {job_desc}"
                
                score = calculate_match_score(f_text, job_text, float(f_rate), float(job_budget))
                cursor.execute(match_query, (job_id, f_id, score))
                
        logger.info(f"Finished calculating matches for Freelancer ID: {freelancer_id}")
    except Exception as e:
        logger.error(f"Error running match for freelancer: {e}")
