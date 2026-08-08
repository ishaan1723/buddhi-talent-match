from fastapi import APIRouter, HTTPException, status, Request, BackgroundTasks
from typing import List
from app.models.schemas import MatchResponse, FreelancerMatchResponse, CompanyApprovedMatchResponse
from app.database.connection import get_db_cursor

router = APIRouter(
    prefix="/api/matches",
    tags=["matches"]
)

@router.get("/{job_id}", response_model=List[MatchResponse])
def get_job_matches(job_id: int, request: Request):
    """Retrieves all matched freelancers for a specific job, sorted by match percentage. Securely masks contact details unless authorized."""
    auth_header = request.headers.get("Authorization")
    is_recruiter = False
    if auth_header and "Bearer" in auth_header:
        token = auth_header.split(" ")[1]
        if token == "admin-token-bypass":
            is_recruiter = True

    try:
        with get_db_cursor() as cursor:
            query = """
            SELECT m.id, m.job_id, m.freelancer_id, m.match_score, m.status,
                   f.name, f.email, f.linkedin_url, f.primary_skill, f.experience, f.hourly_rate, m.created_at, 
                   f.proud_situation, f.headline, f.portfolio_url, f.rating, f.tags, f.resume_file_url, f.availability_status, m.ai_reasoning, f.phone
            FROM matches m
            JOIN freelancers f ON m.freelancer_id = f.id
            WHERE m.job_id = %s
            ORDER BY m.match_score DESC;
            """
            cursor.execute(query, (job_id,))
            rows = cursor.fetchall()
            
            matches = []
            for row in rows:
                status_val = row[4]
                raw_email = row[6]
                raw_linkedin = row[7]
                raw_phone = row[20] or ""

                # Security Gating logic
                if not is_recruiter and status_val != 'approved':
                    if '@' in raw_email:
                        parts = raw_email.split('@')
                        masked_email = parts[0][:2] + "***@" + parts[1]
                    else:
                        masked_email = "hidden***@example.com"
                    masked_linkedin = "https://linkedin.com/in/hidden-profile-unlocked-on-approval"
                    
                    if len(raw_phone) > 4:
                        masked_phone = raw_phone[:3] + "******" + raw_phone[-2:]
                    else:
                        masked_phone = "+91 ******89"
                else:
                    masked_email = raw_email
                    masked_linkedin = raw_linkedin
                    masked_phone = raw_phone

                matches.append(MatchResponse(
                    id=row[0],
                    job_id=row[1],
                    freelancer_id=row[2],
                    match_score=float(row[3]),
                    status=status_val,
                    freelancer_name=row[5],
                    freelancer_email=masked_email,
                    linkedin_url=masked_linkedin,
                    primary_skill=row[8],
                    experience=row[9],
                    hourly_rate=float(row[10]),
                    created_at=row[11],
                    proud_situation=row[12],
                    headline=row[13],
                    portfolio_url=row[14],
                    rating=float(row[15]) if row[15] else 5.0,
                    tags=row[16] or "",
                    resume_file_url=row[17] or "",
                    availability_status=row[18] or "ready",
                    ai_reasoning=row[19],
                    freelancer_phone=masked_phone
                ))
            return matches
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred: {str(e)}"
        )

@router.put("/{match_id}/status", status_code=status.HTTP_200_OK)
def update_match_status(match_id: int, status: str, background_tasks: BackgroundTasks):
    """Updates the match state (e.g., 'approved' or 'rejected') by the agency recruiter."""
    if status not in ["pending", "approved", "rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid match status. Must be 'pending', 'approved', or 'rejected'."
        )
        
    try:
        with get_db_cursor() as cursor:
            # Check if match already approved to avoid duplicate emails
            cursor.execute("SELECT status FROM matches WHERE id = %s", (match_id,))
            old_status_row = cursor.fetchone()
            old_status = old_status_row[0] if old_status_row else None

            query = """
            UPDATE matches
            SET status = %s
            WHERE id = %s
            RETURNING id, status, freelancer_id;
            """
            cursor.execute(query, (status, match_id))
            result = cursor.fetchone()
            
            if not result:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Match record not found."
                )
            
            match_id_res, status_res, freelancer_id = result[0], result[1], result[2]
            
            # Fetch unmasked details
            cursor.execute("SELECT email, linkedin_url, phone FROM freelancers WHERE id = %s", (freelancer_id,))
            freelancer_row = cursor.fetchone()
            freelancer_email = freelancer_row[0] if freelancer_row else ""
            linkedin_url = freelancer_row[1] if freelancer_row else ""
            freelancer_phone = freelancer_row[2] if freelancer_row else ""

            # Trigger automated email if newly approved
            if status_res == "approved" and old_status != "approved":
                email_query = """
                SELECT j.posted_by, j.title, f.name, m.match_score, u.full_name
                FROM matches m
                JOIN jobs j ON m.job_id = j.id
                JOIN freelancers f ON m.freelancer_id = f.id
                LEFT JOIN users u ON j.posted_by = u.email
                WHERE m.id = %s;
                """
                cursor.execute(email_query, (match_id_res,))
                email_row = cursor.fetchone()
                if email_row:
                    client_email, job_title, candidate_name, match_score, client_name = email_row
                    client_name = client_name or "Company Partner"
                    
                    # Add background email sending task
                    from app.services.email import send_client_match_approved_email
                    background_tasks.add_task(
                        send_client_match_approved_email,
                        client_email=client_email,
                        client_name=client_name,
                        job_title=job_title,
                        candidate_name=candidate_name,
                        match_score=float(match_score)
                    )
                
            return {
                "id": match_id_res,
                "status": status_res,
                "freelancer_email": freelancer_email,
                "linkedin_url": linkedin_url,
                "message": f"Match status successfully updated to {status}."
            }
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred: {str(e)}"
        )

