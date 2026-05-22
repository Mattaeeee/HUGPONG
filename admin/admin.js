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

function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
  t.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
  setTimeout(() => {
    t.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
    t.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
  }, 3000);
}

function navigate(page) {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  if (currentRole === 'admin' && page === 'sync') {
    toast('Access Denied: Requires Super Admin clearance.');
    navigate('dashboard');
    return;
  }
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  const targetEl = document.getElementById('page-' + page);
  if (targetEl) targetEl.classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const activeBtn = document.querySelector('.nav-item[data-page="' + page + '"]');
  if (activeBtn) activeBtn.classList.add('active');
  const headingEl = document.getElementById('page-heading');
  const subEl = document.getElementById('page-sub');
  if (headingEl) headingEl.textContent = PAGES[page].heading;
  if (subEl) subEl.textContent = PAGES[page].sub;
  currentPage = page;
  if (page === 'dashboard') renderDashboard();
  if (page === 'audit') resetAuditCenter();
  if (page === 'prices') renderPrices();
  if (page === 'logs') renderLogs();
  if (page === 'analytics') renderAnalytics();
  if (page === 'users') renderUsers();
  if (page === 'fields') renderFields();
  if (page === 'sync') renderSync();
}

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
    if (avatarEl) { avatarEl.textContent = 'S'; avatarEl.style.background = 'linear-gradient(135deg, #F5A623, #ff8c00)'; avatarEl.style.boxShadow = '0 0 8px rgba(245,166,35,0.5)'; }
    if (nameEl) nameEl.textContent = 'Capstone Team';
    if (roleEl) roleEl.textContent = 'Super Admin';
    if (resetBtn) resetBtn.classList.remove('hidden');
    document.querySelectorAll('.superadmin-only').forEach(el => el.classList.remove('hidden'));
  } else {
    if (avatarEl) { avatarEl.textContent = 'A'; avatarEl.style.background = ''; avatarEl.style.boxShadow = ''; }
    if (nameEl) nameEl.textContent = 'Juan dela Cruz';
    if (roleEl) roleEl.textContent = 'SRA Checker';
    if (resetBtn) resetBtn.classList.add('hidden');
    document.querySelectorAll('.superadmin-only').forEach(el => el.classList.add('hidden'));
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
      dashChangeEl.className = 'text-xs font-medium text-success';
      dashChangeEl.textContent = `↑ +Php ${change} from last week`;
    } else if (change < 0) {
      dashChangeEl.className = 'text-xs font-medium text-danger';
      dashChangeEl.textContent = `↓ -Php ${Math.abs(change)} from last week`;
    } else {
      dashChangeEl.className = 'text-xs font-medium text-hug-muted';
      dashChangeEl.textContent = `Steady weekly price`;
    }
  }

  // Set users count
  const countEl = document.getElementById('dashboard-users-count');
  const pendingEl = document.getElementById('dashboard-pending-count');
  if (countEl) countEl.textContent = `${db.users.length} Users`;
  if (pendingEl) pendingEl.textContent = `${db.pendingUsers.length} pending approvals`;

  renderPriceHistoryChart();
  renderCropStageDistribution();

  // Render dashboard pending reviews table
  const pendingLogs = db.logs.filter(l => l.status === 'Pending').slice(0, 5);
  const activitiesBody = document.getElementById('dashboard-activities-body');
  if (activitiesBody) {
    if (pendingLogs.length === 0) {
      activitiesBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:#8A9B7A;font-size:13px;">All operation logs are synced and approved.</td></tr>`;
    } else {
      activitiesBody.innerHTML = pendingLogs.map(l => `<tr onmouseover="this.style.background='#F2F4EF'" onmouseout="this.style.background=''"><td style="padding:12px 16px;font-weight:700;color:#1A2212;font-size:11px;">${l.id}</td><td style="padding:12px 16px;font-size:12px;color:#5A6B4A;">${l.fieldId}</td><td style="padding:12px 16px;"><span style="font-size:10px;font-weight:600;color:#5A6B4A;background:#F2F4EF;border:1px solid #E2E8DC;padding:2px 8px;border-radius:999px;">${l.schedule}</span></td><td style="padding:12px 16px;font-size:13px;color:#1A2212;">${l.task}</td><td style="padding:12px 16px;font-weight:700;color:#1A2212;">Php ${l.cost.toLocaleString()}</td><td style="padding:12px 16px;"><span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:#FFF3DC;color:#F5A623;">Pending</span></td></tr>`).join('');
    }
  }
}

