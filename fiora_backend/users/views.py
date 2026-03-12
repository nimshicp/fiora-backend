from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer,LoginSerializer
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed


class RegisterAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class LoginAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        response = Response({
            "access": access,
            "username": user.username,
        })

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False, 
            samesite="Lax",
            max_age=7*24*60*60
        )

        return response
    

class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response ({
            "username": request.user.username,
            "is_staff": request.user.is_staff,
        })    





class RefreshTokenAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            raise AuthenticationFailed("No refresh token")

        try:
            refresh = RefreshToken(refresh_token)
            access = str(refresh.access_token)

        except Exception:
            raise AuthenticationFailed("Invalid token")

        return Response({
            "access": access
        })

class LogoutAPIView(APIView):

    def post(self, request):

        response = Response({"message": "Logged out"})
        response.delete_cookie("refresh_token")

        return response