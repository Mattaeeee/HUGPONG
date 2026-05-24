// ── INITIAL STATE CONFIGURATION ──────────────────────────
const INITIAL_DATABASE = {
  fields: [
    { id: 'FLD-KTR-001', owner: 'Juan dela Cruz', area: 1.5, stage: 'Fertilization Stage 2', age: '3.2 months', synced: true, lag: 'Synced' },
    { id: 'FLD-KTR-002', owner: 'Jose Rizal', area: 2.1, stage: 'Planting', age: '1.2 months', synced: true, lag: 'Synced' },
    { id: 'FLD-KTR-003', owner: 'Maria Santos', area: 2.0, stage: 'Land Preparation', age: '0.3 months', synced: true, lag: 'Synced' },
    { id: 'FLD-KTR-004', owner: 'Emilio Aguinaldo', area: 1.8, stage: 'Weeding', age: '4.1 months', synced: true, lag: 'Synced' },
    { id: 'FLD-KTR-007', owner: 'Pedro Reyes', area: 1.0, stage: 'Harvesting', age: '10.5 months', synced: false, lag: '4 days ago' },
    { id: 'FLD-KTR-008', owner: 'Andres Bonifacio', area: 3.0, stage: 'Harvesting', age: '11.0 months', synced: true, lag: 'Synced' },
    { id: 'FLD-KTR-009', owner: 'Ana Gomez', area: 0.8, stage: 'Weeding', age: '5.1 months', synced: true, lag: 'Synced' },
    { id: 'FLD-KTR-010', owner: 'Apolinario Mabini', area: 1.2, stage: 'Fertilization Stage 1', age: '2.5 months', synced: true, lag: 'Synced' }
  ],
  logs: [
    // Standard schedules logs
    { id: 'L1', fieldId: 'FLD-KTR-001', schedule: 'Weekly', task: 'Weeding labor', cost: 1200, date: '2026-05-07', status: 'Approved' },
    { id: 'L2', fieldId: 'FLD-KTR-001', schedule: 'Monthly', task: 'Urea fertilizer (4 bags)', cost: 6400, date: '2026-05-01', status: 'Pending' },
    { id: 'L3', fieldId: 'FLD-KTR-003', schedule: 'Weekly', task: 'Land plowing (tractor)', cost: 5000, date: '2026-05-14', status: 'Approved' },
    { id: 'L4', fieldId: 'FLD-KTR-002', schedule: 'Weekly', task: 'Planting labor crew', cost: 3500, date: '2026-05-15', status: 'Pending' },
    { id: 'L5', fieldId: 'FLD-KTR-004', schedule: 'Monthly', task: 'Herbicide spray', cost: 1800, date: '2026-05-18', status: 'Pending' },
    
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
    { id: 'AUD-010', fieldId: 'FLD-KTR-001', schedule: 'Weekly', task: 'Excess hauling charge', cost: 1500, date: '2026-05-05', status: 'Flagged' },
    { id: 'L6', fieldId: 'FLD-KTR-008', schedule: 'Weekly', task: 'Harvesting transport', cost: 6000, date: '2026-05-20', status: 'Approved' },
    { id: 'L7', fieldId: 'FLD-KTR-010', schedule: 'Monthly', task: '18-46 Fertilizer application', cost: 4200, date: '2026-05-22', status: 'Pending' }
  ],
  priceHistory: [
    { week: 'Week 4 May', price: 2800, date: '2026-05-21', change: 0, source: 'SRA Circular #104' },
    { week: 'Week 3 May', price: 2800, date: '2026-05-14', change: 50, source: 'SRA Circular #102' },
    { week: 'Week 2 May', price: 2750, date: '2026-05-07', change: 30, source: 'SRA Circular #101' },
    { week: 'Week 1 May', price: 2720, date: '2026-04-30', change: 20, source: 'Facebook Broadcast' },
    { week: 'Week 4 Apr', price: 2700, date: '2026-04-23', change: 50, source: 'Facebook Broadcast' },
    { week: 'Week 3 Apr', price: 2650, date: '2026-04-16', change: -20, source: 'Mill gate bulletin' },
    { week: 'Week 2 Apr', price: 2580, date: '2026-04-09', change: -20, source: 'Mill gate bulletin' },
    { week: 'Week 1 Apr', price: 2600, date: '2026-04-02', change: 50, source: 'Facebook Broadcast' },
    { week: 'Week 4 Mar', price: 2550, date: '2026-03-26', change: 70, source: 'Facebook Broadcast' },
    { week: 'Week 3 Mar', price: 2480, date: '2026-03-19', change: -20, source: 'Manual Entry' },
    { week: 'Week 2 Mar', price: 2500, date: '2026-03-12', change: 50, source: 'Facebook Broadcast' },
    { week: 'Week 1 Mar', price: 2450, date: '2026-03-05', change: 0, source: 'SRA Circular #94' }
  ],
  users: [
    { contact: '09171234567', name: 'Juan dela Cruz', role: 'SRA (Admin)', blockFarm: 'All Block Farms', logsHandled: 8, regDate: '2026-03-10' },
    { contact: '09187654321', name: 'Capstone Team', role: 'Super Admin', blockFarm: 'All Block Farms', logsHandled: 12, regDate: '2026-02-15' },
    { contact: '09123456789', name: 'Maria Santos', role: 'Farm Manager', blockFarm: 'Block Farm A', logsHandled: 24, regDate: '2026-03-01' },
    { contact: '09987654321', name: 'Pedro Reyes', role: 'Member', blockFarm: 'Block Farm C', logsHandled: 6, regDate: '2026-03-15' },
    { contact: '09555444333', name: 'Ana Gomez', role: 'Member', blockFarm: 'Block Farm D', logsHandled: 4, regDate: '2026-04-01' }
  ],
  pendingUsers: [
    { contact: '09888777666', name: 'Kabo Ramon', role: 'Farm Manager', blockFarm: 'Block Farm B', regDate: '2026-05-20' },
    { contact: '09666555444', name: 'Cabo Gardo', role: 'Member', blockFarm: 'Block Farm A', regDate: '2026-05-21' }
  ],
  syncLogs: [
    { time: '12:45 AM', device: 'iPhone 13 - Maria Santos', user: 'Maria Santos', action: 'Price Cache Synchronized', status: 'synced' },
    { time: '11:30 PM', device: 'Android - Pedro Reyes', user: 'Pedro Reyes', action: 'Task Logged: Harvesting FLD-KTR-007', status: 'synced' },
    { time: '06:30 PM', device: 'iPhone 12 - Juan dela Cruz', user: 'Juan dela Cruz', action: 'Report Compiled HUG-202605-A3F9', status: 'synced' },
    { time: '04:15 PM', device: 'Terminal - Pedro Reyes', user: 'Pedro Reyes', action: 'Connection warning: FLD-KTR-007 sync pending', status: 'pending' }
  ],
  securityLogs: [
    { time: '2026-05-23 10:15 AM', user: 'Super Admin (System)', event: 'Database reset to demo state' },
    { time: '2026-05-22 08:30 AM', user: 'SRA (Admin)', event: 'Successful login from Web Console' },
    { time: '2026-05-21 04:45 PM', user: 'Farm Manager', event: 'Approved 3 logs for FLD-KTR-001' },
    { time: '2026-05-20 09:12 AM', user: 'Unknown IP', event: 'Failed login attempt - invalid credentials' },
    { time: '2026-05-19 02:22 PM', user: 'Super Admin', event: 'Elevated Kabo Ramon to Farm Manager' },
    { time: '2026-05-18 11:05 AM', user: 'System Auto-Task', event: 'Automated weekly DB snapshot created' }
  ]
};