function renderPriceHistoryChart() {
  const el = document.getElementById('price-trend-chart');
  if (!el) return;
  const db = getDB();
  const history = [...db.priceHistory].reverse();
  const prices = history.map(h => h.price);
  const weeks = history.map(h => h.week);
  const n = prices.length;
  if (!n) { el.innerHTML = '<p style="color:#8A9B7A;font-size:12px;text-align:center;padding:20px;">No price data available.</p>'; return; }
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const padB = 72, padT = 28, padL = 50, padR = 10;
  const W = 520, H = 150;
  const svgW = W + padL + padR;
  const svgH = H + padT + padB;
  const barW = Math.max(14, Math.floor((W - (n - 1) * 5) / n));
  const range = maxP - minP || 100;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(frac => ({ val: Math.round(minP + frac * range), y: padT + H - frac * H }));
  const gridLines = yTicks.map(t =>
    '<line x1="' + padL + '" y1="' + t.y + '" x2="' + (padL + W) + '" y2="' + t.y + '" stroke="#E2E8DC" stroke-width="1"/>'
    + '<text x="' + (padL - 6) + '" y="' + (t.y + 4) + '" text-anchor="end" font-size="10" fill="#8A9B7A" font-family="Inter,sans-serif">' + t.val.toLocaleString() + '</text>'
  ).join('');
  const bars = prices.map((p, i) => {
    const frac = (p - minP) / range;
    const bH = Math.max(8, Math.round(frac * H));
    const x = padL + i * (barW + 5);
    const y = padT + H - bH;
    const isLatest = i === n - 1;
    const fill = isLatest ? '#2D5016' : '#4A7C2F';
    const opacity = (0.55 + 0.45 * (i / Math.max(n - 1, 1))).toFixed(2);
    const lx = x + barW / 2;
    const ly = padT + H + 14;
    return '<rect x="' + x + '" y="' + y + '" width="' + barW + '" height="' + bH + '" rx="3" fill="' + fill + '" opacity="' + opacity + '"/>'
      + '<text x="' + lx + '" y="' + (y - 5) + '" text-anchor="middle" font-size="9" font-weight="700" fill="#2D5016" font-family="Inter,sans-serif">' + p.toLocaleString() + '</text>'
      + '<text x="' + lx + '" y="' + ly + '" text-anchor="end" font-size="9" fill="#8A9B7A" font-family="Inter,sans-serif" transform="rotate(-38 ' + lx + ' ' + ly + ')">' + weeks[i].replace('Wk', 'W') + '</text>';
  }).join('');
  el.innerHTML =
    '<div style="overflow-x:auto;">'
    + '<svg viewBox="0 0 ' + svgW + ' ' + svgH + '" style="width:100%;min-width:400px;">'
    + '<line x1="' + padL + '" y1="' + padT + '" x2="' + padL + '" y2="' + (padT + H) + '" stroke="#E2E8DC" stroke-width="1"/>'
    + gridLines + bars
    + '<text x="' + (padL + W / 2) + '" y="' + (svgH - 4) + '" text-anchor="middle" font-size="10" fill="#8A9B7A" font-family="Inter,sans-serif">Source: Official SRA Sugar Price Bulletins &amp; Facebook Broadcasts (Mar-May 2026)</text>'
    + '</svg></div>'
    + '<div style="margin-top:8px;display:flex;gap:14px;flex-wrap:wrap;">'
    + '<div style="display:flex;align-items:center;gap:5px;"><div style="width:12px;height:12px;border-radius:2px;background:#2D5016;"></div><span style="font-size:11px;color:#5A6B4A;">Latest week</span></div>'
    + '<div style="display:flex;align-items:center;gap:5px;"><div style="width:12px;height:12px;border-radius:2px;background:#4A7C2F;opacity:0.7;"></div><span style="font-size:11px;color:#5A6B4A;">Prior weeks</span></div>'
    + '<span style="font-size:11px;color:#8A9B7A;">Values in Php/Lkg (per lkg of sugar)</span>'
    + '</div>';
}

