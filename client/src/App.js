import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import Hero from './components/Hero/Hero';
import Footer from './components/Footer/Footer';
import Dashboard from './pages/Dashboard';

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomeWithFooter />} />

          <Route path="/login" element={!user ? <AuthPage mode="login" /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!user ? <AuthPage mode="register" /> : <Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />

          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
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
  return <Hero mode={mode} key={location.pathname} />;
}

export default App;
