from django.shortcuts import render

# Create your views here.

from rest_framework import generics, status
from .models import CustomUser
from .serializers import UserSerializer, UserProfileSerializer
from .forms import ChangePasswordForm
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, logout
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response

class HelloView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)

class UserProfileView(APIView):
    permission_classes = (IsAuthenticated,)
    
    def get(self, request):
        user_profile = request.user.profile
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)
    
class SignUpView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

class LoginView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response(token.key)
        return Response({"error": "Invalid Login Credentials. Check password and username details"}, status=400)
    
class LogoutView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    
    def logout_view(request):
        logout(request)
        return Response({'message': 'Logged out successfully'})

class ChangePasswordView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        form = ChangePasswordForm(request.data)
        if form.is_valid():
            user = request.user
            old_password = form.cleaned_data['old_password']
            new_password = form.cleaned_data['new_password']
            confirm_password = form.cleaned_data['confirm_password']

            # Check if the old password is correct
            if not user.check_password(old_password):
                return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

            # Check if new password and confirm password match
            if new_password != confirm_password:
                return Response({'error': 'New password and confirmation do not match'}, status=status.HTTP_400_BAD_REQUEST)

            # Change the password
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)

        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)