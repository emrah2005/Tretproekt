const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(require('path').join(__dirname, '../frontend')));

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(require('path').join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

app.post('/api/auth/register', (req, res) => {
  const { fullName, email, category } = req.body;
  res.json({ 
    token: 'dummy-token', 
    user: { _id: '1', fullName, email, category } 
  });
});

app.get('/api/users/profile', (req, res) => {
  res.json({
    campaignsCount: 0,
    activeCampaignsCount: 0,
    totalEarnings: 0,
    pendingPayments: 0
  });
});

app.get('/api/campaigns', (req, res) => {
  res.json([]);
});

app.get('/api/applications', (req, res) => {
  res.json([]);
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
