import React from 'react';
import { useTheme } from '../../contexts/ThemeContext'; // Adjust path as needed
import './ThemeToggleButton.css'; // Create this CSS file for styling

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {theme === 'light' ? '🌙' : '☀️'} {/* Emoji icons for visual clarity */}
    </button>
  );
}
