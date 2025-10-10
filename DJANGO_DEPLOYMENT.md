# Django Backend Deployment Guide (Render)

## Overview

The Django backend is located in `backend_python/` directory and includes:
- ✅ Auto-migration on deployment
- ✅ Auto-creation of superuser (admin/admin@gmail.com/admin)
- ✅ All PHP backend functionality replicated
- ✅ PostgreSQL database (production)
- ✅ SQLite (local development)

## Local Testing

1. Navigate to backend directory:
```bash
cd backend_python
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run setup (creates DB, migrations, admin user):
```bash
python manage.py setup
```

5. Start development server:
```bash
python manage.py runserver
```

6. Access:
- API: http://localhost:8000
- Admin: http://localhost:8000/admin
- Login: admin / admin

## Deploy to Render

### Step 1: Push to GitHub
Code is already in the repository under `backend_python/` directory.

### Step 2: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `portfolio-php-app`
4. Configure:
   - **Name**: `portfolio-backend-django`
   - **Root Directory**: `backend_python`
   - **Environment**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn portfolio.wsgi:application`

### Step 3: Add Environment Variables

Render will auto-create:
- `DATABASE_URL` (PostgreSQL connection)
- `SECRET_KEY` (Django secret)

You need to add:
- **Key**: `CORS_ALLOWED_ORIGINS`
- **Value**: Your frontend URL (e.g., `https://your-frontend.onrender.com`)

Optional:
- `DEBUG`: `False` (default)
- `ALLOWED_HOSTS`: `.onrender.com` (default)

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will:
   - Install dependencies
   - Run migrations automatically
   - Create admin user (admin/admin@gmail.com/admin)
   - Start gunicorn server
3. Wait 5-10 minutes for first deployment
4. You'll get a URL like: `https://portfolio-backend-django.onrender.com`

### Step 5: Update Frontend

1. Go to your frontend Render service
2. Update environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://portfolio-backend-django.onrender.com`
3. Save (will trigger rebuild)

### Step 6: Test

Visit your backend URL:
- Root: `https://portfolio-backend-django.onrender.com/`
- Posts: `https://portfolio-backend-django.onrender.com/posts/`
- Admin: `https://portfolio-backend-django.onrender.com/admin/`

Login to admin with:
- Username: `admin`
- Password: `admin`
- **⚠️ Change password immediately!**

## API Endpoints

All endpoints from PHP backend are available:

### Authentication
- `POST /auth/register` - Register
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `GET /auth/user` - Current user

### Posts
- `GET /posts/` - List posts
- `GET /posts/?id=<id>` - Get single post
- `POST /posts/` - Create post
- `PUT /posts/<id>/` - Update post
- `DELETE /posts/<id>/` - Delete post
- `GET /posts/check_like/` - Check like status
- `POST /posts/like/` - Like post
- `DELETE /posts/unlike/` - Unlike post

### Projects
- `GET /projects/` - List projects
- `POST /projects/` - Create project

### Comments
- `GET /comments/?post_id=<id>` - Get comments
- `POST /comments/` - Add comment

### Contact
- `POST /contact/` - Submit message

### Analytics
- `GET /analytics` - Get analytics
- `GET /activity` - Get activity logs
- `GET /online_users` - Get online users

## Advantages over PHP Backend

✅ **Auto-deployment**: No manual FTP uploads
✅ **Auto-migrations**: Database updates automatically
✅ **Auto-admin**: Superuser created on first deploy
✅ **Better performance**: Gunicorn + PostgreSQL
✅ **Free SSL**: HTTPS by default
✅ **No 403 errors**: No InfinityFree restrictions
✅ **Better error handling**: Django's robust error system
✅ **Admin panel**: Built-in Django admin
✅ **Scalable**: Easy to add features

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Verify `requirements.txt` has correct versions
- Ensure `build.sh` is executable

### Database Issues
- Render auto-creates PostgreSQL database
- Check `DATABASE_URL` environment variable
- Migrations run automatically via `build.sh`

### CORS Errors
- Verify `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Check frontend is using correct backend URL
- Ensure `withCredentials: true` in axios config

### Admin User Not Created
- Check build logs for errors
- Run manually: `python manage.py setup`
- Or create via: `python manage.py createsuperuser`

## Monitoring

- **Logs**: Render Dashboard → Your Service → Logs
- **Metrics**: Render Dashboard → Your Service → Metrics
- **Database**: Render Dashboard → Databases → portfolio-db

## Scaling

Free tier limitations:
- Service spins down after 15 min inactivity
- First request after sleep takes ~30 seconds
- 750 hours/month free

Upgrade to paid plan for:
- Always-on service
- Better performance
- More resources

## Security

✅ **Change admin password** after first login
✅ **Set strong SECRET_KEY** (auto-generated by Render)
✅ **Use environment variables** for sensitive data
✅ **Enable HTTPS** (automatic on Render)
✅ **Regular updates**: Keep dependencies updated

## Next Steps

1. Deploy backend to Render
2. Update frontend `VITE_API_URL`
3. Test all endpoints
4. Change admin password
5. Create your first blog post!

🎉 Your Django backend is production-ready!
