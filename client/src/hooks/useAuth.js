import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // LOGIN
  const login = async ({ email, password }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();

    if (res.ok) {
      setUser(json.user);
      localStorage.setItem('token', json.token);
      localStorage.setItem('user', JSON.stringify(json.user));
      navigate('/dashboard', { replace: true });
    }

    return json;
  };

  // REGISTER
  const register = async ({ email, password, name }) => {
    // Frontend password validation
    if (password.length < 8 || !/\d/.test(password)) {
      return { error: true, error: 'Password must be 8+ characters and include a number' };
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    const json = await res.json();

    if (res.ok) {
      setUser(json.user);
      localStorage.setItem('token', json.token);
      localStorage.setItem('user', JSON.stringify(json.user));
      navigate('/dashboard', { replace: true });
    }

    return json;
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access auth
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
