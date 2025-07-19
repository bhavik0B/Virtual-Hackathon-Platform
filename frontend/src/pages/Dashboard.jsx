import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Code2, 
  Calendar, 
  Trophy, 
  Clock, 
  TrendingUp,
  ArrowRight,
  Plus,
  Activity,
  Zap,
  Star,
  ExternalLink,
  Github,
  Award,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axiosConfig';

const Dashboard = () => {
  const { user } = useAuth();
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [hackathons, setHackathons] = useState([]);
  const [loadingHackathons, setLoadingHackathons] = useState(true);

  useEffect(() => {
    async function fetchHackathons() {
      setLoadingHackathons(true);
      try {
        const res = await api.get('/hackathons');
        setHackathons(res.data.hackathons || []);
      } catch (e) {
        // Optionally show error
      } finally {
        setLoadingHackathons(false);
      }
    }
    fetchHackathons();
  }, []);


  const stats = [
    { label: 'Projects', value: '8', icon: Code2, color: 'from-green-500 to-emerald-500' }
  ];

  const recentActivity = [
    { action: 'Joined team "Code Warriors"', time: '2 hours ago', type: 'team', icon: Users },
    { action: 'Submitted project "Smart City"', time: '1 day ago', type: 'submission', icon: Trophy },
    { action: 'Completed code review', time: '2 days ago', type: 'code', icon: Code2 },
    { action: 'Won 3rd place in AI Challenge', time: '1 week ago', type: 'achievement', icon: Star }
  ];

  // Hackathon projects data
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
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
  };

  const handleProjectsClick = () => {
    setShowProjectsModal(true);
  };

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl text-white p-8 shadow-2xl w-full"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Ready to build something amazing today?
            </p>
          </div>
          <div className="hidden md:block">
            <Link to="/teams">
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 border-white/30 text-white">
                Create Team
                <Plus className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - Only 2 cards */}
      <div className="grid grid-cols-1 gap-6 w-full">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isProjectsCard = stat.label === 'Projects';
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-full"
            >
              <Card 
                className={`p-6 hover:shadow-xl transition-all duration-300 group w-full ${
                  isProjectsCard ? 'cursor-pointer hover:border-blue-500/50' : ''
                }`} 
                hover={isProjectsCard}
                onClick={isProjectsCard ? handleProjectsClick : undefined}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    {isProjectsCard && (
                      <p className="text-xs text-blue-400 mt-1">Click to view details</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          {/* Upcoming Events*/}
          <Card className="p-6 w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Upcoming Events</h2>
              <Link className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center group">
                View All
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="space-y-4">
              {hackathons
                .filter(h => h.status === 'upcoming' || h.status === 'active')
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                .map((hackathon) => (
                  <div key={hackathon._id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                    <div className="flex-1">
                      <Link to="/schedule" className="font-medium text-white text-base hover:text-blue-300 transition-colors">
                        {hackathon.name}
                      </Link>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <Users className="h-4 w-4 mr-1" />
                        {/* Optionally show participants count if available */}
                        {hackathon.participants ? hackathon.participants.length : 0} participants
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded border ${
                      hackathon.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                      hackathon.status === 'upcoming' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                      'bg-gray-500/20 text-gray-300 border-gray-500/30'
                    }`}>
                      {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
                    </span>
                  </div>
                ))}
            </div>
          </Card>
          
          {/* Past Events*/}
          <Card className="p-6 w-full mt-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Past Events</h2>
              <Link className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center group">
                View All
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="space-y-4">
              {hackathons
                .filter(h => h.status === 'completed')
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                .map((hackathon) => (
                  <div key={hackathon._id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                    <div className="flex-1">
                      <Link to="/schedule" className="font-medium text-white text-base hover:text-blue-300 transition-colors">
                        {hackathon.name}
                      </Link>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <Users className="h-4 w-4 mr-1" />
                        {hackathon.participants ? hackathon.participants.length : 0} participants
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded border ${
                      hackathon.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                      hackathon.status === 'upcoming' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                      'bg-gray-500/20 text-gray-300 border-gray-500/30'
                    }`}>
                      {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
                    </span>
                  </div>
                ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full"
        >
          <Card className="p-6 w-full mt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{activity.action}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Projects Modal */}
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
  );
};

export default Dashboard;