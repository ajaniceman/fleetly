import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state for initial auth check
  const navigate = useNavigate();

  // Function to initialize auth state from localStorage
  const initializeAuth = useCallback(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user'); // Get user data string

      if (storedToken && storedUser) {
        // Line 13 would likely be here or around here, parsing 'storedUser'
        const parsedUser = JSON.parse(storedUser); // This is the line that might cause "undefined is not valid JSON"
        setUser(parsedUser);
      } else {
        setUser(null); // No user or token found
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      localStorage.removeItem('token'); // Clear potentially corrupted data
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false); // Auth check complete
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Login function
  const login = async (formData) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); // Store user object as string
        setUser(data.user);
        navigate('/dashboard');
        return { success: true };
      } else {
        return { error: data.message || 'Login failed.' };
      }
    } catch (error) {
      console.error("Login API error:", error);
      return { error: 'An unexpected error occurred during login.' };
    }
  };

  // Register function
  const register = async (formData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        // For registration, we don't immediately log them in or set token/user
        // They need to verify email first
        navigate('/login'); // Redirect to login with a message
        alert(data.message); // Show the success message (e.g., "Please check your email...")
        return { success: true, message: data.message };
      } else {
        return { error: data.message || 'Registration failed.' };
      }
    } catch (error) {
      console.error("Register API error:", error);
      return { error: 'An unexpected error occurred during registration.' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/'); // Redirect to home page or login page
  };

  // Context value
  const value = {
    user,
    loading, // Provide loading state
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Optionally render a loading spinner while auth state is being determined */}
      {loading ? <div style={{ textAlign: 'center', padding: '50px' }}>Loading authentication...</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
