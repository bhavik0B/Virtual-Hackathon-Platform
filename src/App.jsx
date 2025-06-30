import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import TeamManagement from './pages/TeamManagement';
import EditorWorkspace from './pages/EditorWorkspace';
import ChatVideo from './pages/ChatVideo';
import ProjectSubmission from './pages/ProjectSubmission';
import HackathonSchedule from './pages/HackathonSchedule';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './layouts/Layout';
import './index.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

// Admin Route Component
function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.isAdmin ? children : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
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
              <Route path="/admin" element={
                <AdminRoute>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </AdminRoute>
              } />
            </Routes>
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;