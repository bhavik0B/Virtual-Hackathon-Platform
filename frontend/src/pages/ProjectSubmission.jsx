import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Github, 
  ExternalLink, 
  Calendar, 
  Trophy, 
  Eye,
  Edit,
  Trash2,
  Plus,
  FileText,
  Link as LinkIcon,
  Award
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext';

const ProjectSubmission = () => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const { success, error } = useToast();

  const submissions = [
    {
      id: 1,
      title: 'AI-Powered Task Manager',
      description: 'A smart task management application that uses machine learning to prioritize tasks and predict completion times.',
      githubUrl: 'https://github.com/team/ai-task-manager',
      demoUrl: 'https://ai-task-manager.demo.com',
      submittedAt: '2024-01-10T15:30:00Z',
      team: 'Code Warriors',
      status: 'Submitted',
      score: 85,
      hackathon: 'AI Innovation Challenge'
    },
    {
      id: 2,
      title: 'Green Transport Tracker',
      description: 'Mobile app that tracks carbon footprint from transportation and suggests eco-friendly alternatives.',
      githubUrl: 'https://github.com/team/green-transport',
      demoUrl: 'https://green-transport.demo.com',
      submittedAt: '2024-01-05T10:20:00Z',
      team: 'Green Innovators',
      status: 'Judged',
      score: 92,
      hackathon: 'Green Tech Hackathon'
    }
  ];

  const currentHackathon = {
    name: 'AI Innovation Challenge',
    deadline: '2024-01-15T23:59:59Z',
    description: 'Build innovative AI solutions for everyday problems'
  };

  const handleSubmitProject = () => {
    if (!projectTitle.trim()) {
      error('Project title is required');
      return;
    }
    if (!projectDescription.trim()) {
      error('Project description is required');
      return;
    }
    if (!githubUrl.trim()) {
      error('GitHub repository URL is required');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      success('Project submitted successfully!');
      setShowSubmitModal(false);
      setProjectTitle('');
      setProjectDescription('');
      setGithubUrl('');
      setDemoUrl('');
    }, 1000);
  };

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
      case 'Submitted':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Judged':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Project Submissions</h1>
          <p className="mt-2 text-gray-400">Submit and manage your hackathon projects</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setShowSubmitModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Submit Project
          </Button>
        </div>
      </div>

      {/* Current Hackathon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-white mb-2">
                {currentHackathon.name}
              </h2>
              <p className="text-gray-300 mb-4">{currentHackathon.description}</p>
              <div className="flex items-center text-sm text-gray-400">
                <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Deadline: {formatDate(currentHackathon.deadline)}</span>
              </div>
            </div>
            <Trophy className="h-8 w-8 text-blue-400 flex-shrink-0 ml-4" />
          </div>
        </Card>
      </motion.div>

      {/* Submission Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 text-center">
            <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Send className="h-6 w-6 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">2</p>
            <p className="text-sm text-gray-400">Total Submissions</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 text-center">
            <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Award className="h-6 w-6 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">88.5</p>
            <p className="text-sm text-gray-400">Average Score</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 text-center">
            <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Trophy className="h-6 w-6 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">1</p>
            <p className="text-sm text-gray-400">Awards Won</p>
          </Card>
        </motion.div>
      </div>

      {/* Submissions List */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Your Submissions</h2>
        <div className="space-y-4">
          {submissions.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 gap-2">
                      <h3 className="text-lg font-semibold text-white">
                        {submission.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(submission.status)}`}>
                          {submission.status}
                        </span>
                        {submission.score && (
                          <div className="flex items-center space-x-1">
                            <Trophy className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-300">
                              {submission.score}/100
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-400 mb-3 line-clamp-2">{submission.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>{formatDate(submission.submittedAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>{submission.hackathon}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-slate-700 gap-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href={submission.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      <Github className="h-4 w-4 mr-1" />
                      <span className="text-sm">Repository</span>
                    </a>
                    {submission.demoUrl && (
                      <a
                        href={submission.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        <span className="text-sm">Live Demo</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Submit Project Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Project"
        size="lg"
      >
        <div className="space-y-4">
          <InputField
            label="Project Title"
            placeholder="Enter your project title"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Description <span className="text-red-400">*</span>
            </label>
            <textarea
              placeholder="Describe your project, its features, and what makes it special"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              rows={4}
            />
          </div>

          <InputField
            label="GitHub Repository URL"
            placeholder="https://github.com/username/repository"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            required
          />

          <InputField
            label="Live Demo URL (Optional)"
            placeholder="https://your-project-demo.com"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
          />

          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-300 mb-1">
                  Submission Guidelines
                </h4>
                <ul className="text-sm text-blue-300 space-y-1">
                  <li>• Ensure your repository is public and includes a README</li>
                  <li>• Include setup instructions and project dependencies</li>
                  <li>• Add screenshots or demo videos if possible</li>
                  <li>• Make sure your live demo is accessible</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setShowSubmitModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitProject}>
              <Send className="mr-2 h-4 w-4" />
              Submit Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectSubmission;