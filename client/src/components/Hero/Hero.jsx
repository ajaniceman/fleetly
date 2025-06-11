import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
  const { login, register } = useAuth();
  const location = useLocation();
  const mode = location.pathname === '/register' ? 'register' : 'login';

  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [pwdChecks, setPwdChecks] = useState({ minLength: false, hasNumber: false });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const pwd = form.password;
    setPwdChecks({
      minLength: pwd.length >= 8,
      hasNumber: /\d/.test(pwd),
    });
  }, [form.password]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const result = mode === 'login'
      ? await login(form)
      : await register(form);

    if (result.error) {
      setError(result.error);
      if (mode === 'login') setForm(prev => ({ ...prev, password: '' }));
    }
  };

  return (
    <div className="hero">
      <div className="auth-widget">
        <div className="mode-switch">
          <Link to="/login" className={mode === 'login' ? 'active' : ''}>Login</Link>
          <Link to="/register" className={mode === 'register' ? 'active' : ''}>Register</Link>
        </div>

        <form id="auth-form" onSubmit={submit}>
          <div className="input-group">
            <input name="email" type="email" required value={form.email} onChange={handleChange} />
            <label>Email</label>
          </div>

          <div className="input-group password-group">
            <input
              name="password"
              type={showPwd ? 'text' : 'password'}
              required
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="show-btn"
              onClick={() => setShowPwd(v => !v)}
            >
              {showPwd ? <FaEyeSlash /> : <FaEye />}
            </button>
            <label>Password</label>
          </div>

          {mode === 'register' && (
            <ul className="password-checklist">
              <li className={pwdChecks.minLength ? 'valid' : ''}>
                {pwdChecks.minLength ? '✅' : '❌'} At least 8 characters
              </li>
              <li className={pwdChecks.hasNumber ? 'valid' : ''}>
                {pwdChecks.hasNumber ? '✅' : '❌'} Contains a number
              </li>
            </ul>
          )}

          {mode === 'register' && (
            <div className="input-group name-group">
              <input name="name" type="text" required value={form.name} onChange={handleChange} />
              <label>Name</label>
            </div>
          )}

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="cta-btn">
            {mode === 'login' ? 'Log In' : 'Register'}
          </button>

          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>
        </form>
      </div>
    </div>
  );
}
