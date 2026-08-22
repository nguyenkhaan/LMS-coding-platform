import hmac
import json
import secrets
from datetime import timedelta

from fastapi import HTTPException
from fastapi.responses import RedirectResponse
from jwt import InvalidTokenError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.bases.constant.jwt_constant import ACCESS_LIVE_TIME, REFRESH_LIVE_TIME
from src.bases.constant.redis_key import RedisKey
from src.bases.enum.jwt_enum import TokenType
from src.cores.settings import BACKEND_URL
from src.helpers.pwd_hash import password_hash
from src.helpers.random import random_string
from src.models.base_model import AccountStatus, Role
from src.models.role_model import UserRoleModel
from src.models.user_model import UserModel
from src.modules.auth.auth_dto import (
    AuthCodeResponse,
    ChangeEmailResponse,
    ForgotPasswordResponse,
    LoginGoogleResponse,
    LoginResponse,
    LogoutResponse,
    RefreshResponse,
    RegisterRequest,
    RegisterResponse,
    ResendOtpResponse,
    ResetPasswordResponse,
    VerifyRegisterResponse,
    VerifyResetEmailResponse,
)
from src.modules.auth.jwt.jwt_service import JwtService
from src.modules.auth.session_service import SessionService


OTP_LIVE_TIME = 300


