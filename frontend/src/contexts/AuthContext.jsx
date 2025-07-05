import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for JWT token in URL params (from Google OAuth redirect)
  useEffect(() => {
    const checkAuthFromURL = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      console.log('AuthContext: Checking for token in URL:', !!token);
      console.log('AuthContext: Current pathname:', window.location.pathname);
      
      if (token) {
        try {
          console.log('AuthContext: Attempting to verify token...');
          
          // First, decode the token to check if it's a registration token
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('AuthContext: Token payload:', payload);
            
            if (payload.googleId && !payload.id) {
              // This is a registration token - user doesn't exist yet
              console.log('AuthContext: Registration token detected - new user');
              const userData = {
                googleId: payload.googleId,
                email: payload.email,
                name: payload.name
              };
              
              // Store registration data in localStorage for the registration form
              localStorage.setItem('registrationData', JSON.stringify(userData));
              
              // Remove token from URL
              window.history.replaceState({}, document.title, window.location.pathname);
              
              // Redirect to registration page if not already there
              if (window.location.pathname !== '/register') {
                console.log('AuthContext: Redirecting to registration page');
                window.location.href = '/register';
              }
            } else if (payload.id) {
              // This is an existing user token - verify with backend
              console.log('AuthContext: Existing user token detected, verifying...');
              const response = await axios.get('http://localhost:5000/api/users/verify', {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              console.log('AuthContext: Token verification response:', response.status, response.data);
              
              if (response.status === 200) {
                console.log('AuthContext: User verified successfully:', response.data.user);
                
                // Set user data first
                setUser(response.data.user);
                setIsAuthenticated(true);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Remove token from URL
                window.history.replaceState({}, document.title, window.location.pathname);
                
                // Use setTimeout to ensure state updates are processed before redirect
                setTimeout(() => {
                  // Redirect to appropriate dashboard based on user role
                  if (response.data.user.isAdmin) {
                    console.log('AuthContext: Redirecting admin user to /admin');
                    window.location.href = '/admin';
                  } else {
                    console.log('AuthContext: Redirecting regular user to /dashboard');
                    window.location.href = '/dashboard';
                  }
                }, 100);
              }
            } else {
              console.error('AuthContext: Invalid token payload - no googleId or id');
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          } else {
            console.error('AuthContext: Invalid token format');
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (error) {
          console.error('AuthContext: Token verification failed:', error);
          console.error('AuthContext: Error response:', error.response?.data);
          console.error('AuthContext: Error status:', error.response?.status);
          console.error('AuthContext: Error message:', error.message);
          
          // Remove invalid token from URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } else {
        // Check for stored authentication
        const storedUser = localStorage.getItem('user');
        console.log('AuthContext: Checking stored user:', !!storedUser);
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('AuthContext: Found stored user:', userData);
          setUser(userData);
          setIsAuthenticated(true);
        }
      }
      setLoading(false);
    };

    checkAuthFromURL();
  }, []);

  const login = useCallback((userData) => {
    console.log('AuthContext: Logging in user:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Note: Redirects are now handled by the components that call login
    // or by the token verification flow
  }, []);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};