function renderCropStageDistribution() {
  const el = document.getElementById('crop-stage-visual');
  if (!el) return;
  const stages = [
    { name: 'Fertilization Stage 2', ha: 8.0, color: '#4A7C2F', field: 'FLD-KTR-001' },
    { name: 'Planting',              ha: 5.5, color: '#1A6B9A', field: 'FLD-KTR-003' },
    { name: 'Weeding',               ha: 4.5, color: '#F5A623', field: 'FLD-KTR-009' },
    { name: 'Land Preparation',      ha: 3.0, color: '#8F3A8F', field: 'FLD-KTR-003' },
    { name: 'Harvesting',            ha: 1.5, color: '#D9534F', field: 'FLD-KTR-007' },
  ];
  const total = 22.5;
  el.innerHTML = stages.map(s => {
    const pct = Math.round((s.ha / total) * 100);
    return '<div style="display:flex;flex-direction:column;gap:5px;">'
      + '<div style="display:flex;justify-content:space-between;align-items:baseline;">'
      + '<span style="font-size:12px;font-weight:600;color:#1A2212;">' + s.name + '</span>'
      + '<span style="font-size:11px;color:#8A9B7A;font-weight:500;">' + s.ha + ' Ha &middot; ' + pct + '%</span>'
      + '</div>'
      + '<div style="width:100%;height:10px;background:#E2E8DC;border-radius:999px;overflow:hidden;">'
      + '<div style="width:' + pct + '%;height:100%;background:' + s.color + ';border-radius:999px;"></div>'
      + '</div>'
      + '<span style="font-size:10px;color:#8A9B7A;">Field: ' + s.field + '</span>'
      + '</div>';
  }).join('');
}

// ── SRA AUDIT CENTER CONTROLLERS ─────────────────────────
function resetAuditCenter() {
  const emptyView = document.getElementById('audit-empty-view');
  const sheetView = document.getElementById('audit-certificate-sheet');
  const reportCard = document.getElementById('audit-report-card');
  if (emptyView) emptyView.style.display = 'block';
  if (sheetView) sheetView.classList.add('hidden');
  if (reportCard) {
    reportCard.style.cssText = 'display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:2.5rem;';
  }
  const input = document.getElementById('manual-qr-input');
  if (input) input.value = '';
}

function submitManualQR() {
  const val = document.getElementById('manual-qr-input').value.trim().toUpperCase();
  if (!val) { toast('Please enter an audit hash code.'); return; }
  if (val === 'HUG-202605-A3F9') {
    toast('Verifying code details...');
    setTimeout(() => { loadAuditCertificate(val); toast('Verification complete. Audit certificate loaded.'); }, 500);
  } else {
    toast('Error: Invalid QR Audit compiler hash code.');
  }
}

function loadAuditCertificate(hash) {
  const emptyView = document.getElementById('audit-empty-view');
  const sheetView = document.getElementById('audit-certificate-sheet');
  const tableBody = document.getElementById('audit-certificate-table-body');
  const reportCard = document.getElementById('audit-report-card');
  if (emptyView) emptyView.style.display = 'none';
  if (sheetView) sheetView.classList.remove('hidden');
  if (reportCard) {
    reportCard.style.cssText = 'display:flex;flex-direction:column;justify-content:flex-start;align-items:stretch;text-align:left;padding:1.5rem;';
  }
  const db = getDB();
  const audLogs = db.logs.filter(l => l.id.startsWith('AUD-'));
  if (tableBody) {
    tableBody.innerHTML = audLogs.map(l => {
      const badge = l.status === 'Approved'
        ? '<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:#E8F5E8;color:#3A8F3A;">Approved</span>'
        : l.status === 'Pending'
        ? '<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:#FFF3DC;color:#F5A623;">Pending</span>'
        : '<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:#FEEBEB;color:#D9534F;">Flagged</span>';
      return '<tr style="border-bottom:1px solid #E2E8DC;">'
        + '<td style="padding:8px 12px;font-weight:600;font-size:12px;color:#1A2212;">' + l.fieldId + '</td>'
        + '<td style="padding:8px 12px;font-size:12px;color:#5A6B4A;">' + l.schedule + '</td>'
        + '<td style="padding:8px 12px;font-size:12px;color:#1A2212;">' + l.task + '</td>'
        + '<td style="padding:8px 12px;font-weight:700;font-size:12px;">Php ' + l.cost.toLocaleString() + '</td>'
        + '<td style="padding:8px 12px;">' + badge + '</td>'
        + '</tr>';
    }).join('');
  }
}

function printCertifiedAuditReport() {
  window.print();
}

