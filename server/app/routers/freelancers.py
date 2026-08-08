from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form
from typing import List, Optional
from app.models.schemas import FreelancerResponse
from pydantic import BaseModel
from app.database.connection import get_db_cursor
from app.services.matching import run_match_for_freelancer
import psycopg2
import pypdf
import io
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/freelancers",
    tags=["freelancers"]
)

@router.post("/", response_model=FreelancerResponse, status_code=status.HTTP_201_CREATED)
async def create_freelancer(
    name: str = Form(...),
    email: str = Form(...),
    linkedin_url: str = Form(...),
    primary_skill: str = Form(...),
    experience: int = Form(...),
    hourly_rate: float = Form(...),
    kpi_achieved: Optional[str] = Form(None),
    proud_situation: Optional[str] = Form(None),
    tags: Optional[str] = Form(""),
    phone: Optional[str] = Form(""),
    resume: Optional[UploadFile] = File(None)
):
    resume_text = ""
    resume_file_url = ""
    if resume:
        try:
            # For local/demo simulation, we parse the text from the PDF file
            pdf_bytes = await resume.read()
            pdf_file = io.BytesIO(pdf_bytes)
            reader = pypdf.PdfReader(pdf_file)
            extracted_pages = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_pages.append(text)
            resume_text = "\n".join(extracted_pages)
            # Store mock local path representing document storage
            resume_file_url = f"/uploads/resumes/{resume.filename}"
        except Exception as e:
            logger.error(f"Error parsing resume PDF: {e}")

    try:
        with get_db_cursor() as cursor:
            # Insert freelancer details into database including resume text, tags, and file url
            query = """
            INSERT INTO freelancers (name, email, linkedin_url, primary_skill, experience, hourly_rate, resume_text, kpi_achieved, proud_situation, tags, resume_file_url, availability_status, phone)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'ready', %s)
            RETURNING id, created_at;
            """
            cursor.execute(query, (
                name,
                email,
                linkedin_url,
                primary_skill,
                experience,
                hourly_rate,
                resume_text,
                kpi_achieved,
                proud_situation,
                tags or "",
                resume_file_url,
                phone or ""
            ))
            result = cursor.fetchone()
            f_id, created_at = result[0], result[1]
        
        # Trigger semantic matching engine outside the transaction boundary
        run_match_for_freelancer(f_id)
        
        return FreelancerResponse(
            id=f_id,
            name=name,
            email=email,
            linkedin_url=linkedin_url,
            primary_skill=primary_skill,
            experience=experience,
            hourly_rate=hourly_rate,
            kpi_achieved=kpi_achieved,
            proud_situation=proud_situation,
            tags=tags or "",
            resume_file_url=resume_file_url,
            availability_status='ready',
            phone=phone or "",
            created_at=created_at
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
            SELECT id, name, email, linkedin_url, primary_skill, experience, hourly_rate, created_at, kpi_achieved, proud_situation, tags, resume_file_url, availability_status
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
                    created_at=row[7],
                    kpi_achieved=row[8],
                    proud_situation=row[9],
                    tags=row[10] or "",
                    resume_file_url=row[11] or "",
                    availability_status=row[12] or "ready"
                ))
            return freelancers
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred: {str(e)}"
        )

class AvailabilityUpdate(BaseModel):
    email: str
    availability_status: str

@router.put("/availability")
def update_availability(update_data: AvailabilityUpdate):
    try:
        with get_db_cursor() as cursor:
            query = """
            UPDATE freelancers
            SET availability_status = %s
            WHERE email = %s
            RETURNING id;
            """
            cursor.execute(query, (update_data.availability_status, update_data.email))
            result = cursor.fetchone()
            if not result:
                raise HTTPException(status_code=404, detail="Freelancer not found")
            return {"message": "Availability updated successfully", "status": update_data.availability_status}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred: {str(e)}"
        )
