const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(require('path').join(__dirname, '../frontend')));

// In-memory database (for demo - replace with real DB)
const users = [];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(require('path').join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5000;

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Register endpoint - Fixed to match frontend
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, user_type, bio, niche, platforms, followers, location, instagram_handle } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object with all fields
    const user = {
      _id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      user_type: user_type || 'influencer',
      bio: bio || '',
      niche: niche || '',
      platforms: platforms || '',
      followers: parseInt(followers) || 0,
      location: location || '',
      instagram_handle: instagram_handle || '',
      createdAt: new Date()
    };

    // Save user (in-memory for now)
    users.push(user);
    console.log(`New user registered: ${email}`);

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // Return success response
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        user_type: user.user_type,
        bio: user.bio,
        niche: user.niche
      },
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        user_type: user.user_type
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get user profile
app.get('/api/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u._id === decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      campaigns: [],
      applications: [],
      rating: 4.5
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Get campaigns
app.get('/api/campaigns', (req, res) => {
  res.json([]);
});

// Get applications
app.get('/api/applications', (req, res) => {
  res.json([]);
});

// Get conversations
app.get('/api/conversations', (req, res) => {
  res.json([]);
});

// Send message
app.post('/api/messages', (req, res) => {
  res.json({ message: 'Message sent' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Backend running on http://localhost:${PORT}`);
  console.log(`📝 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🚀 Frontend: http://localhost:${PORT}\n`);
});
