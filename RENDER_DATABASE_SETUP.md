# Setting Up PostgreSQL Database on Render

## Step 1: Create a PostgreSQL Database on Render

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Click "New +"** in the top right corner
3. **Select "PostgreSQL"**
4. **Configure the database**:
   - **Name**: `portfolio-db` (or any name you prefer)
   - **Database**: `portfolio` (default is fine)
   - **User**: `portfolio` (default is fine)
   - **Region**: Choose the same region as your web service for better performance
   - **PostgreSQL Version**: 16 (or latest available)
   - **Plan**: Select **"Free"**
5. **Click "Create Database"**

## Step 2: Get the Database Connection String

After the database is created:

1. Go to your PostgreSQL database dashboard on Render
2. Scroll down to the **"Connections"** section
3. Copy the **"Internal Database URL"** (this is important - use Internal, not External)
   - It will look like: `postgresql://user:password@hostname/database`
   - The Internal URL is faster and free (no egress charges)

## Step 3: Add Database URL to Your Web Service

1. Go to your **Web Service** dashboard on Render
2. Click on **"Environment"** in the left sidebar
3. Click **"Add Environment Variable"**
4. Add the following:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the **Internal Database URL** you copied
5. **Click "Save Changes"**

Your web service will automatically redeploy with the new database connection.

## Step 4: Verify the Connection

After deployment completes:

1. Check the deployment logs to ensure migrations ran successfully
2. Your Django app should now be using PostgreSQL instead of SQLite
3. The `python manage.py setup` command will create the admin user in PostgreSQL

## Important Notes

- **Free PostgreSQL databases on Render**:
  - 90-day expiration (you'll get email reminders to extend)
  - 1 GB storage
  - Shared CPU
  - Perfect for development and small projects

- **Database URL**: The `dj-database-url` package in your settings.py automatically reads the `DATABASE_URL` environment variable

- **Migrations**: Your build.sh already runs migrations via `python manage.py setup`

## Troubleshooting

If you encounter connection issues:

1. Make sure you're using the **Internal Database URL**, not the External one
2. Verify the `DATABASE_URL` environment variable is set correctly
3. Check deployment logs for any migration errors
4. Ensure `psycopg2-binary` is in your requirements.txt (already included)

## Admin Access

After successful deployment, you can access the admin panel:
- URL: `https://your-app.onrender.com/admin/`
- Username: `admin`
- Email: `admin@gmail.com`
- Password: `admin`

**⚠️ Important**: Change the default admin password in production!
