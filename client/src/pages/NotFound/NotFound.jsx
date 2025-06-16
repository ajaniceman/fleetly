import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext'; // Assuming you might want to use theme colors here
import './NotFound.css'; // You can create this CSS file for styling

export default function NotFound() {
  const { theme } = useTheme(); // Use the theme context to potentially style based on theme

  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="not-found-link">Go to Dashboard</Link>
      <Link to="/" className="not-found-link secondary">Go to Home</Link>
    </div>
  );
}
