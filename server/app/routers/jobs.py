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
            INSERT INTO jobs (title, description, budget, kpi_expectations, posted_by, duration, deadline, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, created_at;
            """
            cursor.execute(query, (
                job.title,
                job.description,
                job.budget,
                job.kpi_expectations,
                job.posted_by,
                job.duration,
                job.deadline,
                job.status or 'open'
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
            kpi_expectations=job.kpi_expectations,
            posted_by=job.posted_by,
            duration=job.duration,
            deadline=job.deadline,
            status=job.status or 'open',
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
            SELECT id, title, description, budget, created_at, kpi_expectations, posted_by, duration, deadline, status
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
                    created_at=row[4],
                    kpi_expectations=row[5],
                    posted_by=row[6],
                    duration=row[7],
                    deadline=row[8],
                    status=row[9]
                ))
            return jobs
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred: {str(e)}"
        )

@router.get("/company", response_model=List[JobResponse])
def get_company_jobs(email: str):
    """Retrieves all jobs posted by a specific company email."""
    try:
        with get_db_cursor() as cursor:
            query = """
            SELECT id, title, description, budget, created_at, kpi_expectations, posted_by, duration, deadline, status
            FROM jobs
            WHERE posted_by = %s
            ORDER BY created_at DESC;
            """
            cursor.execute(query, (email,))
            rows = cursor.fetchall()
            
            jobs = []
            for row in rows:
                jobs.append(JobResponse(
                    id=row[0],
                    title=row[1],
                    description=row[2],
                    budget=float(row[3]),
                    created_at=row[4],
                    kpi_expectations=row[5],
                    posted_by=row[6],
                    duration=row[7],
                    deadline=row[8],
                    status=row[9]
                ))
            return jobs
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred: {str(e)}"
        )

@router.put("/{job_id}/status", status_code=status.HTTP_200_OK)
def update_job_status(job_id: int, status: str):
    """Updates the open/closed status of a job requirement."""
    if status not in ["open", "closed"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status. Must be 'open' or 'closed'."
        )
    try:
        with get_db_cursor() as cursor:
            query = """
            UPDATE jobs
            SET status = %s
            WHERE id = %s
            RETURNING id, status;
            """
            cursor.execute(query, (status, job_id))
            result = cursor.fetchone()
            if not result:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Job record not found."
                )
            return {
                "id": result[0],
                "status": result[1],
                "message": f"Job status successfully updated to {status}."
            }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred: {str(e)}"
        )
