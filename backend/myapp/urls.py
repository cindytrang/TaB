from django.urls import path
from . import views, models

urlpatterns = [
    path('api/groups/', views.GroupListView.as_view(), name='group-list'),
    path('api/users/', views.AllUsersView.as_view(), name='all-users'),
    path('api/groups/<int:pk>/add_member/', views.add_user_to_group, name='add-group-member'),
    path('api/groups/<int:pk>/members/', views.GroupMembersView.as_view(), name='group-members'),
    path('api/groups/events/', views.UserEventsView.as_view(), name='user-events'),
    path('api/groups/<int:group_pk>/events/', views.CalendarEventListView.as_view(), name='group-events'),
    path('api/groups/<int:group_pk>/events/<int:pk>/', views.CalendarEventDetailView.as_view(), name='event-detail'),
]
