import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Hero from './components/Hero/Hero';
import Home from './pages/Home'; 
import Dashboard from './pages/Dashboard';
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
          <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/login" replace />} 
        />
          <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/dashboard" replace />} 
        />
          <Route 
          path="/register" 
          element={!user ? <Register /> : <Navigate to="/dashboard" replace />} 
        />
          
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

function AuthPage({ mode }) {
  const location = useLocation();
  const { user } = useAuth();

  // If user is logged in, redirect to home
  if (user) return <Navigate to="/" replace />;

  return (
    <Hero 
      mode={mode} 
      key={location.pathname} // Force re-render when route changes
    />
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