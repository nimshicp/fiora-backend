from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem
        fields = ['product','quantity','price']


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user','status','payment_status']

    def create(self, validated_data):

        items_data = validated_data.pop('items')
        user = self.context['request'].user

        order = Order.objects.create(user=user, **validated_data)

        for item in items_data:
            OrderItem.objects.create(order=order, **item)

        return order