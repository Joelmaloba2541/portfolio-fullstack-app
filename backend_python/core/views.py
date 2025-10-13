from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.contrib.auth import login, logout
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
from .models import User, Post, Project, Comment, Like, Contact, OnlineUser, PostView, ActivityLog, Menu
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    PostSerializer, ProjectSerializer, CommentSerializer,
    LikeSerializer, ContactSerializer, OnlineUserSerializer,
    PostViewSerializer, ActivityLogSerializer
)


@api_view(['POST'])
def register_view(request):
    """User registration"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'status': 'success',
            'message': 'Welcome aboard! Your account has been created successfully.',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response({
        'status': 'error',
        'message': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_view(request):
    """User login"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data
        login(request, user)

        remember_me = request.data.get('remember_me')
        if remember_me in ['true', 'True', True, '1']:
            request.session.set_expiry(timedelta(days=30))
        else:
            request.session.set_expiry(0)

        user.last_active = timezone.now()
        user.save(update_fields=['last_active'])
        return Response({
            'status': 'success',
            'message': 'Login successful',
            'user': UserSerializer(user).data
        })
    return Response({
        'status': 'error',
        'message': 'Invalid credentials'
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_view(request):
    """User logout"""
    logout(request)
    return Response({
        'status': 'success',
        'message': 'Logged out successfully'
    })


@api_view(['GET', 'PUT', 'PATCH'])
def current_user_view(request):
    """Get current logged-in user"""
    if request.user.is_authenticated:
        if request.method in ['PUT', 'PATCH']:
            serializer = UserSerializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'status': 'success',
                    'user': serializer.data
                })
            return Response({
                'status': 'error',
                'message': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'status': 'success',
            'user': UserSerializer(request.user).data
        })
    return Response({
        'status': 'error',
        'message': 'Not authenticated'
    }, status=status.HTTP_401_UNAUTHORIZED)


