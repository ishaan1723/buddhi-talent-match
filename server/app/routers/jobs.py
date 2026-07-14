from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from typing import List
from app.models.schemas import JobCreate, JobResponse
from app.database.connection import get_db_cursor
from app.services.matching import run_match_for_job

router = APIRouter(
    prefix="/api/jobs",
    tags=["jobs"]
)

@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(job: JobCreate, background_tasks: BackgroundTasks):
    try:
        with get_db_cursor() as cursor:
            query = """
            INSERT INTO jobs (title, description, budget)
            VALUES (%s, %s, %s)
            RETURNING id, created_at;
            """
            cursor.execute(query, (
                job.title,
                job.description,
                job.budget
            ))
            result = cursor.fetchone()
            job_id, created_at = result[0], result[1]
        
        # Trigger semantic matching engine asynchronously in the background
        background_tasks.add_task(run_match_for_job, job_id)
        
        return JobResponse(
            id=job_id,
            title=job.title,
            description=job.description,
            budget=job.budget,
            created_at=created_at
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred: {str(e)}"
        )

@router.get("/", response_model=List[JobResponse])
def list_jobs():
    try:
        with get_db_cursor() as cursor:
            query = """
            SELECT id, title, description, budget, created_at
            FROM jobs
            ORDER BY created_at DESC;
            """
            cursor.execute(query)
            rows = cursor.fetchall()
            
            jobs = []
            for row in rows:
                jobs.append(JobResponse(
                    id=row[0],
                    title=row[1],
                    description=row[2],
                    budget=float(row[3]),
                    created_at=row[4]
                ))
            return jobs
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred: {str(e)}"
        )
