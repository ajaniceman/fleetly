import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (credentials) => {
    // Your existing login logic from Hero.jsx
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const json = await res.json();
    if (res.ok) {
      setUser(json.user);
      localStorage.setItem('token', json.token);
      navigate('/');
    }
    return json;
  };

  const register = async (userData) => {
    // Similar to login
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return { user, login, register, logout };
}