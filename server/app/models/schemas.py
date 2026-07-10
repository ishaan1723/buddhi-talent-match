from pydantic import BaseModel, EmailStr, HttpUrl, Field
from typing import List, Optional
from datetime import datetime

class FreelancerBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    linkedin_url: str = Field(..., pattern=r"^https?://(www\.)?linkedin\.com/.*$")
    primary_skill: str = Field(..., min_length=2, max_length=100)
    experience: int = Field(..., ge=0, le=50)
    hourly_rate: float = Field(..., gt=0)
    kpi_achieved: Optional[str] = None
    proud_situation: Optional[str] = None

class FreelancerCreate(FreelancerBase):
    pass

class FreelancerResponse(FreelancerBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class JobBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=100)
    description: str = Field(..., min_length=10)
    budget: float = Field(..., gt=0)

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class MatchResponse(BaseModel):
    id: int
    job_id: int
    freelancer_id: int
    match_score: float
    status: str
    freelancer_name: str
    freelancer_email: str
    linkedin_url: str
    primary_skill: str
    experience: int
    hourly_rate: float
    created_at: datetime
    kpi_achieved: Optional[str] = None
    proud_situation: Optional[str] = None
