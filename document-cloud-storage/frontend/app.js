// API Configuration
const API_BASE = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = null;
let documents = [];
let folders = [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  if (authToken) {
    showDashboard();
    loadUserData();
  } else {
    showAuthPage();
  }

  setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
  // Auth Forms
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('registerForm').addEventListener('submit', handleRegister);

  // Upload Form
  document.getElementById('uploadForm').addEventListener('submit', handleUpload);

  // Folder Form
  document.getElementById('folderForm').addEventListener('submit', handleCreateFolder);

  // Share Form
  document.getElementById('shareForm').addEventListener('submit', handleShareDocument);

  // Drag and drop for file upload
  const fileInput = document.getElementById('file-input');
  const fileLabel = document.querySelector('.file-label');

  fileLabel.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileLabel.style.background = 'rgba(102, 126, 234, 0.1)';
  });

  fileLabel.addEventListener('dragleave', () => {
    fileLabel.style.background = '';
  });

  fileLabel.addEventListener('drop', (e) => {
    e.preventDefault();
    fileLabel.style.background = '';
    fileInput.files = e.dataTransfer.files;
    updateFileInfo();
  });

  fileInput.addEventListener('change', updateFileInfo);

  // Menu Toggle for Mobile
  document.getElementById('menu-toggle').addEventListener('click', toggleMenu);

  // Search functionality
  document.getElementById('search-input').addEventListener('input', handleSearch);
}

// Authentication Functions
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      authToken = data.token;
      localStorage.setItem('authToken', authToken);
      currentUser = data.user;
      showToast('Login successful!', 'success');
      showDashboard();
      loadUserData();
    } else {
      showToast(data.message, 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    showToast('Login failed', 'error');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const documentType = document.getElementById('document-type').value;

  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, documentType }),
    });

    const data = await response.json();

    if (data.success) {
      authToken = data.token;
      localStorage.setItem('authToken', authToken);
      currentUser = data.user;
      showToast('Registration successful!', 'success');
      showDashboard();
      loadUserData();
    } else {
      showToast(data.message, 'error');
    }
  } catch (error) {
    console.error('Register error:', error);
    showToast('Registration failed', 'error');
  }
}

// Load User Data
async function loadUserData() {
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    if (response.ok) {
      const data = await response.json();
      currentUser = data.user;
      updateUserUI();
      loadDocuments();
      loadFolders();
    } else {
      logout();
    }
  } catch (error) {
    console.error('Load user error:', error);
  }
}

// Load Documents
async function loadDocuments() {
  try {
    const response = await fetch(`${API_BASE}/documents`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    if (response.ok) {
      const data = await response.json();
      documents = data.documents || [];
      displayDocuments();
      updateFolderSelect();
      updateShareDocumentSelect();
    }
  } catch (error) {
    console.error('Load documents error:', error);
  }
}

// Load Folders
async function loadFolders() {
  try {
    const response = await fetch(`${API_BASE}/folders`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    if (response.ok) {
      const data = await response.json();
      folders = data.folders || [];
      displayFolders();
      updateFolderSelect();
    }
  } catch (error) {
    console.error('Load folders error:', error);
  }
}

// Upload Document
async function handleUpload(e) {
  e.preventDefault();
  
  const formData = new FormData();
  const file = document.getElementById('file-input').files[0];
  
  if (!file) {
    showToast('Please select a file', 'error');
    return;
  }

  const description = document.getElementById('upload-description').value;
  const folder = document.getElementById('upload-folder').value;
  const documentType = document.getElementById('upload-doc-type').value;
  const tags = document.getElementById('upload-tags').value.split(',').map(t => t.trim()).filter(t => t);

  try {
    const response = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({
        name: file.name,
        description,
        fileType: file.type,
        fileSize: file.size,
        folder: folder || undefined,
        documentType,
        tags,
      }),
    });

    if (response.ok) {
      showToast('Document uploaded successfully!', 'success');
      closeModal('uploadModal');
      document.getElementById('uploadForm').reset();
      loadDocuments();
    } else {
      showToast('Upload failed', 'error');
    }
  } catch (error) {
    console.error('Upload error:', error);
    showToast('Upload error', 'error');
  }
}

