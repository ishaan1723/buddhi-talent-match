import logging
from app.database.connection import get_db_cursor

logger = logging.getLogger(__name__)

# SQL statements to create tables if they do not exist
# Note: We store embeddings as double precision[] array to ensure compatibility 
# with any standard PostgreSQL database without requiring external extensions.
CREATE_TABLES_SQL = """
CREATE TABLE IF NOT EXISTS freelancers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    linkedin_url VARCHAR(255) NOT NULL,
    primary_skill VARCHAR(100) NOT NULL,
    experience INTEGER NOT NULL,
    hourly_rate NUMERIC(10, 2) NOT NULL,
    embedding double precision[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    budget NUMERIC(10, 2) NOT NULL,
    embedding double precision[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    freelancer_id INTEGER REFERENCES freelancers(id) ON DELETE CASCADE,
    match_score NUMERIC(5, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_job_freelancer UNIQUE (job_id, freelancer_id)
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    account_type VARCHAR(20) NOT NULL DEFAULT 'company',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

def initialize_tables():
    """Executes table creation SQL scripts on application startup."""
    try:
        with get_db_cursor() as cursor:
            cursor.execute(CREATE_TABLES_SQL)
        logger.info("Database schemas and tables checked/initialized successfully.")
    except Exception as e:
        logger.critical(f"Failed to initialize database tables: {e}")
        raise e
