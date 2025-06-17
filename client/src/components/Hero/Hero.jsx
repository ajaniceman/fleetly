import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import './Hero.css';
import { useTranslation } from 'react-i18next'; // Import useTranslation

export default function Hero() {
  const { login, register } = useAuth();
  const location = useLocation();
  const mode = location.pathname === '/register' ? 'register' : 'login';
  const { t } = useTranslation(); // Initialize the translation hook

  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [pwdChecks, setPwdChecks] = useState({ minLength: false, hasNumber: false });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Reset form and error when switching mode
    setForm({ email: '', password: '', name: '' });
    setError('');
  }, [mode]);

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
    setError(''); // Clear previous errors

    let result;
    if (mode === 'login') {
      result = await login(form);
    } else {
      // Basic frontend validation for register mode
      if (!pwdChecks.minLength || !pwdChecks.hasNumber) {
        setError(t('password_validation_error')); // Translate validation error
        return;
      }
      result = await register(form);
    }

    if (result.error) {
      setError(result.error);
      if (mode === 'login') setForm(prev => ({ ...prev, password: '' })); // Clear password on login error
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card animate-scale-in">
        <Link to="/" className="back-home-link">
          <FaArrowLeft className="back-arrow-icon" /> {t('back_to_home')} {/* Translated */}
        </Link>

        <div className="card-header">
          <h2>{mode === 'login' ? t('welcome_back_title') : t('join_fleetly_title')}</h2> {/* Translated */}
          <p className="card-subtitle">
            {mode === 'login' ? t('sign_in_subtitle') : t('manage_fleet_subtitle')} {/* Translated */}
          </p>
        </div>

        <div className="mode-switch-tabs">
          <Link to="/login" className={`tab-item ${mode === 'login' ? 'active' : ''}`}>
            {t('login_tab')} {/* Translated */}
          </Link>
          <Link to="/register" className={`tab-item ${mode === 'register' ? 'active' : ''}`}>
            {t('register_tab')} {/* Translated */}
          </Link>
        </div>

        <form id="auth-form" onSubmit={submit} className="auth-form-content">
          {error && <div className="form-error-message">{error}</div>}

          <div className="input-group">
            <label htmlFor="email">{t('email_label')}</label> {/* Translated */}
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@example.com"
              required
              value={form.email}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="input-group password-group">
            <label htmlFor="password">{t('password_label')}</label> {/* Translated */}
            <input
              id="password"
              name="password"
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              required
              value={form.password}
              onChange={handleChange}
              className="input-field"
            />
            <button
              type="button"
              className="show-pwd-btn"
              onClick={() => setShowPwd(v => !v)}
              tabIndex={-1}
            >
              {showPwd ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {mode === 'register' && (
            <ul className="password-checklist">
              <li className={pwdChecks.minLength ? 'valid' : ''}>
                <span className="check-icon">{pwdChecks.minLength ? '✅' : '❌'}</span> {t('password_min_length')} {/* Translated */}
              </li>
              <li className={pwdChecks.hasNumber ? 'valid' : ''}>
                <span className="check-icon">{pwdChecks.hasNumber ? '✅' : '❌'}</span> {t('password_has_number')} {/* Translated */}
              </li>
            </ul>
          )}

          {mode === 'register' && (
            <div className="input-group">
              <label htmlFor="name">{t('name_label')}</label> {/* Translated */}
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your Full Name"
                required
                value={form.name}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          )}

          <button type="submit" className="submit-btn primary-cta">
            {mode === 'login' ? t('login_button_text') : t('register_button_text')} {/* Translated */}
          </button>
        </form>
      </div>
    </div>
  );
}
