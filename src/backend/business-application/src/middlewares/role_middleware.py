

from fastapi import Depends, HTTPException

from src.middlewares.auth_middleware import get_current_user

def require_role(*roles : str): 
    print(roles) 
    async def get_current_user_role(
        user = Depends(get_current_user)
    ): 
        print(type(user)) 
        pass 
        user_roles = user.get('roles') 
        if not user_roles: 
            raise HTTPException(
                status_code = 401, 
                detail="Invalid user information", 
                headers={"WWW-Authenticate": "Bearer"},
            )
        allowed = False 
        for role in roles: 
            if role in user_roles: 
                allowed = True 
                break 
        if not allowed: 
            raise HTTPException(
                status_code = 403, 
                detail="User don't have permission to this resource"
            ) 
        return user 
    return get_current_user_role