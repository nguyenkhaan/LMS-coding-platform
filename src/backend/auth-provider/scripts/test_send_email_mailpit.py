import asyncio
import os
import sys
import base64

os.environ.setdefault("BACKEND_URL", "http://localhost:4001")
os.environ.setdefault("JWT_ACCESS_PRIVATE", base64.b64encode(b"test").decode())
os.environ.setdefault("JWT_ACCESS_PUBLIC", base64.b64encode(b"test").decode())
os.environ.setdefault("JWT_REFRESH_SECRET", "test")
os.environ.setdefault("JWT_EMAIL_CHANGE_SECRET", "test")
os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://user:password@localhost/test")
os.environ.setdefault("UPSTASH_REDIS_REST_URL", "https://example.test")
os.environ.setdefault("UPSTASH_REDIS_REST_TOKEN", "test-token")
os.environ.setdefault("RABBITMQ_URL", "amqp://guest:guest@localhost/")
os.environ.setdefault("SMTP_HOST", "localhost")
os.environ.setdefault("SMTP_PORT", "1025")

# Add the project root to the path so we can import src
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.services.email_client import SMTPClient
from src.cores import settings

async def main():
    print("Testing SMTP connection to Mailpit...")
    print(f"SMTP Host: {settings.SMTP_HOST}")
    print(f"SMTP Port: {settings.SMTP_PORT}")
    
    client = SMTPClient()
    
    # Send a simple text email
    await client.send_email(
        to="test.user@example.com",
        subject="[LMS] Integration Test - Text Only",
        body="Hello!\n\nThis is a test email sent from the integration script to verify Mailpit."
    )
    print("Text-only email sent successfully.")
    
    # Send an email with HTML
    await client.send_email(
        to="test.user2@example.com",
        subject="[LMS] Integration Test - HTML",
        body="Hello!\n\nThis is the plain text fallback.",
        html="""
        <html>
            <body>
                <h2 style='color: blue;'>Hello!</h2>
                <p>This is a test email with <b>HTML</b> content.</p>
            </body>
        </html>
        """
    )
    print("HTML email sent successfully.")
    print("\nPlease check the Mailpit UI (usually http://localhost:8025) to confirm receipt.")

if __name__ == "__main__":
    asyncio.run(main())
