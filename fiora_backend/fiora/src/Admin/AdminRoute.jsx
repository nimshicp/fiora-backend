import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return user?.role === 'admin' || user?.role === 'superadmin' ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

export default AdminRoute;