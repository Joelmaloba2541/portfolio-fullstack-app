# InfinityFree Backend Deployment Guide

## Prerequisites
- InfinityFree account (free hosting)
- FTP client (FileZilla recommended)
- Your backend files ready

## Step 1: Create InfinityFree Account

1. Go to https://infinityfree.net
2. Click **"Sign Up"**
3. Create your account
4. Verify your email

## Step 2: Create Hosting Account

1. Log in to InfinityFree control panel
2. Click **"Create Account"**
3. Choose a subdomain or use your own domain
   - Example: `yourportfolio.infinityfreeapp.com`
4. Click **"Create Account"**
5. Wait for account activation (usually instant)

## Step 3: Get Database Credentials

1. In control panel, go to **"MySQL Databases"**
2. Click **"Create Database"**
3. Note down these credentials:
   - **MySQL Hostname**: `sqlXXX.infinityfreeapp.com`
   - **Database Name**: `epizXXXXXX_portfolio`
   - **Database Username**: `epizXXXXXX_user`
   - **Database Password**: (the one you set)

## Step 4: Configure Database Connection

1. On your local machine, copy `backend/db.example.php` to `backend/db.php`
2. Edit `backend/db.php` with your InfinityFree credentials:

```php
<?php
$host = "sqlXXX.infinityfreeapp.com";  // Your MySQL hostname
$user = "epizXXXXXX_user";              // Your database username
$pass = "your_password";                 // Your database password
$db = "epizXXXXXX_portfolio";           // Your database name

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
?>
```

## Step 5: Get FTP Credentials

1. In control panel, go to **"FTP Details"**
2. Note down:
   - **FTP Hostname**: `ftpupload.net`
   - **FTP Username**: `epizXXXXXX`
   - **FTP Password**: (shown in control panel)
   - **FTP Port**: `21`

## Step 6: Upload Files via FTP

### Using FileZilla:

1. Open FileZilla
2. Enter FTP credentials:
   - Host: `ftpupload.net`
   - Username: `epizXXXXXX`
   - Password: (your FTP password)
   - Port: `21`
3. Click **"Quickconnect"**

4. Navigate to `/htdocs` folder on the remote server
5. Upload all files from your `backend` folder:
   - `.htaccess`
   - `index.php`
   - `db.php` (the one you configured)
   - `db_setup.php`
   - `routes/` folder (all PHP files)
   
6. Create `uploads` folder and set permissions to `755`

## Step 7: Initialize Database

1. Open your browser
2. Go to: `https://yourportfolio.infinityfreeapp.com/db_setup.php`
3. You should see: "Database and tables created successfully."
4. **IMPORTANT**: Delete or rename `db_setup.php` for security:
   - In FileZilla, right-click `db_setup.php`
   - Rename to `db_setup.php.bak` or delete it

## Step 8: Test Your API

Test these endpoints in your browser:

1. **Get Posts**: `https://yourportfolio.infinityfreeapp.com/posts`
2. **Get Projects**: `https://yourportfolio.infinityfreeapp.com/projects`

You should see JSON responses.

## Step 9: Update Frontend Environment Variable

1. Go back to Render dashboard
2. Update `VITE_API_URL` to: `https://yourportfolio.infinityfreeapp.com`
3. Save and wait for automatic rebuild

## Step 10: Create Admin User

You'll need to create an admin user manually via phpMyAdmin:

1. In InfinityFree control panel, go to **"MySQL Databases"**
2. Click **"Manage"** or **"phpMyAdmin"**
3. Select your database
4. Click on `users` table
5. Click **"Insert"**
6. Add a user with:
   - `username`: your_admin_username
   - `email`: your_email@example.com
   - `password`: (hash it first - use online bcrypt generator)
   - `is_admin`: 1
7. Click **"Go"**

Or use this SQL query:
```sql
INSERT INTO users (username, email, password, is_admin) 
VALUES ('admin', 'admin@example.com', '$2y$10$hashedpasswordhere', 1);
```

## Important Notes

### File Upload Limits
- InfinityFree has a 10MB file upload limit
- Adjust your upload validation accordingly

### CORS Configuration
The `.htaccess` file already includes CORS headers. If you have issues:

```apache
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type, Authorization"
```

### Database Connection Issues
- Verify hostname is correct (check control panel)
- Ensure database user has all privileges
- Check if database name includes the prefix

### .htaccess Not Working
- Ensure it's uploaded to the root of htdocs
- Check file permissions (644)
- Verify mod_rewrite is enabled (it should be by default)

## Security Checklist

- [ ] `db_setup.php` deleted or renamed
- [ ] `db.php` is NOT in version control (it's in .gitignore)
- [ ] Admin password is strong and hashed
- [ ] File upload directory has correct permissions
- [ ] Error reporting is disabled in production

## Monitoring & Maintenance

### Check Logs
- InfinityFree provides error logs in control panel
- Go to **"Error Logs"** to debug issues

### Backup Database
- Use phpMyAdmin to export database regularly
- Go to **"Export"** tab and download SQL file

## Alternative: Use Paid Hosting

If you encounter limitations with InfinityFree, consider:
- **Hostinger** ($1.99/month)
- **Namecheap** ($1.58/month)
- **Render Web Service** (PHP support, starts at $7/month)

These offer better performance, no ads, and higher limits.

## Troubleshooting

### 500 Internal Server Error
- Check error logs in control panel
- Verify .htaccess syntax
- Ensure PHP version compatibility

### Database Connection Failed
- Double-check credentials
- Ensure database exists
- Check if IP is allowed (InfinityFree allows all by default)

### File Upload Not Working
- Check `uploads` folder exists
- Verify folder permissions (755 or 777)
- Check PHP upload limits

## Next Steps

After successful deployment:
1. Test all features (login, blog posts, comments, likes)
2. Create your first blog post
3. Add your projects
4. Share your portfolio URL! 🎉
