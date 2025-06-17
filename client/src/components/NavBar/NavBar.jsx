import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggleButton from '../ThemeToggleButton/ThemeToggleButton';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import FaBars for hamburger, FaTimes for close
import './NavBar.css';
import { useTranslation } from 'react-i18next';

export default function NavBar({ currentLanguage, onLanguageChange }) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const { t } = useTranslation();

  // State for scroll-based hiding/showing
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // State for mobile menu open/close
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to handle scroll event
  const handleScroll = useCallback(() => {
    // Only apply this behavior on smaller screens (e.g., max-width 768px, matching CSS media query)
    if (window.innerWidth <= 768) {
      if (window.scrollY > lastScrollY && window.scrollY > 100) { // Scrolling down & past a threshold
        setShowNavbar(false);
        setIsMobileMenuOpen(false); // Close menu if scrolling down
      } else if (window.scrollY < lastScrollY) { // Scrolling up
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    } else {
      setShowNavbar(true); // Always show navbar on larger screens
      setIsMobileMenuOpen(false); // Ensure menu is closed on larger screens
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
    <nav className={navbarClass}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Fleetly
        </Link>

        {/* Desktop Navigation Links - Always visible on larger screens */}
        <div className="navbar-links-desktop">
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
        </div>

        {/* Mobile Controls: Language, Theme Toggle, and Hamburger Menu */}
        <div className="navbar-controls-mobile">
          <select value={currentLanguage} onChange={onLanguageChange} className="language-selector">
            <option value="en">{t('language_english')}</option>
            <option value="es">{t('language_spanish')}</option>
            <option value="bs">{t('language_bosnian')}</option>
            <option value="fr">{t('language_french')}</option>
            <option value="de">{t('language_german')}</option>
            <option value="it">{t('language_italian')}</option>
          </select>
          <ThemeToggleButton />
          <button className="hamburger-menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu - Conditionally rendered based on state */}
      <div className={`mobile-nav-menu ${isMobileMenuOpen ? 'menu-open' : ''}`}>
        {user ? (
          <>
            <Link to="/dashboard" className="mobile-navbar-item" onClick={() => setIsMobileMenuOpen(false)}>{t('dashboard_link')}</Link>
            <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="mobile-navbar-button">{t('logout_button')}</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mobile-navbar-item" onClick={() => setIsMobileMenuOpen(false)}>{t('login_tab')}</Link>
            <Link to="/register" className="mobile-navbar-item" onClick={() => setIsMobileMenuOpen(false)}>{t('register_tab')}</Link>
          </>
        )}
      </div>
    </nav>
  );
}
