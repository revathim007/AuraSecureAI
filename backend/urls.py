from django.urls import path
from accounts.views import RegisterView, LoginView
from hazard.views import PredictView, DashboardView

urlpatterns = [
    # Auth APIs
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    
    # Hazard Prediction APIs
    path('predict/', PredictView.as_view(), name='predict'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]
