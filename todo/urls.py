from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, UserViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
    path('users/register/',
         UserViewSet.as_view({'post': 'create'}), name='user-register'),
    path('users/login/',
         UserViewSet.as_view({'post': 'login'}), name='user-login'),
    path('users/logout/',
         UserViewSet.as_view({'post': 'logout'}), name='user-logout'),
]
