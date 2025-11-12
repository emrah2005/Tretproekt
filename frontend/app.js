// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
let currentTab = 'landing';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  if (authToken) {
    showLoggedInView();
    switchTab('dashboard');
  }
});

// Event Listeners Setup
function setupEventListeners() {
  // Navigation
  const navHome = document.getElementById('navHome');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (navHome) navHome.addEventListener('click', () => switchTab('landing'));
  if (loginBtn) loginBtn.addEventListener('click', () => openAuthModal('login'));
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
  
  // Auth
  const authForm = document.getElementById('authForm');
  const toggleAuth = document.getElementById('toggleAuth');
  const closeAuthModal = document.getElementById('closeAuthModal');
  
  if (authForm) authForm.addEventListener('submit', handleAuth);
  if (toggleAuth) toggleAuth.addEventListener('click', toggleAuthMode);
  if (closeAuthModal) closeAuthModal.addEventListener('click', closeAuthModalFunc);
  
  // Campaigns
  const createCampaignBtn = document.getElementById('createCampaignBtn');
  const campaignForm = document.getElementById('campaignForm');
  
  if (createCampaignBtn) createCampaignBtn.addEventListener('click', () => openModal('createCampaignModal'));
  if (campaignForm) campaignForm.addEventListener('submit', createCampaign);
  
  // Messages
  const sendMessageBtn = document.getElementById('sendMessageBtn');
  if (sendMessageBtn) sendMessageBtn.addEventListener('click', sendMessage);
  
  // Modal closes
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');
      if (modal) modal.classList.remove('active');
    });
  });
  
  // Click outside to close
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('active');
    }
  });
}

// Tab Switching
function switchTab(tabName) {
  currentTab = tabName;
  document.querySelectorAll('[id$="Content"]').forEach(el => {
    el.classList.remove('active');
  });
  const tabEl = document.getElementById(tabName + 'Content');
  if (tabEl) tabEl.classList.add('active');
  
  if (tabName === 'campaigns') loadCampaigns();
  if (tabName === 'dashboard') loadDashboard();
  if (tabName === 'messages') loadConversations();
}

// Auth Modal
function openAuthModal(mode, role = null) {
  const modal = document.getElementById('authModal');
  const title = document.getElementById('authTitle');
  const nameDiv = document.getElementById('nameInputDiv');
  const typeDiv = document.getElementById('typeInputDiv');
  const form = document.getElementById('authForm');
  
  if (mode === 'login') {
    title.textContent = 'Login';
    nameDiv.style.display = 'none';
    typeDiv.style.display = 'none';
    form.dataset.mode = 'login';
  } else {
    title.textContent = 'Sign Up';
    nameDiv.style.display = 'block';
    typeDiv.style.display = role ? 'none' : 'block';
    form.dataset.mode = 'signup';
    if (role) document.getElementById('roleSelect').value = role;
  }
  modal.classList.add('active');
}

function closeAuthModalFunc() {
  document.getElementById('authModal').classList.remove('active');
}

function toggleAuthMode() {
  const mode = document.getElementById('authForm').dataset.mode;
  openAuthModal(mode === 'login' ? 'signup' : 'login');
}

