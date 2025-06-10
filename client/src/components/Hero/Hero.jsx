// src/components/Hero.jsx
import React, { useState } from 'react';
import './Hero.css';

export default function Hero() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '' });

  const switchMode = m => {
    document.getElementById('auth-form').classList.add('fade-out');
    setTimeout(() => {
      setMode(m);
      document.getElementById('auth-form').classList.remove('fade-out');
    }, 300);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    const res = await fetch(`/api/auth/${mode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    alert(json.message);
  };

  return (
    <div className="hero">
      <div className="auth-widget">
        <div className="mode-switch">
          <button onClick={() => switchMode('login')} className={mode === 'login' ? 'active' : ''}>Login</button>
          <button onClick={() => switchMode('register')} className={mode === 'register' ? 'active' : ''}>Register</button>
        </div>
        <form id="auth-form" onSubmit={submit}>
          <div className="input-group">
            <input name="email" type="email" required value={form.email} onChange={handleChange}/>
            <label>Email</label>
          </div>
          <div className="input-group">
            <input name="password" type="password" required value={form.password} onChange={handleChange}/>
            <label>Password</label>
          </div>
          {mode === 'register' && (
            <div className="input-group">
              <input name="name" type="text" required onChange={handleChange}/>
              <label>Name</label>
            </div>
          )}
          <button type="submit" className="cta-btn">{mode === 'login' ? 'Log In' : 'Register'}</button>
        </form>
      </div>
    </div>
  );
}
