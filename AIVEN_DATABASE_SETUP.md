# Setting Up Free PostgreSQL Database on Aiven

## Why Aiven?
- ✅ **No expiration** (unlike Render's 90-day limit)
- ✅ **Free tier**: 1 vCPU, 1GB RAM, 5GB storage
- ✅ **Reliable and production-ready**
- ✅ **Easy setup**

## Step 1: Create Aiven Account

1. Go to **https://aiven.io/**
2. Click **"Sign Up"** or **"Start Free"**
3. Sign up with:
   - Email
   - Google account
   - GitHub account
4. Verify your email

## Step 2: Create PostgreSQL Database

1. **Login to Aiven Console**: https://console.aiven.io/
2. Click **"Create Service"**
3. **Select PostgreSQL**:
   - Service: **PostgreSQL**
   - Cloud Provider: Choose any (AWS, Google Cloud, Azure)
   - Region: Choose closest to your Render deployment (e.g., `us-east-1` for US East)
4. **Select Plan**:
   - Choose **"Free"** plan (Hobbyist)
   - 1 vCPU, 1GB RAM, 5GB storage
5. **Service Name**: 
   - Enter a name like `portfolio-postgres` or `portfolio-db`
6. Click **"Create Service"**

⏱️ **Wait 5-10 minutes** for the database to be created and start running.

## Step 3: Get Connection Details

Once your service is **RUNNING**:

1. Click on your PostgreSQL service
2. Go to the **"Overview"** tab
3. Scroll down to **"Connection information"**
4. You'll see:
   - **Host**: `your-service.aivencloud.com`
   - **Port**: `12345` (usually a custom port)
   - **User**: `avnadmin`
   - **Password**: (click to reveal)
   - **Database**: `defaultdb`

### Option A: Use Service URI (Recommended)
Look for **"Service URI"** - it looks like:
```
postgres://avnadmin:password@your-service.aivencloud.com:12345/defaultdb?sslmode=require
```

### Option B: Build Connection String Manually
If you don't see Service URI, construct it:
```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?sslmode=require
```

**Important**: Aiven requires SSL, so always include `?sslmode=require` at the end.

## Step 4: Add Database URL to Render

1. Go to your **Render Web Service** dashboard
2. Click **"Environment"** in the left sidebar
3. Click **"Add Environment Variable"**
4. Add:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the **Service URI** from Aiven
     ```
     postgres://avnadmin:your_password@your-service.aivencloud.com:12345/defaultdb?sslmode=require
     ```
5. **Click "Save Changes"**

Your Render service will automatically redeploy with the new database connection.

## Step 5: Verify Connection

After deployment completes, verify PostgreSQL is working:

### Method 1: API Endpoint (Easiest)
Visit:
```
https://your-app.onrender.com/api/database-info
```

**Expected Response:**
```json
{
  "status": "success",
  "database": {
    "type": "PostgreSQL",
    "engine": "django.db.backends.postgresql",
    "name": "defaultdb",
    "host": "your-service.aivencloud.com",
    "is_postgresql": true
  }
}
```

### Method 2: Check Deployment Logs
1. Go to Render dashboard → **Logs** tab
2. Look for successful migration messages:
   ```
   Running migrations...
   Operations to perform:
     Apply all migrations: admin, auth, contenttypes, core, sessions
   Running migrations:
     Applying contenttypes.0001_initial... OK
   Creating superuser...
   Superuser "admin" created successfully!
   ```

### Method 3: Test Data Persistence
1. Login to admin: `https://your-app.onrender.com/admin/`
2. Create a test post or project
3. Trigger a redeploy on Render
4. Check if data still exists → PostgreSQL is working! ✓

## Important Notes

### Free Tier Limits
- **Storage**: 5GB
- **RAM**: 1GB
- **CPU**: 1 vCPU
- **Connections**: Limited (usually 25-100)
- **No expiration** - runs indefinitely

### SSL Requirement
Aiven **requires SSL connections**. Your connection string must include:
```
?sslmode=require
```

This is already handled by `psycopg2-binary` in your requirements.txt.

### Database Management
Access your database via Aiven Console:
- **Metrics**: CPU, memory, disk usage
- **Logs**: Query logs, error logs
- **Backups**: Automatic backups included
- **Users**: Manage database users
- **Databases**: Create additional databases

## Troubleshooting

### Connection Refused
- ✓ Ensure service is **RUNNING** (not starting/restarting)
- ✓ Check `?sslmode=require` is in the connection string
- ✓ Verify password is correct (no extra spaces)

### SSL Error
- ✓ Make sure connection string ends with `?sslmode=require`
- ✓ Verify `psycopg2-binary` is installed (already in requirements.txt)

### Migration Errors
- ✓ Check Render deployment logs for specific error messages
- ✓ Ensure `DATABASE_URL` environment variable is set correctly
- ✓ Verify the database is accessible (not in maintenance mode)

### Can't Connect from Local Development
If you want to test locally:
1. Copy the Service URI from Aiven
2. Set it as environment variable:
   ```bash
   export DATABASE_URL="postgres://avnadmin:password@your-service.aivencloud.com:12345/defaultdb?sslmode=require"
   ```
3. Run migrations:
   ```bash
   python manage.py migrate
   python manage.py setup
   ```

## Admin Access

After successful deployment:
- **URL**: `https://your-app.onrender.com/admin/`
- **Username**: `admin`
- **Email**: `admin@gmail.com`
- **Password**: `admin`

**⚠️ Security**: Change the default admin password immediately in production!

## Aiven Console Features

### Monitor Your Database
- **Metrics**: Real-time CPU, memory, disk usage
- **Query Statistics**: See slow queries
- **Connection Pooling**: Available on paid plans

### Backups
- Automatic daily backups (retained for 2 days on free tier)
- Point-in-time recovery available on paid plans

### Upgrade Path
When you need more resources:
- **Startup**: 2 vCPU, 4GB RAM, 80GB storage
- **Business**: 4 vCPU, 16GB RAM, 175GB storage
- **Premium**: 8+ vCPU, 32GB+ RAM, 350GB+ storage

## Next Steps

1. ✅ Create Aiven account
2. ✅ Create PostgreSQL service (wait for RUNNING status)
3. ✅ Copy Service URI
4. ✅ Add `DATABASE_URL` to Render environment variables
5. ✅ Wait for Render to redeploy
6. ✅ Verify at `/api/database-info`
7. ✅ Login to admin and test

Your Django app will seamlessly switch from SQLite to PostgreSQL!
