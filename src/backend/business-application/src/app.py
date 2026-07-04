from fastapi import FastAPI, APIRouter

app = FastAPI() 

v1_router = APIRouter(prefix='/api/v1')

app.include_router(v1_router) 