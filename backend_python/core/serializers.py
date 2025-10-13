from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Post, Project, Comment, Like, Contact, OnlineUser, PostView, ActivityLog


class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'is_admin',
            'last_active',
            'date_joined',
            'bio',
            'website',
            'location',
            'profile_image',
            'phone',
        ]
        read_only_fields = ['id', 'last_active', 'is_admin', 'date_joined']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'bio', 'website', 'location', 'phone']

    def create(self, validated_data):
        optional_fields = {field: validated_data.pop(field, None) for field in ['bio', 'website', 'location', 'phone']}
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        for field, value in optional_fields.items():
            if value:
                setattr(user, field, value)
        user.save(update_fields=['bio', 'website', 'location', 'phone'])
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user_full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_profile_image = serializers.ImageField(source='user.profile_image', read_only=True)
    post_title = serializers.CharField(source='post.title', read_only=True)
    is_reply = serializers.BooleanField(read_only=True)
    replies = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id',
            'post',
            'user',
            'username',
            'user_full_name',
            'user_profile_image',
            'parent',
            'comment',
            'status',
            'post_title',
            'is_reply',
            'replies',
            'created_at',
            'rating'
        ]
        read_only_fields = ['id', 'created_at', 'username', 'user_full_name', 'user_profile_image', 'post_title', 'is_reply', 'replies', 'rating']

    def get_replies(self, obj):
        if obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True, context=self.context).data
        return []

    def get_rating(self, obj):
        """Approximate rating based on comment sentiment/length."""
        if hasattr(obj, 'rating') and obj.rating:
            return obj.rating
        # Basic heuristic: longer comments imply higher satisfaction
        length = len(obj.comment or "")
        if length > 200:
            return 5
        if length > 120:
            return 4
        if length > 60:
            return 4
        if length > 20:
            return 3
        return 5


class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    author_id = serializers.IntegerField(source='author.id', read_only=True)
    likes = serializers.IntegerField(source='likes_count', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'content',
            'excerpt',
            'category',
            'tags',
            'image',
            'image_url',
            'author',
            'author_name',
            'author_id',
            'status',
            'featured',
            'views',
            'slug',
            'likes',
            'comments',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'author_id', 'author_name', 'likes', 'comments', 'slug', 'views']

    def get_tags(self, obj):
        return [tag.strip() for tag in obj.tags.split(',') if tag.strip()] if obj.tags else []

    def to_internal_value(self, data):
        internal = super().to_internal_value(data)
        tags = data.get('tags')
        if isinstance(tags, list):
            internal['tags'] = ','.join(tags)
        return internal


class ProjectSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id',
            'title',
            'description',
            'tags',
            'link',
            'github_link',
            'demo_link',
            'image',
            'image_url',
            'category',
            'featured',
            'technologies',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_tags(self, obj):
        return [tag.strip() for tag in obj.tags.split(',') if tag.strip()] if obj.tags else []

    def to_internal_value(self, data):
        internal = super().to_internal_value(data)
        tags = data.get('tags')
        if isinstance(tags, list):
            internal['tags'] = ','.join(tags)
        return internal


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'post', 'user', 'created_at']
        read_only_fields = ['id', 'created_at']


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'email', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']


class OnlineUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = OnlineUser
        fields = ['id', 'user', 'username', 'last_seen']
        read_only_fields = ['id', 'last_seen']


class PostViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostView
        fields = ['id', 'post', 'user', 'ip_address', 'viewed_at']
        read_only_fields = ['id', 'viewed_at']


class ActivityLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = ActivityLog
        fields = ['id', 'user', 'username', 'action', 'entity_type', 'entity_id', 
                  'details', 'ip_address', 'created_at']
        read_only_fields = ['id', 'created_at']