// ── PRICE MONITOR RENDERING ──────────────────────────────
function renderPrices() {
  const db = getDB();
  const body = document.getElementById('price-table-body');
  if (!body) return;

  const canDelete = localStorage.getItem('hugpong_role') === 'superadmin';
  body.innerHTML = db.priceHistory.map((p, idx) => {
    let diff = '<span style="color:#8A9B7A;font-weight:600;font-size:12px;">Steady</span>';
    if (p.change > 0) diff = '<span style="color:#3A8F3A;font-weight:700;font-size:12px;">&#9650; Php ' + p.change + '</span>';
    else if (p.change < 0) diff = '<span style="color:#D9534F;font-weight:700;font-size:12px;">&#9660; Php ' + Math.abs(p.change) + '</span>';
    const deleteBtn = canDelete ? '<button onclick="removePrice(' + idx + ')" style="color:#8A9B7A;cursor:pointer;background:none;border:none;font-size:16px;padding:0 4px;" title="Remove" onmouseover="this.style.color=\'#D9534F\'" onmouseout="this.style.color=\'#8A9B7A\'">&times;</button>' : '';
    return '<tr onmouseover="this.style.background=\'#F2F4EF\'" onmouseout="this.style.background=\'\'">'
      + '<td style="padding:12px 16px;font-size:12px;color:#5A6B4A;">' + p.date + '</td>'
      + '<td style="padding:12px 16px;font-weight:700;color:#1A2212;">' + p.week + '</td>'
      + '<td style="padding:12px 16px;font-weight:800;color:#1A2212;">Php ' + p.price.toLocaleString() + '</td>'
      + '<td style="padding:12px 16px;">' + diff + '</td>'
      + '<td style="padding:12px 16px;font-size:11px;color:#5A6B4A;font-style:italic;">' + p.source + '</td>'
      + '<td style="padding:12px 16px;text-align:right;">' + deleteBtn + '</td>'
      + '</tr>';
  }).join('');
}

// Hook Price Posting forms (attach safely if elements exist)
const addPriceBtn = document.getElementById('add-price-btn');
if (addPriceBtn) {
  addPriceBtn.addEventListener('click', () => {
    const card = document.getElementById('price-form-card');
    if (!card) return;
    card.style.display = card.style.display === 'none' ? 'block' : 'none';
    const today = new Date().toISOString().split('T')[0];
    const pDateEl = document.getElementById('p-date');
    if (pDateEl) pDateEl.value = today;
  });
}

const priceFormCancel = document.getElementById('price-form-cancel');
if (priceFormCancel) {
  priceFormCancel.addEventListener('click', () => {
    const card = document.getElementById('price-form-card');
    if (card) card.style.display = 'none';
  });
}

const priceFormSave = document.getElementById('price-form-save');
if (priceFormSave) {
  priceFormSave.addEventListener('click', () => {
    const weekEl = document.getElementById('p-week');
    const priceEl = document.getElementById('p-price');
    const dateEl = document.getElementById('p-date');
    const sourceEl = document.getElementById('p-source');
    const week = weekEl ? weekEl.value.trim() : '';
    const price = priceEl ? parseInt(priceEl.value) : NaN;
    const dateStr = dateEl ? dateEl.value : '';
    const source = sourceEl ? sourceEl.value.trim() : 'Official SRA release';

    if (!week || !price || !dateStr) {
      toast('Error: Missing required price posting values.');
      return;
    }

    const db = getDB();
    const prevPrice = db.priceHistory[0]?.price || price;
    const change = price - prevPrice;

    const dateObj = new Date(dateStr);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const formattedDate = `${months[dateObj.getMonth()]} ${String(dateObj.getDate()).padStart(2, '0')}, ${dateObj.getFullYear()}`;

    const newPost = { week, price, date: formattedDate, change, source };
    db.priceHistory.unshift(newPost);
    saveDB(db);

    const card = document.getElementById('price-form-card');
    if (card) card.style.display = 'none';
    renderPrices();
    renderDashboard();
    toast('Success: SRA Price monitor updated.');
  });
}

// Topbar logout handler (confirmation + redirect to login)
const topbarLogout = document.getElementById('topbar-logout');
if (topbarLogout) {
  topbarLogout.addEventListener('click', () => {
    const ok = confirm('Are you sure you want to sign out of HUGPONG Admin?');
    if (!ok) return;
    localStorage.removeItem('hugpong_role');
    toast('Signed out. Redirecting to login...');
    setTimeout(() => { window.location.href = 'login.html'; }, 450);
  });
}

