from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Wishlist
from rest_framework.generics import ListAPIView
from .serializers import WishlistSerializer
from rest_framework import status


class ToggleWishlistAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, product_id):

        item = Wishlist.objects.filter(
            user=request.user,
            product_id=product_id
        )

        if item.exists():
            item.delete()
            return Response({"status": "removed"})

        Wishlist.objects.create(
            user=request.user,
            product_id=product_id
        )

        return Response({"status": "added"})
    


class WishlistListAPIView(ListAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(
            user=self.request.user
        ).select_related("product")    
    


class RemoveWishlistAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, product_id):

        Wishlist.objects.filter(
            user=request.user,
            product_id=product_id
        ).delete()

        return Response(
            {"message": "removed"},
            status=status.HTTP_204_NO_CONTENT
        )    