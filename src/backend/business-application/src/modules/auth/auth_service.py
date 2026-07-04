
from http.client import BAD_REQUEST
from src.models.role_model import RoleModel
from src.models.base_model import SystemPosition, SystemRole
from src.helper.pwd_hash import password_hash
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.user_model import UserModel
from src.modules.auth.auth_dto import RegisterRequest, RegisterResponse

class AuthService: 
    def __init__(self , session : AsyncSession): 
        self.session = session 
    # Dang ky tai khoan hoc sinh 
    async def register(self , data : RegisterRequest) -> RegisterResponse: 
        try: 
            user = await self.session.scalar(
                select(UserModel).where(UserModel.email == data.email) 
            ) 
            RoleModel
            if user is not None: 
                if user.active: 
                    raise HTTPException(
                        status_code = BAD_REQUEST, 
                        detail = "User has been registered" 
                    ) 
                else: 
                    example_code = "abc123" # example code using for verify account 
                    return RegisterResponse(
                        verify_code = example_code, 
                        message = "Verify your account with the code above"
                    )
            password_hashed = password_hash.hash(data.password)
            user = UserModel(
                email = data.email, 
                password = password_hashed
            ) 
            self.session.add(user) 
            await self.session.flush() 
            
            role = RoleModel(
                user_id = user.id, 
                system_role = SystemRole.USER, 
                system_position = SystemPosition.STUDENT
            )
            self.session.add(role) 
            
            example_code = "abc"
            
            await self.session.commit() 
        
            return RegisterResponse(
                verify_code=example_code, 
                message = "Register successfully. Verify account with the code above"
            )
        except Exception: 
            await self.session.rollback() 
            raise 
# Mot so ham: self.session.add() , await self.session.flush() (Dong bo cac thay doi xuong database nhung chua thuc hien viec commit) 
# await self.session.commit(): luu cac thay doi xuong database, ket thuc transaction. Neu nhu khong co thi database no se khong doi va session se duoc tu dong rollback sau khi transaction ket thuc
# await self.session.refresh(user): Lam moi lai du lieu cho bien user.  