from django.urls import path
from .views import (
    ToggleWishlistAPIView,
    WishlistListAPIView,
    RemoveWishlistAPIView
)

urlpatterns = [
    path("", WishlistListAPIView.as_view()),
    path("toggle/<int:product_id>/", ToggleWishlistAPIView.as_view()),
    path("remove/<int:product_id>/", RemoveWishlistAPIView.as_view()),
]