from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import Task
from .serializers import TaskSerializer, UserSerializer
import logging

logger = logging.getLogger(__name__)

# Create your views here.


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['patch'])
    def toggle_complete(self, request, pk=None):
        task = self.get_object()
        task.completed = not task.completed
        task.save()
        return Response(self.get_serializer(task).data)


class UserViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        logger.info(f"Registration attempt with data: {request.data}")
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)
            logger.info(f"User {user.username} registered successfully")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error(f"Registration failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        logger.info(f"Login attempt for user: {username}")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            logger.info(f"User {username} logged in successfully")
            return Response(UserSerializer(user).data)
        logger.error(f"Login failed for user: {username}")
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    def logout(self, request):
        if request.user.is_authenticated:
            logger.info(f"User {request.user.username} logged out")
        logout(request)
        return Response(status=status.HTTP_200_OK)
