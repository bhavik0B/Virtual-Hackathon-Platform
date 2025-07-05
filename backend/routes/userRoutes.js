const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

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
  console.log('=== GOOGLE OAUTH CALLBACK HIT ===');
  console.log('Query parameters:', req.query);
  const { code } = req.query;
  
  if (!code) {
    console.error('No authorization code received');
    return res.status(400).send('No authorization code received');
  }
  
  try {
    console.log('Getting tokens from Google...');
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Tokens received:', !!tokens);
    
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    
    console.log('Getting user info from Google...');
    const { data } = await oauth2.userinfo.get();
    console.log('Google user data:', data);

    // Check if user exists in DB by email first (primary check)
    console.log('Checking for user with email:', data.email);
    let user = await User.findOne({ email: data.email });
    console.log('User found in database:', !!user);
    
    if (user) {
      console.log('User found by email:', user.email);
      console.log('User data:', user);
      
      // Check if JWT_SECRET exists
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined');
        return res.status(500).send('Server configuration error');
      }
      
      console.log('JWT_SECRET length:', process.env.JWT_SECRET.length);
      
      // User exists, generate JWT and redirect to dashboard
      const userTokenPayload = { 
        id: user._id, 
        email: user.email, 
        name: user.name || `${user.firstName} ${user.lastName}`,
        isAdmin: user.isAdmin,
        isMentor: user.isMentor
      };
      
      console.log('User token payload:', userTokenPayload);
      
      const userToken = jwt.sign(userTokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      console.log('User token generated for existing user');
      console.log('Token length:', userToken.length);
      console.log('Token preview:', userToken.substring(0, 50) + '...');
      
      // Redirect to appropriate dashboard based on user role
      const redirectUrl = user.isAdmin 
        ? `http://localhost:5173/admin?token=${userToken}`
        : `http://localhost:5173/dashboard?token=${userToken}`;
      
      console.log('Redirecting to:', redirectUrl);
      return res.redirect(redirectUrl);
    } else {
      console.log('User not found, redirecting to registration');
      console.log('Google data for registration:', data);
      
      // Check if JWT_SECRET exists
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined');
        return res.status(500).send('Server configuration error');
      }
      
      // User does not exist, generate registration token and redirect to registration
      const registrationToken = jwt.sign({ 
        googleId: data.id, 
        email: data.email, 
        name: data.name 
      }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      console.log('Registration token generated for new user');
      const redirectUrl = `http://localhost:5173/register?token=${registrationToken}`;
      console.log('Redirecting to registration:', redirectUrl);
      return res.redirect(redirectUrl);
    }
  } catch (err) {
    console.error('Google authentication failed:', err);
    console.error('Error details:', err.message);
    res.status(500).send('Google authentication failed');
  }
});

