from django.contrib import admin
from django.urls import path, include, re_path

#  Swagger imports
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Swagger config
schema_view = get_schema_view(
    openapi.Info(
        title="Fiora Ecommerce API",
        default_version='v1',
        description="API documentation for Fiora Ecommerce",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/users/", include("users.urls")),
    path("api/products/", include("products.urls")),
    path("api/wishlist/", include("wishlist.urls")),
    path("api/cart/", include("cart.urls")),
    path('api/orders/', include('orders.urls')),
    path('api/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path("api/admin/", include("admin_panel.urls")),

    # ✅ Swagger URLs (ADD THESE)
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0)),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0)),
]