// Create Folder
async function handleCreateFolder(e) {
  e.preventDefault();
  
  const name = document.getElementById('folder-name').value;
  const parentFolder = document.getElementById('parent-folder').value;

  try {
    const response = await fetch(`${API_BASE}/folders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        parentFolder: parentFolder || null,
      }),
    });

    if (response.ok) {
      showToast('Folder created successfully!', 'success');
      closeModal('folderModal');
      document.getElementById('folderForm').reset();
      loadFolders();
    } else {
      showToast('Folder creation failed', 'error');
    }
  } catch (error) {
    console.error('Create folder error:', error);
    showToast('Folder creation error', 'error');
  }
}

// Share Document
async function handleShareDocument(e) {
  e.preventDefault();
  
  const documentId = document.getElementById('share-document').value;
  const userEmail = document.getElementById('share-user-email').value;
  const permission = document.getElementById('share-permission').value;

  try {
    // In a real app, you'd need to get the user ID from email first
    const response = await fetch(`${API_BASE}/sharing/document`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentId,
        userId: userEmail, // In production, convert email to userId
        permission,
      }),
    });

    if (response.ok) {
      showToast('Document shared successfully!', 'success');
      closeModal('shareModal');
      document.getElementById('shareForm').reset();
    } else {
      showToast('Share failed', 'error');
    }
  } catch (error) {
    console.error('Share error:', error);
    showToast('Share error', 'error');
  }
}

// Display Functions
function displayDocuments() {
  const container = document.getElementById('documents-list');
  const recentContainer = document.getElementById('recent-documents');

  if (documents.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">No documents yet</p>';
    recentContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 20px;">No recent documents</p>';
    return;
  }

  // Display all documents
  container.innerHTML = documents.map(doc => `
    <div class="document-card">
      <div class="document-icon">
        <i class="fas fa-file-alt"></i>
      </div>
      <div class="document-info">
        <div class="document-name">${doc.name}</div>
        <div class="document-meta">
          ${doc.documentType}
        </div>
        <div class="document-actions">
          <button class="action-btn" onclick="downloadDocument('${doc._id}')" title="Download">
            <i class="fas fa-download"></i>
          </button>
          <button class="action-btn" onclick="deleteDocument('${doc._id}')" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Display recent documents
  const recent = documents.slice(0, 6);
  recentContainer.innerHTML = recent.map(doc => `
    <div class="document-card">
      <div class="document-icon">
        <i class="fas fa-file-alt"></i>
      </div>
      <div class="document-info">
        <div class="document-name">${doc.name}</div>
        <div class="document-meta">${new Date(doc.createdAt).toLocaleDateString()}</div>
      </div>
    </div>
  `).join('');
}

function displayFolders() {
  const container = document.getElementById('folders-list');

  if (folders.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">No folders yet</p>';
    return;
  }

  container.innerHTML = folders.map(folder => `
    <div class="folder-card">
      <div class="folder-icon">
        <i class="fas fa-folder"></i>
      </div>
      <div class="folder-info">
        <div class="folder-name">${folder.name}</div>
        <div class="folder-meta">
          ${new Date(folder.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  `).join('');
}

// Update UI Functions
function updateUserUI() {
  if (currentUser) {
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-avatar').src = `https://ui-avatars.com/api/?name=${currentUser.name}`;
    document.getElementById('settings-email').value = currentUser.email;
    document.getElementById('settings-name').value = currentUser.name;
    document.getElementById('settings-doc-type').value = currentUser.documentType;
  }
}

function updateFolderSelect() {
  const select = document.getElementById('upload-folder');
  const parentSelect = document.getElementById('parent-folder');
  
  select.innerHTML = '<option value="">Root</option>';
  parentSelect.innerHTML = '<option value="">Root</option>';
  
  folders.forEach(folder => {
    select.innerHTML += `<option value="${folder._id}">${folder.name}</option>`;
    parentSelect.innerHTML += `<option value="${folder._id}">${folder.name}</option>`;
  });
}

function updateShareDocumentSelect() {
  const select = document.getElementById('share-document');
  
  select.innerHTML = '<option value="">Select a document...</option>';
  
  documents.forEach(doc => {
    select.innerHTML += `<option value="${doc._id}">${doc.name}</option>`;
  });
}

function updateFileInfo() {
  const fileInput = document.getElementById('file-input');
  const fileInfo = document.getElementById('file-info');
  
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
    fileInfo.textContent = `${file.name} - ${sizeInMB} MB`;
  }
}

// Navigation Functions
function showAuthPage() {
  document.getElementById('auth-section').classList.add('active');
  document.getElementById('dashboard-section').classList.remove('active');
}

function showDashboard() {
  document.getElementById('auth-section').classList.remove('active');
  document.getElementById('dashboard-section').classList.add('active');
  showDashboardView();
}

function showDashboardView() {
  hideAllViews();
  document.getElementById('dashboard-view').classList.add('active');
  document.querySelector('.nav-item').classList.add('active');
}

function showMyDocuments() {
  hideAllViews();
  document.getElementById('documents-view').classList.add('active');
  updateNavItems(1);
}

function showFolders() {
  hideAllViews();
  document.getElementById('folders-view').classList.add('active');
  updateNavItems(2);
}

function showShared() {
  hideAllViews();
  document.getElementById('shared-view').classList.add('active');
  updateNavItems(3);
}

function showSettings() {
  hideAllViews();
  document.getElementById('settings-view').classList.add('active');
  updateNavItems(4);
}

function hideAllViews() {
  document.querySelectorAll('.view-section').forEach(view => {
    view.classList.remove('active');
  });
}

function showStats() {
  const totalSize = documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
  showToast(`Total: ${documents.length} documents, ${totalSizeMB} MB used`, 'success');
}

// Modal Functions
function openUploadModal() {
  document.getElementById('uploadModal').classList.add('active');
}

function openFolderModal() {
  document.getElementById('folderModal').classList.add('active');
}

function openShareModal() {
  document.getElementById('shareModal').classList.add('active');
  updateShareDocumentSelect();
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// Utility Functions
function toggleForms() {
  document.getElementById('login-form').classList.toggle('active');
  document.getElementById('register-form').classList.toggle('active');
}

function toggleMenu() {
  document.querySelector('.sidebar').classList.toggle('active');
}

function updateNavItems(index) {
  document.querySelectorAll('.nav-item').forEach((item, i) => {
    if (i === index) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

async function downloadDocument(docId) {
  // Implementation for downloading document
  showToast('Download feature coming soon!', 'info');
}

async function deleteDocument(docId) {
  if (confirm('Are you sure you want to delete this document?')) {
    try {
      const response = await fetch(`${API_BASE}/documents/${docId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` },
      });

      if (response.ok) {
        showToast('Document deleted successfully!', 'success');
        loadDocuments();
      }
    } catch (error) {
      showToast('Delete failed', 'error');
    }
  }
}

async function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  
  if (!query) {
    displayDocuments();
    return;
  }

  const filtered = documents.filter(doc => 
    doc.name.toLowerCase().includes(query) ||
    doc.description?.toLowerCase().includes(query) ||
    doc.tags?.some(tag => tag.toLowerCase().includes(query))
  );

  const container = document.getElementById('documents-list');
  if (filtered.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No matching documents</p>';
  } else {
    container.innerHTML = filtered.map(doc => `
      <div class="document-card">
        <div class="document-icon">
          <i class="fas fa-file-alt"></i>
        </div>
        <div class="document-info">
          <div class="document-name">${doc.name}</div>
          <div class="document-meta">${doc.documentType}</div>
        </div>
      </div>
    `).join('');
  }
}

async function updateSettings() {
  const name = document.getElementById('settings-name').value;
  const documentType = document.getElementById('settings-doc-type').value;

  currentUser.name = name;
  currentUser.documentType = documentType;
  
  showToast('Settings updated successfully!', 'success');
  updateUserUI();
}

function logout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('authToken');
  showAuthPage();
  document.getElementById('loginForm').reset();
  document.getElementById('registerForm').reset();
}

// Close modals on outside click
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});
