// ── INITIAL STATE CONFIGURATION ──────────────────────────
const INITIAL_DATABASE = {
  fields: [
    { id: 'FLD-KTR-001', owner: 'Juan dela Cruz', area: 1.5, stage: 'Fertilization Stage 2', age: '3.2 months', synced: true, lag: 'Synced' },
    { id: 'FLD-KTR-003', owner: 'Maria Santos', area: 2.0, stage: 'Land Preparation', age: '0.3 months', synced: true, lag: 'Synced' },
    { id: 'FLD-KTR-007', owner: 'Pedro Reyes', area: 1.0, stage: 'Harvesting', age: '10.5 months', synced: false, lag: '4 days ago' },
    { id: 'FLD-KTR-009', owner: 'Ana Gomez', area: 0.8, stage: 'Weeding', age: '5.1 months', synced: true, lag: 'Synced' }
  ],
  logs: [
    // Standard schedules logs
    { id: 'L1', fieldId: 'FLD-KTR-001', schedule: 'Weekly', task: 'Weeding labor', cost: 1200, date: '2026-05-07', status: 'Approved' },
    { id: 'L2', fieldId: 'FLD-KTR-001', schedule: 'Monthly', task: 'Urea fertilizer (4 bags)', cost: 6400, date: '2026-05-01', status: 'Pending' },
    { id: 'L3', fieldId: 'FLD-KTR-003', schedule: 'Weekly', task: 'Land plowing (tractor)', cost: 5000, date: '2026-05-14', status: 'Approved' },
    
    // QR compilation logs for HUG-202605-A3F9 (compiled on May 5, total approved cost = Php 19,350)
    { id: 'AUD-001', fieldId: 'FLD-KTR-001', schedule: 'Monthly', task: 'Fertilizer application (2 bags Urea)', cost: 3200, date: '2026-04-28', status: 'Approved' },
    { id: 'AUD-002', fieldId: 'FLD-KTR-001', schedule: 'Weekly', task: 'Weeding labor', cost: 1200, date: '2026-05-02', status: 'Approved' },
    { id: 'AUD-003', fieldId: 'FLD-KTR-003', schedule: 'Weekly', task: 'Land plowing (tractor)', cost: 5000, date: '2026-04-25', status: 'Approved' },
    { id: 'AUD-004', fieldId: 'FLD-KTR-003', schedule: 'Monthly', task: 'Planting labor crew', cost: 2500, date: '2026-04-27', status: 'Approved' },
    { id: 'AUD-005', fieldId: 'FLD-KTR-007', schedule: 'Weekly', task: 'Harvesting labor', cost: 4000, date: '2026-04-30', status: 'Approved' },
    { id: 'AUD-006', fieldId: 'FLD-KTR-009', schedule: 'Weekly', task: 'Land clearing', cost: 1500, date: '2026-04-24', status: 'Approved' },
    { id: 'AUD-007', fieldId: 'FLD-KTR-009', schedule: 'Monthly', task: 'Furrowing (tractor)', cost: 1200, date: '2026-04-26', status: 'Approved' },
    { id: 'AUD-008', fieldId: 'FLD-KTR-009', schedule: 'Weekly', task: 'Weeding', cost: 750, date: '2026-05-03', status: 'Approved' },
    { id: 'AUD-009', fieldId: 'FLD-KTR-007', schedule: 'Weekly', task: 'Chemical spray', cost: 800, date: '2026-05-04', status: 'Pending' },
    { id: 'AUD-010', fieldId: 'FLD-KTR-001', schedule: 'Weekly', task: 'Excess hauling charge', cost: 1500, date: '2026-05-05', status: 'Flagged' }
  ],
  priceHistory: [
    { week: 'Wk4 May', price: 2800, date: '2026-05-21', change: 0, source: 'SRA Circular #104' },
    { week: 'Wk3 May', price: 2800, date: '2026-05-14', change: 50, source: 'SRA Circular #102' },
    { week: 'Wk2 May', price: 2750, date: '2026-05-07', change: 30, source: 'SRA Circular #101' },
    { week: 'Wk1 May', price: 2720, date: '2026-04-30', change: 20, source: 'Facebook Broadcast' },
    { week: 'Wk4 Apr', price: 2700, date: '2026-04-23', change: 50, source: 'Facebook Broadcast' },
    { week: 'Wk3 Apr', price: 2650, date: '2026-04-16', change: -20, source: 'Mill gate bulletin' },
    { week: 'Wk2 Apr', price: 2580, date: '2026-04-09', change: -20, source: 'Mill gate bulletin' },
    { week: 'Wk1 Apr', price: 2600, date: '2026-04-02', change: 50, source: 'Facebook Broadcast' },
    { week: 'Wk4 Mar', price: 2550, date: '2026-03-26', change: 70, source: 'Facebook Broadcast' },
    { week: 'Wk3 Mar', price: 2480, date: '2026-03-19', change: -20, source: 'Manual Entry' },
    { week: 'Wk2 Mar', price: 2500, date: '2026-03-12', change: 50, source: 'Facebook Broadcast' },
    { week: 'Wk1 Mar', price: 2450, date: '2026-03-05', change: 0, source: 'SRA Circular #94' }
  ],
  users: [
    { contact: '09171234567', name: 'Juan dela Cruz', role: 'SRA Checker', logsHandled: 8, regDate: '2026-03-10' },
    { contact: '09187654321', name: 'Capstone Team', role: 'Super Admin', logsHandled: 12, regDate: '2026-02-15' },
    { contact: '09123456789', name: 'Maria Santos', role: 'Farm Manager', logsHandled: 24, regDate: '2026-03-01' },
    { contact: '09987654321', name: 'Pedro Reyes', role: 'Member', logsHandled: 6, regDate: '2026-03-15' },
    { contact: '09555444333', name: 'Ana Gomez', role: 'Member', logsHandled: 4, regDate: '2026-04-01' }
  ],
  pendingUsers: [
    { contact: '09888777666', name: 'Kabo Ramon', role: 'Farm Manager', regDate: '2026-05-20' },
    { contact: '09666555444', name: 'Cabo Gardo', role: 'Member', regDate: '2026-05-21' }
  ],
  syncLogs: [
    { time: '12:45 AM', device: 'iPhone 13 - Maria Santos', user: 'Maria Santos', action: 'Price Cache Synchronized', status: 'synced' },
    { time: '11:30 PM', device: 'Android - Pedro Reyes', user: 'Pedro Reyes', action: 'Task Logged: Harvesting FLD-KTR-007', status: 'synced' },
    { time: '06:30 PM', device: 'iPhone 12 - Juan dela Cruz', user: 'Juan dela Cruz', action: 'Report Compiled HUG-202605-A3F9', status: 'synced' },
    { time: '04:15 PM', device: 'Terminal - Pedro Reyes', user: 'Pedro Reyes', action: 'Connection warning: FLD-KTR-007 sync pending', status: 'pending' }
  ]
};

