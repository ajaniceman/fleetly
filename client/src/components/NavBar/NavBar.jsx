import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggleButton from '../ThemeToggleButton/ThemeToggleButton';
import './NavBar.css';
import { useTranslation } from 'react-i18next';

export default function NavBar({ currentLanguage, onLanguageChange }) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const { t } = useTranslation();

  // State for scroll-based hiding/showing
  const [showNavbar, setShowNavbar] = useState(true); // Navbar is visible by default
  const [lastScrollY, setLastScrollY] = useState(0);

  // Function to handle scroll event
  const handleScroll = useCallback(() => {
    // Only apply this behavior on smaller screens (e.g., max-width 768px, matching CSS media query)
    if (window.innerWidth <= 768) {
      if (window.scrollY > lastScrollY && window.scrollY > 100) { // Scrolling down & past a threshold
        setShowNavbar(false);
      } else if (window.scrollY < lastScrollY) { // Scrolling up
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    } else {
      setShowNavbar(true); // Always show navbar on larger screens
    }
  }, [lastScrollY]); // lastScrollY is a dependency

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]); // handleScroll is a dependency

  // Determine the CSS class based on showNavbar state
  const navbarClass = `navbar ${showNavbar ? '' : 'navbar-hidden'}`;

  return (
    <nav className={navbarClass}> {/* Apply dynamic class here */}
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
            <option value="bs">{t('language_bosnian')}</option>
            <option value="fr">{t('language_french')}</option>
            <option value="de">{t('language_german')}</option>
            <option value="it">{t('language_italian')}</option>
            {/* Add more languages as needed */}
          </select>

          {/* Theme Toggle Button */}
          {/* We want the Theme Toggle Button to behave consistently with the navbar.
              It will likely need to be inside the NavBar for correct positioning,
              or its own fixed position adjusted by the scroll logic.
              For simplicity, let's assume it's part of the NavBar and hides with it.
          */}
          <ThemeToggleButton />
        </div>
      </div>
    </nav>
  );
}
