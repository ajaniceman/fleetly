import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async ({ email, password }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();

    if (res.ok) {
      setUser(json.user);
      localStorage.setItem('token', json.token);
      navigate('/dashboard');
    }
    return json;
  };

  const register = async ({ email, password, name }) => {
    if (password.length < 8 || !/\d/.test(password)) {
      return { error: true, error: 'Password must be 8+ characters and include a number' };
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    const json = await res.json();

    if (res.ok) {
      setUser(json.user);
      localStorage.setItem('token', json.token);
      navigate('/login');
    }
    return json;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return { user, login, register, logout };
}
