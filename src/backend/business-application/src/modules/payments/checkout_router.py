from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, Path, status

from src.middlewares.auth_middleware import UserPayload, get_current_user
from src.modules.payments.dependencies import get_payment_service
from src.modules.payments.dto import EnrollmentView, PaymentTransactionView
from src.modules.payments.service import PaymentService

router = APIRouter(prefix="/courses", tags=["Payments"])


@router.post(
    "/{course_id}/checkout",
    response_model=PaymentTransactionView,
    status_code=status.HTTP_201_CREATED,
    summary="Khởi tạo đơn thanh toán VietQR qua PayOS",
)
async def create_payos_payment(
    course_id: Annotated[int, Path(description="Mã khóa học")],
    idempotency_key: Annotated[str | None, Header(alias="Idempotency-Key")] = None,
    user: UserPayload = Depends(get_current_user),
    service: PaymentService = Depends(get_payment_service),
) -> PaymentTransactionView:
    return await service.create_payment(
        student_id=user["sub"],
        course_id=course_id,
        idempotency_key=idempotency_key,
    )


@router.post("/{slug}/enroll")
async def enroll_course(
    slug: Annotated[str, Path()],
    user: dict = Depends(get_current_user),
    service: PaymentService = Depends(get_payment_service),
) -> EnrollmentView:
    user_id: int | None = user.get("sub", None)
    if not user_id:
        raise HTTPException(
            status_code=401, detail="Invalid user id in authorization token"
        )
    return await service.enroll_course(slug, user_id)
