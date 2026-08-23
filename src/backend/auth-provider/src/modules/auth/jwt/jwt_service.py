from src.cores.settings import (
    JWT_ACCESS_PRIVATE,
    JWT_EMAIL_CHANGE_SECRET,
    JWT_REFRESH_SECRET,
)
from src.bases.enum.jwt_enum import TokenType
from datetime import datetime, timedelta, timezone

import jwt

RS_ALGORITHM = "RS256"
REFRESH_ALGORITHM = "HS256"

class JwtService:
    def get_secret_token(self, token_type: TokenType):
        match token_type:
            case TokenType.ACCESS_TOKEN:
                return JWT_ACCESS_PRIVATE
            case TokenType.REFRESH_TOKEN:
                return JWT_REFRESH_SECRET
            case TokenType.EMAIL_CHANGE_TOKEN:
                return JWT_EMAIL_CHANGE_SECRET

    @staticmethod
    def get_algorithm(token_type: TokenType) -> str:
        return RS_ALGORITHM if token_type == TokenType.ACCESS_TOKEN else REFRESH_ALGORITHM

    async def create_token(
        self, data: dict, token_type: TokenType, expires_delta: timedelta | None = None
    ) -> str:
        expires_at = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=60))
        payload = {
            **data,
            "exp": expires_at,
            "token_type": token_type.value,
        }
        return jwt.encode(
            payload,
            self.get_secret_token(token_type),
            algorithm=self.get_algorithm(token_type),
        )

    async def verify_token(self, token: str, token_type: TokenType) -> dict:
        return jwt.decode(
            token,
            self.get_secret_token(token_type),
            algorithms=[self.get_algorithm(token_type)],
            options={"require": ["exp", "sub", "token_type"]},
        )
