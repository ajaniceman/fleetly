import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; // Removed BrowserRouter
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import Hero from './components/Hero/Hero';
import Footer from './components/Footer/Footer';
import Dashboard from './pages/Dashboard';
import VehicleServicesPage from './pages/VehicleServices';

function App() {
  const { user } = useAuth();

  return (
    <> {/* Removed BrowserRouter and its closing tag */}
      <Routes>
        <Route path="/" element={<HomeWithFooter />} />
        <Route path="/login" element={!user ? <AuthPage mode="login"/> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!user ? <AuthPage mode="register"/> : <Navigate to="/dashboard" replace />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={user ? <Dashboard/> : <Navigate to="/login" replace />} />
        {/* New route for Vehicle Services Page */}
        <Route path="/vehicles/:id/services" element={user ? <VehicleServicesPage /> : <Navigate to="/login" replace />} />

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
