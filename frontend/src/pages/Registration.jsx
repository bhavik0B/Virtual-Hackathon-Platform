import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Code2, 
  Github, 
  Linkedin, 
  Globe,
  MapPin,
  Calendar,
  CheckCircle,
  ArrowRight,
  Users,
  Trophy,
  Zap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import * as jwt_decode from 'jwt-decode';
import axios from 'axios';

const Registration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Profile Info
    bio: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    
    // Step 3: Skills & Interests
    skills: [],
    interests: [],
    experience: 'beginner',
    googleId: '',
  });

  const skillOptions = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java',
    'C++', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Flutter',
    'Vue.js', 'Angular', 'Django', 'Flask', 'Express.js', 'Spring',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'MongoDB',
    'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST APIs',
    'Machine Learning', 'AI', 'Data Science', 'Blockchain', 'DevOps'
  ];

  const interestOptions = [
    'Web Development', 'Mobile Development', 'AI/ML', 'Data Science',
    'Blockchain', 'IoT', 'Cybersecurity', 'Game Development',
    'AR/VR', 'Cloud Computing', 'DevOps', 'UI/UX Design',
    'Product Management', 'Startup', 'Open Source', 'Education'
  ];

  const features = [
    {
      icon: Users,
      title: 'Join Teams',
      description: 'Connect with like-minded developers'
    },
    {
      icon: Code2,
      title: 'Code Together',
      description: 'Real-time collaborative coding'
    },
    {
      icon: Trophy,
      title: 'Win Prizes',
      description: 'Compete in exciting hackathons'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.firstName.trim()) {
          error('First name is required');
          return false;
        }
        if (!formData.lastName.trim()) {
          error('Last name is required');
          return false;
        }
        if (!formData.email.trim()) {
          error('Email is required');
          return false;
        }
        if (!formData.password) {
          error('Password is required');
          return false;
        }
        if (formData.password.length < 6) {
          error('Password must be at least 6 characters');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          error('Passwords do not match');
          return false;
        }
        return true;
      case 2:
        // Optional step, always valid
        return true;
      case 3:
        if (formData.skills.length === 0) {
          error('Please select at least one skill');
          return false;
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
    setIsLoading(true);

    try {
      console.log('Submitting registration:', formData);
      const res = await axios.post('http://localhost:5000/api/users/register', {
        googleId: formData.googleId,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        password: formData.password,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        github: formData.github,
        linkedin: formData.linkedin,
        skills: formData.skills,
        interests: formData.interests,
        experience: formData.experience,
      });
      console.log('Registration response:', res);

      if (res.status === 201) {
        login(res.data.user);
        success('Registration successful! Welcome to HackCollab!');
        
        // Check if user is admin and redirect accordingly
        if (res.data.user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        error(res.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      try {
        const decoded = jwt_decode.default(token);
        setFormData(prev => ({
          ...prev,
          email: decoded.email || '',
          firstName: decoded.name ? decoded.name.split(' ')[0] : '',
          lastName: decoded.name ? decoded.name.split(' ').slice(1).join(' ') : '',
          googleId: decoded.googleId || '',
        }));
      } catch (err) {
        // handle error
      }
    }
  }, []);

  const renderStep1 = () => (
    <div className="space-y-4">
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
      
      <div className="relative">
        <InputField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-gray-400 hover:text-white"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      
      <div className="relative">
        <InputField
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-9 text-gray-400 hover:text-white"
        >
          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Bio (Optional)
        </label>
        <textarea
          placeholder="Tell us about yourself..."
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
          rows={4}
        />
      </div>
      
      <InputField
        label="Location (Optional)"
        placeholder="e.g., San Francisco, CA"
        value={formData.location}
        onChange={(e) => handleInputChange('location', e.target.value)}
      />
      
      <InputField
        label="Website (Optional)"
        placeholder="https://yourwebsite.com"
        value={formData.website}
        onChange={(e) => handleInputChange('website', e.target.value)}
      />
      
      <InputField
        label="GitHub Profile (Optional)"
        placeholder="https://github.com/username"
        value={formData.github}
        onChange={(e) => handleInputChange('github', e.target.value)}
      />
      
      <InputField
        label="LinkedIn Profile (Optional)"
        placeholder="https://linkedin.com/in/username"
        value={formData.linkedin}
        onChange={(e) => handleInputChange('linkedin', e.target.value)}
      />
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Skills <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          {skillOptions.map((skill) => (
            <button
              key={skill}
              onClick={() => handleSkillToggle(skill)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                formData.skills.includes(skill)
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  : 'bg-slate-700 text-gray-300 border-slate-600 hover:border-slate-500'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Selected: {formData.skills.length} skills
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Interests (Optional)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {interestOptions.map((interest) => (
            <button
              key={interest}
              onClick={() => handleInterestToggle(interest)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                formData.interests.includes(interest)
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : 'bg-slate-700 text-gray-300 border-slate-600 hover:border-slate-500'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Experience Level
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'beginner', label: 'Beginner', desc: '0-2 years' },
            { value: 'intermediate', label: 'Intermediate', desc: '2-5 years' },
            { value: 'expert', label: 'Expert', desc: '5+ years' }
          ].map((level) => (
            <button
              key={level.value}
              onClick={() => handleInputChange('experience', level.value)}
              className={`p-4 rounded-lg border text-left transition-colors ${
                formData.experience === level.value
                  ? 'bg-green-500/20 text-green-300 border-green-500/30'
                  : 'bg-slate-700 text-gray-300 border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className="font-medium">{level.label}</div>
              <div className="text-sm text-gray-400">{level.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">HackCollab</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create Your Account</h1>
            <p className="text-gray-400">Join the community of innovative developers</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((step) => (
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
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Basic Info</span>
              <span>Profile</span>
              <span>Skills</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="mb-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
            </div>
            <div className="flex space-x-3">
              {currentStep < 3 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} loading={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Complete Registration'}
                </Button>
              )}
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/auth" className="text-blue-400 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6">Join the Future of Collaboration</h2>
          <p className="text-blue-100 mb-8">
            Connect with developers worldwide, participate in exciting hackathons, and build amazing projects together.
          </p>
          
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-blue-100 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Registration;