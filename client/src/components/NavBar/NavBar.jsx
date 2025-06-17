import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext'; // Import useTheme hook
import ThemeToggleButton from '../ThemeToggleButton/ThemeToggleButton'; // Import the toggle button
import './NavBar.css'; // Assuming you have a NavBar.css
import { useTranslation } from 'react-i18next'; // Import useTranslation

export default function NavBar({ currentLanguage, onLanguageChange }) { // Receive props
  const { user, logout } = useAuth();
  const { theme } = useTheme(); // Get current theme
  const { t } = useTranslation(); // Initialize translation hook

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Fleetly
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/dashboard" className="navbar-item">{t('dashboard_link')}</Link>
              <button onClick={logout} className="navbar-item navbar-button">{t('logout_button')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-item">{t('login_tab')}</Link>
              <Link to="/register" className="navbar-item">{t('register_tab')}</Link>
            </>
          )}

          {/* Language Selector */}
          <select value={currentLanguage} onChange={onLanguageChange} className="language-selector">
            <option value="en">{t('language_english')}</option>
            <option value="es">{t('language_spanish')}</option>
            <option value="bs">{t('language_bosnian')}</option> {/* New */}
            <option value="fr">{t('language_french')}</option>   {/* New */}
            <option value="de">{t('language_german')}</option>   {/* New */}
            <option value="it">{t('language_italian')}</option>   {/* New */}
            {/* Add more languages as needed */}
          </select>

          {/* Theme Toggle Button */}
          <ThemeToggleButton />
        </div>
      </div>
    </nav>
  );
}