function removePrice(idx) {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  if (currentRole !== 'superadmin') {
    toast('Access Denied: Only Super Admin can delete price records.');
    return;
  }
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
    const isActive = c.getAttribute('data-filter') === filter;
    if (isActive) {
      c.className = 'filter-chip text-sm font-medium px-4 py-1.5 rounded-full border border-primary bg-primary text-white transition-all cursor-pointer';
    } else {
      c.className = 'filter-chip text-sm font-medium px-4 py-1.5 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer';
    }
  });
  renderLogs();
}

function renderLogs() {
  const db = getDB();
  const selectField = document.getElementById('log-field-filter').value;
  const body = document.getElementById('logs-table-body');
  if (!body) return;

  let filtered = db.logs;
  if (selectField !== 'all') filtered = filtered.filter(l => l.fieldId === selectField);
  if (logStatusFilter !== 'all') filtered = filtered.filter(l => l.status === logStatusFilter);

  body.innerHTML = filtered.map(l => {
    let actionBtn = '';
    if (l.status === 'Pending') {
      actionBtn = '<button onclick="updateLogStatus(\'' + l.id + '\', \'Approved\')" style="padding:3px 10px;font-size:10px;font-weight:700;background:#3A8F3A;color:#fff;border:none;border-radius:6px;cursor:pointer;">Approve</button> '
        + '<button onclick="updateLogStatus(\'' + l.id + '\', \'Flagged\')" style="padding:3px 10px;font-size:10px;font-weight:700;border:1px solid #D9534F;color:#D9534F;background:none;border-radius:6px;cursor:pointer;">Flag</button>';
    } else if (l.status === 'Flagged') {
      actionBtn = '<button onclick="updateLogStatus(\'' + l.id + '\', \'Approved\')" style="padding:3px 10px;font-size:10px;font-weight:600;border:1px solid #E2E8DC;color:#5A6B4A;background:none;border-radius:6px;cursor:pointer;">Re-Approve</button>';
    } else {
      actionBtn = '<span style="font-size:10px;font-weight:700;color:#3A8F3A;">&#10003; Approved</span>';
    }
    const statusBadge = l.status === 'Approved'
      ? '<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:#E8F5E8;color:#3A8F3A;">Approved</span>'
      : l.status === 'Pending'
      ? '<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:#FFF3DC;color:#F5A623;">Pending</span>'
      : '<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:#FEEBEB;color:#D9534F;">Flagged</span>';
    return '<tr onmouseover="this.style.background=\'#F2F4EF\'" onmouseout="this.style.background=\'\'">'
      + '<td style="padding:12px 16px;font-weight:700;color:#1A2212;font-size:11px;">' + l.id + '</td>'
      + '<td style="padding:12px 16px;font-size:12px;color:#5A6B4A;">' + l.fieldId + '</td>'
      + '<td style="padding:12px 16px;"><span style="font-size:10px;font-weight:600;color:#5A6B4A;background:#F2F4EF;border:1px solid #E2E8DC;padding:2px 8px;border-radius:999px;">' + l.schedule + '</span></td>'
      + '<td style="padding:12px 16px;font-size:13px;color:#1A2212;">' + l.task + '</td>'
      + '<td style="padding:12px 16px;font-weight:700;color:#1A2212;">Php ' + l.cost.toLocaleString() + '</td>'
      + '<td style="padding:12px 16px;font-size:12px;color:#5A6B4A;">' + l.date + '</td>'
      + '<td style="padding:12px 16px;">' + statusBadge + '</td>'
      + '<td style="padding:12px 16px;"><div style="display:flex;gap:6px;align-items:center;">' + actionBtn + '</div></td>'
      + '</tr>';
  }).join('') || '<tr><td colspan="8" style="text-align:center;padding:30px;color:#8A9B7A;font-size:13px;">No operational records matched the selected filters.</td></tr>';
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
  const totalCostEl = document.getElementById('diagnostics-total-cost');
  if (totalCostEl) totalCostEl.textContent = 'Php 136,830';
  if (expenseBars) {
    const allocations = [
      { name: 'Land Prep & Planting',    pct: 38, cost: 52000, color: '#8F3A8F' },
      { name: 'Fertilizer (All Stages)', pct: 32, cost: 43800, color: '#4A7C2F' },
      { name: 'Labor Crew Wages',        pct: 18, cost: 24600, color: '#1A6B9A' },
      { name: 'Chemical Spraying',       pct: 8,  cost: 10950, color: '#F5A623' },
      { name: 'Other Sundry Fees',       pct: 4,  cost: 5480,  color: '#8A9B7A' },
    ];
    expenseBars.innerHTML = allocations.map(a =>
      '<div style="display:flex;flex-direction:column;gap:5px;">'
      + '<div style="display:flex;justify-content:space-between;align-items:baseline;">'
      + '<span style="font-size:12px;font-weight:600;color:#1A2212;">' + a.name + '</span>'
      + '<span style="font-size:12px;font-weight:700;color:' + a.color + ';">Php ' + a.cost.toLocaleString() + ' &middot; ' + a.pct + '%</span>'
      + '</div>'
      + '<div style="width:100%;height:12px;background:#E2E8DC;border-radius:999px;overflow:hidden;">'
      + '<div style="width:' + a.pct + '%;height:100%;background:' + a.color + ';border-radius:999px;"></div>'
      + '</div>'
      + '</div>'
    ).join('');
  }
  if (hectareBars) {
    const efficiencies = [
      { id: 'FLD-KTR-001', owner: 'Juan dela Cruz', haCost: 12400, haPct: 82,  status: 'Average',              color: '#4A7C2F' },
      { id: 'FLD-KTR-003', owner: 'Maria Santos',   haCost: 8900,  haPct: 58,  status: 'Most Efficient &#10003;', color: '#3A8F3A' },
      { id: 'FLD-KTR-007', owner: 'Pedro Reyes',    haCost: 15200, haPct: 100, status: 'Alert: Heavy Cost &#9888;', color: '#D9534F' },
      { id: 'FLD-KTR-009', owner: 'Ana Gomez',      haCost: 10100, haPct: 66,  status: 'Satisfactory',         color: '#1A6B9A' },
    ];
    hectareBars.innerHTML = efficiencies.map(e =>
      '<div style="display:flex;flex-direction:column;gap:5px;">'
      + '<div style="display:flex;justify-content:space-between;align-items:baseline;">'
      + '<span style="font-size:12px;font-weight:600;color:#1A2212;">' + e.id + ' <span style="font-size:10px;font-weight:400;color:#8A9B7A;">(' + e.owner + ')</span></span>'
      + '<span style="font-size:12px;font-weight:700;color:' + e.color + ';">Php ' + e.haCost.toLocaleString() + '/Ha</span>'
      + '</div>'
      + '<div style="width:100%;height:12px;background:#E2E8DC;border-radius:999px;overflow:hidden;">'
      + '<div style="width:' + e.haPct + '%;height:100%;background:' + e.color + ';border-radius:999px;"></div>'
      + '</div>'
      + '<span style="font-size:10px;font-weight:600;color:' + e.color + ';">' + e.status + '</span>'
      + '</div>'
    ).join('');
  }
}

