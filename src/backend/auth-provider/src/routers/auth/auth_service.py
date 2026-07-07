# https://stackoverflow.com/questions/76970173/how-to-get-files-and-form-data-using-the-request-object-in-fastapi - multipart form data 

from fastapi import HTTPException
from fastapi.responses import RedirectResponse

from src.routers.auth.session_service import SessionService


class AuthService: 
    def __init__(self , session_service : SessionService): 
        self.session_service = session_service
    async def authorize(self , session_id : str , redirect_uri: str):
        if session_id is None: 
            return RedirectResponse("/login") 
        session = await self.session_service.get_session(session_id=session_id) 
        if session is None: 
            return RedirectResponse(
                url=(
                    f"/login?redirect_uri=&redirect_uri={redirect_uri}"                ), 
                status_code=302 
                # redirect uri la url ma auth provider se tra nguoi dung ve sau khi ho dang nhap thanh thanh cong 
            ) 
        return {
            "message": "User has been login" 
        }
    async def login(email : str, password : str , redirect_uri : str): 
        USERNAME = "nguyenkhaan2006@gmail.com" 
        PASSWORD = "123456" 
        if email != USERNAME or password != PASSWORD: 
            raise HTTPException(
                status_code = 
            )