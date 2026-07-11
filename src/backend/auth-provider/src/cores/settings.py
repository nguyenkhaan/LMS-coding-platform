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