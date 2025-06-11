import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth'; // Added import
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './Hero.css';

export default function Hero({ mode: initialMode = 'login' }) { // Changed prop name to avoid conflict
  const { login, register } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [mode, setMode] = useState(initialMode); // Added local state for mode

  const switchMode = (m) => {
    document.getElementById('auth-form').classList.add('fade-out');
    setTimeout(() => {
      setMode(m);
      document.getElementById('auth-form').classList.remove('fade-out');
    }, 300);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const result = mode === 'login' 
      ? await login(form) 
      : await register(form);
    
    if (!result.error) {
      // Success handled by useAuth's navigation
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="hero">
      <div className="auth-widget">
        <div className="mode-switch">
          <button 
            onClick={() => switchMode('login')} 
            className={mode === 'login' ? 'active' : ''}
          >
            Login
          </button>
          <button 
            onClick={() => switchMode('register')} 
            className={mode === 'register' ? 'active' : ''}
          >
            Register
          </button>
        </div>
        <form id="auth-form" onSubmit={submit}>
          <div className="input-group">
            <input 
              name="email" 
              type="email" 
              required 
              value={form.email} 
              onChange={handleChange}
            />
            <label>Email</label>
          </div>
          <div className="input-group">
            <input 
              name="password" 
              type="password" 
              required 
              value={form.password} 
              onChange={handleChange}
            />
            <label>Password</label>
          </div>
          {mode === 'register' && (
            <div className="input-group">
              <input 
                name="name" 
                type="text" 
                required 
                onChange={handleChange}
              />
              <label>Name</label>
            </div>
          )}
          <button type="submit" className="cta-btn">
            {mode === 'login' ? 'Log In' : 'Register'}
          </button>
          <Link to="/" className="flex items-center justify-center gap-2 mt-4 text-sm text-blue-500">
           <FaArrowLeft /> Back to Home
         </Link>
        </form>
      </div>
    </div>
  );
}