from app.domain.types import Money, PurchaseResult
from app.domain.change import greedy_change

def purchase(
    product_price: int,
    product_stock: int,
    machine_balance: dict[int, int],
    inserted_money: list[Money],
) -> PurchaseResult:

    if product_stock <= 0:
        raise ValueError("OUT_OF_STOCK")

    paid_amount = sum(
        money.denomination * money.quantity
        for money in inserted_money
    )

    if paid_amount < product_price:
        raise ValueError("INSUFFICIENT_FUNDS")

    change_amount = paid_amount - product_price

    balance = machine_balance.copy()
    for money in inserted_money:
        balance[money.denomination] = (
            balance.get(money.denomination, 0) + money.quantity
        )

    change = greedy_change(balance, change_amount)

    return PurchaseResult(
        change=change,
        paid_amount=paid_amount,
        product_price=product_price,
    )