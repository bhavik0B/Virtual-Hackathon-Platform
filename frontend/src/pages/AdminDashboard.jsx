import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  FileText, 
  Star,
  Eye,
  Edit,
  Download,
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  Plus,
  Trash2,
  Building,
  Calendar,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  X,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Settings,
  Code2,
  LogOut,
  Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('hackathons');
  const [showHackathonModal, setShowHackathonModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showQnaModal, setShowQnaModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCustomer, setFilterCustomer] = useState('all');
  const { success, error } = useToast();

  // Hackathon form data
  const [hackathonData, setHackathonData] = useState({
    name: '',
    description: '',
    customerId: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    maxTeamSize: 4,
    prizes: ['', '', ''],
    status: 'upcoming',
    eligibility: 'both',
    levels: []
  });

  // Customer form data
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    website: '',
    contactPerson: '',
    status: 'active'
  });

  // Mock data for customers
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'TechCorp Solutions',
      email: 'contact@techcorp.com',
      phone: '+1-555-0123',
      company: 'TechCorp Solutions Inc.',
      address: '123 Tech Street, Silicon Valley, CA',
      website: 'https://techcorp.com',
      contactPerson: 'John Smith',
      status: 'active',
      hackathonsCount: 5,
      createdAt: '2023-01-15'
    },
    {
      id: 2,
      name: 'InnovateLab',
      email: 'hello@innovatelab.io',
      phone: '+1-555-0456',
      company: 'InnovateLab Technologies',
      address: '456 Innovation Ave, Austin, TX',
      website: 'https://innovatelab.io',
      contactPerson: 'Sarah Johnson',
      status: 'active',
      hackathonsCount: 3,
      createdAt: '2023-03-20'
    },
    {
      id: 3,
      name: 'GreenTech Ventures',
      email: 'info@greentech.com',
      phone: '+1-555-0789',
      company: 'GreenTech Ventures LLC',
      address: '789 Eco Drive, Portland, OR',
      website: 'https://greentech.com',
      contactPerson: 'Mike Davis',
      status: 'inactive',
      hackathonsCount: 2,
      createdAt: '2023-06-10'
    }
  ]);

  // Mock data for hackathons
  const [hackathons, setHackathons] = useState([
    {
      id: 1,
      name: 'AI Innovation Challenge',
      description: 'Build innovative AI solutions for everyday problems',
      customer: 'TechCorp Solutions',
      customerId: 1,
      startDate: '2024-01-14T00:00:00Z',
      endDate: '2024-01-16T23:59:59Z',
      registrationDeadline: '2024-01-13T23:59:59Z',
      maxTeamSize: 4,
      prizes: ['$10,000', '$5,000', '$2,500'],
      status: 'active',
      eligibility: 'students',
      participants: 156,
      teams: 42,
      submissions: 28,
      levels: []
    },
    {
      id: 2,
      name: 'Green Tech Hackathon',
      description: 'Sustainable technology solutions for environmental challenges',
      customer: 'GreenTech Ventures',
      customerId: 3,
      startDate: '2024-01-22T00:00:00Z',
      endDate: '2024-01-24T23:59:59Z',
      registrationDeadline: '2024-01-21T23:59:59Z',
      maxTeamSize: 5,
      prizes: ['$15,000', '$8,000', '$3,000'],
      status: 'upcoming',
      eligibility: 'both',
      participants: 89,
      teams: 23,
      submissions: 0,
      levels: []
    },
    {
      id: 3,
      name: 'Fintech Solutions Challenge',
      description: 'Revolutionary financial technology innovations',
      customer: 'InnovateLab',
      customerId: 2,
      startDate: '2024-01-28T00:00:00Z',
      endDate: '2024-01-30T23:59:59Z',
      registrationDeadline: '2024-01-27T23:59:59Z',
      maxTeamSize: 3,
      prizes: ['$12,000', '$6,000', '$2,000'],
      status: 'upcoming',
      eligibility: 'professionals',
      participants: 67,
      teams: 18,
      submissions: 0,
      levels: []
    },
    {
      id: 4,
      name: 'Healthcare Innovation Summit',
      description: 'Digital health solutions for better patient care',
      customer: 'TechCorp Solutions',
      customerId: 1,
      startDate: '2024-01-05T00:00:00Z',
      endDate: '2024-01-07T23:59:59Z',
      registrationDeadline: '2024-01-04T23:59:59Z',
      maxTeamSize: 4,
      prizes: ['$8,000', '$4,000', '$1,500'],
      status: 'completed',
      eligibility: 'both',
      participants: 134,
      teams: 35,
      submissions: 32,
      levels: []
    }
  ]);

  // Mock data for Q&A
  const [qnaData, setQnaData] = useState([
    {
      id: 1,
      hackathonId: 1,
      hackathonName: 'AI Innovation Challenge',
      question: 'What are the specific AI frameworks we can use for this hackathon?',
      askedBy: 'Sarah Chen',
      askedAt: '2024-01-12T10:30:00Z',
      status: 'pending',
      reply: '',
      repliedAt: null,
      repliedBy: null
    },
    {
      id: 2,
      hackathonId: 1,
      hackathonName: 'AI Innovation Challenge',
      question: 'Is there any restriction on using pre-trained models?',
      askedBy: 'Mike Rodriguez',
      askedAt: '2024-01-12T14:15:00Z',
      status: 'answered',
      reply: 'You can use pre-trained models as long as you build significant functionality on top of them. The innovation should be in your application and implementation.',
      repliedAt: '2024-01-12T16:20:00Z',
      repliedBy: 'Admin User'
    },
    {
      id: 3,
      hackathonId: 2,
      hackathonName: 'Green Tech Hackathon',
      question: 'Are there any specific environmental impact metrics we need to include?',
      askedBy: 'Emma Davis',
      askedAt: '2024-01-11T09:45:00Z',
      status: 'pending',
      reply: '',
      repliedAt: null,
      repliedBy: null
    },
    {
      id: 4,
      hackathonId: 3,
      hackathonName: 'Fintech Solutions Challenge',
      question: 'Can we integrate with real banking APIs or should we use mock data?',
      askedBy: 'Alex Johnson',
      askedAt: '2024-01-10T16:30:00Z',
      status: 'answered',
      reply: 'For security reasons, please use mock data or sandbox APIs. We will provide a list of approved testing APIs for financial services.',
      repliedAt: '2024-01-11T08:15:00Z',
      repliedBy: 'Admin User'
    }
  ]);

  const stats = [
    { label: 'Total Hackathons', value: hackathons.length.toString(), icon: Trophy, color: 'bg-blue-500' },
    { label: 'Active Customers', value: customers.filter(c => c.status === 'active').length.toString(), icon: Building, color: 'bg-green-500' },
    { label: 'Pending Q&A', value: qnaData.filter(q => q.status === 'pending').length.toString(), icon: MessageSquare, color: 'bg-orange-500' },
    { label: 'Total Participants', value: hackathons.reduce((sum, h) => sum + h.participants, 0).toString(), icon: Users, color: 'bg-purple-500' }
  ];

  const tabs = [
    { id: 'hackathons', name: 'Hackathons', icon: Trophy },
    { id: 'customers', name: 'Customers', icon: Building },
    { id: 'qna', name: 'Q&A Management', icon: MessageSquare }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleInputChange = (field, value, dataType = 'hackathon') => {
    if (dataType === 'hackathon') {
      setHackathonData(prev => ({ ...prev, [field]: value }));
    } else {
      setCustomerData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveHackathon = () => {
    if (!hackathonData.name.trim()) {
      error('Hackathon name is required');
      return;
    }
    
    if (selectedItem) {
      // Update existing hackathon
      setHackathons(prev => prev.map(h => 
        h.id === selectedItem.id 
          ? { ...h, ...hackathonData, customer: customers.find(c => c.id === parseInt(hackathonData.customerId))?.name || '' }
          : h
      ));
      success('Hackathon updated successfully!');
    } else {
      // Create new hackathon
      const newHackathon = {
        id: Date.now(),
        ...hackathonData,
        customer: customers.find(c => c.id === parseInt(hackathonData.customerId))?.name || '',
        participants: 0,
        teams: 0,
        submissions: 0
      };
      setHackathons(prev => [newHackathon, ...prev]);
      success('Hackathon created successfully!');
    }
    
    setShowHackathonModal(false);
    setSelectedItem(null);
    resetHackathonForm();
  };

  const handleSaveCustomer = () => {
    if (!customerData.name.trim()) {
      error('Customer name is required');
      return;
    }
    
    if (selectedItem) {
      // Update existing customer
      setCustomers(prev => prev.map(c => 
        c.id === selectedItem.id ? { ...c, ...customerData } : c
      ));
      success('Customer updated successfully!');
    } else {
      // Create new customer
      const newCustomer = {
        id: Date.now(),
        ...customerData,
        hackathonsCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCustomers(prev => [newCustomer, ...prev]);
      success('Customer created successfully!');
    }
    
    setShowCustomerModal(false);
    setSelectedItem(null);
    resetCustomerForm();
  };

  const handleReplyToQuestion = (questionId, reply) => {
    setQnaData(prev => prev.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            reply, 
            status: 'answered', 
            repliedAt: new Date().toISOString(),
            repliedBy: 'Admin User'
          }
        : q
    ));
    success('Reply sent successfully!');
  };

  const handleDeleteHackathon = (id) => {
    setHackathons(prev => prev.filter(h => h.id !== id));
    success('Hackathon deleted successfully!');
  };

  const handleDeleteCustomer = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    success('Customer deleted successfully!');
  };

  const resetHackathonForm = () => {
    setHackathonData({
      name: '',
      description: '',
      customerId: '',
      startDate: '',
      endDate: '',
      registrationDeadline: '',
      maxTeamSize: 4,
      prizes: ['', '', ''],
      status: 'upcoming',
      eligibility: 'both',
      levels: []
    });
  };

  const resetCustomerForm = () => {
    setCustomerData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      website: '',
      contactPerson: '',
      status: 'active'
    });
  };

  const openEditModal = (item, type) => {
    setSelectedItem(item);
    if (type === 'hackathon') {
      setHackathonData({
        name: item.name,
        description: item.description,
        customerId: item.customerId.toString(),
        startDate: item.startDate.split('T')[0],
        endDate: item.endDate.split('T')[0],
        registrationDeadline: item.registrationDeadline.split('T')[0],
        maxTeamSize: item.maxTeamSize,
        prizes: item.prizes,
        status: item.status,
        eligibility: item.eligibility,
        levels: item.levels || []
      });
      setShowHackathonModal(true);
    } else {
      setCustomerData({
        name: item.name,
        email: item.email,
        phone: item.phone,
        company: item.company,
        address: item.address,
        website: item.website,
        contactPerson: item.contactPerson,
        status: item.status
      });
      setShowCustomerModal(true);
    }
  };

  const filteredHackathons = hackathons.filter(hackathon => {
    const matchesSearch = hackathon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hackathon.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || hackathon.status === filterStatus;
    const matchesCustomer = filterCustomer === 'all' || hackathon.customerId.toString() === filterCustomer;
    return matchesSearch && matchesStatus && matchesCustomer;
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredQnA = qnaData.filter(q =>
    q.hackathonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.askedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
      case 'completed':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'inactive':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'pending':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'answered':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Admin Header */}
      <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  HackCollab Admin
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-400">{user?.email || 'admin@hackcollab.com'}</p>
                </div>
              </div>
              
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="mt-2 text-gray-400">Manage hackathons, customers, and Q&A</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>
              
              {activeTab === 'hackathons' && (
                <>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                  </select>
                  
                  <select
                    value={filterCustomer}
                    onChange={(e) => setFilterCustomer(e.target.value)}
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  >
                    <option value="all">All Customers</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id.toString()}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>

            <div className="flex space-x-2">
              {activeTab === 'hackathons' && (
                <Button onClick={() => setShowHackathonModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Hackathon
                </Button>
              )}
              {activeTab === 'customers' && (
                <Button onClick={() => setShowCustomerModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
              )}
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'hackathons' && (
            <div className="space-y-4">
              {filteredHackathons.map((hackathon, index) => (
                <motion.div
                  key={hackathon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-slate-700 rounded-lg p-6 bg-slate-800/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{hackathon.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(hackathon.status)}`}>
                          {hackathon.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{hackathon.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                        <div>
                          <span className="font-medium text-gray-300">Customer:</span>
                          <p>{hackathon.customer}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-300">Participants:</span>
                          <p>{hackathon.participants}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-300">Teams:</span>
                          <p>{hackathon.teams}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-300">Submissions:</span>
                          <p>{hackathon.submissions}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(hackathon, 'hackathon')}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDeleteHackathon(hackathon.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700 text-xs text-gray-500">
                    <span>Start: {formatDate(hackathon.startDate)}</span>
                    <span>End: {formatDate(hackathon.endDate)}</span>
                    <span>Registration Deadline: {formatDate(hackathon.registrationDeadline)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCustomers.map((customer, index) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{customer.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(customer.status)}`}>
                            {customer.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{customer.company}</p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-300">{customer.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-300">{customer.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-300">{customer.contactPerson}</span>
                          </div>
                          {customer.website && (
                            <div className="flex items-center space-x-2">
                              <Globe className="h-4 w-4 text-gray-400" />
                              <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                                {customer.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => openEditModal(customer, 'customer')}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDeleteCustomer(customer.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700 text-sm">
                      <span className="text-gray-400">Hackathons: {customer.hackathonsCount}</span>
                      <span className="text-gray-400">Joined: {formatDate(customer.createdAt)}</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'qna' && (
            <div className="space-y-4">
              {filteredQnA.map((qna, index) => (
                <motion.div
                  key={qna.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-slate-700 rounded-lg p-6 bg-slate-800/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{qna.hackathonName}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(qna.status)}`}>
                          {qna.status}
                        </span>
                      </div>
                      <div className="bg-slate-700/50 p-4 rounded-lg mb-4">
                        <p className="text-gray-300 mb-2">{qna.question}</p>
                        <div className="flex items-center text-xs text-gray-400">
                          <User className="h-3 w-3 mr-1" />
                          <span>Asked by {qna.askedBy} on {formatDate(qna.askedAt)}</span>
                        </div>
                      </div>
                      
                      {qna.status === 'answered' && qna.reply && (
                        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                          <p className="text-blue-300 mb-2">{qna.reply}</p>
                          <div className="flex items-center text-xs text-blue-400">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            <span>Replied by {qna.repliedBy} on {formatDate(qna.repliedAt)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {qna.status === 'pending' && (
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setSelectedItem(qna);
                          setShowQnaModal(true);
                        }}
                      >
                        Reply
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hackathon Modal */}
      <Modal
        isOpen={showHackathonModal}
        onClose={() => {
          setShowHackathonModal(false);
          setSelectedItem(null);
          resetHackathonForm();
        }}
        title={selectedItem ? 'Edit Hackathon' : 'Add New Hackathon'}
        size="2xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Hackathon Name"
              placeholder="Enter hackathon name"
              value={hackathonData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Customer</label>
              <select
                value={hackathonData.customerId}
                onChange={(e) => handleInputChange('customerId', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              >
                <option value="">Select Customer</option>
                {customers.filter(c => c.status === 'active').map(customer => (
                  <option key={customer.id} value={customer.id.toString()}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              placeholder="Enter hackathon description"
              value={hackathonData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Start Date"
              type="date"
              value={hackathonData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              required
            />
            <InputField
              label="End Date"
              type="date"
              value={hackathonData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              required
            />
            <InputField
              label="Registration Deadline"
              type="date"
              value={hackathonData.registrationDeadline}
              onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Max Team Size"
              type="number"
              min="1"
              max="10"
              value={hackathonData.maxTeamSize}
              onChange={(e) => handleInputChange('maxTeamSize', parseInt(e.target.value))}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={hackathonData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              >
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Eligibility</label>
              <select
                value={hackathonData.eligibility}
                onChange={(e) => handleInputChange('eligibility', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              >
                <option value="students">Students Only</option>
                <option value="professionals">Professionals Only</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Prizes</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hackathonData.prizes.map((prize, index) => (
                <InputField
                  key={index}
                  placeholder={`${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : 'rd'} Prize`}
                  value={prize}
                  onChange={(e) => {
                    const newPrizes = [...hackathonData.prizes];
                    newPrizes[index] = e.target.value;
                    handleInputChange('prizes', newPrizes);
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Number of Levels</label>
            <InputField
              type="number"
              min="0"
              value={hackathonData.levels.length}
              onChange={e => {
                const num = parseInt(e.target.value) || 0;
                let newLevels = [...hackathonData.levels];
                if (num > newLevels.length) {
                  for (let i = newLevels.length; i < num; i++) {
                    newLevels.push({ name: '', deadline: '' });
                  }
                } else if (num < newLevels.length) {
                  newLevels = newLevels.slice(0, num);
                }
                handleInputChange('levels', newLevels);
              }}
            />
          </div>

          {hackathonData.levels.length > 0 && (
            <div className="space-y-2 mt-2">
              {hackathonData.levels.map((level, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <InputField
                    label={`Level ${idx + 1} Name`}
                    placeholder={`Enter name for level ${idx + 1}`}
                    value={level.name}
                    onChange={e => {
                      const newLevels = [...hackathonData.levels];
                      newLevels[idx].name = e.target.value;
                      handleInputChange('levels', newLevels);
                    }}
                  />
                  <InputField
                    label={`Level ${idx + 1} Deadline`}
                    type="date"
                    value={level.deadline}
                    onChange={e => {
                      const newLevels = [...hackathonData.levels];
                      newLevels[idx].deadline = e.target.value;
                      handleInputChange('levels', newLevels);
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => {
              setShowHackathonModal(false);
              setSelectedItem(null);
              resetHackathonForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveHackathon}>
              <Save className="mr-2 h-4 w-4" />
              {selectedItem ? 'Update' : 'Create'} Hackathon
            </Button>
          </div>
        </div>
      </Modal>

      {/* Customer Modal */}
      <Modal
        isOpen={showCustomerModal}
        onClose={() => {
          setShowCustomerModal(false);
          setSelectedItem(null);
          resetCustomerForm();
        }}
        title={selectedItem ? 'Edit Customer' : 'Add New Customer'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Customer Name"
              placeholder="Enter customer name"
              value={customerData.name}
              onChange={(e) => handleInputChange('name', e.target.value, 'customer')}
              required
            />
            <InputField
              label="Company"
              placeholder="Enter company name"
              value={customerData.company}
              onChange={(e) => handleInputChange('company', e.target.value, 'customer')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Email"
              type="email"
              placeholder="Enter email address"
              value={customerData.email}
              onChange={(e) => handleInputChange('email', e.target.value, 'customer')}
              required
            />
            <InputField
              label="Phone"
              placeholder="Enter phone number"
              value={customerData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value, 'customer')}
            />
          </div>

          <InputField
            label="Contact Person"
            placeholder="Enter contact person name"
            value={customerData.contactPerson}
            onChange={(e) => handleInputChange('contactPerson', e.target.value, 'customer')}
          />

          <InputField
            label="Website"
            placeholder="Enter website URL"
            value={customerData.website}
            onChange={(e) => handleInputChange('website', e.target.value, 'customer')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
            <textarea
              placeholder="Enter full address"
              value={customerData.address}
              onChange={(e) => handleInputChange('address', e.target.value, 'customer')}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={customerData.status}
              onChange={(e) => handleInputChange('status', e.target.value, 'customer')}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => {
              setShowCustomerModal(false);
              setSelectedItem(null);
              resetCustomerForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveCustomer}>
              <Save className="mr-2 h-4 w-4" />
              {selectedItem ? 'Update' : 'Create'} Customer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Q&A Reply Modal */}
      <Modal
        isOpen={showQnaModal}
        onClose={() => {
          setShowQnaModal(false);
          setSelectedItem(null);
        }}
        title="Reply to Question"
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h4 className="font-medium text-white mb-2">Question from {selectedItem.askedBy}</h4>
              <p className="text-gray-300 mb-2">{selectedItem.question}</p>
              <p className="text-xs text-gray-400">Asked on {formatDate(selectedItem.askedAt)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Reply</label>
              <textarea
                placeholder="Type your reply here..."
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                rows={4}
                id="reply-textarea"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => {
                setShowQnaModal(false);
                setSelectedItem(null);
              }}>
                Cancel
              </Button>
              <Button onClick={() => {
                const reply = document.getElementById('reply-textarea').value;
                if (reply.trim()) {
                  handleReplyToQuestion(selectedItem.id, reply);
                  setShowQnaModal(false);
                  setSelectedItem(null);
                } else {
                  error('Please enter a reply');
                }
              }}>
                <Send className="mr-2 h-4 w-4" />
                Send Reply
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;