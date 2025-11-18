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

// ================================================
// UNIFIED REGISTRATION ENDPOINT (BUSINESS + INFLUENCER)
// ================================================
app.post('/api/register', async (req, res) => {
  try {
    const {
      email,
      password,
      user_type,
      companyName,
      industry,
      companyBio,
      website,
      location,
      acceptTerms,
      fullName,
      bio,
      mainNiche,
      activePlatforms,
      followersCount,
      instagramHandle
    } = req.body;
          
    // Field name normalization for backwards compatibility
    if (!fullName && req.body.name) fullName = req.body.name;
    if (!mainNiche && req.body.niche) mainNiche = req.body.niche;
    if (!activePlatforms && req.body.platforms) activePlatforms = req.body.platforms;
    if (!followersCount && req.body.followers) followersCount = req.body.followers;
    if (!instagramHandle && req.body.instagram_handle) instagramHandle = req.body.instagram_handle;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long'
      });
    }

    if (!acceptTerms) {
      return res.status(400).json({
        error: 'You must accept the terms and conditions'
      });
    }

    // Route based on user_type
    if (user_type === 'influencer') {
      return await registerInfluencer(email, password, fullName, bio, mainNiche, activePlatforms, followersCount, location, instagramHandle, acceptTerms, res);
    } else {
      return await registerBusiness(email, password, companyName, industry, companyBio, website, location, acceptTerms, res);
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Registration error',
      error: error.message
    });
  }
});

// ================================================
// BUSINESS REGISTRATION HANDLER
// ================================================
async function registerBusiness(email, password, companyName, industry, companyBio, website, location, acceptTerms, res) {
  try {
    if (!companyName) {
      return res.status(400).json({
        error: 'Company name is required'
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

      // Insert into businesses table
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

      // Generate JWT token
      const token = jwt.sign(
        { id: userId, email: email, type: 'business', name: companyName },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'Business registered successfully',
        token: token,
        user: {
          id: userId,
          email: email,
          companyName: companyName,
          type: 'business'
        }
      });

    } finally {
      conn.release();
    }

  } catch (error) {
    console.error('Business registration error:', error);
    res.status(500).json({
      message: 'Business registration error',
      error: error.message
    });
  }
}

// ================================================
// INFLUENCER REGISTRATION HANDLER
// ================================================
async function registerInfluencer(email, password, fullName, bio, mainNiche, activePlatforms, followersCount, location, instagramHandle, acceptTerms, res) {
  try {
    if (!fullName) {
      return res.status(400).json({
        error: 'Full name is required'
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
        fullName,
        email,
        hashedPassword
      ]);

      const userId = userResult.insertId;

      // Insert into influencers table
      const influencerQuery = `
        INSERT INTO influencers (user_id, full_name, email, bio, main_niche, active_platforms, followers_count, location, instagram_handle, accepts_terms, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      await conn.query(influencerQuery, [
        userId,
        fullName,
        email,
        bio || null,
        mainNiche || null,
        activePlatforms || null,
        followersCount || 0,
        location || null,
        instagramHandle || null,
        acceptTerms ? 1 : 0
      ]);

      // Generate JWT token
      const token = jwt.sign(
        { id: userId, email: email, type: 'influencer', name: fullName },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'Influencer registered successfully',
        token: token,
        user: {
          id: userId,
          email: email,
          fullName: fullName,
          type: 'influencer'
        }
      });

    } finally {
      conn.release();
    }

  } catch (error) {
    console.error('Influencer registration error:', error);
    res.status(500).json({
      message: 'Influencer registration error',
      error: error.message
    });
  }
}

// ================================================
// HEALTH CHECK
// ================================================
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// ================================================
// START SERVER
// ================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
