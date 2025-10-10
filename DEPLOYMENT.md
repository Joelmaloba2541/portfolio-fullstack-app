# Deployment Guide

## Frontend Deployment (Render)

### Step 1: Prepare Frontend
1. Update `.env` file with production backend URL:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

### Step 2: Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure build settings:
   - **Name**: portfolio-frontend (or your choice)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: Your backend URL (e.g., `https://yourdomain.infinityfreeapp.com`)
6. Click "Create Static Site"

### Step 3: Configure Redirects for React Router
Render will automatically handle this with the `_redirects` file in the dist folder.

---

## Backend Deployment (InfinityFree)

### Step 1: Sign Up & Create Account
1. Go to [InfinityFree](https://infinityfree.net/)
2. Sign up for a free account
3. Create a new hosting account
4. Note your:
   - FTP credentials
   - MySQL database name
   - MySQL username
   - MySQL password
   - MySQL hostname

### Step 2: Create Database
1. Go to Control Panel → MySQL Databases
2. Create a new database (note the database name)
3. Create a database user
4. Add user to database with all privileges

### Step 3: Configure Database Connection
1. Copy `backend/db.example.php` to `backend/db.php`
2. Update with your InfinityFree database credentials:
   ```php
   $host = "sqlXXX.infinityfreeapp.com"; // Your MySQL hostname
   $user = "epizXXXXXX_username";        // Your MySQL username
   $pass = "your_password";               // Your MySQL password
   $db = "epizXXXXXX_dbname";            // Your database name
   ```

### Step 4: Upload Files via FTP
1. Use FileZilla or FTP client
2. Connect using your FTP credentials
3. Upload entire `backend` folder to `htdocs` directory
4. Ensure `.htaccess` file is uploaded

### Step 5: Initialize Database
1. Access: `https://yourdomain.infinityfreeapp.com/db_setup.php`
2. This will create all necessary tables
3. **IMPORTANT**: Delete or rename `db_setup.php` after running for security

### Step 6: Update Frontend Environment
1. Update your Render environment variable `VITE_API_URL` with your InfinityFree URL
2. Redeploy frontend on Render

---

## Alternative: Deploy Both on Render

If you prefer to deploy both frontend and backend on Render:

### Backend on Render (Web Service)
1. Create new "Web Service"
2. Root Directory: `backend`
3. Runtime: PHP
4. Build Command: (leave empty)
5. Start Command: (Render handles this automatically)
6. Add environment variables for database

---

## Post-Deployment Checklist

- [ ] Database is set up and accessible
- [ ] Backend API endpoints are working
- [ ] Frontend can communicate with backend
- [ ] CORS is properly configured
- [ ] Environment variables are set correctly
- [ ] Test user registration and login
- [ ] Test blog post creation
- [ ] Test image uploads
- [ ] Test comments and likes functionality
- [ ] Remove or secure `db_setup.php`

---

## Troubleshooting

### CORS Issues
If you get CORS errors, ensure backend `.htaccess` has:
```apache
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type, Authorization"
```

### Database Connection Issues
- Verify database credentials
- Check if database host is accessible
- Ensure database user has proper privileges

### File Upload Issues
- Check `uploads` directory permissions (755 or 777)
- Verify PHP upload limits in `php.ini`
- Check InfinityFree file upload restrictions

### Build Errors on Render
- Clear build cache and retry
- Check Node.js version compatibility
- Verify all dependencies are in package.json
