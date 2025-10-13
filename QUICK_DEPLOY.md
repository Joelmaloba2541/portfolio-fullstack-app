# Quick Deploy Guide

## Backend Status: LIVE
**URL**: https://portfolio-python1-app.onrender.com

---

## Deploy Frontend Now

### Copy-Paste Settings for Render:

1. **Go to**: https://dashboard.render.com/
2. **Click**: New + → Static Site
3. **Select**: `portfolio-fullstack-app` repository

### Build Settings:
```
Name: portfolio-frontend
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

### Environment Variable:
```
Key: VITE_API_URL
Value: https://portfolio-python1-app.onrender.com
```

### Click: **Create Static Site**

---

## After Frontend Deploys

You'll get a URL like: `https://portfolio-frontend-xxxx.onrender.com`

### Update Backend CORS:

1. Go to backend service on Render
2. Environment tab
3. Add/Update:
   ```
   Key: CORS_ALLOWED_ORIGINS
   Value: https://your-frontend-url.onrender.com
   ```
4. Save

---

## That's It!

Your portfolio will be fully live with:
- Django REST API backend
- React frontend
- PostgreSQL database
- Auto-deployment from GitHub
- Free SSL (HTTPS)
- Admin panel at `/admin/`

---

## Admin Access

**URL**: https://portfolio-python1-app.onrender.com/admin/

**Login**:
- Username: `admin`
- Password: `admin`

 **Change password immediately after first login!**

---

## 📚 Full Documentation

- `FRONTEND_DEPLOYMENT.md` - Detailed frontend guide
- `DJANGO_DEPLOYMENT.md` - Backend deployment guide
- `DEPLOYMENT_SUMMARY.md` - Complete overview
- `backend_python/RENDER_TROUBLESHOOTING.md` - Common issues

---

**Ready to deploy? Follow the steps above! 🚀**
