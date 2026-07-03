import logging
from contextlib import contextmanager
import psycopg2
from psycopg2.pool import ThreadedConnectionPool
from app.config import settings

logger = logging.getLogger(__name__)

# Global connection pool placeholder
_pool = None

def init_db_pool():
    global _pool
    if _pool is not None:
        return
    
    try:
        # Initialize Threaded Connection Pool (suitable for concurrent requests)
        _pool = ThreadedConnectionPool(
            minconn=1,
            maxconn=20,
            dsn=settings.DATABASE_URL
        )
        logger.info("Database connection pool initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing database connection pool: {e}")
        raise e

def close_db_pool():
    global _pool
    if _pool is not None:
        _pool.closeall()
        logger.info("Database connection pool closed.")
        _pool = None

@contextmanager
def get_db_connection():
    """Context manager for acquiring and releasing a connection from the pool."""
    global _pool
    if _pool is None:
        init_db_pool()
        
    connection = None
    try:
        connection = _pool.getconn()
        yield connection
    except Exception as e:
        if connection:
            connection.rollback()
        logger.error(f"Database error encountered: {e}")
        raise e
    finally:
        if connection and _pool:
            _pool.putconn(connection)

@contextmanager
def get_db_cursor():
    """Helper context manager to acquire a connection and get a cursor directly."""
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            yield cursor
            conn.commit()
