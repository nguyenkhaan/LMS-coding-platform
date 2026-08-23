import os 
from dotenv import load_dotenv 
import base64
load_dotenv() 

class _NoArg:
    """A sentinel value to indicate that a parameter was not given"""
    
NO_ARG = _NoArg()

def get_env_var(key:str , default : str | _NoArg = NO_ARG): 
    try: 
        return os.environ[key] 
    except KeyError: 
        if isinstance(default , _NoArg): 
            raise ValueError(f"Environment with key {key} is missing") 
    return default 

BACKEND_URL = get_env_var('BACKEND_URL')
JWT_ACCESS_PRIVATE = base64.b64decode(get_env_var('JWT_ACCESS_PRIVATE')).decode('utf-8')
JWT_ACCESS_PUBLIC = base64.b64decode(get_env_var('JWT_ACCESS_PUBLIC')).decode('utf-8')
JWT_REFRESH_SECRET = get_env_var('JWT_REFRESH_SECRET')
JWT_EMAIL_CHANGE_SECRET = get_env_var('JWT_EMAIL_CHANGE_SECRET')
DATABASE_URL = get_env_var('DATABASE_URL')
UPSTASH_REDIS_REST_URL = get_env_var('UPSTASH_REDIS_REST_URL')
UPSTASH_REDIS_REST_TOKEN = get_env_var('UPSTASH_REDIS_REST_TOKEN')

SMTP_HOST = get_env_var('SMTP_HOST', 'localhost')
SMTP_PORT = int(get_env_var('SMTP_PORT', '1025'))
SMTP_USER = get_env_var('SMTP_USER', '')
SMTP_PASSWORD = get_env_var('SMTP_PASSWORD', '')
SMTP_USE_TLS = get_env_var('SMTP_USE_TLS', 'false').lower() == 'true'
SMTP_FROM = get_env_var('SMTP_FROM', 'noreply@lms.local')
# Hai duong link. Co the tien hanh thay doi khi can thiet
EMAIL_CHANGE_CONFIRM_URL = get_env_var(
    'EMAIL_CHANGE_CONFIRM_URL', f'{BACKEND_URL}/change-email/confirm'
)
PASSWORD_CHANGE_CONFIRM_URL = get_env_var(
    'PASSWORD_CHANGE_CONFIRM_URL', f'{BACKEND_URL}/change-password/confirm'
)
RABBITMQ_URL = get_env_var('RABBITMQ_URL')
