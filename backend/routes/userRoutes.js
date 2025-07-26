const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const { getUserProfile, getUserHackathons } = require('../controllers/userController');

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
      
      // User exists, generate access and refresh tokens
      const accessTokenPayload = { 
        id: user._id, 
        email: user.email, 
        name: user.name || `${user.firstName} ${user.lastName}`,
        isAdmin: user.isAdmin,
        type: 'access'
      };
      
      const refreshTokenPayload = {
        id: user._id,
        type: 'refresh'
      };
      
      console.log('Access token payload:', accessTokenPayload);
      console.log('Refresh token payload:', refreshTokenPayload);
      
      const accessToken = jwt.sign(accessTokenPayload, process.env.JWT_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign(refreshTokenPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
      
      console.log('Access token generated for existing user');
      console.log('Refresh token generated for existing user');
      console.log('Access token length:', accessToken.length);
      console.log('Refresh token length:', refreshToken.length);
      
      // Store refresh token in database (you might want to add a refreshTokens collection)
      // For now, we'll store it in user document
      user.refreshToken = refreshToken;
      await user.save();
      
      // Redirect to appropriate dashboard based on user role with both tokens
      const redirectUrl = user.isAdmin 
        ? `http://localhost:5173/admin?accessToken=${accessToken}&refreshToken=${refreshToken}`
        : `http://localhost:5173/dashboard?accessToken=${accessToken}&refreshToken=${refreshToken}`;
      
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
        name: data.name,
        type: 'registration'
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
    
    const { googleId, email, name, firstName, lastName, bio, location, website, github, linkedin, skills, interests, experience } = req.body;
    
    // Validate required fields
    if (!email || !firstName || !lastName) {
      console.log('Missing required fields:', { email: !!email, firstName: !!firstName, lastName: !!lastName });
      return res.status(400).json({ 
        message: 'Missing required fields: email, firstName, lastName' 
      });
    }
    
    // Check if user already exists by email (primary check)
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists by email:', email);
      
      // Generate access and refresh tokens for existing user
      const accessTokenPayload = { 
        id: user._id, 
        email: user.email, 
        name: user.name || `${user.firstName} ${user.lastName}`,
        isAdmin: user.isAdmin,
        type: 'access'
      };
      
      const refreshTokenPayload = {
        id: user._id,
        type: 'refresh'
      };
      
      const accessToken = jwt.sign(accessTokenPayload, process.env.JWT_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign(refreshTokenPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
      
      // Store refresh token in database
      user.refreshToken = refreshToken;
      await user.save();
      
      return res.status(200).json({ 
        message: 'User already exists, logged in successfully', 
        user, 
        accessToken,
        refreshToken,
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
    
    // Generate access and refresh tokens with user data
    const accessTokenPayload = { 
      id: user._id, 
      email: user.email, 
      name: user.name,
      isAdmin: user.isAdmin,
      type: 'access'
    };
    
    const refreshTokenPayload = {
      id: user._id,
      type: 'refresh'
    };
    
    const accessToken = jwt.sign(accessTokenPayload, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(refreshTokenPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Store refresh token in database
    user.refreshToken = refreshToken;
    await user.save();
    
    console.log('Access and refresh tokens generated successfully');
    
    return res.status(201).json({ 
      message: 'User registered', 
      user, 
      accessToken,
      refreshToken 
    });
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



// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  console.log('=== REFRESH TOKEN ENDPOINT HIT ===');
  
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }
    
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ message: 'Server configuration error - JWT_SECRET missing' });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    console.log('Refresh token decoded:', decoded);
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ message: 'Invalid token type' });
    }
    
    // Find user by ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Check if refresh token matches stored token
    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    
    // Generate new access token
    const accessTokenPayload = { 
      id: user._id, 
      email: user.email, 
      name: user.name || `${user.firstName} ${user.lastName}`,
      isAdmin: user.isAdmin,
      type: 'access'
    };
    
    const newAccessToken = jwt.sign(accessTokenPayload, process.env.JWT_SECRET, { expiresIn: '15m' });
    
    console.log('New access token generated');
    
    return res.status(200).json({ 
      message: 'Token refreshed successfully', 
      accessToken: newAccessToken 
    });
    
  } catch (err) {
    console.error('Refresh token error:', err);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid refresh token', error: err.message });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Refresh token expired', error: err.message });
    } else {
      return res.status(401).json({ message: 'Token refresh failed', error: err.message });
    }
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
    
    // Check token type
    if (decoded.type === 'access') {
      // Access token - look up by user ID
      console.log('Access token detected, looking for user with ID:', decoded.id);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        console.log('User not found in database');
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
    } else if (decoded.type === 'registration') {
      // Registration token - look up by email (since user doesn't exist yet)
      console.log('Registration token detected, looking for user with email:', decoded.email);
      const user = await User.findOne({ email: decoded.email });
      
      if (!user) {
        console.log('Registration token - user not found (expected for new users)');
        return res.status(401).json({ message: 'Registration token - user not found yet' });
      }
      
      return res.status(401).json({ message: 'User already exists' });
    } else {
      console.error('Invalid token type:', decoded.type);
      return res.status(401).json({ message: 'Invalid token type' });
    }
    

    
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

// Fetch user profile by ID
router.get('/:id', getUserProfile);

// Fetch user's hackathon participation
router.get('/:id/hackathons', getUserHackathons);

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
    
    // Generate tokens with same format as Google OAuth callback
    const accessTokenPayload = { 
      id: user._id, 
      email: user.email, 
      name: user.name || `${user.firstName} ${user.lastName}`,
      isAdmin: user.isAdmin,
      type: 'access'
    };
    
    const refreshTokenPayload = {
      id: user._id,
      type: 'refresh'
    };
    
    console.log('OAuth access token payload:', accessTokenPayload);
    console.log('OAuth refresh token payload:', refreshTokenPayload);
    
    const accessToken = jwt.sign(accessTokenPayload, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(refreshTokenPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    console.log('OAuth access token generated:', accessToken);
    console.log('OAuth refresh token generated:', refreshToken);
    
    // Test verification
    const decodedAccess = jwt.verify(accessToken, process.env.JWT_SECRET);
    const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_SECRET);
    console.log('OAuth access token decoded:', decodedAccess);
    console.log('OAuth refresh token decoded:', decodedRefresh);
    
    res.json({
      message: 'OAuth token test completed',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      },
      accessToken,
      refreshToken,
      decodedAccess,
      decodedRefresh,
      testUrl: `http://localhost:5173/dashboard?accessToken=${accessToken}&refreshToken=${refreshToken}`
    });
    
  } catch (error) {
    console.error('OAuth token test error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 