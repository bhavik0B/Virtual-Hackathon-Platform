import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import api from '../utils/axiosConfig';

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

  // Check for access and refresh tokens in URL params (from Google OAuth redirect)
  useEffect(() => {
    const checkAuthFromURL = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('accessToken');
      const refreshToken = urlParams.get('refreshToken');
      const registrationToken = urlParams.get('token');
      
      console.log('AuthContext: Checking for tokens in URL:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken,
        hasRegistrationToken: !!registrationToken 
      });
      console.log('AuthContext: Current pathname:', window.location.pathname);
      
      if (accessToken && refreshToken) {
        try {
          console.log('AuthContext: Access and refresh tokens detected, verifying...');
          
          // Store refresh token in localStorage
          localStorage.setItem('refreshToken', refreshToken);
          
          // Verify access token with backend
          const response = await api.get('/users/verify');
          
          console.log('AuthContext: Token verification response:', response.status, response.data);
          
          if (response.status === 200) {
            console.log('AuthContext: User verified successfully:', response.data.user);
            
            // Set user data first
            setUser(response.data.user);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('accessToken', accessToken);
            
            // Remove tokens from URL
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
        } catch (error) {
          console.error('AuthContext: Token verification failed:', error);
          console.error('AuthContext: Error response:', error.response?.data);
          console.error('AuthContext: Error status:', error.response?.status);
          console.error('AuthContext: Error message:', error.message);
          
          // Remove invalid tokens from URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } else if (registrationToken) {
        try {
          console.log('AuthContext: Registration token detected, processing...');
          
          // First, decode the token to check if it's a registration token
          const tokenParts = registrationToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('AuthContext: Registration token payload:', payload);
            
            if (payload.googleId && payload.type === 'registration') {
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
            } else {
              console.error('AuthContext: Invalid registration token payload');
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          } else {
            console.error('AuthContext: Invalid registration token format');
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (error) {
          console.error('AuthContext: Registration token processing failed:', error);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } else {
    // Check for stored authentication
    const storedUser = localStorage.getItem('user');
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        
        console.log('AuthContext: Checking stored authentication:', { 
          hasUser: !!storedUser, 
          hasAccessToken: !!storedAccessToken,
          hasRefreshToken: !!storedRefreshToken 
        });
        
        if (storedUser && storedAccessToken) {
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

  const login = useCallback((userData, accessToken, refreshToken) => {
    console.log('AuthContext: Logging in user:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    
    // Note: Redirects are now handled by the components that call login
    // or by the token verification flow
  }, []);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.log('AuthContext: No refresh token found');
      return null;
    }

    try {
      console.log('AuthContext: Refreshing access token...');
      const response = await api.post('/users/refresh', {
        refreshToken
      });

      if (response.status === 200) {
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        console.log('AuthContext: Access token refreshed successfully');
        return newAccessToken;
      }
    } catch (error) {
      console.error('AuthContext: Token refresh failed:', error);
      // If refresh fails, logout the user
      logout();
      return null;
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    refreshAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};