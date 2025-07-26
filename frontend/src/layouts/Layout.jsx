import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import Modal from '../components/Modal';
import { Trophy, Star, ExternalLink, Github } from 'lucide-react';

const hackathonProjects = [
  {
    hackathonName: 'AI Innovation Challenge',
    projects: [
      {
        id: 1,
        title: 'AI-Powered Task Manager',
        description: 'A smart task management application that uses machine learning to prioritize tasks and predict completion times.',
        team: 'Code Warriors',
        submittedAt: '2024-01-10T15:30:00Z',
        githubUrl: 'https://github.com/team/ai-task-manager',
        demoUrl: 'https://ai-task-manager.demo.com',
        status: 'Submitted',
        score: 85
      },
      {
        id: 2,
        title: 'Smart Healthcare Assistant',
        description: 'AI-powered healthcare chatbot that provides medical advice and appointment scheduling.',
        team: 'Health Tech Innovators',
        submittedAt: '2024-01-12T10:20:00Z',
        githubUrl: 'https://github.com/team/health-assistant',
        demoUrl: 'https://health-assistant.demo.com',
        status: 'Judged',
        score: 92
      }
    ]
  },
  {
    hackathonName: 'Green Tech Hackathon',
    projects: [
      {
        id: 3,
        title: 'Carbon Footprint Tracker',
        description: 'Mobile app that tracks daily carbon emissions and suggests eco-friendly alternatives.',
        team: 'Green Innovators',
        submittedAt: '2024-01-05T14:45:00Z',
        githubUrl: 'https://github.com/team/carbon-tracker',
        demoUrl: 'https://carbon-tracker.demo.com',
        status: 'Winner',
        score: 96
      }
    ]
  },
  {
    hackathonName: 'Fintech Solutions',
    projects: [
      {
        id: 4,
        title: 'Crypto Portfolio Manager',
        description: 'Advanced cryptocurrency portfolio tracking with AI-powered investment insights.',
        team: 'Crypto Wizards',
        submittedAt: '2024-01-08T16:30:00Z',
        githubUrl: 'https://github.com/team/crypto-portfolio',
        demoUrl: 'https://crypto-portfolio.demo.com',
        status: 'Submitted',
        score: 78
      },
      {
        id: 5,
        title: 'Micro-Investment Platform',
        description: 'Platform that allows users to invest spare change from daily transactions.',
        team: 'FinTech Pioneers',
        submittedAt: '2024-01-09T11:15:00Z',
        githubUrl: 'https://github.com/team/micro-invest',
        demoUrl: 'https://micro-invest.demo.com',
        status: 'Judged',
        score: 89
      }
    ]
  }
];

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getStatusColor(status) {
  switch (status) {
    case 'Winner':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'Judged':
      return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'Submitted':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    default:
      return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
}

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProjectsModal, setShowProjectsModal] = useState(false);

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden w-full">
      {/* Sidebar - Now as overlay */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content area - Always full width */}
      <div className="flex-1 flex flex-col overflow-hidden w-full min-w-0">
        <TopNav onMenuClick={() => setSidebarOpen(true)} onProjectsClick={() => setShowProjectsModal(true)} />
        <main className="flex-1 overflow-auto p-6 bg-slate-900 min-h-0 w-full">
          {children}
        </main>
        <Modal
          isOpen={showProjectsModal}
          onClose={() => setShowProjectsModal(false)}
          title="All Hackathon Projects"
          size="4xl"
        >
          <div className="space-y-6">
            {hackathonProjects.map((hackathon, hackathonIndex) => (
              <div key={hackathonIndex} className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-600">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-white">{hackathon.hackathonName}</h3>
                  <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                    {hackathon.projects.length} project{hackathon.projects.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {hackathon.projects.map((project) => (
                    <div key={project.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white mb-1">{project.title}</h4>
                          <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          {project.score && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs text-gray-300">{project.score}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <span>Team: {project.team}</span>
                        <span>{formatDate(project.submittedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-400 hover:text-white transition-colors"
                        >
                          <Github className="h-3 w-3 mr-1" />
                          <span className="text-xs">Code</span>
                        </a>
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-400 hover:text-white transition-colors"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            <span className="text-xs">Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Layout;