class PostViewSet(viewsets.ModelViewSet):
    """Post CRUD operations"""
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    
    def list(self, request):
        """Get all posts or single post by ID"""
        post_id = request.query_params.get('id')
        if post_id:
            try:
                post = Post.objects.get(id=post_id)
                return Response({
                    'status': 'success',
                    'data': self.get_serializer(post).data
                })
            except Post.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': 'Post not found'
                }, status=status.HTTP_404_NOT_FOUND)
        
        posts = self.get_queryset()
        serializer = self.get_serializer(posts, many=True)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    
    def create(self, request):
        """Create a new post"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': 'Post created successfully',
                'post_id': serializer.data['id']
            }, status=status.HTTP_201_CREATED)
        return Response({
            'status': 'error',
            'message': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, pk=None):
        """Update a post"""
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Post not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': 'Post updated successfully'
            })
        return Response({
            'status': 'error',
            'message': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        """Delete a post"""
        try:
            post = Post.objects.get(pk=pk)
            post.delete()
            return Response({
                'status': 'success',
                'message': 'Post deleted successfully'
            })
        except Post.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Post not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def check_like(self, request):
        """Check if user has liked a post"""
        post_id = request.query_params.get('post_id')
        user_id = request.query_params.get('user_id')
        
        if not post_id or not user_id:
            return Response({
                'status': 'error',
                'message': 'Invalid parameters'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        liked = Like.objects.filter(post_id=post_id, user_id=user_id).exists()
        return Response({
            'status': 'success',
            'liked': liked
        })
    
    @action(detail=False, methods=['post'])
    def like(self, request):
        """Like a post"""
        post_id = request.data.get('post_id')
        user_id = request.data.get('user_id')
        
        if not post_id or not user_id:
            return Response({
                'status': 'error',
                'message': 'Invalid post_id or user_id'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            Like.objects.get_or_create(post_id=post_id, user_id=user_id)
            return Response({
                'status': 'success',
                'message': 'Liked'
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['delete'])
    def unlike(self, request):
        """Unlike a post"""
        post_id = request.query_params.get('post_id')
        user_id = request.query_params.get('user_id')
        
        if not post_id or not user_id:
            return Response({
                'status': 'error',
                'message': 'Invalid post_id or user_id'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            like = Like.objects.get(post_id=post_id, user_id=user_id)
            like.delete()
            return Response({
                'status': 'success',
                'message': 'Unliked'
            })
        except Like.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Like not found'
            }, status=status.HTTP_404_NOT_FOUND)


class ProjectViewSet(viewsets.ModelViewSet):
    """Project CRUD operations"""
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    
    def list(self, request):
        """Get all projects"""
        projects = self.get_queryset()
        serializer = self.get_serializer(projects, many=True)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    
    def create(self, request):
        """Create a new project"""
        data = request.data.copy()
        if isinstance(data.get('tags'), list):
            data['tags'] = ','.join(data['tags'])
        
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': 'Project created successfully'
            }, status=status.HTTP_201_CREATED)
        return Response({
            'status': 'error',
            'message': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class CommentViewSet(viewsets.ModelViewSet):
    """Comment CRUD operations"""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    
    def list(self, request):
        """Get comments with optional filters"""
        post_id = request.query_params.get('post_id')
        status_filter = request.query_params.get('status')
        limit = request.query_params.get('limit')

        comments = self.get_queryset().select_related('user', 'post').order_by('-created_at')
        if post_id:
            comments = comments.filter(post_id=post_id)
        if status_filter:
            comments = comments.filter(status=status_filter)

        if limit:
            try:
                limit_value = int(limit)
                comments = comments[:limit_value]
            except (TypeError, ValueError):
                pass

        serializer = self.get_serializer(comments, many=True)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    
    def create(self, request):
        """Create a new comment"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            ActivityLog.objects.create(
                user=request.user if request.user.is_authenticated else None,
                action='comment_created',
                entity_type='comment',
                entity_id=serializer.instance.id,
                details=f"Comment on post {serializer.instance.post_id}",
                ip_address=request.META.get('REMOTE_ADDR')
            )
            return Response({
                'status': 'success',
                'message': 'Comment added successfully'
            }, status=status.HTTP_201_CREATED)
        return Response({
            'status': 'error',
            'message': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ContactViewSet(viewsets.ModelViewSet):
    """Contact message operations"""
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    
    def create(self, request):
        """Submit contact message"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': 'Message sent successfully'
            }, status=status.HTTP_201_CREATED)
        return Response({
            'status': 'error',
            'message': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def analytics_view(request):
    """Get analytics data"""
    total_posts = Post.objects.count()
    total_projects = Project.objects.count()
    total_comments = Comment.objects.count()
    total_likes = Like.objects.count()
    total_views = PostView.objects.count()
    
    popular_posts = Post.objects.annotate(
        view_count=Count('views')
    ).order_by('-view_count')[:5]
    
    return Response({
        'status': 'success',
        'data': {
            'total_posts': total_posts,
            'total_projects': total_projects,
            'total_comments': total_comments,
            'total_likes': total_likes,
            'total_views': total_views,
            'popular_posts': PostSerializer(popular_posts, many=True).data
        }
    })


@api_view(['GET'])
def activity_view(request):
    """Get recent activity logs"""
    activities = ActivityLog.objects.all()[:50]
    serializer = ActivityLogSerializer(activities, many=True)
    return Response({
        'status': 'success',
        'data': serializer.data
    })


@api_view(['GET'])
def online_users_view(request):
    """Get online users"""
    online_users = OnlineUser.objects.all()
    serializer = OnlineUserSerializer(online_users, many=True)
    return Response({
        'status': 'success',
        'data': serializer.data
    })


@api_view(['GET'])
def menu_view(request):
    """Get active menus grouped by type."""
    menus = Menu.objects.filter(is_active=True).order_by('menu_type', 'order', 'title')
    grouped = {}
    for menu in menus:
        data = {
            'id': menu.id,
            'title': menu.title,
            'url': menu.display_url,
            'icon': menu.icon,
            'parent': menu.parent_id,
        }
        grouped.setdefault(menu.menu_type, []).append(data)
    return Response({'status': 'success', 'data': grouped})


@api_view(['GET'])
def database_info_view(request):
    """Get database connection information"""
    from django.db import connection
    
    db_engine = connection.settings_dict['ENGINE']
    db_name = connection.settings_dict['NAME']
    db_host = connection.settings_dict.get('HOST', 'N/A')
    
    # Determine database type
    if 'postgresql' in db_engine:
        db_type = 'PostgreSQL'
    elif 'sqlite' in db_engine:
        db_type = 'SQLite'
    elif 'mysql' in db_engine:
        db_type = 'MySQL'
    else:
        db_type = 'Unknown'
    
    return Response({
        'status': 'success',
        'database': {
            'type': db_type,
            'engine': db_engine,
            'name': db_name,
            'host': db_host,
            'is_postgresql': 'postgresql' in db_engine
        }
    })
