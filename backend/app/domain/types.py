# app/domain/types.py
from dataclasses import dataclass

@dataclass(frozen=True)
class Money:
    denomination: int
    quantity: int

@dataclass
class PurchaseResult:
    change: dict[int, int]
    paid_amount: int
    product_price: int