class AuthService:
    def __init__(
        self,
        db_session: AsyncSession,
        session_service: SessionService,
        jwt_service: JwtService,
    ):
        self.db_session = db_session
        self.session_service = session_service
        self.jwt_service = jwt_service

    async def _create_registration_otp(self, user_id: int) -> str:
        latest_otp_key = RedisKey.save_verify_register(str(user_id))
        latest_otp = await self.session_service.get_value(latest_otp_key)
        if latest_otp is not None:
            await self.session_service.delete_value(RedisKey.verify_register(latest_otp))

        otp_code = random_string(8)
        payload = json.dumps({"user_id": str(user_id), "type": "register"})
        await self.session_service.set_value(
            RedisKey.verify_register(otp_code), payload, OTP_LIVE_TIME
        )
        await self.session_service.set_value(latest_otp_key, otp_code, OTP_LIVE_TIME)
        return otp_code

    @staticmethod
    def _require_active_account(user: UserModel) -> None:
        if user.account_status != AccountStatus.ACTIVE:
            raise HTTPException(status_code=401, detail="Wrong email or password")

    async def _issue_tokens(self, user: UserModel) -> tuple[str, str]:
        roles = [role.role.value for role in user.roles]
        claims = {"sub": str(user.id), "email": user.email, "roles": roles}
        access_token = await self.jwt_service.create_token(
            claims, TokenType.ACCESS_TOKEN, timedelta(seconds=ACCESS_LIVE_TIME)
        )
        refresh_token = await self.jwt_service.create_token(
            claims, TokenType.REFRESH_TOKEN, timedelta(seconds=REFRESH_LIVE_TIME)
        )
        return access_token, refresh_token

    async def register(self, data: RegisterRequest) -> RegisterResponse:
        try:
            user = await self.db_session.scalar(
                select(UserModel).where(UserModel.email == data.email)
            )
            if user is not None:
                if user.account_status != AccountStatus.UNVERIFIED:
                    raise HTTPException(status_code=400, detail="User has been registered")
                otp_code = await self._create_registration_otp(user.id)
                return RegisterResponse(
                    verify_code=otp_code,
                    message="Verify your account with the code above",
                )

            user = UserModel(
                email=data.email,
                address=data.address,
                password=password_hash.hash(data.password),
                full_name=data.full_name,
                account_status=AccountStatus.UNVERIFIED,
            )
            self.db_session.add(user)
            await self.db_session.flush()
            self.db_session.add(UserRoleModel(user_id=user.id, role=Role.STUDENT))
            otp_code = await self._create_registration_otp(user.id)
            await self.db_session.commit()
            return RegisterResponse(
                verify_code=otp_code,
                message="Verify your account with the code above",
            )
        except Exception:
            await self.db_session.rollback()
            raise

    async def verify_register(self, otp: str) -> VerifyRegisterResponse:
        key = RedisKey.verify_register(otp)
        payload = await self.session_service.get_value(key)
        if payload is None:
            raise HTTPException(
                status_code=404, detail="Verify code is invalid. Please resend again"
            )

        try:
            result = json.loads(payload)
            user_id = int(result["user_id"])
        except (KeyError, TypeError, ValueError, json.JSONDecodeError):
            raise HTTPException(status_code=400, detail="Verify code is invalid")

        if result.get("type") != "register":
            raise HTTPException(status_code=400, detail="Verify code is invalid")

        user = await self.db_session.scalar(
            select(UserModel).where(UserModel.id == user_id)
        )
        if user is None:
            raise HTTPException(status_code=400, detail="User has not been registered")
        if user.account_status != AccountStatus.UNVERIFIED:
            raise HTTPException(status_code=400, detail="Account cannot be verified")

        user.account_status = AccountStatus.ACTIVE
        await self.db_session.commit()
        await self.session_service.delete_value(key)
        return VerifyRegisterResponse(message="Verified account successfully")

    async def authorize(self, session_id: str | None, redirect_uri: str):
        if session_id is None:
            return RedirectResponse(f"{BACKEND_URL}/api/auth/login?redirect_uri={redirect_uri}")
        session = await self.session_service.get_session(session_id=session_id)
        if session is None:
            return RedirectResponse(
                url=f"{BACKEND_URL}/api/auth/login?redirect_uri={redirect_uri}",
                status_code=302,
            )
        return {"message": "User has been login"}

    async def login(self, email: str, password: str, redirect_uri: str) -> LoginResponse:
        if not isinstance(email, str) or not isinstance(password, str):
            raise HTTPException(status_code=401, detail="Wrong email or password")

        user = await self.db_session.scalar(
            select(UserModel).where(UserModel.email == email)
        )
        if user is None or user.password is None:
            raise HTTPException(status_code=401, detail="Wrong email or password")
        self._require_active_account(user)
        if not password_hash.verify(password, user.password):
            raise HTTPException(status_code=401, detail="Wrong email or password")

        authorization_code = secrets.token_urlsafe(32)
        print("authorization code: ", authorization_code)
        await self.session_service.create_authorization_code(
            authorization_code,
            {"client_id": user.id, "email": user.email},
        )
        return LoginResponse(
            code=authorization_code,
            redirect_uri=redirect_uri,
            identity="local",
        )

    async def auth_code(self, code: str) -> AuthCodeResponse:
        payload = await self.session_service.get_authorization_code(code)
        if payload is None:
            raise HTTPException(status_code=400, detail="User has not logined")

        try:
            user_id = int(payload["client_id"])
            email = payload["email"]
        except (KeyError, TypeError, ValueError):
            raise HTTPException(status_code=400, detail="Authorization code is invalid")

        user = await self.db_session.scalar(
            select(UserModel)
            .options(selectinload(UserModel.roles))
            .where(UserModel.id == user_id)
        )
        if user is None or user.email != email:
            raise HTTPException(status_code=404, detail="User not found")
        self._require_active_account(user)

        access_token, refresh_token = await self._issue_tokens(user)
        user.refresh_token = refresh_token
        await self.db_session.commit()
        await self.session_service.delete_authorization_code(code)
        return AuthCodeResponse(
            access_token=access_token,
            refresh_token=refresh_token,
        )

    async def refresh(self, token: str) -> RefreshResponse:
        try:
            payload = await self.jwt_service.verify_token(token, TokenType.REFRESH_TOKEN)
            user_id = int(payload["sub"])
        except (InvalidTokenError, KeyError, TypeError, ValueError):
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        if payload.get("token_type") != TokenType.REFRESH_TOKEN.value:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        user = await self.db_session.scalar(
            select(UserModel)
            .options(selectinload(UserModel.roles))
            .where(UserModel.id == user_id)
        )
        if user is None or user.refresh_token is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        self._require_active_account(user)
        if not hmac.compare_digest(token, user.refresh_token):
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        access_token, refresh_token = await self._issue_tokens(user)
        user.refresh_token = refresh_token
        await self.db_session.commit()
        return RefreshResponse(access_token=access_token, refresh_token=refresh_token)

    async def login_google(self, credential_token: str):
        return LoginGoogleResponse(access_token="demo123", refresh_token="demo123")

    async def logout(self):
        return LogoutResponse(message="Logout successfully")

    async def forgot_password(self, email: str):
        return ForgotPasswordResponse(message="Password reset link sent", code="demo-code")

    async def reset_password(self, code: str, new_password: str):
        return ResetPasswordResponse(message="Password reset successfully")
    async def resend_otp(self, email: str):
        stmt = select(UserModel).where(UserModel.email == email)
        user = await self.db_session.scalar(stmt)
        if user is None:
            raise HTTPException(
                detail="User not found",
                status_code=404,
            )
        if user.account_status != AccountStatus.UNVERIFIED:
            raise HTTPException(
                status_code=404,
                detail="User account invalid to perform this action",
            )
        otp_code = await self._create_registration_otp(user.id)
        print("otp that will resend to the client:" , otp_code) 

        return ResendOtpResponse(message="OTP resent successfully")

    async def change_email(self, new_email: str, password: str):
        return ChangeEmailResponse(
            message="Email change request submitted", token="demo-token"
        )

    async def verify_reset_email(self, token: str):
        return VerifyResetEmailResponse(message="Email verified successfully")
