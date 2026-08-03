# https://stackoverflow.com/questions/76970173/how-to-get-files-and-form-data-using-the-request-object-in-fastapi - multipart form data

import secrets
import json 
from datetime import timedelta
from fastapi import HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy import join, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import load_only, selectinload

from src.bases.constant.redis_key import RedisKey
from src.helpers.random import random_string
from src.models.role_model import RoleModel
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
from src.models.base_model import AccountStatus, LoginMethod, Role
from src.models.user_identity_provider_model import UserIdentityModel
from src.modules.auth.session_service import SessionService
from src.cores.settings import BACKEND_URL
from src.modules.auth.jwt.jwt_service import JwtService
from src.bases.enum.jwt_enum import TokenType
from src.bases.constant.jwt_constant import ACCESS_LIVE_TIME, REFRESH_LIVE_TIME
from src.models.user_model import UserModel
from src.helpers.pwd_hash import password_hash

OTP_LIVE_TIME = 300 
class AuthService:
    def __init__(self, db_session: AsyncSession, session_service: SessionService, jwt_service: JwtService):
        self.db_session = db_session
        self.session_service = session_service
        self.jwt_service = jwt_service
    async def register(self , data : RegisterRequest): 
        try: 
            user = await self.db_session.scalar(
                select(UserModel).where(UserModel.email == data.email)
            ) 
            print(user) 
            if user is not None: 
                if user.active: 
                    raise HTTPException(400 , detail="User has been registered") 
                else: 
                    otp_code = random_string(8) 
                    payload = {
                        "user_id": str(user.id),
                        "type": "register" 
                    }
                    await self.session_service.set_value(RedisKey.verify_register(otp_code) , json.dumps(payload) , OTP_LIVE_TIME)

                    return RegisterResponse(
                        verify_code = otp_code, 
                        message="Verify your account with the code above"
                    )
            hashed_password = password_hash.hash(data.password)
            user = UserModel(
                email = data.email, 
                address = data.address, 
                password = hashed_password, 
                full_name = data.full_name, 
                active = False, 
                account_status = AccountStatus.ACTIVE
            )
            self.db_session.add(user) 
            await self.db_session.flush() 
            role = RoleModel(
                user_id = user.id, 
                role = Role.STUDENT
            )
            self.db_session.add(role) 
            payload = {
                "user_id": str(user.id),
                "type": "register" 
            }
            
            otp_code = random_string(8) 
            await self.session_service.set_value(RedisKey.verify_register(otp_code) , json.dumps(payload) , OTP_LIVE_TIME)
            await self.db_session.commit() 
            await self.db_session.refresh(user) 
            return RegisterResponse(
                verify_code = otp_code, 
                message = "Verify your account with the code above"
            ) 
        
        except Exception: 
            await self.db_session.rollback() 
            raise 

    async def verify_register(self , otp: str): 

        payload = await self.session_service.get_value(RedisKey.verify_register(otp))
        
        if payload is None: 
            raise HTTPException(
                status_code=404, 
                detail = "Verify code is invalid. Please resend again" 
            ) 
        result = json.loads(payload) 

        user_id = result.get('user_id') 
        user = await self.db_session.scalar(
            select(UserModel).where(UserModel.id == int(user_id)) 
        ) 
        if user is None: 
            raise HTTPException(
                status_code = 400, 
                detail = "User has not been registered" 
            ) 
        # update 
        user.active = True 
        await self.db_session.commit() 
        return VerifyRegisterResponse(
            message =  "Verified account successfully"
        )
    async def authorize(self, session_id: str | None , redirect_uri: str):
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

    async def login(self, email, password, redirect_uri):
        query = select(UserModel).where(UserModel.email == email)
        user = await self.db_session.scalar(query)

        if user is None or not password_hash.verify(password, user.password) or not user.active:
            raise HTTPException(
                status_code=401,
                detail="Wrong email or password",
            )

        user_identity = UserIdentityModel(
            user_id = user.id, 
            provider_id = None, 
            method = LoginMethod.LOCAL
        ) 
        self.db_session.add(user_identity)
        await self.db_session.flush()
        payload = {
            "client_id": user.id,
            "email": user.email,
        }

        authorization_code = secrets.token_urlsafe(32)
        print(authorization_code)
        await self.session_service.create_authorization_code(authorization_code, payload)

        return LoginResponse(
            code = authorization_code, 
            redirect_uri = redirect_uri, 
            identity = user_identity.method 
        )
    async def auth_code(self, code: str):
        payload = await self.session_service.get_authorization_code(code)

        if payload is None:
            raise HTTPException(
                status_code=400,
                detail="User has not logined",
            )

        client_id = payload.get("client_id")
        email = payload.get("email")
        stmt = (
            select(UserModel)
            .options(selectinload(UserModel.roles))
            .where(UserModel.email == email)
        )
        stmt = (
            select(UserModel)
            .options(
                load_only(UserModel.id, UserModel.email),
                selectinload(UserModel.roles),
            )
            .where(UserModel.email == email)
        )
        user = await self.db_session.scalar(stmt) 
        if user is None: 
            raise HTTPException(
                status_code = 404, 
                detail = "User not found" 
            )
        roles = [role.role for role in user.roles]
        access_token = await self.jwt_service.create_token(
            {"sub": str(client_id), "email": email , "roles": roles},
            TokenType.ACCESS_TOKEN,
            timedelta(seconds=ACCESS_LIVE_TIME),
        )
        refresh_token = await self.jwt_service.create_token(
            {"sub": str(client_id), "email": email , "roles": roles},
            TokenType.REFRESH_TOKEN,
            timedelta(seconds=REFRESH_LIVE_TIME),
        )
        return AuthCodeResponse(
            access_token = access_token, 
            refresh_token = refresh_token
        )
    
    async def refresh(self , token : str): 
        # Tien hanh cai dat voi HS256 algorithm 
        response = RefreshResponse(
            access_token = "demo123"
        ) 
        return response 
    async def login_google(self , credential_token : str): 
        response = LoginGoogleResponse(
            access_token="demo123", 
            refresh_token = "demo123"
        ) 
        return response 
    async def logout(self): 
        return LogoutResponse(
            message = "Logout successfully" 
        )
    async def forgot_password(self, email: str):
        return ForgotPasswordResponse(
            message="Password reset link sent",
            code="demo-code"
        )

    async def reset_password(self, code: str, new_password: str):
        return ResetPasswordResponse(
            message="Password reset successfully"
        )

    async def resend_otp(self, email: str):
        return ResendOtpResponse(
            message="OTP resent successfully"
        )

    async def change_email(self, new_email: str, password: str):
        return ChangeEmailResponse(
            message="Email change request submitted",
            token="demo-token"
        )

    async def verify_reset_email(self, token: str):
        return VerifyResetEmailResponse(
            message="Email verified successfully"
        )
