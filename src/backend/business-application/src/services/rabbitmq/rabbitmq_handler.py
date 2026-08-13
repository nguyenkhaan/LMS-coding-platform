# Chua cac ham consume de xu ly du lieu khi ben khac tra su lieu ve 
from typing import Any 
async def handle_submission(data): 
    pass 

# ket qua tra ve ben trong result_queue 
async def handle_result(data : dict[str, Any]):
    id = data.get('id' , None) 
    status = data.get('status' , None) 
    answer = data.get('answer' , None) 
    print('id' , id) 
    print('status' , status) 
    print('answer' , answer)