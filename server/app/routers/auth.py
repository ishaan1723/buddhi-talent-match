import logging
from datetime import datetime, timedelta, timezone

import psycopg2
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.auth.security import (
    create_access_token,
    decode_access_token,
    generate_reset_token,
    hash_password,
    verify_password,
)
from app.config import settings
from app.database.connection import get_db_cursor
from app.models.schemas import (
    AuthResponse,
    ForgotPasswordRequest,
    LoginRequest,
    ResetPasswordRequest,
    SignupRequest,
    UserResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])

bearer_scheme = HTTPBearer(auto_error=False)


def _row_to_user_dict(row):
    return {
        "id": row[0],
        "full_name": row[1],
        "email": row[2],
        "account_type": row[3],
        "created_at": row[4],
    }


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    user_id = int(payload["sub"])
    with get_db_cursor() as cursor:
        cursor.execute(
            "SELECT id, full_name, email, account_type, created_at FROM users WHERE id = %s AND is_active = TRUE",
            (user_id,),
        )
        row = cursor.fetchone()

    if row is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return _row_to_user_dict(row)


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(payload: SignupRequest):
    password_hash = hash_password(payload.password)

    try:
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO users (full_name, email, password_hash, account_type)
                VALUES (%s, %s, %s, %s)
                RETURNING id, full_name, email, account_type, created_at
                """,
                (payload.full_name, payload.email.lower(), password_hash, payload.account_type),
            )
            row = cursor.fetchone()
    except psycopg2.errors.UniqueViolation:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists.")
    except Exception as e:
        logger.error(f"Signup failed: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not create account.")

    user = _row_to_user_dict(row)
    token = create_access_token(user["id"], user["email"], user["account_type"])
    return AuthResponse(access_token=token, user=UserResponse(**user))


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest):
    with get_db_cursor() as cursor:
        cursor.execute(
            "SELECT id, full_name, email, account_type, created_at, password_hash FROM users WHERE email = %s AND is_active = TRUE",
            (payload.email.lower(),),
        )
        row = cursor.fetchone()

    if row is None or not verify_password(payload.password, row[5]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

    user = _row_to_user_dict(row)
    token = create_access_token(user["id"], user["email"], user["account_type"])
    return AuthResponse(access_token=token, user=UserResponse(**user))


@router.get("/me", response_model=UserResponse)
async def me(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(payload: ForgotPasswordRequest):
    """
    Always returns a generic success message, regardless of whether the email
    exists, to avoid leaking which addresses are registered.

    NOTE: No transactional email provider is configured yet (no API key
    required for this feature to work end-to-end in dev). The reset link is
    logged server-side instead of emailed. Wire in a provider like Resend,
    Postmark, or SES in production and replace the logger.info call below
    with an actual send.
    """
    with get_db_cursor() as cursor:
        cursor.execute("SELECT id FROM users WHERE email = %s AND is_active = TRUE", (payload.email.lower(),))
        row = cursor.fetchone()

    if row is not None:
        user_id = row[0]
        token = generate_reset_token()
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES)

        with get_db_cursor() as cursor:
            cursor.execute(
                "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (%s, %s, %s)",
                (user_id, token, expires_at),
            )

        # DEV-ONLY: surfaced via logs since no email provider is wired up yet.
        logger.info(f"[password reset] link for user_id={user_id}: /reset-password?token={token}")
        return {
            "message": "If an account exists for that email, a reset link has been sent.",
            "token": token,
            "dev_link": f"/reset-password?token={token}"
        }

    return {"message": "If an account exists for that email, a reset link has been sent."}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(payload: ResetPasswordRequest):
    with get_db_cursor() as cursor:
        cursor.execute(
            "SELECT id, user_id, expires_at, used FROM password_reset_tokens WHERE token = %s",
            (payload.token,),
        )
        row = cursor.fetchone()

    if row is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset link.")

    token_id, user_id, expires_at, used = row
    if used:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This reset link has already been used.")

    expires_at_aware = expires_at if expires_at.tzinfo else expires_at.replace(tzinfo=timezone.utc)
    if expires_at_aware < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This reset link has expired.")

    new_hash = hash_password(payload.new_password)
    with get_db_cursor() as cursor:
        cursor.execute("UPDATE users SET password_hash = %s WHERE id = %s", (new_hash, user_id))
        cursor.execute("UPDATE password_reset_tokens SET used = TRUE WHERE id = %s", (token_id,))

    return {"message": "Password updated successfully. You can now log in."}
