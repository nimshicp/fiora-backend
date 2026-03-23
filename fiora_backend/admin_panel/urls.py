from django.urls import path
from .views import (
    AdminDashboardAPIView,
    AdminRevenueAPIView,
    AdminOrderStatusAPIView,
    AdminCategoryAPIView,
    AdminOrderListView,
    AdminOrderStatusUpdateAPIView,
    AdminOrderStatsAPIView,
    AdminUserListAPIView,
    AdminUserUpdateAPIView
)

urlpatterns = [
    path("dashboard/", AdminDashboardAPIView.as_view()),
    path("revenue/", AdminRevenueAPIView.as_view()),
    path("categories/", AdminCategoryAPIView.as_view()),
    path("order-status/", AdminOrderStatusAPIView.as_view()),
    path("orders/", AdminOrderListView.as_view()),
    path("orders/<int:order_id>/", AdminOrderStatusUpdateAPIView.as_view()),
    path("orders/stats/", AdminOrderStatsAPIView.as_view()),
    path("users/", AdminUserListAPIView.as_view()),
    path("users/<int:user_id>/", AdminUserUpdateAPIView.as_view()),
]