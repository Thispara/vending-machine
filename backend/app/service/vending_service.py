from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.models import (
    ProductModel,
    MachineProductModel,
    BalanceModel,
    TransactionLogModel,
    TransactionMoneyModel,
)
from app.schemas.schemas import (
    Product,
    MoneyItem,
    PurchaseRequest,
    PurchaseResponse,
)
from app.domain.change import (
    calculate_total_money,
    merge_balance,
    greedy_change,
)
from uuid import UUID
from nanoid import generate
from datetime import datetime

DEFAULT_MACHINE_ID = UUID("00000000-0000-0000-0000-000000000001")


class VendingService:
    def __init__(self, db: Session):
        self.db = db

    def _get_product_or_404(self, product_id: UUID) -> ProductModel:
        product = (
            self.db.query(ProductModel)
            .filter(ProductModel.id == product_id)
            .first()
        )
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

    def _get_machine_product_or_404(
        self, product_id: UUID
    ) -> MachineProductModel:
        mp = (
            self.db.query(MachineProductModel)
            .filter(
                MachineProductModel.machine_id == DEFAULT_MACHINE_ID,
                MachineProductModel.product_id == product_id,
            )
            .first()
        )
        if not mp:
            raise HTTPException(
                status_code=404,
                detail="Product not found in vending machine",
            )
        return mp

    def _get_machine_balance(self) -> dict[int, int]:
        balances = (
            self.db.query(BalanceModel)
            .filter(BalanceModel.machine_id == DEFAULT_MACHINE_ID)
            .all()
        )
        return {b.denomination: b.amount for b in balances}

    def get_products(self) -> list[Product]:
        products = (
            self.db.query(ProductModel, MachineProductModel)
            .join(
                MachineProductModel,
                ProductModel.id == MachineProductModel.product_id,
            )
            .filter(MachineProductModel.machine_id == DEFAULT_MACHINE_ID)
            .all()
        )

        return [
            Product(
                id=p.id,
                name=p.name,
                price=p.price,
                stock=mp.stock,
                image=f"http://localhost:8000/api/v1{p.image}",
            )
            for p, mp in products
        ]

    def buy_product(
        self,
        req: PurchaseRequest,
    ) -> PurchaseResponse:


        product = self._get_product_or_404(req.product_id)
        machine_product = self._get_machine_product_or_404(req.product_id)

        if machine_product.stock <= 0:
            raise HTTPException(
                status_code=400,
                detail="Product out of stock",
            )

        total_paid = calculate_total_money(req.inserted_money)

        if total_paid < product.price:
            raise HTTPException(
                status_code=400,
                detail="Insufficient funds",
            )

        change_amount = total_paid - product.price

        current_balance = self._get_machine_balance()

        merged_balance = merge_balance(
            current_balance,
            req.inserted_money,
        )

        try:
            change = greedy_change(
                merged_balance,
                change_amount,
            )
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Machine cannot provide change",
            )


        tx = TransactionLogModel(
            machine_id=DEFAULT_MACHINE_ID,
            product_id=product.id,
            product_price=product.price,
            paid_amount=total_paid,
            change_amount=change_amount,
            status="success",
            created_at=datetime.utcnow(),
        )
        self.db.add(tx)
        self.db.flush() 

        for m in req.inserted_money:
            self.db.add(
                TransactionMoneyModel(
                    id=generate(),
                    transaction_id=tx.id,
                    denomination=m.denomination,
                    quantity=m.quantity,
                    direction="inserted",
                )
            )

        for denom, qty in change.items():
            self.db.add(
                TransactionMoneyModel(
                    id=generate(),
                    transaction_id=tx.id,
                    denomination=denom,
                    quantity=qty,
                    direction="change",
                )
            )
            merged_balance[denom] -= qty

        for denom, amount in merged_balance.items():
            balance_row = (
                self.db.query(BalanceModel)
                .filter(
                    BalanceModel.machine_id == DEFAULT_MACHINE_ID,
                    BalanceModel.denomination == denom,
                )
                .first()
            )

            if balance_row:
                balance_row.amount = amount
            else:
                self.db.add(
                    BalanceModel(
                        id=generate(),
                        machine_id=DEFAULT_MACHINE_ID,
                        denomination=denom,
                        amount=amount,
                        type="coin" if denom < 20 else "banknote",
                    )
                )

        machine_product.stock -= 1

        self.db.commit()

        return PurchaseResponse(
            product_name=product.name,
            paid_amount=total_paid,
            change_amount=change_amount,
            change=change,
        )

