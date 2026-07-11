from src.bases.enums.jwt_enum import TokenType
import jwt
from jwt import InvalidTokenError

from src.cores.settings import VERIFY_REGISTER_SECRET


class JwtService:

    @staticmethod
    def get_token_secret(token_type: TokenType) -> str:
        match token_type:
            case TokenType.VERIFY_REGISTER:
                return VERIFY_REGISTER_SECRET

        raise ValueError(f"Unsupported token type: {token_type}")

    @staticmethod
    def get_token_expires_time(token_type: TokenType) -> int:
        match token_type:
            case TokenType.VERIFY_REGISTER:
                return 20  # minutes

        raise ValueError(f"Unsupported token type: {token_type}")

    @staticmethod
    def verify_token(
        token: str,
        secret_key: str,
    ) -> dict:

        payload = jwt.decode(
            token,
            secret_key,
            algorithms=["HS256"],
        )

        return payload