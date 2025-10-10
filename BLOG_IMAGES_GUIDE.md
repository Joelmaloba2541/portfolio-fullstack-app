# Blog Images Guide

## Overview
Your blog now supports images in three ways:
1. **Header Image** - Featured image at the top of the post
2. **Inline Images** - Images within the blog content (auto-detected from URLs)
3. **HTML Images** - Full HTML support with `<img>` tags

## How to Add Images

### Method 1: Header/Featured Image (Easiest)

When creating a blog post in `/admin/blog`, use the **Image URL** field:

```
Title: My Amazing Blog Post
Content: This is my blog content...
Image URL: https://example.com/my-image.jpg
```

**Result:**
- Image displays at the top of the post
- Shows in blog list as thumbnail (300px max height)
- Shows in full post view (400px max height)
- Responsive and mobile-friendly

### Method 2: Inline Image URLs (Auto-Detected)

Simply paste image URLs directly in your content:

```
Title: Travel Blog
Content: 
Check out this amazing sunset!

https://example.com/sunset.jpg

And here's the beach:

https://example.com/beach.png

Wasn't that beautiful?
```

**Supported formats:** `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`

**Result:**
- URLs are automatically converted to `<img>` tags
- Images display inline with your content
- Styled with rounded corners and shadows

### Method 3: HTML Content (Advanced)

Write HTML directly in the content field:

```html
<h2>My Trip to Paris</h2>

<p>Here's the Eiffel Tower:</p>
<img src="https://example.com/eiffel-tower.jpg" alt="Eiffel Tower" />

<p>And here's the Louvre:</p>
<img src="https://example.com/louvre.jpg" alt="Louvre Museum" />

<p>It was an amazing experience!</p>
```

**Result:**
- Full HTML rendering
- Custom image attributes (alt text, classes, etc.)
- Support for paragraphs, headings, links, etc.

### Method 4: Upload Images (Recommended for Production)

Use the upload API to store images on your server:

```bash
# Upload image
curl -X POST http://localhost:8000/api/upload \
  -F "image=@/path/to/your/image.jpg"

# Response:
{
  "status": "success",
  "url": "/uploads/image.jpg"
}

# Use in blog post:
Image URL: http://localhost:8000/uploads/image.jpg
```

Or in content:
```
Check out my photo:

http://localhost:8000/uploads/my-photo.jpg
```

## Image Styling

All images in blog posts are automatically styled with:

```css
.post-content img {
  max-width: 100%;           /* Responsive */
  height: auto;              /* Maintain aspect ratio */
  border-radius: 8px;        /* Rounded corners */
  margin: 20px 0;            /* Spacing above/below */
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);  /* Subtle shadow */
}
```

## Examples

### Example 1: Simple Blog Post with Header Image

```
Title: My First Blog Post
Excerpt: A quick introduction to my blog
Content: 
Welcome to my blog! I'll be sharing my thoughts on technology, 
travel, and photography.

Stay tuned for more posts!

Category: General
Tags: introduction, welcome
Image URL: https://picsum.photos/800/400
```

### Example 2: Photo Gallery Post

```
Title: My Vacation Photos
Content:
Here are some highlights from my recent trip:

Day 1 - Arrival:
https://picsum.photos/800/400?random=1

Day 2 - Beach Day:
https://picsum.photos/800/400?random=2

Day 3 - Mountain Hiking:
https://picsum.photos/800/400?random=3

What an amazing trip!

Category: Travel
Tags: vacation, photos, travel
```

### Example 3: Tutorial with Screenshots

```
Title: How to Create a Blog Post
Content:
<h3>Step 1: Navigate to Admin</h3>
<p>Go to <code>/admin/blog</code> in your browser.</p>
<img src="https://example.com/screenshot1.png" alt="Admin page" />

<h3>Step 2: Fill Out the Form</h3>
<p>Enter your title, content, and other details.</p>
<img src="https://example.com/screenshot2.png" alt="Blog form" />

<h3>Step 3: Publish</h3>
<p>Click "Create Post" and you're done!</p>

Category: Tutorial
Tags: how-to, guide
```

## Image Sources

### Free Stock Photos
- **Unsplash**: https://unsplash.com/
- **Pexels**: https://www.pexels.com/
- **Pixabay**: https://pixabay.com/
- **Lorem Picsum** (placeholder): https://picsum.photos/

### Example URLs
```
https://images.unsplash.com/photo-1506905925346-21bda4d32df4
https://picsum.photos/800/600
https://via.placeholder.com/800x400
```

## Best Practices

### 1. Image Size
- **Header images**: 1200x600px or 16:9 ratio
- **Inline images**: 800px wide maximum
- **File size**: Keep under 500KB for fast loading

### 2. Image Format
- **Photos**: Use `.jpg` (smaller file size)
- **Graphics/logos**: Use `.png` (transparency support)
- **Animations**: Use `.gif` or `.webp`

### 3. Alt Text
When using HTML, always add alt text:
```html
<img src="image.jpg" alt="Description of image" />
```

### 4. Responsive Images
Images automatically scale to fit mobile screens. No extra work needed!

### 5. Image Optimization
Before uploading:
- Resize to appropriate dimensions
- Compress with tools like TinyPNG
- Use modern formats (WebP) when possible

## Troubleshooting

### Images Not Displaying

**Problem:** Image URL shows but no image appears

**Solutions:**
1. Check the URL is accessible (open in browser)
2. Verify CORS allows the image domain
3. Check image extension is supported
4. Ensure URL uses `https://` not `http://`

### Images Too Large

**Problem:** Images overflow on mobile

**Solution:** Already handled! CSS ensures `max-width: 100%`

### Images Not Auto-Detected

**Problem:** URL in content doesn't become an image

**Check:**
1. URL ends with image extension (`.jpg`, `.png`, etc.)
2. URL is on its own line with space above/below
3. URL starts with `http://` or `https://`

**Example that works:**
```
Here's my photo:

https://example.com/photo.jpg

Pretty cool, right?
```

**Example that doesn't work:**
```
Here's my photo: https://example.com/photo.jpg (inline won't work)
```

### Broken Images

**Problem:** Image shows broken icon

**Solutions:**
1. Verify image URL is correct
2. Check image still exists at that URL
3. Try opening URL directly in browser
4. Check for typos in URL

## Advanced: Image Upload Integration

To integrate image upload into the admin form:

1. Add file input to `AdminBlog.jsx`:
```jsx
<input 
  type="file" 
  accept="image/*"
  onChange={handleImageUpload}
/>
```

2. Upload handler:
```jsx
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('image', file);
  
  const res = await axiosInstance.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  setForm(f => ({ ...f, image: res.data.url }));
};
```

## Summary

✅ **Header images** work automatically via Image URL field
✅ **Inline images** auto-detected from URLs in content
✅ **HTML images** supported with full HTML in content
✅ **Responsive** - all images scale to screen size
✅ **Styled** - rounded corners, shadows, proper spacing
✅ **Multiple formats** - jpg, png, gif, webp, svg

Just paste image URLs and they'll display beautifully in your blog posts!
