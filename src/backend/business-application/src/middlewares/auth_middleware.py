
from typing import List
from fastapi import security
import jwt 
from fastapi import Depends, HTTPException, Header
from jwt import InvalidTokenError
import json 
from src.jwk_service import PublicKeyService
from fastapi.security import HTTPAuthorizationCredentials , HTTPBearer
RS_ALGORITHM = "RS256"
ALGROTHM = "HS256"
def credential_exception(msg : str): 
    return HTTPException(
        status_code=401, 
        detail=msg, 
        headers={"WWW-Authenticate": "Bearer"},
    )

security = HTTPBearer() 

async def get_current_user(crendential: HTTPAuthorizationCredentials | None = Depends(security)): 
    if not(crendential): 
        raise credential_exception("Authorization Header is missing") 
    token : str = crendential.credentials 
    
    if not (token): 
        raise credential_exception("Invalid authorization header format") 
    public_key = PublicKeyService.get() 
    print(public_key)
    try: 
        payload = jwt.decode(token , public_key , algorithms=RS_ALGORITHM) 
        # payload format: {"sub": str(client_id), "email": email , "roles": roles} 
        sub = payload.get('sub' , None) 
        if not sub or not(isinstance(sub , str)): 
            raise credential_exception("Invalid authorization token body") 
        user_id = int(sub) 
        return {
            **payload, 
            "sub": user_id 
            # Tu dong ep kieu thanh int luon, do phien phuc, xu ly het o middleware roi
        } 
    except (InvalidTokenError, TypeError , ValueError): 
        raise credential_exception("Could not validate credentials") 
