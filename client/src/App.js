import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home'; // Ensure path is correct, e.g., './pages/Home/Home' if it's a folder
import Hero from './components/Hero/Hero'; // Your Auth/Login/Register component
import Footer from './components/Footer/Footer';
import Dashboard from './pages/Dashboard'; // Ensure path is correct
import VehicleServices from './pages/VehicleServices/VehicleServices';
import VehicleDatesPage from './pages/VehicleDatesPage/VehicleDatesPage';
import VerifyEmailPage from './pages/VerifyEmailPage/VerifyEmailPage'; // Import the new verification page
import NotFound from './pages/NotFound/NotFound'; // Import the NotFound component

import { ThemeProvider } from './contexts/ThemeContext';

// Helper component for Home and Footer
function HomeWithFooter() {
  return (
    <>
      <Home />
      <Footer />
    </>
  );
}

// Helper component for Auth Pages
function AuthPage({ mode }) {
  const location = useLocation();
  // Using key prop to force remount when path changes between /login and /register
  return <Hero key={location.pathname} mode={mode} />;
}

function App() {
  const { user } = useAuth();

  return (
    // Wrap the entire application with ThemeProvider to make theme context available globally
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<HomeWithFooter />} />
        <Route path="/login" element={!user ? <AuthPage mode="login"/> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!user ? <AuthPage mode="register"/> : <Navigate to="/dashboard" replace />} />

        {/* New route for email verification */}
        <Route path="/verify" element={<VerifyEmailPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={user ? <Dashboard/> : <Navigate to="/login" replace />} />
        <Route path="/vehicles/:id/services" element={user ? <VehicleServices /> : <Navigate to="/login" replace />} />
        <Route path="/vehicles/:id/dates" element={user ? <VehicleDatesPage /> : <Navigate to="/login" replace />} />

        {/* Fallback route - now renders the NotFound component */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
