import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Crown, 
  User, 
  Settings,
  Copy,
  Check,
  Video
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import VideoCallModal from '../components/VideoCallModal';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

const TeamManagement = () => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { success, error } = useToast();

  // State for managing teams
  const [myTeams, setMyTeams] = useState([
    {
      id: 1,
      name: 'Code Warriors',
      description: 'Building the next generation of AI tools',
      members: [
        { id: 1, name: user?.name || 'John Doe', email: user?.email || 'john@example.com', role: 'Leader', avatar: user?.name?.charAt(0) || 'JD' },
        { id: 2, name: 'Sarah Chen', email: 'sarah@example.com', role: 'Developer', avatar: 'SC' },
        { id: 3, name: 'Mike Rodriguez', email: 'mike@example.com', role: 'Designer', avatar: 'MR' }
      ],
      inviteCode: 'CW2024XYZ',
      status: 'Active',
      createdBy: user?.id || '1'
    },
    {
      id: 2,
      name: 'Green Innovators',
      description: 'Sustainable tech solutions for a better world',
      members: [
        { id: 4, name: 'Emma Davis', email: 'emma@example.com', role: 'Leader', avatar: 'ED' },
        { id: 5, name: 'Alex Johnson', email: 'alex@example.com', role: 'Developer', avatar: 'AJ' }
      ],
      inviteCode: 'GI2024ABC',
      status: 'Active',
      createdBy: '4'
    }
  ]);

  const availableTeams = [
    {
      id: 3,
      name: 'Data Wizards',
      description: 'Advanced analytics and machine learning',
      members: 3,
      maxMembers: 5,
      skills: ['Python', 'Machine Learning', 'Data Science']
    },
    {
      id: 4,
      name: 'Mobile Masters',
      description: 'Cross-platform mobile app development',
      members: 2,
      maxMembers: 4,
      skills: ['React Native', 'Flutter', 'iOS', 'Android']
    }
  ];

  // Generate random invite code
  const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      error('Team name is required');
      return;
    }
    
    setIsCreating(true);
    
    // Simulate API call
    setTimeout(() => {
      const newTeam = {
        id: Date.now(), // Simple ID generation for demo
        name: teamName.trim(),
        description: teamDescription.trim() || 'No description provided',
        members: [
          { 
            id: user?.id || Date.now(), 
            name: user?.name || 'You', 
            email: user?.email || 'you@example.com', 
            role: 'Leader', 
            avatar: user?.name?.charAt(0) || 'Y' 
          }
        ],
        inviteCode: generateInviteCode(),
        status: 'Active',
        createdBy: user?.id || '1'
      };

      // Add new team to the list
      setMyTeams(prevTeams => [newTeam, ...prevTeams]);
      
      success(`Team "${teamName}" created successfully!`);
      setShowCreateModal(false);
      setTeamName('');
      setTeamDescription('');
      setIsCreating(false);
    }, 1000);
  };

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) {
      error('Email is required');
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      success(`Invitation sent to ${inviteEmail}!`);
      setShowInviteModal(false);
      setInviteEmail('');
      setSelectedTeam(null);
    }, 1000);
  };

  const handleJoinTeam = (teamId) => {
    success('Successfully joined the team!');
  };

  const handleStartVideoCall = (team) => {
    setSelectedTeam(team);
    setShowVideoModal(true);
  };

  const copyInviteCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      success('Invite code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      success('Invite code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const filteredTeams = availableTeams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setTeamName('');
    setTeamDescription('');
    setIsCreating(false);
  };

  const handleCloseInviteModal = () => {
    setShowInviteModal(false);
    setInviteEmail('');
    setSelectedTeam(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Management</h1>
          <p className="mt-2 text-gray-400">Create teams, invite members, and collaborate</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Team
          </Button>
        </div>
      </div>

      {/* My Teams */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">My Teams ({myTeams.length})</h2>
        {myTeams.length === 0 ? (
          <Card className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No teams yet</h3>
            <p className="text-gray-400 mb-4">Create your first team to start collaborating</p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Team
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {myTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate">{team.name}</h3>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{team.description}</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-300 rounded-full border border-green-500/30 flex-shrink-0 ml-2">
                      {team.status}
                    </span>
                  </div>

                  {/* Members */}
                  <div className="mb-4 flex-1">
                    <h4 className="text-sm font-medium text-white mb-3">
                      Members ({team.members.length})
                    </h4>
                    <div className="space-y-2">
                      {team.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-medium text-white">{member.avatar}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-white truncate">{member.name}</p>
                              <p className="text-xs text-gray-400 truncate">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            {member.role === 'Leader' && <Crown className="h-4 w-4 text-yellow-500" />}
                            <span className="text-xs text-gray-400">{member.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <code className="px-2 py-1 text-xs bg-slate-700 rounded font-mono text-gray-300 truncate">
                        {team.inviteCode}
                      </code>
                      <button
                        onClick={() => copyInviteCode(team.inviteCode)}
                        className="p-1 hover:bg-slate-700 rounded transition-colors flex-shrink-0"
                        title="Copy invite code"
                      >
                        {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-gray-400" />}
                      </button>
                    </div>
                    <div className="flex space-x-2 flex-shrink-0 ml-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStartVideoCall(team)}
                        className="hidden sm:flex"
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Video
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTeam(team);
                          setShowInviteModal(true);
                        }}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Invite
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Available Teams */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <h2 className="text-xl font-semibold text-white">Available Teams</h2>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate">{team.name}</h3>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{team.description}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <span>Team Size</span>
                    <span>{team.members}/{team.maxMembers} members</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(team.members / team.maxMembers) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-4 flex-1">
                  <h4 className="text-sm font-medium text-white mb-2">Skills Needed</h4>
                  <div className="flex flex-wrap gap-2">
                    {team.skills.map((skill) => (
                      <span key={skill} className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-auto"
                  onClick={() => handleJoinTeam(team.id)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Request to Join
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Team Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        title="Create New Team"
        size="lg"
      >
        <div className="space-y-4">
          <InputField
            label="Team Name"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe your team's goals and project"
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={handleCloseCreateModal} disabled={isCreating}>
              Cancel
            </Button>
            <Button onClick={handleCreateTeam} loading={isCreating} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Team'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Invite Member Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={handleCloseInviteModal}
        title={`Invite Member to ${selectedTeam?.name}`}
      >
        <div className="space-y-4">
          <InputField
            label="Email Address"
            type="email"
            placeholder="member@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-300 mb-2">Invite Code</h4>
            <div className="flex items-center space-x-2">
              <code className="px-2 py-1 text-sm bg-slate-700 border border-slate-600 rounded font-mono text-gray-300 flex-1">
                {selectedTeam?.inviteCode}
              </code>
              <button
                onClick={() => copyInviteCode(selectedTeam?.inviteCode)}
                className="p-1 hover:bg-blue-500/20 rounded transition-colors"
              >
                <Copy className="h-4 w-4 text-blue-400" />
              </button>
            </div>
            <p className="text-xs text-blue-300 mt-2">
              Share this code with team members to join directly
            </p>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={handleCloseInviteModal}>
              Cancel
            </Button>
            <Button onClick={handleInviteMember}>
              Send Invitation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        teamName={selectedTeam?.name || "Team"}
      />
    </div>
  );
};

export default TeamManagement;