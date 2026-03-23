from rest_framework import serializers
from orders.models import Order
from orders.serializers import OrderItemSerializer


class AdminOrderSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.full_name", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)

    items = OrderItemSerializer(many=True, read_only=True)

    paymentMethod = serializers.CharField(source="payment_method")

    ordered_date = serializers.DateTimeField(
        source="created_at",
        format="%d %b %Y, %I:%M %p",
        read_only=True
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "user_name",
            "user_email",
            "total",          # matches your model
            "status",
            "paymentMethod",
            "ordered_date",
            "items",
        ]