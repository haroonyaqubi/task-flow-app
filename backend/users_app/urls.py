# users_app/urls.py
from django.urls import path
from .views import RegisterView, MeView, UserListView, UserDetailView

app_name = 'users_app'  # ⬅️ ADD THIS LINE - It's CRITICAL!

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', MeView.as_view(), name='me'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]