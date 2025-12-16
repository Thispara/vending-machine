import pytest
from app.domain.types import Money
from app.domain.purchase import purchase

def test_success_can_make_change_with_inserted_money_counted():
    machine_balance = {10: 0, 5: 0, 1: 0}
    inserted = [Money(10, 1), Money(5, 1), Money(1, 5)] 
    result = purchase(
        product_price=12,
        product_stock=1,
        machine_balance=machine_balance,
        inserted_money=inserted,
    )

    assert result.change[5] == 1
    assert result.change[1] == 3

def test_fail_out_of_stock():
    with pytest.raises(ValueError) as e:
        purchase(
            product_price=10,
            product_stock=0,
            machine_balance={1: 10},
            inserted_money=[Money(10, 1)],
        )
    assert str(e.value) == "OUT_OF_STOCK"

def test_fail_insufficient_funds():
    with pytest.raises(ValueError) as e:
        purchase(
            product_price=30,
            product_stock=1,
            machine_balance={10: 10},
            inserted_money=[Money(10, 2)],
        )
    assert str(e.value) == "INSUFFICIENT_FUNDS"

def test_fail_cannot_make_change():
    with pytest.raises(ValueError) as e:
        purchase(
            product_price=35,
            product_stock=1,
            machine_balance={50: 10},
            inserted_money=[Money(50, 1)],
        )
    assert str(e.value) == "CANNOT_MAKE_CHANGE"
