from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth

from products.models import Product
from orders.models import Order
from users.models import User
from django.db.models import Q
from orders.models import Order
from .serializers import AdminOrderSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi



# ✅ 1. DASHBOARD STATS API
class AdminDashboardAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_products = Product.objects.count()
        total_users = User.objects.count()
        total_orders = Order.objects.count()

        total_revenue = (
            Order.objects
            .filter(payment_status="paid")
            .aggregate(total=Sum("total"))["total"]   # ✅ FIXED
            or 0
        )

        active_users = User.objects.filter(is_active=True).count()

        return Response({
            "totalUsers": total_users,
            "activeUsers": active_users,
            "totalOrders": total_orders,
            "totalRevenue": total_revenue,
            "totalProducts": total_products,
        })


# ✅ 2. MONTHLY REVENUE API
class AdminRevenueAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        queryset = (
            Order.objects
            .filter(payment_status="paid")
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(revenue=Sum("total"))   # ✅ FIXED
            .order_by("month")
        )

        data = []
        for item in queryset:
            data.append({
                "month": item["month"].strftime("%b"),
                "revenue": item["revenue"] or 0
            })

        return Response(data)


# ✅ 3. ORDER STATUS API
class AdminOrderStatusAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        data = (
            Order.objects
            .values("status")
            .annotate(count=Count("id"))
        )

        result = []
        for item in data:
            result.append({
                "name": item["status"].capitalize(),
                "value": item["count"],
                "count": item["count"],
            })

        return Response(result)


# ✅ 4. CATEGORY DISTRIBUTION API
class AdminCategoryAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        data = (
            Product.objects
            .values("category__name")
            .annotate(count=Count("id"))
        )

        total = Product.objects.count() or 1

        result = []
        for item in data:
            result.append({
                "name": item["category__name"] or "Uncategorized",
                "count": item["count"],
                "percentage": round((item["count"] / total) * 100, 1),
            })

        return Response(result)





class AdminOrderListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        status = request.GET.get("status", "all")
        search = request.GET.get("search", "").strip()

        orders = (
            Order.objects
            .select_related("user")
            .prefetch_related("items__product")
            .order_by("-created_at")
        )

        # 🔹 Status filter
        if status != "all":
            orders = orders.filter(status=status)

        # 🔹 Search filter
        if search:
            if search.isdigit():
                orders = orders.filter(id=int(search))
            else:
                orders = orders.filter(
                    Q(user__full_name__icontains=search) |
                    Q(user__email__icontains=search)
                )

        serializer = AdminOrderSerializer(orders, many=True)
        return Response(serializer.data)        
    

class AdminOrderStatusUpdateAPIView(APIView):
    permission_classes = [IsAdminUser]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['status'],
            properties={
                'status': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    enum=['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
                )
            },
        )
    )

    def patch(self, request, order_id):
        new_status = request.data.get("status")

        # ✅ validate status
        if new_status not in dict(Order._meta.get_field("status").choices):
            return Response({"error": "Invalid status"}, status=400)

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=404)

        order.status = new_status
        order.save()

        return Response({
            "success": True,
            "order_id": order.id,
            "new_status": order.status
        })    
    
class AdminOrderStatsAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({
            "total_orders": Order.objects.count(),
            "pending": Order.objects.filter(status="pending").count(),
            "confirmed": Order.objects.filter(status="confirmed").count(),
            "shipped": Order.objects.filter(status="shipped").count(),
            "delivered": Order.objects.filter(status="delivered").count(),
            "cancelled": Order.objects.filter(status="cancelled").count(),
        })    





class AdminUserListAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.all().order_by("-id")

        data = []

        for user in users:
            orders= user.orders.all()

            total_orders = orders.count()
            total_spent = sum(
                o.total for o in orders if o.payment_status == "paid"
            )

            data.append({
                "id": user.id,
                "Username": user.username,
                "email": user.email,
                "isBlock": not user.is_active,
                "role": "admin" if user.is_staff else "user",
                "orders": [
                    {
                        "total": o.total,
                        "paymentStatus": o.payment_status
                    } for o in orders
                ]
            })

        return Response(data)  




class AdminUserUpdateAPIView(APIView):
    permission_classes = [IsAdminUser]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'isBlock': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                'role': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    enum=['admin', 'user']
                ),
            },
        )
    )
    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        # Block / Unblock
        if "isBlock" in request.data:
            user.is_active = not request.data.get("isBlock")

        # Role change
        if "role" in request.data:
            user.is_staff = request.data["role"] == "admin"

        user.save()

        return Response({
            "id": user.id,
            "Username": user.username,
            "email": user.email,
            "isBlock": not user.is_active,
            "role": "admin" if user.is_staff else "user"
        })