import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    // Redirect to home page if user is not admin
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute; 