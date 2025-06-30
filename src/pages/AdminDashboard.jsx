import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  FileText, 
  Star,
  Eye,
  Edit,
  Download,
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import { useToast } from '../contexts/ToastContext';

const AdminDashboard = () => {
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [scores, setScores] = useState({
    innovation: 0,
    technical: 0,
    design: 0,
    presentation: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { success } = useToast();

  const submissions = [
    {
      id: 1,
      title: 'AI-Powered Task Manager',
      team: 'Code Warriors',
      members: ['John Doe', 'Sarah Chen', 'Mike Rodriguez'],
      submittedAt: '2024-01-15T14:30:00Z',
      githubUrl: 'https://github.com/team/ai-task-manager',
      demoUrl: 'https://ai-task-manager.demo.com',
      status: 'Judged',
      scores: {
        innovation: 85,
        technical: 90,
        design: 80,
        presentation: 88
      },
      totalScore: 86,
      judgedBy: 'Admin User'
    },
    {
      id: 2,
      title: 'Green Transport Tracker',
      team: 'Green Innovators',
      members: ['Emma Davis', 'Alex Johnson'],
      submittedAt: '2024-01-15T16:45:00Z',
      githubUrl: 'https://github.com/team/green-transport',
      demoUrl: 'https://green-transport.demo.com',
      status: 'Pending',
      scores: null,
      totalScore: null,
      judgedBy: null
    },
    {
      id: 3,
      title: 'Smart Home Assistant',
      team: 'Tech Wizards',
      members: ['David Kim', 'Lisa Wang', 'Tom Brown', 'Anna Lee'],
      submittedAt: '2024-01-15T17:20:00Z',
      githubUrl: 'https://github.com/team/smart-home',
      demoUrl: 'https://smart-home.demo.com',
      status: 'Judged',
      scores: {
        innovation: 92,
        technical: 88,
        design: 85,
        presentation: 90
      },
      totalScore: 89,
      judgedBy: 'Admin User'
    }
  ];

  const stats = [
    { label: 'Total Submissions', value: '24', icon: FileText, color: 'bg-blue-500' },
    { label: 'Teams Participating', value: '18', icon: Users, color: 'bg-green-500' },
    { label: 'Judged Projects', value: '16', icon: Trophy, color: 'bg-purple-500' },
    { label: 'Average Score', value: '87.5', icon: Star, color: 'bg-orange-500' }
  ];

  const leaderboard = submissions
    .filter(s => s.totalScore !== null)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10);

  const handleScoreSubmission = (submission) => {
    setSelectedSubmission(submission);
    if (submission.scores) {
      setScores(submission.scores);
    } else {
      setScores({ innovation: 0, technical: 0, design: 0, presentation: 0 });
    }
    setShowScoreModal(true);
  };

  const handleSaveScore = () => {
    const totalScore = Math.round(
      (scores.innovation + scores.technical + scores.design + scores.presentation) / 4
    );
    
    success(`Score saved for ${selectedSubmission.title}: ${totalScore}/100`);
    setShowScoreModal(false);
    setSelectedSubmission(null);
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || submission.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
      case 'Judged':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-2 text-gray-400">Manage submissions, scoring, and leaderboard</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions Management */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Project Submissions</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search submissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="judged">Judged</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredSubmissions.map((submission, index) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-slate-700 rounded-lg p-4 bg-slate-800/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-white">{submission.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}>
                          {submission.status}
                        </span>
                        {submission.totalScore && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-300">
                              {submission.totalScore}/100
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-2">Team: {submission.team}</p>
                      <p className="text-sm text-gray-400 mb-2">
                        Members: {submission.members.join(', ')}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Submitted: {formatDate(submission.submittedAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                    <div className="flex items-center space-x-4">
                      <a
                        href={submission.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        GitHub
                      </a>
                      {submission.demoUrl && (
                        <a
                          href={submission.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300"
                        >
                          Live Demo
                        </a>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleScoreSubmission(submission)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {submission.status === 'Judged' ? 'Edit Score' : 'Score'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Leaderboard */}
        <div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Leaderboard</h2>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-3">
              {leaderboard.map((submission, index) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-gray-600 text-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{submission.title}</p>
                      <p className="text-xs text-gray-400">{submission.team}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold text-white">{submission.totalScore}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Scoring Modal */}
      <Modal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        title={`Score: ${selectedSubmission?.title}`}
        size="lg"
      >
        <div className="space-y-6">
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <h4 className="font-medium text-white mb-2">Project Details</h4>
            <p className="text-sm text-gray-300 mb-1">Team: {selectedSubmission?.team}</p>
            <p className="text-sm text-gray-300">
              Members: {selectedSubmission?.members?.join(', ')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Innovation (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={scores.innovation}
                onChange={(e) => setScores({...scores, innovation: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Technical Implementation (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={scores.technical}
                onChange={(e) => setScores({...scores, technical: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Design & UX (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={scores.design}
                onChange={(e) => setScores({...scores, design: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Presentation (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={scores.presentation}
                onChange={(e) => setScores({...scores, presentation: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              />
            </div>
          </div>

          <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">Total Score:</span>
              <span className="text-2xl font-bold text-blue-300">
                {Math.round((scores.innovation + scores.technical + scores.design + scores.presentation) / 4)}/100
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowScoreModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveScore}>
              <Award className="mr-2 h-4 w-4" />
              Save Score
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;