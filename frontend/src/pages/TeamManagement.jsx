import React, { useState, useEffect } from 'react';
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
import api from '../utils/axiosConfig';

// Helper to normalize backend team.members to frontend format
function normalizeMembers(members) {
  return members.map((member) => {
    // member can be a populated user object or just an id
    const user = typeof member === 'object' ? member : { _id: member };
    return {
      id: user._id || user.id || member || Math.random(),
      name: user.name || user.firstName || 'Unknown',
      email: user.email || '',
      avatar: user.avatar || (user.name ? user.name.charAt(0) : 'U'),
      role: 'Member', // All members have the same role for now
    };
  });
}

const TeamManagement = () => {
  const { user, refreshAccessToken } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [skills, setSkills] = useState([]);
  const [maxMembers, setMaxMembers] = useState(5);
  const [status, setStatus] = useState('Active');
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { success, error } = useToast();

  // State for managing teams
  const [myTeams, setMyTeams] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);

  // Function to refresh teams list
  const refreshTeamsList = async () => {
    try {
      const res = await api.get('/teams');
      const allTeams = res.data.teams || [];
      
      // Separate teams: user's teams vs teams they can join
      const userTeams = allTeams.filter(team => 
        team.createdBy === user?._id || 
        team.members.some(member => 
          (typeof member === 'object' ? member._id : member) === user?._id
        )
      );
      
      const availableTeams = allTeams.filter(team => 
        team.createdBy !== user?._id && 
        !team.members.some(member => 
          (typeof member === 'object' ? member._id : member) === user?._id
        )
      );
      
      console.log('User teams:', userTeams.length);
      console.log('Available teams:', availableTeams.length);
      
      setMyTeams(userTeams);
      setAvailableTeams(availableTeams);
    } catch (e) {
      console.error('Refresh teams error:', e);
      error('Failed to refresh teams');
    }
  };

  // Fetch all teams on mount
  useEffect(() => {
    async function fetchTeams() {
      try {
        // Debug: Check authentication state
        console.log('TeamManagement: User from context:', user);
        console.log('TeamManagement: Access token exists:', !!localStorage.getItem('accessToken'));
        console.log('TeamManagement: Refresh token exists:', !!localStorage.getItem('refreshToken'));
        
        await refreshTeamsList();
      } catch (e) {
        console.error('Fetch teams error:', e);
        error('Failed to fetch teams');
      }
    }
    fetchTeams();
  }, [user]);

  // Create a new team
  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      error('Team name is required');
      return;
    }
    if (!user?._id) {
      error('User not authenticated. Please log in again.');
      return;
    }
    setIsCreating(true);
    try {
      const res = await api.post('/teams', {
        name: teamName.trim(),
        description: teamDescription.trim(),
        skills,
        maxMembers,
        status,
      });
      
      // Refresh the teams list to get updated data
      await refreshTeamsList();
      
      success(`Team "${teamName}" created successfully!`);
      setShowCreateModal(false);
      setTeamName('');
      setTeamDescription('');
    } catch (e) {
      error(e.response?.data?.message || 'Failed to create team');
    } finally {
      setIsCreating(false);
    }
  };



  // Join a team by teamId
  const handleJoinTeam = async (teamId) => {
    try {
      // Debug: Check if user is authenticated and token exists
      console.log('Joining team:', teamId);
      console.log('User:', user);
      console.log('Access token in localStorage:', !!localStorage.getItem('accessToken'));
      
      const res = await api.post('/teams/join', {
        teamId,
      });
      
      // Refresh the teams list to get updated data
      await refreshTeamsList();
      
      success('Successfully joined the team!');
    } catch (e) {
      console.error('Join team error:', e);
      console.error('Error response:', e.response?.data);
      console.error('Error status:', e.response?.status);
      
      // If it's a 401 error, try to refresh the token
      if (e.response?.status === 401) {
        console.log('401 error detected, attempting token refresh...');
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            console.log('Token refreshed, retrying join request...');
            // Retry the join request
            const retryRes = await api.post('/teams/join', { teamId });
            await refreshTeamsList();
            success('Successfully joined the team!');
            return;
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }
      
      // Handle specific error cases
      if (e.response?.data?.message === 'User already in team') {
        // User is already in the team, refresh the teams list
        console.log('User already in team, refreshing teams list...');
        await refreshTeamsList();
        success('You are already a member of this team!');
      } else {
        error(e.response?.data?.message || 'Failed to join team');
      }
    }
  };

  // Fetch live team members (when opening a team modal, etc.)
  const fetchTeamMembers = async (teamId) => {
    try {
      const res = await api.get(`/teams/${teamId}/members`);
      return res.data.members;
    } catch (e) {
      error('Failed to fetch team members');
      return [];
    }
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

  // Add a new function to handle viewing team details
  const handleViewTeamDetails = (team) => {
    // You can implement a modal to show team details
    console.log('Team details:', team);
    // For now, just show an alert with team info
    const details = `
Team: ${team.name}
Description: ${team.description}
Members: ${team.members.length}/${team.maxMembers}
Skills: ${team.skills.join(', ')}
Status: ${team.status}
Invite Code: ${team.inviteCode}
Created: ${new Date(team.createdAt).toLocaleDateString()}
  `;
    alert(details);
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
                    <span>{team.members.length}/{team.maxMembers} members</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(team.members.length / team.maxMembers) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-3">Skills</h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {team.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="px-3 py-1 text-xs font-medium bg-slate-600 text-gray-300 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleJoinTeam(team._id)}
                    className="flex-1"
                  >
                    <User className="h-4 w-4 mr-1" />
                    Join Team
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewTeamDetails(team)}
                    className="flex-1 ml-2"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        title="Create New Team"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleCreateTeam(); }}>
          <InputField
            label="Team Name"
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
          <InputField
            label="Team Description"
            type="text"
            value={teamDescription}
            onChange={(e) => setTeamDescription(e.target.value)}
            required
          />
          <InputField
            label="Max Members"
            type="number"
            value={maxMembers}
            onChange={(e) => setMaxMembers(parseInt(e.target.value) || 5)}
            min="1"
            max="10"
            required
          />
          <InputField
            label="Skills (comma-separated)"
            type="text"
            value={skills.join(', ')}
            onChange={(e) => setSkills(e.target.value.split(',').map(s => s.trim()))}
            placeholder="e.g., React, Node.js, MongoDB"
          />
          <Button type="submit" isLoading={isCreating}>
            Create Team
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={showInviteModal}
        onClose={handleCloseInviteModal}
        title="Invite Members"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleInviteMember(); }}>
          <InputField
            label="Email Address"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />
          <Button type="submit">Send Invitation</Button>
        </form>
      </Modal>

      <VideoCallModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        team={selectedTeam}
      />
    </div>
  );
};

export default TeamManagement;