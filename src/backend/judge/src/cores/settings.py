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

RABBITMQ_URL = get_env_var('RABBITMQ_URL')
# MINIO 
MINIO_URL = get_env_var('MINIO_URL')
MINIO_ACCESS_KEY = get_env_var('MINIO_ACCESS_KEY')
MINIO_SECRET_KEY = get_env_var('MINIO_SECRET_KEY')
MINIO_BUCKET_NAME = get_env_var('MINIO_BUCKET_NAME')
MINIO_PORT = get_env_var('MINIO_PORT')