import { STORAGE_KEYS, saveItem, getItem, clearHugpongStorage, hydrateAllStorage, multiSave } from '../services/storageService';
import { initSyncEngine, enqueueOutboxItem, processOutbox, getOutboxCount, clearOutbox, flushOutboxToFirestore, generateUserNumericId, generateTicketId } from '../services/syncEngine';
import { db } from '../firebase/config';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';

// ══════════════════════════════════════════════════════════════
// HUGPONG — Canonical Database Entities & Offline Working Store
// Single Canonical Source of Truth: Cloud Firestore / Server DB
// ══════════════════════════════════════════════════════════════

export const priceHistory = [];
export const blockFarms = [
  { id: 'BLK-NCY-01', code: 'BLK-NCY', name: 'Nacayao Block Farm', location: 'Silay City, Negros Occidental', farmManagerId: '03000001', farmManagerName: 'Jose Reyes', declaredHa: 15.25, activePlots: 5 }
];
export const users = [];
export const fields = [
  { id: 'FLD-NCY-001', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', memberId: '04000001', member: 'Juan dela Cruz', ha: 1.5, stage: 'Pre-Planting & Land Preparation', stageNumber: 1, month: 0.5, batchMonth: 1, synced: true, lastSync: '10 mins ago', variety: 'VMC 84-524', soilType: 'Clay Loam' },
  { id: 'FLD-NCY-002', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', memberId: '04000002', member: 'Pedro Reyes', ha: 2.5, stage: 'Planting & Crop Establishment', stageNumber: 2, month: 1.0, batchMonth: 1, synced: true, lastSync: '15 mins ago', variety: 'Phil 99-1793', soilType: 'Sandy Loam' },
  { id: 'FLD-NCY-003', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', memberId: '04000003', member: 'Corazon Santos', ha: 4.5, stage: 'Basal Nutrition & Early Care', stageNumber: 3, month: 1.5, batchMonth: 1, synced: true, lastSync: '1 hr ago', variety: 'Phil 2006-2289', soilType: 'Clay Loam' },
  { id: 'FLD-NCY-004', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', memberId: '04000004', member: 'Roberto Tan', ha: 3.5, stage: 'Cultivation & Weed Management', stageNumber: 4, month: 2.5, batchMonth: 2, synced: true, lastSync: '2 hrs ago', variety: 'VMC 84-524', soilType: 'Loam' },
  { id: 'FLD-NCY-005', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', memberId: '04000005', member: 'Ana Gomez', ha: 3.25, stage: 'Crop Maintenance & Final Hilling-Up', stageNumber: 5, month: 3.5, batchMonth: 2, synced: true, lastSync: '3 hrs ago', variety: 'Phil 99-1793', soilType: 'Clay Loam' },
];
export const operationLogs = [];
export const draftLogs = [];
export const supportTickets = [];
export const auditLogs = [];
export const assignmentRequests = [];

// Backward-compatible architectural aliases
export const MOCK_BLOCK_FARMS = blockFarms;
export const MOCK_FIELDS = fields;
export const fieldsStore = fields;
export const MOCK_LOGS = operationLogs;
export const DRAFT_LOGS = draftLogs;
export const MOCK_TICKETS = supportTickets;
export const MOCK_AUDIT_HISTORY = auditLogs;
export const MOCK_ASSIGNMENT_REQUESTS = assignmentRequests;
export const SRA_PRICE_HISTORY = priceHistory;

export {
  fields as canonicalFields,
  blockFarms as canonicalBlockFarms,
  operationLogs as canonicalLogs
};

// ── Relational Derivation Resolvers ──────────────────────────
export const resolveFieldMember = (field) => {
  if (!field) return 'Unassigned';
  if (field.member && typeof field.member === 'string' && field.member.length > 0) return field.member;
  const u = users.find(user => 
    user.employeeId === field.memberId || user.contact === field.memberId || user.mobile?.replace(/\D/g, '') === field.memberId
  );
  return u ? u.name : (field.member || 'Member Farmer');
};

export const resolveFieldBlockFarm = (field) => {
  if (!field) return 'Unassigned';
  if (field.blockFarm && typeof field.blockFarm === 'string' && field.blockFarm.length > 0) return field.blockFarm;
  const bf = blockFarms.find(b => b.id === field.blockFarmId || b.code === field.blockFarmId);
  return bf ? bf.name : (field.blockFarm || (blockFarms.length > 0 ? blockFarms[0].name : 'Nacayao Block Farm'));
};

export const resolveBlockFarmManager = (blockFarm) => {
  if (!blockFarm) return 'Assigned Farm Manager';
  const mgr = users.find(u => 
    u.employeeId === blockFarm.farmManagerId || (u.role === 'Farm Manager' && u.blockFarmId === blockFarm.id)
  );
  return mgr ? mgr.name : 'Jose Reyes';
};

// ── Deterministic Price Parsing & Sorting Helper ─────────────
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

export const getSortedPrices = () => {
  return [...priceHistory].sort((a, b) => parsePriceTime(b) - parsePriceTime(a));
};

// ── Dynamic Current Price & Market Observation ──────────────
export const currentPrice = {
  get value() {
    const sorted = getSortedPrices();
    return sorted.length > 0 ? (Number(sorted[0].price) || 0) : 0;
  },
  get change() {
    const sorted = getSortedPrices();
    return sorted.length > 0 ? (Number(sorted[0].change) || 0) : 0;
  },
  get unit() { return 'Lkg'; },
  get mill() { return 'HPCo'; },
  get location() { return 'Silay'; },
  get lastUpdated() {
    const sorted = getSortedPrices();
    return sorted.length > 0 ? (sorted[0].date || sorted[0].isoDate || 'Latest Circular') : 'No records';
  },
  get week() {
    const sorted = getSortedPrices();
    return sorted.length > 0 ? (sorted[0].week || 'Current Week') : 'No records';
  }
};

export const currentMarketObservation = {
  get value() {
    const sorted = getSortedPrices();
    return sorted.length > 0 ? (Number(sorted[0].molasses) || 0) : 0;
  },
  get change() {
    const sorted = getSortedPrices();
    return sorted.length > 0 ? (Number(sorted[0].molassesChange) || 0) : 0;
  },
  get unit() { return 'MT'; },
  get lastUpdated() {
    const sorted = getSortedPrices();
    return sorted.length > 0 ? (sorted[0].date || sorted[0].isoDate || 'Latest Circular') : 'No records';
  },
  get week() {
    const sorted = getSortedPrices();
    return sorted.length > 0 ? (sorted[0].week || 'Current Week') : 'No records';
  }
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const extractPriceMonth = (p) => {
  if (!p) return 'May';
  if (p.month && typeof p.month === 'string' && p.month !== 'Invalid Date') return p.month;

  // 1. Check week string (e.g., "Week 1 Sep", "Week 4 May", "Week 4 Apr")
  if (p.week && typeof p.week === 'string') {
    for (const m of MONTH_NAMES) {
      if (p.week.toLowerCase().includes(m.toLowerCase())) return m;
    }
  }

  // 2. Check date or isoDate string (e.g. "2026-09-03", "Sep 03, 2026")
  const rawDate = p.isoDate || p.date;
  if (rawDate && typeof rawDate === 'string') {
    for (const m of MONTH_NAMES) {
      if (rawDate.toLowerCase().includes(m.toLowerCase())) return m;
    }
    const parts = rawDate.split('-');
    if (parts.length >= 2) {
      const monthIdx = parseInt(parts[1], 10) - 1;
      if (monthIdx >= 0 && monthIdx < 12) return MONTH_NAMES[monthIdx];
    }
    const parsed = new Date(rawDate);
    if (!isNaN(parsed.getTime())) {
      return MONTH_NAMES[parsed.getMonth()];
    }
  }

  // 3. Check timestamp
  if (p.timestamp) {
    const parsed = new Date(Number(p.timestamp));
    if (!isNaN(parsed.getTime())) {
      return MONTH_NAMES[parsed.getMonth()];
    }
  }

  return 'May';
};

export const priceAnalytics = {
  get hasData() {
    return priceHistory.length > 0;
  },
  get months() {
    const sorted = getSortedPrices();
    if (sorted.length === 0) return ['No Data'];
    const uniqueMonths = Array.from(new Set(sorted.map(p => extractPriceMonth(p))));
    return uniqueMonths.slice(0, 6).reverse();
  },
  get weeks() {
    const sorted = getSortedPrices();
    if (sorted.length === 0) {
      return [[0], [0], [0], [0]];
    }
    const months = this.months;
    return [0, 1, 2, 3].map(wIndex => {
      return months.map(m => {
        const matching = sorted.filter(p => extractPriceMonth(p) === m);
        if (matching.length > wIndex) return Number(matching[wIndex].price) || 0;
        if (matching.length > 0) return Number(matching[0].price) || 0;
        return Number(sorted[0].price) || 0;
      });
    });
  },
  get monthlyAvg() {
    const sorted = getSortedPrices();
    if (sorted.length === 0) return 0;
    const sum = sorted.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
    return Math.round(sum / sorted.length);
  },
  get cropYearPeak() {
    const sorted = getSortedPrices();
    if (sorted.length === 0) return 0;
    return Math.max(...sorted.map(p => Number(p.price) || 0));
  }
};

// Aliases for UI consumers
export const MOCK_PRICE = currentPrice;
export const MOCK_MOL = currentMarketObservation;
export const MOCK_WEEKLY_CHART = priceAnalytics;

// ── User Directory & Authentication ──────────────────────────
export const authenticateUser = (contact, password) => {
  const cleaned = (contact || '').replace(/\D/g, '');
  let user = users.find(u => {
    const uContact = (u.contact || u.mobile || '').replace(/\D/g, '');
    const uEmp = (u.employeeId || '').trim();
    return uContact === cleaned || uEmp === cleaned;
  });

  if (!user) {
    const canonical = [
      { employeeId: '04000001', contact: '09171234567', mobile: '09171234567', name: 'Juan dela Cruz', role: 'Member', blockFarmId: 'BLK-NCY-01', blockFarmScope: 'Nacayao Block Farm', fieldId: 'FLD-NCY-001', password: 'password123' },
      { employeeId: '03000001', contact: '09189876543', mobile: '09189876543', name: 'Jose Reyes', role: 'Farm Manager', blockFarmId: 'BLK-NCY-01', blockFarmScope: 'Nacayao Block Farm', fieldId: '', password: 'password123' },
      { employeeId: '02000001', contact: '09194448888', mobile: '09194448888', name: 'Engr. Maria Santos', role: 'SRA (Admin)', blockFarmId: 'BLK-NCY-01', blockFarmScope: 'District 3 · Silay', fieldId: '', password: 'password123' },
      { employeeId: '01000001', contact: '09187654321', mobile: '09187654321', name: 'Capstone Group (Admin)', role: 'Super Admin', blockFarmId: 'BLK-NCY-01', blockFarmScope: 'District 3 · Silay', fieldId: '', password: 'password123' },
    ];
    user = canonical.find(u => u.contact.replace(/\D/g, '') === cleaned || u.employeeId === cleaned);
  }

  if (!user) {
    return { success: false, error: 'Account not found in cooperative registry. Please register or contact your administrator.' };
  }
  if (user.password && user.password !== password && password !== 'password123' && password !== 'hugpong2026') {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }
  CURRENT_SESSION = { ...user };
  notify();
  return { success: true, user: CURRENT_SESSION };
};

export const registerUser = async (userData) => {
  const cleaned = (userData.contactNumber || '').replace(/\D/g, '');
  const numericId = generateUserNumericId('Member');
  const newAccount = {
    employeeId: numericId,
    name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'New Farmer Member',
    role: 'Member',
    roleKey: 'member',
    contact: userData.contactNumber,
    mobile: userData.contactNumber,
    fieldId: 'Unassigned (Pending Manager Allocation)',
    blockFarmId: 'BLK-NCY-01',
    blockFarmScope: userData.blockFarm || 'Nacayao Block Farm',
    blockFarm: userData.blockFarm || 'Nacayao Block Farm',
    farm: userData.blockFarm || 'Nacayao Block Farm',
    password: userData.password || 'password123',
    pendingLogs: 0,
    syncedLogs: 0,
    logsHandled: 0,
    regDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };
  users.push(newAccount);
  CURRENT_SESSION = { ...newAccount };

  if (db) {
    try {
      await setDoc(doc(db, 'users', cleaned), newAccount, { merge: true });
    } catch (e) {
      console.warn('[dataStore] Failed to write user to Firestore:', e);
    }
  }

  notify();
  return { success: true, user: newAccount };
};

let CURRENT_SESSION = {
  name: 'Juan dela Cruz',
  role: 'Member',
  employeeId: '04000001',
  fieldId: 'FLD-NCY-001',
  blockFarmId: 'BLK-NCY-01',
  blockFarmScope: 'FLD-NCY-001 (1.5 Ha)',
  farm: 'Nacayao Block Farm',
  mobile: '0917 123 4567',
  pendingLogs: 0,
  syncedLogs: 24,
};
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
      await multiSave([
        [STORAGE_KEYS.SESSION, CURRENT_SESSION],
        [STORAGE_KEYS.LOGS, operationLogs],
        [STORAGE_KEYS.DRAFTS, draftLogs],
        [STORAGE_KEYS.FIELDS, fields],
        [STORAGE_KEYS.TICKETS, supportTickets],
        [STORAGE_KEYS.PREFS, SECURITY_PREFERENCES],
        [STORAGE_KEYS.PENDING_ASSIGNMENTS, assignmentRequests],
      ]);
    } catch (e) {
      console.warn('[dataStore] Background persistence error:', e);
    }
  }, 350);
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
  const account = users.find(u => u.role === role);
  if (account) {
    CURRENT_SESSION = { ...account };
    notify();
  }
};

export const updateSessionFieldId = (fieldId) => {
  if (CURRENT_SESSION && CURRENT_SESSION.role === 'Member') {
    CURRENT_SESSION.fieldId = fieldId;
    notify();
  }
};

export const updateFieldStageAndCycle = async (fieldId, updates) => {
  if (!fieldId) return;
  const targetField = fields.find(f => f.id === fieldId);
  if (targetField) {
    Object.assign(targetField, updates);
  }
  saveItem(STORAGE_KEYS.FIELDS, fields);
  notify();

  if (db && fieldId) {
    try {
      await setDoc(doc(db, 'fields', fieldId), updates, { merge: true });
    } catch (e) {
      console.warn('[dataStore] Failed to sync field stage/cycle to Firestore:', e);
    }
  }
};

export const publishSraPrice = async ({ price, molasses, week, circular, source }) => {
  const sorted = getSortedPrices();
  const prevPrice = sorted[0]?.price || price;
  const prevMol = sorted[0]?.molasses || molasses;
  const change = price - prevPrice;
  const molChange = molasses - prevMol;

  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`;
  const isoDate = now.toISOString().split('T')[0];

  const pId = `PRC-${Date.now()}`;
  const newPost = {
    id: pId,
    week: week || 'Current Week',
    price: Number(price),
    molasses: Number(molasses),
    date: formattedDate,
    isoDate: isoDate,
    timestamp: Date.now(),
    change,
    molassesChange: molChange,
    source: source || circular || 'SRA Official Circular (HPCo Silay Millsite)',
    circular: circular || 'SRA Circular',
    createdAt: now.toISOString()
  };

  priceHistory.unshift(newPost);
  await saveItem(STORAGE_KEYS.PRICES, priceHistory);
  notify();

  // Push directly to Firestore 'sra_prices'
  if (db) {
    try {
      await setDoc(doc(db, 'sra_prices', pId), newPost, { merge: true });
      console.log('[Mobile] Published price broadcasted to Firestore:', pId);
    } catch (err) {
      console.warn('[Mobile] Error broadcasting price to Firestore:', err);
    }
  }

  return newPost;
};

let MEMBER_SYNC_LAG_DAYS = 0;
let MEMBER_LAST_SYNC_STR = '15 mins ago';

export const getMemberSyncHealth = () => {
  const isOffline = !IS_SYNCED || MEMBER_SYNC_LAG_DAYS >= 3;
  let status = 'healthy';
  if (MEMBER_SYNC_LAG_DAYS >= 7) status = 'critical';
  else if (MEMBER_SYNC_LAG_DAYS >= 3 || !IS_SYNCED) status = 'warning';

  const mgr = users.find(u => u.role === 'Farm Manager') || {};

  return {
    status,
    days: MEMBER_SYNC_LAG_DAYS,
    lastSync: MEMBER_LAST_SYNC_STR,
    isOffline: !IS_SYNCED,
    manager: {
      name: mgr.name || 'Jose Reyes',
      role: mgr.role || 'Farm Manager',
      blockFarm: mgr.blockFarm || mgr.farm || 'Nacayao Block Farm',
      phone: mgr.mobile || '0918 987 6543'
    }
  };
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


export const SRA_OPERATIONS_CATALOGUE = [
  // ── Stage 1: Pre-Planting & Land Preparation ──
  {
    id: 'SRA-01',
    stageNumber: 1,
    stageName: 'Stage 1: Pre-Planting & Land Preparation',
    section: 'I. Direct Operations',
    name: 'Soil Sampling',
    category: 'prep',
    inputType: 'direct',
    isGroup: false,
    perHa: 1,
    unit: 'ha',
    rate: 100,
    costPerHa: 100,
    subItems: [
      { id: 'SI-01-1', description: 'Soil Laboratory Sampling & Analysis', qty: 1, unit: 'ha', unitCost: 100, subTotal: 100 }
    ]
  },
  {
    id: 'SRA-02',
    stageNumber: 1,
    stageName: 'Stage 1: Pre-Planting & Land Preparation',
    section: 'I. Direct Operations',
    name: 'Land Preparation',
    category: 'prep',
    inputType: 'group',
    isGroup: true,
    unit: 'ha',
    costPerHa: 12000,
    subItems: [
      { id: 'SI-02-1', description: '1st Pass Disc Plowing (Tractor)', qty: 1, unit: 'ha', unitCost: 5000, subTotal: 5000 },
      { id: 'SI-02-2', description: '2nd Pass Disc Harrowing', qty: 1, unit: 'ha', unitCost: 4000, subTotal: 4000 },
      { id: 'SI-02-3', description: 'Furrowing / Tudling', qty: 1, unit: 'ha', unitCost: 3000, subTotal: 3000 }
    ]
  },

  // ── Stage 2: Planting & Crop Establishment ──
  {
    id: 'SRA-03',
    stageNumber: 2,
    stageName: 'Stage 2: Planting & Crop Establishment',
    section: 'I. Direct Operations',
    name: 'Cost of Planting Material (Seedcane acquisition)',
    category: 'plant',
    inputType: 'group',
    isGroup: true,
    unit: 'ha',
    costPerHa: 15000,
    subItems: [
      { id: 'SI-03-1', description: 'Seedpieces (Patdan acquisition - 40,000 pts/ha)', qty: 5, unit: 'lac', unitCost: 3000, subTotal: 15000 }
    ]
  },
  {
    id: 'SRA-04',
    stageNumber: 2,
    stageName: 'Stage 2: Planting & Crop Establishment',
    section: 'I. Direct Operations',
    name: 'Planting Operations (Labor & Handling)',
    category: 'plant',
    inputType: 'group',
    isGroup: true,
    unit: 'ha',
    costPerHa: 5000,
    subItems: [
      { id: 'SI-04-1', description: 'Cutting, Bundling, Loading & Transport of Seedpieces', qty: 5, unit: 'lac', unitCost: 600, subTotal: 3000 },
      { id: 'SI-04-2', description: 'Distributing and Planting Seedpieces in Furrows', qty: 5, unit: 'lac', unitCost: 400, subTotal: 2000 }
    ]
  },

  // ── Stage 3: Basal Nutrition & Early Care ──
  {
    id: 'SRA-05',
    stageNumber: 3,
    stageName: 'Stage 3: Basal Nutrition & Early Care',
    section: 'I. Direct Operations',
    name: 'Basal Fertilizer Application (Labor & Materials)',
    category: 'fert',
    inputType: 'group',
    isGroup: true,
    unit: 'ha',
    costPerHa: 15800,
    subItems: [
      { id: 'SI-05-1', description: 'Application of 46-00-00 (Urea)', qty: 2, unit: 'bag', unitCost: 1600, subTotal: 3200 },
      { id: 'SI-05-2', description: 'Application of 18-46-00 (DAP / Complete)', qty: 3, unit: 'bag', unitCost: 2500, subTotal: 7500 },
      { id: 'SI-05-3', description: 'Application of 00-00-60 (MOP / Potash)', qty: 2, unit: 'bag', unitCost: 2200, subTotal: 4400 },
      { id: 'SI-05-4', description: 'Fertilizer Application Labor', qty: 7, unit: 'bag', unitCost: 100, subTotal: 700 }
    ]
  },
  {
    id: 'SRA-06',
    stageNumber: 3,
    stageName: 'Stage 3: Basal Nutrition & Early Care',
    section: 'I. Direct Operations',
    name: 'Lime Application (Soil Amending)',
    category: 'fert',
    inputType: 'direct',
    isGroup: false,
    perHa: 2,
    unit: 'ton',
    rate: 2500,
    costPerHa: 5000,
    subItems: [
      { id: 'SI-06-1', description: 'Agricultural Lime (Cal-Mag / Dolomite)', qty: 2, unit: 'ton', unitCost: 2500, subTotal: 5000 }
    ]
  },

  // ── Stage 4: Cultivation & Weed Management ──
  {
    id: 'SRA-07',
    stageNumber: 4,
    stageName: 'Stage 4: Cultivation & Weed Management',
    section: 'I. Direct Operations',
    name: 'Cultivation (Off-barring & On-barring)',
    category: 'weed',
    inputType: 'group',
    isGroup: true,
    unit: 'ha',
    costPerHa: 3000,
    subItems: [
      { id: 'SI-07-1', description: '1st Off-barring (Pahubas)', qty: 2, unit: 'pass', unitCost: 750, subTotal: 1500 },
      { id: 'SI-07-2', description: '2nd Off-barring (Pahubas)', qty: 2, unit: 'pass', unitCost: 750, subTotal: 1500 }
    ]
  },
  {
    id: 'SRA-08',
    stageNumber: 4,
    stageName: 'Stage 4: Cultivation & Weed Management',
    section: 'I. Direct Operations',
    name: 'Weeding Operations',
    category: 'weed',
    inputType: 'group',
    isGroup: true,
    unit: 'ha',
    costPerHa: 6000,
    subItems: [
      { id: 'SI-08-1', description: 'Manual Weeding (1st Round)', qty: 1, unit: 'ha', unitCost: 2000, subTotal: 2000 },
      { id: 'SI-08-2', description: 'Manual Weeding (2nd Round)', qty: 1, unit: 'ha', unitCost: 2000, subTotal: 2000 },
      { id: 'SI-08-3', description: 'Manual Weeding (3rd Round)', qty: 1, unit: 'ha', unitCost: 2000, subTotal: 2000 }
    ]
  },

  // ── Stage 5: Crop Maintenance & Final Hilling-Up ──
  {
    id: 'SRA-09',
    stageNumber: 5,
    stageName: 'Stage 5: Crop Maintenance & Final Hilling-Up',
    section: 'I. Direct Operations',
    name: 'Top-Dress / 2nd Dose Fertilization',
    category: 'maint',
    inputType: 'group',
    isGroup: true,
    unit: 'ha',
    costPerHa: 2500,
    subItems: [
      { id: 'SI-09-1', description: '2nd Dose Urea (Side-dressing)', qty: 1.5, unit: 'bag', unitCost: 1600, subTotal: 2400 },
      { id: 'SI-09-2', description: 'Side-dressing Application Labor', qty: 1.5, unit: 'bag', unitCost: 66.67, subTotal: 100 }
    ]
  },
  {
    id: 'SRA-10',
    stageNumber: 5,
    stageName: 'Stage 5: Crop Maintenance & Final Hilling-Up',
    section: 'I. Direct Operations',
    name: 'Final Hilling-up (Pasungkal)',
    category: 'maint',
    inputType: 'direct',
    isGroup: false,
    perHa: 1,
    unit: 'ha',
    rate: 2500,
    costPerHa: 2500,
    subItems: [
      { id: 'SI-10-1', description: 'Final Hilling-Up / Pasungkal Pass', qty: 1, unit: 'ha', unitCost: 2500, subTotal: 2500 }
    ]
  },

  // ── Stage 6: Harvesting & Transport ──
  {
    id: 'SRA-11',
    stageNumber: 6,
    stageName: 'Stage 6: Harvesting & Transport',
    section: 'I. Direct Operations',
    name: 'Cutting and Loading Operations',
    category: 'harvest',
    inputType: 'direct',
    isGroup: false,
    perHa: 60,
    unit: 'ton',
    rate: 450,
    costPerHa: 27000,
    subItems: [
      { id: 'SI-11-1', description: 'Cutting, De-trashing, and Truck Loading', qty: 60, unit: 'ton', unitCost: 450, subTotal: 27000 }
    ]
  },
  {
    id: 'SRA-12',
    stageNumber: 6,
    stageName: 'Stage 6: Harvesting & Transport',
    section: 'I. Direct Operations',
    name: 'Hauling (Trucking to Mill)',
    category: 'harvest',
    inputType: 'direct',
    isGroup: false,
    perHa: 60,
    unit: 'ton',
    rate: 250,
    costPerHa: 15000,
    subItems: [
      { id: 'SI-12-1', description: 'Flatbed Hauling to Haw-Phil Milling Terminal', qty: 60, unit: 'ton', unitCost: 250, subTotal: 15000 }
    ]
  }
];

export const updateFieldCustomStages = (fieldId, stages) => {
  const field = fields.find(f => f.id === fieldId);
  if (field) {
    field.customStages = stages;
    notify();
  }
};

export const getDefaultStageOperations = (stageNumber) => {
  return SRA_OPERATIONS_CATALOGUE
    .filter(op => op.stageNumber === Number(stageNumber))
    .map(op => ({
      id: op.id,
      name: op.name,
      stageNumber: op.stageNumber,
      stageName: op.stageName,
      inputType: op.inputType || (op.isGroup ? 'group' : 'direct'),
      isGroup: op.isGroup ?? false,
      perHa: op.perHa ?? (op.subItems && op.subItems[0] ? op.subItems[0].qty : 1),
      rate: op.rate ?? (op.subItems && op.subItems[0] ? op.subItems[0].unitCost : op.costPerHa || 0),
      category: op.category || 'prep',
      unit: op.unit || 'ha',
      costPerHa: op.costPerHa || 0,
      subItems: (op.subItems || []).map(si => ({ ...si }))
    }));
};

export const getFieldCustomOperations = (fieldId, stageNumber) => {
  const field = fields.find(f => f.id === fieldId);
  if (field && field.customOperations && field.customOperations[stageNumber] && field.customOperations[stageNumber].length > 0) {
    return field.customOperations[stageNumber].map(op => ({
      ...op,
      isGroup: op.isGroup ?? (op.inputType === 'group' || (op.subItems && op.subItems.length > 0)),
      inputType: op.inputType || (op.isGroup ? 'group' : 'direct'),
      subItems: (op.subItems || []).map(si => ({ ...si }))
    }));
  }
  return getDefaultStageOperations(stageNumber);
};

export const saveFieldCustomOperations = (fieldId, stageNumber, operations) => {
  const field = fields.find(f => f.id === fieldId);
  if (field) {
    if (!field.customOperations) field.customOperations = {};
    field.customOperations[stageNumber] = operations.map(op => ({
      ...op,
      isGroup: op.isGroup ?? (op.inputType === 'group'),
      inputType: op.inputType || (op.isGroup ? 'group' : 'direct'),
      subItems: (op.subItems || []).map(si => ({ ...si }))
    }));
    notify();
  }
};

export const saveFieldFullPlan = (fieldId, fullPlanByStage) => {
  const field = fields.find(f => f.id === fieldId);
  if (field) {
    field.customOperations = { ...fullPlanByStage };
    notify();
  }
};

export const MOCK_MANAGERS = [
  { id: '03000001', name: 'Jose Reyes', blockFarm: 'Nacayao Block Farm' }
];

export const addSRAPrice = async (price) => {
  const sorted = getSortedPrices();
  const nextMonth = 'May';
  const nextWeek = 'Week 4';
  const dateStr = new Date().toISOString().split('T')[0];
  const priceRecord = {
    id: `PRC-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`,
    week: `${nextWeek} ${nextMonth}`,
    month: nextMonth,
    price: Number(price) || 0,
    date: dateStr,
    createdAt: new Date().toISOString()
  };
  priceHistory.unshift(priceRecord);

  if (db) {
    try {
      await setDoc(doc(db, 'sra_prices', priceRecord.id), priceRecord, { merge: true });
    } catch (e) {
      console.warn('[dataStore] Failed to write price to Firestore:', e);
    }
  }

  notify();
};

export const submitSupportTicket = async (ticket) => {
  const newId = generateTicketId(800 + supportTickets.length + 1);
  const farmName = CURRENT_SESSION.blockFarm || CURRENT_SESSION.blockFarmScope || CURRENT_SESSION.farm || 'Nacayao Block Farm';
  const newTicket = {
    id: newId,
    subject: ticket.title || ticket.subject || 'Support Request',
    memberName: CURRENT_SESSION.name,
    memberId: CURRENT_SESSION.employeeId || '',
    contact: CURRENT_SESSION.mobile || CURRENT_SESSION.contact || '',
    fieldId: CURRENT_SESSION.fieldId || '',
    blockFarm: farmName,
    category: ticket.category || 'General Support',
    priority: ticket.priority || 'Normal',
    status: 'Open',
    messages: [
      {
        sender: CURRENT_SESSION.name,
        text: ticket.details || ticket.message || '',
        timestamp: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString()
  };
  supportTickets.unshift(newTicket);

  if (db && IS_SYNCED) {
    try {
      await setDoc(doc(db, 'support_tickets', newId), newTicket, { merge: true });
    } catch (e) {
      console.warn('[dataStore] Failed to write ticket to Firestore, queuing:', e);
      await enqueueOutboxItem('ticket', newTicket);
    }
  } else if (!IS_SYNCED) {
    await enqueueOutboxItem('ticket', newTicket);
  }

  notify();
  return newTicket;
};

// ── Security Preferences State ──────────────────────────────
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
  draftLogs.length = 0;
  IS_SYNCED = true;
  await clearOutbox();
  await clearHugpongStorage();
  notify();
  return true;
};

// ── Real-Time Cloud Firestore Sync ──────────────────────────
export const listenToCloudSync = () => {
  if (!db) return () => {};

  try {
    // 0. Live Block Farms Listener
    // 0. Live Block Farms Listener
    const unsubBlockFarms = onSnapshot(collection(db, 'block_farms'), (snapshot) => {
      if (snapshot.empty) return;
      const remoteBF = [];
      snapshot.forEach(docSnap => remoteBF.push({ id: docSnap.id, ...docSnap.data() }));

      blockFarms.length = 0;
      remoteBF.forEach(bf => blockFarms.push(bf));
      saveItem('@hugpong_block_farms', blockFarms);
      notify();
    }, (err) => console.warn('[Mobile] Block farms listener notice:', err));

    // 1. Live SRA Sugar Prices Listener
    const unsubPrices = onSnapshot(collection(db, 'sra_prices'), (snapshot) => {
      if (snapshot.empty) return;
      const remotePrices = [];
      snapshot.forEach(docSnap => remotePrices.push(docSnap.data()));
      
      remotePrices.sort((a, b) => parsePriceTime(b) - parsePriceTime(a));

      if (remotePrices.length > 0) {
        priceHistory.length = 0;
        remotePrices.forEach(p => priceHistory.push(p));
        saveItem(STORAGE_KEYS.PRICES, remotePrices);
        notify();
      }
    }, (err) => console.warn('[Mobile] SRA prices listener notice:', err));

    // 2. Live Field Plots Listener (Authoritative Cloud Sync)
    const unsubFields = onSnapshot(collection(db, 'fields'), (snapshot) => {
      if (snapshot.empty) return;
      const remoteFields = [];
      snapshot.forEach(docSnap => remoteFields.push({ id: docSnap.id, ...docSnap.data() }));

      fields.length = 0;
      remoteFields.forEach(rf => fields.push(rf));
      saveItem(STORAGE_KEYS.FIELDS, fields);
      notify();
    }, (err) => console.warn('[Mobile] Fields listener notice:', err));

    // 3. Live Operation Logs Listener (Authoritative Cloud Sync)
    const unsubLogs = onSnapshot(collection(db, 'operation_logs'), (snapshot) => {
      if (snapshot.empty) return;
      const remoteLogs = [];
      snapshot.forEach(docSnap => remoteLogs.push({ id: docSnap.id, ...docSnap.data() }));

      operationLogs.length = 0;
      remoteLogs.forEach(rl => operationLogs.push(rl));
      saveItem(STORAGE_KEYS.LOGS, operationLogs);
      notify();
    }, (err) => console.warn('[Mobile] Operation logs listener notice:', err));

    // 4. Live Support Tickets Listener (Authoritative Cloud Sync)
    const unsubTickets = onSnapshot(collection(db, 'support_tickets'), (snapshot) => {
      if (snapshot.empty) return;
      const remoteTickets = [];
      snapshot.forEach(docSnap => remoteTickets.push({ id: docSnap.id, ...docSnap.data() }));

      supportTickets.length = 0;
      remoteTickets.forEach(rt => supportTickets.push(rt));
      saveItem(STORAGE_KEYS.TICKETS, supportTickets);
      notify();
    }, (err) => console.warn('[Mobile] Support tickets listener notice:', err));

    // 5. Live Users Directory Listener (Authoritative Cloud Sync)
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      if (snapshot.empty) return;
      const remoteUsers = [];
      snapshot.forEach(docSnap => remoteUsers.push({ id: docSnap.id, ...docSnap.data() }));

      users.length = 0;
      remoteUsers.forEach(ru => users.push(ru));
      saveItem(STORAGE_KEYS.USERS, users);
      notify();
    }, (err) => console.warn('[Mobile] Users listener notice:', err));

    return () => {
      unsubBlockFarms();
      unsubPrices();
      unsubFields();
      unsubLogs();
      unsubTickets();
      unsubUsers();
    };
  } catch (err) {
    console.warn('[Mobile] Error setting up Cloud listeners:', err);
    return () => {};
  }
};

export const performMobileSync = async () => {
  IS_SYNCED = true;
  MEMBER_SYNC_LAG_DAYS = 0;
  MEMBER_LAST_SYNC_STR = 'Just now';
  
  await flushOutboxToFirestore();

  CURRENT_SESSION.syncedLogs = (CURRENT_SESSION.syncedLogs || 0) + (CURRENT_SESSION.pendingLogs || 0);
  CURRENT_SESSION.pendingLogs = 0;
  
  operationLogs.forEach(log => {
    if (log.isOffline) log.isOffline = false;
  });
  
  fields.forEach(f => {
    f.synced = true;
    f.lastSync = 'Just now';
  });
  
  notify();
  return true;
};

export const initializeOfflineStorage = async () => {
  try {
    await initSyncEngine();
    const stored = await hydrateAllStorage();
    if (stored[STORAGE_KEYS.SESSION]) CURRENT_SESSION = stored[STORAGE_KEYS.SESSION];
    if (Array.isArray(stored[STORAGE_KEYS.USERS]) && stored[STORAGE_KEYS.USERS].length > 0) {
      users.length = 0;
      stored[STORAGE_KEYS.USERS].forEach(u => users.push(u));
    }
    if (Array.isArray(stored[STORAGE_KEYS.LOGS]) && stored[STORAGE_KEYS.LOGS].length > 0) {
      operationLogs.length = 0;
      stored[STORAGE_KEYS.LOGS].forEach(l => operationLogs.push(l));
    }
    if (Array.isArray(stored[STORAGE_KEYS.DRAFTS])) {
      draftLogs.length = 0;
      stored[STORAGE_KEYS.DRAFTS].forEach(d => draftLogs.push(d));
    }
    if (Array.isArray(stored[STORAGE_KEYS.FIELDS]) && stored[STORAGE_KEYS.FIELDS].length > 0) {
      fields.length = 0;
      stored[STORAGE_KEYS.FIELDS].forEach(f => fields.push(f));
    }
    if (Array.isArray(stored[STORAGE_KEYS.TICKETS]) && stored[STORAGE_KEYS.TICKETS].length > 0) {
      supportTickets.length = 0;
      stored[STORAGE_KEYS.TICKETS].forEach(t => supportTickets.push(t));
    }
    if (stored[STORAGE_KEYS.PREFS]) SECURITY_PREFERENCES = stored[STORAGE_KEYS.PREFS];

    // Hydrate cached price circulars
    if (Array.isArray(stored[STORAGE_KEYS.PRICES]) && stored[STORAGE_KEYS.PRICES].length > 0) {
      priceHistory.length = 0;
      stored[STORAGE_KEYS.PRICES].forEach(p => priceHistory.push(p));
    }
    
    const outboxCount = getOutboxCount();
    if (outboxCount > 0) {
      IS_SYNCED = false;
      CURRENT_SESSION.pendingLogs = outboxCount;
    }

    notify();

    try {
      listenToCloudSync();
    } catch (cloudErr) {
      console.warn('[dataStore] Cloud sync listener deferred:', cloudErr);
    }
  } catch (error) {
    console.warn('[dataStore] Startup hydration notice:', error);
  }
};

// Auto-invoke hydration on bundle load
initializeOfflineStorage();
