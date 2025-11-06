const API_BASE_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');

function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
}

function openTermsModal() {
  document.getElementById('termsModal').classList.add('active');
}

function closeTermsModal() {
  document.getElementById('termsModal').classList.remove('active');
}

function acceptTerms() {
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const category = document.getElementById('category').value;
  
  if (!fullName || !email || !category) {
    alert('Please fill in all fields');
    return;
  }
  
  fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, category })
  })
  .then(r => r.json())
  .then(data => {
    authToken = data.token;
    localStorage.setItem('authToken', authToken);
    alert('Registration successful!');
    closeTermsModal();
  })
  .catch(e => alert('Error: ' + e.message));
}

function handleLogout() {
  localStorage.removeItem('authToken');
  location.reload();
}
