

from fastapi import Depends, HTTPException

from src.models.base_model import Role
from src.middlewares.auth_middleware import UserPayload, get_current_user


def require_role(*roles: str):
    async def get_current_user_role(
        user: UserPayload = Depends(get_current_user),
    ) -> UserPayload:
        user_roles = user.get("roles")
        if not user_roles:
            raise HTTPException(
                status_code=401,
                detail="Invalid user information",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Admin role bypasses all other role restrictions.
        if Role.ADMIN in user_roles:
            return user
        allowed = any(role in user_roles for role in roles)
        if not allowed:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to access this resource",
            )
        return user
    return get_current_user_role