// Register user with all details (after Google OAuth and registration form)
router.post('/register', async (req, res) => {
  console.log('=== REGISTRATION ENDPOINT HIT ===');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Request body type:', typeof req.body);
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
  
  try {
    
    const { googleId, email, name, firstName, lastName, password, bio, location, website, github, linkedin, skills, interests, experience } = req.body;
    
    // Validate required fields (password is optional for Google OAuth users)
    if (!email || !firstName || !lastName) {
      console.log('Missing required fields:', { email: !!email, firstName: !!firstName, lastName: !!lastName, password: !!password });
      return res.status(400).json({ 
        message: 'Missing required fields: email, firstName, lastName' 
      });
    }
    
    // Password is required only for non-Google OAuth users
    if (!googleId && !password) {
      return res.status(400).json({ 
        message: 'Password is required for non-Google OAuth registration' 
      });
    }
    
    // Check if user already exists by email (primary check)
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists by email:', email);
      
      // Generate JWT token for existing user and return success
      const token = jwt.sign({ 
        id: user._id, 
        email: user.email, 
        name: user.name || `${user.firstName} ${user.lastName}`,
        isAdmin: user.isAdmin,
        isMentor: user.isMentor
      }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      return res.status(200).json({ 
        message: 'User already exists, logged in successfully', 
        user, 
        token,
        isExistingUser: true 
      });
    }
    
    // Create user with proper field mapping
    const userData = {
      googleId: googleId || null,
      email,
      name: name || `${firstName} ${lastName}`,
      firstName,
      lastName,
      password,
      bio: bio || '',
      location: location || '',
      website: website || '',
      github: github || '',
      linkedin: linkedin || '',
      skills: skills || [],
      interests: interests || [],
      experience: experience || 'beginner',
    };
    
    console.log('Creating user with data:', userData);
    
    user = await User.create(userData);
    console.log('User created successfully:', user._id);
    
    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    // Generate JWT token with user data including isAdmin
    const token = jwt.sign({ 
      id: user._id, 
      email: user.email, 
      name: user.name,
      isAdmin: user.isAdmin,
      isMentor: user.isMentor
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    console.log('JWT token generated successfully');
    
    return res.status(201).json({ message: 'User registered', user, token });
  } catch (err) {
    console.error('Registration error:', err);
    console.error('Error name:', err.name);
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      console.log('Validation errors:', validationErrors);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: 'User with this email or Google ID already exists' 
      });
    }
    
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// Login endpoint for email/password authentication
router.post('/login', async (req, res) => {
  console.log('=== LOGIN ENDPOINT HIT ===');
  console.log('Login request body:', req.body);
  
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }
    
    // Check password (in a real app, you'd hash and compare passwords)
    if (user.password !== password) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }
    
    // Generate JWT token
    const token = jwt.sign({ 
      id: user._id, 
      email: user.email, 
      name: user.name || `${user.firstName} ${user.lastName}`,
      isAdmin: user.isAdmin,
      isMentor: user.isMentor
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    console.log('User logged in successfully:', user.email);
    
    return res.status(200).json({ 
      message: 'Login successful', 
      user, 
      token 
    });
    
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// Verify JWT token endpoint
router.get('/verify', async (req, res) => {
  console.log('=== TOKEN VERIFICATION ENDPOINT HIT ===');
  console.log('Headers:', req.headers);
  console.log('Authorization header:', req.headers.authorization);
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
  
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    console.log('Extracted token:', !!token);
    console.log('Token length:', token ? token.length : 0);
    console.log('Token preview:', token ? token.substring(0, 50) + '...' : 'none');
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }
    
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ message: 'Server configuration error - JWT_SECRET missing' });
    }
    
    console.log('Attempting to verify token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);
    
    // Handle both types of tokens: existing user tokens (with id) and registration tokens (with googleId)
    let user = null;
    
    if (decoded.id) {
      // Existing user token - look up by user ID
      console.log('Looking for user with ID:', decoded.id);
      user = await User.findById(decoded.id);
    } else if (decoded.googleId) {
      // Registration token - look up by email (since user doesn't exist yet)
      console.log('Registration token detected, looking for user with email:', decoded.email);
      user = await User.findOne({ email: decoded.email });
    }
    
    console.log('User found in database:', !!user);
    
    if (!user) {
      console.log('User not found in database');
      // For registration tokens, this is expected - user doesn't exist yet
      if (decoded.googleId) {
        console.log('Registration token - user not found (expected for new users)');
        return res.status(401).json({ message: 'Registration token - user not found yet' });
      }
      return res.status(401).json({ message: 'User not found' });
    }
    
    console.log('Returning user data:', {
      id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin
    });
    return res.status(200).json({ 
      message: 'Token valid', 
      user 
    });
    
  } catch (err) {
    console.error('Token verification error:', err);
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token format', error: err.message });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', error: err.message });
    } else {
      return res.status(401).json({ message: 'Token verification failed', error: err.message });
    }
  }
});

// Test endpoint to check database connection and user queries
router.get('/test-db', async (req, res) => {
  try {
    console.log('=== TESTING DATABASE CONNECTION ===');
    
    // Test database connection
    const dbState = mongoose.connection.readyState;
    console.log('Database connection state:', dbState);
    
    // Test user count
    const userCount = await User.countDocuments();
    console.log('Total users in database:', userCount);
    
    // Test finding a user by email (if provided)
    const { email } = req.query;
    if (email) {
      const user = await User.findOne({ email });
      console.log('User found by email:', !!user);
      if (user) {
        console.log('User data:', { id: user._id, email: user.email, name: user.name });
      }
    }
    
    res.json({
      message: 'Database test completed',
      dbConnected: dbState === 1,
      userCount,
      testEmail: email,
      userFound: email ? !!await User.findOne({ email }) : null
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test JWT token generation and verification
router.get('/test-jwt', async (req, res) => {
  try {
    console.log('=== TESTING JWT TOKEN ===');
    
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'JWT_SECRET is not defined' });
    }
    
    // Test token generation
    const testPayload = { 
      id: 'test123', 
      email: 'test@example.com', 
      name: 'Test User',
      isAdmin: false 
    };
    
    console.log('Test payload:', testPayload);
    const token = jwt.sign(testPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated token:', token);
    
    // Test token verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    res.json({
      message: 'JWT test completed',
      jwtSecretExists: !!process.env.JWT_SECRET,
      jwtSecretLength: process.env.JWT_SECRET.length,
      tokenGenerated: !!token,
      tokenLength: token.length,
      tokenVerified: true,
      decodedPayload: decoded
    });
    
  } catch (error) {
    console.error('JWT test error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint to generate a token like the Google OAuth callback
router.get('/test-oauth-token', async (req, res) => {
  try {
    console.log('=== TESTING OAUTH TOKEN GENERATION ===');
    
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'JWT_SECRET is not defined' });
    }
    
    // Find a user to test with
    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ error: 'No users found in database' });
    }
    
    // Generate token with same format as Google OAuth callback
    const tokenPayload = { 
      id: user._id, 
      email: user.email, 
      name: user.name || `${user.firstName} ${user.lastName}`,
      isAdmin: user.isAdmin,
      isMentor: user.isMentor
    };
    
    console.log('OAuth token payload:', tokenPayload);
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('OAuth token generated:', token);
    
    // Test verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('OAuth token decoded:', decoded);
    
    res.json({
      message: 'OAuth token test completed',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      },
      token,
      decoded,
      testUrl: `http://localhost:5173/dashboard?token=${token}`
    });
    
  } catch (error) {
    console.error('OAuth token test error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 