import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TopNav = ({ onMenuClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 shadow-lg flex-shrink-0 w-full">
      <div className="flex items-center justify-between px-6 py-4 w-full">
        <div className="flex items-center">
          {/* Hamburger menu button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md hover:bg-slate-700 transition-colors text-gray-300 hover:text-white mr-4"
            title="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-slate-700 relative transition-colors">
            <Bell className="h-5 w-5 text-gray-300" />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-white">{user?.firstName}</p>
            </div>
            <button
              onClick={handleProfileClick}
              className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <span className="text-sm font-medium text-white">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;