// ── GET & SET LOCAL STORAGE DATABASE ─────────────────────
function getDB() {
  const data = localStorage.getItem('hugpong_db');
  if (!data) {
    localStorage.setItem('hugpong_db', JSON.stringify(INITIAL_DATABASE));
    return INITIAL_DATABASE;
  }
  return JSON.parse(data);
}

function saveDB(db) {
  localStorage.setItem('hugpong_db', JSON.stringify(db));
}

// ── NAVIGATION CONTROLLER ────────────────────────────────
const PAGES = {
  dashboard: { heading: 'Dashboard', sub: 'Overview of block farm operations & price trends' },
  audit: { heading: 'SRA Audit Desk', sub: 'Scan mobile compiled QR reports and verify operation logs' },
  prices: { heading: 'SRA Price Monitor', sub: 'Supervise and post official SRA Raw Sugar weekly prices' },
  logs: { heading: 'Field Operation Logs', sub: 'Review weekly and monthly operation logs logged by members' },
  analytics: { heading: 'Descriptive Analytics', sub: 'Macro-level diagnostic diagnostics on costs and hectare efficiency' },
  users: { heading: 'User Management', sub: 'Review active directory roles and approve pending registrations' },
  fields: { heading: 'Block Farm Registry', sub: 'Supervise registered Field IDs, transfer ownerships, and track sync statuses' },
  sync: { heading: 'Sync Audit Monitor', sub: 'Audit mobile terminals transactions synchronization logs' }
};

let currentPage = 'dashboard';
let logStatusFilter = 'all';

function navigate(page) {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  
  // Guard access to super admin only screens
  if (currentRole === 'admin' && (page === 'fields' || page === 'sync')) {
    toast('Access Denied: Requires Super Admin clearance.');
    navigate('dashboard');
    return;
  }

  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  const targetEl = document.getElementById(`page-${page}`);
  if (targetEl) targetEl.classList.remove('hidden');

  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === page);
  });

  const headingEl = document.getElementById('page-heading');
  const subEl = document.getElementById('page-sub');
  if (headingEl) headingEl.textContent = PAGES[page].heading;
  if (subEl) subEl.textContent = PAGES[page].sub;

  currentPage = page;

  // Trigger page renders
  if (page === 'dashboard') renderDashboard();
  if (page === 'audit') resetAuditCenter();
  if (page === 'prices') renderPrices();
  if (page === 'logs') renderLogs();
  if (page === 'analytics') renderAnalytics();
  if (page === 'users') renderUsers();
  if (page === 'fields') renderFields();
  if (page === 'sync') renderSync();
}

