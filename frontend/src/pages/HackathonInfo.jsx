import React, { useState, useEffect } from 'react';
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
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import api from '../utils/axiosConfig';

const HackathonInfo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const location = useLocation();
  const hackathon = location.state?.hackathon;
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  // If no hackathon is passed, redirect back to dashboard
  useEffect(() => {
    if (!hackathon) {
      navigate('/dashboard');
    }
  }, [hackathon, navigate]);

  // Check if user is already registered for this hackathon
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!hackathon?._id || !user?._id) return;
      
      setIsCheckingRegistration(true);
      try {
        const response = await api.get(`/hackathons/${hackathon._id}/check-registration`);
        setIsAlreadyRegistered(response.data.isRegistered);
      } catch (err) {
        console.error('Failed to check registration status:', err);
        // If there's an error checking, we'll assume they're not registered
        setIsAlreadyRegistered(false);
      } finally {
        setIsCheckingRegistration(false);
      }
    };

    checkRegistrationStatus();
  }, [hackathon?._id, user?._id]);

  const handleJoinHackathon = () => {
    if (isAlreadyRegistered) {
      error("You've already registered for this hackathon.");
      return;
    }
    navigate('/join-hackathon', { state: { hackathon } });
  };

  if (!hackathon) return null;

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{hackathon.name}</h1>
          <p className="text-gray-400">{hackathon.description}</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
          <Button onClick={() => navigate(-1)} variant="outline">
            Back
          </Button>
          <Button 
            onClick={handleJoinHackathon}
            disabled={isCheckingRegistration || isAlreadyRegistered}
            loading={isCheckingRegistration}
          >
            {isCheckingRegistration ? 'Checking...' : 
             isAlreadyRegistered ? 'Already Registered' : 'Join Hackathon'}
          </Button>
        </div>
      </div>

      {/* Registration Status Alert */}
      {isAlreadyRegistered && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-blue-400" />
            <span className="text-blue-300 font-medium">You've already registered for this hackathon.</span>
          </div>
        </div>
      )}

      {/* Hackathon Info Card (styled like JoinHackathon) */}
      <Card className="p-6 mb-4">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>Max team size: {hackathon.maxTeamSize}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Trophy className="h-4 w-4" />
            <span>Prizes: {(hackathon.prizes || []).join(', ')}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-gray-300 mb-2"><b>Customer:</b> {hackathon.customerName || 'N/A'}</div>
            <div className="text-gray-300 mb-2"><b>Status:</b> {hackathon.status}</div>
            <div className="text-gray-300 mb-2"><b>Eligibility:</b> {
              hackathon.eligibility === 'both' ? 'Students and Professionals' :
              hackathon.eligibility === 'students' ? 'Students Only' :
              hackathon.eligibility === 'professionals' ? 'Professionals Only' :
              hackathon.eligibility
            }</div>
          </div>
          <div>
            <div className="text-gray-300 mb-2"><b>Registration Deadline:</b> {formatDate(hackathon.registrationDeadline)}</div>
            <div className="text-gray-300 mb-2"><b>Created At:</b> {formatDate(hackathon.createdAt)}</div>
          </div>
        </div>
      </Card>

      {/* Problem Statements */}
      {hackathon.problem_statements && hackathon.problem_statements.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Problem Statements</h2>
          <div className="space-y-4">
            {hackathon.problem_statements.map((ps, idx) => (
              <div key={idx} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <h3 className="text-lg font-semibold text-white mb-2">{ps.name}</h3>
                <p className="text-gray-300">{ps.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Levels/Timeline */}
      {hackathon.levels && hackathon.levels.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Levels / Timeline</h2>
          <div className="space-y-4">
            {hackathon.levels.map((level, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{level.name}</h3>
                </div>
                <div className="text-gray-300">Deadline: {formatDate(level.deadline)}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default HackathonInfo;