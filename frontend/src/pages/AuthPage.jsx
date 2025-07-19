import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Mail, Code2, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/Button'; 

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const { success } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.isAdmin) {  // mdr
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Don't render auth page if already authenticated
  if (isAuthenticated && user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">HackCollab</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to start collaborating</p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-4">
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => window.location.href = 'http://localhost:5000/api/users/auth/google'}
            loading={loading}
            disabled={loading}
          >
            <Mail className="h-5 w-5 mr-3" />
            Continue with Google
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-800 text-gray-400">or</span>
          </div>
        </div>

        {/* Registration Link */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-400 mb-3">
            Don't have an account?
          </p>
          <Link to="/register">
            <Button variant="outline" size="lg" className="w-full">
              <UserPlus className="h-5 w-5 mr-3" />
              Create New Account
            </Button>
          </Link>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Click the button above to sign in with your Google account
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className="text-blue-400 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;