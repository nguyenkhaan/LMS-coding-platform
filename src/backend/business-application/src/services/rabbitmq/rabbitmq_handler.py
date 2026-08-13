# Chua cac ham consume de xu ly du lieu khi ben khac tra su lieu ve 
from typing import Any 
async def handle_submission(data): 
    pass 

# ket qua tra ve ben trong result_queue 
async def handle_result(data : dict[str, Any]):
    id = data.get('id' , None) 
    status = data.get('status' , None) # status: running, pending, wrong_answer, tle, olm, ... 
    score = data.get('score' , None) 
    print('id' , id) 
    print('status' , status) 
    print('score' , score)