import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Hero from './components/Hero/Hero';
import Footer from './components/Footer/Footer';
import { useAuth } from './hooks/useAuth';
import './App.css';
import './styles/global.css';

function App() {
  const { user } = useAuth();
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => setHealth({ error: err.message }));
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {/* Public Home */}
          <Route path="/" element={<HomeWithFooter />} />

          {/* Auth Pages */}
          <Route
            path="/login"
            element={!user ? <AuthPage mode="login" /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/register"
            element={!user ? <AuthPage mode="register" /> : <Navigate to="/dashboard" replace />}
          />

          {/* Dashboard (Protected) */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" replace />}
          />

          {/* Catch-all redirect back to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function HomeWithFooter() {
  return (
    <>
      <Home />
      <Footer />
    </>
  );
}

function AuthPage({ mode }) {
  const location = useLocation();
  return (
    <Hero mode={mode} key={location.pathname} />
  );
}

export default App;
