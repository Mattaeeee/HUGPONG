import { STORAGE_KEYS, saveItem, getItem, clearHugpongStorage, hydrateAllStorage } from '../services/storageService';
import { initSyncEngine, enqueueOutboxItem, processOutbox, getOutboxCount, clearOutbox } from '../services/syncEngine';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

export const MOCK_PRICE = {
  value: 2800,
  change: 50.08,
  unit: 'Lkg',
  mill: 'HPCo',
  location: 'Silay',
  lastUpdated: 'May 17, 2026',
};

export const MOCK_MOL = {
  value: 4200,
  change: 80,
  unit: 'MT',
  lastUpdated: 'May 17, 2026',
};

export const MOCK_WEEKLY_CHART = {
  months: ['Nov', 'Dec', 'Jan', 'Mar', 'Apr', 'May'],
  weeks: [
    [2100, 2200, 2150, 2400, 2650, 2700],
    [2200, 2250, 2300, 2500, 2700, 2750],
    [2300, 2100, 2350, 2600, 2600, 2780],
    [2400, 2300, 2500, 2550, 2750, 2800],
  ],
  monthlyAvg: 2750,
  cropYearPeak: 2900,
};

export const DEMO_ACCOUNTS = {
  'Member': {
    name: 'Juan dela Cruz',
    role: 'Member',
    employeeId: 'MBR-2026-004',
    fieldId: 'FLD-KTR-001',
    blockFarmScope: 'FLD-KTR-001 (1.5 Ha)',
    farm: 'Silay Block Farm',
    mobile: '0917 123 4567',
    password: 'password123',
    pendingLogs: 0,
    syncedLogs: 24,
  },
  'Farm Manager': {
    name: 'Jose Reyes',
    role: 'Farm Manager',
    employeeId: 'MGR-2026-001',
    fieldId: 'Block Farm A',
    blockFarmScope: 'Block Farm A (All Assigned Plots)',
    farm: 'Silay Block Farm A',
    mobile: '0918 987 6543',
    password: 'manager123',
    pendingLogs: 0,
    syncedLogs: 142,
  },
  'SRA (Admin)': {
    name: 'Maria Santos',
    role: 'SRA (Admin)',
    employeeId: 'SRA-2026-088',
    fieldId: 'All Block Farms',
    blockFarmScope: 'All District Block Farms (A, B, C, D)',
    farm: 'SRA Sugar Regulatory Administration (District VII)',
    mobile: '0919 444 8888',
    password: 'admin123',
    pendingLogs: 0,
    syncedLogs: 512,
  },
};

export const REGISTERED_USERS = {
  '09171234567': { ...DEMO_ACCOUNTS['Member'] },
  '09189876543': { ...DEMO_ACCOUNTS['Farm Manager'] },
  '09194448888': { ...DEMO_ACCOUNTS['SRA (Admin)'] },
};

export const authenticateUser = (contact, password) => {
  const cleaned = (contact || '').replace(/\D/g, '');
  const user = REGISTERED_USERS[cleaned];
  if (!user) {
    return { success: false, error: 'Account not found. Please check contact number or sign up.' };
  }
  if (user.password && user.password !== password) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }
  CURRENT_SESSION = { ...user };
  notify();
  return { success: true, user: CURRENT_SESSION };
};

export const registerUser = (userData) => {
  const cleaned = (userData.contactNumber || '').replace(/\D/g, '');
  const newAccount = {
    name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'New Farmer Member',
    role: 'Member',
    employeeId: `MBR-2026-${Math.floor(100 + Math.random() * 900)}`,
    fieldId: 'Unassigned (Pending)',
    blockFarmScope: userData.blockFarm || 'Silay Block Farm A',
    farm: userData.blockFarm || 'Silay Block Farm A',
    mobile: userData.contactNumber,
    password: userData.password || 'password123',
    pendingLogs: 0,
    syncedLogs: 0,
  };
  REGISTERED_USERS[cleaned] = newAccount;
  CURRENT_SESSION = { ...newAccount };
  notify();
  return { success: true, user: newAccount };
};

