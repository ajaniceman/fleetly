import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Hero from './components/Hero/Hero';
import Home from './pages/Home'; 
import Footer from './components/Footer/Footer';
import { useAuth } from './hooks/useAuth';
import './App.css';
import './styles/global.css';

function App() {
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
          {/* Public Routes */}
          <Route path="/" element={<HomeWithFooter />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<AuthRoute element={<Hero mode="login" />} />} />
          <Route path="/register" element={<AuthRoute element={<Hero mode="register" />} />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <div>Your Dashboard</div>
              </ProtectedRoute>
            } 
          />
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

function AuthRoute({ element }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : element;
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}


export default App;