from fastapi import APIRouter, HTTPException, status
from typing import List
from app.models.schemas import MatchResponse
from app.database.connection import get_db_cursor

router = APIRouter(
    prefix="/api/matches",
    tags=["matches"]
)

@router.get("/{job_id}", response_model=List[MatchResponse])
def get_job_matches(job_id: int):
    """Retrieves all matched freelancers for a specific job, sorted by match percentage."""
    try:
        with get_db_cursor() as cursor:
            query = """
            SELECT m.id, m.job_id, m.freelancer_id, m.match_score, m.status,
                   f.name, f.email, f.linkedin_url, f.primary_skill, f.experience, f.hourly_rate, m.created_at, f.kpi_achieved, f.proud_situation
            FROM matches m
            JOIN freelancers f ON m.freelancer_id = f.id
            WHERE m.job_id = %s
            ORDER BY m.match_score DESC;
            """
            cursor.execute(query, (job_id,))
            rows = cursor.fetchall()
            
            matches = []
            for row in rows:
                matches.append(MatchResponse(
                    id=row[0],
                    job_id=row[1],
                    freelancer_id=row[2],
                    match_score=float(row[3]),
                    status=row[4],
                    freelancer_name=row[5],
                    freelancer_email=row[6],
                    linkedin_url=row[7],
                    primary_skill=row[8],
                    experience=row[9],
                    hourly_rate=float(row[10]),
                    created_at=row[11],
                    kpi_achieved=row[12],
                    proud_situation=row[13]
                ))
            return matches
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred: {str(e)}"
        )

@router.put("/{match_id}/status", status_code=status.HTTP_200_OK)
def update_match_status(match_id: int, status: str):
    """Updates the match state (e.g., 'approved' or 'rejected') by the agency recruiter."""
    if status not in ["pending", "approved", "rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid match status. Must be 'pending', 'approved', or 'rejected'."
        )
        
    try:
        with get_db_cursor() as cursor:
            query = """
            UPDATE matches
            SET status = %s
            WHERE id = %s
            RETURNING id, status;
            """
            cursor.execute(query, (status, match_id))
            result = cursor.fetchone()
            
            if not result:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Match record not found."
                )
                
            return {
                "id": result[0],
                "status": result[1],
                "message": f"Match status successfully updated to {status}."
            }
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred: {str(e)}"
        )
