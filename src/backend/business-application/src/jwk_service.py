import logging

import httpx

from src.cores.settings import AUTH_PROVIDER_URL

logger = logging.getLogger(__name__)


class PublicKeyService:
    _public_key: str | None = None

    _FALLBACK_KEY = """-----BEGIN PUBLIC KEY-----
...
-----END PUBLIC KEY-----"""

    @classmethod
    async def load(cls):
        try:
            async with httpx.AsyncClient(timeout=5) as client:
                response = await client.get(
                    f"{AUTH_PROVIDER_URL}/api/auth/public-key"
                )
                response.raise_for_status()

                cls._public_key = response.text
                logger.info("Public key loaded successfully.")

        except Exception:
            logger.warning("Failed to load public key. Using fallback.")
            cls._public_key = cls._FALLBACK_KEY

    @classmethod
    def get(cls) -> str:
        if cls._public_key is None:
            raise RuntimeError("JWT public key has not been loaded.")

        return cls._public_key