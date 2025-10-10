# Blog Creation & Deletion - Usage Guide

## Overview
The frontend now fully supports creating, viewing, editing, and deleting blog posts through the Admin Blog interface.

## Features Implemented

### 1. **Admin Blog Management** (`/admin/blog`)
- ✅ Create new blog posts
- ✅ Edit existing posts
- ✅ Delete posts with confirmation
- ✅ View all posts with metadata
- ✅ Form validation and error handling
- ✅ Loading states

### 2. **Public Blog View** (`/blog`)
- ✅ List all blog posts
- ✅ Search functionality
- ✅ Category filtering
- ✅ Display post excerpts
- ✅ Show likes and comment counts
- ✅ Responsive card layout

### 3. **Individual Blog Post** (`/blog/:id`)
- ✅ Full post content display
- ✅ Like/unlike functionality
- ✅ Comments section
- ✅ Delete button (for admin/author)
- ✅ Edit link (for admin/author)
- ✅ Tags display
- ✅ Image support

## How to Use

### Creating a Blog Post

1. **Login as Admin**
   - Navigate to `/admin/login`
   - Login with admin credentials
   - Or register (first user becomes admin automatically)

2. **Go to Admin Blog**
   - Navigate to `/admin/blog`
   - You'll see the blog management interface

3. **Fill Out the Form**
   - **Title*** (required): Enter your blog post title
   - **Excerpt** (optional): Short summary for the blog list
   - **Content*** (required): Full blog post content
   - **Category** (optional): Single category (e.g., "Technology")
   - **Tags** (optional): Comma-separated tags (e.g., "react, php, web")
   - **Image URL** (optional): URL to header image

4. **Submit**
   - Click "Create Post"
   - Post will appear in the list below
   - Success/error messages will display

### Editing a Blog Post

1. **From Admin Blog Page**
   - Navigate to `/admin/blog`
   - Find the post in the list
   - Click "Edit" button
   - Form will populate with existing data
   - Make changes and click "Update Post"

2. **From Individual Post Page**
   - View any post at `/blog/:id`
   - If you're admin or the author, you'll see "Edit" button
   - Click to go to admin page

### Deleting a Blog Post

1. **From Admin Blog Page**
   - Navigate to `/admin/blog`
   - Find the post in the list
   - Click "Delete" button
   - Confirm deletion in popup
   - Post will be removed

2. **From Individual Post Page**
   - View the post at `/blog/:id`
   - If you're admin or the author, you'll see "Delete" button
   - Click and confirm
   - You'll be redirected to `/blog`

### Viewing Blog Posts

1. **Blog List** (`/blog`)
   - All published posts displayed as cards
   - Use search bar to filter by title/content
   - Click category buttons to filter
   - Click "Read More" to view full post

2. **Individual Post** (`/blog/:id`)
   - Full content displayed
   - Like button (requires login)
   - Comments section
   - Tags and metadata

## API Endpoints Used

### Frontend → Backend Communication

```javascript
// Get all posts
GET /api/posts

// Get single post
GET /api/posts?id=1

// Create post
POST /api/posts
Body: { title, content, excerpt, category, tags, image, author_id }

// Update post
PUT /api/posts?id=1
Body: { title, content, excerpt, category, tags, image }

// Delete post
DELETE /api/posts?id=1

// Like post
POST /api/posts?action=like
Body: { post_id, user_id }

// Unlike post
DELETE /api/posts?action=like&post_id=1&user_id=2
```

## Testing Steps

### 1. Start Backend
```bash
cd backend
php -S localhost:8000 -t .
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Setup Database
- Ensure MySQL is running
- Run `backend/db_setup.php` to create tables
- Or manually run `backend/schema.sql`

### 4. Create First User
- Navigate to `http://localhost:5173/register`
- Register a new account (becomes admin automatically)
- Login with credentials

### 5. Create a Blog Post
- Go to `http://localhost:5173/admin/blog`
- Fill out the form:
  ```
  Title: My First Blog Post
  Excerpt: This is my first post on the new blog
  Content: Welcome to my blog! This is the full content...
  Category: Technology
  Tags: react, php, portfolio
  ```
- Click "Create Post"

### 6. View the Post
- Navigate to `http://localhost:5173/blog`
- You should see your post in the list
- Click "Read More" to view full post

### 7. Test Deletion
- From the blog post page, click "Delete"
- Confirm the deletion
- Verify you're redirected to `/blog`
- Post should be gone

## Troubleshooting

### "You must be logged in to create or edit posts"
- Ensure you're logged in
- Check localStorage for `user` item
- User object must have `id` field

### "Failed to fetch posts"
- Check backend is running on port 8000
- Verify CORS headers in `backend/index.php`
- Check browser console for errors

### Posts not appearing
- Verify database has posts: `SELECT * FROM posts;`
- Check API response in Network tab
- Ensure `res.data.data` structure matches

### Delete not working
- Verify user is admin or post author
- Check `user.is_admin` or `user.id === post.author_id`
- Look for error messages in console

## File Structure

```
frontend/src/
├── pages/
│   ├── AdminBlog.jsx      # Admin blog management (create/edit/delete)
│   ├── Blog.jsx           # Public blog list view
│   └── BlogPost.jsx       # Individual post view with delete
├── components/
│   ├── BlogCard.jsx       # Post card component
│   ├── CommentList.jsx    # Comments display
│   └── CommentForm.jsx    # Add comment form
└── App.jsx                # Routes including /blog/:id

backend/
├── routes/
│   └── posts.php          # All blog post API endpoints
└── db_setup.php           # Database schema with posts table
```

## Next Steps

- Add rich text editor (e.g., TinyMCE, Quill)
- Implement image upload via `/api/upload`
- Add draft/published status
- Implement pagination for large blogs
- Add post scheduling
- Social media sharing buttons
- Related posts suggestions
