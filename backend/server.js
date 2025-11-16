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
// INFLUENCER REGISTRATION
// =============================================
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, bio, niche, platforms, followers, location, instagram } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();

    try {
      const query = 'INSERT INTO users (name, email, password, bio, niche, platforms, followers, location, instagram, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';
      
      await conn.query(query, [
        name,
        email,
        hashedPassword,
        bio || null,
        niche || null,
        JSON.stringify(platforms) || null,
        followers || null,
        location || null,
        instagram || null
      ]);

      const token = jwt.sign({ email, type: 'influencer' }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });

      res.status(201).json({
        message: 'Influencer registered successfully',
        token,
        user: { name, email, type: 'influencer' }
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// BRAND REGISTRATION
// =============================================
app.post('/api/brand-register', async (req, res) => {
  try {
    const { company_name, email, password, contact_person, phone, industry, website, headquarters, employees, description } = req.body;

    if (!company_name || !email || !password || !contact_person || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();

    try {
      const query = 'INSERT INTO brands (company_name, email, password, contact_person, phone, industry, website, headquarters, employees, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';
      
      const result = await conn.query(query, [
        company_name,
        email,
        hashedPassword,
        contact_person,
        phone,
        industry || null,
        website || null,
        headquarters || null,
        employees || null,
        description || null
      ]);

      const token = jwt.sign({ email, type: 'brand' }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });

      res.status(201).json({
        message: 'Brand registered successfully',
        token,
        user: { company_name, email, type: 'brand' }
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Brand registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// LOGIN ENDPOINT (Influencers & Brands)
// =============================================
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, type } = req.body;

    if (!email || !password || !type) {
      return res.status(400).json({ error: 'Email, password, and type are required' });
    }

    const table = type === 'brand' ? 'brands' : 'users';
    const conn = await pool.getConnection();

    try {
      const query = `SELECT * FROM ${table} WHERE email = ?`;
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
          name: type === 'brand' ? user.company_name : user.name
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
          name: type === 'brand' ? user.company_name : user.name,
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
