import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardEnhanced from "./pages/AdminDashboardEnhanced";
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import NavbarComp from "./components/NavbarComp";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProjectPage from "./pages/ProjectPage";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import AdminBlog from "./pages/AdminBlog";
import AdminPortfolio from "./pages/AdminPortfolio";
import NotFound from "./pages/NotFound";
function App() {
  useEffect(() => {
    // Set theme from localStorage, fallback to light
    const theme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarComp />
      <main className="container py-4 flex-grow-1" role="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/blog" 
            element={
              <ProtectedAdminRoute>
                <AdminBlog />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/portfolio" 
            element={
              <ProtectedAdminRoute>
                <AdminPortfolio />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/enhanced" 
            element={
              <ProtectedAdminRoute>
                <AdminDashboardEnhanced />
              </ProtectedAdminRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
