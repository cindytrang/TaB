from django.db import IntegrityError
from django.shortcuts import render

# Create your views here.

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import CustomUser, CustomGroup, CalendarEvent, Calendar
from .serializers import UserSerializer, UserProfileSerializer, GroupSerializer, GroupProfileSerializer, SignupSerializer, CustomGroupSerializer, CalendarSerializer, CalendarEventSerializer

from .forms import ChangePasswordForm
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, logout
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import Group as DjangoGroup

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
    
class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                return Response({
                    "user": UserSerializer(user).data,
                    "message": "User created successfully",
                }, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                return Response({
                    "error": "A user with that username or email already exists."
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Extract specific error messages
            error_messages = {}
            for field, errors in serializer.errors.items():
                error_messages[field] = [str(error) for error in errors]
            
            return Response({
                "error": "Invalid data provided.",
                "details": error_messages
            }, status=status.HTTP_400_BAD_REQUEST)
class LoginView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'username': user.username,
                'email': user.email
            })
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
    
class GroupListView(generics.ListAPIView):
    queryset = DjangoGroup.objects.all()
    serializer_class = GroupSerializer

class GroupDetailView(generics.ListAPIView):
    queryset = DjangoGroup.objects.all()
    serializer_class = GroupProfileSerializer

class GroupListView(generics.ListCreateAPIView):
    queryset = CustomGroup.objects.all()
    serializer_class = CustomGroupSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

class GroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomGroup.objects.all()
    serializer_class = CustomGroupSerializer
    permission_classes = [IsAuthenticated]

class CalendarView(generics.RetrieveUpdateAPIView):
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.get_queryset().get(group__pk=self.kwargs['group_pk'])

class CalendarEventListView(generics.ListCreateAPIView):
    serializer_class = CalendarEventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CalendarEvent.objects.filter(group__pk=self.kwargs['group_pk'])

    def perform_create(self, serializer):
        group = CustomGroup.objects.get(pk=self.kwargs['group_pk'])
        serializer.save(group=group, event_created_by=self.request.user)

class UserEventsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        events = CalendarEvent.objects.filter(group__members=user)
        serializer = CalendarEventSerializer(events, many=True)
        return Response(serializer.data)

class GroupMembersView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        group_id = self.kwargs['pk']
        return CustomGroup.objects.get(id=group_id).members.all()
    
class AllUsersView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CustomUser.objects.exclude(id=self.request.user.id)

class CalendarEventDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CalendarEventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        group_pk = self.kwargs['group_pk']
        return CalendarEvent.objects.filter(group__id=group_pk)

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['POST'])
def add_user_to_group(request, pk):
    try:
        group = CustomGroup.objects.get(pk=pk)
    except CustomGroup.DoesNotExist:
        return Response({'detail': 'Group not found.'}, status=status.HTTP_404_NOT_FOUND)

    user_id = request.data.get('user_id')
    
    try:
        user = CustomUser.objects.get(pk=user_id)
    except CustomUser.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    group.members.add(user)

    return Response({'detail': 'User added to group successfully.'}, status=status.HTTP_200_OK)