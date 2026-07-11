from fastapi import Header, HTTPException, status
from jwt import ExpiredSignatureError, InvalidTokenError

from src.modules.auth.jwt.jwt_service import JwtService
from src.bases.enums.jwt_enum import TokenType
from src.jwk_service import PublicKeyService


async def require_login(
    authorization: str | None = Header(default=None),
):
    # Authorization header
    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is required",
        )

    # Bearer token
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization scheme",
        )

    token = authorization.removeprefix("Bearer ").strip()

    if token == "":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token is missing",
        )

    # Public key đã cache khi ứng dụng startup
    public_key = PublicKeyService.get()

    try:
        payload = JwtService.verify_token(
            token=token,
            secret_key=public_key,      # hoặc đổi tên thành public_key nếu bạn đã sửa JwtService
            token_type=TokenType.ACCESS_TOKEN,
            algorithm = "RS256"
        )
        return payload

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token has expired",
        )

    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token",
        )