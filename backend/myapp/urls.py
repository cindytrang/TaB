from django.urls import path
from . import views, models

urlpatterns = [
    path('api/groups/', views.GroupListView.as_view(), name='group-list'),
    path('api/groups/<int:pk>/', views.GroupDetailView.as_view(), name='group-detail'),
    path('api/groups/<int:pk>/add_member/', views.add_user_to_group, name='add-group-member'),
    path('api/groups/<int:pk>/remove_member/', views.remove_user_from_group),
]
