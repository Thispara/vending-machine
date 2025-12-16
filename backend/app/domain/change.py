from typing import List, Dict
from app.schemas.schemas import MoneyItem


def calculate_total_money(money: List[MoneyItem]) -> int:
    return sum(m.denomination * m.quantity for m in money)


def merge_balance(
    current_balance: Dict[int, int],
    inserted_money: List[MoneyItem],
) -> Dict[int, int]:
    merged = current_balance.copy()

    for m in inserted_money:
        merged[m.denomination] = merged.get(m.denomination, 0) + m.quantity

    return merged


def greedy_change(
    balance: Dict[int, int],
    change_amount: int,
) -> Dict[int, int]:
    change: Dict[int, int] = {}

    for denom in sorted(balance.keys(), reverse=True):
        if change_amount <= 0:
            break

        available = balance[denom]
        needed = change_amount // denom
        used = min(available, needed)

        if used > 0:
            change[denom] = used
            change_amount -= denom * used

    if change_amount != 0:
        raise ValueError("CANNOT_MAKE_CHANGE")

    return change
