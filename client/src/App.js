import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import Hero from './components/Hero/Hero';
import Footer from './components/Footer/Footer';
import Dashboard from './pages/Dashboard'; // Adjusted import path to 'Dashboard'
import VehicleServices from './pages/VehicleServices'; // Adjusted import path to 'VehicleServices'
import VehicleDatesPage from './pages/VehicleDatesPage/VehicleDatesPage'; // Import the new dates page

function App() {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={<HomeWithFooter />} />
        <Route path="/login" element={!user ? <AuthPage mode="login"/> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!user ? <AuthPage mode="register"/> : <Navigate to="/dashboard" replace />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={user ? <Dashboard/> : <Navigate to="/login" replace />} />
        <Route path="/vehicles/:id/services" element={user ? <VehicleServices /> : <Navigate to="/login" replace />} />
        {/* New Route for Vehicle Dates Page */}
        <Route path="/vehicles/:id/dates" element={user ? <VehicleDatesPage /> : <Navigate to="/login" replace />} />

        {/* Fallback route - redirects based on user login status */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
      </Routes>
    </>
  );
}

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
  return <Hero key={location.pathname} mode={mode} />;
}

export default App;
