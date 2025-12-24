# complice_taches/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
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
    

# Test view
def test_view(request):
    return HttpResponse("Test endpoint works!", content_type="text/plain")

urlpatterns = [
    # Test endpoints
    path('', test_view, name='root'),
    path('test/', test_view, name='test'),

    # Your existing endpoints
    path('admin/', admin.site.urls),
    path('api/', include('todolist_app.urls')),
    path('api/user/', include('users_app.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]