import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to initialize auth state from localStorage
  const initializeAuth = useCallback(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
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
        localStorage.setItem('user', JSON.stringify(data.user));
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
        navigate('/login');
        alert(data.message);
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
    navigate('/login'); // Redirect to login page on logout
  };

  /**
   * Helper function to perform authenticated fetch requests.
   * Automatically adds Authorization header and handles 401 (Unauthorized) by logging out.
   * @param {string} url - The API endpoint URL.
   * @param {object} options - Fetch options (method, headers, body, etc.).
   * @returns {Promise<Response>} - The fetch response.
   */
  const fetchWithAuth = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      console.warn("Unauthorized response (401) received. Logging out user.");
      const errorData = await response.json(); // Attempt to parse error message
      alert(errorData.message || "Your session has expired. Please log in again.");
      logout(); // Automatically log out the user
      throw new Error("Session expired, user logged out."); // Throw an error to stop further processing
    }

    return response;
  }, [logout]);

  // Context value
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    fetchWithAuth, // Provide the new helper function
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div style={{ textAlign: 'center', padding: '50px' }}>Loading authentication...</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
