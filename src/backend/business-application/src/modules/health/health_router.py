from fastapi import APIRouter, HTTPException
router = APIRouter(
    prefix="/health", 
    tags=["Health"]
) 

@router.get("/liveness") 
async def liveness(): 
    return {
        "message": "Your application is running. Build with Cloudian 💙 Cloud"
    }

@router.get("/error") 
async def error(): 
    raise HTTPException(
        status_code = 400, 
        detail = "Testing error"
    )

@router.get("/scalar") 
async def scalar(): 
    return "This is a single line"