import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import TeamManagement from './pages/TeamManagement';
import EditorWorkspace from './pages/EditorWorkspace';
import ChatVideo from './pages/ChatVideo';
import ProjectSubmission from './pages/ProjectSubmission';
import HackathonSchedule from './pages/HackathonSchedule';
import JoinHackathon from './pages/JoinHackathon';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './layouts/Layout';
import './index.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

// Admin Route Component - Standalone without Layout
function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <ToastProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/register" element={<Registration />} />
              
              {/* Standalone Admin Route - No Layout */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              {/* Regular User Routes with Layout */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/teams" element={
                <ProtectedRoute>
                  <Layout>
                    <TeamManagement />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/editor" element={
                <ProtectedRoute>
                  <Layout>
                    <EditorWorkspace />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/chat-video" element={
                <ProtectedRoute>
                  <Layout>
                    <ChatVideo />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/submissions" element={
                <ProtectedRoute>
                  <Layout>
                    <ProjectSubmission />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/schedule" element={
                <ProtectedRoute>
                  <Layout>
                    <HackathonSchedule />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/join-hackathon" element={
                <ProtectedRoute>
                  <JoinHackathon />
                </ProtectedRoute>
              } />
              <Route path="/leaderboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Leaderboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;