from django.urls import path
from .views import RegisterAPIView, LoginAPIView,MeAPIView,ProfileAPIView,GoogleLoginAPIView,ForgotPasswordAPIView,ResetPasswordAPIView,LogoutAPIView,RefreshTokenAPIView

urlpatterns = [
    path("register/", RegisterAPIView.as_view()),
    path("login/", LoginAPIView.as_view()),
    path("profile/", ProfileAPIView.as_view(), name="profile"),
    path("forgot-password/", ForgotPasswordAPIView.as_view()),
    path("reset-password/<uid>/<token>/", ResetPasswordAPIView.as_view()),
    path("google-login/", GoogleLoginAPIView.as_view()),
    path("me/",MeAPIView.as_view()),
    path("refresh/",RefreshTokenAPIView.as_view()),

    path("logout/",LogoutAPIView.as_view())
]