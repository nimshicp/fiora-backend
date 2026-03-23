from rest_framework import serializers
from .models import Product, Category

# New Serializer for the Category List
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ProductSerializer(serializers.ModelSerializer):
    # Keep using PrimaryKeyRelatedField so React can send the ID (e.g., {"category": 1})
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all()
    )
    # This remains for display purposes (Read-only)
    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    class Meta:
        model = Product
        fields = [
            "id", "name", "price", "description", 
            "image", "stock", "category", "category_name"
        ]