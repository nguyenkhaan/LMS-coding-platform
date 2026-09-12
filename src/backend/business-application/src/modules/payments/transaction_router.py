from typing import Annotated

from fastapi import APIRouter, Depends, Path, status

from src.middlewares.auth_middleware import UserPayload, get_current_user
from src.models.base_model import Role
from src.modules.payments.dependencies import get_payment_service
from src.modules.payments.dto import (
    CancelTransactionResponse,
    TransactionStatusResponse,
)
from src.modules.payments.service import PaymentService

router = APIRouter(tags=["Payments"])


@router.get(
    "/payments/transactions/{transaction_code}",
    response_model=TransactionStatusResponse,
    status_code=status.HTTP_200_OK,
    summary="Kiểm tra trạng thái giao dịch (Frontend Polling)",
)
async def get_transaction_status(
    transaction_code: Annotated[
        str, Path(description="Mã giao dịch LMS, vd: TXN-123456")
    ],
    user: UserPayload = Depends(get_current_user),
    service: PaymentService = Depends(get_payment_service),
) -> TransactionStatusResponse:
    return await service.get_transaction_status(
        transaction_code=transaction_code,
        user_id=user["sub"],
        is_admin=Role.ADMIN in user["roles"],
    )


@router.post(
    "/payments/transactions/{transaction_code}/cancel",
    response_model=CancelTransactionResponse,
    status_code=status.HTTP_200_OK,
    summary="Hủy giao dịch thanh toán",
)
async def cancel_payment_transaction(
    transaction_code: Annotated[str, Path(description="Mã giao dịch LMS")],
    user: UserPayload = Depends(get_current_user),
    service: PaymentService = Depends(get_payment_service),
) -> CancelTransactionResponse:
    return await service.cancel_transaction(
        transaction_code=transaction_code, user_id=user["sub"]
    )
