import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (credentials) => {
    const res = await fetch('/api/auth/login', { /* ... */ });
    const json = await res.json();

    if (res.ok) {
      setUser(json.user);
      localStorage.setItem('token', json.token);
      localStorage.setItem('user', JSON.stringify(json.user));
      navigate('/dashboard', { replace: true });
    }
    return json;
  };

  const register = async (data) => { /* similar to login */ };
  const logout = () => { /* clear state */ };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
