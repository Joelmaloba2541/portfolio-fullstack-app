from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Post, Project, Comment, Like, Contact, OnlineUser, PostView, ActivityLog


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_admin', 'last_active']
        read_only_fields = ['id', 'last_active']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
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
    
    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'username', 'comment', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']


class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    author_id = serializers.IntegerField(source='author.id', read_only=True)
    likes = serializers.IntegerField(source='likes_count', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    tags = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'excerpt', 'category', 'tags', 'image', 
                  'author', 'author_name', 'author_id', 'likes', 'comments', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_tags(self, obj):
        if obj.tags:
            return obj.tags.split(',')
        return []


class ProjectSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'tags', 'link', 'image', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_tags(self, obj):
        if obj.tags:
            return obj.tags.split(',')
        return []


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