// ── SYSTEM NOTIFICATIONS ─────────────────────────────────
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── ROLE INTERACTIVES ────────────────────────────────────
function switchRole(role) {
  localStorage.setItem('hugpong_role', role);
  applyRoleLayout(role);
  toast(`Switched identity to: ${role === 'superadmin' ? 'Super Admin' : 'SRA Checker'}`);
  navigate('dashboard');
}

function applyRoleLayout(role) {
  const avatarEl = document.getElementById('sidebar-admin-avatar');
  const nameEl = document.getElementById('sidebar-admin-name');
  const roleEl = document.getElementById('sidebar-admin-role');
  const resetBtn = document.getElementById('reset-demo-btn');
  const toggleSelect = document.getElementById('role-toggle-select');

  if (toggleSelect) toggleSelect.value = role;

  if (role === 'superadmin') {
    if (avatarEl) {
      avatarEl.textContent = 'S';
      avatarEl.classList.add('superadmin');
    }
    if (nameEl) nameEl.textContent = 'Capstone Team';
    if (roleEl) roleEl.textContent = 'Super Admin';
    if (resetBtn) resetBtn.style.display = 'block';

    // Show superadmin sidebar options
    document.querySelectorAll('.superadmin-only').forEach(el => {
      el.style.setProperty('display', 'flex', 'important');
    });
  } else {
    if (avatarEl) {
      avatarEl.textContent = 'A';
      avatarEl.classList.remove('superadmin');
    }
    if (nameEl) nameEl.textContent = 'Juan dela Cruz';
    if (roleEl) roleEl.textContent = 'SRA Checker';
    if (resetBtn) resetBtn.style.display = 'none';

    // Hide superadmin sidebar options
    document.querySelectorAll('.superadmin-only').forEach(el => {
      el.style.setProperty('display', 'none', 'important');
    });
  }
}

// ── DASHBOARD VIEW ───────────────────────────────────────
function renderDashboard() {
  const db = getDB();

  // Load prices KPIs
  const currentPrice = db.priceHistory[0].price;
  const prevPrice = db.priceHistory[1].price;
  const change = currentPrice - prevPrice;
  
  const topPriceEl = document.getElementById('topbar-sugar-price');
  const dashPriceEl = document.getElementById('dashboard-sugar-price');
  const dashChangeEl = document.getElementById('dashboard-sugar-change');
  
  if (topPriceEl) topPriceEl.textContent = `Php ${currentPrice.toLocaleString()}`;
  if (dashPriceEl) dashPriceEl.textContent = `Php ${currentPrice.toLocaleString()}`;
  
  if (dashChangeEl) {
    if (change > 0) {
      dashChangeEl.className = 'kpi-change up';
      dashChangeEl.textContent = `↑ +Php ${change} from last week`;
    } else if (change < 0) {
      dashChangeEl.className = 'kpi-change warn';
      dashChangeEl.style.color = 'var(--danger)';
      dashChangeEl.textContent = `↓ -Php ${Math.abs(change)} from last week`;
    } else {
      dashChangeEl.className = 'kpi-change neutral';
      dashChangeEl.textContent = `Steady weekly price`;
    }
  }

  // Set users count
  const countEl = document.getElementById('dashboard-users-count');
  const pendingEl = document.getElementById('dashboard-pending-count');
  if (countEl) countEl.textContent = `${db.users.length} Users`;
  if (pendingEl) pendingEl.textContent = `${db.pendingUsers.length} pending approvals`;

  // Render Price Trend Visual Chart (12 Bars)
  renderPriceHistoryChart();

  // Render Crop Distribution (SVG visual bars)
  renderCropStageDistribution();

  // Render dashboard pending reviews table
  const pendingLogs = db.logs.filter(l => l.status === 'Pending').slice(0, 5);
  const activitiesBody = document.getElementById('dashboard-activities-body');
  if (activitiesBody) {
    if (pendingLogs.length === 0) {
      activitiesBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--text-muted);">✓ All operation logs synced & approved.</td></tr>`;
    } else {
      activitiesBody.innerHTML = pendingLogs.map(l => `
        <tr>
          <td><strong>${l.id}</strong></td>
          <td>${l.fieldId}</td>
          <td>${l.schedule}</td>
          <td>${l.task}</td>
          <td>Php ${l.cost.toLocaleString()}</td>
          <td><span class="status-badge status-pending">Pending</span></td>
        </tr>
      `).join('');
    }
  }
}

