# https://stackoverflow.com/questions/76970173/how-to-get-files-and-form-data-using-the-request-object-in-fastapi - multipart form data

import secrets
from datetime import timedelta
from fastapi import HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.modules.auth.session_service import SessionService
from src.cores.settings import BACKEND_URL
from src.modules.auth.jwt.jwt_service import JwtService
from src.bases.enum.jwt_enum import TokenType
from src.bases.constant.jwt_constant import ACCESS_LIVE_TIME, REFRESH_LIVE_TIME
from src.models.user_model import UserModel
from src.helpers.pwd_hash import password_hash

class AuthService:
    def __init__(self, db_session: AsyncSession, session_service: SessionService, jwt_service: JwtService):
        self.db_session = db_session
        self.session_service = session_service
        self.jwt_service = jwt_service

    async def authorize(self, session_id: str, redirect_uri: str):
        if session_id is None:
            return RedirectResponse(f"{BACKEND_URL}/api/auth/login?redirect_uri={redirect_uri}")

        session = await self.session_service.get_session(session_id=session_id)
        if session is None:
            return RedirectResponse(
                url=(
                    f"{BACKEND_URL}/api/auth/login?redirect_uri={redirect_uri}"
                ),
                status_code=302,
            )

        return {
            "message": "User has been login"
        }

    async def login(self, email: str, password: str, redirect_uri: str):
        query = select(UserModel).where(UserModel.email == email)
        user = await self.db_session.scalar(query)

        if user is None or not password_hash.verify(password, user.password) or not user.active:
            raise HTTPException(
                status_code=401,
                detail="Wrong email or password",
            )

        payload = {
            "client_id": user.id,
            "email": user.email,
        }

        authorization_code = secrets.token_urlsafe(32)
        await self.session_service.create_authorization_code(authorization_code, payload)

        return {
            "code": authorization_code,
            "redirect_uri": redirect_uri,
        }

    async def auth_code(self, code: str):
        payload = await self.session_service.get_authorization_code(code)

        if payload is None:
            raise HTTPException(
                status_code=400,
                detail="User has not logined",
            )

        client_id = payload.get("client_id")
        email = payload.get("email")

        access_token = await self.jwt_service.create_token(
            {"sub": str(client_id), "email": email},
            TokenType.ACCESS_TOKEN,
            timedelta(seconds=ACCESS_LIVE_TIME),
        )
        refresh_token = await self.jwt_service.create_token(
            {"sub": str(client_id), "email": email},
            TokenType.REFRESH_TOKEN,
            timedelta(seconds=REFRESH_LIVE_TIME),
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }
