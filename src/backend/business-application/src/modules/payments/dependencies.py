from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.db import get_db_session
from src.modules.payments.service import PaymentService


def get_payment_service(
    db: AsyncSession = Depends(get_db_session),
) -> PaymentService:
    return PaymentService(db)
