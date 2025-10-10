# Troubleshooting Guide

## Frontend Not Communicating with Backend

### Quick Checks

1. **Test Backend API Directly**
   - Open browser and go to: `https://your-backend-url.com/test`
   - You should see: `{"status":"success","message":"API is working!"}`
   - If this fails, backend is not deployed correctly

2. **Check CORS Headers**
   - Open browser DevTools (F12) → Network tab
   - Look for CORS errors in console
   - Verify response headers include `Access-Control-Allow-Origin`

3. **Verify Environment Variable**
   - In Render dashboard, check `VITE_API_URL` is set correctly
   - Should be: `https://your-infinityfree-domain.com` (no trailing slash)
   - After changing, Render will auto-rebuild

### Common Issues & Solutions

#### Issue 1: CORS Error
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
- Ensure backend `.htaccess` has CORS headers (already fixed)
- Verify `index.php` sets CORS headers (already fixed)
- On InfinityFree, ensure `.htaccess` is uploaded

#### Issue 2: 404 Not Found
**Error**: API endpoints return 404

**Solution**:
- Check `.htaccess` is in the root of your backend folder
- Verify mod_rewrite is enabled (it should be on InfinityFree)
- Test direct route: `https://your-backend.com/index.php/posts`

#### Issue 3: Wrong API URL
**Error**: Network error or connection refused

**Solution**:
- Check `VITE_API_URL` in Render environment variables
- Should NOT include `/api/` at the end
- Should NOT have trailing slash
- Correct: `https://yoursite.infinityfreeapp.com`
- Wrong: `https://yoursite.infinityfreeapp.com/api/`

#### Issue 4: Database Connection Failed
**Error**: 500 Internal Server Error

**Solution**:
- Verify `db.php` has correct credentials
- Check database exists in InfinityFree control panel
- Test with: `https://your-backend.com/testdb`

#### Issue 5: Mixed Content (HTTP/HTTPS)
**Error**: Mixed content blocked

**Solution**:
- Ensure both frontend and backend use HTTPS
- Update `VITE_API_URL` to use `https://` not `http://`

### Testing Steps

1. **Test Backend Locally**
   ```bash
   # In backend directory
   php -S localhost:8000
   ```
   Then visit: `http://localhost:8000/test`

2. **Test Frontend Locally**
   ```bash
   # In frontend directory
   npm run dev
   ```
   Update `.env` to point to your deployed backend

3. **Test Production Backend**
   - Visit: `https://your-backend.com/test`
   - Visit: `https://your-backend.com/posts`
   - Visit: `https://your-backend.com/projects`

4. **Check Browser Console**
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests
   - Look at request/response headers

### Environment Variables

#### Local Development (.env)
```
VITE_API_URL=http://localhost:8000
```

#### Production (Render)
```
VITE_API_URL=https://your-infinityfree-domain.com
```

### Debugging Tips

1. **Enable Error Logging**
   Add to `backend/index.php` at the top:
   ```php
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. **Check Request in Browser**
   - Open DevTools → Network tab
   - Click on failed request
   - Check "Headers" tab for request URL
   - Check "Response" tab for error message

3. **Test with cURL**
   ```bash
   curl https://your-backend.com/posts
   ```

4. **Check .htaccess**
   Ensure it's uploaded and has correct permissions (644)

### InfinityFree Specific Issues

#### Issue: 403 Forbidden
- InfinityFree blocks certain keywords
- Use phpMyAdmin instead of `db_setup.php`
- Avoid SQL keywords in URLs

#### Issue: File Upload Fails
- Check `uploads` folder exists
- Set permissions to 755 or 777
- InfinityFree has 10MB upload limit

#### Issue: Slow Response
- Free hosting has resource limits
- Consider upgrading or using paid hosting
- Optimize database queries

### Still Not Working?

1. **Check InfinityFree Error Logs**
   - Go to Control Panel → Error Logs
   - Look for PHP errors

2. **Verify File Structure**
   ```
   htdocs/
   ├── .htaccess
   ├── index.php
   ├── db.php
   ├── routes/
   │   ├── auth.php
   │   ├── posts.php
   │   ├── projects.php
   │   └── ...
   └── uploads/
   ```

3. **Test Each Endpoint**
   - `/test` - API working
   - `/testdb` - Database connection
   - `/posts` - Get posts
   - `/projects` - Get projects
   - `/auth` - Authentication

4. **Contact Support**
   - Render: Check build logs
   - InfinityFree: Check error logs and forums

### Quick Fix Checklist

- [ ] Backend `.htaccess` uploaded with CORS headers
- [ ] `db.php` has correct InfinityFree credentials
- [ ] Database tables created via phpMyAdmin
- [ ] `VITE_API_URL` set in Render (no trailing slash)
- [ ] Frontend rebuilt after environment variable change
- [ ] Both frontend and backend use HTTPS
- [ ] Test backend URL directly in browser
- [ ] Check browser console for errors
- [ ] Verify CORS headers in Network tab
