from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Product,Category
from .serializers import ProductSerializer,CategorySerializer

# ✅ GET + POST
class ProductListAPIView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all().order_by('-id')

        category = self.request.query_params.get("category")
        search = self.request.query_params.get("search", "").strip()
        stock = self.request.query_params.get("stock")

        if category:
            queryset = queryset.filter(category__name=category)

        if search:
            queryset = queryset.filter(name__icontains=search)

        if stock == "low":
            queryset = queryset.filter(stock__gt=0, stock__lt=10)
        elif stock == "out":
            queryset = queryset.filter(stock=0)

        return queryset

    def paginate_queryset(self, queryset):
        if self.request.query_params.get("all") == "true":
            return None
        return super().paginate_queryset(queryset)


# ✅ GET (single) + PATCH + DELETE
class ProductDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

class CategoryListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer    
