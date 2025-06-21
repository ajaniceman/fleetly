import React from 'react';
// Removed BrowserRouter from this import, as it should be in index.js
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
import NavBar from './components/NavBar/NavBar'; // Import NavBar here to be used globally
import { ThemeProvider } from './contexts/ThemeContext'; // Corrected path to 'context'
// NEW: Import useTranslation for language switching
import { useTranslation } from 'react-i18next';
import Blog from './pages/Blog/Blog'; // NEW: Import the Blog page
import FullFeaturesPage from './pages/FullFeaturesPage/FullFeaturesPage'; // NEW: Import the FullFeaturesPage
import Contact from './pages/Contact/Contact'; // NEW: Import the Contact page
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicyPage';

// Helper component for Auth Pages (remains unchanged)
function AuthPage({ mode }) {
  const location = useLocation();
  // Using key prop to force remount when path changes between /login and /register
  return <Hero key={location.pathname} mode={mode} />;
}

function App() {
  const { user } = useAuth();
  const { i18n } = useTranslation(); // Get i18n instance for language control

  // Function to handle language change from the NavBar
  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    // Removed <Router> wrapper - it should be in index.js
    <ThemeProvider> {/* ThemeProvider wraps the content to provide context */}
      {/* The NavBar is rendered here, outside of Routes, so it appears on all pages */}
      {/* Pass the current language and the change handler to NavBar */}
      <NavBar currentLanguage={i18n.language} onLanguageChange={handleLanguageChange} />

      <Routes>
        <Route path="/" element={<> <Home /> <Footer /> </>} /> {/* Render Home and Footer directly for simplicity */}
        <Route path="/login" element={!user ? <AuthPage mode="login"/> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!user ? <AuthPage mode="register"/> : <Navigate to="/dashboard" replace />} />

        {/* New route for email verification */}
        <Route path="/verify" element={<VerifyEmailPage />} />

        {/* NEW: Blog Routes */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Blog />} /> {/* For individual blog posts, though we only have a list for now */}

        {/* Features Page Route */}
        <Route path="/features" element={<FullFeaturesPage />} />

        {/* NEW: Contact Page Route */}
        <Route path="/contact" element={<Contact />} />

        {/* Privacy & Policy Page Route */}
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={user ? <Dashboard/> : <Navigate to="/login" replace />} />
        <Route path="/vehicles/:vehicleId/services" element={user ? <VehicleServices /> : <Navigate to="/login" replace />} /> {/* Changed :id to :vehicleId for consistency with backend */}
        <Route path="/vehicles/:vehicleId/dates" element={user ? <VehicleDatesPage /> : <Navigate to="/login" replace />} /> {/* Changed :id to :vehicleId for consistency with backend */}

        {/* Fallback route - now renders the NotFound component */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
