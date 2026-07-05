from fastapi import APIRouter, HTTPException, status
from typing import List
from app.models.schemas import FreelancerCreate, FreelancerResponse
from app.database.connection import get_db_cursor
from app.services.matching import run_match_for_freelancer
import psycopg2

router = APIRouter(
    prefix="/api/freelancers",
    tags=["freelancers"]
)

@router.post("/", response_model=FreelancerResponse, status_code=status.HTTP_201_CREATED)
def create_freelancer(freelancer: FreelancerCreate):
    try:
        with get_db_cursor() as cursor:
            # Insert freelancer details into database
            query = """
            INSERT INTO freelancers (name, email, linkedin_url, primary_skill, experience, hourly_rate)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id, created_at;
            """
            cursor.execute(query, (
                freelancer.name,
                freelancer.email,
                freelancer.linkedin_url,
                freelancer.primary_skill,
                freelancer.experience,
                freelancer.hourly_rate
            ))
            result = cursor.fetchone()
            
            # Trigger semantic matching engine in the background
            run_match_for_freelancer(result[0])
            
            return FreelancerResponse(
                id=result[0],
                name=freelancer.name,
                email=freelancer.email,
                linkedin_url=freelancer.linkedin_url,
                primary_skill=freelancer.primary_skill,
                experience=freelancer.experience,
                hourly_rate=freelancer.hourly_rate,
                created_at=result[1]
            )
            
    except psycopg2.errors.UniqueViolation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A freelancer with this email address already exists."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred: {str(e)}"
        )

@router.get("/", response_model=List[FreelancerResponse])
def list_freelancers():
    try:
        with get_db_cursor() as cursor:
            query = """
            SELECT id, name, email, linkedin_url, primary_skill, experience, hourly_rate, created_at
            FROM freelancers
            ORDER BY created_at DESC;
            """
            cursor.execute(query)
            rows = cursor.fetchall()
            
            freelancers = []
            for row in rows:
                freelancers.append(FreelancerResponse(
                    id=row[0],
                    name=row[1],
                    email=row[2],
                    linkedin_url=row[3],
                    primary_skill=row[4],
                    experience=row[5],
                    hourly_rate=float(row[6]),
                    created_at=row[7]
                ))
            return freelancers
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred: {str(e)}"
        )
