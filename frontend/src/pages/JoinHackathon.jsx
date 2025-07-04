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

const JoinHackathon = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { success, error } = useToast();
  
  // Get hackathon data from navigation state or use default
  const hackathonData = location.state?.hackathon || {
    name: 'AI Innovation Challenge',
    description: 'Build innovative AI solutions for everyday problems',
    startDate: '2024-01-14T00:00:00Z',
    endDate: '2024-01-16T23:59:59Z',
    registrationDeadline: '2024-01-13T23:59:59Z',
    eligibility: 'students', // 'students', 'professionals', 'both'
    maxTeamSize: 4,
    prizes: ['$10,000', '$5,000', '$2,500'],
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
    ]
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
        if (!selectedProblem) {
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
        if (hackathonData.eligibility === 'students' || hackathonData.eligibility === 'both') {
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

  const handleSubmit = () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      success(`Successfully registered for ${hackathonData.name}!`);
      navigate('/schedule');
      setIsSubmitting(false);
    }, 2000);
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

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Challenge</h2>
        <p className="text-gray-400">Select the problem statement you want to work on</p>
      </div>
      
      <div className="space-y-4">
        {hackathonData.problemStatements.map((problem) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: problem.id * 0.1 }}
            className={`p-6 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedProblem?.id === problem.id
                ? 'bg-blue-500/20 border-blue-500/50 shadow-lg'
                : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
            }`}
            onClick={() => setSelectedProblem(problem)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{problem.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-3">{problem.description}</p>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                    {problem.category}
                  </span>
                  {problem.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-slate-600 text-gray-300 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="ml-4">
                {selectedProblem?.id === problem.id ? (
                  <CheckCircle className="h-6 w-6 text-blue-400" />
                ) : (
                  <div className="h-6 w-6 border-2 border-gray-400 rounded-full"></div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

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
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Team Preference
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'individual', label: 'Work Alone', desc: 'Solo participation' },
            { value: 'team', label: 'Join a Team', desc: 'Work with others' },
            { value: 'either', label: 'Either', desc: 'Flexible preference' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleInputChange('teamPreference', option.value)}
              className={`p-4 rounded-lg border text-left transition-colors ${
                formData.teamPreference === option.value
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  : 'bg-slate-700 text-gray-300 border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-gray-400">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {hackathonData.eligibility === 'students' ? 'Education Details' :
           hackathonData.eligibility === 'professionals' ? 'Professional Details' :
           'Education & Professional Details'}
        </h2>
        <p className="text-gray-400">
          {hackathonData.eligibility === 'students' ? 'Tell us about your educational background' :
           hackathonData.eligibility === 'professionals' ? 'Tell us about your professional experience' :
           'Tell us about your background'}
        </p>
      </div>
      
      {(hackathonData.eligibility === 'students' || hackathonData.eligibility === 'both') && (
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
              required={hackathonData.eligibility !== 'professionals'}
            />
            <InputField
              label="Degree"
              placeholder="e.g., Bachelor's, Master's"
              value={formData.degree}
              onChange={(e) => handleInputChange('degree', e.target.value)}
              required={hackathonData.eligibility !== 'professionals'}
            />
            <InputField
              label="Major/Field of Study"
              placeholder="e.g., Computer Science"
              value={formData.major}
              onChange={(e) => handleInputChange('major', e.target.value)}
              required={hackathonData.eligibility !== 'professionals'}
            />
            <InputField
              label="Expected Graduation Year"
              placeholder="e.g., 2025"
              value={formData.graduationYear}
              onChange={(e) => handleInputChange('graduationYear', e.target.value)}
              required={hackathonData.eligibility !== 'professionals'}
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
              required={hackathonData.eligibility !== 'students'}
            />
            <InputField
              label="Position/Role"
              placeholder="e.g., Software Engineer"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              required={hackathonData.eligibility !== 'students'}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <InputField
              label="Years of Experience"
              placeholder="e.g., 3 years"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              required={hackathonData.eligibility !== 'students'}
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

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Review Your Registration</h2>
        <p className="text-gray-400">Please review your information before submitting</p>
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Selected Problem Statement</h3>
        <div className="bg-slate-700/50 p-4 rounded-lg">
          <h4 className="font-medium text-white">{selectedProblem?.title}</h4>
          <p className="text-gray-300 text-sm mt-1">{selectedProblem?.description}</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
              {selectedProblem?.category}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded border ${getDifficultyColor(selectedProblem?.difficulty)}`}>
              {selectedProblem?.difficulty}
            </span>
          </div>
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
            <span className="text-white ml-2 capitalize">{formData.teamPreference}</span>
          </div>
        </div>
      </Card>
      
      {(hackathonData.eligibility === 'students' || hackathonData.eligibility === 'both') && formData.institution && (
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
          </div>
        </Card>
      )}
    </div>
  );

  const totalSteps = 4;

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
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step <= currentStep
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
            <span>Review</span>
          </div>
        </div>

        {/* Form Content */}
        <Card className="p-8 mb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
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
              <Button variant="outline" onClick={() => navigate('/schedule')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Schedule
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