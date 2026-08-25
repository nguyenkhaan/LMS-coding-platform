from fastapi import APIRouter 

router = APIRouter(
    prefix = '/teacher'
) 

@router.get('/') 
async def get_teacher_information(): 
    return "Hello world"