import logging
from src.grpc.client import AuthGrpcClient
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
)

class PublicKeyService:
    _public_key: str | None = None

    _FALLBACK_KEY = """-----BEGIN PUBLIC KEY-----
...
-----END PUBLIC KEY-----"""

    @classmethod
    async def load(cls , client : AuthGrpcClient):
        try: 
            response = await client.public_key() 
            cls._public_key = response 
            logger.info("Public key has been loaded successfully %s" , response)

        except Exception:
            logger.warning("Failed to load public key. Using fallback.")
            cls._public_key = cls._FALLBACK_KEY
    @classmethod
    def get(cls) -> str:
        if cls._public_key is None:
            raise RuntimeError("JWT public key has not been loaded.")

        return cls._public_key