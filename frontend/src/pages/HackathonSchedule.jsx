import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Circle, 
  Users, 
  Trophy,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Code2,
  Send,
  Medal,
  Star,
  Crown,
  Award,
  TrendingUp,
  UserPlus,
  Target,
  Lightbulb,
  Zap,
  MessageSquare,
  HelpCircle,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const HackathonSchedule = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const hackathonPhases = [
    {
      id: 1,
      name: 'Registration',
      description: 'Sign up and form teams',
      startTime: '2024-01-10T00:00:00Z',
      endTime: '2024-01-12T23:59:59Z',
      status: 'completed',
      icon: Users
    },
    {
      id: 2,
      name: 'Preparation',
      description: 'Setup development environment and plan project',
      startTime: '2024-01-13T00:00:00Z',
      endTime: '2024-01-13T23:59:59Z',
      status: 'completed',
      icon: Settings
    },
    {
      id: 3,
      name: 'Coding Phase',
      description: 'Build your amazing projects',
      startTime: '2024-01-14T00:00:00Z',
      endTime: '2024-01-16T23:59:59Z',
      status: 'active',
      icon: Play
    },
    {
      id: 4,
      name: 'Final Submissions',
      description: 'Submit your completed projects',
      startTime: '2024-01-17T00:00:00Z',
      endTime: '2024-01-17T18:00:00Z',
      status: 'upcoming',
      icon: CheckCircle
    },
    {
      id: 5,
      name: 'Judging',
      description: 'Projects are evaluated by judges',
      startTime: '2024-01-17T18:00:00Z',
      endTime: '2024-01-18T18:00:00Z',
      status: 'upcoming',
      icon: Trophy
    },
    {
      id: 6,
      name: 'Results',
      description: 'Winners announced and awards ceremony',
      startTime: '2024-01-18T19:00:00Z',
      endTime: '2024-01-18T21:00:00Z',
      status: 'upcoming',
      icon: Trophy
    }
  ];

  // Updated upcoming events with problem statements
  const upcomingEvents = [
    {
      id: 1,
      title: 'AI Innovation Challenge',
      time: '2024-01-14T10:00:00Z',
      type: 'hackathon',
      mandatory: false,
      eligibility: 'students',
      problemStatements: [
        {
          id: 1,
          title: 'Smart Healthcare Assistant',
          description: 'Develop an AI-powered healthcare chatbot that can provide medical advice, schedule appointments, and monitor patient health.',
          category: 'Healthcare',
          difficulty: 'Medium',
          tags: ['AI/ML', 'Healthcare', 'Chatbot']
        },
        {
          id: 2,
          title: 'Sustainable Energy Optimizer',
          description: 'Create a system that optimizes energy consumption in smart homes using AI and IoT sensors.',
          category: 'Sustainability',
          difficulty: 'Hard',
          tags: ['IoT', 'AI/ML', 'Energy']
        },
        {
          id: 3,
          title: 'Educational Content Generator',
          description: 'Build an AI tool that generates personalized educational content based on student learning patterns.',
          category: 'Education',
          difficulty: 'Medium',
          tags: ['AI/ML', 'Education', 'Personalization']
        }
      ],
      selectedProblem: null
    },
    {
      id: 2,
      title: 'Green Tech Hackathon',
      time: '2024-01-22T14:00:00Z',
      type: 'hackathon',
      mandatory: false,
      eligibility: 'professionals',
      problemStatements: [
        {
          id: 4,
          title: 'Carbon Footprint Tracker',
          description: 'Build a comprehensive platform to track and reduce carbon emissions for businesses.',
          category: 'Environment',
          difficulty: 'Medium',
          tags: ['Sustainability', 'Analytics', 'Web']
        },
        {
          id: 5,
          title: 'Renewable Energy Management',
          description: 'Create a smart grid system for managing renewable energy distribution.',
          category: 'Energy',
          difficulty: 'Hard',
          tags: ['IoT', 'Energy', 'Smart Grid']
        }
      ],
      selectedProblem: null
    },
    {
      id: 3,
      title: 'Fintech Solutions Challenge',
      time: '2024-01-28T12:00:00Z',
      type: 'hackathon',
      mandatory: false,
      eligibility: 'both',
      problemStatements: [
        {
          id: 6,
          title: 'Micro-Investment Platform',
          description: 'Develop a platform that allows users to invest spare change from daily transactions.',
          category: 'Finance',
          difficulty: 'Medium',
          tags: ['Fintech', 'Mobile', 'Investment']
        },
        {
          id: 7,
          title: 'Blockchain Payment System',
          description: 'Create a secure, fast, and low-cost payment system using blockchain technology.',
          category: 'Blockchain',
          difficulty: 'Hard',
          tags: ['Blockchain', 'Payments', 'Security']
        }
      ],
      selectedProblem: null
    }
  ];

  const [events, setEvents] = useState(upcomingEvents);

  // Discussion forum questions
  const [discussionQuestions, setDiscussionQuestions] = useState([
    {
      id: 1,
      hackathonId: 1,
      hackathonName: 'AI Innovation Challenge',
      question: 'What are the specific AI frameworks we can use for this hackathon?',
      askedBy: 'Sarah Chen',
      askedAt: '2024-01-12T10:30:00Z',
      replies: [
        {
          id: 1,
          reply: 'You can use any popular AI framework like TensorFlow, PyTorch, or Scikit-learn. The focus should be on innovation and practical application.',
          repliedBy: 'Hackathon Organizer',
          repliedAt: '2024-01-12T11:15:00Z'
        }
      ]
    },
    {
      id: 2,
      hackathonId: 1,
      hackathonName: 'AI Innovation Challenge',
      question: 'Is there any restriction on using pre-trained models?',
      askedBy: 'Mike Rodriguez',
      askedAt: '2024-01-12T14:15:00Z',
      replies: [
        {
          id: 2,
          reply: 'Pre-trained models are allowed as long as you build significant functionality on top of them. The innovation should be in your application and implementation.',
          repliedBy: 'Hackathon Organizer',
          repliedAt: '2024-01-12T16:20:00Z'
        }
      ]
    },
    {
      id: 3,
      hackathonId: 2,
      hackathonName: 'Green Tech Hackathon',
      question: 'Are there any specific environmental impact metrics we need to include?',
      askedBy: 'Emma Davis',
      askedAt: '2024-01-11T09:45:00Z',
      replies: []
    }
  ]);

  // Hackathon-specific leaderboard data
  const hackathonLeaderboard = [
    {
      id: 1,
      rank: 1,
      teamName: 'Code Warriors',
      members: ['Sarah Chen', 'Mike Rodriguez', 'John Doe'],
      avatar: 'CW',
      score: 95,
      projectTitle: 'AI-Powered Task Manager',
      submissionStatus: 'Submitted',
      lastActivity: '2 hours ago'
    },
    {
      id: 2,
      rank: 2,
      teamName: 'Tech Innovators',
      members: ['Emma Davis', 'Alex Johnson'],
      avatar: 'TI',
      score: 92,
      projectTitle: 'Smart Healthcare Assistant',
      submissionStatus: 'Submitted',
      lastActivity: '4 hours ago'
    },
    {
      id: 3,
      rank: 3,
      teamName: 'Green Pioneers',
      members: ['David Kim', 'Lisa Wang', 'Tom Brown'],
      avatar: 'GP',
      score: 88,
      projectTitle: 'Carbon Footprint Tracker',
      submissionStatus: 'Submitted',
      lastActivity: '1 hour ago'
    },
    {
      id: 4,
      rank: 4,
      teamName: 'Data Wizards',
      members: ['Anna Lee', 'Chris Park'],
      avatar: 'DW',
      score: 85,
      projectTitle: 'Predictive Analytics Platform',
      submissionStatus: 'In Progress',
      lastActivity: '30 minutes ago'
    },
    {
      id: 5,
      rank: 5,
      teamName: 'Mobile Masters',
      members: ['Ryan Taylor', 'Sophie Wilson'],
      avatar: 'MM',
      score: 82,
      projectTitle: 'Cross-Platform Fitness App',
      submissionStatus: 'In Progress',
      lastActivity: '1 hour ago'
    }
  ];

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate time remaining for current phase
  useEffect(() => {
    const activePhase = hackathonPhases.find(phase => phase.status === 'active');
    if (activePhase) {
      const endTime = new Date(activePhase.endTime);
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds });
      }
    }
  }, [currentTime]);

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
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'active':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'upcoming':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'hackathon':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'meeting':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'support':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'checkpoint':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'deadline':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Hard':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-600" />;
      default:
        return <span className="text-sm font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getSubmissionStatusColor = (status) => {
    switch (status) {
      case 'Submitted':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const handleProblemSelect = (eventId, problemId) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              selectedProblem: event.problemStatements.find(p => p.id === problemId) 
            }
          : event
      )
    );
  };

  const handleJoinHackathon = (event) => {
    const hackathonData = {
      name: event.title,
      description: `Join the ${event.title} and build innovative solutions`,
      startDate: event.time,
      endDate: new Date(new Date(event.time).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days later
      registrationDeadline: new Date(new Date(event.time).getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 day before
      eligibility: event.eligibility,
      maxTeamSize: 4,
      prizes: ['$10,000', '$5,000', '$2,500'],
      problemStatements: event.problemStatements
    };

    navigate('/join-hackathon', { state: { hackathon: hackathonData } });
  };

  const handleOpenDiscussion = (event) => {
    setSelectedHackathon(event);
    setShowDiscussionModal(true);
  };

  const handleSubmitQuestion = () => {
    if (!newQuestion.trim()) {
      return;
    }

    const question = {
      id: Date.now(),
      hackathonId: selectedHackathon.id,
      hackathonName: selectedHackathon.title,
      question: newQuestion.trim(),
      askedBy: user?.name || 'Anonymous',
      askedAt: new Date().toISOString(),
      replies: []
    };

    setDiscussionQuestions(prev => [question, ...prev]);
    setNewQuestion('');
    success('Question submitted successfully!');
  };

  const filteredQuestions = discussionQuestions.filter(q => 
    selectedHackathon ? q.hackathonId === selectedHackathon.id : true
  ).filter(q =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.askedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPhase = hackathonPhases.find(phase => phase.status === 'active');

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Hackathon Schedule</h1>
          <p className="mt-2 text-gray-400">Track progress and stay updated with the timeline</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
          <Link to="/editor">
            <Button>
              <Code2 className="mr-2 h-4 w-4" />
              Start Coding
            </Button>
          </Link>
          <Link to="/submissions">
            <Button variant="outline">
              <Send className="mr-2 h-4 w-4" />
              Submit Project
            </Button>
          </Link>
          <Button variant="outline" onClick={() => setShowLeaderboardModal(true)}>
            <Trophy className="mr-2 h-4 w-4" />
            Leaderboard
          </Button>
          {user?.isAdmin && (
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Admin Controls
            </Button>
          )}
        </div>
      </div>

      {/* Countdown Timer */}
      {currentPhase && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 text-white">Current Phase: {currentPhase.name}</h2>
              <p className="text-blue-200 mb-6">{currentPhase.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{timeRemaining.days}</div>
                  <div className="text-sm text-blue-200">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{timeRemaining.hours}</div>
                  <div className="text-sm text-blue-200">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{timeRemaining.minutes}</div>
                  <div className="text-sm text-blue-200">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{timeRemaining.seconds}</div>
                  <div className="text-sm text-blue-200">Seconds</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Timeline */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Hackathon Timeline</h2>
          <div className="space-y-4">
            {hackathonPhases.map((phase, index) => {
              const Icon = phase.icon;
              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <Card className={`p-4 border-l-4 ${
                    phase.status === 'active' ? 'border-l-blue-500 bg-blue-500/10' :
                    phase.status === 'completed' ? 'border-l-green-500 bg-green-500/10' :
                    'border-l-gray-500'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className={`p-2 rounded-lg ${
                          phase.status === 'active' ? 'bg-blue-500/20' :
                          phase.status === 'completed' ? 'bg-green-500/20' :
                          'bg-gray-500/20'
                        } flex-shrink-0`}>
                          <Icon className={`h-5 w-5 ${
                            phase.status === 'active' ? 'text-blue-400' :
                            phase.status === 'completed' ? 'text-green-400' :
                            'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white">{phase.name}</h3>
                          <p className="text-sm text-gray-400 mt-1">{phase.description}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-500 mt-2 gap-1 sm:gap-4">
                            <span>Start: {formatDate(phase.startTime)}</span>
                            <span>End: {formatDate(phase.endTime)}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(phase.status)} flex-shrink-0 ml-2`}>
                        {phase.status === 'active' ? 'In Progress' : 
                         phase.status === 'completed' ? 'Completed' : 'Upcoming'}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events with Problem Statements */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Hackathons</h2>
          <div className="space-y-4">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2 gap-1">
                          <h3 className="font-medium text-white">{event.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded border ${getEventTypeColor(event.type)} w-fit`}>
                            {event.type}
                          </span>
                          <span className="px-2 py-1 text-xs bg-gray-500/20 text-gray-300 rounded border border-gray-500/30 w-fit">
                            {event.eligibility === 'both' ? 'Students & Professionals' : 
                             event.eligibility === 'students' ? 'Students Only' : 'Professionals Only'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span>{formatDate(event.time)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Problem Statements */}
                    {event.problemStatements && (
                      <div>
                        <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                          <Target className="h-4 w-4 mr-2" />
                          Problem Statements (Select One):
                        </h4>
                        <div className="space-y-2">
                          {event.problemStatements.map((problem) => (
                            <div
                              key={problem.id}
                              className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                event.selectedProblem?.id === problem.id
                                  ? 'bg-blue-500/20 border-blue-500/50'
                                  : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                              }`}
                              onClick={() => handleProblemSelect(event.id, problem.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h5 className="text-sm font-medium text-white">{problem.title}</h5>
                                    <span className={`px-2 py-1 text-xs font-medium rounded border ${getDifficultyColor(problem.difficulty)}`}>
                                      {problem.difficulty}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">{problem.description}</p>
                                  <div className="flex items-center space-x-1">
                                    <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                                      {problem.category}
                                    </span>
                                    {problem.tags.slice(0, 2).map((tag, tagIndex) => (
                                      <span key={tagIndex} className="px-2 py-1 text-xs bg-slate-600 text-gray-300 rounded">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="ml-3 flex-shrink-0">
                                  {event.selectedProblem?.id === problem.id ? (
                                    <CheckCircle className="h-5 w-5 text-blue-400" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-slate-700 flex flex-col sm:flex-row gap-2">
                      <Button 
                        className="flex-1"
                        onClick={() => handleJoinHackathon(event)}
                        disabled={!event.selectedProblem}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Join Hackathon
                        {!event.selectedProblem && (
                          <span className="ml-2 text-xs">(Select a problem first)</span>
                        )}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleOpenDiscussion(event)}
                        className="flex-1"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Discussion Forum
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">156</div>
                <div className="text-sm text-gray-400">Participants</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">42</div>
                <div className="text-sm text-gray-400">Teams</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">28</div>
                <div className="text-sm text-gray-400">Submissions</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">12</div>
                <div className="text-sm text-gray-400">Mentors</div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Hackathon Leaderboard Modal */}
      <Modal
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
        title="AI Innovation Challenge - Leaderboard"
        size="4xl"
      >
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-400">Real-time team rankings for the current hackathon</p>
          </div>

          {/* Top 3 Teams */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hackathonLeaderboard.slice(0, 3).map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`order-${index === 0 ? '2 md:order-1' : index === 1 ? '1 md:order-2' : '3'}`}
              >
                <Card className={`p-6 text-center ${
                  team.rank === 1 ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30' :
                  team.rank === 2 ? 'bg-gradient-to-br from-gray-400/20 to-gray-500/20 border-gray-400/30' :
                  'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30'
                } border`}>
                  <div className="flex justify-center mb-4">
                    {getRankIcon(team.rank)}
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-sm font-bold text-white">{team.avatar}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{team.teamName}</h3>
                  <div className="text-2xl font-bold text-white mb-1">{team.score}</div>
                  <div className="text-sm text-gray-400 mb-3">points</div>
                  <div className="text-xs text-gray-400 mb-2">{team.projectTitle}</div>
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getSubmissionStatusColor(team.submissionStatus)}`}>
                    {team.submissionStatus}
                  </span>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Remaining Teams */}
          <div className="space-y-3">
            {hackathonLeaderboard.slice(3).map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index + 3) * 0.05 }}
                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(team.rank)}
                  </div>
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">{team.avatar}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{team.teamName}</h3>
                    <p className="text-xs text-gray-400">{team.projectTitle}</p>
                    <p className="text-xs text-gray-500">Members: {team.members.join(', ')}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getSubmissionStatusColor(team.submissionStatus)}`}>
                    {team.submissionStatus}
                  </span>
                  <div className="text-right">
                    <div className="font-bold text-white">{team.score}</div>
                    <div className="text-xs text-gray-400">points</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </Modal>

      {/* Discussion Forum Modal */}
      <Modal
        isOpen={showDiscussionModal}
        onClose={() => {
          setShowDiscussionModal(false);
          setSelectedHackathon(null);
          setSearchTerm('');
        }}
        title={`Discussion Forum - ${selectedHackathon?.title}`}
        size="4xl"
      >
        <div className="space-y-6">
          {/* Ask Question Section */}
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Ask a Question
            </h3>
            <div className="space-y-3">
              <textarea
                placeholder="Type your question here..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                rows={3}
              />
              <div className="flex justify-end">
                <Button onClick={handleSubmitQuestion} disabled={!newQuestion.trim()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Submit Question
                </Button>
              </div>
            </div>
          </div>

          {/* Search Questions */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>

          {/* Questions List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No questions found. Be the first to ask!</p>
              </div>
            ) : (
              filteredQuestions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-slate-700 rounded-lg p-4 bg-slate-800/50"
                >
                  <div className="mb-3">
                    <p className="text-white mb-2">{question.question}</p>
                    <div className="flex items-center text-xs text-gray-400">
                      <span>Asked by {question.askedBy}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(question.askedAt)}</span>
                    </div>
                  </div>

                  {question.replies.length > 0 && (
                    <div className="space-y-2">
                      {question.replies.map((reply) => (
                        <div key={reply.id} className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
                          <p className="text-blue-300 mb-2">{reply.reply}</p>
                          <div className="flex items-center text-xs text-blue-400">
                            <span>Replied by {reply.repliedBy}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(reply.repliedAt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.replies.length === 0 && (
                    <div className="text-xs text-gray-500 italic">
                      Waiting for organizer response...
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HackathonSchedule;