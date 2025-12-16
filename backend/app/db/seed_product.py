from sqlalchemy.orm import Session

from app.models.models import ProductModel, MachineProductModel
from app.core.config import DEFAULT_MACHINE_ID


DEMO_PRODUCTS = [
    {
        "name": "Coca Cola",
        "price": 35,
        "stock": 10,
        "image": "/images/coca-cola.png",
    },
    {
        "name": "Pepsi",
        "price": 35,
        "stock": 10,
        "image": "/images/pepsi.png",
    },
    {
        "name": "Water",
        "price": 20,
        "stock": 20,
        "image": "/images/water.png",
    },
    {
        "name": "Lays Chips",
        "price": 45,
        "stock": 8,
        "image": "/images/lays-chips.png",
    },
    {
        "name": "Snickers",
        "price": 40,
        "stock": 12,
        "image": "/images/snickers.png",
    },
]


def seed_products(db: Session) -> None:
    for item in DEMO_PRODUCTS:
        product = (
            db.query(ProductModel)
            .filter(ProductModel.name == item["name"])
            .first()
        )

        if not product:
            product = ProductModel(
                name=item["name"],
                price=item["price"],
                image=item["image"],
            )
            db.add(product)
            db.flush()

        machine_product = (
            db.query(MachineProductModel)
            .filter(
                MachineProductModel.machine_id == DEFAULT_MACHINE_ID,
                MachineProductModel.product_id == product.id,
            )
            .first()
        )

        if not machine_product:
            machine_product = MachineProductModel(
                machine_id=DEFAULT_MACHINE_ID,
                product_id=product.id,
                stock=item["stock"],
            )
            db.add(machine_product)

    db.commit()
