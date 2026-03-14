from django.urls import path
from .views import CreateOrderView, MyOrdersView,CheckoutAPIView,OrderDetailAPIView,CancelOrderAPIView,CODPaymentAPIView,UPIPaymentAPIView


urlpatterns = [

     path("checkout/", CheckoutAPIView.as_view()),
    path("create/", CreateOrderView.as_view()),
    path("<int:order_id>/pay-cod/", CODPaymentAPIView.as_view()),
    path("<int:order_id>/pay-upi/", UPIPaymentAPIView.as_view()),
    path("my-orders/", MyOrdersView.as_view()),
    path("<int:pk>/", OrderDetailAPIView.as_view()),
    path("cancel/", CancelOrderAPIView.as_view()),
]