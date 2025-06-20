import React, { createContext, useState, useContext } from 'react';

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user info (null if not logged in)
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login status

  // Simulate login
  const login = (userData) => {
    // In a real app, you'd verify credentials with a backend here
    setUser(userData);
    setIsAuthenticated(true);
    console.log('User logged in:', userData);
  };

  // Simulate logout
  const logout = () => {
    // In a real app, you might invalidate a token on the backend
    setUser(null);
    setIsAuthenticated(false);
    console.log('User logged out');
  };

  // Value provided to consuming components
  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a custom hook to use the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};