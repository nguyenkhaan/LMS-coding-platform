import asyncio
import smtplib
import ssl
from email.message import EmailMessage

from src.cores import settings


class SMTPClient:
    """A client for sending emails via SMTP, running synchronously in a background thread."""

    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.smtp_use_tls = settings.SMTP_USE_TLS
        self.smtp_from = settings.SMTP_FROM

    def _build_message(self, to: str, subject: str, body: str, html: str | None = None) -> EmailMessage:
        msg = EmailMessage()
        msg["From"] = self.smtp_from
        msg["To"] = to
        msg["Subject"] = subject
        msg.set_content(body)

        if html is not None:
            msg.add_alternative(html, subtype="html")

        return msg

    def _send_sync(self, to: str, subject: str, body: str, html: str | None = None) -> None:
        msg = self._build_message(to=to, subject=subject, body=body, html=html)
        context = ssl.create_default_context()

        with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
            server.ehlo()

            if self.smtp_use_tls:
                server.starttls(context=context)
                server.ehlo()

            if self.smtp_user and self.smtp_password:
                server.login(self.smtp_user, self.smtp_password)

            server.send_message(msg)

    async def send_email(self, to: str, subject: str, body: str, html: str | None = None) -> None:
        """Sends an email asynchronously by offloading blocking SMTP operations to a thread."""
        await asyncio.to_thread(self._send_sync, to, subject, body, html)