// ── USER DIRECTORY CONTROLLER ────────────────────────────
function renderUsers() {
  const db = getDB();
  const usersBody = document.getElementById('users-table-body');
  const pendingList = document.getElementById('pending-users-list');

  if (usersBody) {
    usersBody.innerHTML = db.users.map(u => {
      const roleColors = { 'Super Admin': 'background:#F0E8FA;color:#6B3FA0;', 'SRA Checker': 'background:#E8F0E0;color:#2D5016;', 'Farm Manager': 'background:#E0F0FA;color:#1A6B9A;', 'Member': 'background:#F2F4EF;color:#5A6B4A;border:1px solid #E2E8DC;' };
      const rStyle = roleColors[u.role] || roleColors['Member'];
      return '<tr onmouseover="this.style.background=\'#F2F4EF\'" onmouseout="this.style.background=\'\'">'
        + '<td style="padding:12px 16px;font-weight:700;color:#1A2212;font-size:13px;">' + u.contact + '</td>'
        + '<td style="padding:12px 16px;color:#1A2212;font-size:13px;">' + u.name + '</td>'
        + '<td style="padding:12px 16px;"><span style="display:inline-block;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;' + rStyle + '">' + u.role + '</span></td>'
        + '<td style="padding:12px 16px;font-size:13px;color:#5A6B4A;">' + u.logsHandled + ' logs</td>'
        + '<td style="padding:12px 16px;font-size:12px;color:#8A9B7A;">' + u.regDate + '</td>'
        + '<td style="padding:12px 16px;text-align:right;"><button onclick="removeDirectoryUser(\'' + u.contact + '\')" style="color:#8A9B7A;cursor:pointer;background:none;border:none;font-size:18px;" title="Revoke access" onmouseover="this.style.color=\'#D9534F\'" onmouseout="this.style.color=\'#8A9B7A\'">&times;</button></td>'
        + '</tr>';
    }).join('');
  }

  if (pendingList) {
    if (db.pendingUsers.length === 0) {
      pendingList.innerHTML = '<div style="text-align:center;padding:24px;font-size:12px;color:#8A9B7A;border:1px dashed #E2E8DC;border-radius:12px;">No pending mobile registrations awaiting review.</div>';
    } else {
      pendingList.innerHTML = db.pendingUsers.map(p =>
        '<div style="border:1px solid #E2E8DC;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:10px;background:#fff;">'
        + '<div style="display:flex;justify-content:space-between;align-items:flex-start;">'
        + '<div><strong style="font-size:13px;color:#1A2212;display:block;">' + p.name + '</strong><p style="font-size:11px;color:#8A9B7A;margin-top:2px;">Applied Role: <span style="color:#2D5016;font-weight:700;">' + p.role + '</span></p></div>'
        + '<span style="font-size:10px;color:#8A9B7A;">' + p.regDate + '</span>'
        + '</div>'
        + '<p style="font-size:12px;font-weight:600;color:#5A6B4A;">PH: ' + p.contact + '</p>'
        + '<div style="display:flex;gap:8px;">'
        + '<button onclick="approveRegistration(\'' + p.contact + '\')" style="flex:1;background:#3A8F3A;color:#fff;border:none;border-radius:8px;padding:7px;font-size:11px;font-weight:700;cursor:pointer;">Confirm Approval</button>'
        + '<button onclick="rejectRegistration(\'' + p.contact + '\')" style="flex:1;border:1px solid #D9534F;color:#D9534F;background:none;border-radius:8px;padding:7px;font-size:11px;font-weight:600;cursor:pointer;">Reject</button>'
        + '</div></div>'
      ).join('');
    }
  }
}

