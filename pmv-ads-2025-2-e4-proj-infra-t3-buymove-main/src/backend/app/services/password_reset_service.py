from __future__ import annotations

import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..core.config import settings
from . import user_service

RESET_TOKEN_BYTES = 32


def _token_digest(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _build_reset_link(token: str) -> str:
    base = str(settings.frontend_base_url).rstrip("/")
    return f"{base}/reset-password?token={token}"


def send_reset_email(email: str, token: str) -> None:
    link = _build_reset_link(token)
    print(
        "[password-reset]", f"Enviando link de redefinicao para {email}.", "Use o link a seguir:", link
    )


async def create_reset_request(db: AsyncIOMotorDatabase, email: str) -> str | None:
    user = await user_service.get_user_by_email(db, email)
    if not user:
        return None

    token = secrets.token_urlsafe(RESET_TOKEN_BYTES)
    digest = _token_digest(token)
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(minutes=settings.password_reset_expire_minutes)

    await db.password_resets.delete_many({"user_id": str(user.id)})

    await db.password_resets.insert_one(
        {
            "user_id": str(user.id),
            "email": user.email,
            "token_digest": digest,
            "created_at": now,
            "expires_at": expires_at,
            "used_at": None,
        }
    )

    return token


async def reset_password_with_token(db: AsyncIOMotorDatabase, token: str, new_password: str) -> None:
    digest = _token_digest(token)
    record = await db.password_resets.find_one({"token_digest": digest})
    now = datetime.now(timezone.utc)

    if not record:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token invalido")

    if record.get("used_at") is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token ja utilizado")

    expires_at = record.get("expires_at")
    if not expires_at or expires_at < now:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token expirado")

    user_id = record.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token invalido")

    await user_service.update_password(db, str(user_id), new_password)

    await db.password_resets.update_one(
        {"_id": record["_id"]},
        {"$set": {"used_at": now}},
    )
