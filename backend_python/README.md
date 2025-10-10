# Portfolio Django Backend

Django REST API backend for the portfolio application.

## Features

- User authentication (register, login, logout)
- Blog posts with CRUD operations
- Projects management
- Comments system
- Like/Unlike functionality
- Contact form
- Analytics and activity tracking
- Admin dashboard

## Setup

### Local Development

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run setup (migrations + create admin user):
```bash
python manage.py setup
```

4. Run development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

### Default Admin User

- **Username**: admin
- **Email**: admin@gmail.com
- **Password**: admin

**⚠️ Change the password after first login!**

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `GET /auth/user` - Get current user

### Posts
- `GET /posts/` - List all posts
- `GET /posts/?id=<id>` - Get single post
- `POST /posts/` - Create post
- `PUT /posts/<id>/` - Update post
- `DELETE /posts/<id>/` - Delete post
- `GET /posts/check_like/?post_id=<id>&user_id=<id>` - Check if user liked post
- `POST /posts/like/` - Like a post
- `DELETE /posts/unlike/?post_id=<id>&user_id=<id>` - Unlike a post

### Projects
- `GET /projects/` - List all projects
- `POST /projects/` - Create project
- `PUT /projects/<id>/` - Update project
- `DELETE /projects/<id>/` - Delete project

### Comments
- `GET /comments/?post_id=<id>` - Get comments for a post
- `POST /comments/` - Create comment

### Contact
- `POST /contact/` - Submit contact message

### Analytics
- `GET /analytics` - Get analytics data
- `GET /activity` - Get activity logs
- `GET /online_users` - Get online users

## Deployment to Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Render will automatically:
   - Detect it's a Python project
   - Run `build.sh` (migrations + create admin)
   - Start with gunicorn
5. Add environment variables:
   - `CORS_ALLOWED_ORIGINS` - Your frontend URL
   - Other vars are auto-generated

## Environment Variables

- `SECRET_KEY` - Django secret key (auto-generated on Render)
- `DEBUG` - Debug mode (False in production)
- `DATABASE_URL` - Database connection string (auto-provided by Render)
- `ALLOWED_HOSTS` - Allowed hosts (comma-separated)
- `CORS_ALLOWED_ORIGINS` - CORS allowed origins (comma-separated)

## Tech Stack

- Django 5.2.7
- Django REST Framework 3.16.1
- PostgreSQL (production) / SQLite (development)
- Gunicorn (WSGI server)
- WhiteNoise (static files)
