from typing import Any

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import ExpiredSignatureError, InvalidTokenError

from src.bases.enum.jwt_enum import TokenType
from src.cores.settings import JWT_ACCESS_PUBLIC


security = HTTPBearer(auto_error=False)


def credential_exception(detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> dict[str, Any]:
    if credentials is None:
        raise credential_exception("Authorization header is required")
    if credentials.scheme.lower() != "bearer":
        raise credential_exception("Invalid authorization scheme")

    token = credentials.credentials.strip()
    if not token:
        raise credential_exception("Access token is missing")

    try:
        payload = jwt.decode(
            token,
            JWT_ACCESS_PUBLIC,
            algorithms=["RS256"],
            options={"require": ["exp", "sub", "token_type"]},
        )
    except ExpiredSignatureError:
        raise credential_exception("Access token has expired")
    except InvalidTokenError:
        raise credential_exception("Invalid access token")

    if payload.get("token_type") != TokenType.ACCESS_TOKEN.value:
        raise credential_exception("Invalid access token")

    try:
        user_id = int(payload["sub"])
    except (KeyError, TypeError, ValueError):
        raise credential_exception("Invalid authorization token body")
    if user_id <= 0:
        raise credential_exception("Invalid authorization token body")

    return {**payload, "sub": user_id}
