# Frontend Deployment Guide (Render)

## Your Backend URL
```
https://portfolio-python1-app.onrender.com
```

---

## Deploy Frontend to Render

### Step 1: Create Static Site

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository: `portfolio-fullstack-app`

### Step 2: Configure Build Settings

Fill in these settings:

- **Name**: `portfolio-frontend` (or any name you prefer)
- **Root Directory**: `frontend`
- **Build Command**: 
  ```
  npm install && npm run build
  ```
- **Publish Directory**: 
  ```
  dist
  ```

### Step 3: Add Environment Variable

Click **"Advanced"** or go to **Environment** tab and add:

**Key**: `VITE_API_URL`  
**Value**: `https://portfolio-python1-app.onrender.com`

### Step 4: Deploy

1. Click **"Create Static Site"**
2. Wait 2-5 minutes for build and deployment
3. You'll get a URL like: `https://portfolio-frontend-xxxx.onrender.com`

---

## After Frontend Deployment

### Update Backend CORS

1. Go to your backend service: https://dashboard.render.com/
2. Click on `portfolio-python1-app` service
3. Go to **Environment** tab
4. Find or add `CORS_ALLOWED_ORIGINS`
5. Set value to your frontend URL:
   ```
   https://your-frontend-url.onrender.com
   ```
6. Click **Save Changes** (will trigger redeploy)

---

## Environment Variables Summary

### Frontend (.env for Render)
```
VITE_API_URL=https://portfolio-python1-app.onrender.com
```

### Backend (Update CORS)
```
CORS_ALLOWED_ORIGINS=https://your-frontend-url.onrender.com
```

---

## Testing After Deployment

1. **Visit your frontend URL**
2. **Open browser console** (F12)
3. **Check for errors**:
   - No CORS errors
   - API calls succeed
   - Data loads correctly

### Test These Features:
- [ ] Homepage loads
- [ ] Blog posts display
- [ ] Projects display
- [ ] Contact form works
- [ ] User registration works
- [ ] User login works
- [ ] Comments work
- [ ] Like/unlike works

---

## Troubleshooting

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Fix**: Update `CORS_ALLOWED_ORIGINS` in backend with your frontend URL

### API Not Found (404)
**Fix**: Verify `VITE_API_URL` is set correctly in frontend environment variables

### Build Fails
**Fix**: Check build logs, ensure `package.json` is correct

---

## Local Development

For local testing, create `frontend/.env`:
```
VITE_API_URL=https://portfolio-python1-app.onrender.com
```

Or use local backend:
```
VITE_API_URL=http://localhost:8000
```

Then run:
```bash
cd frontend
npm install
npm run dev
```

---

## Quick Reference

**Backend URL**: https://portfolio-python1-app.onrender.com  
**Backend Admin**: https://portfolio-python1-app.onrender.com/admin/  
**Frontend URL**: (will be provided after deployment)

**Admin Credentials**:
- Username: `admin`
- Password: `admin`
- ⚠️ Change after first login!

---

## Next Steps

1. ✅ Backend deployed and working
2. 🔄 Deploy frontend (follow steps above)
3. 🔄 Update backend CORS with frontend URL
4. ✅ Test all features
5. 🎉 Your portfolio is live!
