import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Database Configuration
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/talent_match"

    # AI Configuration (OpenAI or Gemini API Keys)
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    AI_PROVIDER: str = "openai"  # 'openai' or 'gemini'

    # Auth Configuration
    # NOTE: JWT_SECRET_KEY has a dev fallback so the app boots out of the box.
    # Set a real random value in .env before deploying to production.
    JWT_SECRET_KEY: str = "dev-only-insecure-secret-change-me"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = 30

    # Settings setup
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
