import httpx
from src.cores.settings import AUTH_PROVIDER_URL

class PublicKeyService:
    _public_key: str | None = None
    @classmethod 
    async def load(cls):
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{AUTH_PROVIDER_URL}/api/auth/public-key")

            response.raise_for_status()
            print("Public key lay duoc la: " , response) 
            cls._public_key = response.text

    @classmethod
    def get(cls) -> str:
        if cls._public_key is None:
            raise RuntimeError("JWT public key has not been loaded.")

        return cls._public_key