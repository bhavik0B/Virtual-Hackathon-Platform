require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true
}));
app.use(bodyParser.json());

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

app.get('/', (res) => {
  res.send('Hackathon Platform Backend is running');
});

app.use('/api/hackathons', hackathonRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/submissions', submissionRoutes);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});