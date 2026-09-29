import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('gallerist_token') || null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Verify token on mount
  useEffect(() => {
    const fetchMe = async () => {
      const savedToken = localStorage.getItem('gallerist_token');
      if (!savedToken) {
        // Auto seed customer session if empty for instant browsing convenience
        const savedUser = localStorage.getItem('gallerist_user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {
            localStorage.removeItem('gallerist_user');
          }
        }
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${savedToken}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          localStorage.setItem('gallerist_user', JSON.stringify(data));
        } else {
          // Token invalid
          localStorage.removeItem('gallerist_token');
          localStorage.removeItem('gallerist_user');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('gallerist_token', data.token);
      localStorage.setItem('gallerist_user', JSON.stringify(data.user));
      setAuthModalOpen(false);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async ({ name, email, password, phone }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('gallerist_token', data.token);
      localStorage.setItem('gallerist_user', JSON.stringify(data.user));
      setAuthModalOpen(false);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('gallerist_token');
    localStorage.removeItem('gallerist_user');
  };

  // Instant demo role switch
  const quickLogin = async (role) => {
    if (role === 'admin') {
      return await login('admin@gallerist.in', 'admin123');
    } else {
      return await login('buyer@example.com', 'user123');
    }
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        isAuthenticated,
        authModalOpen,
        authMode,
        setAuthMode,
        openAuth,
        closeAuth,
        login,
        register,
        logout,
        quickLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
