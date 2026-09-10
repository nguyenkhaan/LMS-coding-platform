import pytest
from unittest.mock import patch, MagicMock

from src.services.email_client import SMTPClient
from src.cores import settings


def test_build_message_without_html():
    client = SMTPClient()
    client.smtp_from = "sender@example.com"
    msg = client._build_message(
        to="recipient@example.com",
        subject="Test Subject",
        body="This is the body"
    )

    assert msg["From"] == "sender@example.com"
    assert msg["To"] == "recipient@example.com"
    assert msg["Subject"] == "Test Subject"
    assert msg.get_content().strip() == "This is the body"
    
    # Check that there are no alternative parts
    assert not msg.is_multipart()


def test_build_message_with_html():
    client = SMTPClient()
    client.smtp_from = "sender@example.com"
    msg = client._build_message(
        to="recipient@example.com",
        subject="Test Subject",
        body="This is the body",
        html="<p>This is the html</p>"
    )

    assert msg["From"] == "sender@example.com"
    assert msg["To"] == "recipient@example.com"
    assert msg["Subject"] == "Test Subject"
    
    # It becomes multipart when alternative is added
    assert msg.is_multipart()
    parts = list(msg.iter_parts())
    assert len(parts) == 2
    assert parts[0].get_content().strip() == "This is the body"
    assert parts[1].get_content().strip() == "<p>This is the html</p>"


@pytest.mark.asyncio
@patch("src.services.email_client.smtplib.SMTP")
@patch("src.services.email_client.ssl.create_default_context")
async def test_send_email_uses_tls_if_enabled(mock_ssl, mock_smtp):
    client = SMTPClient()
    client.smtp_use_tls = True
    client.smtp_user = ""
    client.smtp_password = ""
    
    mock_smtp_instance = MagicMock()
    mock_smtp.return_value.__enter__.return_value = mock_smtp_instance

    await client.send_email("to@example.com", "Subject", "Body")
    
    mock_smtp_instance.starttls.assert_called_once_with(context=mock_ssl.return_value)
    # ehlo should be called twice when TLS is used (before and after starttls)
    assert mock_smtp_instance.ehlo.call_count == 2
    mock_smtp_instance.login.assert_not_called()


@pytest.mark.asyncio
@patch("src.services.email_client.smtplib.SMTP")
@patch("src.services.email_client.ssl.create_default_context")
async def test_send_email_skips_tls_if_disabled(mock_ssl, mock_smtp):
    client = SMTPClient()
    client.smtp_use_tls = False
    client.smtp_user = ""
    client.smtp_password = ""
    
    mock_smtp_instance = MagicMock()
    mock_smtp.return_value.__enter__.return_value = mock_smtp_instance

    await client.send_email("to@example.com", "Subject", "Body")
    
    mock_smtp_instance.starttls.assert_not_called()
    mock_smtp_instance.login.assert_not_called()


@pytest.mark.asyncio
@patch("src.services.email_client.smtplib.SMTP")
async def test_send_email_logins_if_credentials_exist(mock_smtp):
    client = SMTPClient()
    client.smtp_use_tls = False
    client.smtp_user = "test_user"
    client.smtp_password = "test_password"
    
    mock_smtp_instance = MagicMock()
    mock_smtp.return_value.__enter__.return_value = mock_smtp_instance

    await client.send_email("to@example.com", "Subject", "Body")
    
    mock_smtp_instance.login.assert_called_once_with("test_user", "test_password")


@pytest.mark.asyncio
@patch("src.services.email_client.smtplib.SMTP")
async def test_send_email_skips_login_if_credentials_empty(mock_smtp):
    client = SMTPClient()
    client.smtp_use_tls = False
    
    mock_smtp_instance = MagicMock()
    mock_smtp.return_value.__enter__.return_value = mock_smtp_instance

    # Test with both empty
    client.smtp_user = ""
    client.smtp_password = ""
    await client.send_email("to1@example.com", "Subject", "Body")
    
    # Test with user but no password
    client.smtp_user = "test_user"
    client.smtp_password = ""
    await client.send_email("to2@example.com", "Subject", "Body")
    
    mock_smtp_instance.login.assert_not_called()
