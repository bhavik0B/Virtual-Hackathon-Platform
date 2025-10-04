import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import {  
  MessageSquare, 
  Send, 
  Users,
  Settings,
  FileText,
  Folder,
  ChevronDown,
  ChevronRight,
  Video,
  X,
  Check,
  Maximize2,
  Minimize2,
  FolderOpen,
  Terminal,
  AlertTriangle,
  CheckCircle,
  Info,
  GitBranch,
  Search,
} from 'lucide-react';
import VideoCallModal from '../components/VideoCallModal';
import { useToast } from '../contexts/ToastContext';
import { io } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axiosConfig';

const EditorWorkspace = () => {
  const [showChatModal, setShowChatModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [message, setMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [terminalTab, setTerminalTab] = useState('terminal');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [clipboard, setClipboard] = useState(null);
  const [renamingItem, setRenamingItem] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeoutRef = useRef(null);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  
  const chatEndRef = useRef(null);
  const editorRef = useRef(null);
  const newFileInputRef = useRef(null);
  const newFolderInputRef = useRef(null);
  const renameInputRef = useRef(null);
  const { success, error } = useToast();
  const socketRef = useRef();
  const { user } = useAuth();

  // File system state - starts empty, populated from server
  const [fileTree, setFileTree] = useState([]);

  // File contents mapping - starts empty, populated from server
  const [fileContents, setFileContents] = useState({});

  // Open tabs - starts empty, populated when files are opened
  const [openTabs, setOpenTabs] = useState([]);

  // Chat messages
  const [chatMessages, setChatMessages] = useState([]);

  // Terminal output - starts empty, populated with real terminal data
  const [terminalOutput, setTerminalOutput] = useState([]);

  // Problems - starts empty, populated from linter/compiler
  const [problems, setProblems] = useState([]);

  // Team members - starts empty, populated from current team
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    // Connect to Socket.IO server
    socketRef.current = io('http://localhost:5000');

    // Listen for incoming chat messages
    socketRef.current.on('chat message', (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    // Typing events
    socketRef.current.on('typing', (userData) => {
      setTypingUsers((prev) => {
        if (!prev.find(user => user.userId === userData.userId)) {
          return [...prev, userData];
        }
        return prev;
      });
    });

    socketRef.current.on('stop typing', (userData) => {
      setTypingUsers((prev) => prev.filter(user => user.userId !== userData.userId));
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  useEffect(() => {
    if (renamingItem) {
      setTimeout(() => renameInputRef.current?.select(), 100);
    }
  }, [renamingItem]);

  useEffect(() => {
    // Load user's teams when component mounts
    if (user) {
      loadUserTeams();
    }
  }, [user]);

  // Load team files from server
  const loadTeamFiles = async (teamId) => {
    try {
      const response = await api.get(`/files/team/${teamId}/files`);
      const files = response.data.files || [];
      
      // Convert flat file list to tree structure
      const tree = buildFileTree(files);
      setFileTree(tree);
      
      // Load team members
      await loadTeamMembers(teamId);
    } catch (err) {
      console.error('Load team files error:', err);
      error(err.response?.data?.message || 'Failed to load team files');
    }
  };

  // Load team members
  const loadTeamMembers = async (teamId) => {
    try {
      const response = await api.get(`/teams/${teamId}/members`);
      const members = response.data.members || [];
      
      // Transform team members data for display
      const formattedMembers = members.map(member => ({
        name: member.name || member.email || 'Unknown',
        status: 'online', // This would be real-time in a full implementation
        avatar: (member.name || member.email || 'U').charAt(0).toUpperCase(),
        activity: 'Active',
        _id: member._id || member.id
      }));
      
      setTeamMembers(formattedMembers);
    } catch (err) {
      console.error('Load team members error:', err);
      // Don't show error for members loading failure
    }
  };

  // Convert flat file list to tree structure
  const buildFileTree = (files) => {
    const tree = [];
    const pathMap = {};

    files.forEach(file => {
      const parts = file.name.split('/');
      let currentPath = '';
      
      parts.forEach((part, index) => {
        const path = currentPath ? `${currentPath}/${part}` : part;
        
        if (!pathMap[path]) {
          const item = {
            name: part,
            type: index === parts.length - 1 ? 'file' : 'folder',
            expanded: true,
            hasErrors: false,
            language: index === parts.length - 1 ? getLanguageFromFile(part) : null,
            children: index === parts.length - 1 ? undefined : []
          };
          
          pathMap[path] = item;
          
          if (currentPath === '') {
            tree.push(item);
          } else {
            const parent = pathMap[currentPath];
            if (parent && parent.children) {
              parent.children.push(item);
            }
          }
        }
        
        currentPath = path;
      });
    });

    return tree;
  };

  // Set current team (called from parent component or team selection)
  const setTeam = (team) => {
    setCurrentTeam(team);
    if (team) {
      loadTeamFiles(team._id);
    }
  };

  // Load user's teams
  const loadUserTeams = async () => {
    try {
      const response = await api.get('/teams');
      const allTeams = response.data.teams || [];
      
      // Filter teams where user is a member
      const userTeams = allTeams.filter(team => 
        team.createdBy === user?._id || 
        team.members.some(member => 
          (typeof member === 'object' ? member._id : member) === user?._id
        )
      );
      
      setAvailableTeams(userTeams);
    } catch (err) {
      console.error('Load teams error:', err);
      error('Failed to load teams');
    }
  };

  // Select team and load its files
  const selectTeam = async (team) => {
    setCurrentTeam(team);
    setShowTeamSelector(false);
    await loadTeamFiles(team._id);
    
    // Add welcome message to terminal
    setTerminalOutput([
      { type: 'info', text: `Connected to team: ${team.name}`, time: new Date().toLocaleTimeString() },
      { type: 'success', text: 'Ready for collaborative coding!', time: new Date().toLocaleTimeString() },
      { type: 'info', text: 'Files loaded from server', time: new Date().toLocaleTimeString() }
    ]);
    
    success(`Switched to team: ${team.name}`);
  };

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

    // Auto-save to server if team is selected (debounced)
    if (currentTeam && activeTab) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = setTimeout(() => {
        autoSaveFile(activeTab, value);
      }, 1000); // Auto-save after 1 second of inactivity
    }
  };

  const autoSaveTimeoutRef = useRef(null);

  const autoSaveFile = async (fileName, content) => {
    if (!currentTeam || !fileName || !content) return;
    
    try {
      await api.post('/files/save', {
        teamId: currentTeam._id,
        fileName: fileName,
        content: content
      });
      
      // Update tab to show it's saved
      setOpenTabs(prev => prev.map(tab => 
        tab.name === fileName ? { ...tab, modified: false } : tab
      ));
    } catch (err) {
      console.error('Auto-save error:', err);
      // Don't show error toast for auto-save failures to avoid spam
    }
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

  const selectFolder = (folderPath) => {
    setSelectedFolder(folderPath);
  };

  const handleContextMenu = (e, item, fullPath) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
      fullPath
    });
  };

  const getFullPath = (items, targetName, currentPath = '') => {
    for (const item of items) {
      const path = currentPath ? `${currentPath}/${item.name}` : item.name;
      if (item.name === targetName) {
        return path;
      }
      if (item.children) {
        const found = getFullPath(item.children, targetName, path);
        if (found) return found;
      }
    }
    return null;
  };

  const findItemByPath = (items, path) => {
    const parts = path.split('/');
    let current = items;

    for (let i = 0; i < parts.length; i++) {
      const item = current.find(item => item.name === parts[i]);
      if (!item) return null;
      if (i === parts.length - 1) return item;
      if (item.children) {
        current = item.children;
      } else {
        return null;
      }
    }
    return null;
  };

  const removeItemByPath = (items, path) => {
    const parts = path.split('/');
    if (parts.length === 1) {
      return items.filter(item => item.name !== parts[0]);
    }

    return items.map(item => {
      if (item.name === parts[0] && item.children) {
        return {
          ...item,
          children: removeItemByPath(item.children, parts.slice(1).join('/'))
        };
      }
      return item;
    });
  };

  const addItemToPath = (items, targetPath, newItem) => {
    if (!targetPath) {
      return [...items, newItem];
    }

    const parts = targetPath.split('/');
    return items.map(item => {
      if (item.name === parts[0]) {
        if (parts.length === 1) {
          return {
            ...item,
            children: [...(item.children || []), newItem],
            expanded: true
          };
        }
        if (item.children) {
          return {
            ...item,
            children: addItemToPath(item.children, parts.slice(1).join('/'), newItem)
          };
        }
      }
      return item;
    });
  };

  const renameItemByPath = (items, path, newName) => {
    const parts = path.split('/');
    if (parts.length === 1) {
      return items.map(item =>
        item.name === parts[0] ? { ...item, name: newName } : item
      );
    }

    return items.map(item => {
      if (item.name === parts[0] && item.children) {
        return {
          ...item,
          children: renameItemByPath(item.children, parts.slice(1).join('/'), newName)
        };
      }
      return item;
    });
  };

  const handleRename = (item, fullPath) => {
    setRenamingItem({ item, fullPath });
    setRenameValue(item.name);
    setContextMenu(null);
  };

  const handleRenameConfirm = async () => {
    if (!renameValue.trim() || !renamingItem) return;

    const oldPath = renamingItem.fullPath;
    const pathParts = oldPath.split('/');
    pathParts[pathParts.length - 1] = renameValue;
    const newPath = pathParts.join('/');

    // Handle server-side rename for files
    if (currentTeam && renamingItem.item.type === 'file') {
      try {
        // Get the old file content
        const oldContent = fileContents[oldPath];
        if (oldContent) {
          // Save the content to the new file name
          await api.post('/files/save', {
            teamId: currentTeam._id,
            fileName: newPath,
            content: oldContent
          });
          
          // Delete the old file
          await api.delete(`/files/team/${currentTeam._id}/file/${oldPath}`);
        }
      } catch (err) {
        console.error('Rename file error:', err);
        error(err.response?.data?.message || 'Failed to rename file');
        setRenamingItem(null);
        setRenameValue('');
        return;
      }
    }

    setFileTree(renameItemByPath(fileTree, oldPath, renameValue));

    if (renamingItem.item.type === 'file') {
      const oldContent = fileContents[oldPath];
      if (oldContent) {
        const newContents = { ...fileContents };
        delete newContents[oldPath];
        newContents[newPath] = oldContent;
        setFileContents(newContents);
      }

      setOpenTabs(prev => prev.map(tab =>
        tab.name === oldPath ? { ...tab, name: newPath } : tab
      ));

      if (activeTab === oldPath) {
        setActiveTab(newPath);
      }
    }

    success(`Renamed to ${renameValue}`);
    setRenamingItem(null);
    setRenameValue('');
  };

  const handleCut = (item, fullPath) => {
    setClipboard({ item, fullPath, operation: 'cut' });
    setContextMenu(null);
    success(`Cut ${item.name}`);
  };

  const handleCopy = (item, fullPath) => {
    setClipboard({ item, fullPath, operation: 'copy' });
    setContextMenu(null);
    success(`Copied ${item.name}`);
  };

  const duplicateItem = (item) => {
    if (item.children) {
      return {
        ...item,
        children: item.children.map(child => duplicateItem(child))
      };
    }
    return { ...item };
  };

  const handlePaste = async (targetFolder, targetPath) => {
    if (!clipboard) return;

    const { item, fullPath, operation } = clipboard;

    if (operation === 'cut') {
      // Handle server-side move for files
      if (currentTeam && item.type === 'file') {
        try {
          const content = fileContents[fullPath];
          if (content) {
            const newPath = targetPath ? `${targetPath}/${item.name}` : item.name;
            
            // Save to new location
            await api.post('/files/save', {
              teamId: currentTeam._id,
              fileName: newPath,
              content: content
            });
            
            // Delete from old location
            await api.delete(`/files/team/${currentTeam._id}/file/${fullPath}`);
          }
        } catch (err) {
          console.error('Move file error:', err);
          error(err.response?.data?.message || 'Failed to move file');
          setContextMenu(null);
          return;
        }
      }

      setFileTree(prev => {
        const removed = removeItemByPath(prev, fullPath);
        return addItemToPath(removed, targetPath, item);
      });

      if (item.type === 'file') {
        const content = fileContents[fullPath];
        if (content) {
          const newPath = targetPath ? `${targetPath}/${item.name}` : item.name;
          const newContents = { ...fileContents };
          delete newContents[fullPath];
          newContents[newPath] = content;
          setFileContents(newContents);

          setOpenTabs(prev => prev.map(tab =>
            tab.name === fullPath ? { ...tab, name: newPath } : tab
          ));

          if (activeTab === fullPath) {
            setActiveTab(newPath);
          }
        }
      }

      setClipboard(null);
      success(`Moved ${item.name}`);
    } else if (operation === 'copy') {
      // Handle server-side copy for files
      if (currentTeam && item.type === 'file') {
        try {
          const content = fileContents[fullPath];
          if (content) {
            const newPath = targetPath ? `${targetPath}/${item.name}` : item.name;
            
            // Save copy to new location
            await api.post('/files/save', {
              teamId: currentTeam._id,
              fileName: newPath,
              content: content
            });
          }
        } catch (err) {
          console.error('Copy file error:', err);
          error(err.response?.data?.message || 'Failed to copy file');
          setContextMenu(null);
          return;
        }
      }

      const newItem = duplicateItem(item);
      setFileTree(prev => addItemToPath(prev, targetPath, newItem));

      if (item.type === 'file') {
        const content = fileContents[fullPath];
        if (content) {
          const newPath = targetPath ? `${targetPath}/${item.name}` : item.name;
          setFileContents(prev => ({ ...prev, [newPath]: content }));
        }
      }

      success(`Pasted ${item.name}`);
    }

    setContextMenu(null);
  };

  const handleDelete = (item, fullPath) => {
    setItemToDelete({ item, fullPath });
    setShowDeleteConfirm(true);
    setContextMenu(null);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    const { item, fullPath } = itemToDelete;

    // Delete from server if team is selected and it's a file
    if (currentTeam && item.type === 'file') {
      try {
        await api.delete(`/files/team/${currentTeam._id}/file/${fullPath}`);
      } catch (err) {
        console.error('Delete file error:', err);
        error(err.response?.data?.message || 'Failed to delete file');
        setShowDeleteConfirm(false);
        setItemToDelete(null);
        return;
      }
    }

    setFileTree(prev => removeItemByPath(prev, fullPath));

    if (item.type === 'file') {
      setFileContents(prev => {
        const newContents = { ...prev };
        delete newContents[fullPath];
        return newContents;
      });

      setOpenTabs(prev => prev.filter(tab => tab.name !== fullPath));

      if (activeTab === fullPath) {
        const remainingTabs = openTabs.filter(tab => tab.name !== fullPath);
        if (remainingTabs.length > 0) {
          setActiveTab(remainingTabs[0].name);
        }
      }
    }

    success(`Deleted ${item.name}`);
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const handleCopyPath = (fullPath) => {
    navigator.clipboard.writeText(fullPath).then(() => {
      success(`Copied path: ${fullPath}`);
    });
    setContextMenu(null);
  };

  const findFolderByPath = (items, path) => {
    for (const item of items) {
      if (item.name === path && item.type === 'folder') {
        return item;
      }
      if (item.children) {
        const found = findFolderByPath(item.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  const createNestedPath = (items, pathParts, isFile) => {
    if (pathParts.length === 0) return items;

    const [current, ...rest] = pathParts;
    const existingIndex = items.findIndex(item => item.name === current);

    if (rest.length === 0) {
      if (existingIndex === -1) {
        const newItem = isFile
          ? { name: current, type: 'file', hasErrors: false, language: getLanguageFromFile(current) }
          : { name: current, type: 'folder', expanded: true, children: [] };
        return [...items, newItem];
      }
      return items;
    }

    if (existingIndex === -1) {
      const newFolder = {
        name: current,
        type: 'folder',
        expanded: true,
        children: createNestedPath([], rest, isFile)
      };
      return [...items, newFolder];
    } else {
      const updatedItems = [...items];
      const existingItem = updatedItems[existingIndex];
      if (existingItem.type === 'folder') {
        updatedItems[existingIndex] = {
          ...existingItem,
          expanded: true,
          children: createNestedPath(existingItem.children || [], rest, isFile)
        };
      }
      return updatedItems;
    }
  };

  const getLanguageFromFile = (fileName) => {
    const ext = fileName.split('.').pop();
    const langMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'javascript',
      'tsx': 'javascript',
      'css': 'css',
      'html': 'html',
      'json': 'json',
      'md': 'markdown',
      'txt': 'text'
    };
    return langMap[ext] || 'text';
  };

  const handleCreateFile = async () => {
    if (!newFileName.trim()) return;

    const pathParts = newFileName.split('/');

    if (selectedFolder) {
      const folder = findFolderByPath(fileTree, selectedFolder);
      if (folder) {
        const updatedTree = fileTree.map(item => {
          if (item.name === selectedFolder) {
            return {
              ...item,
              children: createNestedPath(item.children || [], pathParts, true)
            };
          }
          if (item.children) {
            const updateInChildren = (children) => {
              return children.map(child => {
                if (child.name === selectedFolder) {
                  return {
                    ...child,
                    children: createNestedPath(child.children || [], pathParts, true)
                  };
                }
                if (child.children) {
                  return { ...child, children: updateInChildren(child.children) };
                }
                return child;
              });
            };
            return { ...item, children: updateInChildren(item.children) };
          }
          return item;
        });
        setFileTree(updatedTree);
      }
    } else {
      setFileTree(createNestedPath(fileTree, pathParts, true));
    }

    const fullPath = pathParts.join('/');
    
    // Create file on server if team is selected
    if (currentTeam) {
      try {
        await api.post('/files/save', {
          teamId: currentTeam._id,
          fileName: fullPath,
          content: getDefaultContent(fullPath, getLanguageFromFile(newFileName))
        });
      } catch (err) {
        console.error('Create file error:', err);
        error(err.response?.data?.message || 'Failed to create file');
      }
    }
    
    openFile(fullPath, getLanguageFromFile(newFileName), false);

    success(`File ${newFileName} created successfully!`);
    setNewFileName('');
    setShowNewFileInput(false);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    const pathParts = newFolderName.split('/');

    if (selectedFolder) {
      const folder = findFolderByPath(fileTree, selectedFolder);
      if (folder) {
        const updatedTree = fileTree.map(item => {
          if (item.name === selectedFolder) {
            return {
              ...item,
              children: createNestedPath(item.children || [], pathParts, false)
            };
          }
          if (item.children) {
            const updateInChildren = (children) => {
              return children.map(child => {
                if (child.name === selectedFolder) {
                  return {
                    ...child,
                    children: createNestedPath(child.children || [], pathParts, false)
                  };
                }
                if (child.children) {
                  return { ...child, children: updateInChildren(child.children) };
                }
                return child;
              });
            };
            return { ...item, children: updateInChildren(item.children) };
          }
          return item;
        });
        setFileTree(updatedTree);
      }
    } else {
      setFileTree(createNestedPath(fileTree, pathParts, false));
    }

    // Create directory on server if team is selected
    if (currentTeam) {
      try {
        await api.post('/files/directory', {
          teamId: currentTeam._id,
          dirName: newFolderName
        });
      } catch (err) {
        console.error('Create folder error:', err);
        error(err.response?.data?.message || 'Failed to create folder');
      }
    }

    success(`Folder ${newFolderName} created successfully!`);
    setNewFolderName('');
    setShowNewFolderInput(false);
  };

  const openFile = async (fileName, language = 'javascript', hasErrors = false) => {
    const existingTab = openTabs.find(tab => tab.name === fileName);
    if (!existingTab) {
      setOpenTabs(prev => [...prev, { name: fileName, hasErrors, language, modified: false }]);
      
      // Load file content from server if team is selected
      if (currentTeam && !fileContents[fileName]) {
        try {
          const response = await api.get(`/files/team/${currentTeam._id}/file/${fileName}`);
          setFileContents(prev => ({
            ...prev,
            [fileName]: response.data.content
          }));
        } catch (err) {
          console.error('Load file error:', err);
          // Initialize with default content if file doesn't exist
          setFileContents(prev => ({
            ...prev,
            [fileName]: getDefaultContent(fileName, language)
          }));
        }
      } else if (!fileContents[fileName]) {
        // Initialize file content if not exists
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
    return `// ${fileName}\n\n`;
  };

  const closeTab = (fileName) => {
    const newTabs = openTabs.filter(tab => tab.name !== fileName);
    setOpenTabs(newTabs);
    if (activeTab === fileName && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1].name);
    }
  };

  const handleSaveFile = async () => {
    if (!currentTeam || !activeTab) return;
    
    try {
      setIsLoading(true);
      const content = fileContents[activeTab] || '';
      
      await api.post('/files/save', {
        teamId: currentTeam._id,
        fileName: activeTab,
        content: content
      });
      
      success(`${activeTab} saved successfully!`);
      setOpenTabs(prev => prev.map(tab => 
        tab.name === activeTab ? { ...tab, modified: false } : tab
      ));
    } catch (err) {
      console.error('Save file error:', err);
      error(err.response?.data?.message || 'Failed to save file');
    } finally {
      setIsLoading(false);
    }
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
    if (message.trim() && user) {
      const newMessage = {
        id: Date.now(),
        userId: user.id || user._id || user.email, // fallback if id is missing
        user: user.name,
        message: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: user.avatar || (user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'),
        type: 'message',
        status: 'online'
      };
      socketRef.current.emit('chat message', newMessage);
      setMessage('');
    }
  };

  const handleTyping = () => {
    if (!user) return;
    const userData = {
      userId: user.id || user._id || user.email,
      name: user.name,
      avatar: user.avatar || (user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U')
    };
    socketRef.current.emit('typing', userData);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('stop typing', userData);
    }, 1000);
  };

  const renderFileTree = (items, level = 0, parentPath = '') => {
    return items.map((item, index) => {
      const fullPath = parentPath ? `${parentPath}/${item.name}` : item.name;
      const isRenaming = renamingItem?.fullPath === fullPath;

      return (
        <div key={index} style={{ paddingLeft: `${level * 12}px` }}>
          <div
            className={`flex items-center py-1 px-2 text-sm cursor-pointer hover:bg-[#2a2d3a] transition-colors ${
              item.active || (item.type === 'folder' && selectedFolder === item.name)
                ? 'bg-[#37373d] text-white'
                : 'text-[#cccccc]'
            }`}
            onClick={() => {
              if (item.type === 'folder') {
                toggleFolder(item.name);
                selectFolder(item.name);
              } else {
                openFile(fullPath, item.language, item.hasErrors);
              }
            }}
            onContextMenu={(e) => handleContextMenu(e, item, fullPath)}
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
            {isRenaming ? (
              <input
                ref={renameInputRef}
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.stopPropagation();
                    handleRenameConfirm();
                  }
                  if (e.key === 'Escape') {
                    e.stopPropagation();
                    setRenamingItem(null);
                    setRenameValue('');
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                onBlur={handleRenameConfirm}
                className="flex-1 bg-[#3c3c3c] text-white text-xs px-1 py-0.5 rounded outline-none border border-[#007acc]"
              />
            ) : (
              <span className="truncate">{item.name}</span>
            )}
          </div>
          {item.children && item.expanded && (
            <div>
              {renderFileTree(item.children, level + 1, fullPath)}
            </div>
          )}
        </div>
      );
    });
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
        <div className="flex items-center space-x-2">
          {currentTeam ? (
            <div className="flex items-center space-x-2 px-2 py-1 bg-blue-500/20 rounded border border-blue-500/30">
              <Users className="h-3 w-3 text-blue-300" />
              <span className="text-xs text-blue-300">{currentTeam.name}</span>
              <button
                onClick={() => setShowTeamSelector(true)}
                className="text-blue-300 hover:text-blue-100"
                title="Switch team"
              >
                <ChevronDown className="h-3 w-3" />
              </button>
              <button
                onClick={() => {
                  setCurrentTeam(null);
                  setFileTree([]);
                  setFileContents({});
                  setOpenTabs([]);
                  setActiveTab(null);
                  setTeamMembers([]);
                  setTerminalOutput([]);
                  setProblems([]);
                }}
                className="text-blue-300 hover:text-blue-100"
                title="Disconnect from team"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowTeamSelector(true)}
              className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-[#2a2d3a] transition-colors"
            >
              Select Team
            </button>
          )}
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
                        <button
                          onClick={() => {
                            setShowNewFileInput(true);
                            setShowNewFolderInput(false);
                            setTimeout(() => newFileInputRef.current?.focus(), 100);
                          }}
                          className="p-1 hover:bg-[#2a2d3a] rounded transition-colors"
                          title="New File"
                        >
                          <FileText className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => {
                            setShowNewFolderInput(true);
                            setShowNewFileInput(false);
                            setTimeout(() => newFolderInputRef.current?.focus(), 100);
                          }}
                          className="p-1 hover:bg-[#2a2d3a] rounded transition-colors"
                          title="New Folder"
                        >
                          <Folder className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    
                    {/* File Tree */}
                    <div className="p-2 overflow-y-auto h-full">
                      <div
                        className="text-xs font-medium text-[#cccccc] mb-2 px-2 flex items-center justify-between"
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (clipboard) {
                            setContextMenu({
                              x: e.clientX,
                              y: e.clientY,
                              item: { type: 'folder', name: 'root' },
                              fullPath: ''
                            });
                          }
                        }}
                      >
                        <span>HACKATHON-PLATFORM</span>
                        {selectedFolder && (
                          <button
                            onClick={() => setSelectedFolder(null)}
                            className="text-[#969696] hover:text-white text-xs"
                            title="Clear selection"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {/* New File Input */}
                      {showNewFileInput && (
                        <div className="mb-2 px-2">
                          <div className="flex items-center space-x-2 bg-[#1e1e1e] p-2 rounded border border-[#007acc]">
                            <FileText className="h-3 w-3 text-[#007acc]" />
                            <input
                              ref={newFileInputRef}
                              type="text"
                              placeholder="File name (e.g., utils/helpers.js)"
                              value={newFileName}
                              onChange={(e) => setNewFileName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreateFile();
                                if (e.key === 'Escape') {
                                  setShowNewFileInput(false);
                                  setNewFileName('');
                                }
                              }}
                              className="flex-1 bg-transparent text-white text-xs outline-none placeholder-[#858585]"
                            />
                            <button
                              onClick={handleCreateFile}
                              className="text-[#4ec9b0] hover:text-[#6ed7b7] text-xs"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => {
                                setShowNewFileInput(false);
                                setNewFileName('');
                              }}
                              className="text-[#f44747] hover:text-[#f66565] text-xs"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          {selectedFolder && (
                            <p className="text-xs text-[#858585] mt-1 ml-1">
                              Creating in: {selectedFolder}
                            </p>
                          )}
                        </div>
                      )}

                      {/* New Folder Input */}
                      {showNewFolderInput && (
                        <div className="mb-2 px-2">
                          <div className="flex items-center space-x-2 bg-[#1e1e1e] p-2 rounded border border-[#007acc]">
                            <Folder className="h-3 w-3 text-[#dcb67a]" />
                            <input
                              ref={newFolderInputRef}
                              type="text"
                              placeholder="Folder name (e.g., components)"
                              value={newFolderName}
                              onChange={(e) => setNewFolderName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreateFolder();
                                if (e.key === 'Escape') {
                                  setShowNewFolderInput(false);
                                  setNewFolderName('');
                                }
                              }}
                              className="flex-1 bg-transparent text-white text-xs outline-none placeholder-[#858585]"
                            />
                            <button
                              onClick={handleCreateFolder}
                              className="text-[#4ec9b0] hover:text-[#6ed7b7] text-xs"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => {
                                setShowNewFolderInput(false);
                                setNewFolderName('');
                              }}
                              className="text-[#f44747] hover:text-[#f66565] text-xs"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          {selectedFolder && (
                            <p className="text-xs text-[#858585] mt-1 ml-1">
                              Creating in: {selectedFolder}
                            </p>
                          )}
                        </div>
                      )}

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
                        {!currentTeam ? (
                          <div className="h-full flex items-center justify-center bg-[#1e1e1e]">
                            <div className="text-center">
                              <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                              <h3 className="text-xl font-medium text-gray-300 mb-2">No Team Selected</h3>
                              <p className="text-gray-500 mb-4">Select a team to start coding together</p>
                              <button
                                onClick={() => setShowTeamSelector(true)}
                                className="px-4 py-2 bg-[#007acc] text-white rounded hover:bg-[#005a9e] transition-colors"
                              >
                                Select Team
                              </button>
                            </div>
                          </div>
                        ) : openTabs.length === 0 ? (
                          <div className="h-full flex items-center justify-center bg-[#1e1e1e]">
                            <div className="text-center">
                              <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                              <h3 className="text-xl font-medium text-gray-300 mb-2">No Files Open</h3>
                              <p className="text-gray-500 mb-4">Create a new file or open an existing one</p>
                              <div className="space-x-2">
                                <button
                                  onClick={() => {
                                    setShowNewFileInput(true);
                                    setShowNewFolderInput(false);
                                    setTimeout(() => newFileInputRef.current?.focus(), 100);
                                  }}
                                  className="px-4 py-2 bg-[#007acc] text-white rounded hover:bg-[#005a9e] transition-colors"
                                >
                                  New File
                                </button>
                                <button
                                  onClick={() => {
                                    setShowNewFolderInput(true);
                                    setShowNewFileInput(false);
                                    setTimeout(() => newFolderInputRef.current?.focus(), 100);
                                  }}
                                  className="px-4 py-2 bg-[#475569] text-white rounded hover:bg-[#64748b] transition-colors"
                                >
                                  New Folder
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Editor
                            height="100%"
                            language={getMonacoLanguage(openTabs.find(tab => tab.name === activeTab)?.language || 'javascript')}
                            value={fileContents[activeTab] || ''}
                            onChange={handleEditorChange}
                            onMount={handleEditorDidMount}
                            options={editorOptions}
                            theme="hackcollab-dark"
                          />
                        )}
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
                                {terminalOutput.length === 0 ? (
                                  <div className="text-[#969696] italic">
                                    No terminal output yet. Select a team to get started.
                                  </div>
                                ) : (
                                  terminalOutput.map((line, index) => (
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
                                  ))
                                )}
                                <div className="flex items-center text-[#569cd6]">
                                  <span>$ </span>
                                  <div className="w-2 h-4 bg-white ml-1 animate-pulse"></div>
                                </div>
                              </div>
                            )}

                            {terminalTab === 'problems' && (
                              <div className="space-y-2">
                                {problems.length === 0 ? (
                                  <div className="text-center py-8">
                                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                    <p className="text-[#969696] text-sm">No problems found</p>
                                    <p className="text-[#858585] text-xs mt-1">Your code is clean!</p>
                                  </div>
                                ) : (
                                  problems.map((problem, index) => (
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
                                  ))
                                )}
                              </div>
                            )}

                            {terminalTab === 'output' && (
                              <div className="space-y-1 text-[#d4d4d4]">
                                {terminalOutput.length === 0 ? (
                                  <div className="text-[#969696] italic">
                                    No build output yet. Run commands to see output here.
                                  </div>
                                ) : (
                                  terminalOutput.map((line, index) => (
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
                                  ))
                                )}
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
          <span>{openTabs.find(tab => tab.name === activeTab)?.language || 'No file'}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>
              {currentTeam 
                ? `${teamMembers.filter(m => m.status === 'online').length} online` 
                : 'No team'
              }
            </span>
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
                  <div key={msg.id} className={`flex ${msg.userId === (user?.id || user?._id || user?.email) ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs ${msg.userId === (user?.id || user?._id || user?.email) ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-center space-x-2 mb-1 ${msg.userId === (user?.id || user?._id || user?.email) ? 'justify-end' : 'justify-start'}`}>
                        {msg.userId !== (user?.id || user?._id || user?.email) && (
                          <div className="h-4 w-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-white">{msg.avatar}</span>
                          </div>
                        )}
                        <span className="text-xs text-[#969696]">{msg.user}</span>
                        <span className="text-xs text-[#858585]">{msg.time}</span>
                      </div>
                      <div className={`p-2 rounded text-sm ${
                        msg.userId === (user?.id || user?._id || user?.email) 
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
                {/* Typing Animation */}
                {typingUsers.length > 0 && (
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span>
                      {typingUsers.map(u => u.name).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                    </span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-[#2d2d30]">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); handleTyping(); }}
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

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-[#2d2d30] border border-[#454545] rounded shadow-2xl py-1 min-w-[180px] z-[100]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.item.name !== 'root' && (
            <>
              <button
                onClick={() => handleRename(contextMenu.item, contextMenu.fullPath)}
                className="w-full px-4 py-1.5 text-left text-sm text-[#cccccc] hover:bg-[#094771] hover:text-white transition-colors flex items-center space-x-2"
              >
                <span>Rename</span>
              </button>
              <div className="border-t border-[#454545] my-1"></div>
              <button
                onClick={() => handleCut(contextMenu.item, contextMenu.fullPath)}
                className="w-full px-4 py-1.5 text-left text-sm text-[#cccccc] hover:bg-[#094771] hover:text-white transition-colors flex items-center space-x-2"
              >
                <span>Cut</span>
              </button>
              <button
                onClick={() => handleCopy(contextMenu.item, contextMenu.fullPath)}
                className="w-full px-4 py-1.5 text-left text-sm text-[#cccccc] hover:bg-[#094771] hover:text-white transition-colors flex items-center space-x-2"
              >
                <span>Copy</span>
              </button>
            </>
          )}
          {clipboard && (contextMenu.item.type === 'folder' || contextMenu.item.name === 'root') && (
            <button
              onClick={() => handlePaste(contextMenu.item, contextMenu.fullPath)}
              className="w-full px-4 py-1.5 text-left text-sm text-[#cccccc] hover:bg-[#094771] hover:text-white transition-colors flex items-center space-x-2"
            >
              <span>Paste</span>
            </button>
          )}
          {contextMenu.item.name !== 'root' && (
            <>
              <div className="border-t border-[#454545] my-1"></div>
              <button
                onClick={() => handleCopyPath(contextMenu.fullPath)}
                className="w-full px-4 py-1.5 text-left text-sm text-[#cccccc] hover:bg-[#094771] hover:text-white transition-colors flex items-center space-x-2"
              >
                <span>Copy Path</span>
              </button>
              <div className="border-t border-[#454545] my-1"></div>
              <button
                onClick={() => handleDelete(contextMenu.item, contextMenu.fullPath)}
                className="w-full px-4 py-1.5 text-left text-sm text-[#f44747] hover:bg-[#094771] hover:text-[#ff6b6b] transition-colors flex items-center space-x-2"
              >
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && itemToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#2d2d30] border border-[#454545] rounded-lg shadow-2xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-medium text-white mb-3">Confirm Delete</h3>
            <p className="text-[#cccccc] text-sm mb-6">
              Are you sure you want to delete <span className="font-medium text-white">{itemToDelete.item.name}</span>?
              {itemToDelete.item.type === 'folder' && (
                <span className="block mt-2 text-[#f44747]">This will delete all files and folders inside it.</span>
              )}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 bg-[#3c3c3c] text-white rounded hover:bg-[#4c4c4c] transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-[#f44747] text-white rounded hover:bg-[#ff5757] transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Team Selector Modal */}
      <AnimatePresence>
        {showTeamSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#2d2d30] border border-[#454545] rounded-lg shadow-2xl p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Select Team</h3>
                <button
                  onClick={() => setShowTeamSelector(false)}
                  className="p-1 rounded hover:bg-[#3e3e42] transition-colors"
                >
                  <X className="h-4 w-4 text-[#cccccc]" />
                </button>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableTeams.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No teams available</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Create or join a team to start collaborating
                    </p>
                  </div>
                ) : (
                  availableTeams.map((team) => (
                    <button
                      key={team._id}
                      onClick={() => selectTeam(team)}
                      className={`w-full p-3 rounded text-left transition-colors ${
                        currentTeam?._id === team._id
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : 'bg-[#3c3c3c] hover:bg-[#4c4c4c] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {team.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-white text-sm font-medium">{team.name}</span>
                            {currentTeam?._id === team._id && (
                              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded border border-green-500/30">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {team.members?.length || 0} members
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-[#454545]">
                <button
                  onClick={() => {
                    setShowTeamSelector(false);
                    // Navigate to team management page
                    window.location.href = '/teams';
                  }}
                  className="w-full px-4 py-2 bg-[#007acc] text-white rounded hover:bg-[#005a9e] transition-colors text-sm"
                >
                  Manage Teams
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditorWorkspace;