"""
Authentication security helpers.

Deliberately dependency-light: password hashing uses the stdlib's
PBKDF2-HMAC-SHA256 (no bcrypt/native compile step required) and JWTs use
PyJWT. No third-party auth provider or API key is required to run this —
everything works against the existing Postgres/Supabase DATABASE_URL.
"""
import base64
import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt

from app.config import settings

PBKDF2_ITERATIONS = 20_000
PBKDF2_ALGO = "sha256"


def hash_password(password: str) -> str:
    """Hash a plaintext password into a self-contained 'algo$iterations$salt$hash' string."""
    salt = os.urandom(16)
    derived = hashlib.pbkdf2_hmac(PBKDF2_ALGO, password.encode("utf-8"), salt, PBKDF2_ITERATIONS)
    return f"pbkdf2_{PBKDF2_ALGO}${PBKDF2_ITERATIONS}${base64.b64encode(salt).decode()}${base64.b64encode(derived).decode()}"


def verify_password(password: str, stored_hash: str) -> bool:
    """Constant-time verification of a plaintext password against a stored hash."""
    try:
        algo_part, iterations_str, salt_b64, hash_b64 = stored_hash.split("$")
        algo = algo_part.replace("pbkdf2_", "")
        iterations = int(iterations_str)
        salt = base64.b64decode(salt_b64)
        expected = base64.b64decode(hash_b64)
    except (ValueError, AttributeError):
        return False

    derived = hashlib.pbkdf2_hmac(algo, password.encode("utf-8"), salt, iterations)
    return hmac.compare_digest(derived, expected)


def create_access_token(user_id: int, email: str, account_type: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),
        "email": email,
        "account_type": account_type,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "access",
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        if payload.get("type") != "access":
            return None
        return payload
    except jwt.PyJWTError:
        return None


def generate_reset_token() -> str:
    """URL-safe, unguessable token for password reset links."""
    return secrets.token_urlsafe(32)
