import React from 'react';
import { Navigate } from 'react-router-dom';

function getUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function ProtectedAdminRoute({ children }) {
  const user = getUser();
  const isAdmin = user?.is_admin == true; // Check specifically for is_admin flag

  if (!isAdmin) {
    // Redirect non-admin users to login
    return <Navigate to="/login" replace />;
  }

  return children;
}