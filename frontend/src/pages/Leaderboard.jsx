import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Star, 
  TrendingUp, 
  Users, 
  Code2, 
  Award,
  Crown,
  Target,
  Zap,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

const Leaderboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [searchTerm, setSearchTerm] = useState('');

  // Static leaderboard data
  const leaderboardData = {
    overall: [
      {
        id: 1,
        rank: 1,
        name: 'Sarah Chen',
        avatar: 'SC',
        points: 2850,
        hackathonsWon: 5,
        projectsSubmitted: 12,
        teamsLed: 8,
        badge: 'Champion',
        trend: 'up'
      },
      {
        id: 2,
        rank: 2,
        name: 'Mike Rodriguez',
        avatar: 'MR',
        points: 2720,
        hackathonsWon: 4,
        projectsSubmitted: 15,
        teamsLed: 6,
        badge: 'Expert',
        trend: 'up'
      },
      {
        id: 3,
        rank: 3,
        name: 'Emma Davis',
        avatar: 'ED',
        points: 2650,
        hackathonsWon: 3,
        projectsSubmitted: 11,
        teamsLed: 7,
        badge: 'Pro',
        trend: 'down'
      },
      {
        id: 4,
        rank: 4,
        name: 'Alex Johnson',
        avatar: 'AJ',
        points: 2480,
        hackathonsWon: 3,
        projectsSubmitted: 9,
        teamsLed: 5,
        badge: 'Advanced',
        trend: 'up'
      },
      {
        id: 5,
        rank: 5,
        name: 'David Kim',
        avatar: 'DK',
        points: 2350,
        hackathonsWon: 2,
        projectsSubmitted: 8,
        teamsLed: 4,
        badge: 'Advanced',
        trend: 'same'
      },
      {
        id: 6,
        rank: 6,
        name: 'Lisa Wang',
        avatar: 'LW',
        points: 2200,
        hackathonsWon: 2,
        projectsSubmitted: 10,
        teamsLed: 3,
        badge: 'Intermediate',
        trend: 'up'
      },
      {
        id: 7,
        rank: 7,
        name: 'Tom Brown',
        avatar: 'TB',
        points: 2100,
        hackathonsWon: 1,
        projectsSubmitted: 7,
        teamsLed: 3,
        badge: 'Intermediate',
        trend: 'down'
      },
      {
        id: 8,
        rank: 8,
        name: 'Anna Lee',
        avatar: 'AL',
        points: 1950,
        hackathonsWon: 1,
        projectsSubmitted: 6,
        teamsLed: 2,
        badge: 'Rising Star',
        trend: 'up'
      }
    ],
    monthly: [
      {
        id: 1,
        rank: 1,
        name: 'Emma Davis',
        avatar: 'ED',
        points: 450,
        hackathonsWon: 1,
        projectsSubmitted: 3,
        teamsLed: 2,
        badge: 'Monthly Champion',
        trend: 'up'
      },
      {
        id: 2,
        rank: 2,
        name: 'Alex Johnson',
        avatar: 'AJ',
        points: 380,
        hackathonsWon: 0,
        projectsSubmitted: 2,
        teamsLed: 1,
        badge: 'Rising Fast',
        trend: 'up'
      },
      {
        id: 3,
        rank: 3,
        name: 'Sarah Chen',
        avatar: 'SC',
        points: 320,
        hackathonsWon: 1,
        projectsSubmitted: 1,
        teamsLed: 1,
        badge: 'Consistent',
        trend: 'same'
      }
    ],
    teams: [
      {
        id: 1,
        rank: 1,
        name: 'Code Warriors',
        avatar: 'CW',
        points: 1850,
        hackathonsWon: 3,
        projectsSubmitted: 8,
        members: 4,
        badge: 'Elite Team',
        trend: 'up'
      },
      {
        id: 2,
        rank: 2,
        name: 'Tech Innovators',
        avatar: 'TI',
        points: 1650,
        hackathonsWon: 2,
        projectsSubmitted: 6,
        members: 3,
        badge: 'Top Performers',
        trend: 'up'
      },
      {
        id: 3,
        rank: 3,
        name: 'Green Pioneers',
        avatar: 'GP',
        points: 1420,
        hackathonsWon: 2,
        projectsSubmitted: 5,
        members: 3,
        badge: 'Eco Champions',
        trend: 'down'
      }
    ]
  };

  const categories = [
    { id: 'overall', name: 'Overall', icon: Trophy },
    { id: 'monthly', name: 'This Month', icon: Calendar },
    { id: 'teams', name: 'Teams', icon: Users }
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
      case 2:
        return 'from-gray-400/20 to-gray-500/20 border-gray-400/30';
      case 3:
        return 'from-orange-500/20 to-orange-600/20 border-orange-500/30';
      default:
        return 'from-slate-700/50 to-slate-800/50 border-slate-600/30';
    }
  };

  const getBadgeColor = (badge) => {
    if (badge.includes('Champion')) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    if (badge.includes('Expert') || badge.includes('Elite')) return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    if (badge.includes('Pro') || badge.includes('Top')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (badge.includes('Advanced')) return 'bg-green-500/20 text-green-300 border-green-500/30';
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const filteredData = leaderboardData[selectedCategory].filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topThree = filteredData.slice(0, 3);
  const remaining = filteredData.slice(3);

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          <p className="mt-2 text-gray-400">See how you rank among the community</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topThree.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`order-${index === 0 ? '2 md:order-1' : index === 1 ? '1 md:order-2' : '3'}`}
          >
            <Card className={`p-6 text-center bg-gradient-to-br ${getRankColor(user.rank)} border`}>
              <div className="flex justify-center mb-4">
                {getRankIcon(user.rank)}
              </div>
              <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-white">{user.avatar}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{user.name}</h3>
              <div className="text-2xl font-bold text-white mb-2">{user.points.toLocaleString()}</div>
              <div className="text-sm text-gray-400 mb-3">points</div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getBadgeColor(user.badge)}`}>
                {user.badge}
              </span>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-400">
                <div>
                  <div className="font-medium text-white">{user.hackathonsWon}</div>
                  <div>Wins</div>
                </div>
                <div>
                  <div className="font-medium text-white">{user.projectsSubmitted}</div>
                  <div>Projects</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Remaining Rankings */}
      {remaining.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Rankings</h2>
          <div className="space-y-3">
            {remaining.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index + 3) * 0.05 }}
                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(user.rank)}
                  </div>
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">{user.avatar}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{user.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded border ${getBadgeColor(user.badge)}`}>
                      {user.badge}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-400">
                    <div className="text-center">
                      <div className="font-medium text-white">{user.hackathonsWon}</div>
                      <div>Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-white">{user.projectsSubmitted}</div>
                      <div>Projects</div>
                    </div>
                    {selectedCategory === 'teams' && (
                      <div className="text-center">
                        <div className="font-medium text-white">{user.members}</div>
                        <div>Members</div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="font-bold text-white">{user.points.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">points</div>
                    </div>
                    {getTrendIcon(user.trend)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white">156</div>
          <div className="text-sm text-gray-400">Total Participants</div>
        </Card>
        <Card className="p-6 text-center">
          <Users className="h-8 w-8 text-blue-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white">42</div>
          <div className="text-sm text-gray-400">Active Teams</div>
        </Card>
        <Card className="p-6 text-center">
          <Code2 className="h-8 w-8 text-green-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white">89</div>
          <div className="text-sm text-gray-400">Projects Submitted</div>
        </Card>
        <Card className="p-6 text-center">
          <Zap className="h-8 w-8 text-purple-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white">2.8k</div>
          <div className="text-sm text-gray-400">Total Points Earned</div>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;