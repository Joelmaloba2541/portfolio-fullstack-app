# Render Deployment Guide

## Step-by-Step Instructions

### 1. Prepare Your Repository
✅ Already done - Your code is on GitHub at: https://github.com/Joelmaloba2541/portfolio-fullstack-app

### 2. Sign Up / Log In to Render
1. Go to https://render.com
2. Sign up or log in with your GitHub account

### 3. Create New Static Site
1. Click **"New +"** button in the top right
2. Select **"Static Site"**
3. Connect your GitHub account if not already connected
4. Select the repository: **portfolio-fullstack-app**

### 4. Configure Build Settings
Fill in the following:

- **Name**: `portfolio-frontend` (or your preferred name)
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `frontend/dist`

### 5. Add Environment Variable
Click **"Advanced"** and add:

- **Key**: `VITE_API_URL`
- **Value**: Your backend URL (you'll update this after deploying backend)
  - For now, use: `http://localhost/portfolio-fullstack-app/backend`
  - Later update to: `https://your-infinityfree-domain.com` or your actual backend URL

### 6. Deploy
1. Click **"Create Static Site"**
2. Render will automatically build and deploy your app
3. Wait for the build to complete (usually 2-5 minutes)
4. You'll get a URL like: `https://portfolio-frontend-xxxx.onrender.com`

### 7. Update Backend URL (After Backend Deployment)
1. Go to your Render dashboard
2. Click on your static site
3. Go to **"Environment"** tab
4. Update `VITE_API_URL` with your actual backend URL
5. Click **"Save Changes"**
6. Render will automatically rebuild and redeploy

## Troubleshooting

### Build Fails
- Check the build logs in Render dashboard
- Ensure `package.json` has all dependencies
- Verify Node.js version compatibility

### 404 Errors on Routes
- The `_redirects` file should handle this automatically
- Verify `frontend/public/_redirects` exists with content: `/* /index.html 200`

### Environment Variables Not Working
- Make sure variable name is exactly `VITE_API_URL` (case-sensitive)
- Variables starting with `VITE_` are exposed to the frontend
- Rebuild after changing environment variables

## Custom Domain (Optional)
1. In Render dashboard, go to **"Settings"**
2. Scroll to **"Custom Domain"**
3. Add your domain and follow DNS configuration instructions

## Auto-Deploy on Git Push
Render automatically deploys when you push to the main branch on GitHub!

## Next Steps
After frontend is deployed, proceed with backend deployment to InfinityFree.
