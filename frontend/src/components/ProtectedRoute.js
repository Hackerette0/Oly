// src/components/ProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    // Optional: Verify token & role/admin status via API
    // For now: simple token check + localStorage role (you can improve later)
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data;

        if (adminOnly && !user.isAdmin) {
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAuthorized(false);
      }
    };

    checkAuth();
  }, [token, adminOnly]);

  if (isAuthorized === null) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Checking authorization...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;