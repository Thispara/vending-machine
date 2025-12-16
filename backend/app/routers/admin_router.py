from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from uuid import UUID, uuid4

from app.db.init_db import get_db
from app.service.admin_service import AdminService
from app.schemas.schemas import (
    Product,
    ProductCreate,
    ProductUpdate,
    MoneyItem,
    AdminProduct,
)
from pathlib import Path

router = APIRouter(tags=["Admin"])

IMAGE_DIR = Path(__file__).resolve().parent.parent.parent.parent / "images"
print(IMAGE_DIR)


def get_admin_service(db: Session = Depends(get_db)) -> AdminService:
    return AdminService(db)


@router.get("/products", response_model=list[AdminProduct])
def list_products(
    service: AdminService = Depends(get_admin_service),
):
    return service.list_products()


@router.post("/products", response_model=Product)
def create_product(
    name: str = Form(...),
    price: int = Form(...),
    stock: int = Form(...),
    image: UploadFile = File(...),
    service: AdminService = Depends(get_admin_service),
):
    IMAGE_DIR.mkdir(exist_ok=True)

    ext = Path(image.filename).suffix
    filename = f"{uuid4()}{ext}"

    file_path = IMAGE_DIR / filename

    with open(file_path, "wb") as f:
        f.write(image.file.read())

    image_path = f"/images/{filename}"


    data = ProductCreate(
        name=name,
        price=price,
        stock=stock,
        image=image_path,
    )

    return service.create_product(data)



@router.put("/products/{product_id}", response_model=AdminProduct)
def update_product(
    product_id: UUID,
    name: str = Form(...),
    price: int = Form(...),
    stock: int = Form(...),
    image: UploadFile | None = File(None),
    service: AdminService = Depends(get_admin_service),
):
    image_path = None

    if image:
        IMAGE_DIR.mkdir(exist_ok=True)
        ext = Path(image.filename).suffix
        filename = f"{uuid4()}{ext}"

        file_path = IMAGE_DIR / filename

        with open(file_path, "wb") as f:
            f.write(image.file.read())

        image_path = f"/images/{filename}"

    return service.update_product(
        product_id,
        name=name,
        price=price,
        stock=stock,
        image=image_path,
    )



@router.delete("/products/{product_id}", status_code=204)
def delete_product(
    product_id: UUID,
    service: AdminService = Depends(get_admin_service),
):
    service.delete_product(product_id)
    return None


@router.get("/balance", response_model=list[MoneyItem])
def get_balance(
    service: AdminService = Depends(get_admin_service),
):
    return service.list_balance()


@router.put("/balance", response_model=list[MoneyItem])
def set_balance(
    balance: list[MoneyItem],
    service: AdminService = Depends(get_admin_service),
):
    print(balance)
    return service.set_balance(balance)

