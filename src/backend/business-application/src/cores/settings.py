import os 
from dotenv import load_dotenv 

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

DATABASE_URL = get_env_var(
    "DATABASE_URL"
)
VERIFY_REGISTER_SECRET = get_env_var(
    "VERIFY_REGISTER_SECRET"
)
AUTH_PROVIDER_URL = get_env_var(
    "AUTH_PROVIDER_URL"
)