from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'posts', views.PostViewSet, basename='post')
router.register(r'projects', views.ProjectViewSet, basename='project')
router.register(r'comments', views.CommentViewSet, basename='comment')
router.register(r'contact', views.ContactViewSet, basename='contact')

urlpatterns = [
    # Auth endpoints
    path('auth/register', views.register_view, name='register'),
    path('auth/login', views.login_view, name='login'),
    path('auth/logout', views.logout_view, name='logout'),
    path('auth/user', views.current_user_view, name='current-user'),
    
    # Analytics and activity
    path('analytics', views.analytics_view, name='analytics'),
    path('activity', views.activity_view, name='activity'),
    path('online_users', views.online_users_view, name='online-users'),
    
    # Router URLs
    path('', include(router.urls)),
]
