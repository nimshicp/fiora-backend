from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer
from cart.models import Cart
from rest_framework.generics import RetrieveAPIView
from django.db import transaction
from django.db.models import F
from .utils import handle_cancel_order



class CheckoutAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        cart_items = Cart.objects.filter(user=request.user)

        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=400)

        total_amount = sum(
            item.product.price * item.quantity
            for item in cart_items
        )

        return Response({
            "amount": total_amount
        })





class OrderDetailAPIView(RetrieveAPIView):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)




class CreateOrderView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        serializer = OrderSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():

            order = serializer.save()

            # 🔥 REDUCE STOCK HERE
            for item in order.items.all():
                product = item.product

                if product.stock < item.quantity:
                    return Response({"error": "Not enough stock"}, status=400)

                product.stock = F("stock") - item.quantity
                product.save()

            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

class MyOrdersView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        orders = Order.objects.filter(user=request.user)

        serializer = OrderSerializer(orders, many=True)

        return Response(serializer.data)
    



class CancelOrderAPIView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        order = Order.objects.get(
            id=request.data.get("order_id"),
            user=request.user
        )

        if order.status == "cancelled":
            return Response({"error": "Order already cancelled"}, status=400)

        handle_cancel_order(order)  

        return Response({"success": True})


class CODPaymentAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):

        try:
            order = Order.objects.get(id=order_id, user=request.user)

            order.payment_method = "cod"
            order.payment_status = "pending"
            order.status = "confirmed"

            order.save()

            return Response({
                "success": True,
                "order_id": order.id
            })

        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)  
        

class UPIPaymentAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):

        upi_id = request.data.get("upi_id")

        if not upi_id:
            return Response({"error": "UPI ID required"}, status=400)

        try:
            order = Order.objects.get(id=order_id, user=request.user)

            order.payment_method = "upi"
            order.payment_status = "paid"
            order.status = "confirmed"

            order.save()

            return Response({
                "success": True,
                "order_id": order.id
            })

        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)               



import razorpay
from django.conf import settings

class RazorpayOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):

        order = Order.objects.get(id=order_id, user=request.user)

        client = razorpay.Client(auth=(
            settings.RAZORPAY_KEY_ID,
            settings.RAZORPAY_SECRET
        ))

        payment = client.order.create({
            "amount": int(order.total * 100),
            "currency": "INR",
            "payment_capture": 1
        })

        order.razorpay_order_id = payment["id"]
        order.save()

        return Response({
            "razorpay_order_id": payment["id"],
            "amount": payment["amount"],
            "key": settings.RAZORPAY_KEY_ID
        })


class VerifyPaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        data = request.data

        client = razorpay.Client(auth=(
            settings.RAZORPAY_KEY_ID,
            settings.RAZORPAY_SECRET
        ))

        try:
            client.utility.verify_payment_signature({
                'razorpay_order_id': data['razorpay_order_id'],
                'razorpay_payment_id': data['razorpay_payment_id'],
                'razorpay_signature': data['razorpay_signature'],
            })

            order = Order.objects.get(
                razorpay_order_id=data['razorpay_order_id']
            )

            order.payment_method = "razorpay"
            order.payment_status = "paid"
            order.status = "confirmed"
            order.save()

            return Response({"success": True})

        except:
            return Response({"error": "Verification failed"}, status=400)         


class UpdateOrderAddressAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, order_id):
        order = Order.objects.get(id=order_id, user=request.user)

        if order.status != "pending":
            return Response({"error": "Cannot edit after confirmation"}, status=400)

        order.shipping_address = request.data.get("address")
        order.save()

        return Response({"success": True})                   