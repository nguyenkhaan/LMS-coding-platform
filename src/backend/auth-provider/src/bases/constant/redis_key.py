# src/bases/constant/redis_key.py
# Cac ham save duoc su dung de luu lai value, giup viec truy xuat nguoc de dang hon 
class RedisKey:
    @staticmethod
    def session(session_id: str) -> str:
        return f"lms:auth-provider:session:{session_id}"

    @staticmethod
    def authorization_code(code: str) -> str:
        return f"lms:auth-provider:auth-code:{code}"

    @staticmethod
    def refresh_token(token_id: str) -> str:
        return f"lms:auth-provider:refresh-token:{token_id}"

    @staticmethod
    def access_token(token_id: str) -> str:
        return f"lms:auth-provider:access-token:{token_id}"

    @staticmethod
    def oauth_state(state: str) -> str:
        return f"lms:auth-provider:oauth-state:{state}"

    @staticmethod
    def login_attempt(email: str) -> str:
        return f"lms:auth-provider:login-attempt:{email}"

    @staticmethod
    def reset_password(code: str) -> str:
        return f"lms:auth-provider:reset-password:{code}"
    @staticmethod
    def save_reset_password(user_id : str) -> str: 
        return f"lms:auth-provider:reset-password:user:{user_id}"
    
    @staticmethod 
    def verify_register(otp : str) -> str: 
        return f"lms:auth-provider:verify-register:{otp}" 
    @staticmethod 
    def save_verify_register(user_id : str) -> str: 
        return f"lms:auth-provider:verify-register:user:{user_id}"
"""
BAI THO DE THUONG 
@classmethod: call it from class, pass the cls 
@staticmethod: call it from class or instance, don't pass anything 
plain: call it from instance, pass the self 
"""