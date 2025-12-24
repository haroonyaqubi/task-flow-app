# complice_taches/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

# Test view
def user_test(request):
    return HttpResponse("User API is working!", content_type="text/plain")

urlpatterns = [
    # Test direct path (bypassing users_app.urls)
    path('api/user/test/', user_test, name='user-test'),

    # Your existing try
    path('api/user/', include('users_app.urls')),

    # ... rest of your URLs
]