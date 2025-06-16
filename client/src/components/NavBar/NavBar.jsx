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

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Fleetly
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/dashboard" className="navbar-item">Dashboard</Link>
              <button onClick={logout} className="navbar-item navbar-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-item">Login</Link>
              <Link to="/register" className="navbar-item">Register</Link>
            </>
          )}

          {/* Language Selector */}
          <select value={currentLanguage} onChange={onLanguageChange} className="language-selector">
            <option value="en">English</option>
            <option value="es">Español</option>
            {/* Add more languages as needed */}
          </select>

          {/* Theme Toggle Button */}
          <ThemeToggleButton />
        </div>
      </div>
    </nav>
  );
}
