from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import init_db_pool, close_db_pool
from app.database.models import initialize_tables
from app.routers import freelancers, jobs, matches, auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    init_db_pool()
    initialize_tables()
    yield
    # Shutdown actions
    close_db_pool()

app = FastAPI(
    title="AI-Powered Talent Matching API",
    description="Backend services for matching AI freelancers with client jobs using semantic vectors.",
    version="1.0.0",
    lifespan=lifespan
)

# Include API routers
app.include_router(auth.router)
app.include_router(freelancers.router)
app.include_router(jobs.router)
app.include_router(matches.router)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "AI Talent Matching API is up and running."
    }
