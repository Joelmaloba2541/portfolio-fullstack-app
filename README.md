# Portfolio PHP App

A full-stack portfolio application with blog functionality, built with React (Frontend) and PHP (Backend).

## 🚀 Features

- **Portfolio Showcase**: Display your projects with images, descriptions, and links
- **Blog System**: Create, edit, and manage blog posts with rich content
- **User Authentication**: Secure login/registration system
- **Admin Dashboard**: Comprehensive admin panel with analytics
- **Comments System**: Users can comment on blog posts
- **Like/Unlike**: Interactive like functionality for blog posts
- **Real-time Analytics**: Track views, engagement, and user activity
- **Responsive Design**: Mobile-friendly UI with Bootstrap

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router v6
- Axios
- Bootstrap 5
- Vite

### Backend
- PHP 7.4+
- MySQL
- RESTful API architecture

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- PHP 7.4+
- MySQL 5.7+
- Apache/Nginx web server

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

1. Create a MySQL database
2. Configure database connection in `backend/db.php`:

```php
<?php
$host = "localhost";
$user = "your_username";
$pass = "your_password";
$db = "portfolio";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
```

3. Run database setup:
```bash
php backend/db_setup.php
```

4. Configure your web server to point to the `backend` directory

## 🌐 Deployment

### Frontend (Render)
- Build command: `npm run build`
- Publish directory: `dist`

### Backend (InfinityFree/cPanel)
- Upload `backend` directory contents
- Configure database credentials
- Ensure `.htaccess` is properly configured

## 📝 Environment Variables

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.com
```

## 🔒 Security Features

- Password hashing with bcrypt
- SQL injection prevention
- CORS configuration
- Input validation and sanitization

## 📄 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API endpoints.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please use the contact form in the application.

## 📜 License

This project is open source and available under the MIT License.
