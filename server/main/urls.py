from django.urls import path
from . import views

urlpatterns = [
    path("index/", views.index, name="index"),
    path("colors/", views.color, name="color"),
    path("api/token/", views.get_access_token, name="get_access_token"),
]