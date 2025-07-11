import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { 
  Play, 
  Save, 
  Share2, 
  MessageSquare, 
  Send, 
  Users,
  Settings,
  FileText,
  Folder,
  ChevronDown,
  ChevronRight,
  Video,
  Plus,
  X,
  Download,
  Upload,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Circle,
  User,
  FolderOpen,
  Code,
  Terminal,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  GitBranch,
  Search,
  Filter,
  MoreHorizontal,
  Layers,
  Database,
  Globe,
  Cpu,
  Activity,
  Menu,
  Code2,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import Button from '../components/Button';
import VideoCallModal from '../components/VideoCallModal';
import { useToast } from '../contexts/ToastContext';

const EditorWorkspace = () => {
  const [showChatModal, setShowChatModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [message, setMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('App.jsx');
  const [copied, setCopied] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [terminalTab, setTerminalTab] = useState('terminal');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const chatEndRef = useRef(null);
  const { success } = useToast();

  // File system state
  const [fileTree, setFileTree] = useState([
    { 
      name: 'src', 
      type: 'folder', 
      expanded: true, 
      children: [
        { name: 'App.jsx', type: 'file', active: true, hasErrors: false, language: 'javascript' },
        { name: 'index.js', type: 'file', hasErrors: false, language: 'javascript' },
        { name: 'index.css', type: 'file', hasErrors: false, language: 'css' },
        { 
          name: 'components', 
          type: 'folder', 
          expanded: true,
          children: [
            { name: 'Header.jsx', type: 'file', hasErrors: false, language: 'javascript' },
            { name: 'Sidebar.jsx', type: 'file', hasErrors: true, language: 'javascript' },
            { name: 'Button.jsx', type: 'file', hasErrors: false, language: 'javascript' }
          ]
        },
        { 
          name: 'pages', 
          type: 'folder', 
          expanded: false,
          children: [
            { name: 'Dashboard.jsx', type: 'file', hasErrors: false, language: 'javascript' },
            { name: 'Profile.jsx', type: 'file', hasErrors: false, language: 'javascript' }
          ]
        }
      ]
    },
    { 
      name: 'public', 
      type: 'folder', 
      expanded: false,
      children: [
        { name: 'index.html', type: 'file', hasErrors: false, language: 'html' },
        { name: 'favicon.ico', type: 'file', hasErrors: false, language: 'image' }
      ]
    },
    { name: 'package.json', type: 'file', hasErrors: false, language: 'json' },
    { name: 'README.md', type: 'file', hasErrors: false, language: 'markdown' }
  ]);

  // Code content
  const [codeContent, setCodeContent] = useState(`import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Welcome to HackCollab!');
  const [isLoading, setIsLoading] = useState(false);

  // Effect hook for component lifecycle
  useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted');
  }, []);

  const handleIncrement = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setCount(prevCount => prevCount + 1);
    setIsLoading(false);
  };

  const handleReset = () => {
    setCount(0);
    setMessage('Counter reset!');
  };

  return (
    <motion.div 
      className="app-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="app-header">
        <h1 className="title">HackCollab Project</h1>
        <p className="subtitle">{message}</p>
      </header>
      
      <main className="app-main">
        <section className="counter-section">
          <h2>Counter: {count}</h2>
          <div className="button-group">
            <button 
              onClick={handleIncrement}
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? 'Loading...' : 'Increment'}
            </button>
            <button 
              onClick={handleReset}
              className="btn btn-secondary"
            >
              Reset
            </button>
          </div>
        </section>
      </main>
    </motion.div>
  );
}

export default App;`);

  // Open tabs
  const [openTabs, setOpenTabs] = useState([
    { name: 'App.jsx', hasErrors: false, language: 'javascript', modified: true },
    { name: 'index.css', hasErrors: false, language: 'css', modified: false },
    { name: 'Sidebar.jsx', hasErrors: true, language: 'javascript', modified: true }
  ]);

  // Chat messages
  const [chatMessages, setChatMessages] = useState([
    { 
      id: 1, 
      user: 'Sarah Chen', 
      message: 'Just pushed the latest changes to the header component! 🚀', 
      time: '2:30 PM', 
      avatar: 'SC',
      type: 'message',
      status: 'online'
    },
    { 
      id: 2, 
      user: 'Mike Rodriguez', 
      message: 'Great work! I\'m working on the API integration now.', 
      time: '2:35 PM', 
      avatar: 'MR',
      type: 'message',
      status: 'online'
    },
    { 
      id: 3, 
      user: 'System', 
      message: 'Sarah Chen started editing App.jsx', 
      time: '2:38 PM', 
      avatar: 'SYS',
      type: 'system'
    }
  ]);

  // Terminal output
  const [terminalOutput] = useState([
    { type: 'command', text: '$ npm run dev', time: '14:30:15' },
    { type: 'info', text: '> hackathon-platform@0.0.0 dev', time: '14:30:15' },
    { type: 'success', text: '  VITE v5.4.2  ready in 1.2s', time: '14:30:16' },
    { type: 'info', text: '  ➜  Local:   http://localhost:5173/', time: '14:30:16' },
    { type: 'success', text: '  ➜  press h + enter to show help', time: '14:30:16' }
  ]);

  // Problems
  const [problems] = useState([
    { type: 'error', file: 'src/components/Sidebar.jsx', line: 45, message: 'React Hook useEffect has a missing dependency', severity: 'error' },
    { type: 'warning', file: 'src/App.jsx', line: 23, message: 'Unused variable \'handleSubmit\'', severity: 'warning' }
  ]);

  // Team members
  const [teamMembers] = useState([
    { name: 'You', status: 'online', avatar: 'JD', activity: 'Editing App.jsx' },
    { name: 'Sarah Chen', status: 'online', avatar: 'SC', activity: 'Reviewing code' },
    { name: 'Mike Rodriguez', status: 'online', avatar: 'MR', activity: 'In terminal' }
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const toggleFolder = (path) => {
    const updateTree = (items) => {
      return items.map(item => {
        if (item.name === path && item.type === 'folder') {
          return { ...item, expanded: !item.expanded };
        }
        if (item.children) {
          return { ...item, children: updateTree(item.children) };
        }
        return item;
      });
    };
    setFileTree(updateTree(fileTree));
  };

  const openFile = (fileName, language = 'javascript', hasErrors = false) => {
    const existingTab = openTabs.find(tab => tab.name === fileName);
    if (!existingTab) {
      setOpenTabs(prev => [...prev, { name: fileName, hasErrors, language, modified: false }]);
    }
    setActiveTab(fileName);
  };

  const closeTab = (fileName) => {
    const newTabs = openTabs.filter(tab => tab.name !== fileName);
    setOpenTabs(newTabs);
    if (activeTab === fileName && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1].name);
    }
  };

  const handleSaveFile = () => {
    success(`${activeTab} saved successfully!`);
    setOpenTabs(prev => prev.map(tab => 
      tab.name === activeTab ? { ...tab, modified: false } : tab
    ));
  };

  const handleRunCode = () => {
    success('Code executed successfully!');
  };

  const copyShareLink = () => {
    const shareLink = 'https://hackcollab.dev/editor/abc123';
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      success('Share link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        user: 'You',
        message: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: 'JD',
        type: 'message',
        status: 'online'
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const renderFileTree = (items, level = 0) => {
    return items.map((item, index) => (
      <div key={index} style={{ paddingLeft: `${level * 12}px` }}>
        <div 
          className={`flex items-center py-1 px-2 text-sm cursor-pointer hover:bg-[#2a2d3a] transition-colors ${
            item.active ? 'bg-[#37373d] text-white' : 'text-[#cccccc]'
          }`}
          onClick={() => item.type === 'folder' ? toggleFolder(item.name) : openFile(item.name, item.language, item.hasErrors)}
        >
          {item.type === 'folder' && (
            <div className="mr-1">
              {item.expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </div>
          )}
          {item.type === 'folder' ? (
            item.expanded ? 
              <FolderOpen className="h-4 w-4 mr-2 text-[#dcb67a]" /> : 
              <Folder className="h-4 w-4 mr-2 text-[#dcb67a]" />
          ) : (
            <div className="flex items-center">
              <FileText className={`h-4 w-4 mr-2 ${getFileIconColor(item.language)}`} />
              {item.hasErrors && (
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1"></div>
              )}
            </div>
          )}
          <span className="truncate">{item.name}</span>
        </div>
        {item.children && item.expanded && (
          <div>
            {renderFileTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const getFileIconColor = (language) => {
    switch (language) {
      case 'javascript': return 'text-[#f1e05a]';
      case 'css': return 'text-[#563d7c]';
      case 'html': return 'text-[#e34c26]';
      case 'json': return 'text-[#89e051]';
      case 'markdown': return 'text-[#083fa1]';
      default: return 'text-[#cccccc]';
    }
  };

  const getLanguageColor = (language) => {
    switch (language) {
      case 'javascript': return 'text-[#f1e05a]';
      case 'css': return 'text-[#563d7c]';
      case 'html': return 'text-[#e34c26]';
      case 'json': return 'text-[#89e051]';
      case 'markdown': return 'text-[#083fa1]';
      default: return 'text-[#cccccc]';
    }
  };

  // VS Code-like layout
  return (
    <div className="w-full h-screen bg-[#1e1e1e] text-white flex flex-col overflow-hidden">
      {/* Top Menu Bar */}
      <div className="h-8 bg-[#323233] border-b border-[#2d2d30] flex items-center px-2 text-xs text-[#cccccc] flex-shrink-0">
        <div className="flex items-center space-x-4">
          <span className="font-medium">HackCollab IDE</span>
          <div className="flex items-center space-x-2">
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Terminal</span>
            <span>Help</span>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <button
            onClick={() => setShowChatModal(true)}
            className="px-2 py-1 hover:bg-[#2a2d3a] rounded text-xs flex items-center space-x-1"
          >
            <MessageSquare className="h-3 w-3" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setShowVideoModal(true)}
            className="px-2 py-1 hover:bg-[#2a2d3a] rounded text-xs flex items-center space-x-1"
          >
            <Video className="h-3 w-3" />
            <span>Video</span>
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-2 py-1 hover:bg-[#2a2d3a] rounded text-xs"
          >
            {isFullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-[#333333] border-r border-[#2d2d30] flex flex-col items-center py-2 space-y-4 flex-shrink-0">
          <button 
            className={`p-2 rounded hover:bg-[#2a2d3a] ${!sidebarCollapsed ? 'bg-[#37373d]' : ''}`}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <FolderOpen className="h-5 w-5" />
          </button>
          <button className="p-2 rounded hover:bg-[#2a2d3a]">
            <Search className="h-5 w-5" />
          </button>
          <button className="p-2 rounded hover:bg-[#2a2d3a]">
            <GitBranch className="h-5 w-5" />
          </button>
          <button className="p-2 rounded hover:bg-[#2a2d3a]">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Main Editor Layout */}
        <div className="flex-1 flex overflow-hidden">
          <PanelGroup direction="horizontal">
            {/* Sidebar */}
            {!sidebarCollapsed && (
              <>
                <Panel defaultSize={20} minSize={15} maxSize={40}>
                  <div className="bg-[#252526] border-r border-[#2d2d30] h-full">
                    {/* Sidebar Header */}
                    <div className="h-8 bg-[#2d2d30] border-b border-[#2d2d30] flex items-center px-3 text-xs font-medium text-[#cccccc]">
                      <span>EXPLORER</span>
                      <div className="ml-auto flex space-x-1">
                        <button className="p-1 hover:bg-[#2a2d3a] rounded">
                          <Plus className="h-3 w-3" />
                        </button>
                        <button className="p-1 hover:bg-[#2a2d3a] rounded">
                          <Search className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    
                    {/* File Tree */}
                    <div className="p-2 overflow-y-auto h-full">
                      <div className="text-xs font-medium text-[#cccccc] mb-2 px-2">HACKATHON-PLATFORM</div>
                      {renderFileTree(fileTree)}
                    </div>
                  </div>
                </Panel>
                <PanelResizeHandle />
              </>
            )}

            {/* Editor Area */}
            <Panel defaultSize={sidebarCollapsed ? 100 : 80}>
              <div className="flex flex-col bg-[#1e1e1e] overflow-hidden h-full">
                <PanelGroup direction="vertical">
                  {/* Code Editor */}
                  <Panel defaultSize={showTerminal ? 70 : 100}>
                    <div className="flex flex-col bg-[#1e1e1e] overflow-hidden h-full">
                      {/* Tab Bar */}
                      <div className="h-9 bg-[#2d2d30] border-b border-[#2d2d30] flex items-center overflow-x-auto flex-shrink-0">
                        {openTabs.map((tab) => (
                          <div
                            key={tab.name}
                            className={`flex items-center px-3 h-full border-r border-[#2d2d30] cursor-pointer min-w-0 group ${
                              activeTab === tab.name 
                                ? 'bg-[#1e1e1e] text-white' 
                                : 'bg-[#2d2d30] text-[#969696] hover:text-white'
                            }`}
                            onClick={() => setActiveTab(tab.name)}
                          >
                            <FileText className={`h-3 w-3 mr-2 ${getLanguageColor(tab.language)}`} />
                            <span className="text-xs truncate">{tab.name}</span>
                            {tab.modified && (
                              <div className="w-1.5 h-1.5 bg-white rounded-full ml-2"></div>
                            )}
                            {tab.hasErrors && (
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full ml-1"></div>
                            )}
                            {openTabs.length > 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeTab(tab.name);
                                }}
                                className="ml-2 p-0.5 rounded hover:bg-[#3e3e42] opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Editor Content */}
                      <div className="flex-1 flex overflow-hidden">
                        {/* Line Numbers */}
                        <div className="w-12 bg-[#1e1e1e] text-[#858585] text-xs font-mono flex flex-col items-end pr-2 pt-2 border-r border-[#2d2d30] flex-shrink-0">
                          {codeContent.split('\n').map((_, index) => (
                            <div key={index} className="h-5 leading-5">
                              {index + 1}
                            </div>
                          ))}
                        </div>
                        
                        {/* Code Area */}
                        <div className="flex-1 relative">
                          <textarea
                            value={codeContent}
                            onChange={(e) => setCodeContent(e.target.value)}
                            className="w-full h-full p-2 bg-[#1e1e1e] border-none outline-none resize-none text-[#d4d4d4] font-mono text-sm leading-5 selection:bg-[#264f78]"
                            style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}
                            spellCheck={false}
                            placeholder="Start typing your code..."
                          />
                        </div>
                      </div>
                    </div>
                  </Panel>

                  {/* Terminal Panel */}
                  {showTerminal && (
                    <>
                      <PanelResizeHandle />
                      <Panel defaultSize={30} minSize={20}>
                        <div className="bg-[#1e1e1e] border-t border-[#2d2d30] h-full">
                          {/* Terminal Header */}
                          <div className="h-8 bg-[#2d2d30] border-b border-[#2d2d30] flex items-center px-3 text-xs">
                            <div className="flex space-x-4">
                              {['TERMINAL', 'PROBLEMS', 'OUTPUT'].map((tab) => (
                                <button
                                  key={tab}
                                  onClick={() => setTerminalTab(tab.toLowerCase())}
                                  className={`px-2 py-1 rounded transition-colors ${
                                    terminalTab === tab.toLowerCase()
                                      ? 'bg-[#37373d] text-white'
                                      : 'text-[#cccccc] hover:text-white hover:bg-[#2a2d3a]'
                                  }`}
                                >
                                  {tab}
                                  {tab === 'PROBLEMS' && problems.length > 0 && (
                                    <span className="ml-1 px-1 py-0.5 text-xs bg-red-500 text-white rounded-full">
                                      {problems.length}
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                            <div className="ml-auto flex items-center space-x-2">
                              <button
                                onClick={() => setShowTerminal(false)}
                                className="p-1 rounded hover:bg-[#2a2d3a] transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          {/* Terminal Content */}
                          <div className="h-full overflow-y-auto p-2 font-mono text-sm">
                            {terminalTab === 'terminal' && (
                              <div className="space-y-1">
                                {terminalOutput.map((line, index) => (
                                  <div
                                    key={index}
                                    className={`${
                                      line.type === 'command' ? 'text-[#569cd6]' :
                                      line.type === 'error' ? 'text-[#f44747]' :
                                      line.type === 'success' ? 'text-[#4ec9b0]' :
                                      line.type === 'warning' ? 'text-[#dcdcaa]' :
                                      'text-[#d4d4d4]'
                                    }`}
                                  >
                                    {line.text}
                                  </div>
                                ))}
                                <div className="flex items-center text-[#569cd6]">
                                  <span>$ </span>
                                  <div className="w-2 h-4 bg-white ml-1 animate-pulse"></div>
                                </div>
                              </div>
                            )}

                            {terminalTab === 'problems' && (
                              <div className="space-y-2">
                                {problems.map((problem, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start space-x-3 p-2 rounded hover:bg-[#2a2d3a] transition-colors cursor-pointer"
                                  >
                                    <div className={`mt-1 ${
                                      problem.severity === 'error' ? 'text-[#f44747]' :
                                      problem.severity === 'warning' ? 'text-[#ffcc02]' :
                                      'text-[#75beff]'
                                    }`}>
                                      {problem.severity === 'error' ? <AlertTriangle className="h-4 w-4" /> :
                                       problem.severity === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                                       <Info className="h-4 w-4" />}
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-[#d4d4d4] text-sm">{problem.message}</p>
                                      <p className="text-[#969696] text-xs">
                                        {problem.file}:{problem.line}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {terminalTab === 'output' && (
                              <div className="space-y-1 text-[#d4d4d4]">
                                <div className="text-[#4ec9b0]">[Build] Starting development server...</div>
                                <div className="text-[#569cd6]">[Vite] Server running at http://localhost:5173</div>
                                <div className="text-[#4ec9b0]">[Build] ✓ Built in 1.2s</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Panel>
                    </>
                  )}
                </PanelGroup>
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] text-white text-xs flex items-center px-3 justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <span>✓ Prettier</span>
          <span>UTF-8</span>
          <span>LF</span>
          <span>JavaScript</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Ln 15, Col 23</span>
          <span>Spaces: 2</span>
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{teamMembers.filter(m => m.status === 'online').length} online</span>
          </div>
        </div>
      </div>

      {/* Terminal Toggle Button */}
      {!showTerminal && (
        <button
          onClick={() => setShowTerminal(true)}
          className="fixed bottom-4 right-4 p-3 bg-[#007acc] text-white rounded-full shadow-lg hover:bg-[#005a9e] transition-colors z-10"
        >
          <Terminal className="h-5 w-5" />
        </button>
      )}

      {/* Chat Modal */}
      <AnimatePresence>
        {showChatModal && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50"
              onClick={() => setShowChatModal(false)}
            />
            
            {/* Chat Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-[#252526] border-l border-[#2d2d30] flex flex-col shadow-2xl"
            >
              {/* Chat Header */}
              <div className="h-12 bg-[#2d2d30] border-b border-[#2d2d30] flex items-center justify-between px-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-[#007acc]" />
                  <h3 className="font-medium text-white text-sm">Team Chat</h3>
                  <span className="px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded border border-green-500/30">
                    {teamMembers.filter(m => m.status === 'online').length} online
                  </span>
                </div>
                <button
                  onClick={() => setShowChatModal(false)}
                  className="p-1 rounded hover:bg-[#3e3e42] transition-colors"
                >
                  <X className="h-4 w-4 text-[#cccccc]" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs ${msg.user === 'You' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-center space-x-2 mb-1 ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}>
                        {msg.user !== 'You' && (
                          <div className="h-4 w-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-white">{msg.avatar}</span>
                          </div>
                        )}
                        <span className="text-xs text-[#969696]">{msg.user}</span>
                        <span className="text-xs text-[#858585]">{msg.time}</span>
                      </div>
                      <div className={`p-2 rounded text-sm ${
                        msg.user === 'You' 
                          ? 'bg-[#007acc] text-white' 
                          : msg.type === 'system'
                          ? 'bg-[#3e3e42] text-[#cccccc] italic'
                          : 'bg-[#3e3e42] text-[#d4d4d4]'
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-[#2d2d30]">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-3 py-2 bg-[#3c3c3c] border border-[#464647] rounded text-white placeholder-[#969696] text-sm focus:outline-none focus:border-[#007acc]"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="px-3 py-2 bg-[#007acc] text-white rounded hover:bg-[#005a9e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        teamName="Code Warriors"
      />
    </div>
  );
};

export default EditorWorkspace;