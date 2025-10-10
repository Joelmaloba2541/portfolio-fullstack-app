import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import DarkToggle from "./DarkToggle";
import axiosInstance from '../axiosConfig';

function getUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function NavbarComp() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(getUser());
  const location = useLocation();
  const isAdmin = currentUser?.is_admin == true; // Check specifically for is_admin flag

  // Listen for storage events (when user logs in/out)
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(getUser());
    };

    window.addEventListener('storage', handleStorageChange);
    // Also check periodically
    const interval = setInterval(() => {
      const user = getUser();
      if (user && user.is_admin == true && JSON.stringify(user) !== JSON.stringify(currentUser)) {
        setCurrentUser(user);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [currentUser]);

  // Fetch online users every 30 seconds
  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const response = await axiosInstance.get('online_users');
        if (response.data.status === 'success') {
          // Django API returns data in response.data.data
          const users = Array.isArray(response.data?.data) ? response.data.data : [];
          setOnlineUsers(users);
        }
      } catch (error) {
        console.error('Error fetching online users:', error);
        setOnlineUsers([]); // Set empty array on error
      }
    };

    fetchOnlineUsers(); // Initial fetch
    const interval = setInterval(fetchOnlineUsers, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsNavCollapsed(true);
  }, [location]);

  return (
    <nav className={`navbar navbar-expand-lg sticky-top transition-all ${
      isScrolled ? 'shadow-sm py-2' : 'py-3'
    }`} role="navigation" aria-label="Main navigation">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <span className="text-gradient">JM</span>
          <span className="d-none d-sm-inline ms-2 text-gradient">Joel Maloba</span>
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
          aria-controls="navbarContent" 
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarContent">
          <ul className="navbar-nav mx-auto py-3 py-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link px-3" to="/" end>
                <i className="bi bi-house-door me-2"></i>Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3" to="/projects">
                <i className="bi bi-code-square me-2"></i>Projects
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3" to="/blog">
                <i className="bi bi-journal-text me-2"></i>Blog
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3" to="/about">
                <i className="bi bi-person me-2"></i>About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3" to="/contact">
                <i className="bi bi-envelope me-2"></i>Contact
              </NavLink>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link px-3" to="/admin/dashboard">
                  <i className="bi bi-speedometer2 me-2"></i>Admin
                </NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {/* Online Users Dropdown */}
            <div className="dropdown">
              <button 
                className="btn btn-outline-secondary btn-sm dropdown-toggle" 
                type="button" 
                id="onlineUsersDropdown" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <i className="bi bi-people-fill me-1"></i>
                Online ({onlineUsers.length})
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="onlineUsersDropdown">
                {onlineUsers.length === 0 ? (
                  <li><span className="dropdown-item text-muted">No users online</span></li>
                ) : (
                  onlineUsers.map(user => (
                    <li key={user.id}>
                      <span className="dropdown-item">
                        <i className="bi bi-person-fill me-2"></i>
                        {user.username}
                        {user.is_admin && (
                          <span className="badge bg-success ms-2">Admin</span>
                        )}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <DarkToggle />
            {currentUser ? (
              <div className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1">
                  <i className="bi bi-person-circle text-primary me-2"></i>
                  <span className="fw-bold text-primary">{currentUser.username}</span>
                  {isAdmin ? (
                    <span className="badge bg-success ms-2">Admin</span>
                  ) : (
                    <span className="badge bg-secondary ms-2">User</span>
                  )}
                </div>
                <div className="btn-group">
                  <Link to="/profile" className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-gear-fill me-1"></i>
                    Profile
                  </Link>
                  <button 
                    className="btn btn-outline-danger btn-sm" 
                    onClick={() => {
                      localStorage.removeItem('user');
                      setCurrentUser(null);
                      window.location.href = '/';
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">
                  <i className="bi bi-person-circle me-2"></i>Login
                </Link>
                <Link to="/register" className="btn btn-outline-primary">
                  <i className="bi bi-person-plus me-2"></i>Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
