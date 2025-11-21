from __future__ import annotations

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..core.security import create_access_token
from ..dependencies.auth import get_current_active_user
from ..dependencies.database import get_db
from ..models.password_reset import MessageResponse, PasswordResetConfirm, PasswordResetRequest
from ..models.user import Token, UserCreate, UserPublic
from ..services import password_reset_service, user_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def register_user(payload: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)) -> UserPublic:
    return await user_service.create_user(db, payload)


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> Token:
    user = await user_service.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais invalidas")
    token = create_access_token(str(user.id))
    return Token(access_token=token)


@router.get("/me", response_model=UserPublic)
async def read_current_user(current_user=Depends(get_current_active_user)) -> UserPublic:
    return user_service.user_to_public(current_user)


@router.post("/password/forgot", response_model=MessageResponse)
async def forgot_password(
    payload: PasswordResetRequest,
    background_tasks: BackgroundTasks,
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> MessageResponse:
    token = await password_reset_service.create_reset_request(db, payload.email)
    if token:
        background_tasks.add_task(password_reset_service.send_reset_email, payload.email, token)
    return MessageResponse(message="Se o email estiver cadastrado, enviaremos instrucoes em alguns instantes.")


@router.post("/password/reset", response_model=MessageResponse)
async def reset_password(payload: PasswordResetConfirm, db: AsyncIOMotorDatabase = Depends(get_db)) -> MessageResponse:
    await password_reset_service.reset_password_with_token(db, payload.token, payload.password)
    return MessageResponse(message="Senha redefinida com sucesso.")
