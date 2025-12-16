from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Literal
from uuid import UUID

class Product(BaseModel):
    id: UUID
    name: str
    price: int
    stock: int
    image: str

    model_config = ConfigDict(from_attributes=True)

class AdminProduct(Product):
    total_sold: int


class ProductCreate(BaseModel):
    name: str
    price: int
    stock: int
    image: str


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[int] = None
    stock: Optional[int] = None
    image: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str


class UserRegister(BaseModel):
    username: str
    password: str

class MoneyResponse(BaseModel):
    denomination: int
    quantity: int
    type: Literal["coin", "banknote"]

class MoneyItem(BaseModel):
    denomination: int
    quantity: int

class PurchaseRequest(BaseModel):
    product_id: UUID
    inserted_money: List[MoneyItem]

class PurchaseResponse(BaseModel):
    product_name: str
    paid_amount: int
    change_amount: int
    change: dict[int, int]


class Balance(BaseModel):
    id: UUID
    machine_id: UUID
    denomination: int
    amount: int
    type: Literal["coin", "banknote"]

