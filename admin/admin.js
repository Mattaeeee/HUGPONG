// ── DATA ────────────────────────────────────────────────
const TASKS = [
  { id:1, name:'Fertilization – "Abono"', sector:'Sector B', plot:'Plot 4', cabo:'Gabe', date:'2026-05-16', time:'7:00 AM', target:'12 Bags Urea / 2.0 Ha', status:'pending' },
  { id:2, name:'Weeding – "Hilamon"', sector:'Sector A', plot:'Plot 7', cabo:'Jun', date:'2026-05-16', time:'9:30 AM', target:'2.5 Ha', status:'in-progress' },
  { id:3, name:'Harvesting – "Pitas"', sector:'Sector C', plot:'Plot 2', cabo:'Mark', date:'2026-05-16', time:'1:00 PM', target:'1.8 Ha', status:'pending' },
  { id:4, name:'Spraying – "Pang-abono"', sector:'Sector B', plot:'Plot 1', cabo:'Ed', date:'2026-05-16', time:'3:30 PM', target:'15 L Solution / 2.0 Ha', status:'pending' },
  { id:5, name:'Cultivation – "Asada"', sector:'Sector A', plot:'Plot 3', cabo:'Rex', date:'2026-05-15', time:'6:00 AM', target:'3.0 Ha', status:'completed' },
];

const PRICES = [
  { date:'May 16, 2026', mill:'HPCo – Silay', price:2800, change:+50, source:'Facebook Broadcast' },
  { date:'May 09, 2026', mill:'HPCo – Silay', price:2750, change:+100, source:'Facebook Broadcast' },
  { date:'May 02, 2026', mill:'HPCo – Silay', price:2650, change:-25, source:'Manual Entry' },
  { date:'Apr 25, 2026', mill:'HPCo – Silay', price:2675, change:+75, source:'Facebook Broadcast' },
];

const CABOS = [
  { name:'Gabe', role:'Lead Cabo', sector:'Sector B', tasks:4 },
  { name:'Jun', role:'Cabo', sector:'Sector A', tasks:3 },
  { name:'Mark', role:'Cabo', sector:'Sector C', tasks:2 },
  { name:'Ed', role:'Cabo', sector:'Sector B', tasks:2 },
  { name:'Rex', role:'Cabo', sector:'Sector A', tasks:1 },
  { name:'Nena', role:'Cabo', sector:'Sector C', tasks:3 },
];

const PLOTS = [
  { name:'Plot 1', sector:'Sector B', area:'2.0 Ha', yield:'120 Lkg/Ha', status:'Active' },
  { name:'Plot 2', sector:'Sector C', area:'1.8 Ha', yield:'115 Lkg/Ha', status:'Harvesting' },
  { name:'Plot 3', sector:'Sector A', area:'3.0 Ha', yield:'118 Lkg/Ha', status:'Active' },
  { name:'Plot 4', sector:'Sector B', area:'2.5 Ha', yield:'122 Lkg/Ha', status:'Fertilizing' },
  { name:'Plot 7', sector:'Sector A', area:'2.0 Ha', yield:'110 Lkg/Ha', status:'Weeding' },
];

const SYNC_LOGS = [
  { time:'12:45 AM', device:'iPhone 12 – Gabe', user:'Gabe', action:'Price Cache Updated', status:'synced' },
  { time:'12:12 AM', device:'Android – Jun', user:'Jun', action:'Task Logged: Weeding Plot 7', status:'synced' },
  { time:'11:58 PM', device:'Android – Mark', user:'Mark', action:'Task Logged: Harvesting Plot 2', status:'pending' },
  { time:'11:30 PM', device:'iPhone 12 – Gabe', user:'Gabe', action:'Task Completed: Fertilization Plot 4', status:'synced' },
];

const CHART_DATA = {
  months: ['Nov','Dec','Jan','Feb','Mar','Apr','May'],
  prices: [2100, 2200, 2350, 2500, 2600, 2750, 2800],
  molPrices: [3800, 3950, 4100, 4050, 4200, 4150, 4200],
  revenue: [320000, 450000, 380000, 520000, 610000, 580000, 650000]
};

// ── NAVIGATION ──────────────────────────────────────────
const pages = {
  dashboard: { heading: 'Dashboard', sub: 'Overview of farm operations' },
  prices: { heading: 'Price Management', sub: 'Monitor and update HPCo market prices' },
  schedules: { heading: 'Schedules', sub: 'Manage daily farm task schedules' },
  cabos: { heading: 'Cabos & Workers', sub: 'Manage farm workers and assignments' },
  plots: { heading: 'Plots & Sectors', sub: 'View and manage farm plots' },
  reports: { heading: 'Reports', sub: 'Farm analytics and financial reports' },
  sync: { heading: 'Sync Monitor', sub: 'Monitor offline sync and audit logs' },
};

