from sqlalchemy.orm import Session
from fastapi import HTTPException
from uuid import UUID

from app.models.models import (
    ProductModel,
    MachineProductModel,
    BalanceModel,
    TransactionLogModel,
)
from app.schemas.schemas import (
    Product,
    ProductCreate,
    ProductUpdate,
    MoneyItem,
    MoneyResponse,
    AdminProduct
)
from nanoid import generate
from app.core.config import BASE_URL, DEFAULT_MACHINE_ID



class AdminService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_total_sold_by_id(self, product_id: UUID) -> int:
        count = self.db.query(TransactionLogModel).filter(
            TransactionLogModel.machine_id == DEFAULT_MACHINE_ID,
            TransactionLogModel.product_id == product_id,
        ).count()
        print(count)
        return count
    
    def list_products(self) -> list[AdminProduct]:
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
            AdminProduct(
                id=p.id,
                name=p.name,
                price=p.price,
                stock=mp.stock,
                image=f"{BASE_URL}{p.image}",
                total_sold=self.get_total_sold_by_id(p.id),
            )
            for p, mp in products
        ]

    def create_product(self, data: ProductCreate) -> Product:
        product = ProductModel(
            name=data.name,
            price=data.price,
            image=data.image,
        )
        self.db.add(product)
        self.db.flush() 

        machine_product = MachineProductModel(
            machine_id=DEFAULT_MACHINE_ID,
            product_id=product.id,
            stock=data.stock,
        )
        self.db.add(machine_product)

        self.db.commit()
        self.db.refresh(product)

        return Product(
            id=product.id,
            name=product.name,
            price=product.price,
            stock=machine_product.stock,
            image=f"{BASE_URL}{product.image}",
        )

    def update_product(
        self,
        product_id: UUID,
        name: str,
        price: int,
        stock: int,
        image: str | None = None,
    ) -> AdminProduct:
        product = self.db.query(ProductModel).filter_by(id=product_id).first()
        mp = self.db.query(MachineProductModel).filter_by(
            product_id=product_id,
            machine_id=DEFAULT_MACHINE_ID,
        ).first()

        product.name = name
        product.price = price
        mp.stock = stock

        if image:
            product.image = image

        self.db.commit()

        return AdminProduct(
            id=product.id,
            name=product.name,
            price=product.price,
            stock=mp.stock,
            image=f"{BASE_URL}{product.image}",
            total_sold=self.get_total_sold_by_id(product.id),
        )


    def delete_product(self, product_id: UUID) -> None:
        mp = (
            self.db.query(MachineProductModel)
            .filter(
                MachineProductModel.machine_id == DEFAULT_MACHINE_ID,
                MachineProductModel.product_id == product_id,
            )
            .first()
        )

        product = (
            self.db.query(ProductModel)
            .filter(ProductModel.id == product_id)
            .first()
        )

        if not product or not mp:
            raise HTTPException(404, "Product not found")

        self.db.delete(mp)
        self.db.delete(product)
        self.db.commit()

    def list_balance(self) -> list[MoneyItem]:
        balances = (
            self.db.query(BalanceModel)
            .filter(BalanceModel.machine_id == DEFAULT_MACHINE_ID)
            .all()
        )

        return [
            MoneyResponse(
                denomination=b.denomination,
                quantity=b.amount,
                type=b.type,
            )
            for b in balances
        ]

    def set_balance(self, items: list[MoneyItem]) -> list[MoneyItem]:
        for item in items:
            balance = (
                self.db.query(BalanceModel)
                .filter(
                    BalanceModel.machine_id == DEFAULT_MACHINE_ID,
                    BalanceModel.denomination == item.denomination,
                )
                .first()
            )

            if balance:
                balance.amount = item.quantity
            else:
                self.db.add(
                    BalanceModel(
                        id=generate(),
                        machine_id=DEFAULT_MACHINE_ID,
                        denomination=item.denomination,
                        amount=item.quantity,
                    )
                )

        self.db.commit()
        return items

    def get_total_sold(self) -> int:
        return self.db.query(TransactionLogModel).filter(
            TransactionLogModel.machine_id == DEFAULT_MACHINE_ID
        ).count()

    def get_total_earned(self) -> int:
        return self.db.query(TransactionLogModel).filter(
            TransactionLogModel.machine_id == DEFAULT_MACHINE_ID
        ).sum(TransactionLogModel.amount)