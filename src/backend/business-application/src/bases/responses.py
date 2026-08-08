from pydantic import BaseModel, Field
from typing import List, Dict, Any

class ErrorResponse(BaseModel):
    message: str = Field(..., description="Chi tiết thông báo lỗi thân thiện với người dùng")
    error_code: str = Field(..., description="Mã lỗi phân loại, ví dụ: 'RESOURCE_NOT_FOUND'")
    details: List[Dict[str, Any]] = Field(default=[], description="Thông tin chi tiết về lỗi (validation errors, field errors...)")
