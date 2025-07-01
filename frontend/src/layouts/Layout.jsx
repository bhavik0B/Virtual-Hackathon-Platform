import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden w-full">
      {/* Sidebar - Now as overlay */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content area - Always full width */}
      <div className="flex-1 flex flex-col overflow-hidden w-full min-w-0">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-6 bg-slate-900 min-h-0 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;