let currentPage = 'dashboard';
let scheduleFilter = 'all';

function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.getElementById(`page-${page}`).classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === page);
  });
  document.getElementById('page-heading').textContent = pages[page].heading;
  document.getElementById('page-sub').textContent = pages[page].sub;
  currentPage = page;
  if (page === 'dashboard') renderDashboard();
  if (page === 'prices') renderPrices();
  if (page === 'schedules') renderSchedules();
  if (page === 'cabos') renderCabos();
  if (page === 'plots') renderPlots();
  if (page === 'reports') renderReports();
  if (page === 'sync') renderSync();
}

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => navigate(btn.dataset.page));
});

// Sidebar toggle (mobile)
document.getElementById('sidebar-toggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

// ── RENDER HELPERS ───────────────────────────────────────
function statusBadge(status) {
  const map = { pending:'status-pending', 'in-progress':'status-in-progress', completed:'status-completed' };
  const label = { pending:'Pending', 'in-progress':'In Progress', completed:'Completed' };
  return `<span class="status-badge ${map[status]}">${label[status]}</span>`;
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── DASHBOARD ───────────────────────────────────────────
function renderDashboard() {
  // Tasks table
  const body = document.getElementById('dashboard-tasks-body');
  body.innerHTML = TASKS.slice(0, 5).map(t => `
    <tr>
      <td><strong>${t.name}</strong></td>
      <td>${t.sector} / ${t.plot}</td>
      <td>${t.cabo}</td>
      <td>${t.time}</td>
      <td>${statusBadge(t.status)}</td>
    </tr>
  `).join('');

  // Line chart
  renderLineChart('price-trend-chart', CHART_DATA.months, CHART_DATA.prices, 1800, 3000);

  // Donut
  renderDonut();
}

function renderLineChart(id, labels, values, min, max) {
  const el = document.getElementById(id);
  if (!el) return;
  const range = max - min;
  el.innerHTML = labels.map((l, i) => {
    const pct = Math.round(((values[i] - min) / range) * 100);
    return `<div class="lc-bar-wrap">
      <div class="lc-bar" style="height:${pct}%"></div>
      <span class="lc-label">${l}</span>
    </div>`;
  }).join('');
}

function renderDonut() {
  const el = document.getElementById('donut-chart');
  if (!el) return;
  const total = 12, pending = 4, inProgress = 5, completed = 3;
  const r = 60, cx = 70, cy = 70, circum = 2 * Math.PI * r;
  const pPending = (pending / total) * circum;
  const pIP = (inProgress / total) * circum;
  const pDone = (completed / total) * circum;
  const offIP = pPending;
  const offDone = offIP + pIP;
  el.innerHTML = `<svg class="donut-svg" width="140" height="140" viewBox="0 0 140 140">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#E2E8DC" stroke-width="22"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#F5A623" stroke-width="22"
      stroke-dasharray="${pPending} ${circum}" stroke-dashoffset="0"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1A6B9A" stroke-width="22"
      stroke-dasharray="${pIP} ${circum}" stroke-dashoffset="${-offIP}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#3A8F3A" stroke-width="22"
      stroke-dasharray="${pDone} ${circum}" stroke-dashoffset="${-offDone}"/>
  </svg>`;
}

// ── PRICES ──────────────────────────────────────────────
function renderPrices() {
  const body = document.getElementById('price-table-body');
  body.innerHTML = PRICES.map(p => `
    <tr>
      <td>${p.date}</td>
      <td>${p.mill}</td>
      <td><strong>Php ${p.price.toLocaleString()}</strong></td>
      <td><span style="color:${p.change >= 0 ? '#3A8F3A' : '#D9534F'}">${p.change >= 0 ? '▲' : '▼'} Php ${Math.abs(p.change)}</span></td>
      <td>${p.source}</td>
      <td><button class="btn-icon" title="Edit">✏️</button></td>
    </tr>
  `).join('');
}

document.getElementById('add-price-btn').addEventListener('click', () => {
  const card = document.getElementById('price-form-card');
  card.classList.toggle('hidden');
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('p-date').value = today;
});

document.getElementById('price-form-cancel').addEventListener('click', () => {
  document.getElementById('price-form-card').classList.add('hidden');
});

document.getElementById('price-form-save').addEventListener('click', () => {
  const mill = document.getElementById('p-mill').value;
  const price = parseInt(document.getElementById('p-price').value);
  const date = document.getElementById('p-date').value;
  const source = document.getElementById('p-source').value;
  if (!price || !date) { toast('Please fill in all required fields.'); return; }
  const last = PRICES[0]?.price || price;
  PRICES.unshift({ date, mill, price, change: price - last, source });
  document.getElementById('price-form-card').classList.add('hidden');
  renderPrices();
  toast('Price updated successfully.');
});

// ── SCHEDULES ───────────────────────────────────────────
function renderSchedules(filter) {
  scheduleFilter = filter || scheduleFilter;
  document.querySelectorAll('.filter-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.filter === scheduleFilter);
  });
  const data = scheduleFilter === 'all' ? TASKS : TASKS.filter(t => t.status === scheduleFilter);
  const body = document.getElementById('sched-table-body');
  body.innerHTML = data.map(t => `
    <tr>
      <td><strong>${t.name}</strong></td>
      <td>${t.sector} / ${t.plot}</td>
      <td>${t.cabo}</td>
      <td>${t.date}</td>
      <td>${t.time}</td>
      <td>${t.target}</td>
      <td>${statusBadge(t.status)}</td>
      <td>
        <button class="btn-icon" onclick="changeStatus(${t.id})" title="Change Status">🔄</button>
        <button class="btn-icon" onclick="deleteTask(${t.id})" title="Delete">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function changeStatus(id) {
  const task = TASKS.find(t => t.id === id);
  if (!task) return;
  const cycle = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' };
  task.status = cycle[task.status];
  renderSchedules();
  toast(`Status updated to: ${task.status}`);
}

function deleteTask(id) {
  const i = TASKS.findIndex(t => t.id === id);
  if (i > -1) { TASKS.splice(i, 1); renderSchedules(); toast('Task removed.'); }
}

document.querySelectorAll('.filter-chip').forEach(btn => {
  btn.addEventListener('click', () => renderSchedules(btn.dataset.filter));
});

document.getElementById('add-sched-btn').addEventListener('click', () => {
  const name = prompt('Task name:');
  if (!name) return;
  TASKS.push({ id: Date.now(), name, sector: 'Sector A', plot: 'Plot 1', cabo: 'Gabe', date: new Date().toISOString().split('T')[0], time: '8:00 AM', target: '—', status: 'pending' });
  renderSchedules();
  toast('Task added.');
});

// ── CABOS ────────────────────────────────────────────────
function renderCabos() {
  document.getElementById('cabo-grid').innerHTML = CABOS.map(c => `
    <div class="cabo-card">
      <div class="cabo-avatar">${c.name[0]}</div>
      <div>
        <p class="cabo-name">${c.name}</p>
        <p class="cabo-role">${c.role}</p>
      </div>
      <span class="cabo-meta">${c.sector}</span>
      <span class="cabo-meta">${c.tasks} active tasks</span>
    </div>
  `).join('');
}

document.getElementById('add-cabo-btn').addEventListener('click', () => {
  const name = prompt('Cabo name:');
  if (!name) return;
  CABOS.push({ name, role: 'Cabo', sector: 'Sector A', tasks: 0 });
  renderCabos();
  toast('Cabo added.');
});

// ── PLOTS ────────────────────────────────────────────────
function renderPlots() {
  document.getElementById('plots-grid').innerHTML = PLOTS.map(p => `
    <div class="plot-card">
      <div class="plot-header">
        <p class="plot-name">${p.name}</p>
        <span class="plot-sector">${p.sector}</span>
      </div>
      <div class="plot-stat"><span>Area</span><strong>${p.area}</strong></div>
      <div class="plot-stat"><span>Target Yield</span><strong>${p.yield}</strong></div>
      <div class="plot-stat"><span>Status</span><span style="color:var(--primary-light)">${p.status}</span></div>
    </div>
  `).join('');
}

// ── REPORTS ──────────────────────────────────────────────
function renderReports() {
  renderLineChart('revenue-chart', CHART_DATA.months, CHART_DATA.revenue, 0, 800000);
}

// ── SYNC ─────────────────────────────────────────────────
function renderSync() {
  document.getElementById('sync-log-body').innerHTML = SYNC_LOGS.map(l => `
    <tr>
      <td>${l.time}</td>
      <td>${l.device}</td>
      <td>${l.user}</td>
      <td>${l.action}</td>
      <td>${statusBadge(l.status === 'synced' ? 'completed' : 'pending')}</td>
    </tr>
  `).join('');
}

// ── TOPBAR REFRESH ───────────────────────────────────────
document.getElementById('topbar-refresh').addEventListener('click', () => {
  toast('Data refreshed.');
  navigate(currentPage);
});

// ── INIT ─────────────────────────────────────────────────
navigate('dashboard');
