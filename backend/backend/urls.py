"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from myapp import views
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path("", include("myapp.urls")),
    path('admin/', admin.site.urls),
    path('hello/', views.HelloView.as_view(), name='hello'),

    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('api/signup/', views.SignupView.as_view(), name='signup'),
    path('api/login/', views.LoginView.as_view(), name='login'),
    path('api/logout/', views.LogoutView.as_view(), name='logout'),
    path('api/password_change/', views.ChangePasswordView.as_view(), name='password_change'),

    path('accounts/', include('django.contrib.auth.urls')),
    path('api/profile/', views.UserProfileView.as_view(), name='user-profile'),
]
