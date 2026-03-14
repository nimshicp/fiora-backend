from django.urls import path
from .views import RegisterAPIView, LoginAPIView,MeAPIView,ProfileAPIView,GoogleLoginAPIView

urlpatterns = [
    path("register/", RegisterAPIView.as_view()),
    path("login/", LoginAPIView.as_view()),
    path("profile/", ProfileAPIView.as_view(), name="profile"),
    path("google-login/", GoogleLoginAPIView.as_view()),
    path("me/",MeAPIView.as_view())
]