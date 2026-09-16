import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="pin-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="pushpin"><div className="pushpin-head"></div><div className="pushpin-point"></div></div>
          <p style={{ fontFamily: 'var(--font-marker)', fontSize: '1.4rem' }}>Checking Noticeboard Pass...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