function approveRegistration(contact) {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const db = getDB();
  const idx = db.pendingUsers.findIndex(u => u.contact === contact);
  if (idx === -1) return;

  const user = db.pendingUsers[idx];
  if (currentRole === 'admin' && (user.role === 'SRA Checker' || user.role === 'Super Admin')) {
    toast('Access Denied: Only Super Admin can approve elevated roles.');
    return;
  }

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
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const db = getDB();
  const target = db.users.find(u => u.contact === contact);
  if (!target) return;

  if (currentRole === 'admin' && (target.role === 'SRA Checker' || target.role === 'Super Admin')) {
    toast('Access Denied: SRA Checker cannot revoke admin-tier accounts.');
    return;
  }

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
    const syncBadge = f.synced
      ? '<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:#E8F5E8;color:#3A8F3A;margin-top:8px;">&#10003; Synced</span>'
      : '<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:#FEEBEB;color:#D9534F;margin-top:8px;">&#9888; ' + f.lag + '</span>';
    const warningBanner = !f.synced
      ? '<div style="margin-top:10px;background:#FEEBEB;border:1px solid rgba(217,83,79,0.3);border-radius:8px;padding:8px 10px;font-size:11px;font-weight:700;color:#D9534F;">&#9888;&#65039; ALERT: Device out of sync (' + f.lag + ')</div>' : '';
    const borderColor = f.synced ? '#E2E8DC' : '#D9534F';
    return '<div style="background:#fff;border-radius:12px;border:1px solid ' + borderColor + ';box-shadow:0 2px 12px rgba(45,80,22,0.06);padding:16px;display:flex;flex-direction:column;justify-content:space-between;gap:12px;">'
      + '<div>'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">'
      + '<strong style="font-size:15px;color:#2D5016;font-weight:800;">' + f.id + '</strong>'
      + '<span style="font-size:11px;font-weight:700;color:#5A6B4A;background:#F2F4EF;border:1px solid #E2E8DC;padding:3px 10px;border-radius:999px;">' + f.area + ' Ha</span>'
      + '</div>'
      + '<div style="display:flex;flex-direction:column;gap:4px;font-size:13px;">'
      + '<p style="color:#5A6B4A;"><strong style="color:#1A2212;">Owner:</strong> ' + f.owner + '</p>'
      + '<p style="color:#8A9B7A;font-size:11px;"><strong style="color:#5A6B4A;">Stage:</strong> ' + f.stage + '</p>'
      + '<p style="color:#8A9B7A;font-size:11px;"><strong style="color:#5A6B4A;">Crop Age:</strong> ' + f.age + '</p>'
      + '</div>'
      + syncBadge + warningBanner
      + '</div>'
      + '<div style="display:flex;gap:6px;border-top:1px solid #E2E8DC;padding-top:10px;">'
      + '<button onclick="loadFieldForEdit(\'' + f.id + '\')" style="flex:1;border:1px solid #E2E8DC;color:#5A6B4A;background:none;border-radius:8px;padding:7px;font-size:11px;font-weight:500;cursor:pointer;">Edit Field</button>'
      + '<button onclick="archiveField(\'' + f.id + '\')" style="flex:1;border:1px solid rgba(217,83,79,0.4);color:#D9534F;background:none;border-radius:8px;padding:7px;font-size:11px;font-weight:500;cursor:pointer;">Archive</button>'
      + '</div></div>';
  }).join('');
}

