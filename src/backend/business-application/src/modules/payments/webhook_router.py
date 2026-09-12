from fastapi import APIRouter, Depends, status

from src.modules.payments.dependencies import get_payment_service
from src.modules.payments.dto import PayOSWebhookRequest
from src.modules.payments.service import PaymentService

router = APIRouter(tags=["Payments"])


@router.post(
    "/payments/payos/webhook",
    status_code=status.HTTP_200_OK,
    summary="Xử lý webhook thanh toán từ PayOS (Public, verify bằng HMAC-SHA256)",
)
async def handle_payos_webhook(
    payload: PayOSWebhookRequest,
    service: PaymentService = Depends(get_payment_service),
) -> dict:
    return await service.process_webhook(payload)
