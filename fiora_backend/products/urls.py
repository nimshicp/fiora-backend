from django.urls import path
from .views import ProductListAPIView, ProductDetailAPIView,CategoryListAPIView

urlpatterns = [

    path("", ProductListAPIView.as_view()),

    path("<int:pk>/", ProductDetailAPIView.as_view()),
    path('categories/', CategoryListAPIView.as_view()),

]