// ── GET & SET LOCAL STORAGE DATABASE ─────────────────────
function getDB() {
  // Data Migration v3: user blockFarm property addition
  if (!localStorage.getItem('hugpong_db_v3_migrated')) {
    saveDB(INITIAL_DATABASE);
    localStorage.setItem('hugpong_db_v3_migrated', 'true');
  }

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
  sync: { heading: 'Sync Audit Monitor', sub: 'Audit mobile terminals transactions synchronization logs' },
  maintenance: { heading: 'System Maintenance & Security', sub: 'Manage global parameters, database health, and security' }
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
  if (page === 'maintenance') renderMaintenance();
}

function switchRole(role) {
  localStorage.setItem('hugpong_role', role);
  applyRoleLayout(role);
  toast(`Switched identity to: ${role === 'superadmin' ? 'Super Admin' : 'SRA (Admin)'}`);
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
    if (roleEl) roleEl.textContent = 'SRA (Admin)';
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

  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const summarySraAdmins = document.getElementById('summary-sra-admins');
  const summaryGrid = document.getElementById('descriptive-summary-grid');
  if (summarySraAdmins && summaryGrid) {
    if (currentRole === 'superadmin') {
      summarySraAdmins.classList.remove('hidden');
      summaryGrid.classList.remove('lg:grid-cols-6');
      summaryGrid.classList.add('lg:grid-cols-7');
    } else {
      summarySraAdmins.classList.add('hidden');
      summaryGrid.classList.remove('lg:grid-cols-7');
      summaryGrid.classList.add('lg:grid-cols-6');
    }
  }

  renderPriceHistoryChart();
  renderCostEfficiencyChart();
  renderCropStageDistribution();

  // Render dashboard pending reviews table
  const pendingLogs = db.logs.filter(l => l.status === 'Pending').slice(0, 5);
  const activitiesBody = document.getElementById('dashboard-activities-body');
  const thSource = document.getElementById('dashboard-th-source');
  const isSRA = currentRole === 'admin' || currentRole === 'superadmin';

  const thBlockFarm = document.getElementById('dashboard-th-blockfarm');
  const thFieldId = document.getElementById('dashboard-th-fieldid');
  if (thBlockFarm && thFieldId) {
    if (isSRA) {
      thBlockFarm.classList.remove('hidden');
      thFieldId.classList.add('hidden');
    } else {
      thBlockFarm.classList.add('hidden');
      thFieldId.classList.remove('hidden');
    }
  }

  if (activitiesBody) {
    if (pendingLogs.length === 0) {
      activitiesBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:#8A9B7A;font-size:13px;">All operation logs are synced and approved.</td></tr>`;
    } else {
      const farmMap = {
        'FLD-KTR-001': 'Block Farm A', 'FLD-KTR-002': 'Block Farm A',
        'FLD-KTR-003': 'Block Farm B', 'FLD-KTR-004': 'Block Farm B',
        'FLD-KTR-007': 'Block Farm C', 'FLD-KTR-008': 'Block Farm C',
        'FLD-KTR-009': 'Block Farm D', 'FLD-KTR-010': 'Block Farm D'
      };
      activitiesBody.innerHTML = pendingLogs.map(l => {
        let blockFarmCell = '';
        let displayFieldId = '';
        let displaySchedule = l.schedule;
        let displayTask = l.task;

        if (isSRA) {
          const farmName = farmMap[l.fieldId] || 'Block Farm A';
          blockFarmCell = `<td style="padding:12px 16px;font-weight:700;color:#1A6B9A;font-size:11px;">${farmName}</td>`;
          displaySchedule = 'Monthly Compilation';

          const taskLower = l.task.toLowerCase();
          if (taskLower.includes('labor') || taskLower.includes('crew') || taskLower.includes('weeding')) {
            displayTask = 'Consolidated Labor & Wages';
          } else if (taskLower.includes('tractor') || taskLower.includes('plowing') || taskLower.includes('furrowing') || taskLower.includes('clearing')) {
            displayTask = 'Consolidated Machinery Operations';
          } else if (taskLower.includes('ertilizer') || taskLower.includes('spray')) {
            displayTask = 'Consolidated Fertilizers & Chemicals';
          } else if (taskLower.includes('harvesting') || taskLower.includes('hauling') || taskLower.includes('transport')) {
            displayTask = 'Consolidated Harvesting & Hauling';
          } else {
            displayTask = 'Consolidated General Operations';
          }
        } else {
          displayFieldId = `<td style="padding:12px 16px;font-size:12px;color:#5A6B4A;">${l.fieldId}</td>`;
        }

        return `<tr onmouseover="this.style.background='#F2F4EF'" onmouseout="this.style.background=''">`
          + `<td style="padding:12px 16px;font-weight:700;color:#1A2212;font-size:11px;">${l.id}</td>`
          + blockFarmCell
          + displayFieldId
          + `<td style="padding:12px 16px;"><span style="font-size:10px;font-weight:600;color:#5A6B4A;background:#F2F4EF;border:1px solid #E2E8DC;padding:2px 8px;border-radius:999px;">${displaySchedule}</span></td>`
          + `<td style="padding:12px 16px;font-size:13px;color:#1A2212;">${displayTask}</td>`
          + `<td style="padding:12px 16px;font-weight:700;color:#1A2212;">Php ${l.cost.toLocaleString()}</td>`
          + `<td style="padding:12px 16px;"><span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:#FFF3DC;color:#F5A623;">Pending</span></td>`
          + `</tr>`;
      }).join('');
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
      + '<text x="' + lx + '" y="' + ly + '" text-anchor="end" font-size="9" fill="#8A9B7A" font-family="Inter,sans-serif" transform="rotate(-38 ' + lx + ' ' + ly + ')">' + weeks[i].replace('Wk', 'Week ') + '</text>';
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

function renderCostEfficiencyChart() {
  const el = document.getElementById('cost-efficiency-visual');
  if (!el) return;
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';

  let data;
  if (currentRole === 'superadmin' || currentRole === 'admin') {
    data = [
      { id: 'Block Farm A', costPerHa: 12400, ha: 34.5 },
      { id: 'Block Farm B', costPerHa: 14200, ha: 28.0 },
      { id: 'Block Farm C', costPerHa: 9800, ha: 45.2 },
      { id: 'Block Farm D', costPerHa: 11500, ha: 22.0 }
    ];
  } else {
    data = [
      { id: 'FLD-KTR-001', costPerHa: 12400, ha: 1.5 },
      { id: 'FLD-KTR-003', costPerHa: 8900, ha: 2.0 },
      { id: 'FLD-KTR-007', costPerHa: 15200, ha: 1.0 },
      { id: 'FLD-KTR-009', costPerHa: 10100, ha: 0.8 }
    ];
  }

  const maxCost = Math.max(...data.map(d => d.costPerHa));

  el.innerHTML = data.map(item => {
    const pct = Math.round((item.costPerHa / maxCost) * 100);
    const isHigh = item.costPerHa === maxCost;
    const barColor = isHigh ? '#D9534F' : '#2D5016';
    const textColor = isHigh ? '#D9534F' : '#1A2212';

    return '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">'
      + '<div style="width:110px;flex-shrink:0;">'
      + '<p style="font-size:12px;font-weight:700;color:#1A2212;">' + item.id + '</p>'
      + '<p style="font-size:11px;color:#8A9B7A;">' + item.ha.toFixed(1) + ' Ha</p>'
      + '</div>'
      + '<div style="flex:1;height:12px;background:#E2E8DC;border-radius:6px;overflow:hidden;position:relative;">'
      + '<div style="width:' + pct + '%;height:100%;background:' + barColor + ';border-radius:6px;"></div>'
      + '</div>'
      + '<div style="width:65px;text-align:right;">'
      + '<p style="font-size:12px;font-weight:800;color:' + textColor + ';">Php ' + (item.costPerHa / 1000).toFixed(1) + 'k</p>'
      + '</div>'
      + '</div>';
  }).join('');
}

function renderCropStageDistribution() {
  const el = document.getElementById('crop-stage-visual');
  const subEl = document.getElementById('crop-stage-subtitle');
  if (!el) return;
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';

  const isSRA = currentRole === 'admin' || currentRole === 'superadmin';
  const scale = isSRA ? 5.76 : 1;
  const unit = isSRA ? 'Block Farms' : 'fields';

  const stages = [
    { name: 'Fertilization Stage 2', ha: 8.0 * scale, color: '#4A7C2F' },
    { name: 'Planting', ha: 5.5 * scale, color: '#1A6B9A' },
    { name: 'Weeding', ha: 4.5 * scale, color: '#F5A623' },
    { name: 'Land Preparation', ha: 3.0 * scale, color: '#8F3A8F' },
    { name: 'Harvesting', ha: 1.5 * scale, color: '#D9534F' },
  ];
  const total = stages.reduce((s, st) => s + st.ha, 0);

  if (subEl) subEl.textContent = `${total.toFixed(1)} Ha across 4 active ${unit}`;

  el.innerHTML = stages.map(s => {
    const pct = Math.round((s.ha / total) * 100);
    return '<div style="display:flex;flex-direction:column;gap:5px;flex:1;min-width:120px;padding:12px;border:1px solid #E2E8DC;border-radius:8px;background:#FAFBFA;">'
      + '<span style="font-size:12px;font-weight:700;color:#1A2212;line-height:1.2;">' + s.name + '</span>'
      + '<span style="font-size:14px;font-weight:900;color:' + s.color + ';">' + s.ha.toFixed(1) + ' Ha</span>'
      + '<div style="width:100%;height:6px;background:#E2E8DC;border-radius:3px;overflow:hidden;margin-top:2px;">'
      + '<div style="width:' + pct + '%;height:100%;background:' + s.color + ';border-radius:3px;"></div>'
      + '</div>'
      + '<span style="font-size:10px;color:#8A9B7A;font-weight:600;">' + pct + '% of total area</span>'
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
let priceCurrentPage = 1;
let priceSortOrder = 'none';
const PRICES_PER_PAGE = 10;

function togglePriceSort() {
  if (priceSortOrder === 'none') priceSortOrder = 'desc';
  else if (priceSortOrder === 'desc') priceSortOrder = 'asc';
  else priceSortOrder = 'none';
  
  const btn = document.getElementById('price-sort');
  if (btn) btn.textContent = 'Sort Price: ' + (priceSortOrder === 'none' ? 'Default' : priceSortOrder === 'asc' ? 'Ascending' : 'Descending');
  
  priceCurrentPage = 1;
  renderPrices();
}

function setPricePage(page) {
  priceCurrentPage = page;
  renderPrices();
}

function renderPrices() {
  const db = getDB();
  const body = document.getElementById('price-table-body');
  if (!body) return;

  const canDelete = localStorage.getItem('hugpong_role') === 'superadmin';

  let filtered = db.priceHistory.map((p, idx) => ({ ...p, _originalIdx: idx }));

  const searchInput = document.getElementById('price-search');
  const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
  
  if (searchQuery) {
    filtered = filtered.filter(p => 
      p.week.toLowerCase().includes(searchQuery) || 
      p.source.toLowerCase().includes(searchQuery)
    );
  }

  if (priceSortOrder === 'asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (priceSortOrder === 'desc') {
    filtered.sort((a, b) => b.price - a.price);
  }

  const totalPages = Math.ceil(filtered.length / PRICES_PER_PAGE) || 1;
  if (priceCurrentPage > totalPages) priceCurrentPage = totalPages;

  const startIndex = (priceCurrentPage - 1) * PRICES_PER_PAGE;
  const paginatedPrices = filtered.slice(startIndex, startIndex + PRICES_PER_PAGE);

  body.innerHTML = paginatedPrices.map(p => {
    let diff = '<span style="color:#8A9B7A;font-weight:600;font-size:12px;">Steady</span>';
    if (p.change > 0) diff = '<span style="color:#3A8F3A;font-weight:700;font-size:12px;">&#9650; Php ' + p.change + '</span>';
    else if (p.change < 0) diff = '<span style="color:#D9534F;font-weight:700;font-size:12px;">&#9660; Php ' + Math.abs(p.change) + '</span>';
    const deleteBtn = canDelete ? '<button onclick="removePrice(' + p._originalIdx + ')" style="color:#8A9B7A;cursor:pointer;background:none;border:none;font-size:16px;padding:0 4px;" title="Remove" onmouseover="this.style.color=\'#D9534F\'" onmouseout="this.style.color=\'#8A9B7A\'">&times;</button>' : '';
    return '<tr onmouseover="this.style.background=\'#F2F4EF\'" onmouseout="this.style.background=\'\'">'
      + '<td style="padding:12px 16px;font-size:12px;color:#5A6B4A;">' + p.date + '</td>'
      + '<td style="padding:12px 16px;font-weight:700;color:#1A2212;">' + p.week.replace('Wk', 'Week ') + '</td>'
      + '<td style="padding:12px 16px;font-weight:800;color:#1A2212;">Php ' + p.price.toLocaleString() + '</td>'
      + '<td style="padding:12px 16px;">' + diff + '</td>'
      + '<td style="padding:12px 16px;font-size:11px;color:#5A6B4A;font-style:italic;">' + p.source + '</td>'
      + '<td style="padding:12px 16px;text-align:right;">' + deleteBtn + '</td>'
      + '</tr>';
  }).join('') || '<tr><td colspan="6" style="text-align:center;padding:30px;color:#8A9B7A;font-size:13px;">No price records matched your search.</td></tr>';

  const paginationContainer = document.getElementById('price-pagination');
  if (paginationContainer) {
    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      paginationContainer.classList.add('hidden');
    } else {
      paginationContainer.classList.remove('hidden');
      paginationContainer.innerHTML = 
        `<button onclick="setPricePage(${priceCurrentPage - 1})" ${priceCurrentPage === 1 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} class="px-3 py-1 bg-white border border-border rounded-lg text-xs font-semibold cursor-pointer text-hug-text2 hover:text-primary hover:border-primary transition-all">Prev</button>` +
        `<span class="text-xs font-semibold text-hug-text2">Page ${priceCurrentPage} of ${totalPages}</span>` +
        `<button onclick="setPricePage(${priceCurrentPage + 1})" ${priceCurrentPage === totalPages ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} class="px-3 py-1 bg-white border border-border rounded-lg text-xs font-semibold cursor-pointer text-hug-text2 hover:text-primary hover:border-primary transition-all">Next</button>`;
    }
  }
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
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
let logCurrentPage = 1;
let logSortCost = 'none';
const LOGS_PER_PAGE = 10;

function toggleLogSort() {
  if (logSortCost === 'none') logSortCost = 'desc';
  else if (logSortCost === 'desc') logSortCost = 'asc';
  else logSortCost = 'none';
  
  const btn = document.getElementById('log-sort-cost');
  if (btn) btn.textContent = 'Sort Cost: ' + (logSortCost === 'none' ? 'Default' : logSortCost === 'asc' ? 'Ascending' : 'Descending');
  
  logCurrentPage = 1;
  renderLogs();
}

function setLogPage(page) {
  logCurrentPage = page;
  renderLogs();
}

function setLogFilter(filter) {
  logCurrentPage = 1;
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

  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const isSRA = currentRole === 'admin' || currentRole === 'superadmin';

  // Dynamic labels for SRA Admin
  const thBlockFarm = document.getElementById('logs-th-blockfarm');
  const thFieldId = document.getElementById('logs-th-fieldid');
  if (thBlockFarm && thFieldId) {
    if (isSRA) {
      thBlockFarm.classList.remove('hidden');
      thFieldId.classList.add('hidden');
    } else {
      thBlockFarm.classList.add('hidden');
      thFieldId.classList.remove('hidden');
    }
  }

  const labelEl = document.querySelector('label[for="log-field-filter"]');
  if (labelEl) labelEl.textContent = isSRA ? 'Filter Block Farm:' : 'Filter Field:';

  const selectEl = document.getElementById('log-field-filter');
  const farmMap = { 
    'FLD-KTR-001': 'Block Farm A', 'FLD-KTR-002': 'Block Farm A', 
    'FLD-KTR-003': 'Block Farm B', 'FLD-KTR-004': 'Block Farm B', 
    'FLD-KTR-007': 'Block Farm C', 'FLD-KTR-008': 'Block Farm C', 
    'FLD-KTR-009': 'Block Farm D', 'FLD-KTR-010': 'Block Farm D' 
  };

  if (selectEl && isSRA) {
    if (selectEl.options[1].value !== 'Block Farm A') {
      selectEl.innerHTML = '<option value="all">All Block Farms</option>'
        + '<option value="Block Farm A">Block Farm A</option>'
        + '<option value="Block Farm B">Block Farm B</option>'
        + '<option value="Block Farm C">Block Farm C</option>'
        + '<option value="Block Farm D">Block Farm D</option>';
      selectEl.value = selectField === 'all' ? 'all' : (farmMap[selectField] || 'all');
    }
  } else if (selectEl) {
    if (selectEl.options[1].value === 'Block Farm A') {
      selectEl.innerHTML = '<option value="all">All Active Fields</option>'
        + '<option value="FLD-KTR-001">FLD-KTR-001 (Juan dela Cruz)</option>'
        + '<option value="FLD-KTR-002">FLD-KTR-002 (Jose Rizal)</option>'
        + '<option value="FLD-KTR-003">FLD-KTR-003 (Maria Santos)</option>'
        + '<option value="FLD-KTR-004">FLD-KTR-004 (Emilio Aguinaldo)</option>'
        + '<option value="FLD-KTR-007">FLD-KTR-007 (Pedro Reyes)</option>'
        + '<option value="FLD-KTR-008">FLD-KTR-008 (Andres Bonifacio)</option>'
        + '<option value="FLD-KTR-009">FLD-KTR-009 (Ana Gomez)</option>'
        + '<option value="FLD-KTR-010">FLD-KTR-010 (Apolinario Mabini)</option>';
      selectEl.value = selectField;
    }
  }

  const activeFilterValue = selectEl ? selectEl.value : 'all';

  let filtered = db.logs;
  if (activeFilterValue !== 'all') {
    if (isSRA) {
      filtered = filtered.filter(l => farmMap[l.fieldId] === activeFilterValue);
    } else {
      filtered = filtered.filter(l => l.fieldId === activeFilterValue);
    }
  }
  if (logStatusFilter !== 'all') filtered = filtered.filter(l => l.status === logStatusFilter);

  const searchInput = document.getElementById('log-search');
  const logSearchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
  if (logSearchQuery) {
    filtered = filtered.filter(l => 
      l.id.toLowerCase().includes(logSearchQuery) || 
      l.task.toLowerCase().includes(logSearchQuery) || 
      l.fieldId.toLowerCase().includes(logSearchQuery)
    );
  }

  if (logSortCost === 'asc') {
    filtered.sort((a, b) => a.cost - b.cost);
  } else if (logSortCost === 'desc') {
    filtered.sort((a, b) => b.cost - a.cost);
  }

  const totalPages = Math.ceil(filtered.length / LOGS_PER_PAGE) || 1;
  if (logCurrentPage > totalPages) logCurrentPage = totalPages;

  const startIndex = (logCurrentPage - 1) * LOGS_PER_PAGE;
  const paginatedLogs = filtered.slice(startIndex, startIndex + LOGS_PER_PAGE);

  body.innerHTML = paginatedLogs.map(l => {
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

    let blockFarmCell = '';
    let displayFieldId = '';
    let displaySchedule = l.schedule;
    let displayTask = l.task;

    if (isSRA) {
      const farmName = farmMap[l.fieldId] || 'Block Farm A';
      blockFarmCell = `<td style="padding:12px 16px;font-weight:700;color:#1A6B9A;font-size:11px;">${farmName}</td>`;
      displaySchedule = 'Monthly Compilation';

      const taskLower = l.task.toLowerCase();
      if (taskLower.includes('labor') || taskLower.includes('crew') || taskLower.includes('weeding')) {
        displayTask = 'Consolidated Labor & Wages';
      } else if (taskLower.includes('tractor') || taskLower.includes('plowing') || taskLower.includes('furrowing') || taskLower.includes('clearing')) {
        displayTask = 'Consolidated Machinery Operations';
      } else if (taskLower.includes('ertilizer') || taskLower.includes('spray')) {
        displayTask = 'Consolidated Fertilizers & Chemicals';
      } else if (taskLower.includes('harvesting') || taskLower.includes('hauling') || taskLower.includes('transport')) {
        displayTask = 'Consolidated Harvesting & Hauling';
      } else {
        displayTask = 'Consolidated General Operations';
      }
    } else {
      displayFieldId = `<td style="padding:12px 16px;font-size:12px;color:#5A6B4A;">${l.fieldId}</td>`;
    }

    return '<tr onmouseover="this.style.background=\'#F2F4EF\'" onmouseout="this.style.background=\'\'">'
      + '<td style="padding:12px 16px;font-weight:700;color:#1A2212;font-size:11px;">' + l.id + '</td>'
      + blockFarmCell
      + displayFieldId
      + '<td style="padding:12px 16px;"><span style="font-size:10px;font-weight:600;color:#5A6B4A;background:#F2F4EF;border:1px solid #E2E8DC;padding:2px 8px;border-radius:999px;">' + displaySchedule + '</span></td>'
      + '<td style="padding:12px 16px;font-size:13px;color:#1A2212;">' + displayTask + '</td>'
      + '<td style="padding:12px 16px;font-weight:700;color:#1A2212;">Php ' + l.cost.toLocaleString() + '</td>'
      + '<td style="padding:12px 16px;font-size:12px;color:#5A6B4A;">' + l.date + '</td>'
      + '<td style="padding:12px 16px;">' + statusBadge + '</td>'
      + '<td style="padding:12px 16px;"><div style="display:flex;gap:6px;align-items:center;">' + actionBtn + '</div></td>'
      + '</tr>';
  }).join('') || '<tr><td colspan="8" style="text-align:center;padding:30px;color:#8A9B7A;font-size:13px;">No operational records matched the selected filters.</td></tr>';

  const paginationContainer = document.getElementById('log-pagination');
  if (paginationContainer) {
    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      paginationContainer.classList.add('hidden');
    } else {
      paginationContainer.classList.remove('hidden');
      paginationContainer.innerHTML = 
        `<button onclick="setLogPage(${logCurrentPage - 1})" ${logCurrentPage === 1 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} class="px-3 py-1 bg-white border border-border rounded-lg text-xs font-semibold cursor-pointer text-hug-text2 hover:text-primary hover:border-primary transition-all">Prev</button>` +
        `<span class="text-xs font-semibold text-hug-text2">Page ${logCurrentPage} of ${totalPages}</span>` +
        `<button onclick="setLogPage(${logCurrentPage + 1})" ${logCurrentPage === totalPages ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} class="px-3 py-1 bg-white border border-border rounded-lg text-xs font-semibold cursor-pointer text-hug-text2 hover:text-primary hover:border-primary transition-all">Next</button>`;
    }
  }
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
      { name: 'Land Prep & Planting', pct: 38, cost: 52000, color: '#8F3A8F' },
      { name: 'Fertilizer (All Stages)', pct: 32, cost: 43800, color: '#4A7C2F' },
      { name: 'Labor Crew Wages', pct: 18, cost: 24600, color: '#1A6B9A' },
      { name: 'Chemical Spraying', pct: 8, cost: 10950, color: '#F5A623' },
      { name: 'Other Sundry Fees', pct: 4, cost: 5480, color: '#8A9B7A' },
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
      { id: 'Block Farm A', owner: 'Juan dela Cruz & Jose Rizal', haCost: 12400, haPct: 82, status: 'Average', color: '#4A7C2F' },
      { id: 'Block Farm B', owner: 'Maria Santos & Emilio', haCost: 8900, haPct: 58, status: 'Most Efficient &#10003;', color: '#3A8F3A' },
      { id: 'Block Farm C', owner: 'Pedro Reyes & Andres', haCost: 15200, haPct: 100, status: 'Alert: Heavy Cost &#9888;', color: '#D9534F' },
      { id: 'Block Farm D', owner: 'Ana Gomez & Apolinario', haCost: 10100, haPct: 66, status: 'Satisfactory', color: '#1A6B9A' },
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
let userCurrentPage = 1;
let userSortLogs = 'none'; // 'none', 'asc', 'desc'
const USERS_PER_PAGE = 10;

function toggleUserSort() {
  if (userSortLogs === 'none') userSortLogs = 'desc';
  else if (userSortLogs === 'desc') userSortLogs = 'asc';
  else userSortLogs = 'none';
  
  const btn = document.getElementById('user-sort');
  if (btn) btn.textContent = 'Sort Logs: ' + (userSortLogs === 'none' ? 'Default' : userSortLogs === 'asc' ? 'Ascending' : 'Descending');
  
  userCurrentPage = 1;
  renderUsers();
}

function setUserPage(page) {
  userCurrentPage = page;
  renderUsers();
}

function renderUsers() {
  const db = getDB();
  const usersBody = document.getElementById('users-table-body');
  const pendingList = document.getElementById('pending-users-list');

  if (usersBody) {
    let filtered = [...db.users];

    const searchInput = document.getElementById('user-search');
    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
    
    if (searchQuery) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchQuery) || 
        u.contact.toLowerCase().includes(searchQuery) || 
        u.role.toLowerCase().includes(searchQuery) ||
        (u.blockFarm && u.blockFarm.toLowerCase().includes(searchQuery))
      );
    }

    if (userSortLogs === 'asc') {
      filtered.sort((a, b) => a.logsHandled - b.logsHandled);
    } else if (userSortLogs === 'desc') {
      filtered.sort((a, b) => b.logsHandled - a.logsHandled);
    }

    const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE) || 1;
    if (userCurrentPage > totalPages) userCurrentPage = totalPages;

    const startIndex = (userCurrentPage - 1) * USERS_PER_PAGE;
    const paginatedUsers = filtered.slice(startIndex, startIndex + USERS_PER_PAGE);

    usersBody.innerHTML = paginatedUsers.map(u => {
      const roleColors = { 'Super Admin': 'background:#F0E8FA;color:#6B3FA0;', 'SRA (Admin)': 'background:#E8F0E0;color:#2D5016;', 'Farm Manager': 'background:#E0F0FA;color:#1A6B9A;', 'Member': 'background:#F2F4EF;color:#5A6B4A;border:1px solid #E2E8DC;' };
      const rStyle = roleColors[u.role] || roleColors['Member'];
      return '<tr onmouseover="this.style.background=\'#F2F4EF\'" onmouseout="this.style.background=\'\'">'
        + '<td style="padding:12px 16px;font-weight:700;color:#1A2212;font-size:13px;">' + u.contact + '</td>'
        + '<td style="padding:12px 16px;color:#1A2212;font-size:13px;">' + u.name + '</td>'
        + '<td style="padding:12px 16px;font-size:12px;color:#1A6B9A;font-weight:600;">' + (u.blockFarm || 'Unknown') + '</td>'
        + '<td style="padding:12px 16px;"><span style="display:inline-block;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;' + rStyle + '">' + u.role + '</span></td>'
        + '<td style="padding:12px 16px;font-size:13px;color:#5A6B4A;">' + u.logsHandled + ' logs</td>'
        + '<td style="padding:12px 16px;font-size:12px;color:#8A9B7A;">' + u.regDate + '</td>'
        + '<td style="padding:12px 16px;text-align:right;"><button onclick="removeDirectoryUser(\'' + u.contact + '\')" style="color:#8A9B7A;cursor:pointer;background:none;border:none;font-size:18px;" title="Revoke access" onmouseover="this.style.color=\'#D9534F\'" onmouseout="this.style.color=\'#8A9B7A\'">&times;</button></td>'
        + '</tr>';
    }).join('') || '<tr><td colspan="7" style="text-align:center;padding:30px;color:#8A9B7A;font-size:13px;">No users matched your search.</td></tr>';

    const paginationContainer = document.getElementById('user-pagination');
    if (paginationContainer) {
      if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        paginationContainer.classList.add('hidden');
      } else {
        paginationContainer.classList.remove('hidden');
        paginationContainer.innerHTML = 
          `<button onclick="setUserPage(${userCurrentPage - 1})" ${userCurrentPage === 1 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} class="px-3 py-1 bg-white border border-border rounded-lg text-xs font-semibold cursor-pointer text-hug-text2 hover:text-primary hover:border-primary transition-all">Prev</button>` +
          `<span class="text-xs font-semibold text-hug-text2">Page ${userCurrentPage} of ${totalPages}</span>` +
          `<button onclick="setUserPage(${userCurrentPage + 1})" ${userCurrentPage === totalPages ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} class="px-3 py-1 bg-white border border-border rounded-lg text-xs font-semibold cursor-pointer text-hug-text2 hover:text-primary hover:border-primary transition-all">Next</button>`;
      }
    }
  }

  if (pendingList) {
    if (db.pendingUsers.length === 0) {
      pendingList.innerHTML = '<div style="text-align:center;padding:24px;font-size:12px;color:#8A9B7A;border:1px dashed #E2E8DC;border-radius:12px;">No pending mobile registrations awaiting review.</div>';
    } else {
      pendingList.innerHTML = db.pendingUsers.map(p =>
        '<div style="border:1px solid #E2E8DC;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:10px;background:#fff;">'
        + '<div style="display:flex;justify-content:space-between;align-items:flex-start;">'
        + '<div><strong style="font-size:13px;color:#1A2212;display:block;">' + p.name + '</strong><p style="font-size:11px;color:#8A9B7A;margin-top:2px;">Farm: <span style="color:#1A6B9A;font-weight:600;">' + (p.blockFarm || 'Unknown') + '</span></p><p style="font-size:11px;color:#8A9B7A;margin-top:2px;">Role: <span style="color:#2D5016;font-weight:700;">' + p.role + '</span></p></div>'
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
  if (currentRole === 'admin' && (user.role === 'SRA (Admin)' || user.role === 'Super Admin')) {
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

  if (currentRole === 'admin' && (target.role === 'SRA (Admin)' || target.role === 'Super Admin')) {
    toast('Access Denied: SRA (Admin) cannot revoke admin-tier accounts.');
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
if (!localStorage.getItem('hugpong_db_v2_migrated')) {
  localStorage.removeItem('hugpong_db');
  localStorage.setItem('hugpong_db_v2_migrated', 'true');
}
const currentRoleInit = localStorage.getItem('hugpong_role') || 'admin';
applyRoleLayout(currentRoleInit);
navigate('dashboard');

// ── MAINTENANCE & SECURITY VIEW ──────────────────────────
function renderMaintenance() {
  const db = getDB();
  const body = document.getElementById('security-logs-body');
  if (!body) return;

  const logs = db.securityLogs || INITIAL_DATABASE.securityLogs;
  body.innerHTML = logs.map(log => {
    let eventStyle = 'color:#1A2212;';
    if (log.event.includes('Failed') || log.event.includes('reset')) eventStyle = 'color:#D9534F;font-weight:700;';
    if (log.event.includes('Successful') || log.event.includes('snapshot')) eventStyle = 'color:#3A8F3A;font-weight:700;';

    return `<tr onmouseover="this.style.background='#F2F4EF'" onmouseout="this.style.background=''">
      <td style="padding:12px 16px;font-size:12px;color:#8A9B7A;">${log.time}</td>
      <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#5A6B4A;">${log.user}</td>
      <td style="padding:12px 16px;font-size:13px;${eventStyle}">${log.event}</td>
    </tr>`;
  }).join('');
}
