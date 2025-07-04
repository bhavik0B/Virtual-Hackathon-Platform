import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Mail, Code2, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/Button';

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success } = useToast();

  const handleGoogleLogin = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'JD',
        isAdmin: false,
        isMentor: false
      };
      login(userData);
      success('Welcome to HackCollab!');
      navigate('/dashboard');
      setLoading(false);
    }, 1500);
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: 'JS',
        isAdmin: true, // Make this user admin for demo
        isMentor: true
      };
      login(userData);
      success('Welcome to HackCollab!');
      navigate('/admin');
      setLoading(false);
    }, 1500);
  };

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
            onClick={handleGoogleLogin}
            loading={loading}
            disabled={loading}
          >
            <Mail className="h-5 w-5 mr-3" />
            Continue with Google
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={handleGithubLogin}
            loading={loading}
            disabled={loading}
          >
            <Github className="h-5 w-5 mr-3" />
            Continue with GitHub
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
            Click any button above to sign in with demo credentials
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Google: Regular user • GitHub: Admin user • Mentor: Mentor access
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