let CURRENT_SESSION = { ...DEMO_ACCOUNTS['Member'] };
let IS_SYNCED = true;

export const getCurrentSession = () => CURRENT_SESSION;
export const getIsSynced = () => IS_SYNCED;

let listeners = [];

export const subscribe = (listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

let persistTimeout = null;
const persistAllToStorage = () => {
  if (persistTimeout) clearTimeout(persistTimeout);
  persistTimeout = setTimeout(async () => {
    try {
      await saveItem(STORAGE_KEYS.SESSION, CURRENT_SESSION);
      await saveItem(STORAGE_KEYS.LOGS, MOCK_LOGS);
      await saveItem(STORAGE_KEYS.DRAFTS, DRAFT_LOGS);
      await saveItem(STORAGE_KEYS.FIELDS, MOCK_FIELDS);
      await saveItem(STORAGE_KEYS.TICKETS, MOCK_TICKETS);
      await saveItem(STORAGE_KEYS.PREFS, SECURITY_PREFERENCES);
      await saveItem(STORAGE_KEYS.PENDING_ASSIGNMENTS, MOCK_ASSIGNMENT_REQUESTS);
    } catch (e) {
      console.warn('[mockData] Background persistence error:', e);
    }
  }, 100);
};

const notify = () => {
  persistAllToStorage();
  listeners.forEach(l => {
    try {
      l();
    } catch (e) {
      console.warn('Subscriber error', e);
    }
  });
};

export const notifyDataUpdate = notify;

export const setSession = (role) => {
  const account = DEMO_ACCOUNTS[role];
  if (account) {
    CURRENT_SESSION = { ...account };
    notify();
  }
};

export const updateSessionFieldId = (fieldId) => {
  CURRENT_SESSION.fieldId = fieldId;
  notify();
};

let MEMBER_SYNC_LAG_DAYS = 0;
let MEMBER_LAST_SYNC_STR = '15 mins ago';

export const getMemberSyncHealth = () => {
  const isOffline = !IS_SYNCED || MEMBER_SYNC_LAG_DAYS >= 3;
  let status = 'healthy';
  if (MEMBER_SYNC_LAG_DAYS >= 7) status = 'critical';
  else if (MEMBER_SYNC_LAG_DAYS >= 3 || !IS_SYNCED) status = 'warning';

  return {
    status,
    days: MEMBER_SYNC_LAG_DAYS,
    lastSync: MEMBER_LAST_SYNC_STR,
    isOffline: !IS_SYNCED,
    manager: {
      name: 'Jose Reyes',
      role: 'Farm Manager',
      blockFarm: 'Block Farm A',
      phone: '0918-987-6543'
    }
  };
};

export const triggerSyncLagDemo = (days, label) => {
  MEMBER_SYNC_LAG_DAYS = days;
  MEMBER_LAST_SYNC_STR = label || `${days} days ago`;
  if (days >= 3) IS_SYNCED = false;
  notify();
};

export const performMobileSync = async () => {
  IS_SYNCED = true;
  MEMBER_SYNC_LAG_DAYS = 0;
  MEMBER_LAST_SYNC_STR = 'Just now';
  
  // Process outbox queue
  await processOutbox(async (item) => {
    // Simulated instant successful upload
    return true;
  });

  CURRENT_SESSION.syncedLogs = (CURRENT_SESSION.syncedLogs || 24) + (CURRENT_SESSION.pendingLogs || 0);
  CURRENT_SESSION.pendingLogs = 0;
  
  MOCK_LOGS.forEach(log => {
    if (log.isOffline) log.isOffline = false;
  });
  
  MOCK_FIELDS.forEach(f => {
    f.synced = true;
    f.lastSync = 'Just now';
  });
  
  notify();
  return true;
};

export const setSynced = (synced) => {
  IS_SYNCED = synced;
  if (!synced) {
    CURRENT_SESSION.pendingLogs = (CURRENT_SESSION.pendingLogs || 0) + 1;
  } else {
    performMobileSync();
  }
  notify();
};

export const MOCK_PROFILE = {
  get name() { return CURRENT_SESSION.name; },
  get role() { return CURRENT_SESSION.role; },
  get employeeId() { return CURRENT_SESSION.employeeId; },
  get fieldId() { return CURRENT_SESSION.fieldId; },
  get farm() { return CURRENT_SESSION.farm; },
  get mobile() { return CURRENT_SESSION.mobile; },
  get pendingLogs() { return CURRENT_SESSION.pendingLogs; },
  get syncedLogs() { return CURRENT_SESSION.syncedLogs; },
};

export let MOCK_FIELDS = [
  { id: 'FLD-KTR-001', member: 'Juan dela Cruz', ha: '1.5', stage: 'Fertilization Stage 2', month: 3.2, synced: true, lastSync: '15 mins ago', blockFarm: 'Silay Block Farm A', customStages: [] },
  { id: 'FLD-KTR-002', member: 'Jose Reyes', ha: '2.5', stage: 'Off-barring & Cultivation', month: 2.1, synced: true, lastSync: '10 mins ago', blockFarm: 'Silay Block Farm A', customStages: [] },
  { id: 'FLD-KTR-003', member: 'Maria Santos', ha: '2.0', stage: 'Land Preparation', month: 0.3, synced: true, lastSync: '2 hrs ago', blockFarm: 'Silay Block Farm A', customStages: [] },
  { id: 'FLD-KTR-007', member: 'Pedro Reyes', ha: '1.0', stage: 'Harvesting', month: 10.5, synced: false, lastSync: '4 days ago', blockFarm: 'Silay Block Farm B', customStages: [] },
  { id: 'FLD-KTR-009', member: 'Ana Gomez', ha: '0.8', stage: 'Weeding', month: 5.1, synced: true, lastSync: '1 hr ago', blockFarm: 'Silay Block Farm C', customStages: [] },
];

export const updateFieldCustomStages = (fieldId, stages) => {
  const field = MOCK_FIELDS.find(f => f.id === fieldId);
  if (field) {
    field.customStages = stages;
    notify();
  }
};

export const MOCK_MANAGERS = [
  { id: 'M1', name: 'Carlos Dimayuga', blockFarm: 'Silay Block Farm A' },
  { id: 'M2', name: 'Elena Batongbakal', blockFarm: 'Silay Block Farm B' },
  { id: 'M3', name: 'Ricardo Dalisay', blockFarm: 'Silay Block Farm C' },
];

export let MOCK_LOGS = [
  { id: 'L1', fieldId: 'FLD-KTR-001', activity: 'Weeding labor', cost: 1200, hectares: '1.5', people: '4', inputQty: '1.5', inputUnit: 'ha', inputName: 'Manual Weeding Crew', date: '2026-05-07', approved: true },
  { id: 'L2', fieldId: 'FLD-KTR-001', activity: 'Fertilization Stage 2 (Urea)', cost: 6400, hectares: '1.5', people: '2', inputQty: '4', inputUnit: 'bags', inputName: 'Urea (46-0-0)', date: '2026-05-01', approved: true },
  { id: 'L3', fieldId: 'FLD-KTR-003', activity: 'Land plowing (tractor)', cost: 5000, hectares: '2.0', people: '1', inputQty: '2.0', inputUnit: 'ha', inputName: 'Tractor Disc Plow', date: '2026-05-14', approved: true },
  { id: 'L4', fieldId: 'FLD-KTR-007', activity: 'Cane harvesting', cost: 8500, hectares: '1.0', people: '8', inputQty: '60', inputUnit: 'tons', inputName: 'Cane Tapas', date: '2026-05-18', approved: true },
  { id: 'L5', fieldId: 'FLD-KTR-007', activity: 'Trucking & hauling', cost: 4200, hectares: '1.0', people: '3', inputQty: '1', inputUnit: 'truckload', inputName: 'Freight to HPCo Mill', date: '2026-05-19', approved: true },
];

export let DRAFT_LOGS = [
  { id: 'D1', fieldId: 'FLD-KTR-001', member: 'Juan dela Cruz', activity: 'Trash Blanketing & Canal Clearing', cost: 1500, hectares: '1.5', people: '3', inputQty: '1.5', inputUnit: 'ha', inputName: 'Trash Blanketing', date: '2026-05-21', category: 'weed' }
];

export let MOCK_ASSIGNMENT_REQUESTS = [];

export const requestFieldAssignment = async (fieldId, memberName, ha = '0.0') => {
  const req = {
    id: `REQ-${Date.now()}`,
    fieldId,
    memberName,
    ha,
    date: new Date().toISOString().split('T')[0],
    status: 'pending'
  };
  MOCK_ASSIGNMENT_REQUESTS.push(req);
  if (!IS_SYNCED) {
    await enqueueOutboxItem('assignment_request', req);
  }
  notify();
};

export const resolveAssignmentRequest = (reqId, approved) => {
  const req = MOCK_ASSIGNMENT_REQUESTS.find(r => r.id === reqId);
  if (req) {
    req.status = approved ? 'approved' : 'rejected';
    notify();
  }
};

export const SRA_PRICE_HISTORY = [
  { week: 'Week 1', month: 'Mar', price: 2450 },
  { week: 'Week 2', month: 'Mar', price: 2500 },
  { week: 'Week 3', month: 'Mar', price: 2480 },
  { week: 'Week 4', month: 'Mar', price: 2550 },
  { week: 'Week 1', month: 'Apr', price: 2600 },
  { week: 'Week 2', month: 'Apr', price: 2580 },
  { week: 'Week 3', month: 'Apr', price: 2650 },
  { week: 'Week 4', month: 'Apr', price: 2700 },
  { week: 'Week 1', month: 'May', price: 2720 },
  { week: 'Week 2', month: 'May', price: 2750 },
  { week: 'Week 3', month: 'May', price: 2800 },
  { week: 'Week 4', month: 'May', price: 2800 },
];

const WEEK_LABELS = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const addSRAPrice = (price) => {
  const last = SRA_PRICE_HISTORY[SRA_PRICE_HISTORY.length - 1];
  const lastWeekIdx = WEEK_LABELS.indexOf(last.week);
  const lastMonthIdx = MONTH_LABELS.indexOf(last.month);
  let nextWeek, nextMonth;
  if (lastWeekIdx < 3) {
    nextWeek = WEEK_LABELS[lastWeekIdx + 1];
    nextMonth = last.month;
  } else {
    nextWeek = 'Week 1';
    nextMonth = MONTH_LABELS[(lastMonthIdx + 1) % 12];
  }
  SRA_PRICE_HISTORY.push({ week: nextWeek, month: nextMonth, price });
  MOCK_PRICE.value = price;
  MOCK_PRICE.lastUpdated = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  notify();
};

export let MOCK_TICKETS = [
  {
    id: 'TCK-801',
    title: 'Offline Log Sync Failure after 3 days offline',
    author: 'Juan dela Cruz (Member)',
    blockFarm: 'Silay Block Farm A',
    category: 'Offline Sync',
    priority: 'High',
    status: 'Open',
    date: '2026-05-23',
    details: 'Completed 3 manual weeding and fertilization logs while in northern field without 4G. Logs remain in device queue after Wi-Fi reconnection.',
    resolutionNotes: ''
  },
  {
    id: 'TCK-802',
    title: 'Plot Boundary Hectarage Discrepancy',
    author: 'Jose Reyes (Farm Manager)',
    blockFarm: 'Silay Block Farm A',
    category: 'Field Boundary',
    priority: 'Medium',
    status: 'In Progress',
    date: '2026-05-22',
    details: 'FLD-KTR-002 surveyed area is 2.5 Ha but satellite map boundary shows overlap with adjacent plot.',
    resolutionNotes: 'Re-survey coordinates dispatched to Silay surveyor.'
  }
];

export const submitSupportTicket = (ticket) => {
  const newId = `TCK-${800 + MOCK_TICKETS.length + 1}`;
  const newTicket = {
    id: newId,
    title: ticket.title,
    author: ticket.author || `${CURRENT_SESSION.name} (${CURRENT_SESSION.role})`,
    blockFarm: CURRENT_SESSION.farm || 'Silay Block Farm A',
    category: ticket.category || 'General Support',
    priority: ticket.priority || 'Normal',
    status: 'Open',
    date: new Date().toISOString().split('T')[0],
    details: ticket.details,
    resolutionNotes: ''
  };
  MOCK_TICKETS.unshift(newTicket);
  notify();
  return newTicket;
};

// ── Security Preferences State ──────────────────────────────────────────────
export let SECURITY_PREFERENCES = {
  biometrics: false,
  pinEnabled: false,
  twoFactor: false,
  sessionAlert: true,
  lastPasswordChange: '2026-05-01'
};

export const getSecurityPreferences = () => ({ ...SECURITY_PREFERENCES });

export const updateSecurityPreferences = (updates) => {
  SECURITY_PREFERENCES = { ...SECURITY_PREFERENCES, ...updates };
  notify();
  return SECURITY_PREFERENCES;
};

export const resetLocalCache = async () => {
  DRAFT_LOGS.length = 0;
  MOCK_ASSIGNMENT_REQUESTS.length = 0;
  IS_SYNCED = true;
  await clearOutbox();
  await clearHugpongStorage();
  notify();
  return true;
};

// ── Startup Hydration & Cloud Firestore Sync ───────────────────────────────
function parsePriceTime(p) {
  if (p.timestamp) return p.timestamp;
  if (p.createdAt) {
    const t = new Date(p.createdAt).getTime();
    if (!isNaN(t)) return t;
  }
  if (p.isoDate) {
    const t = new Date(p.isoDate).getTime();
    if (!isNaN(t)) return t;
  }
  if (p.date) {
    const t = new Date(p.date).getTime();
    if (!isNaN(t)) return t;
  }
  return 0;
}

export const listenToCloudSync = () => {
  if (!db) return () => {};

  try {
    // 1. Live SRA Sugar Prices Listener
    const unsubPrices = onSnapshot(collection(db, 'sra_prices'), (snapshot) => {
      if (snapshot.empty) return;
      const remotePrices = [];
      snapshot.forEach(docSnap => remotePrices.push(docSnap.data()));
      
      // Sort newest first
      remotePrices.sort((a, b) => parsePriceTime(b) - parsePriceTime(a));

      if (remotePrices.length > 0) {
        const latest = remotePrices[0];
        MOCK_PRICE.value = Number(latest.price) || MOCK_PRICE.value;
        MOCK_PRICE.change = Number(latest.change) || 0;
        MOCK_PRICE.lastUpdated = latest.date || MOCK_PRICE.lastUpdated;
        MOCK_PRICE.week = latest.week || 'Current Circular';

        MOCK_MOL.value = Number(latest.molasses) || MOCK_MOL.value;
        MOCK_MOL.change = Number(latest.molassesChange) || 0;
        MOCK_MOL.lastUpdated = latest.date || MOCK_MOL.lastUpdated;
        MOCK_MOL.week = latest.week || 'Current Circular';

        SRA_PRICE_HISTORY.length = 0;
        remotePrices.forEach(p => SRA_PRICE_HISTORY.push(p));

        // Rebuild dynamic weekly chart months & values
        const chrono = [...remotePrices].sort((a, b) => parsePriceTime(a) - parsePriceTime(b));
        const monthMap = new Map();
        chrono.forEach(p => {
          let m = p.month;
          if (!m && p.date) {
            const parts = p.date.replace(',', '').split(' ');
            if (parts[0] && isNaN(Number(parts[0]))) m = parts[0];
          }
          if (!m && p.week) {
            const wparts = p.week.split(' ');
            if (wparts.length >= 3) m = wparts[2];
            else if (wparts.length === 2 && isNaN(Number(wparts[1]))) m = wparts[1];
          }
          m = m || 'Jun';
          if (!monthMap.has(m)) monthMap.set(m, []);
          monthMap.get(m).push(Number(p.price) || 2800);
        });

        const activeMonths = Array.from(monthMap.keys()).slice(-6);
        if (activeMonths.length > 0) {
          MOCK_WEEKLY_CHART.months = activeMonths;
          const weeksGrid = [[], [], [], []];
          activeMonths.forEach(m => {
            const prices = monthMap.get(m);
            for (let w = 0; w < 4; w++) {
              const val = prices[w] || prices[prices.length - 1] || 2800;
              weeksGrid[w].push(val);
            }
          });
          MOCK_WEEKLY_CHART.weeks = weeksGrid;
          const allPrices = chrono.map(p => Number(p.price) || 2800);
          MOCK_WEEKLY_CHART.monthlyAvg = Math.round(allPrices.reduce((a, b) => a + b, 0) / (allPrices.length || 1));
          MOCK_WEEKLY_CHART.cropYearPeak = Math.max(...allPrices);
        }

        saveItem(STORAGE_KEYS.PRICES, remotePrices);
        notify();
      }
    }, (err) => console.warn('[Mobile] SRA prices listener notice:', err));

    // 2. Live Field Plots Listener
    const unsubFields = onSnapshot(collection(db, 'fields'), (snapshot) => {
      if (snapshot.empty) return;
      const remoteFields = [];
      snapshot.forEach(docSnap => remoteFields.push(docSnap.data()));

      remoteFields.forEach(rf => {
        const idx = MOCK_FIELDS.findIndex(lf => lf.id === rf.id);
        if (idx >= 0) {
          MOCK_FIELDS[idx] = { ...MOCK_FIELDS[idx], ...rf };
        } else {
          MOCK_FIELDS.push(rf);
        }
      });
      saveItem(STORAGE_KEYS.FIELDS, MOCK_FIELDS);
      notify();
    }, (err) => console.warn('[Mobile] Fields listener notice:', err));

    return () => {
      unsubPrices();
      unsubFields();
    };
  } catch (err) {
    console.warn('[Mobile] Error setting up Cloud listeners:', err);
    return () => {};
  }
};

export const initializeOfflineStorage = async () => {
  try {
    await initSyncEngine();
    const stored = await hydrateAllStorage();
    if (stored[STORAGE_KEYS.SESSION]) CURRENT_SESSION = stored[STORAGE_KEYS.SESSION];
    if (Array.isArray(stored[STORAGE_KEYS.LOGS])) MOCK_LOGS = stored[STORAGE_KEYS.LOGS];
    if (Array.isArray(stored[STORAGE_KEYS.DRAFTS])) DRAFT_LOGS = stored[STORAGE_KEYS.DRAFTS];
    if (Array.isArray(stored[STORAGE_KEYS.FIELDS])) MOCK_FIELDS = stored[STORAGE_KEYS.FIELDS];
    if (Array.isArray(stored[STORAGE_KEYS.TICKETS])) MOCK_TICKETS = stored[STORAGE_KEYS.TICKETS];
    if (stored[STORAGE_KEYS.PREFS]) SECURITY_PREFERENCES = stored[STORAGE_KEYS.PREFS];
    if (Array.isArray(stored[STORAGE_KEYS.PENDING_ASSIGNMENTS])) MOCK_ASSIGNMENT_REQUESTS = stored[STORAGE_KEYS.PENDING_ASSIGNMENTS];
    
    // Check outbox count to update pending logs indicator
    const outboxCount = getOutboxCount();
    if (outboxCount > 0) {
      IS_SYNCED = false;
      CURRENT_SESSION.pendingLogs = outboxCount;
    }

    notify();

    // Start real-time Firestore listeners
    listenToCloudSync();
  } catch (error) {
    console.warn('[mockData] Startup hydration failed, using memory seeds:', error);
  }
};

// Auto-invoke hydration on bundle load
initializeOfflineStorage();