// Auth Handler
async function handleAuth(e) {
  e.preventDefault();
  
  const mode = document.getElementById('authForm').dataset.mode;
  const email = document.getElementById('emailInput').value.trim();
  const password = document.getElementById('passwordInput').value.trim();
  
  if (!email || !password) {
    alert('Please fill in all fields');
    return;
  }
  
  const endpoint = mode === 'login' ? '/login' : '/register';
  const payload = { email, password };
  
  if (mode === 'signup') {
    const name = document.getElementById('nameInput')?.value.trim();
    const userType = document.getElementById('roleSelect')?.value || 'influencer';
    
    if (!name) {
      alert('Please enter your name');
      return;
    }
    
    payload.fullName = name;
    payload.userType = userType;
  }
  
  try {
    const response = await fetch(API_BASE_URL + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (response.ok && data.token) {
      authToken = data.token;
      currentUser = data.user;
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      closeAuthModalFunc();
      document.getElementById('authForm').reset();
      showLoggedInView();
      switchTab('dashboard');
      alert('Welcome ' + (currentUser.name || 'User') + '!');
    } else {
      alert('Error: ' + (data.message || 'Auth failed'));
    }
  } catch (error) {
    alert('Connection Error: ' + error.message);
    console.error('Auth error:', error);
  }
}

// Show/Hide Auth UI
function showLoggedInView() {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const navDashboard = document.getElementById('navDashboard');
  const navCampaigns = document.getElementById('navCampaigns');
  const navMessages = document.getElementById('navMessages');
  
  if (loginBtn) loginBtn.style.display = 'none';
  if (logoutBtn) logoutBtn.style.display = 'block';
  if (navDashboard) navDashboard.style.display = 'inline';
  if (navCampaigns) navCampaigns.style.display = 'inline';
  if (navMessages) navMessages.style.display = 'inline';
}

function logout() {
  authToken = null;
  currentUser = {};
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const navDashboard = document.getElementById('navDashboard');
  const navCampaigns = document.getElementById('navCampaigns');
  const navMessages = document.getElementById('navMessages');
  
  if (loginBtn) loginBtn.style.display = 'inline';
  if (logoutBtn) logoutBtn.style.display = 'none';
  if (navDashboard) navDashboard.style.display = 'none';
  if (navCampaigns) navCampaigns.style.display = 'none';
  if (navMessages) navMessages.style.display = 'none';
  
  switchTab('landing');
  alert('Logged out successfully!');
}

// Dashboard
async function loadDashboard() {
  if (!authToken) return;
  
  try {
    const response = await fetch(API_BASE_URL + '/profile', {
      headers: { 'Authorization': 'Bearer ' + authToken }
    });
    
    const user = await response.json();
    
    if (document.getElementById('campaignCount')) {
      document.getElementById('campaignCount').textContent = user.campaigns?.length || 0;
    }
    if (document.getElementById('appCount')) {
      document.getElementById('appCount').textContent = user.applications?.length || 0;
    }
    if (document.getElementById('ratingDisplay')) {
      document.getElementById('ratingDisplay').textContent = user.rating ? user.rating.toFixed(1) : '-';
    }
  } catch (error) {
    console.error('Dashboard error:', error);
  }
}

// Campaigns
async function loadCampaigns() {
  if (!authToken) return;
  
  try {
    const response = await fetch(API_BASE_URL + '/campaigns', {
      headers: { 'Authorization': 'Bearer ' + authToken }
    });
    
    const campaigns = await response.json();
    const list = document.getElementById('campaignsList');
    
    if (!list) return;
    
    list.innerHTML = campaigns.map(c => `
      <div class="bg-white p-4 rounded-lg shadow hover:shadow-lg">
        <h3 class="font-semibold text-lg mb-2">${c.title}</h3>
        <p class="text-gray-600 text-sm mb-3">${c.description?.substring(0, 100)}...</p>
        <div class="flex justify-between items-center">
          <span class="text-purple-600 font-bold">$${c.budget}</span>
          <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">${c.status}</span>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Campaigns error:', error);
  }
}

async function createCampaign(e) {
  e.preventDefault();
  
  if (!authToken) {
    alert('Please login first');
    return;
  }
  
  const payload = {
    title: document.getElementById('campaignTitle')?.value,
    description: document.getElementById('campaignDesc')?.value,
    budget: parseFloat(document.getElementById('campaignBudget')?.value),
    category: document.getElementById('campaignCategory')?.value
  };
  
  if (!payload.title || !payload.description || !payload.budget) {
    alert('Please fill all fields');
    return;
  }
  
  try {
    const response = await fetch(API_BASE_URL + '/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      alert('Campaign created!');
      document.getElementById('campaignForm').reset();
      document.getElementById('createCampaignModal').classList.remove('active');
      loadCampaigns();
    } else {
      alert('Error creating campaign');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Messages
async function loadConversations() {
  if (!authToken) return;
  
  try {
    const response = await fetch(API_BASE_URL + '/conversations', {
      headers: { 'Authorization': 'Bearer ' + authToken }
    });
    
    const conversations = await response.json();
    const list = document.getElementById('conversationsList');
    
    if (!list) return;
    
    list.innerHTML = conversations.map(conv => `
      <div class="p-3 hover:bg-gray-100 cursor-pointer border-b">
        <p class="font-semibold text-sm">${conv.participantName}</p>
        <p class="text-xs text-gray-500 truncate">${conv.lastMessage}</p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Conversations error:', error);
  }
}

async function sendMessage() {
  if (!authToken) return;
  
  const input = document.getElementById('messageInput');
  if (!input) return;
  
  const content = input.value.trim();
  if (!content) return;
  
  try {
    const response = await fetch(API_BASE_URL + '/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      },
      body: JSON.stringify({ content })
    });
    
    if (response.ok) {
      input.value = '';
      loadConversations();
    }
  } catch (error) {
    console.error('Send message error:', error);
  }
}

// Modal Utilities
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Global modal close on outside click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});
