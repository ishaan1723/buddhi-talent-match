from pydantic import BaseModel, EmailStr, HttpUrl, Field
from typing import List, Optional, Literal
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
    kpi_expectations: Optional[str] = None
    posted_by: Optional[str] = None
    duration: Optional[str] = None
    deadline: Optional[str] = None
    status: Optional[str] = 'open'

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
    proud_situation: Optional[str] = None
    headline: Optional[str] = None
    portfolio_url: Optional[str] = None
    rating: Optional[float] = 5.0
    ai_reasoning: Optional[str] = None

class FreelancerMatchResponse(BaseModel):
    id: int
    job_id: int
    freelancer_id: int
    match_score: float
    status: str
    job_title: str
    job_description: str
    job_budget: float
    job_kpi_expectations: Optional[str] = None
    created_at: datetime
    ai_reasoning: Optional[str] = None

class CompanyApprovedMatchResponse(BaseModel):
    id: int
    job_id: int
    freelancer_id: int
    match_score: float
    status: str
    job_title: str
    freelancer_name: str
    freelancer_email: str
    linkedin_url: str
    primary_skill: str
    experience: int
    hourly_rate: float
    created_at: datetime
    kpi_achieved: Optional[str] = None
    proud_situation: Optional[str] = None
    headline: Optional[str] = None
    portfolio_url: Optional[str] = None
    rating: Optional[float] = 5.0
    ai_reasoning: Optional[str] = None


# ---------------------------------------------------------------------------
# Auth schemas
# ---------------------------------------------------------------------------

class SignupRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    account_type: Literal["company", "freelancer"] = "company"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    account_type: str
    created_at: datetime

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
