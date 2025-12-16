from sqlalchemy import Column, Integer, String, UUID, Enum, DateTime, ForeignKey
from pydantic import BaseModel
from datetime import datetime, UTC
from app.db.database import Base
from sqlalchemy import Column, text
class ProductModel(Base):
    __tablename__ = "products"

    id = Column(UUID, primary_key=True, index=True, server_default=text("gen_random_uuid()"))
    name = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    image = Column(String, nullable=False)
    created_at = Column(
    DateTime(timezone=True),
    default=lambda: datetime.now(UTC),
)
    updated_at = Column(
    DateTime(timezone=True),
    default=lambda: datetime.now(UTC),
    onupdate=lambda: datetime.now(UTC),
)

class MachineProductModel(Base):
    __tablename__ = "machine_products"

    machine_id = Column(UUID, ForeignKey("machines.id"), primary_key=True)
    product_id = Column(UUID, ForeignKey("products.id"), primary_key=True)
    stock = Column(Integer, nullable=False)
    created_at = Column(
    DateTime(timezone=True),
    default=lambda: datetime.now(UTC),
)
    updated_at = Column(
    DateTime(timezone=True),
    default=lambda: datetime.now(UTC),
    onupdate=lambda: datetime.now(UTC),
)

class BalanceModel(Base):
    __tablename__ = "balances"

    id = Column(String, primary_key=True)  # nanoid
    machine_id = Column(UUID, ForeignKey("machines.id"))
    denomination = Column(Integer, nullable=False, unique=True)
    amount = Column(Integer, nullable=False)
    type = Column(Enum("coin", "banknote", name="balance_type"))


class MachineModel(Base):
    __tablename__ = "machines"

    id = Column(UUID, primary_key=True, index=True, server_default=text("gen_random_uuid()"))
    name = Column(String, nullable=False)

class TransactionLogModel(Base):
    __tablename__ = "transaction_logs"

    id = Column(UUID, primary_key=True, index=True, server_default=text("gen_random_uuid()"))
    machine_id = Column(UUID, ForeignKey("machines.id"))
    product_id = Column(UUID, ForeignKey("products.id"))

    product_price = Column(Integer, nullable=False)
    paid_amount = Column(Integer, nullable=False)
    change_amount = Column(Integer, nullable=False)

    status = Column(
        Enum("success", "cancel", "insufficient_balance", name="tx_status"),
        nullable=False
    )

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))

class TransactionMoneyModel(Base):
    __tablename__ = "transaction_money"

    id = Column(String, primary_key=True, index=True) # nanoid
    transaction_id = Column(
        UUID,
        ForeignKey("transaction_logs.id"),
        nullable=False
    )

    denomination = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)

    direction = Column(
        Enum("inserted", "change", name="money_direction"),
        nullable=False
    )

class UserModel(Base):
    __tablename__ = "users"

    id = Column(UUID, primary_key=True, index=True, server_default=text("gen_random_uuid()"))
    username = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))
    
    
