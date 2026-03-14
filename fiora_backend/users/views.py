from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer,LoginSerializer,ProfileSerializer
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from .models import User


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
    
class ProfileAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):

        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors)  





class GoogleLoginAPIView(APIView):

    def post(self, request):

        token = request.data.get("token")

        if not token:
            return Response({"error": "Token missing"}, status=400)

        try:

            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

            email = idinfo["email"]
            name = idinfo.get("name", "")

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": name.replace(" ", "").lower()
                }
            )

            refresh = RefreshToken.for_user(user)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            })

        except ValueError:
            return Response(
                {"error": "Invalid Google token"},
                status=status.HTTP_400_BAD_REQUEST
            )          