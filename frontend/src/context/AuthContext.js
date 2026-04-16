import React, { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        
        const data = await api.get('/users/me');
        setUser(data.user || data);
      } catch (err) {
        console.error('Failed to authenticate:', err);
        logout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    initAuth();

    const handleLogoutEvent = () => logout();
    window.addEventListener('auth:logout', handleLogoutEvent);
    return () => window.removeEventListener('auth:logout', handleLogoutEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      // Fetch user profile immediately after login
      const userData = await api.get('/users/me');
      setUser(userData.user || userData);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading application...</p>
        </div>
      </div>
    ); 
  }

  // Update theme based on role
  const getThemeClass = () => {
    if (!user) return 'theme-default';
    switch (user.role) {
      case 'admin': return 'theme-admin';
      case 'manager': return 'theme-manager';
      case 'user': return 'theme-user';
      default: return 'theme-default';
    }
  };

  return (
    <div className={getThemeClass()} style={{ minHeight: '100vh' }}>
      <AuthContext.Provider value={{ user, setUser, login, logout }}>
        {children}
      </AuthContext.Provider>
    </div>
  );
};
