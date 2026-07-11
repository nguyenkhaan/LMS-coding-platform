from src.cores.settings import JWT_ACCESS_PRIVATE, JWT_REFRESH_SECRET
from src.bases.enum.jwt_enum import TokenType
from datetime import timedelta, datetime, timezone
from src.bases.constant.jwt_constant import ACCESS_LIVE_TIME, REFRESH_LIVE_TIME
import jwt 
RS_ALGORITHM = "RS256"
ALGROTHM = "HS256"

class JwtService: 
    def get_Secret_token(self , type : TokenType): 
        match type: 
            case TokenType.ACCESS_TOKEN: 
                return JWT_ACCESS_PRIVATE 
            case TokenType.REFRESH_TOKEN: 
                return JWT_REFRESH_SECRET 
    async def create_token(
            self, data : dict, type : TokenType , expires_delta : timedelta | None = None 
    ): 
        secret_key = self.get_Secret_token(type) 
        to_encode = data.copy() 
        if expires_delta: 
            expire = datetime.now(timezone.utc) + expires_delta # khi hoi ham thi phai truyen vao mot doi tuong timedelta 
        else: 
            expire = datetime.now(timezone.utc) + timedelta(minutes=60) # 60 minutes default 
        to_encode.update({
            'exp': expire 
        })
        algo = RS_ALGORITHM if (type == TokenType.ACCESS_TOKEN) else ALGROTHM
        encoded_jwt = jwt.encode(to_encode, secret_key, algorithm=algo)
        return encoded_jwt