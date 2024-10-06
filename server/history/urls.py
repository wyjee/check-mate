from django.urls import path
from . import views

urlpatterns = [
    path('history', views.HistoryList.as_view()),
    path('history/<int:pk>', views.HistoryList.as_view()),
]