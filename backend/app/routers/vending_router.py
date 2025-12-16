from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.init_db import get_db
from app.service.vending_service import VendingService
from app.schemas.schemas import (
    Product,
    PurchaseRequest,
    PurchaseResponse,
)

router = APIRouter(tags=["Vending"])

def get_vending_service(
    db: Session = Depends(get_db),
) -> VendingService:
    return VendingService(db)

@router.get("/products", response_model=list[Product])
def get_products(
    service: VendingService = Depends(get_vending_service),
):
    return service.get_products()


@router.post("/buy/product", response_model=PurchaseResponse)
def buy_product(
    req: PurchaseRequest,
    service: VendingService = Depends(get_vending_service),
):
    return service.buy_product(req)
