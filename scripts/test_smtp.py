import asyncio
import sys
from pathlib import Path

from dotenv import load_dotenv


AUTH_PROVIDER_DIR = Path(__file__).resolve().parents[1] / "src" / "backend" / "auth-provider"
sys.path.append(str(AUTH_PROVIDER_DIR))

# Ensure auth-provider settings read from the real env file.
load_dotenv(dotenv_path=AUTH_PROVIDER_DIR / ".env", override=False)

from src.services.email_client import SMTPClient  # noqa: E402


async def main() -> None:
    client = SMTPClient()

    await client.send_email(
        to="test@lms.local",
        subject="SMTP test (Mailpit)",
        body="This is a test email sent by LMS-coding-platform.",
    )

    print("SMTP test: OK (email send succeeded)")


if __name__ == "__main__":
    asyncio.run(main())

