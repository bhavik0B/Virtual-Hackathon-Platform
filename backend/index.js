require('dotenv').config();

// Check if required variables are missing
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET is not defined in environment variables!');
  console.error('Please add JWT_SECRET to your .env file');
}

if (!process.env.MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not defined in environment variables!');
  console.error('Please add MONGODB_URI to your .env file');
}

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true
}));

app.use(bodyParser.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    headers: req.headers['content-type']
  });
  next();
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using HTTPS
}));

  
  // Protected route example
  app.get('/dashboard', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send('Not authenticated');
    }
    res.send(`Welcome ${req.user.displayName}`);
  });
  
  // Logout route
  app.get('/logout', (req, res) => {
    req.logout(() => {
      res.redirect('/');
    });
  });

const hackathonRoutes = require('./routes/hackathonRoutes');
const userRoutes = require('./routes/userRoutes');
const teamRoutes = require('./routes/teamRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const fileRoutes = require('./routes/fileRoutes');

app.get('/', (req, res) => {
  res.send('Hackathon Platform Backend is running');
});

// Test endpoint for debugging
app.post('/api/test', (req, res) => {
  console.log('Test endpoint hit with body:', req.body);
  res.json({ message: 'Test endpoint working', received: req.body });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    env: {
      hasMongoDB: !!process.env.MONGODB_URI,
      hasJWTSecret: !!process.env.JWT_SECRET,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET
    }
  });
});

app.use('/api/hackathons', hackathonRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/files', fileRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('chat message', (msg) => {
    console.log('Received chat message:', msg);
    // Broadcast the message to all clients
    io.emit('chat message', msg);
    console.log('Broadcasted chat message to all clients');
  });

  socket.on('typing', (userData) => {
    console.log('User typing:', userData);
    // Broadcast typing indicator to all clients except sender
    socket.broadcast.emit('typing', userData);
    console.log('Broadcasted typing indicator');
  });

  socket.on('stop typing', (userData) => {
    console.log('User stopped typing:', userData);
    // Broadcast stop typing to all clients except sender
    socket.broadcast.emit('stop typing', userData);
    console.log('Broadcasted stop typing');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});