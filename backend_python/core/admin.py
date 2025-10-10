from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Post, Project, Comment, Like, Contact, OnlineUser, PostView, ActivityLog


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'is_admin', 'is_staff', 'last_active']
    list_filter = ['is_admin', 'is_staff', 'is_superuser']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('is_admin', 'last_active')}),
    )


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'created_at', 'likes_count']
    list_filter = ['category', 'created_at']
    search_fields = ['title', 'content']
    date_hierarchy = 'created_at'


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'link', 'created_at']
    search_fields = ['title', 'description']
    date_hierarchy = 'created_at'


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['user', 'post', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['comment', 'user__username', 'post__title']
    date_hierarchy = 'created_at'


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'post', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'post__title']


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'created_at']
    search_fields = ['name', 'email', 'message']
    date_hierarchy = 'created_at'


@admin.register(OnlineUser)
class OnlineUserAdmin(admin.ModelAdmin):
    list_display = ['user', 'last_seen']
    list_filter = ['last_seen']


@admin.register(PostView)
class PostViewAdmin(admin.ModelAdmin):
    list_display = ['post', 'user', 'ip_address', 'viewed_at']
    list_filter = ['viewed_at']
    search_fields = ['post__title', 'user__username', 'ip_address']


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'entity_type', 'created_at']
    list_filter = ['action', 'entity_type', 'created_at']
    search_fields = ['user__username', 'action', 'details']
    date_hierarchy = 'created_at'
