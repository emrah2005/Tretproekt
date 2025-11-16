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

// Test database connection
pool.getConnection().then(conn => {
  console.log('MySQL connected successfully');
  conn.release();
}).catch(err => {
  console.error('MySQL connection error:', err);
});

// =============================================
// BUSINESS REGISTRATION
// =============================================
app.post('/api/register', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      companyName, 
      industry, 
      companyBio, 
      website, 
      location,
      acceptTerms
    } = req.body;

    // Validation
    if (!email || !password || !companyName) {
      return res.status(400).json({ 
        error: 'Email, password, and company name are required' 
      });
    }

    if (!acceptTerms) {
      return res.status(400).json({ 
        error: 'You must accept the terms and conditions' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();
    
    try {
      // Insert into users table
      const userQuery = `
        INSERT INTO users (name, email, password, created_at, updated_at) 
        VALUES (?, ?, ?, NOW(), NOW())
      `;
      
      const [userResult] = await conn.query(userQuery, [
        companyName,
        email,
        hashedPassword
      ]);
      
      const userId = userResult.insertId;

      // Create or use businesses table
      const businessQuery = `
        INSERT INTO businesses (user_id, company_name, email, industry, description, website, location, accepts_terms, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      await conn.query(businessQuery, [
        userId,
        companyName,
        email,
        industry || null,
        companyBio || null,
        website || null,
        location || null,
        acceptTerms ? 1 : 0
      ]);

      const token = jwt.sign(
        { id: userId, email, type: 'business', name: companyName },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'Business registered successfully',
        token,
        user: { id: userId, email, type: 'business', name: companyName }
      });

    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    // Check if it's a duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email already registered' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// =============================================
// LOGIN ENDPOINT
// =============================================
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, type } = req.body;

    if (!email || !password || !type) {
      return res.status(400).json({ 
        error: 'Email, password, and type are required' 
      });
    }

    const conn = await pool.getConnection();
    
    try {
      const query = `SELECT * FROM users WHERE email = ?`;
      const [results] = await conn.query(query, [email]);

      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          type,
          name: user.name
        },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          type
        }
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// TEST ENDPOINT
// =============================================
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working', timestamp: new Date() });
});

// =============================================
// START SERVER
// =============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/test`);
});
