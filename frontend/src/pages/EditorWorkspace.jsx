import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
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
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const chatEndRef = useRef(null);
  const editorRef = useRef(null);
  const { success } = useToast();

  // File system state with more realistic content
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
        },
        { 
          name: 'utils', 
          type: 'folder', 
          expanded: false,
          children: [
            { name: 'api.js', type: 'file', hasErrors: false, language: 'javascript' },
            { name: 'helpers.js', type: 'file', hasErrors: false, language: 'javascript' }
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
    { name: 'README.md', type: 'file', hasErrors: false, language: 'markdown' },
    { name: 'vite.config.js', type: 'file', hasErrors: false, language: 'javascript' }
  ]);

  // File contents mapping
  const [fileContents, setFileContents] = useState({
    'App.jsx': `import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Welcome to HackCollab!');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Effect hook for component lifecycle
  useEffect(() => {
    console.log('App component mounted');
    fetchUserData();
    return () => console.log('App component unmounted');
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setCount(prevCount => prevCount + 1);
    setMessage(\Count updated to \${count + 1}!\);
    setIsLoading(false);
  };

  const handleReset = () => {
    setCount(0);
    setMessage('Counter reset!');
  };

  if (isLoading && !user) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <motion.div 
        className="app-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header user={user} />
        
        <div className="app-layout">
          <Sidebar />
          
          <main className="app-main">
            <Routes>
              <Route path="/" element={
                <section className="counter-section">
                  <h1 className="title">HackCollab Project</h1>
                  <p className="subtitle">{message}</p>
                  
                  <div className="counter-display">
                    <h2>Counter: {count}</h2>
                  </div>
                  
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
                      disabled={isLoading}
                    >
                      Reset
                    </button>
                  </div>
                  
                  {user && (
                    <div className="user-info">
                      <h3>Welcome, {user.name}!</h3>
                      <p>Email: {user.email}</p>
                    </div>
                  )}
                </section>
              } />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </motion.div>
    </Router>
  );
}

export default App;`,

    'index.css': `/* Modern CSS Reset */
*, *::before, *::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  font-family: 'Inter', system-ui, sans-serif;
  background-color: #0f172a;
  color: #f1f5f9;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

/* App Styles */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-layout {
  display: flex;
  flex: 1;
}

.app-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.counter-section {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 2rem;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.25rem;
  color: #94a3b8;
  margin-bottom: 2rem;
}

.counter-display {
  margin: 2rem 0;
  padding: 2rem;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 1rem;
  border: 1px solid #334155;
}

.counter-display h2 {
  font-size: 2rem;
  color: #f1f5f9;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background: #475569;
  color: white;
  border: 1px solid #64748b;
}

.btn-secondary:hover:not(:disabled) {
  background: #64748b;
  transform: translateY(-2px);
}

.user-info {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 0.75rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.user-info h3 {
  color: #60a5fa;
  margin-bottom: 0.5rem;
}

.user-info p {
  color: #94a3b8;
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .button-group {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 200px;
  }
}`,

    'package.json': `{
  "name": "hackathon-platform",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "framer-motion": "^11.3.19",
    "lucide-react": "^0.427.0",
    "react-resizable-panels": "^2.0.19",
    "@monaco-editor/react": "^4.6.0",
    "monaco-editor": "^0.44.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.9.1",
    "eslint-plugin-react": "^7.37.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.41",
    "tailwindcss": "^3.4.9",
    "vite": "^5.4.2"
  }
}`,

    'components/Header.jsx': `import React from 'react';
import { User, Bell, Settings } from 'lucide-react';

const Header = ({ user }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>HackCollab</h1>
        </div>
        
        <div className="header-actions">
          <button className="icon-btn">
            <Bell size={20} />
          </button>
          <button className="icon-btn">
            <Settings size={20} />
          </button>
          {user && (
            <div className="user-menu">
              <User size={20} />
              <span>{user.name}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;`,

    'components/Sidebar.jsx': `import React, { useState } from 'react';
import { Home, Users, Code, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Teams', path: '/teams' },
    { icon: Code, label: 'Projects', path: '/projects' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <aside className={\sidebar \${isCollapsed ? 'collapsed' : ''}\}>
      <div className="sidebar-header">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="collapse-btn"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <a 
              key={index}
              href={item.path}
              className="nav-item"
              title={isCollapsed ? item.label : ''}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </a>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;`,

    'README.md': `# HackCollab Platform

A modern hackathon collaboration platform built with React and Vite.

## Features

- 🚀 Real-time collaboration
- 👥 Team management
- 💻 Integrated code editor
- 🎯 Project submissions
- 🏆 Leaderboards

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

\\\`bash
# Clone the repository
git clone https://github.com/your-username/hackcollab.git

# Navigate to project directory
cd hackcollab

# Install dependencies
npm install

# Start development server
npm run dev
\\\`

### Available Scripts

- \npm run dev\ - Start development server
- \npm run build\ - Build for production
- \npm run preview\ - Preview production build
- \npm run lint\ - Run ESLint

## Tech Stack

- *Frontend*: React 18, Vite
- *Styling*: Tailwind CSS
- *Icons*: Lucide React
- *Animation*: Framer Motion
- *Editor*: Monaco Editor

## Project Structure

\\\`
src/
├── components/     # Reusable components
├── pages/         # Page components
├── contexts/      # React contexts
├── layouts/       # Layout components
├── utils/         # Utility functions
└── assets/        # Static assets
\\\`

## Contributing

1. Fork the repository
2. Create your feature branch (\git checkout -b feature/amazing-feature\)
3. Commit your changes (\git commit -m 'Add some amazing feature'\)
4. Push to the branch (\git push origin feature/amazing-feature\)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
`
  });

  // Open tabs with file contents
  const [openTabs, setOpenTabs] = useState([
    { name: 'App.jsx', hasErrors: false, language: 'javascript', modified: false },
    { name: 'index.css', hasErrors: false, language: 'css', modified: false },
    { name: 'components/Sidebar.jsx', hasErrors: true, language: 'javascript', modified: false }
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

  // Monaco Editor configuration
  const editorOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true,
    fontSize: fontSize,
    fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
    minimap: {
      enabled: true
    },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    theme: editorTheme,
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: false,
    folding: true,
    lineNumbers: 'on',
    glyphMargin: true,
    contextmenu: true,
    mouseWheelZoom: true,
    smoothScrolling: true,
    cursorBlinking: 'blink',
    renderWhitespace: 'selection',
    renderControlCharacters: false,
    fontLigatures: true,
    bracketPairColorization: {
      enabled: true
    },
    guides: {
      bracketPairs: true,
      indentation: true
    },
    suggest: {
      showKeywords: true,
      showSnippets: true,
      showClasses: true,
      showFunctions: true,
      showVariables: true
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure Monaco themes
    monaco.editor.defineTheme('hackcollab-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'regexp', foreground: 'D16969' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'class', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
        { token: 'constant', foreground: '4FC1FF' }
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editorLineNumber.foreground': '#858585',
        'editorLineNumber.activeForeground': '#c6c6c6',
        'editor.selectionBackground': '#264f78',
        'editor.selectionHighlightBackground': '#add6ff26',
        'editorCursor.foreground': '#aeafad',
        'editor.findMatchBackground': '#515c6a',
        'editor.findMatchHighlightBackground': '#ea5c0055',
        'editor.linkedEditingBackground': '#f00'
      }
    });

    // Set custom theme
    monaco.editor.setTheme('hackcollab-dark');

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSaveFile();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, () => {
      handleRunCode();
    });

    // Add auto-completion for React
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types']
    });

    // Add React snippets
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: (model, position) => {
        const suggestions = [
          {
            label: 'useState',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'React useState hook'
          },
          {
            label: 'useEffect',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'useEffect(() => {\n\t${1:// effect}\n\treturn () => {\n\t\t${2:// cleanup}\n\t};\n}, [${3:dependencies}]);',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'React useEffect hook'
          },
          {
            label: 'component',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'const ${1:ComponentName} = () => {\n\treturn (\n\t\t<div>\n\t\t\t${2:content}\n\t\t</div>\n\t);\n};\n\nexport default ${1:ComponentName};',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'React functional component'
          }
        ];
        return { suggestions };
      }
    });
  };

  const handleEditorChange = (value) => {
    // Update file content
    setFileContents(prev => ({
      ...prev,
      [activeTab]: value
    }));

    // Mark tab as modified
    setOpenTabs(prev => prev.map(tab => 
      tab.name === activeTab ? { ...tab, modified: true } : tab
    ));
  };

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
      
      // Initialize file content if not exists
      if (!fileContents[fileName]) {
        setFileContents(prev => ({
          ...prev,
          [fileName]: getDefaultContent(fileName, language)
        }));
      }
    }
    setActiveTab(fileName);
  };

  const getDefaultContent = (fileName, language) => {
    if (language === 'javascript' && fileName.endsWith('.jsx')) {
      return `import React from 'react';

const ${fileName.replace('.jsx', '')} = () => {
  return (
    <div>
      <h1>${fileName.replace('.jsx', '')} Component</h1>
    </div>
  );
};

export default ${fileName.replace('.jsx', '')};`;
    }
    if (language === 'css') {
      return `/* ${fileName} */

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}`;
    }
    if (language === 'json') {
      return `{
  "name": "example",
  "version": "1.0.0"
}`;
    }
    return // ${fileName}\n\n;
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

  const getMonacoLanguage = (language) => {
    switch (language) {
      case 'javascript': return 'javascript';
      case 'css': return 'css';
      case 'html': return 'html';
      case 'json': return 'json';
      case 'markdown': return 'markdown';
      default: return 'javascript';
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

                      {/* Monaco Editor */}
                      <div className="flex-1 overflow-hidden">
                        <Editor
                          height="100%"
                          language={getMonacoLanguage(openTabs.find(tab => tab.name === activeTab)?.language || 'javascript')}
                          value={fileContents[activeTab] || ''}
                          onChange={handleEditorChange}
                          onMount={handleEditorDidMount}
                          options={editorOptions}
                          theme="hackcollab-dark"
                        />
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
          <span>✓ Monaco Editor</span>
          <span>UTF-8</span>
          <span>LF</span>
          <span>{openTabs.find(tab => tab.name === activeTab)?.language || 'JavaScript'}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Ln 1, Col 1</span>
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