// Draw dynamic HSL tailored bar chart for weekly price history (12 weeks)
function renderPriceHistoryChart() {
  const el = document.getElementById('price-trend-chart');
  if (!el) return;

  const db = getDB();
  const history = [...db.priceHistory].reverse(); // oldest first
  const prices = history.map(h => h.price);
  const labels = history.map(h => h.week);
  
  const min = Math.min(...prices) - 50;
  const max = Math.max(...prices) + 50;
  const range = max - min;

  el.innerHTML = labels.map((l, i) => {
    const heightPct = Math.round(((prices[i] - min) / range) * 100);
    return `
      <div class="lc-bar-wrap" style="position:relative;" title="Price: Php ${prices[i].toLocaleString()} (Week: ${l})">
        <div style="font-size: 8px; font-weight:700; color:var(--primary); margin-bottom:2px;">${prices[i]}</div>
        <div class="lc-bar" style="height:${Math.max(15, heightPct)}%; width: 24px; border-radius: 4px 4px 0 0; background: linear-gradient(180deg, var(--primary-light), var(--primary)); transition: height 0.6s ease;"></div>
        <span class="lc-label" style="font-size:9px; font-weight:600; margin-top:4px; transform: rotate(-30deg); display:inline-block; white-space:nowrap;">${l.replace('Wk', 'W')}</span>
      </div>
    `;
  }).join('');
}

// Render dynamic crop stages using SVG horizontal bars
function renderCropStageDistribution() {
  const el = document.getElementById('crop-stage-visual');
  if (!el) return;

  const db = getDB();
  // Calculate total Ha in each stage
  const stages = {
    'Land Preparation': 3.0,
    'Planting': 5.5,
    'Fertilization Stage 2': 8.0,
    'Weeding': 4.5,
    'Harvesting': 1.5
  };
  const colors = {
    'Land Preparation': '#8F3A8F', // purple
    'Planting': '#1A6B9A', // blue
    'Fertilization Stage 2': '#4A7C2F', // primary
    'Weeding': '#F5A623', // orange
    'Harvesting': '#D9534F' // red
  };
  const totalHa = 22.5;

  el.innerHTML = Object.keys(stages).map(stage => {
    const ha = stages[stage];
    const pct = Math.round((ha / totalHa) * 100);
    return `
      <div style="display:flex; flex-direction:column; gap:4px;">
        <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600;">
          <span style="color:var(--text);">${stage}</span>
          <span style="color:var(--text-2);">${ha} Ha (${pct}%)</span>
        </div>
        <div style="width:100%; height:8px; background:var(--border); border-radius:10px; overflow:hidden;">
          <div style="width:${pct}%; height:100%; background:${colors[stage]}; border-radius:10px; transition:width 0.6s ease;"></div>
        </div>
      </div>
    `;
  }).join('');
}

// ── SRA AUDIT CENTER CONTROLLERS ─────────────────────────
function resetAuditCenter() {
  const emptyView = document.getElementById('audit-empty-view');
  const sheetView = document.getElementById('audit-certificate-sheet');
  const scannerStatus = document.getElementById('scanner-feed-status');

  if (emptyView) emptyView.style.display = 'block';
  if (sheetView) sheetView.style.display = 'none';
  if (scannerStatus) {
    scannerStatus.innerHTML = `<span class="price-dot" style="background:#8a9b7a;"></span> Camera Standby`;
  }
}

function simulateQRScanning() {
  const statusEl = document.getElementById('scanner-feed-status');
  if (!statusEl) return;

  statusEl.innerHTML = `<span class="price-dot" style="background:var(--accent);"></span> Initializing mobile camera feed...`;
  
  setTimeout(() => {
    statusEl.innerHTML = `<span class="price-dot" style="background:var(--blue); animation:pulse 1s infinite;"></span> Scanning viewfinder...`;
  }, 1000);

  setTimeout(() => {
    statusEl.innerHTML = `<span class="price-dot" style="background:var(--success);"></span> Decrypting HUG-202605-A3F9`;
    document.getElementById('manual-qr-input').value = 'HUG-202605-A3F9';
    
    // Loaded!
    setTimeout(() => {
      loadAuditCertificate('HUG-202605-A3F9');
      toast('QR Audit verified successfully.');
    }, 800);
  }, 2300);
}

function submitManualQR() {
  const val = document.getElementById('manual-qr-input').value.trim().toUpperCase();
  if (val === 'HUG-202605-A3F9') {
    toast('Verifying code details...');
    setTimeout(() => {
      loadAuditCertificate(val);
      toast('Verification complete.');
    }, 500);
  } else {
    toast('Error: Invalid QR Audit compiler hash code.');
  }
}

function loadAuditCertificate(hash) {
  const emptyView = document.getElementById('audit-empty-view');
  const sheetView = document.getElementById('audit-certificate-sheet');
  const tableBody = document.getElementById('audit-certificate-table-body');
  
  if (emptyView) emptyView.style.display = 'none';
  if (sheetView) sheetView.style.display = 'flex';

  const db = getDB();
  const audLogs = db.logs.filter(l => l.id.startsWith('AUD-'));

  if (tableBody) {
    tableBody.innerHTML = audLogs.map(l => `
      <tr>
        <td><strong>${l.fieldId}</strong></td>
        <td>${l.schedule}</td>
        <td>${l.task}</td>
        <td><strong>Php ${l.cost.toLocaleString()}</strong></td>
        <td><span class="status-badge ${l.status === 'Approved' ? 'status-completed' : (l.status === 'Pending' ? 'status-pending' : 'status-completed')}" style="${l.status === 'Flagged' ? 'background:#feebeb; color:#d9534f;' : ''}">${l.status}</span></td>
      </tr>
    `).join('');
  }
}