let editFieldId = null;

function loadFieldForEdit(fieldId) {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  if (currentRole !== 'superadmin') {
    toast('Access Denied: Requires Super Admin clearance.');
    return;
  }
  const db = getDB();
  const f = db.fields.find(field => field.id === fieldId);
  if (!f) return;

  editFieldId = fieldId;
  document.getElementById('field-form-title').textContent = 'Transfer & Edit Field Registry';
  document.getElementById('f-id').value = f.id;
  document.getElementById('f-id').disabled = true;
  document.getElementById('f-owner').value = f.owner;
  document.getElementById('f-area').value = f.area;
  document.getElementById('f-stage').value = f.stage;
  const btn = document.getElementById('save-field-action-btn');
  if (btn) btn.textContent = 'Transfer Ownership';
}

function showNewFieldForm() {
  resetFieldForm();
  document.getElementById('field-form-title').textContent = 'Assign New Field ID';
  const btn = document.getElementById('save-field-action-btn');
  if (btn) btn.textContent = 'Register';
}

function resetFieldForm() {
  editFieldId = null;
  document.getElementById('field-form-title').textContent = 'Assign New Field ID';
  document.getElementById('f-id').value = '';
  document.getElementById('f-id').disabled = false;
  document.getElementById('f-owner').value = '';
  document.getElementById('f-area').value = '';
  document.getElementById('f-stage').value = 'Land Preparation';
  const btn = document.getElementById('save-field-action-btn');
  if (btn) btn.textContent = 'Register';
}

function saveFieldChanges() {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  if (currentRole !== 'superadmin') {
    toast('Access Denied: Requires Super Admin clearance.');
    return;
  }

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
    const f = db.fields.find(field => field.id === editFieldId);
    if (f) {
      f.owner = owner;
      f.area = area;
      f.stage = stage;
      toast(`Block Owner of Field ${f.id} transferred to ${owner}`);
    }
  } else {
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
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  if (currentRole !== 'superadmin') {
    toast('Access Denied: Requires Super Admin clearance.');
    return;
  }
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

  body.innerHTML = db.syncLogs.map(l => {
    const badge = l.status === 'synced'
      ? '<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:#E8F5E8;color:#3A8F3A;">Successful</span>'
      : '<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:#FFF3DC;color:#F5A623;">Device Lag</span>';
    return '<tr onmouseover="this.style.background=\'#F2F4EF\'" onmouseout="this.style.background=\'\'">'
      + '<td style="padding:12px 16px;font-size:12px;color:#5A6B4A;">' + l.time + '</td>'
      + '<td style="padding:12px 16px;font-weight:600;color:#1A2212;font-size:13px;">' + l.device + '</td>'
      + '<td style="padding:12px 16px;font-size:13px;color:#5A6B4A;">' + l.user + '</td>'
      + '<td style="padding:12px 16px;font-size:13px;color:#1A2212;">' + l.action + '</td>'
      + '<td style="padding:12px 16px;">' + badge + '</td>'
      + '</tr>';
  }).join('');
}

// ── ROLLBACK SYSTEM STATE (DEMO TOOL) ────────────────────
function resetDemoDatabase() {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  if (currentRole !== 'superadmin') {
    toast('Access Denied: Only Super Admin can reset the demo database.');
    return;
  }
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
const currentRoleInit = localStorage.getItem('hugpong_role') || 'admin';
applyRoleLayout(currentRoleInit);
navigate('dashboard');
