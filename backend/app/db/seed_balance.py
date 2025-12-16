from sqlalchemy.orm import Session

from app.models.models import BalanceModel
from app.core.config import DEFAULT_MACHINE_ID
from nanoid import generate

DEMO_BALANCES = [
    {
        "denomination": 1,
        "amount": 10,
        "type": "coin",
    },
    {
        "denomination": 5,
        "amount": 10,
        "type": "coin",
    },
    {
        "denomination": 10,
        "amount": 10,
        "type": "coin",
    },
    {
        "denomination": 20,
        "amount": 10,
        "type": "banknote",
    },
    {
        "denomination": 50,
        "amount": 10,
        "type": "banknote",
    },
    {
        "denomination": 100,
        "amount": 10,
        "type": "banknote",
    },
    {
        "denomination": 500,
        "amount": 10,
        "type": "banknote",
    },
    {
        "denomination": 1000,
        "amount": 10,
        "type": "banknote",
    },
]

def seed_balance(db: Session) -> None:
    for item in DEMO_BALANCES:
        balance = (
            db.query(BalanceModel)
            .filter(BalanceModel.denomination == item["denomination"])
            .first()
        )

        if not balance:
            balance = BalanceModel(
                id=generate(),
                machine_id=DEFAULT_MACHINE_ID,
                denomination=item["denomination"],
                amount=item["amount"],
                type=item["type"],
            )
            db.add(balance)
            db.flush()

    db.commit()