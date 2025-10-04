const fs = require('fs').promises;
const path = require('path');
const Team = require('../models/Team');
const User = require('../models/User');

// Ensure project directory exists
const ensureProjectDir = async (teamName) => {
  const projectPath = path.join(__dirname, '..', 'projects', teamName);
  try {
    await fs.mkdir(projectPath, { recursive: true });
    return projectPath;
  } catch (error) {
    console.error('Error creating project directory:', error);
    throw new Error('Failed to create project directory');
  }
};

// Save file content
async function saveFile(req, res) {
  try {
    const { teamId, fileName, content } = req.body;
    const userId = req.user.id;

    if (!teamId || !fileName || content === undefined) {
      return res.status(400).json({ 
        message: 'Team ID, file name, and content are required' 
      });
    }

    // Verify user is a member of the team
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.members.includes(userId)) {
      return res.status(403).json({ 
        message: 'Only team members can save files' 
      });
    }

    // Sanitize team name for directory
    const sanitizedTeamName = team.name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    const projectPath = await ensureProjectDir(sanitizedTeamName);
    
    // Create file path
    const filePath = path.join(projectPath, fileName);
    
    // Ensure directory structure exists
    const fileDir = path.dirname(filePath);
    await fs.mkdir(fileDir, { recursive: true });

    // Write file content
    await fs.writeFile(filePath, content, 'utf8');

    res.json({ 
      message: 'File saved successfully', 
      fileName,
      teamName: sanitizedTeamName
    });
  } catch (error) {
    console.error('Save file error:', error);
    res.status(500).json({ 
      message: 'Failed to save file', 
      error: error.message 
    });
  }
}

// Load file content
async function loadFile(req, res) {
  try {
    const { teamId, fileName } = req.params;
    const userId = req.user.id;

    // Verify user is a member of the team
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.members.includes(userId)) {
      return res.status(403).json({ 
        message: 'Only team members can load files' 
      });
    }

    // Get file path
    const sanitizedTeamName = team.name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    const projectPath = path.join(__dirname, '..', 'projects', sanitizedTeamName);
    const filePath = path.join(projectPath, fileName);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Read file content
    const content = await fs.readFile(filePath, 'utf8');

    res.json({ 
      content,
      fileName,
      lastModified: (await fs.stat(filePath)).mtime
    });
  } catch (error) {
    console.error('Load file error:', error);
    res.status(500).json({ 
      message: 'Failed to load file', 
      error: error.message 
    });
  }
}

// List all files in team project
async function listFiles(req, res) {
  try {
    const { teamId } = req.params;
    const userId = req.user.id;

    // Verify user is a member of the team
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.members.includes(userId)) {
      return res.status(403).json({ 
        message: 'Only team members can list files' 
      });
    }

    // Get project directory
    const sanitizedTeamName = team.name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    const projectPath = path.join(__dirname, '..', 'projects', sanitizedTeamName);

    // Check if directory exists
    try {
      await fs.access(projectPath);
    } catch (error) {
      return res.json({ files: [] });
    }

    // Recursively get all files
    const getAllFiles = async (dir, baseDir = '') => {
      const files = [];
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(baseDir, entry.name);

        if (entry.isDirectory()) {
          const subFiles = await getAllFiles(fullPath, relativePath);
          files.push(...subFiles);
        } else {
          const stats = await fs.stat(fullPath);
          files.push({
            name: relativePath,
            size: stats.size,
            lastModified: stats.mtime,
            isDirectory: false
          });
        }
      }

      return files;
    };

    const files = await getAllFiles(projectPath);

    res.json({ 
      files: files.sort((a, b) => a.name.localeCompare(b.name)),
      teamName: sanitizedTeamName
    });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ 
      message: 'Failed to list files', 
      error: error.message 
    });
  }
}

// Delete file
async function deleteFile(req, res) {
  try {
    const { teamId, fileName } = req.params;
    const userId = req.user.id;

    // Verify user is a member of the team
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.members.includes(userId)) {
      return res.status(403).json({ 
        message: 'Only team members can delete files' 
      });
    }

    // Get file path
    const sanitizedTeamName = team.name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    const projectPath = path.join(__dirname, '..', 'projects', sanitizedTeamName);
    const filePath = path.join(projectPath, fileName);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete file
    await fs.unlink(filePath);

    res.json({ 
      message: 'File deleted successfully',
      fileName
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ 
      message: 'Failed to delete file', 
      error: error.message 
    });
  }
}

// Create directory
async function createDirectory(req, res) {
  try {
    const { teamId, dirName } = req.body;
    const userId = req.user.id;

    if (!teamId || !dirName) {
      return res.status(400).json({ 
        message: 'Team ID and directory name are required' 
      });
    }

    // Verify user is a member of the team
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.members.includes(userId)) {
      return res.status(403).json({ 
        message: 'Only team members can create directories' 
      });
    }

    // Create directory path
    const sanitizedTeamName = team.name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    const projectPath = await ensureProjectDir(sanitizedTeamName);
    const dirPath = path.join(projectPath, dirName);

    // Create directory
    await fs.mkdir(dirPath, { recursive: true });

    res.json({ 
      message: 'Directory created successfully',
      dirName,
      teamName: sanitizedTeamName
    });
  } catch (error) {
    console.error('Create directory error:', error);
    res.status(500).json({ 
      message: 'Failed to create directory', 
      error: error.message 
    });
  }
}

module.exports = { 
  saveFile, 
  loadFile, 
  listFiles, 
  deleteFile, 
  createDirectory 
};
