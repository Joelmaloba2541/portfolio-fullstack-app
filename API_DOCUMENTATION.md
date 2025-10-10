# API Documentation - Blog Posts

## Base URL
```
http://localhost:8000
```

## Blog Posts API

### 1. Create a New Blog Post
**Endpoint:** `POST /api/posts`

**Request Body:**
```json
{
  "title": "My First Blog Post",
  "content": "This is the full content of my blog post...",
  "excerpt": "A short summary of the post",
  "category": "Technology",
  "tags": ["php", "react", "web-development"],
  "image": "https://example.com/image.jpg",
  "author_id": 1
}
```

**Required Fields:**
- `title` (string)
- `content` (string)
- `author_id` (integer)

**Optional Fields:**
- `excerpt` (string) - Short summary
- `category` (string) - Single category
- `tags` (array or comma-separated string)
- `image` (string) - URL or path to image

**Success Response:**
```json
{
  "status": "success",
  "message": "Post created successfully",
  "post_id": 1
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Missing required fields: title, content, or author_id"
}
```

---

### 2. Get All Blog Posts
**Endpoint:** `GET /api/posts`

**Success Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "My First Blog Post",
      "content": "Full content...",
      "excerpt": "Short summary...",
      "category": "Technology",
      "tags": ["php", "react", "web-development"],
      "image": "https://example.com/image.jpg",
      "author_id": 1,
      "author_name": "john_doe",
      "created_at": "2025-10-10 15:30:00",
      "updated_at": "2025-10-10 15:30:00",
      "likes": 5
    }
  ]
}
```

---

### 3. Get Single Blog Post
**Endpoint:** `GET /api/posts?id=1`

**Success Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "My First Blog Post",
    "content": "Full content...",
    "excerpt": "Short summary...",
    "category": "Technology",
    "tags": ["php", "react", "web-development"],
    "image": "https://example.com/image.jpg",
    "author_id": 1,
    "author_name": "john_doe",
    "created_at": "2025-10-10 15:30:00",
    "updated_at": "2025-10-10 15:30:00",
    "likes": 5,
    "comments": [
      {
        "id": 1,
        "post_id": 1,
        "user_id": 2,
        "username": "jane_smith",
        "comment": "Great post!",
        "created_at": "2025-10-10 16:00:00"
      }
    ]
  }
}
```

---

### 4. Update a Blog Post
**Endpoint:** `PUT /api/posts?id=1`

**Request Body:**
```json
{
  "title": "Updated Blog Post Title",
  "content": "Updated content...",
  "excerpt": "Updated summary",
  "category": "Programming",
  "tags": ["javascript", "nodejs"],
  "image": "https://example.com/new-image.jpg"
}
```

**Success Response:**
```json
{
  "status": "success",
  "message": "Post updated successfully"
}
```

---

### 5. Delete a Blog Post
**Endpoint:** `DELETE /api/posts?id=1`

**Success Response:**
```json
{
  "status": "success",
  "message": "Post deleted successfully"
}
```

---

### 6. Like a Post
**Endpoint:** `POST /api/posts?action=like`

**Request Body:**
```json
{
  "post_id": 1,
  "user_id": 2
}
```

**Success Response:**
```json
{
  "status": "success",
  "message": "Liked"
}
```

---

### 7. Unlike a Post
**Endpoint:** `DELETE /api/posts?action=like&post_id=1&user_id=2`

**Success Response:**
```json
{
  "status": "success",
  "message": "Unliked"
}
```

---

## Testing with cURL

### Create a Post
```bash
curl -X POST http://localhost:8000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the full content of my blog post",
    "excerpt": "A short summary",
    "category": "Technology",
    "tags": ["php", "react"],
    "author_id": 1
  }'
```

### Get All Posts
```bash
curl http://localhost:8000/api/posts
```

### Get Single Post
```bash
curl http://localhost:8000/api/posts?id=1
```

### Update a Post
```bash
curl -X PUT http://localhost:8000/api/posts?id=1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content",
    "category": "Tech"
  }'
```

### Delete a Post
```bash
curl -X DELETE http://localhost:8000/api/posts?id=1
```

---

## Database Schema

### Posts Table
```sql
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    excerpt TEXT,
    category VARCHAR(100),
    tags VARCHAR(255),
    image VARCHAR(255),
    author_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);
```

---

## Notes

1. **Authentication**: Currently, the API doesn't enforce authentication on POST/PUT/DELETE operations. You should add authentication middleware to verify the user is logged in and authorized.

2. **Author ID**: When creating a post from the frontend, use the logged-in user's ID as `author_id`.

3. **Tags Format**: Tags can be sent as:
   - Array: `["tag1", "tag2", "tag3"]`
   - String: `"tag1,tag2,tag3"`

4. **Image Upload**: Use the `/api/upload` endpoint first to upload images, then use the returned URL in the `image` field.

5. **Cascade Deletes**: When a post is deleted, all associated comments and likes are automatically deleted due to `ON DELETE CASCADE` constraints.
