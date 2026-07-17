from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status 
import jwt 
from jwt.exceptions import InvalidTokenError
from src.modules.auth.jwt.jwt_service import JwtService 
from src.bases.enums.jwt_enum import TokenType

ALGORITHM = 'HS256'
def create_jwt_token(data : dict , type : TokenType , expires_delta : timedelta | None = None): 
    to_encode = data.copy() 
    if expires_delta: 
        expire = datetime.now(timezone.utc) + expires_delta 
    else: 
        expire = datetime.now(timezone.utc) + timedelta(minutes=JwtService.get_token_expires_time(type)) 
    to_encode.update({
        "exp": expire, 
        "type": type 
    }) 
    secret_key = JwtService.get_token_secret(type) 
    print(secret_key)
    encoded_jwt = jwt.encode(to_encode , secret_key , algorithm=ALGORITHM)
    return encoded_jwt

def encode_jwt_token(token : str , type : TokenType): 
    try: 

        secret_key = JwtService.get_token_secret(type) 
        print(secret_key)
        payload = jwt.decode(token , secret_key , algorithms=[ALGORITHM]) 
        print(payload) 
        return payload 
    except InvalidTokenError as e: 
        print(e)  
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST, 
            detail = "Authentication Information is invalid" 
        ) 