// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
let currentTab = 'landing';
let selectedConversation = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    if (authToken) {
        showLoggedInView();
        loadDashboard();
    }
});

// Event Listeners Setup
function setupEventListeners() {
    document.getElementById('navHome').addEventListener('click', () => switchTab('landing'));
    document.getElementById('loginBtn').addEventListener('click', () => openAuthModal('login'));
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('signupInfluencer').addEventListener('click', () => openAuthModal('signup', 'influencer'));
    document.getElementById('signupBrand').addEventListener('click', () => openAuthModal('signup', 'brand'));
    document.getElementById('authForm').addEventListener('submit', handleAuth);
    document.getElementById('toggleAuth').addEventListener('click', toggleAuthMode);
    document.getElementById('closeAuthModal').addEventListener('click', closeAuthModal);
    document.getElementById('createCampaignBtn').addEventListener('click', () => openModal('createCampaignModal'));
    document.getElementById('campaignForm').addEventListener('submit', createCampaign);
    document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
    document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', (e) => e.target.closest('.modal').classList.remove('active')));
}

// Tab Switching
function switchTab(tabName) {
    currentTab = tabName;
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById(tabName + 'Content').classList.add('active');
    if (tabName === 'campaigns') loadCampaigns();
    if (tabName === 'dashboard') loadDashboard();
}

// Auth Functions
function openAuthModal(mode, role = null) {
    const modal = document.getElementById('authModal');
    const form = document.getElementById('authForm');
    const title = document.getElementById('authTitle');
    const nameDiv = document.getElementById('nameInputDiv');
    const typeDiv = document.getElementById('typeInputDiv');
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
    }
    modal.classList.add('active');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

function toggleAuthMode() {
    const mode = document.getElementById('authForm').dataset.mode;
    openAuthModal(mode === 'login' ? 'signup' : 'login');
}

async function handleAuth(e) {
    e.preventDefault();
    const mode = document.getElementById('authForm').dataset.mode;
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    const endpoint = mode === 'login' ? '/login' : '/register';
    const payload = { email, password };
    if (mode === 'signup') {
        payload.fullName = document.getElementById('nameInput').value;
        payload.userType = document.getElementById('roleSelect').value;
    }
    try {
        const response = await fetch(API_BASE_URL + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            closeAuthModal();
            document.getElementById('authForm').reset();
            showLoggedInView();
            switchTab('dashboard');
        } else {
            alert('Error: ' + (data.message || 'Authentication failed'));
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function showLoggedInView() {
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'block';
    document.getElementById('navDashboard').style.display = 'inline';
    document.getElementById('navCampaigns').style.display = 'inline';
    document.getElementById('navMessages').style.display = 'inline';
}

function logout() {
    authToken = null;
    currentUser = {};
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    document.getElementById('loginBtn').style.display = 'inline';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('navDashboard').style.display = 'none';
    document.getElementById('navCampaigns').style.display = 'none';
    document.getElementById('navMessages').style.display = 'none';
    switchTab('landing');
}

// Dashboard
async function loadDashboard() {
    if (!authToken) return;
    try {
        const response = await fetch(API_BASE_URL + '/profile', {
            headers: { 'Authorization': 'Bearer ' + authToken }
        });
        const user = await response.json();
        document.getElementById('campaignCount').textContent = user.campaigns?.length || 0;
        document.getElementById('appCount').textContent = user.applications?.length || 0;
        document.getElementById('ratingDisplay').textContent = user.rating ? user.rating.toFixed(1) : '-';
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
    if (!authToken) { alert('Please login first'); return; }
    const payload = {
        title: document.getElementById('campaignTitle').value,
        description: document.getElementById('campaignDesc').value,
        budget: parseFloat(document.getElementById('campaignBudget').value),
        category: document.getElementById('campaignCategory').value
    };
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
            closeModal('createCampaignModal');
            loadCampaigns();
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
    const content = document.getElementById('messageInput').value.trim();
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
            document.getElementById('messageInput').value = '';
        }
    } catch (error) {
        console.error('Send message error:', error);
    }
}

// Modal Utilities
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Global modal close
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});
