from fastapi import FastAPI, APIRouter
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from src.modules.auth.auth_router import router as auth_router 
from src.modules.health.health_router import router as health_router 
from starlette.exceptions import HTTPException as StarletteHTTPException

app = FastAPI() 

v1_router = APIRouter(prefix='/api/v1')

v1_router.include_router(health_router) 
v1_router.include_router(auth_router) 

@app.exception_handler(RequestValidationError) 
async def validation_exception_handler(request , exec : RequestValidationError): 
    errors = [] 
    for err in exec.errors(): 
        field = err['loc'][-1] 
        message = err["msg"] 
        errors.append({
            "field": field, 
            "message": message 
        }) 
    return JSONResponse({
        "message": "Cloudian Notification Request", 
        "errors": errors 
    })

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request , exec): 
    return JSONResponse({
        "message": "Cloudian Notification", 
        "code": exec.status_code, 
        "detail": str(exec.detail) 
    })
app.include_router(v1_router) 