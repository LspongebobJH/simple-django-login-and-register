from django.urls import path
from .views import (HomeView, GenerateLogoView)

app_name = "chat"

urlpatterns = [
	path("", HomeView.as_view(), name="home"),
    path("generate-logo/", GenerateLogoView.as_view(), name="generate-logo"),
]