import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Users, 
  FolderOpen, 
  Send, 
  Calendar, 
  Settings,
  LogOut,
  X,
  Shield,
  Code2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Teams', path: '/teams', icon: Users },
    { name: 'Editor', path: '/editor', icon: FolderOpen },
    { name: 'Submissions', path: '/submissions', icon: Send },
    { name: 'Schedule', path: '/schedule', icon: Calendar },
  ];

  if (user?.isAdmin) {
    navigationItems.push({ name: 'Admin', path: '/admin', icon: Shield });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  return (
    <>
      {/* Overlay - Always show when sidebar is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Always positioned as overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-700 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Code2 className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">HackCollab</h1>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 shadow-lg border border-blue-500/30'
                          : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                      }`}
                    >
                      <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-400' : 'group-hover:text-blue-400'} transition-colors`} />
                      {item.name}
                      {isActive && (
                        <motion.div
                          className="ml-auto w-2 h-2 bg-blue-400 rounded-full"
                          layoutId="activeIndicator"
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* User Info */}
              <div className="p-4 border-t border-slate-700 bg-slate-800/50 flex-shrink-0">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-slate-700/50 hover:text-white transition-all duration-200 group"
                >
                  <LogOut className="h-5 w-5 mr-3 group-hover:text-red-400 transition-colors" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;