# TODO: Admin Features to Implement

## Missing Endpoints

The following admin features from the PHP backend need to be implemented in Django:

### 1. User Management
- `GET /auth/users` - List all users
- `POST /auth/make_admin` - Make user admin
- `POST /auth/revoke_admin` - Revoke admin privileges
- `DELETE /auth/delete_user` - Delete user

### 2. Comment Moderation
- Update comment status (approve/spam/pending)
- Bulk comment operations

### 3. File Upload
- `POST /upload` - Handle image uploads

---

## Current Workaround

For now, use Django Admin Panel to manage users:
- URL: https://portfolio-python1-app.onrender.com/admin/
- Username: admin
- Password: admin (change this!)

From Django admin you can:
- ✅ Create/edit/delete users
- ✅ Make users admin (set is_admin flag)
- ✅ Manage all posts, projects, comments
- ✅ View analytics data

---

## Implementation Plan

### Phase 1: User Management API
```python
# In core/views.py

@api_view(['GET'])
def users_list_view(request):
    """List all users (admin only)"""
    if not request.user.is_authenticated or not request.user.is_admin:
        return Response({'status': 'error', 'message': 'Unauthorized'}, 
                       status=status.HTTP_401_UNAUTHORIZED)
    
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response({'status': 'success', 'data': serializer.data})

@api_view(['POST'])
def make_admin_view(request):
    """Make user admin (admin only)"""
    # Implementation here
    pass

@api_view(['POST'])
def revoke_admin_view(request):
    """Revoke admin privileges (admin only)"""
    # Implementation here
    pass
```

### Phase 2: File Upload
```python
# In core/views.py

@api_view(['POST'])
def upload_view(request):
    """Handle file uploads"""
    if 'file' not in request.FILES:
        return Response({'status': 'error', 'message': 'No file provided'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    file = request.FILES['file']
    # Save file and return URL
    pass
```

### Phase 3: Comment Moderation
```python
# Add to CommentViewSet

@action(detail=True, methods=['post'])
def moderate(self, request, pk=None):
    """Moderate comment (approve/spam/delete)"""
    # Implementation here
    pass
```

---

## For Now

**Working Features:**
- ✅ User registration
- ✅ User login/logout
- ✅ Blog posts CRUD
- ✅ Projects CRUD
- ✅ Comments (view/create)
- ✅ Likes
- ✅ Contact form
- ✅ Analytics (basic)

**Use Django Admin for:**
- User management
- Advanced moderation
- Bulk operations

---

## Priority

**High Priority:**
1. User list API (needed for admin dashboard)
2. File upload (needed for creating posts with images)

**Medium Priority:**
3. Make/revoke admin
4. Comment moderation API

**Low Priority:**
5. Delete user (can use Django admin)

---

**Note:** The core functionality works. Admin features can be added incrementally as needed.
