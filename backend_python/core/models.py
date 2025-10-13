from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify


class User(AbstractUser):
    """Custom user model"""

    email = models.EmailField(unique=True)
    is_admin = models.BooleanField(default=False)
    last_active = models.DateTimeField(auto_now=True)
    bio = models.TextField(blank=True, help_text="Tell us about yourself")
    website = models.URLField(blank=True, help_text="Share your portfolio or website")
    location = models.CharField(max_length=100, blank=True, help_text="Where are you based?")
    profile_image = models.ImageField(
        upload_to='profiles/',
        blank=True,
        null=True,
        help_text="Upload a profile picture"
    )
    phone = models.CharField(max_length=20, blank=True, help_text="Optional phone number")

    class Meta:
        ordering = ['username']

    def __str__(self):
        return self.username


class Post(models.Model):
    """Blog post model"""

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    title = models.CharField(max_length=255)
    content = models.TextField()
    excerpt = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    tags = models.CharField(max_length=255, blank=True)
    image = models.ImageField(
        upload_to='posts/',
        blank=True,
        null=True,
        help_text="Upload a featured image (optional)"
    )
    image_url = models.CharField(
        max_length=255,
        blank=True,
        help_text="Or provide an external image URL"
    )
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    featured = models.BooleanField(default=False, help_text="Highlight this post in listings")
    views = models.PositiveIntegerField(default=0)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or slugify(self.author.username)
            candidate = base_slug
            index = 1
            while Post.objects.filter(slug=candidate).exclude(pk=self.pk).exists():
                index += 1
                candidate = f"{base_slug}-{index}"
            self.slug = candidate
        super().save(*args, **kwargs)

    @property
    def likes_count(self):
        return self.likes.count()

    @property
    def comments_count(self):
        return self.comments.filter(status='approved').count()


class Project(models.Model):
    """Project model"""

    CATEGORY_CHOICES = [
        ('web', 'Web Development'),
        ('mobile', 'Mobile App'),
        ('desktop', 'Desktop App'),
        ('api', 'API Development'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    tags = models.CharField(max_length=255, blank=True)
    link = models.URLField(max_length=255, blank=True)
    github_link = models.URLField(max_length=255, blank=True, help_text="Link to source code repository")
    demo_link = models.URLField(max_length=255, blank=True, help_text="Live demo URL")
    image = models.ImageField(
        upload_to='projects/',
        blank=True,
        null=True,
        help_text="Upload a project screenshot"
    )
    image_url = models.CharField(max_length=255, blank=True, help_text="Or provide an external image URL")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='web')
    featured = models.BooleanField(default=False, help_text="Mark as a featured project")
    technologies = models.CharField(max_length=255, blank=True, help_text="Comma separated technologies")
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
        ('rejected', 'Rejected'),
    ]
    
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    comment = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='approved')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f'Comment by {self.user.username} on {self.post.title}'
    
    @property
    def is_reply(self):
        return self.parent is not None


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
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='view_records')
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
        return f"{self.action} by {self.user.username if self.user else 'Anonymous'}"


class Menu(models.Model):
    """Navigation menu model that supports nested menu entries."""

    TYPE_CHOICES = [
        ('header', 'Header Menu'),
        ('footer', 'Footer Menu'),
        ('sidebar', 'Sidebar Menu'),
    ]

    name = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=100)
    url = models.CharField(max_length=255, blank=True, help_text="Internal path (e.g. /blog)")
    external_url = models.URLField(blank=True, help_text="External URL if linking outside the site")
    icon = models.CharField(max_length=50, blank=True, help_text="Bootstrap icon class, e.g. bi-house")
    menu_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='header')
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children'
    )
    order = models.IntegerField(default=0, help_text="Lower numbers appear first")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['menu_type', 'order', 'title']

    def __str__(self):
        return f"{self.title} ({self.menu_type})"

    @property
    def display_url(self):
        return self.external_url or self.url or '#'

    @property
    def has_children(self):
        return self.children.exists()
