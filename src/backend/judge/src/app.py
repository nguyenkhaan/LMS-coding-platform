from contextlib import asynccontextmanager

from fastapi import FastAPI , APIRouter
from fastapi.middleware.cors import CORSMiddleware

from src.handlers.submission_handler import submission_handler_result
from src.modules.rabbitmq_manager import RabbitMQManger
from src.bases.constants.rabbit_queue import SUBMISSION_QUEUE
from src.cores.settings import RABBITMQ_URL
@asynccontextmanager 
async def lifespan(app : FastAPI): 
    rabbitmq_manager = RabbitMQManger(
        url = RABBITMQ_URL
    )  
    await rabbitmq_manager.connect()
    async def handle_submission(job): 
        await submission_handler_result(
            job, 
            rabbitmq_manager
        )
    await rabbitmq_manager.consume(
        SUBMISSION_QUEUE, 
        handle_submission # Bo sung them ham handler vao day 
    )
    app.state.rabbitmq_manager = rabbitmq_manager
    yield 
    await rabbitmq_manager.close() 

app = FastAPI(
    lifespan=lifespan
) 

api_router = APIRouter(prefix="/api") 


# Setup cors 
origins = [
    'http://localhost:4000'
] 
app.add_middleware(
    CORSMiddleware, 
    allow_credentials=True, 
    allow_origins=origins, 
    allow_methods=['*'], 
    allow_headers=['Content-Type', 'Authorization']
)

# lifespan 

# router 
@api_router.get('/health') 
async def health(): 
    return "Judge service is running. Build with Cloudian 💙 Cloud"

app.include_router(api_router)