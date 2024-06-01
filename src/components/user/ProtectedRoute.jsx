import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/account" replace /> : children;
};

export default ProtectedRoute;