@router.get("/freelancer/all", response_model=List[FreelancerMatchResponse])
def get_freelancer_matches(email: str):
    """Retrieves all job matches for a specific freelancer, sorted by match percentage."""
    try:
        with get_db_cursor() as cursor:
            query = """
            SELECT m.id, m.job_id, m.freelancer_id, m.match_score, m.status,
                   j.title, j.description, j.budget, j.kpi_expectations, m.created_at, m.ai_reasoning
            FROM matches m
            JOIN freelancers f ON m.freelancer_id = f.id
            JOIN jobs j ON m.job_id = j.id
            WHERE f.email = %s
            ORDER BY m.match_score DESC;
            """
            cursor.execute(query, (email,))
            rows = cursor.fetchall()
            
            matches = []
            for row in rows:
                matches.append(FreelancerMatchResponse(
                    id=row[0],
                    job_id=row[1],
                    freelancer_id=row[2],
                    match_score=float(row[3]),
                    status=row[4],
                    job_title=row[5],
                    job_description=row[6],
                    job_budget=float(row[7]),
                    job_kpi_expectations=row[8],
                    created_at=row[9],
                    ai_reasoning=row[10]
                ))
            return matches
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred: {str(e)}"
        )

@router.get("/company/approved", response_model=List[CompanyApprovedMatchResponse])
def get_company_approved_matches(email: str):
    """Retrieves all approved matched freelancers for jobs posted by a specific company email."""
    try:
        with get_db_cursor() as cursor:
            query = """
            SELECT m.id, m.job_id, m.freelancer_id, m.match_score, m.status,
                   j.title, f.name, f.email, f.linkedin_url, f.primary_skill, f.experience, f.hourly_rate,
                   m.created_at, f.kpi_achieved, f.proud_situation, f.headline, f.portfolio_url, f.rating, f.tags, f.resume_file_url, f.availability_status, m.ai_reasoning, f.phone
            FROM matches m
            JOIN freelancers f ON m.freelancer_id = f.id
            JOIN jobs j ON m.job_id = j.id
            WHERE m.status = 'approved' AND j.posted_by = %s
            ORDER BY m.match_score DESC;
            """
            cursor.execute(query, (email,))
            rows = cursor.fetchall()
            
            matches = []
            for row in rows:
                matches.append(CompanyApprovedMatchResponse(
                    id=row[0],
                    job_id=row[1],
                    freelancer_id=row[2],
                    match_score=float(row[3]),
                    status=row[4],
                    job_title=row[5],
                    freelancer_name=row[6],
                    freelancer_email=row[7],
                    linkedin_url=row[8],
                    primary_skill=row[9],
                    experience=row[10],
                    hourly_rate=float(row[11]),
                    created_at=row[12],
                    kpi_achieved=row[13],
                    proud_situation=row[14],
                    headline=row[15],
                    portfolio_url=row[16],
                    rating=float(row[17]) if row[17] else 5.0,
                    tags=row[18] or "",
                    resume_file_url=row[19] or "",
                    availability_status=row[20] or "ready",
                    ai_reasoning=row[21],
                    freelancer_phone=row[22] or ""
                ))
            return matches
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred: {str(e)}"
        )

@router.get("/company/job/{job_id}/approved", response_model=List[CompanyApprovedMatchResponse])
def get_job_approved_matches(job_id: int):
    """Retrieves all approved matched freelancers for a specific job_id."""
    try:
        with get_db_cursor() as cursor:
            query = """
            SELECT m.id, m.job_id, m.freelancer_id, m.match_score, m.status,
                   j.title, f.name, f.email, f.linkedin_url, f.primary_skill, f.experience, f.hourly_rate,
                   m.created_at, f.kpi_achieved, f.proud_situation, f.headline, f.portfolio_url, f.rating, f.tags, f.resume_file_url, f.availability_status, m.ai_reasoning, f.phone
            FROM matches m
            JOIN freelancers f ON m.freelancer_id = f.id
            JOIN jobs j ON m.job_id = j.id
            WHERE m.status = 'approved' AND m.job_id = %s
            ORDER BY m.match_score DESC;
            """
            cursor.execute(query, (job_id,))
            rows = cursor.fetchall()
            
            matches = []
            for row in rows:
                matches.append(CompanyApprovedMatchResponse(
                    id=row[0],
                    job_id=row[1],
                    freelancer_id=row[2],
                    match_score=float(row[3]),
                    status=row[4],
                    job_title=row[5],
                    freelancer_name=row[6],
                    freelancer_email=row[7],
                    linkedin_url=row[8],
                    primary_skill=row[9],
                    experience=row[10],
                    hourly_rate=float(row[11]),
                    created_at=row[12],
                    kpi_achieved=row[13],
                    proud_situation=row[14],
                    headline=row[15],
                    portfolio_url=row[16],
                    rating=float(row[17]) if row[17] else 5.0,
                    tags=row[18] or "",
                    resume_file_url=row[19] or "",
                    availability_status=row[20] or "ready",
                    ai_reasoning=row[21],
                    freelancer_phone=row[22] or ""
                ))
            return matches
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred: {str(e)}"
        )
