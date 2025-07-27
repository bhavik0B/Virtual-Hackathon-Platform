import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  GraduationCap,
  Briefcase,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Award,
  Code2,
  Target,
  Lightbulb
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axiosConfig';

const JoinHackathon = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { success, error } = useToast();
  const hackathonData = location.state?.hackathon || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTeam, setCreatedTeam] = useState(null);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Info
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',

    // Education Details (for students)
    institution: '',
    degree: '',
    major: '',
    graduationYear: '',
    studentId: '',

    // Professional Details (for working professionals)
    company: '',
    position: '',
    experience: '',
    skills: '',
    linkedinProfile: '',

    // Additional Info
    motivation: '',
    teamPreference: 'individual', // 'individual', 'team', 'either'
    previousHackathons: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!selectedProblemId) {
          error('Please select a problem statement');
          return false;
        }
        return true;
      case 2:
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim()) {
          error('Please fill in all required personal information');
          return false;
        }
        return true;
      case 3:
        if (hackathonData.eligibility === 'students') {
          if (!formData.institution.trim() || !formData.degree.trim() || !formData.major.trim() || !formData.graduationYear.trim()) {
            error('Please fill in all required education details');
            return false;
          }
        }
        if (hackathonData.eligibility === 'professionals' || hackathonData.eligibility === 'both') {
          if (!formData.company.trim() || !formData.position.trim() || !formData.experience.trim()) {
            error('Please fill in all required professional details');
            return false;
          }
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      // Call backend API to register for hackathon
      const registrationData = {
        hackathonId: hackathonData._id,
        userId: user._id,
        teamId: createdTeam?._id || null
      };

      console.log('=== FRONTEND REGISTRATION DATA ===');
      console.log('hackathonData:', hackathonData);
      console.log('user:', user);
      console.log('createdTeam:', createdTeam);
      console.log('registrationData being sent:', registrationData);

      await api.post('/hackathons/register', registrationData);
      
      success(`Successfully registered for ${hackathonData.name}!`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
      error(err.response?.data?.message || 'Failed to register for hackathon');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const renderStep1 = () => {
    const problems = hackathonData.problemStatements || hackathonData.problem_statements || [];
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Choose Your Challenge</h2>
          <p className="text-gray-400">Select the problem statement you want to work on</p>
        </div>
        <div className="space-y-4">
          {problems.map((problem, idx) => {
            const title = problem.title || problem.name;
            const pid = problem._id || problem.id || idx;
            const isSelected = selectedProblemId === pid;
            return (
              <motion.div
                key={pid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-lg border cursor-pointer transition-all duration-200 ${isSelected
                    ? 'bg-blue-500/20 border-blue-500/50 shadow-lg'
                    : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                  }`}
                onClick={() => setSelectedProblemId(pid)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{title}</h3>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{problem.description}</p>
                  </div>
                  <div className="ml-4">
                    {isSelected ? (
                      <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 border-2 border-blue-600">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </span>
                    ) : (
                      <span className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-gray-400">
                        <div className="h-5 w-5"></div>
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
        <p className="text-gray-400">Tell us about yourself</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="First Name"
          placeholder="Enter your first name"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          required
        />
        <InputField
          label="Last Name"
          placeholder="Enter your last name"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          required
        />
      </div>
      <InputField
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        required
      />
      <InputField
        label="Phone Number"
        type="tel"
        placeholder="Enter your phone number"
        value={formData.phone}
        onChange={(e) => handleInputChange('phone', e.target.value)}
        required
      />
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {hackathonData.eligibility === 'students' ? 'Education Details' : 'Professional Details'}
        </h2>
        <p className="text-gray-400">
          {hackathonData.eligibility === 'students' ? 'Tell us about your educational background' : 'Tell us about your professional experience'}
        </p>
      </div>

      {/* Show only education for students, only professional for professionals or both */}
      {hackathonData.eligibility === 'students' && (
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <GraduationCap className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Education Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Institution/University"
              placeholder="Enter your institution name"
              value={formData.institution}
              onChange={(e) => handleInputChange('institution', e.target.value)}
              required
            />
            <InputField
              label="Degree"
              placeholder="e.g., Bachelor's, Master's"
              value={formData.degree}
              onChange={(e) => handleInputChange('degree', e.target.value)}
              required
            />
            <InputField
              label="Major/Field of Study"
              placeholder="e.g., Computer Science"
              value={formData.major}
              onChange={(e) => handleInputChange('major', e.target.value)}
              required
            />
            <InputField
              label="Expected Graduation Year"
              placeholder="e.g., 2025"
              value={formData.graduationYear}
              onChange={(e) => handleInputChange('graduationYear', e.target.value)}
              required
            />
          </div>

          <InputField
            label="Student ID (Optional)"
            placeholder="Enter your student ID"
            value={formData.studentId}
            onChange={(e) => handleInputChange('studentId', e.target.value)}
            className="mt-4"
          />
        </Card>
      )}

      {(hackathonData.eligibility === 'professionals' || hackathonData.eligibility === 'both') && (
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Briefcase className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Professional Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Company/Organization"
              placeholder="Enter your company name"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              required
            />
            <InputField
              label="Position/Role"
              placeholder="e.g., Software Engineer"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <InputField
              label="Years of Experience"
              placeholder="e.g., 3 years"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              required
            />
            <InputField
              label="LinkedIn Profile (Optional)"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedinProfile}
              onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Key Skills
            </label>
            <textarea
              placeholder="List your key technical skills..."
              value={formData.skills}
              onChange={(e) => handleInputChange('skills', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              rows={3}
            />
          </div>
        </Card>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Why do you want to participate in this hackathon?
        </label>
        <textarea
          placeholder="Tell us about your motivation..."
          value={formData.motivation}
          onChange={(e) => handleInputChange('motivation', e.target.value)}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
          rows={4}
        />
      </div>
    </div>
  );

  // Team Preference Step (now step 4)
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState(5);
  const [skills, setSkills] = useState('');
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      error('Team name is required');
      return;
    }
    setIsCreatingTeam(true);
    try {
      const res = await api.post('/teams', {
        name: teamName.trim(),
        description: teamDescription.trim(),
        maxMembers,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      });
      
      success(`Team "${teamName}" created successfully!`);
      setShowCreateTeamModal(false);
      setTeamName('');
      setTeamDescription('');
      setMaxMembers(5);
      setSkills('');
      handleInputChange('teamPreference', 'individual');
      setCreatedTeam(res.data.team || {
        name: teamName.trim(),
        description: teamDescription.trim(),
        maxMembers,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      });
    } catch (e) {
      error(e.response?.data?.message || 'Failed to create team');
    } finally {
      setIsCreatingTeam(false);
    }
  };

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Team Setup</h2>
        <p className="text-gray-400">Choose how you want to participate in a team</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { value: 'individual', label: 'Create Team', desc: 'Start a new team as leader' },
          { value: 'team', label: 'Join Team', desc: 'Join an existing team' }
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => {
              if (option.value === 'individual') {
                setShowCreateTeamModal(true);
              } else {
                handleInputChange('teamPreference', option.value);
              }
            }}
            className={`p-4 rounded-lg border text-left transition-colors ${formData.teamPreference === option.value
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                : 'bg-slate-700 text-gray-300 border-slate-600 hover:border-slate-500'
              }`}
          >
            <div className="font-medium">{option.label}</div>
            <div className="text-sm text-gray-400">{option.desc}</div>
          </button>
        ))}
      </div>
      {/* Create Team Modal */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-slate-800 rounded-lg p-8 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setShowCreateTeamModal(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-white mb-4">Create New Team</h3>
            <form onSubmit={e => { e.preventDefault(); handleCreateTeam(); }}>
              <InputField
                label="Team Name"
                type="text"
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                required
              />
              <InputField
                label="Team Description"
                type="text"
                value={teamDescription}
                onChange={e => setTeamDescription(e.target.value)}
                required
              />
              <InputField
                label="Max Members"
                type="number"
                value={maxMembers}
                onChange={e => setMaxMembers(parseInt(e.target.value) || 5)}
                min="1"
                max="10"
                required
              />
              <InputField
                label="Skills (comma-separated)"
                type="text"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder="e.g., React, Node.js, MongoDB"
              />
              <div className="flex justify-end mt-6">
                <Button type="button" variant="outline" onClick={() => setShowCreateTeamModal(false)} className="mr-2">
                  Cancel
                </Button>
                <Button type="submit" loading={isCreatingTeam}>
                  {isCreatingTeam ? 'Creating...' : 'Create Team'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Show created team info below navigation */}
      {createdTeam && (
        <div className="mt-8">
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-blue-500/30">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">{createdTeam.name}</h3>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{createdTeam.description}</p>
              </div>
              <span className="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-300 rounded-full border border-green-500/30 flex-shrink-0 ml-2">
                {createdTeam.status || 'Active'}
              </span>
            </div>
            {/* Members (just the creator for now) */}
            <div className="mb-4 flex-1">
              <h4 className="text-sm font-medium text-white mb-3">Members (1)</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-white">{user?.name ? user.name.charAt(0) : 'U'}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{user?.name || 'You'}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <span className="text-xs text-gray-400">Leader</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Skills */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-white mb-3">Skills</h4>
              <div className="flex flex-wrap items-center gap-2">
                {(createdTeam.skills || []).length > 0 ? (
                  createdTeam.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="px-3 py-1 text-xs font-medium bg-slate-600 text-gray-300 rounded-full">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic">No specific skills required</span>
                )}
              </div>
            </div>
            {/* Invite Code */}
            {createdTeam.inviteCode && (
              <div className="flex items-center space-x-2 min-w-0 flex-1 mt-2">
                <code className="px-2 py-1 text-xs bg-slate-700 rounded font-mono text-gray-300 truncate">
                  {createdTeam.inviteCode}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(createdTeam.inviteCode);
                    setCopiedInvite(true);
                    setTimeout(() => setCopiedInvite(false), 1500);
                  }}
                  className="p-1 hover:bg-slate-700 rounded transition-colors"
                  title="Copy invite code"
                >
                  {copiedInvite ? (
                    <span className="text-green-400 text-xs">Copied!</span>
                  ) : (
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" /><rect x="3" y="3" width="13" height="13" rx="2" /></svg>
                  )}
                </button>
                <span className="text-xs text-gray-400">Invite Code</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Review Step (now step 5)
  const renderStep5 = () => {
    const problems = hackathonData.problemStatements || hackathonData.problem_statements || [];
    const selectedProblem = problems.find(
      (problem, idx) => (problem._id || problem.id || idx) === selectedProblemId
    );
    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Review Your Registration</h2>
          <p className="text-gray-400">Please review your information before submitting</p>
        </div>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Selected Problem Statement</h3>
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <h4 className="font-medium text-white">{selectedProblem?.title || selectedProblem?.name}</h4>
            <p className="text-gray-300 text-sm mt-1">{selectedProblem?.description}</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Name:</span>
              <span className="text-white ml-2">{formData.firstName} {formData.lastName}</span>
            </div>
            <div>
              <span className="text-gray-400">Email:</span>
              <span className="text-white ml-2">{formData.email}</span>
            </div>
            <div>
              <span className="text-gray-400">Phone:</span>
              <span className="text-white ml-2">{formData.phone}</span>
            </div>
            <div>
              <span className="text-gray-400">Team Preference:</span>
              <span className="text-white ml-2 capitalize">{formData.teamPreference === 'individual' ? 'Create Team' : 'Join Team'}</span>
            </div>
          </div>
        </Card>
        {(hackathonData.eligibility === 'students') && formData.institution && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Education Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Institution:</span>
                <span className="text-white ml-2">{formData.institution}</span>
              </div>
              <div>
                <span className="text-gray-400">Degree:</span>
                <span className="text-white ml-2">{formData.degree}</span>
              </div>
              <div>
                <span className="text-gray-400">Major:</span>
                <span className="text-white ml-2">{formData.major}</span>
              </div>
              <div>
                <span className="text-gray-400">Graduation Year:</span>
                <span className="text-white ml-2">{formData.graduationYear}</span>
              </div>
            </div>
          </Card>
        )}
        {(hackathonData.eligibility === 'professionals' || hackathonData.eligibility === 'both') && formData.company && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Company:</span>
                <span className="text-white ml-2">{formData.company}</span>
              </div>
              <div>
                <span className="text-gray-400">Position:</span>
                <span className="text-white ml-2">{formData.position}</span>
              </div>
              <div>
                <span className="text-gray-400">Experience:</span>
                <span className="text-white ml-2">{formData.experience}</span>
              </div>
              <div>
                <span className="text-gray-400">Skills:</span>
                <span className="text-white ml-2">{formData.skills}</span>
              </div>
            </div>
          </Card>
        )}
        {/* Team Info Card (if created) */}
        {createdTeam && (
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-blue-500/30">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">{createdTeam.name}</h3>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{createdTeam.description}</p>
              </div>
              <span className="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-300 rounded-full border border-green-500/30 flex-shrink-0 ml-2">
                {createdTeam.status || 'Active'}
              </span>
            </div>
            {/* Members (just the creator for now) */}
            <div className="mb-4 flex-1">
              <h4 className="text-sm font-medium text-white mb-3">Members (1)</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-white">{user?.name ? user.name.charAt(0) : 'U'}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{user?.name || 'You'}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <span className="text-xs text-gray-400">Leader</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Skills */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-white mb-3">Skills</h4>
              <div className="flex flex-wrap items-center gap-2">
                {(createdTeam.skills || []).length > 0 ? (
                  createdTeam.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="px-3 py-1 text-xs font-medium bg-slate-600 text-gray-300 rounded-full">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic">No specific skills required</span>
                )}
              </div>
            </div>
            {/* Invite Code */}
            {createdTeam.inviteCode && (
              <div className="flex items-center space-x-2 min-w-0 flex-1 mt-2">
                <code className="px-2 py-1 text-xs bg-slate-700 rounded font-mono text-gray-300 truncate">
                  {createdTeam.inviteCode}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(createdTeam.inviteCode);
                    setCopiedInvite(true);
                    setTimeout(() => setCopiedInvite(false), 1500);
                  }}
                  className="p-1 hover:bg-slate-700 rounded transition-colors"
                  title="Copy invite code"
                >
                  {copiedInvite ? (
                    <span className="text-green-400 text-xs">Copied!</span>
                  ) : (
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" /><rect x="3" y="3" width="13" height="13" rx="2" /></svg>
                  )}
                </button>
                <span className="text-xs text-gray-400">Invite Code</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const totalSteps = 5;

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Join {hackathonData.name}</h1>
          <p className="text-gray-400">{hackathonData.description}</p>

          {/* Hackathon Info */}
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(hackathonData.startDate)} - {formatDate(hackathonData.endDate)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>Max team size: {hackathonData.maxTeamSize}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Trophy className="h-4 w-4" />
              <span>Prizes: {hackathonData.prizes.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step <= currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-gray-400'
                  }`}
              >
                {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
              </div>
            ))}
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Problem</span>
            <span>Personal</span>
            <span>Details</span>
            <span>Team Preference</span>
            <span>Review</span>
          </div>
        </div>

        {/* Form Content */}
        <Card className="p-8 mb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <div>
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate('/hackathon-info', { state: { hackathon: hackathonData } })}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Hackathon Info
              </Button>
            )}
          </div>
          <div>
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} loading={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Complete Registration'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinHackathon;