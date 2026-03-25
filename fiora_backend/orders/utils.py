from django.db.models import F

def handle_cancel_order(order):
    # restore stock
    for item in order.items.all():
        product = item.product
        product.stock = F("stock") + item.quantity
        product.save()

    # update status
    order.status = "cancelled"

    # payment logic
    if order.payment_method == "cod":
        order.payment_status = "cancelled"
    elif order.payment_method == "upi":
        order.payment_status = "refunded"

    order.save()