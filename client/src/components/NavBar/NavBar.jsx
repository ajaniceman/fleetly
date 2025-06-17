import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggleButton from '../ThemeToggleButton/ThemeToggleButton';
import { FaBars, FaTimes, FaCaretDown, FaCaretUp } from 'react-icons/fa'; // Import FaCaretDown/Up for dropdown
import './NavBar.css';
import { useTranslation } from 'react-i18next';

export default function NavBar({ currentLanguage, onLanguageChange }) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  // State for scroll-based hiding/showing
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // State for mobile menu open/close (hamburger menu)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for desktop dropdown menu open/close
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  // Function to handle scroll event
  const handleScroll = useCallback(() => {
    // Only apply this behavior on smaller screens (e.g., max-width 768px, matching CSS media query)
    if (window.innerWidth <= 768) {
      if (window.scrollY > lastScrollY && window.scrollY > 100) { // Scrolling down & past a threshold
        setShowNavbar(false);
        setIsMobileMenuOpen(false); // Close mobile menu if scrolling down
      } else if (window.scrollY < lastScrollY) { // Scrolling up
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    } else {
      setShowNavbar(true); // Always show navbar on larger screens
      setIsMobileMenuOpen(false); // Ensure mobile menu is closed on larger screens
      // No need to control desktop menu visibility here, it's click-triggered
    }
  }, [lastScrollY]); // lastScrollY is a dependency

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]); // handleScroll is a dependency

  // Close desktop dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDesktopMenuOpen && !event.target.closest('.desktop-dropdown-container')) {
        setIsDesktopMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDesktopMenuOpen]);


  const toggleDesktopMenu = () => {
    setIsDesktopMenuOpen(prev => !prev);
  };

  // Determine the CSS class based on showNavbar state
  const navbarClass = `navbar ${showNavbar ? '' : 'navbar-hidden'}`;

  return (
    <nav className={navbarClass}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Fleetly
        </Link>

        {/* Right side navigation elements */}
        <div className="main-nav-right-side">
          {/* Language Selector (visible on both mobile and desktop, styled via CSS) */}
          <select value={currentLanguage} onChange={onLanguageChange} className="language-selector">
            <option value="en">{t('language_english')}</option>
            <option value="es">{t('language_spanish')}</option>
            <option value="bs">{t('language_bosnian')}</option>
            <option value="fr">{t('language_french')}</option>
            <option value="de">{t('language_german')}</option>
            <option value="it">{t('language_italian')}</option>
            <option value="pl">{t('language_polish')}</option>
          </select>

          {/* Theme Toggle Button (visible on both mobile and desktop, styled via CSS) */}
          <ThemeToggleButton />

          {/* Desktop Dropdown (visible only on desktop) */}
          <div className="desktop-dropdown-container">
            <button onClick={toggleDesktopMenu} className="desktop-dropdown-toggle">
              {user ? user.name : t('account_menu')}
              {isDesktopMenuOpen ? <FaCaretUp className="dropdown-caret" /> : <FaCaretDown className="dropdown-caret" />}
            </button>
            {isDesktopMenuOpen && (
              <div className="desktop-dropdown-menu">
                {user ? (
                  <>
                    <Link to="/dashboard" className="desktop-dropdown-item" onClick={() => setIsDesktopMenuOpen(false)}>{t('dashboard_link')}</Link>
                    <button onClick={() => { logout(); setIsDesktopMenuOpen(false); }} className="desktop-dropdown-button">{t('logout_button')}</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="desktop-dropdown-item" onClick={() => setIsDesktopMenuOpen(false)}>{t('login_tab')}</Link>
                    <Link to="/register" className="desktop-dropdown-item" onClick={() => setIsDesktopMenuOpen(false)}>{t('register_tab')}</Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Icon (visible only on mobile) */}
          <button className="hamburger-menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu (slides in/out from hamburger icon) */}
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
