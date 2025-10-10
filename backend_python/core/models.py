from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Custom user model"""
    email = models.EmailField(unique=True)
    is_admin = models.BooleanField(default=False)
    last_active = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.username


class Post(models.Model):
    """Blog post model"""
    title = models.CharField(max_length=255)
    content = models.TextField()
    excerpt = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    tags = models.CharField(max_length=255, blank=True)
    image = models.CharField(max_length=255, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def likes_count(self):
        return self.likes.count()


class Project(models.Model):
    """Project model"""
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    tags = models.CharField(max_length=255, blank=True)
    link = models.URLField(max_length=255, blank=True)
    image = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class Comment(models.Model):
    """Comment model"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('spam', 'Spam'),
    ]
    
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='approved')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f'Comment by {self.user.username} on {self.post.title}'


class Like(models.Model):
    """Like model"""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('post', 'user')
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.user.username} likes {self.post.title}'


class Contact(models.Model):
    """Contact message model"""
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f'Message from {self.name}'


class OnlineUser(models.Model):
    """Online user tracking"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='online_sessions')
    last_seen = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'{self.user.username} - {self.last_seen}'


class PostView(models.Model):
    """Post view tracking for analytics"""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='views')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='post_views')
    ip_address = models.GenericIPAddressField()
    viewed_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'View on {self.post.title}'


class ActivityLog(models.Model):
    """Activity log for audit trail"""
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='activities')
    action = models.CharField(max_length=50)
    entity_type = models.CharField(max_length=50, blank=True)
    entity_id = models.IntegerField(null=True, blank=True)
    details = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.action} by {self.user.username if self.user else "Anonymous"}'
