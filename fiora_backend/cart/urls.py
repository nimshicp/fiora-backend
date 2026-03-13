from django.urls import path
from .views import CartListAPIView,AddToCartAPIView,DecreaseCartAPIView,RemoveFromCartAPIView,ClearCartAPIView


urlpatterns = [

    path("", CartListAPIView.as_view()),
    path("add/<int:product_id>/", AddToCartAPIView.as_view()),
    path("decrease/<int:product_id>/", DecreaseCartAPIView.as_view()),
    path("remove/<int:product_id>/", RemoveFromCartAPIView.as_view()),
    path("clear/", ClearCartAPIView.as_view()),

]