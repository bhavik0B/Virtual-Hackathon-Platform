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
  RotateCcw
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

const HackathonSchedule = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

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

  const upcomingEvents = [
    {
      id: 1,
      title: 'Team Standup Meeting',
      time: '2024-01-14T10:00:00Z',
      type: 'meeting',
      mandatory: false
    },
    {
      id: 2,
      title: 'Mentor Office Hours',
      time: '2024-01-14T14:00:00Z',
      type: 'support',
      mandatory: false
    },
    {
      id: 3,
      title: 'Mid-Hackathon Check-in',
      time: '2024-01-15T12:00:00Z',
      type: 'checkpoint',
      mandatory: true
    },
    {
      id: 4,
      title: 'Final Submission Deadline',
      time: '2024-01-17T18:00:00Z',
      type: 'deadline',
      mandatory: true
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

  const currentPhase = hackathonPhases.find(phase => phase.status === 'active');

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Hackathon Schedule</h1>
          <p className="mt-2 text-gray-400">Track progress and stay updated with the timeline</p>
        </div>
        {user?.isAdmin && (
          <div className="mt-4 sm:mt-0">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Admin Controls
            </Button>
          </div>
        )}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Upcoming Events */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2 gap-1">
                        <h3 className="font-medium text-white">{event.title}</h3>
                        {event.mandatory && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-300 rounded border border-red-500/30 w-fit">
                            Required
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>{formatDate(event.time)}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded border ${getEventTypeColor(event.type)} flex-shrink-0`}>
                      {event.type}
                    </span>
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
    </div>
  );
};

export default HackathonSchedule;