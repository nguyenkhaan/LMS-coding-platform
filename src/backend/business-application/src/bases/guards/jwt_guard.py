from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import ExpiredSignatureError, InvalidTokenError

from src.bases.enums.jwt_enum import TokenType
from src.jwk_service import PublicKeyService
from src.modules.auth.jwt.jwt_service import JwtService

security = HTTPBearer(auto_error=False)


async def require_login(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
):

    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is required",
        )


    if credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization scheme",
        )

    token = credentials.credentials.strip()

    if token == "":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token is missing",
        )

    public_key = PublicKeyService.get()

    try:
        payload = JwtService.verify_token(
            token=token,
            secret_key=public_key,
            algorithm="RS256",
        )
        print(payload) 
        return {
            **payload, 
            "sub" : int(payload.get('sub'))
        }

    except ExpiredSignatureError as e: 
        print("Verify Token error: " , e) 
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token has expired",
        )

    except InvalidTokenError as e: 
        print("Verify Token error: " , e) 
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token",
        )