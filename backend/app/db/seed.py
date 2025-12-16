from uuid import UUID
from sqlalchemy.orm import Session

from app.models.models import MachineModel


DEFAULT_MACHINE_ID = UUID("00000000-0000-0000-0000-000000000001")


def seed_machine(db: Session) -> None:
    machine = (
        db.query(MachineModel)
        .filter(MachineModel.id == DEFAULT_MACHINE_ID)
        .first()
    )

    if machine:
        return

    machine = MachineModel(
        id=DEFAULT_MACHINE_ID,
        name="Main Vending Machine",
    )

    db.add(machine)
    db.commit()
