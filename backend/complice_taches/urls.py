from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse  # Add this import
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


def root_view(request):
    """Simple view for the root URL to confirm API is running"""
    return HttpResponse(
        "Task Flow API is running!<br><br>"
        "Available endpoints:<br>"
        "- <a href='/api/token/'>/api/token/</a> - Get JWT token<br>"
        "- <a href='/api/user/register/'>/api/user/register/</a> - User registration<br>"
        "- <a href='/admin/'>/admin/</a> - Admin panel",
        content_type="text/html"
    )


urlpatterns = [
    # Add this line FIRST - handles the root URL "/"
    path('', root_view, name='root'),

    # Your existing patterns
    path('admin/', admin.site.urls),
    path('api/', include('todolist_app.urls')),
    path('api/user/', include('users_app.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]