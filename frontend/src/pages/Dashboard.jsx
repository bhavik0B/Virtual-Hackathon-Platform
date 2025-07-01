import React from 'react';
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
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Active Teams', value: '12', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Projects', value: '8', icon: Code2, color: 'from-green-500 to-emerald-500' },
    { label: 'Submissions', value: '24', icon: Trophy, color: 'from-purple-500 to-pink-500' },
    { label: 'Hours Coded', value: '156', icon: Clock, color: 'from-orange-500 to-red-500' }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'AI Innovation Challenge',
      date: '2024-01-15',
      time: '09:00 AM',
      participants: 234,
      status: 'Upcoming'
    },
    {
      id: 2,
      title: 'Green Tech Hackathon',
      date: '2024-01-22',
      time: '10:00 AM',
      participants: 189,
      status: 'Registration Open'
    },
    {
      id: 3,
      title: 'Fintech Solutions',
      date: '2024-01-28',
      time: '11:00 AM',
      participants: 156,
      status: 'Coming Soon'
    }
  ];

  const recentActivity = [
    { action: 'Joined team "Code Warriors"', time: '2 hours ago', type: 'team', icon: Users },
    { action: 'Submitted project "Smart City"', time: '1 day ago', type: 'submission', icon: Trophy },
    { action: 'Completed code review', time: '2 days ago', type: 'code', icon: Code2 },
    { action: 'Won 3rd place in AI Challenge', time: '1 week ago', type: 'achievement', icon: Star }
  ];

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
              Welcome back, {user?.name}! 👋
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-full"
            >
              <Card className="p-6 hover:shadow-xl transition-all duration-300 group w-full" hover>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
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
          <Card className="p-6 w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Upcoming Events</h2>
              <Link to="/schedule" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center group">
                View All
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{event.title}</h3>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {event.date} at {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <Users className="h-4 w-4 mr-1" />
                      {event.participants} participants
                    </div>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                    {event.status}
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
          <Card className="p-6 w-full">
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

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full"
      >
        <Card className="p-6 w-full">
          <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/teams">
              <Button variant="outline" className="w-full justify-start h-12 group">
                <Users className="mr-3 h-5 w-5 group-hover:text-blue-400 transition-colors" />
                Manage Teams
              </Button>
            </Link>
            <Link to="/editor">
              <Button variant="outline" className="w-full justify-start h-12 group">
                <Code2 className="mr-3 h-5 w-5 group-hover:text-green-400 transition-colors" />
                Start Coding
              </Button>
            </Link>
            <Link to="/submissions">
              <Button variant="outline" className="w-full justify-start h-12 group">
                <Trophy className="mr-3 h-5 w-5 group-hover:text-purple-400 transition-colors" />
                Submit Project
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;