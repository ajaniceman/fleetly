import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import Hero from './components/Hero/Hero';
import Footer from './components/Footer/Footer';
import Dashboard from './pages/Dashboard'; // Ensure correct path if it's Dashboard/index.js
import VehicleServicesPage from './components/ServiceForm/ServiceForm'; // Import the new services page

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter> {/* Added BrowserRouter here as it's the top-level router */}
      <Routes>
        <Route path="/" element={<HomeWithFooter />} /> {/* Use the helper component */}
        <Route path="/login" element={!user ? <AuthPage mode="login"/> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!user ? <AuthPage mode="register"/> : <Navigate to="/dashboard" replace />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={user ? <Dashboard/> : <Navigate to="/login" replace />} />
        {/* New route for Vehicle Services Page */}
        <Route path="/vehicles/:id/services" element={user ? <VehicleServicesPage /> : <Navigate to="/login" replace />} />

        {/* Fallback route - redirects based on user login status */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
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
