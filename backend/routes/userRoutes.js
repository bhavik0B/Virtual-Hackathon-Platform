const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

const scopes = ['profile', 'email'];

// Google OAuth login (googleapis approach)
router.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: 'randomstring' // For production, generate a real random state and store in session
  });
  res.redirect(url);
});

router.get('/auth/google/callback', async (req, res) => {
  console.log('Google OAuth callback hit');
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();
    console.log('Google user data:', data);

    // Check if user exists in DB
    let user = await User.findOne({ $or: [ { googleId: data.id }, { email: data.email } ] });
    if (user) {
      // User exists, generate JWT and redirect to dashboard
      const token = jwt.sign({ 
        id: user._id, 
        email: user.email, 
        name: user.name,
        isAdmin: user.isAdmin,
        isMentor: user.isMentor
      }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    } else {
      // User does not exist, redirect to registration
      const token = jwt.sign({ 
        googleId: data.id, 
        email: data.email, 
        name: data.name 
      }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.redirect(`http://localhost:5173/register?token=${token}`);
    }
  } catch (err) {
    console.error('Google authentication failed:', err);
    res.status(500).send('Google authentication failed');
  }
});

// Register user with all details (after Google OAuth and registration form)
router.post('/register', async (req, res) => {
  try {
    const { googleId, email, name, firstName, lastName, password, bio, location, website, github, linkedin, skills, interests, experience } = req.body;
    // Check if user already exists by email or googleId
    let user = await User.findOne({ $or: [ { googleId }, { email } ] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    user = await User.create({
      googleId,
      email,
      name,
      firstName,
      lastName,
      password,
      bio,
      location,
      website,
      github,
      linkedin,
      skills,
      interests,
      experience,
    });
    
    // Generate JWT token with user data including isAdmin
    const token = jwt.sign({ 
      id: user._id, 
      email: user.email, 
      name: user.name,
      isAdmin: user.isAdmin,
      isMentor: user.isMentor
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    return res.status(201).json({ message: 'User registered', user, token });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Registration failed' });
  }
});

module.exports = router; 