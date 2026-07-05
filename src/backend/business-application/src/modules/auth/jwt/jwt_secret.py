
from enum import Enum
from src.cores.settings import VERIFY_REGISTER_SECRET

class TokenType(str, Enum): 
    VERIFY_REGISTER = "verify_register" 

def get_token_secret(type : TokenType): 
    match type: 
        case TokenType.VERIFY_REGISTER: 
            return VERIFY_REGISTER_SECRET 
    return "" 

def get_token_expires_time(type : TokenType): 
    match type: 
        case TokenType.VERIFY_REGISTER: 
            return 20 # 20 minutes 
    return 0 