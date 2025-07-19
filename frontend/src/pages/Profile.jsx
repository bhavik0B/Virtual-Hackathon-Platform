import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Github, 
  Linkedin, 
  Globe, 
  Edit, 
  Save, 
  X,
  Trophy,
  Code2,
  Users,
  Star,
  Award,
  Target,
  Zap,
  Clock,
  TrendingUp,
  Camera,
  Settings,
  Shield
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Modal from '../components/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import api from '../utils/axiosConfig';

const Profile = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Profile data state
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user?._id) return;
      setLoading(true);
      try {
        const res = await api.get(`/users/${user._id}`);
        setProfileData(res.data);
      } catch (e) {
        error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  // Stats data (could be fetched or computed in future)
  let stats = [];
  if (loading || !profileData) {
    stats = [
      { label: 'Hackathons Won', value: 0, icon: Trophy, color: 'text-yellow-500' },
      { label: 'Projects Completed', value: 0, icon: Code2, color: 'text-green-500' },
      { label: 'Teams Joined', value: 0, icon: Users, color: 'text-blue-500' }
    ];
  } else {
    stats = [
      { label: 'Hackathons Won', value: profileData.hackathonsWon ?? 0, icon: Trophy, color: 'text-yellow-500' },
      { label: 'Projects Completed', value: profileData.projectsCompleted ?? 0, icon: Code2, color: 'text-green-500' },
      { label: 'Teams Joined', value: profileData.teamsJoined ?? 0, icon: Users, color: 'text-blue-500' }
    ];
  }

  // Recent activity
  const recentActivity = [
    { action: 'Won 1st place in AI Innovation Challenge', time: '2 days ago', type: 'achievement' },
    { action: 'Submitted project "Smart Task Manager"', time: '5 days ago', type: 'submission' },
    { action: 'Joined team "Code Warriors"', time: '1 week ago', type: 'team' },
    { action: 'Completed profile setup', time: '2 weeks ago', type: 'profile' }
  ];

  const handleSaveProfile = () => {
    // Simulate API call
    setTimeout(() => {
      success('Profile updated successfully!');
      setIsEditing(false);
    }, 1000);
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="mt-2 text-gray-400">Manage your account and preferences</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSaveProfile}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="h-24 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                {isEditing && (
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute bottom-3 right-0 p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-3">
                  <InputField
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-center"
                  />
                  <InputField
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    type="email"
                    className="text-center"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-white mb-1">{profileData.name}</h2>
                  <p className="text-gray-400 mb-4">{profileData.email}</p>
                </>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-300 text-sm">{profileData.bio}</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  {isEditing ? (
                    <InputField
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Location"
                      className="flex-1"
                    />
                  ) : (
                    <span className="text-gray-300 text-sm">{profileData.location}</span>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">
                    Joined {formatDate(profileData.createdAt)}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  {isEditing ? (
                    <InputField
                      value={profileData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="Website URL"
                      className="flex-1"
                    />
                  ) : (
                    <a 
                      href={profileData.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      {profileData.website}
                    </a>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <Github className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  {isEditing ? (
                    <InputField
                      value={profileData.github}
                      onChange={(e) => handleInputChange('github', e.target.value)}
                      placeholder="GitHub URL"
                      className="flex-1"
                    />
                  ) : (
                    <a 
                      href={profileData.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      GitHub Profile
                    </a>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <Linkedin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  {isEditing ? (
                    <InputField
                      value={profileData.linkedin}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      placeholder="LinkedIn URL"
                      className="flex-1"
                    />
                  ) : (
                    <a 
                      href={profileData.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded border border-blue-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.interests.map((interest, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded border border-blue-500/30"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 text-center">
                    <Icon className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Avatar Modal */}
      <Modal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        title="Change Avatar"
      >
        <div className="text-center">
          <div className="h-32 w-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-bold text-white">
              {profileData.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <p className="text-gray-400 mb-6">
            Avatar customization will be available in a future update. For now, your initials are used as your avatar.
          </p>
          <Button onClick={() => setShowAvatarModal(false)}>
            Got it
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;