function printCertifiedAuditReport() {
  // Save current theme layout elements and trigger print
  window.print();
}

// ── PRICE MONITOR RENDERING ──────────────────────────────
function renderPrices() {
  const db = getDB();
  const body = document.getElementById('price-table-body');
  if (!body) return;

  body.innerHTML = db.priceHistory.map((p, idx) => {
    let diff = 'Steady';
    let style = 'color:var(--text-muted); font-weight:600;';
    if (p.change > 0) {
      diff = `▲ Php ${p.change}`;
      style = 'color:var(--success); font-weight:700;';
    } else if (p.change < 0) {
      diff = `▼ Php ${Math.abs(p.change)}`;
      style = 'color:var(--danger); font-weight:700;';
    }
    return `
      <tr>
        <td>${p.date}</td>
        <td><strong>${p.week}</strong></td>
        <td><strong>Php ${p.price.toLocaleString()}</strong></td>
        <td><span style="${style}">${diff}</span></td>
        <td><span style="font-size:11px; color:var(--text-2); font-style:italic;">${p.source}</span></td>
        <td>
          <button class="btn-icon" onclick="removePrice(${idx})" title="Remove record">✗</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Hook Price Posting forms
document.getElementById('add-price-btn').addEventListener('click', () => {
  const card = document.getElementById('price-form-card');
  if (!card) return;
  card.style.display = card.style.display === 'none' ? 'block' : 'none';
  
  // Set date default to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('p-date').value = today;
});

document.getElementById('price-form-cancel').addEventListener('click', () => {
  document.getElementById('price-form-card').style.display = 'none';
});

document.getElementById('price-form-save').addEventListener('click', () => {
  const week = document.getElementById('p-week').value.trim();
  const price = parseInt(document.getElementById('p-price').value);
  const dateStr = document.getElementById('p-date').value;
  const source = document.getElementById('p-source').value.trim() || 'Official SRA release';

  if (!week || !price || !dateStr) {
    toast('Error: Missing required price posting values.');
    return;
  }

  const db = getDB();
  const prevPrice = db.priceHistory[0]?.price || price;
  const change = price - prevPrice;

  // Format date to: Month Day, Year
  const dateObj = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const formattedDate = `${months[dateObj.getMonth()]} ${String(dateObj.getDate()).padStart(2, '0')}, ${dateObj.getFullYear()}`;

  const newPost = { week, price, date: formattedDate, change, source };
  db.priceHistory.unshift(newPost);
  saveDB(db);

  document.getElementById('price-form-card').style.display = 'none';
  
  // Refresh views
  renderPrices();
  renderDashboard();
  toast('Success: SRA Price monitor updated.');
});

function removePrice(idx) {
  const db = getDB();
  db.priceHistory.splice(idx, 1);
  saveDB(db);
  renderPrices();
  renderDashboard();
  toast('Sugar Price record removed.');
}

// ── OPERATION LOGS ───────────────────────────────────────
function setLogFilter(filter) {
  logStatusFilter = filter;
  document.querySelectorAll('#page-logs .filter-chip').forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-filter') === filter);
  });
  renderLogs();
}

function renderLogs() {
  const db = getDB();
  const selectField = document.getElementById('log-field-filter').value;
  const body = document.getElementById('logs-table-body');
  if (!body) return;

  let filtered = db.logs;

  // Field Filter
  if (selectField !== 'all') {
    filtered = filtered.filter(l => l.fieldId === selectField);
  }

  // Status Filter
  if (logStatusFilter !== 'all') {
    filtered = filtered.filter(l => l.status === logStatusFilter);
  }

  if (filtered.length === 0) {
    body.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--text-muted);">No operational records matched logs filters.</td></tr>`;
    return;
  }

  body.innerHTML = filtered.map((l, index) => {
    let actionBtn = '';
    if (l.status === 'Pending') {
      actionBtn = `
        <button class="btn-primary" onclick="updateLogStatus('${l.id}', 'Approved')" style="padding:4px 8px; font-size:11px; background:var(--success);">Approve</button>
        <button class="btn-outline" onclick="updateLogStatus('${l.id}', 'Flagged')" style="padding:4px 8px; font-size:11px; border-color:var(--danger); color:var(--danger);">Flag</button>
      `;
    } else if (l.status === 'Flagged') {
      actionBtn = `
        <button class="btn-outline" onclick="updateLogStatus('${l.id}', 'Approved')" style="padding:4px 8px; font-size:11px;">Re-Approve</button>
      `;
    } else {
      actionBtn = `
        <span style="font-size:11px; color:var(--text-muted); font-weight:600;">Approved</span>
      `;
    }

    return `
      <tr>
        <td><strong>${l.id}</strong></td>
        <td>${l.fieldId}</td>
        <td><span class="cabo-meta" style="padding:3px 8px; font-size:10px;">${l.schedule}</span></td>
        <td>${l.task}</td>
        <td><strong>Php ${l.cost.toLocaleString()}</strong></td>
        <td>${l.date}</td>
        <td><span class="status-badge ${l.status === 'Approved' ? 'status-completed' : (l.status === 'Pending' ? 'status-pending' : 'status-completed')}" style="${l.status === 'Flagged' ? 'background:#feebeb; color:#d9534f;' : ''}">${l.status}</span></td>
        <td><div style="display:flex; gap:6px;">${actionBtn}</div></td>
      </tr>
    `;
  }).join('');
}

function updateLogStatus(logId, newStatus) {
  const db = getDB();
  const log = db.logs.find(l => l.id === logId);
  if (!log) return;
  log.status = newStatus;
  saveDB(db);
  renderLogs();
  renderDashboard();
  toast(`Operational Log ${logId} state updated to: ${newStatus}`);
}

// ── DESCRIPTIVE DIAGNOSTICS VIEW ─────────────────────────
function renderAnalytics() {
  const expenseBars = document.getElementById('expense-distribution-bars');
  const hectareBars = document.getElementById('cost-per-hectare-bars');
  
  if (expenseBars) {
    const allocations = [
      { name: 'Land Prep & Planting', pct: 38, cost: 52000, color: '#8F3A8F' },
      { name: 'Fertilizer (All Stages)', pct: 32, cost: 43800, color: '#4A7C2F' },
      { name: 'Labor Crew Wages', pct: 18, cost: 24600, color: '#1A6B9A' },
      { name: 'Chemical Spraying', pct: 8, cost: 10950, color: '#F5A623' },
      { name: 'Other Sundry Fees', pct: 4, cost: 5480, color: '#8A9B7A' }
    ];

    expenseBars.innerHTML = allocations.map(a => `
      <div style="display:flex; flex-direction:column; gap:4px;">
        <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600;">
          <span>${a.name}</span>
          <strong>Php ${a.cost.toLocaleString()} (${a.pct}%)</strong>
        </div>
        <div style="width:100%; height:12px; background:var(--border); border-radius:6px; overflow:hidden;">
          <div style="width:${a.pct}%; height:100%; background:${a.color}; border-radius:6px; transition:width 0.6s ease;"></div>
        </div>
      </div>
    `).join('');
  }

  if (hectareBars) {
    const efficiencies = [
      { id: 'FLD-KTR-001 (Juan dela Cruz)', haCost: 12400, haPct: 81, status: 'Average', color: 'var(--primary-light)' },
      { id: 'FLD-KTR-003 (Maria Santos)', haCost: 8900, haPct: 58, status: 'Highly Efficient', color: 'var(--success)' },
      { id: 'FLD-KTR-007 (Pedro Reyes)', haCost: 15200, haPct: 100, status: 'Alert: Heavy Cost', color: 'var(--danger)' },
      { id: 'FLD-KTR-009 (Ana Gomez)', haCost: 10100, haPct: 66, status: 'Satisfactory', color: 'var(--blue)' }
    ];

    hectareBars.innerHTML = efficiencies.map(e => `
      <div style="display:flex; flex-direction:column; gap:4px;">
        <div style="display:flex; justify-content:space-between; font-size:12px;">
          <span style="font-weight:600;">${e.id}</span>
          <span style="font-size:11px; font-weight:700; color:${e.color};">${e.status}</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="flex:1; height:12px; background:var(--border); border-radius:6px; overflow:hidden;">
            <div style="width:${e.haPct}%; height:100%; background:${e.color}; border-radius:6px; transition:width 0.6s ease;"></div>
          </div>
          <strong style="font-size:12px; min-width:85px; text-align:right;">Php ${e.haCost.toLocaleString()}/Ha</strong>
        </div>
      </div>
    `).join('');
  }
}

// ── USER DIRECTORY CONTROLLER ────────────────────────────
function renderUsers() {
  const db = getDB();
  const usersBody = document.getElementById('users-table-body');
  const pendingList = document.getElementById('pending-users-list');

  if (usersBody) {
    usersBody.innerHTML = db.users.map(u => `
      <tr>
        <td><strong>${u.contact}</strong></td>
        <td>${u.name}</td>
        <td><span class="badge-role ${u.role === 'Super Admin' ? 'superadmin' : (u.role === 'SRA Checker' ? 'checker' : (u.role === 'Farm Manager' ? 'manager' : 'member'))}">${u.role}</span></td>
        <td>${u.logsHandled} logs submitted</td>
        <td>${u.regDate}</td>
        <td><button class="btn-icon" onclick="removeDirectoryUser('${u.contact}')" title="Revoke directory status">✗</button></td>
      </tr>
    `).join('');
  }

  if (pendingList) {
    if (db.pendingUsers.length === 0) {
      pendingList.innerHTML = `<div style="text-align:center; padding:20px; font-size:12px; color:var(--text-muted); border:1px dashed var(--border); border-radius:8px;">No pending mobile registrations awaiting review.</div>`;
    } else {
      pendingList.innerHTML = db.pendingUsers.map(p => `
        <div class="capi-card" style="border:1px solid var(--border); border-radius:8px; padding:12px; display:flex; flex-direction:column; gap:8px; background:var(--surface);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <strong style="font-size:13px; color:var(--text);">${p.name}</strong>
              <p style="font-size:11px; color:var(--text-muted); font-weight:500;">Role Applied: <span style="color:var(--primary); font-weight:700;">${p.role}</span></p>
            </div>
            <span style="font-size:10px; color:var(--text-muted);">${p.regDate}</span>
          </div>
          <div style="font-size:12px; font-weight:600; color:var(--text-2);">PH Number: ${p.contact}</div>
          <div style="display:flex; gap:8px;">
            <button class="btn-primary" onclick="approveRegistration('${p.contact}')" style="flex:1; padding:6px; font-size:11px; background:var(--success);">Confirm Approval</button>
            <button class="btn-outline" onclick="rejectRegistration('${p.contact}')" style="flex:1; padding:6px; font-size:11px; border-color:var(--danger); color:var(--danger);">Reject</button>
          </div>
        </div>
      `).join('');
    }
  }
}

function approveRegistration(contact) {
  const db = getDB();
  const idx = db.pendingUsers.findIndex(u => u.contact === contact);
  if (idx === -1) return;

  const user = db.pendingUsers[idx];
  db.pendingUsers.splice(idx, 1);
  db.users.push({
    contact: user.contact,
    name: user.name,
    role: user.role,
    logsHandled: 0,
    regDate: new Date().toISOString().split('T')[0]
  });
  saveDB(db);
  renderUsers();
  renderDashboard();
  toast(`Member Approved: ${user.name} now registered in Block Farm.`);
}

function rejectRegistration(contact) {
  const db = getDB();
  const idx = db.pendingUsers.findIndex(u => u.contact === contact);
  if (idx === -1) return;

  const user = db.pendingUsers[idx];
  db.pendingUsers.splice(idx, 1);
  saveDB(db);
  renderUsers();
  renderDashboard();
  toast(`Registration Rejected for number: ${contact}`);
}

function removeDirectoryUser(contact) {
  const db = getDB();
  db.users = db.users.filter(u => u.contact !== contact);
  saveDB(db);
  renderUsers();
  renderDashboard();
  toast(`User Access Revoked for contact: ${contact}`);
}

// ── FIELD REGISTRY DYNAMIC CRUD ──────────────────────────
function renderFields() {
  const db = getDB();
  const gridContainer = document.getElementById('fields-grid-container');
  if (!gridContainer) return;

  gridContainer.innerHTML = db.fields.map(f => {
    let warningIcon = '';
    let warningStyle = '';
    if (!f.synced) {
      warningIcon = `
        <div style="background:#feebeb; color:var(--danger); border:1px solid #fcd2d2; border-radius:6px; padding:6px 10px; font-size:11px; font-weight:700; margin-top:8px; display:flex; align-items:center; gap:6px;">
          ⚠️ ALERT: Device Terminal out of sync (${f.lag})
        </div>
      `;
      warningStyle = 'border-color:var(--danger);';
    }

    return `
      <div class="card" style="padding:16px; display:flex; flex-direction:column; justify-content:space-between; ${warningStyle}">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <strong style="font-size:16px; color:var(--primary); font-weight:800;">${f.id}</strong>
            <span class="status-badge" style="font-size:11px; background:var(--bg); color:var(--text-2); font-weight:700;">${f.area} Ha</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:4px; font-size:13px;">
            <p style="color:var(--text-2);"><strong>Owner Manager:</strong> ${f.owner}</p>
            <p style="color:var(--text-muted); font-size:11px;"><strong>Soil Stage:</strong> <span style="color:var(--text-2); font-weight:600;">${f.stage}</span></p>
            <p style="color:var(--text-muted); font-size:11px;"><strong>Crop Age:</strong> <span style="color:var(--text-2); font-weight:600;">${f.age}</span></p>
          </div>
        </div>
        <div>
          ${warningIcon}
          <div style="display:flex; gap:6px; margin-top:12px; border-top:1px solid var(--border); padding-top:10px;">
            <button class="btn-outline" onclick="loadFieldForEdit('${f.id}')" style="flex:1; padding:6px; font-size:11px;">Edit Field</button>
            <button class="btn-outline" onclick="archiveField('${f.id}')" style="flex:1; padding:6px; font-size:11px; border-color:rgba(217, 83, 79, 0.4); color:var(--danger);">Archive</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

let editFieldId = null;

function loadFieldForEdit(fieldId) {
  const db = getDB();
  const f = db.fields.find(field => field.id === fieldId);
  if (!f) return;

  editFieldId = fieldId;
  document.getElementById('field-form-title').textContent = 'Transfer & Edit Field Registry';
  document.getElementById('f-id').value = f.id;
  document.getElementById('f-id').disabled = true; // cannot change code directly
  document.getElementById('f-owner').value = f.owner;
  document.getElementById('f-area').value = f.area;
  document.getElementById('f-stage').value = f.stage;
  document.getElementById('save-field-action-btn').textContent = 'Transfer Ownership';
}

function resetFieldForm() {
  editFieldId = null;
  document.getElementById('field-form-title').textContent = 'Assign New Field ID';
  document.getElementById('f-id').value = '';
  document.getElementById('f-id').disabled = false;
  document.getElementById('f-owner').value = '';
  document.getElementById('f-area').value = '';
  document.getElementById('f-stage').value = 'Land Preparation';
  document.getElementById('save-field-action-btn').textContent = 'Register';
}

function saveFieldChanges() {
  const id = document.getElementById('f-id').value.trim().toUpperCase();
  const owner = document.getElementById('f-owner').value.trim();
  const area = parseFloat(document.getElementById('f-area').value);
  const stage = document.getElementById('f-stage').value;

  if (!id || !owner || isNaN(area)) {
    toast('Error: Missing operational registry parameters.');
    return;
  }

  const db = getDB();
  if (editFieldId) {
    // Modify existing
    const f = db.fields.find(field => field.id === editFieldId);
    if (f) {
      f.owner = owner;
      f.area = area;
      f.stage = stage;
      toast(`Block Owner of Field ${f.id} transferred to ${owner}`);
    }
  } else {
    // Add new
    if (db.fields.some(f => f.id === id)) {
      toast('Error: Field ID code already registered.');
      return;
    }
    db.fields.push({ id, owner, area, stage, age: '0.1 months', synced: true, lag: 'Synced' });
    toast(`Registered field ${id} assigned to ${owner}`);
  }

  saveDB(db);
  resetFieldForm();
  renderFields();
  renderDashboard();
}

function archiveField(fieldId) {
  if (!confirm(`Are you sure you want to archive Field ${fieldId}?`)) return;
  const db = getDB();
  db.fields = db.fields.filter(f => f.id !== fieldId);
  saveDB(db);
  renderFields();
  renderDashboard();
  toast(`Field ${fieldId} archived successfully.`);
}

// ── SYNC MONITOR transactions ────────────────────────────
function renderSync() {
  const db = getDB();
  const body = document.getElementById('sync-log-body');
  if (!body) return;

  body.innerHTML = db.syncLogs.map(l => `
    <tr>
      <td>${l.time}</td>
      <td><strong>${l.device}</strong></td>
      <td>${l.user}</td>
      <td>${l.action}</td>
      <td><span class="status-badge ${l.status === 'synced' ? 'status-completed' : 'status-pending'}">${l.status === 'synced' ? 'Successful' : 'Device Lag'}</span></td>
    </tr>
  `).join('');
}

// ── ROLLBACK SYSTEM STATE (DEMO TOOL) ────────────────────
function resetDemoDatabase() {
  if (!confirm('Are you sure you want to completely rollback the HUGPONG demo state?')) return;
  localStorage.setItem('hugpong_db', JSON.stringify(INITIAL_DATABASE));
  toast('Rolling back database tokens...');
  setTimeout(() => {
    toast('Data synchronizations complete. Loading clean SRA metrics...');
    setTimeout(() => {
      navigate('dashboard');
      toast('System database reset to initial mock configurations.');
    }, 800);
  }, 1000);
}

// ── REFRESH CONTROL ──────────────────────────────────────
const refreshBtn = document.getElementById('topbar-refresh');
if (refreshBtn) {
  refreshBtn.addEventListener('click', () => {
    toast('Cloud servers synchronized.');
    navigate(currentPage);
  });
}

// ── SIDEBAR TOGGLES (MOBILE) ──────────────────────────────
const toggleBtn = document.getElementById('sidebar-toggle');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('open');
  });
}

// Handle sidebar nav link attachments
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    navigate(btn.dataset.page);
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('open');
  });
});

// ── INITIALIZING PORTAL INTERFACES ───────────────────────
const currentRole = localStorage.getItem('hugpong_role') || 'admin';
applyRoleLayout(currentRole);
navigate('dashboard');
