import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, decode it to get user role
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userRole = payload.role;

    // Check if user has required role
    if (role) {
      // Allow super_admin to access admin routes
      const hasAccess = userRole === role || 
                       (role === 'admin' && (userRole === 'super_admin' || userRole === 'admin'));
      
      if (!hasAccess) {
        return <Navigate to="/" replace />;
      }
    }

    // User is authenticated and has correct role
    return children;
  } catch (error) {
    // Token is invalid, remove it and redirect to login
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
