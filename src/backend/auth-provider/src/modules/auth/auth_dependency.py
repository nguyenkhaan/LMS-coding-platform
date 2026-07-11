
from fastapi import Depends
from redis import Redis
from src.modules.auth.auth_service import AuthService
from src.modules.auth.session_service import SessionService
from src.cores.redis import redis_client
from src.modules.auth.jwt.jwt_service import JwtService
def get_redis_client(): 
    return redis_client 

def get_session_service(redis : Redis = Depends(get_redis_client)) -> SessionService: 
    return SessionService(redis) 

def get_jwt_service(): 
    return JwtService() 

def get_auth_service(session : SessionService = Depends(get_session_service) , jwt_service : JwtService = Depends(get_jwt_service)) -> AuthService: 
    return AuthService(session , jwt_service) 