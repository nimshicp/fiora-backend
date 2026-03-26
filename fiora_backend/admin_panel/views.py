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
from django.contrib import admin
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from orders.utils import handle_cancel_order
from rest_framework.pagination import PageNumberPagination


class AdminListPagination(PageNumberPagination):
    page_size = 8


def serialize_admin_user(user):
    return {
        "id": user.id,
        "Username": user.username,
        "email": user.email,
        "isBlock": not user.is_active,
        "role": user.role,
        "orders": [
            {
                "total": o.total,
                "paymentStatus": o.payment_status
            } for o in user.orders.all()
        ]
    }




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
                    Q(user__username__icontains=search) |
                    Q(user__email__icontains=search)
                )

        if request.GET.get("all") == "true":
            serializer = AdminOrderSerializer(orders, many=True)
            return Response(serializer.data)

        paginator = AdminListPagination()
        page = paginator.paginate_queryset(orders, request)
        serializer = AdminOrderSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
    

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

        if new_status == "cancelled":
            
            handle_cancel_order(order)
        else:
            order.status = new_status
            order.save()

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{order.user.id}",
            {
                "type": "send_notification",
                "message": f"Your order is now {order.status}"
            }
        )

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
        search = request.GET.get("search", "").strip()

        users = User.objects.prefetch_related("orders").order_by("-id")

        if search:
            users = users.filter(
                Q(email__icontains=search) |
                Q(username__icontains=search)
            )

        if request.GET.get("all") == "true":
            return Response([serialize_admin_user(user) for user in users])

        paginator = AdminListPagination()
        page = paginator.paginate_queryset(users, request)
        data = [serialize_admin_user(user) for user in page]
        return paginator.get_paginated_response(data)





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

        current_user = request.user

        
        if user.id == current_user.id:
            return Response({"error": "You cannot modify yourself"}, status=400)

        
        if user.role == "superadmin":
            return Response({"error": "Cannot modify superadmin"}, status=400)

        
        if "role" in request.data:
            if current_user.role != "superadmin":
                return Response({"error": "Only superadmin can change roles"}, status=403)

            new_role = request.data["role"]

            if new_role not in ["admin", "user"]:
                return Response({"error": "Invalid role"}, status=400)

            user.role = new_role

            # update is_staff automatically
            user.is_staff = new_role == "admin"

        # 🟡 BLOCK / UNBLOCK (ADMIN + SUPERADMIN)
        if "isBlock" in request.data:
            if current_user.role not in ["admin", "superadmin"]:
                return Response({"error": "Not allowed"}, status=403)

            user.is_active = not request.data.get("isBlock")

        user.save()

        return Response({
            "id": user.id,
            "Username": user.username,
            "email": user.email,
            "isBlock": not user.is_active,
            "role": user.role
        })
    



class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "status"]

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

        # 🔔 send notification
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f"user_{obj.user.id}",

            {
                "type": "send_notification",
                "message": f"Your order is now {obj.status}"
            }
        )    
