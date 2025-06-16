import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create the Theme Context
const ThemeContext = createContext(null);

// Theme Provider Component
export function ThemeProvider({ children }) {
  // State to hold the current theme ('light' or 'dark')
  // Initialize from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('fleetly-theme');
    // Check system preference if no theme is stored
    if (storedTheme) {
      return storedTheme;
    }
    // Check user's system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Effect to apply the theme to the HTML element and update localStorage
  useEffect(() => {
    const htmlElement = document.documentElement; // This targets the <html> tag
    htmlElement.setAttribute('data-theme', theme); // Set data-theme attribute
    localStorage.setItem('fleetly-theme', theme); // Persist theme preference
  }, [theme]); // Re-run effect whenever the theme state changes

  // Function to toggle between 'light' and 'dark' themes
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  // Provide the theme and toggle function to children components
  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to easily consume the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
