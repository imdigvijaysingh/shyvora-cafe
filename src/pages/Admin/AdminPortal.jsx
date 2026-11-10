import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const AdminPortal = () => {
  const [token, setToken] = useState(localStorage.getItem('cafe_admin_token') || '');
  const [isVerifying, setIsVerifying] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem('cafe_admin_token');
      if (!savedToken) {
        setIsVerifying(false);
        return;
      }

      // If it's a local admin session, authenticate directly without network check
      if (savedToken.startsWith('cafe_admin_local_session')) {
        setToken(savedToken);
        setIsVerifying(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${savedToken}` }
        });
        
        let data = null;
        try {
          const text = await res.text();
          data = JSON.parse(text);
        } catch (_) {}

        if (res.ok && data && data.success) {
          setToken(savedToken);
        } else if (savedToken.startsWith('cafe_admin_local_session')) {
          setToken(savedToken);
        } else if (res.status === 401 || (data && !data.success)) {
          localStorage.removeItem('cafe_admin_token');
          setToken('');
        } else {
          setToken(savedToken);
        }
      } catch (err) {
        // If server is not responding in dev, keep token if exists
        setToken(savedToken);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [API_URL]);

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('cafe_admin_token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('cafe_admin_token');
    setToken('');
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#181C19] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cafe-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return token ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onLoginSuccess={handleLoginSuccess} />
  );
};

export default AdminPortal;

