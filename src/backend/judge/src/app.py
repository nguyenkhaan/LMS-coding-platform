from contextlib import asynccontextmanager

from fastapi import FastAPI , APIRouter
from fastapi.middleware.cors import CORSMiddleware

from src.consumers.submission_execution_consumer import process_submission_execution_request
from src.messaging.rabbitmq_manager import RabbitMQManager
from src.bases.constants.submission_queues import SUBMISSION_EXECUTION_QUEUE
from src.cores.settings import RABBITMQ_URL
@asynccontextmanager 
async def lifespan(app : FastAPI): 
    rabbitmq_manager = RabbitMQManager(
        url = RABBITMQ_URL
    )  
    await rabbitmq_manager.connect()
    async def handle_submission_execution_request(submission_execution_request):
        await process_submission_execution_request(
            submission_execution_request,
            rabbitmq_manager
        )
    await rabbitmq_manager.consume(
        SUBMISSION_EXECUTION_QUEUE,
        handle_submission_execution_request # Bo sung them ham handler vao day
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
