const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(require('path').join(__dirname, '../frontend')));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tretproekt',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const PORT = process.env.PORT || 5000;

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(require('path').join(__dirname, '../frontend/index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Register endpoint - MySQL version
app.post('/api/register', async (req, res) => {
  let connection;
  try {
    const { name, email, password, user_type, bio, niche, platforms, followers, location, instagram_handle } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    
    connection = await pool.getConnection();
    
    // Check if user already exists
    const [existingUser] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      connection.release();
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user into database
    const [result] = await connection.query(
      'INSERT INTO users (name, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [name, hashedPassword, email]
    );
    
    const userId = result.insertId;
    console.log(`New user registered: ${email} (ID: ${userId})`);
    
    // Generate JWT token
    const token = jwt.sign({ userId: userId, email: email }, JWT_SECRET, { expiresIn: '7d' });
    
    connection.release();
    
    // Return success response
    res.status(201).json({
      token,
      user: {
        id: userId,
        name: name,
        email: email,
        user_type: user_type || 'influencer'
      },
      message: 'Account created successfully'
    });
  } catch (error) {
    if (connection) connection.release();
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration: ' + error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  let connection;
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    connection = await pool.getConnection();
    
    // Find user
    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      connection.release();
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      connection.release();
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    connection.release();
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      message: 'Login successful'
    });
  } catch (error) {
    if (connection) connection.release();
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get user profile
app.get('/api/profile', async (req, res) => {
  let connection;
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    connection = await pool.getConnection();
    
    const [users] = await connection.query('SELECT id, name, email FROM users WHERE id = ?', [decoded.userId]);
    connection.release();
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: users[0],
      campaigns: [],
      applications: [],
      rating: 4.5
    });
  } catch (error) {
    if (connection) connection.release();
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
  console.log(`🗄️  Database: tretproekt (MySQL)`);
  console.log(`🚀 Frontend: http://localhost:${PORT}\n`);
});
