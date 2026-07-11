# https://stackoverflow.com/questions/76970173/how-to-get-files-and-form-data-using-the-request-object-in-fastapi - multipart form data 

from fastapi import HTTPException
from fastapi.responses import RedirectResponse
import secrets
from src.modules.auth.session_service import SessionService
from src.cores.settings import BACKEND_URL
from src.modules.auth.jwt.jwt_service import JwtService
from src.bases.enum.jwt_enum import TokenType
from src.bases.constant.jwt_constant import ACCESS_LIVE_TIME, REFRESH_LIVE_TIME
from datetime import timedelta

class AuthService: 
    def __init__(self , session_service : SessionService , jwt_service : JwtService): 
        self.session_service = session_service 
        self.jwt_service = jwt_service
    async def authorize(self , session_id : str , redirect_uri: str):
        if session_id is None: 
            return RedirectResponse(f"{BACKEND_URL}/api/auth/login?redirect_uri={redirect_uri}") 
        session = await self.session_service.get_session(session_id=session_id) 
        if session is None: 
            return RedirectResponse(
                url=(
                    f"{BACKEND_URL}/api/auth/login?redirect_uri={redirect_uri}"                ), 
                status_code=302 
                # redirect uri la url ma auth provider se tra nguoi dung ve sau khi ho dang nhap thanh thanh cong 
            ) 
        return {
            "message": "User has been login" 
        }
    async def login(self, email : str, password : str , redirect_uri : str): 
        USERNAME = "nguyenkhaan2006@gmail.com" 
        PASSWORD = "123456" 
        if email != USERNAME or password != PASSWORD: 
            raise HTTPException(
                status_code=401, 
                detail="Wrong email or password" 
            ) 
        code = 'abc' #Ma code sinh ra de redirect nguoi dung ve 
        # neu nhu thanh cong thi se tien hanh route nguoi dung lai redirect_uri 
        payload = {
            "client_id": 1, #store the user id 
        } 
        authorization_code = secrets.token_urlsafe(32) 
        await self.session_service.create_authorization_code(authorization_code , payload)
        print("Authorization_code: " , authorization_code)
        return {
            "code": authorization_code, 
            "redirect_uri": redirect_uri
        }
    async def auth_code(self , code : str): 
        ... 
        payload = await self.session_service.get_authorization_code(code) 
        
        if payload is None: 
            raise HTTPException(
                status_code=400, 
                detail="User has not been logined" 
            ) 
        print('Hello world') 
        email = "nguyenkhaan2006@gmail.com" 
        client_id = payload.get('client_id') 
        payload = {
            "sub": client_id, 
            "email": email 
        } 
        access_token = await self.jwt_service.create_token(payload , TokenType.ACCESS_TOKEN , timedelta(seconds=ACCESS_LIVE_TIME)) 
        refresh_token = await self.jwt_service.create_token(payload , TokenType.REFRESH_TOKEN , timedelta(seconds=REFRESH_LIVE_TIME)) 
        print(access_token) 
        print(refresh_token)
        return {
            "access_token": access_token, 
            "refresh_token": refresh_token
        }
