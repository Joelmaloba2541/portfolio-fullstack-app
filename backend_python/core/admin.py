from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import (
    User,
    Post,
    Project,
    Comment,
    Like,
    Contact,
    OnlineUser,
    PostView,
    ActivityLog,
    Menu,
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'is_admin', 'is_staff', 'last_active', 'location']
    list_filter = ['is_admin', 'is_staff', 'is_superuser', 'location']
    readonly_fields = ['last_active']
    search_fields = ['username', 'email', 'location', 'phone']

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
        (
            _('Profile'),
            {
                'fields': (
                    'bio',
                    'website',
                    'location',
                    'phone',
                    'profile_image',
                    'last_active',
                )
            }
        ),
        (
            _('Permissions'),
            {
                'fields': (
                    'is_active',
                    'is_staff',
                    'is_superuser',
                    'is_admin',
                    'groups',
                    'user_permissions',
                )
            }
        ),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username',
                'email',
                'password1',
                'password2',
                'is_admin',
                'is_staff',
                'is_superuser',
            ),
        }),
    )


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'status', 'featured', 'category', 'created_at', 'likes_count']
    list_filter = ['status', 'featured', 'category', 'created_at']
    search_fields = ['title', 'content', 'tags']
    date_hierarchy = 'created_at'
    readonly_fields = ['slug', 'views']
    fieldsets = (
        (None, {'fields': ('title', 'slug', 'author', 'status', 'featured')}),
        ('Content', {'fields': ('content', 'excerpt', 'category', 'tags')}),
        (
            'Media',
            {
                'fields': (
                    'image',
                    'image_url',
                )
            }
        ),
        ('Analytics', {'fields': ('views',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    readonly_fields = ['slug', 'views', 'created_at', 'updated_at']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'featured', 'link', 'created_at']
    list_filter = ['category', 'featured', 'created_at']
    search_fields = ['title', 'description', 'tags', 'technologies']
    date_hierarchy = 'created_at'
    fieldsets = (
        (None, {'fields': ('title', 'category', 'featured', 'description')}),
        ('Links', {'fields': ('link', 'github_link', 'demo_link')}),
        ('Metadata', {'fields': ('tags', 'technologies')}),
        ('Media', {'fields': ('image', 'image_url')}),
        ('Timestamps', {'fields': ('created_at',)}),
    )
    readonly_fields = ['created_at']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['user', 'post', 'status', 'is_reply', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['comment', 'user__username', 'post__title']
    raw_id_fields = ['parent']

    @admin.display(boolean=True)
    def is_reply(self, obj):
        return obj.parent is not None
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


@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ['title', 'menu_type', 'parent', 'order', 'is_active']
    list_filter = ['menu_type', 'is_active']
    search_fields = ['title', 'url', 'external_url']
    ordering = ['menu_type', 'order', 'title']
    raw_id_fields = ['parent']
