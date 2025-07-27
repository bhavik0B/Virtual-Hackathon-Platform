import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    Users,
    Trophy,
    Search,
    ArrowLeft,
    Building,
    Target,
    Award,
    Star,
    Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axiosConfig';

const PastEvents = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterEligibility, setFilterEligibility] = useState('all');

    useEffect(() => {
        async function fetchHackathons() {
            setLoading(true);
            try {
                const res = await api.get('/hackathons');
                setHackathons(res.data.hackathons || []);
            } catch (e) {
                console.error('Failed to fetch hackathons:', e);
            } finally {
                setLoading(false);
            }
        }
        fetchHackathons();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'upcoming':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    const getEligibilityColor = (eligibility) => {
        switch (eligibility) {
            case 'students':
                return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            case 'professionals':
                return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
            case 'both':
                return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    const filteredHackathons = hackathons.filter(hackathon => {
        const matchesSearch = hackathon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hackathon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (hackathon.customerName && hackathon.customerName.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = filterStatus === 'all' || hackathon.status === filterStatus;
        const matchesEligibility = filterEligibility === 'all' || hackathon.eligibility === filterEligibility;

        // Only show upcoming and active hackathons
        const isCompleted = hackathon.status === 'past' || hackathon.status === 'completed';

        return matchesSearch && matchesStatus && matchesEligibility && isCompleted;
    });

    const sortedHackathons = filteredHackathons.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-gray-400 mt-4">Loading upcoming events...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center space-x-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to Dashboard</span>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Past Events</h1>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Trophy className="h-6 w-6 text-yellow-500" />
                        <span className="text-white font-medium">{sortedHackathons.length} Events</span>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search hackathons..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 w-64"
                            />
                        </div>
                
                        <select
                            value={filterEligibility}
                            onChange={(e) => setFilterEligibility(e.target.value)}
                            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                        >
                            <option value="all">All Eligibility</option>
                            <option value="students">Students Only</option>
                            <option value="professionals">Professionals Only</option>
                            <option value="both">Both</option>
                        </select>
                    </div>
                </div>

                {/* Hackathons Grid */}
                {sortedHackathons.length === 0 ? (
                    <div className="text-center py-20">
                        <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">No Past events found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {sortedHackathons.map((hackathon, index) => (
                            <motion.div
                                key={hackathon._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 hover:border-blue-500/30">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                                                {hackathon.name}
                                            </h3>
                                            <p className="text-sm text-gray-400 line-clamp-3 mb-3">
                                                {hackathon.description}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end space-y-2 ml-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(hackathon.status)}`}>
                                                {hackathon.status.charAt(0).toUpperCase() + hackathon.status.slice(1)}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getEligibilityColor(hackathon.eligibility)}`}>

                                                {hackathon.eligibility === 'both' ? 'Students and Professionals' :
                                                    hackathon.eligibility === 'students' ? 'Students Only' :
                                                        hackathon.eligibility === 'professionals' ? 'Professionals Only' :
                                                            hackathon.eligibility}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Hackathon Details */}
                                    <div className="space-y-3 mb-4">
                                        {hackathon.customerName && (
                                            <div className="flex items-center text-sm text-gray-400">
                                                <Building className="h-4 w-4 mr-2" />
                                                <span>{hackathon.customerName}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center text-sm text-gray-400">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <span>{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</span>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-400">
                                            <Clock className="h-4 w-4 mr-2" />
                                            <span>Registration Deadline: {formatDate(hackathon.registrationDeadline)}</span>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-400">
                                            <Users className="h-4 w-4 mr-2" />
                                            <span>Max Team Size: {hackathon.maxTeamSize}</span>
                                        </div>
                                    </div>

                                    {/* Prizes */}
                                    {hackathon.prizes && hackathon.prizes.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex items-center text-sm text-gray-400 mb-2">
                                                <Award className="h-4 w-4 mr-2" />
                                                <span>Prizes</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {hackathon.prizes.slice(0, 3).map((prize, idx) => (
                                                    <span key={idx} className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-300 rounded border border-yellow-500/30">
                                                        {prize}
                                                    </span>
                                                ))}
                                                {hackathon.prizes.length > 3 && (
                                                    <span className="px-2 py-1 text-xs bg-gray-500/20 text-gray-300 rounded border border-gray-500/30">
                                                        +{hackathon.prizes.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Problem Statements */}
                                    {hackathon.problem_statements && hackathon.problem_statements.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex items-center text-sm text-gray-400 mb-2">
                                                <Target className="h-4 w-4 mr-2" />
                                                <span>Problem Statements: {hackathon.problem_statements.length}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate('/hackathon-info', { state: { hackathon } })}
                                            className="flex items-center space-x-2"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span>View Details</span>
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PastEvents; 
