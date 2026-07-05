
from http.client import BAD_REQUEST
from src.modules.auth.jwt.jwt_auth import create_jwt_token, encode_jwt_token
from src.modules.auth.jwt.jwt_secret import TokenType
from src.models.role_model import RoleModel
from src.models.base_model import SystemPosition, SystemRole
from src.helper.pwd_hash import password_hash
from fastapi import HTTPException
from sqlalchemy import select, update
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
            
            if user is not None: 
                if user.active: 
                    raise HTTPException(
                        status_code = BAD_REQUEST, 
                        detail = "User has been registered" 
                    ) 
                else: 
                    payload = {
                        "sub": str(user.id), # Truong sub bat buoc phai la string 
                    }
                    example_code = create_jwt_token(payload ,  TokenType.VERIFY_REGISTER) # example code using for verify account 
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
            
            example_code = create_jwt_token({
                "sub": user.id
            } , TokenType.VERIFY_REGISTER)
            
            await self.session.commit() 
            # Phai rao ra them 1 bang nua de tien hanh luu tru xem thang nay no dang dang nhap theo phuong thuc gi 
            return RegisterResponse(
                verify_code=example_code, 
                message = "Register successfully. Verify account with the code above"
            )
        except Exception: 
            await self.session.rollback() 
            raise 
    async def verify_register(self , token : str): 
        try: 
            payload = encode_jwt_token(token , TokenType.VERIFY_REGISTER) 
            purpose = payload.get("type") 
            sub = payload.get("sub") 
            if purpose != TokenType.VERIFY_REGISTER: 
                raise HTTPException(
                    status_code = 400, 
                    detail = "Invalid token error" 
                ) 
            await self.session.execute(
                update(UserModel) 
                .where(UserModel.id == int(sub)) 
                .values(active = True)
            )
            await self.session.commit() 
            return "Verify account successfully" 
            
        except Exception: 
            await self.session.rollback() 
            raise 
# Mot so ham: self.session.add() , await self.session.flush() (Dong bo cac thay doi xuong database nhung chua thuc hien viec commit) 
# await self.session.commit(): luu cac thay doi xuong database, ket thuc transaction. Neu nhu khong co thi database no se khong doi va session se duoc tu dong rollback sau khi transaction ket thuc
# await self.session.refresh(user): Lam moi lai du lieu cho bien user. Chủ yếu để lấy các giá trị mà database có thể tự động thay đổi. Giúp đồng bộ database với biến lấy ra 