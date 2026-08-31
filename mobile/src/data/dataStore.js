import { STORAGE_KEYS, saveItem, getItem, clearHugpongStorage, hydrateAllStorage } from '../services/storageService';
import { initSyncEngine, enqueueOutboxItem, processOutbox, getOutboxCount, clearOutbox, flushOutboxToFirestore, generateUserNumericId, generateTicketId } from '../services/syncEngine';
import { db } from '../firebase/config';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';

export const MOCK_PRICE = {
  value: 2950,
  change: 70.0,
  unit: 'Lkg',
  mill: 'HPCo',
  location: 'Silay',
  lastUpdated: 'May 21, 2026',
  week: 'Week 4 May',
};

export const MOCK_MOL = {
  value: 4400,
  change: 100.0,
  unit: 'MT',
  lastUpdated: 'May 21, 2026',
  week: 'Week 4 May',
};

export const MOCK_WEEKLY_CHART = {
  months: ['Nov', 'Dec', 'Jan', 'Mar', 'Apr', 'May'],
  weeks: [
    [2100, 2200, 2150, 2400, 2650, 2750],
    [2200, 2250, 2300, 2500, 2700, 2800],
    [2300, 2100, 2350, 2600, 2600, 2880],
    [2400, 2300, 2500, 2550, 2750, 2950],
  ],
  monthlyAvg: 2845,
  cropYearPeak: 2950,
};

export const DEMO_ACCOUNTS = {
  'Member': {
    name: 'Juan dela Cruz',
    role: 'Member',
    employeeId: '04000001',
    fieldId: 'FLD-KTR-001',
    blockFarmScope: 'FLD-KTR-001 (1.5 Ha)',
    farm: 'Nacayao Block Farm A',
    mobile: '0917 123 4567',
    password: 'password123',
    pendingLogs: 0,
    syncedLogs: 24,
  },
  'Farm Manager': {
    name: 'Jose Reyes',
    role: 'Farm Manager',
    employeeId: '03000001',
    fieldId: 'Nacayao Block Farm A',
    blockFarmScope: 'Nacayao Block Farm A (All Assigned Plots)',
    farm: 'Nacayao Block Farm A',
    mobile: '0918 987 6543',
    password: 'manager123',
    pendingLogs: 0,
    syncedLogs: 142,
  },
  'SRA (Admin)': {
    name: 'Maria Santos',
    role: 'SRA (Admin)',
    employeeId: '02000001',
    fieldId: 'All Block Farms',
    blockFarmScope: 'All Silay Block Farms (A, B, C, D)',
    farm: 'Silay Sugar Regulatory Administration',
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
  const numericId = generateUserNumericId('Member');
  const newAccount = {
    name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'New Farmer Member',
    role: 'Member',
    employeeId: numericId,
    fieldId: 'Unassigned (Pending Manager Allocation)',
    blockFarmScope: userData.blockFarm || 'Nacayao Block Farm A',
    farm: userData.blockFarm || 'Nacayao Block Farm A',
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
      console.warn('[dataStore] Background persistence error:', e);
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

  const mgr = DEMO_ACCOUNTS['Farm Manager'] || {};

  return {
    status,
    days: MEMBER_SYNC_LAG_DAYS,
    lastSync: MEMBER_LAST_SYNC_STR,
    isOffline: !IS_SYNCED,
    manager: {
      name: mgr.name || 'Jose Reyes',
      role: mgr.role || 'Farm Manager',
      blockFarm: mgr.farm || 'Nacayao Block Farm A',
      phone: mgr.mobile || '0918 987 6543'
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

export const SRA_BENCHMARKS = {
  directCostPerHa: 66900,
  millingCostPerHa: 51000,
  totalCostPerHa: 117900,
  targetYieldTonsPerHa: 60,
  targetSeedcanePerHa: 5,
  targetFertilizerBagsPerHa: 19,
  totalTillagePassesPerHa: 10,
  totalWeedingRoundsPerHa: 3,
  stageBenchmarks: {
    1: 12100, // Pre-Planting & Land Prep
    2: 20000, // Planting & Establishment
    3: 20800, // Basal Nutrition & Early Care
    4: 9000,  // Cultivation & Weed Management
    5: 5000,  // Crop Maintenance & Hilling-Up
    6: 51000  // Harvesting & Transport
  }
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
    inputType: 'direct', // Direct input: operation has its own input qty & rate
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
    inputType: 'group', // Title-only container: inputs are in child line items
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
    inputType: 'direct',
    isGroup: false,
    perHa: 5,
    unit: 'lac',
    rate: 3000,
    costPerHa: 15000,
    subItems: [
      { id: 'SI-03-1', description: 'Cane Points (Patdan - High Yielding Variety)', qty: 5, unit: 'lac', unitCost: 3000, subTotal: 15000 }
    ]
  },
  {
    id: 'SRA-04',
    stageNumber: 2,
    stageName: 'Stage 2: Planting & Crop Establishment',
    section: 'I. Direct Operations',
    name: 'Planting (including hauling and selection)',
    category: 'plant',
    inputType: 'group',
    isGroup: true,
    unit: 'lac',
    costPerHa: 5000,
    subItems: [
      { id: 'SI-04-1', description: 'Seedcane Selection & Cutting', qty: 5, unit: 'lac', unitCost: 500, subTotal: 2500 },
      { id: 'SI-04-2', description: 'Planting Labor Crew & Distribution', qty: 5, unit: 'lac', unitCost: 500, subTotal: 2500 }
    ]
  },

  // ── Stage 3: Basal Nutrition & Early Care ──
  {
    id: 'SRA-05',
    stageNumber: 3,
    stageName: 'Stage 3: Basal Nutrition & Early Care',
    section: 'I. Direct Operations',
    name: 'Basal Fertilization',
    category: 'fert',
    inputType: 'group', // Title only: inputs are child fertilizers (46-00-00, 18-46-00, 00-00-60)
    isGroup: true,
    unit: 'bag',
    costPerHa: 15100,
    subItems: [
      { id: 'SI-05-1', description: 'Application of 46-00-00 (Urea)', qty: 2, unit: 'bag', unitCost: 1600, subTotal: 3200 },
      { id: 'SI-05-2', description: 'Application of 18-46-00 (DAP / Complete)', qty: 3, unit: 'bag', unitCost: 2500, subTotal: 7500 },
      { id: 'SI-05-3', description: 'Application of 00-00-60 (MOP / Muriate of Potash)', qty: 2, unit: 'bag', unitCost: 2200, subTotal: 4400 }
    ]
  },
  {
    id: 'SRA-06',
    stageNumber: 3,
    stageName: 'Stage 3: Basal Nutrition & Early Care',
    section: 'I. Direct Operations',
    name: 'Fertilizer Application & Soil Amending',
    category: 'fert',
    inputType: 'group',
    isGroup: true,
    unit: 'bag',
    costPerHa: 5700,
    subItems: [
      { id: 'SI-06-1', description: 'Fertilizer Application labor (Basal)', qty: 7, unit: 'bag', unitCost: 100, subTotal: 700 },
      { id: 'SI-06-2', description: 'Application of Rock Phosphate', qty: 10, unit: 'bag', unitCost: 400, subTotal: 4000 },
      { id: 'SI-06-3', description: 'Fertilizer Application labor (Rock Phosphate)', qty: 10, unit: 'bag', unitCost: 100, subTotal: 1000 }
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
    unit: 'pass',
    costPerHa: 3000,
    subItems: [
      { id: 'SI-07-1', description: 'Ridge busting (1 pass)', qty: 1, unit: 'pass', unitCost: 300, subTotal: 300 },
      { id: 'SI-07-2', description: 'Off-barring (Round 1: 2 passes)', qty: 2, unit: 'pass', unitCost: 300, subTotal: 600 },
      { id: 'SI-07-3', description: 'On-barring (2 passes)', qty: 2, unit: 'pass', unitCost: 300, subTotal: 600 },
      { id: 'SI-07-4', description: 'Off-barring (Round 2: 2 passes)', qty: 2, unit: 'pass', unitCost: 300, subTotal: 600 },
      { id: 'SI-07-5', description: 'Hilling-up (3 passes)', qty: 3, unit: 'pass', unitCost: 300, subTotal: 900 }
    ]
  },
  {
    id: 'SRA-10',
    stageNumber: 4,
    stageName: 'Stage 4: Cultivation & Weed Management',
    section: 'I. Direct Operations',
    name: 'Weeding',
    category: 'weed',
    inputType: 'group',
    isGroup: true,
    unit: 'ha',
    costPerHa: 6000,
    subItems: [
      { id: 'SI-10-1', description: '1st Weeding', qty: 1, unit: 'ha', unitCost: 2500, subTotal: 2500 },
      { id: 'SI-10-2', description: '2nd Weeding', qty: 1, unit: 'ha', unitCost: 2000, subTotal: 2000 },
      { id: 'SI-10-3', description: '3rd Weeding', qty: 1, unit: 'ha', unitCost: 1500, subTotal: 1500 }
    ]
  },

  // ── Stage 5: Crop Maintenance & Final Hilling-Up ──
  {
    id: 'SRA-08',
    stageNumber: 5,
    stageName: 'Stage 5: Crop Maintenance & Final Hilling-Up',
    section: 'I. Direct Operations',
    name: 'Fertilization (2nd Dose / Top-dress)',
    category: 'fert',
    inputType: 'group',
    isGroup: true,
    unit: 'bag',
    costPerHa: 3800,
    subItems: [
      { id: 'SI-08-1', description: 'Application of 46-00-00 (Urea)', qty: 1, unit: 'bag', unitCost: 1600, subTotal: 1600 },
      { id: 'SI-08-2', description: 'Application of 00-00-60 (MOP)', qty: 1, unit: 'bag', unitCost: 2200, subTotal: 2200 }
    ]
  },
  {
    id: 'SRA-09',
    stageNumber: 5,
    stageName: 'Stage 5: Crop Maintenance & Final Hilling-Up',
    section: 'I. Direct Operations',
    name: 'Fertilizer Application (2nd dose labor)',
    category: 'fert',
    inputType: 'direct',
    isGroup: false,
    perHa: 2,
    unit: 'bag',
    rate: 100,
    costPerHa: 200,
    subItems: [
      { id: 'SI-09-1', description: 'Fertilizer Application labor (2nd dose)', qty: 2, unit: 'bag', unitCost: 100, subTotal: 200 }
    ]
  },
  {
    id: 'SRA-11',
    stageNumber: 5,
    stageName: 'Stage 5: Crop Maintenance & Final Hilling-Up',
    section: 'I. Direct Operations',
    name: 'Drainage / Irrigation',
    category: 'weed',
    inputType: 'direct',
    isGroup: false,
    perHa: 1,
    unit: 'ha',
    rate: 1000,
    costPerHa: 1000,
    subItems: [
      { id: 'SI-11-1', description: 'Drainage / Irrigation Canal Maintenance', qty: 1, unit: 'ha', unitCost: 1000, subTotal: 1000 }
    ]
  },

  // ── Stage 6: Harvesting & Post-Harvest Transport ──
  {
    id: 'SRA-12',
    stageNumber: 6,
    stageName: 'Stage 6: Harvesting & Post-Harvest Transport',
    section: 'II. Milling Expenses',
    name: 'Cutting and Loading',
    category: 'harvest',
    inputType: 'direct',
    isGroup: false,
    perHa: 60,
    unit: 'ton',
    rate: 350,
    costPerHa: 21000,
    subItems: [
      { id: 'SI-12-1', description: 'Cane Cutting (Tapas) & Truck Loading (Karga)', qty: 60, unit: 'ton', unitCost: 350, subTotal: 21000 }
    ]
  },
  {
    id: 'SRA-13',
    stageNumber: 6,
    stageName: 'Stage 6: Harvesting & Post-Harvest Transport',
    section: 'II. Milling Expenses',
    name: 'Hauling (Trucking)',
    category: 'harvest',
    inputType: 'direct',
    isGroup: false,
    perHa: 60,
    unit: 'ton',
    rate: 350,
    costPerHa: 21000,
    subItems: [
      { id: 'SI-13-1', description: 'Direct 10-Wheeler Freight to Sugar Mill (HPCo)', qty: 60, unit: 'ton', unitCost: 350, subTotal: 21000 }
    ]
  },
  {
    id: 'SRA-14',
    stageNumber: 6,
    stageName: 'Stage 6: Harvesting & Post-Harvest Transport',
    section: 'II. Milling Expenses',
    name: 'Bull Cart (In-field transport)',
    category: 'harvest',
    inputType: 'direct',
    isGroup: false,
    perHa: 60,
    unit: 'ton',
    rate: 150,
    costPerHa: 9000,
    subItems: [
      { id: 'SI-14-1', description: 'Carabao Bull Cart In-Field Haul to Loading Ramp', qty: 60, unit: 'ton', unitCost: 150, subTotal: 9000 }
    ]
  }
];

export let MOCK_FIELDS = [
  // ── Block Farm A: Nacayao Small Farmers Association (15.25 Ha)
  { id: 'FLD-KTR-001', member: 'Juan dela Cruz', ha: '1.50', cycleType: 'Plant Cane (New Plant)', cropYear: 'CY 2025–2026', stage: 'Stage 3: Basal Nutrition & Early Care', month: 2.5, batch: 'Batch 1 (Month 1)', batchMonth: 1, synced: true, lastSync: '15 mins ago', blockFarm: 'Nacayao Block Farm A', variety: 'Phil 2006-2282', customStages: [] },
  { id: 'FLD-KTR-002', member: 'Jose Reyes', ha: '2.50', cycleType: '1st Ratoon (Ratoon 1)', cropYear: 'CY 2025–2026', stage: 'Stage 4: Cultivation & Weed Management', month: 3.5, batch: 'Batch 1 (Month 1)', batchMonth: 1, synced: true, lastSync: '10 mins ago', blockFarm: 'Nacayao Block Farm A', variety: 'VMC 84-524', customStages: [] },
  { id: 'FLD-KTR-003', member: 'Maria Santos', ha: '4.50', cycleType: 'Plant Cane (New Plant)', cropYear: 'CY 2025–2026', stage: 'Stage 1: Pre-Planting & Land Preparation', month: 0.5, batch: 'Batch 1 (Month 1)', batchMonth: 1, synced: true, lastSync: '2 hrs ago', blockFarm: 'Nacayao Block Farm A', variety: 'Phil 2006-2282', customStages: [] },
  { id: 'FLD-KTR-004', member: 'Pedro Reyes', ha: '3.50', cycleType: '2nd Ratoon (Ratoon 2)', cropYear: 'CY 2025–2026', stage: 'Stage 2: Planting & Crop Establishment', month: 1.2, batch: 'Batch 2 (Month 2)', batchMonth: 2, synced: true, lastSync: '4 days ago', blockFarm: 'Nacayao Block Farm A', variety: 'Phil 2006-2282', customStages: [] },
  { id: 'FLD-KTR-005', member: 'Ana Gomez', ha: '3.25', cycleType: 'Plant Cane (New Plant)', cropYear: 'CY 2025–2026', stage: 'Stage 5: Crop Maintenance & Final Hilling-Up', month: 6.0, batch: 'Batch 2 (Month 2)', batchMonth: 2, synced: true, lastSync: '1 hr ago', blockFarm: 'Nacayao Block Farm A', variety: 'VMC 84-524', customStages: [] },

  // ── Block Farm B: Victorias Planters Cluster (28.00 Ha)
  { id: 'FLD-VIC-001', member: 'Emilio Aguinaldo', ha: '7.00', cycleType: 'Plant Cane (New Plant)', cropYear: 'CY 2025–2026', stage: 'Stage 1: Pre-Planting & Land Preparation', month: 0.8, batch: 'Batch 1 (Month 1)', batchMonth: 1, synced: true, lastSync: '2 hrs ago', blockFarm: 'Block Farm B', variety: 'Phil 2006-2282', customStages: [] },
  { id: 'FLD-VIC-002', member: 'Gregorio del Pilar', ha: '8.00', cycleType: 'Plant Cane (New Plant)', cropYear: 'CY 2025–2026', stage: 'Stage 2: Planting & Crop Establishment', month: 1.1, batch: 'Batch 1 (Month 1)', batchMonth: 1, synced: true, lastSync: '3 hrs ago', blockFarm: 'Block Farm B', variety: 'VMC 84-524', customStages: [] },
  { id: 'FLD-VIC-003', member: 'Marcelo H. del Pilar', ha: '6.50', cycleType: '1st Ratoon (Ratoon 1)', cropYear: 'CY 2025–2026', stage: 'Stage 3: Basal Nutrition & Early Care', month: 1.4, batch: 'Batch 2 (Month 2)', batchMonth: 2, synced: true, lastSync: '1 hr ago', blockFarm: 'Block Farm B', variety: 'Phil 2006-2282', customStages: [] },
  { id: 'FLD-VIC-004', member: 'Juan Luna', ha: '6.50', cycleType: 'Plant Cane (New Plant)', cropYear: 'CY 2025–2026', stage: 'Stage 4: Cultivation & Weed Management', month: 2.8, batch: 'Batch 2 (Month 2)', batchMonth: 2, synced: true, lastSync: '30 mins ago', blockFarm: 'Block Farm B', variety: 'VMC 84-524', customStages: [] },

  // ── Block Farm C: Talisay Agrarian Cooperative (45.20 Ha)
  { id: 'FLD-TLS-001', member: 'Andres Bonifacio', ha: '12.00', cycleType: 'Plant Cane (New Plant)', cropYear: 'CY 2025–2026', stage: 'Stage 3: Basal Nutrition & Early Care', month: 1.5, batch: 'Batch 1 (Month 1)', batchMonth: 1, synced: true, lastSync: '4 hrs ago', blockFarm: 'Block Farm C', variety: 'Phil 2006-2282', customStages: [] },
  { id: 'FLD-TLS-002', member: 'Apolinario Mabini', ha: '11.20', cycleType: '1st Ratoon (Ratoon 1)', cropYear: 'CY 2025–2026', stage: 'Stage 4: Cultivation & Weed Management', month: 2.7, batch: 'Batch 1 (Month 1)', batchMonth: 1, synced: true, lastSync: '6 hrs ago', blockFarm: 'Block Farm C', variety: 'VMC 84-524', customStages: [] },
  { id: 'FLD-TLS-003', member: 'Melchora Aquino', ha: '10.00', cycleType: 'Plant Cane (New Plant)', cropYear: 'CY 2025–2026', stage: 'Stage 5: Crop Maintenance & Final Hilling-Up', month: 4.0, batch: 'Batch 2 (Month 2)', batchMonth: 2, synced: true, lastSync: '1 day ago', blockFarm: 'Block Farm C', variety: 'Phil 2006-2282', customStages: [] },
  { id: 'FLD-TLS-004', member: 'Gabriela Silang', ha: '12.00', cycleType: 'Plant Cane (New Plant)', cropYear: 'CY 2025–2026', stage: 'Stage 6: Harvesting & Transport', month: 11.2, batch: 'Batch 2 (Month 2)', batchMonth: 2, synced: true, lastSync: '15 mins ago', blockFarm: 'Block Farm C', variety: 'VMC 84-524', customStages: [] },

  // ── Block Farm D: Manapla Sugarcane Group (22.00 Ha)
  { id: 'FLD-MNP-001', member: 'Diego Silang', ha: '7.50', cycleType: '1st Ratoon (Ratoon 1)', cropYear: 'CY 2025–2026', stage: 'Stage 5: Crop Maintenance & Final Hilling-Up', month: 3.8, batch: 'Batch 1 (Month 1)', batchMonth: 1, synced: true, lastSync: '2 hrs ago', blockFarm: 'Block Farm D', variety: 'Phil 2006-2282', customStages: [] },
  { id: 'FLD-MNP-002', member: 'Teresa Magbanua', ha: '8.50', cycleType: 'Plant Cane (New Plant)', cropYear: 'CY 2025–2026', stage: 'Stage 6: Harvesting & Transport', month: 11.0, batch: 'Batch 1 (Month 1)', batchMonth: 1, synced: true, lastSync: '3 hrs ago', blockFarm: 'Block Farm D', variety: 'VMC 84-524', customStages: [] },
  { id: 'FLD-MNP-003', member: 'Francisco Dagohoy', ha: '6.00', cycleType: 'Plant Cane (New Plant)', cropYear: 'CY 2025–2026', stage: 'Stage 2: Planting & Crop Establishment', month: 1.0, batch: 'Batch 2 (Month 2)', batchMonth: 2, synced: true, lastSync: '5 hrs ago', blockFarm: 'Block Farm D', variety: 'Phil 2006-2282', customStages: [] },
];

export const updateFieldCustomStages = (fieldId, stages) => {
  const field = MOCK_FIELDS.find(f => f.id === fieldId);
  if (field) {
    field.customStages = stages;
    notify();
  }
};

// ── Customizable Operations Management by Field & Growth Stage ──
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
  const field = MOCK_FIELDS.find(f => f.id === fieldId);
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
  const field = MOCK_FIELDS.find(f => f.id === fieldId);
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
  const field = MOCK_FIELDS.find(f => f.id === fieldId);
  if (field) {
    field.customOperations = { ...fullPlanByStage };
    notify();
  }
};

export const MOCK_MANAGERS = [
  { id: '03000001', name: 'Jose Reyes', blockFarm: 'Nacayao Block Farm A' },
  { id: '03000002', name: 'Carlos Dimayuga', blockFarm: 'Block Farm B' },
  { id: '03000003', name: 'Elena Batongbakal', blockFarm: 'Block Farm C' },
  { id: '03000004', name: 'Ramon Magsaysay', blockFarm: 'Block Farm D' },
];

export let MOCK_LOGS = [
  {
    id: 'LOG-2026-KTR-001-001',
    fieldId: 'FLD-KTR-001',
    member: 'Juan dela Cruz',
    stageNumber: 1,
    stageName: 'Stage 1: Pre-Planting & Land Preparation',
    taskId: 'S1',
    sraOperationId: 'SRA-02',
    operationName: 'Land Preparation',
    activity: 'Land Preparation (Disc Plowing & Furrowing)',
    date: '2026-05-02',
    hectares: 1.50,
    loggedBy: 'Farmer (Juan dela Cruz)',
    approved: true,
    status: 'Recorded',
    subItems: [
      { id: 'SI-LOG-KTR001-001-1', description: '1st Pass Disc Plowing (Tractor)', qty: 1.5, unit: 'ha', unitCost: 5000, subTotal: 7500 },
      { id: 'SI-LOG-KTR001-001-2', description: '2nd Pass Disc Harrowing', qty: 1.5, unit: 'ha', unitCost: 4000, subTotal: 6000 },
      { id: 'SI-LOG-KTR001-001-3', description: 'Furrowing / Tudling', qty: 1.5, unit: 'ha', unitCost: 3000, subTotal: 4500 }
    ],
    totalCost: 18000,
    cost: 18000,
    costPerHa: 12000,
  },
  {
    id: 'LOG-2026-KTR-001-002',
    fieldId: 'FLD-KTR-001',
    member: 'Juan dela Cruz',
    stageNumber: 3,
    stageName: 'Stage 3: Basal Nutrition & Early Care',
    taskId: 'S3',
    sraOperationId: 'SRA-05',
    operationName: 'Basal Fertilization',
    activity: 'Basal Fertilization (46-00-00 + 18-46-00 + 00-00-60)',
    date: '2026-05-10',
    hectares: 1.50,
    loggedBy: 'Farmer (Juan dela Cruz)',
    approved: true,
    status: 'Recorded',
    subItems: [
      { id: 'SI-LOG-KTR001-002-1', description: 'Application of 46-00-00 (Urea)', qty: 3, unit: 'bag', unitCost: 1600, subTotal: 4800 },
      { id: 'SI-LOG-KTR001-002-2', description: 'Application of 18-46-00 (DAP / Complete)', qty: 4.5, unit: 'bag', unitCost: 2500, subTotal: 11250 },
      { id: 'SI-LOG-KTR001-002-3', description: 'Application of 00-00-60 (MOP / Potash)', qty: 3, unit: 'bag', unitCost: 2200, subTotal: 6600 },
      { id: 'SI-LOG-KTR001-002-4', description: 'Fertilizer Application Labor', qty: 10.5, unit: 'bag', unitCost: 100, subTotal: 1050 }
    ],
    totalCost: 23700,
    cost: 23700,
    costPerHa: 15800,
  },
  {
    id: 'LOG-2026-KTR-001-003',
    fieldId: 'FLD-KTR-001',
    member: 'Juan dela Cruz',
    stageNumber: 4,
    stageName: 'Stage 4: Cultivation & Weed Management',
    taskId: 'S4',
    sraOperationId: 'SRA-07',
    operationName: 'Cultivation (Off-barring & On-barring)',
    activity: 'Cultivation (Ridge Busting & 1st Off-barring)',
    date: '2026-05-18',
    hectares: 1.50,
    loggedBy: 'Farmer (Juan dela Cruz)',
    approved: true,
    status: 'Recorded',
    subItems: [
      { id: 'SI-LOG-KTR001-003-1', description: 'Ridge Busting', qty: 1.5, unit: 'pass', unitCost: 300, subTotal: 450 },
      { id: 'SI-LOG-KTR001-003-2', description: '1st Off-barring (Pahubas)', qty: 3.0, unit: 'pass', unitCost: 300, subTotal: 900 }
    ],
    totalCost: 1350,
    cost: 1350,
    costPerHa: 900,
  },
  {
    id: 'LOG-2026-KTR-002-001',
    fieldId: 'FLD-KTR-002',
    member: 'Jose Reyes',
    stageNumber: 2,
    stageName: 'Stage 2: Planting & Crop Establishment',
    taskId: 'S2',
    sraOperationId: 'SRA-03',
    operationName: 'Cost of Planting Material (Seedcane acquisition)',
    activity: 'Cost of Planting Material (Patdan)',
    date: '2026-05-08',
    hectares: 2.50,
    loggedBy: 'Manager (Jose Reyes - Takeover)',
    approved: true,
    status: 'Recorded',
    subItems: [
      { id: 'SI-LOG-KTR002-001-1', description: 'Cane Points (Patdan - VMC 84-524)', qty: 12.5, unit: 'lac', unitCost: 3000, subTotal: 37500 }
    ],
    totalCost: 37500,
    cost: 37500,
    costPerHa: 15000,
  },
  {
    id: 'LOG-2026-KTR-004-001',
    fieldId: 'FLD-KTR-004',
    member: 'Pedro Reyes',
    stageNumber: 1,
    stageName: 'Stage 1: Pre-Planting & Land Preparation',
    taskId: 'S1',
    sraOperationId: 'SRA-02',
    operationName: 'Land Preparation',
    activity: 'Land Preparation (Disc Plowing & Furrowing)',
    date: '2026-05-15',
    hectares: 3.50,
    loggedBy: 'Farmer (Pedro Reyes)',
    approved: true,
    status: 'Recorded',
    subItems: [
      { id: 'SI-LOG-KTR004-001-1', description: '1st Pass Disc Plowing (Tractor)', qty: 3.5, unit: 'ha', unitCost: 5000, subTotal: 17500 },
      { id: 'SI-LOG-KTR004-001-2', description: '2nd Pass Disc Harrowing', qty: 3.5, unit: 'ha', unitCost: 4000, subTotal: 14000 },
      { id: 'SI-LOG-KTR004-001-3', description: 'Furrowing / Tudling', qty: 3.5, unit: 'ha', unitCost: 3000, subTotal: 10500 }
    ],
    totalCost: 42000,
    cost: 42000,
    costPerHa: 12000,
  },
  {
    id: 'LOG-2026-VIC-001-001',
    fieldId: 'FLD-VIC-001',
    member: 'Emilio Aguinaldo',
    stageNumber: 1,
    stageName: 'Stage 1: Pre-Planting & Land Preparation',
    taskId: 'S1',
    sraOperationId: 'SRA-02',
    operationName: 'Mechanical Land Prep',
    activity: 'Tractor Disc Plowing (2 passes)',
    date: '2026-05-12',
    hectares: 7.00,
    loggedBy: 'Farmer (Emilio Aguinaldo)',
    approved: true,
    status: 'Recorded',
    subItems: [
      { id: 'SI-LOG-VIC001-001-1', description: 'Disc Plowing 2 passes', qty: 7.0, unit: 'ha', unitCost: 6500, subTotal: 45500 }
    ],
    totalCost: 45500,
    cost: 45500,
    costPerHa: 6500,
  },
  {
    id: 'LOG-2026-TLS-001-001',
    fieldId: 'FLD-TLS-001',
    member: 'Andres Bonifacio',
    stageNumber: 3,
    stageName: 'Stage 3: Basal Nutrition & Early Care',
    taskId: 'S3',
    sraOperationId: 'SRA-05',
    operationName: 'Basal Fertilizer Application',
    activity: 'Urea & DAP Basal Spread',
    date: '2026-05-14',
    hectares: 12.00,
    loggedBy: 'Farmer (Andres Bonifacio)',
    approved: true,
    status: 'Recorded',
    subItems: [
      { id: 'SI-LOG-TLS001-001-1', description: 'Urea 46-0-0', qty: 24, unit: 'bag', unitCost: 1650, subTotal: 39600 },
      { id: 'SI-LOG-TLS001-001-2', description: 'DAP 18-46-0', qty: 36, unit: 'bag', unitCost: 2400, subTotal: 86400 }
    ],
    totalCost: 126000,
    cost: 126000,
    costPerHa: 10500,
  },
  {
    id: 'LOG-2026-MNP-001-001',
    fieldId: 'FLD-MNP-001',
    member: 'Diego Silang',
    stageNumber: 5,
    stageName: 'Stage 5: Crop Maintenance & Final Hilling-Up',
    taskId: 'S5',
    sraOperationId: 'SRA-11',
    operationName: 'Final Hilling-up (Pasungkal)',
    activity: 'Tractor Hilling-up & Canal Maintenance',
    date: '2026-05-16',
    hectares: 7.50,
    loggedBy: 'Farmer (Diego Silang)',
    approved: true,
    status: 'Recorded',
    subItems: [
      { id: 'SI-LOG-MNP001-001-1', description: 'Pasungkal Tractor Passes', qty: 7.5, unit: 'ha', unitCost: 3200, subTotal: 24000 }
    ],
    totalCost: 24000,
    cost: 24000,
    costPerHa: 3200,
  }
];

export let DRAFT_LOGS = [
  {
    id: 'DFT-2026-KTR-001-001',
    fieldId: 'FLD-KTR-001',
    member: 'Juan dela Cruz',
    sraOperationId: 'SRA-09',
    operationName: 'Weeding & Crop Care',
    activity: '1st Weeding & Canal Clearing',
    date: '2026-05-21',
    hectares: 1.50,
    subItems: [
      { id: 'SI-DFT-KTR001-001-1', description: '1st Weeding (Manual crew)', qty: 1.5, unit: 'ha', unitCost: 2500, subTotal: 3750 }
    ],
    totalCost: 3750,
    cost: 3750,
    costPerHa: 2500,
  }
];

export let MOCK_ASSIGNMENT_REQUESTS = [];

export const SRA_PRICE_HISTORY = [
  { week: 'Week 1', month: 'Mar', price: 2450 },
  { week: 'Week 2', month: 'Mar', price: 2500 },
  { week: 'Week 3', month: 'Mar', price: 2480 },
  { week: 'Week 4', month: 'Mar', price: 2550 },
  { week: 'Week 1', month: 'Apr', price: 2600 },
  { week: 'Week 2', month: 'Apr', price: 2580 },
  { week: 'Week 3', month: 'Apr', price: 2650 },
  { week: 'Week 4', month: 'Apr', price: 2700 },
  { week: 'Week 1', month: 'May', price: 2750 },
  { week: 'Week 2', month: 'May', price: 2800 },
  { week: 'Week 3', month: 'May', price: 2880 },
  { week: 'Week 4', month: 'May', price: 2950 },
];

const WEEK_LABELS = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const addSRAPrice = async (price) => {
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
  const dateStr = new Date().toISOString().split('T')[0];
  const priceRecord = {
    id: `PRC-${new Date().getFullYear()}-${nextWeek.replace(/\s+/g, '')}-${nextMonth.toUpperCase()}`,
    week: `${nextWeek} ${nextMonth}`,
    month: nextMonth,
    price,
    date: dateStr,
    createdAt: new Date().toISOString()
  };
  SRA_PRICE_HISTORY.push(priceRecord);
  MOCK_PRICE.value = price;
  MOCK_PRICE.lastUpdated = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (db) {
    try {
      await setDoc(doc(db, 'sra_prices', priceRecord.id), priceRecord, { merge: true });
    } catch (e) {
      console.warn('[dataStore] Failed to write price to Firestore:', e);
    }
  }

  notify();
};

export let MOCK_TICKETS = [
  {
    id: 'TCK-2026-00801',
    title: 'Offline Log Sync Failure after 3 days offline',
    author: 'Juan dela Cruz (Member)',
    blockFarm: 'Nacayao Block Farm A',
    category: 'Offline Sync',
    priority: 'High',
    status: 'Open',
    date: '2026-05-23',
    details: 'Completed 3 manual weeding and fertilization logs while in northern field without 4G. Logs remain in device queue after Wi-Fi reconnection.',
    resolutionNotes: ''
  },
  {
    id: 'TCK-2026-00802',
    title: 'Plot Boundary Hectarage Discrepancy',
    author: 'Jose Reyes (Farm Manager)',
    blockFarm: 'Nacayao Block Farm A',
    category: 'Field Boundary',
    priority: 'Medium',
    status: 'In Progress',
    date: '2026-05-22',
    details: 'FLD-KTR-002 surveyed area is 2.5 Ha but satellite map boundary shows overlap with adjacent plot.',
    resolutionNotes: 'Re-survey coordinates dispatched to Silay surveyor.'
  }
];

export const submitSupportTicket = async (ticket) => {
  const newId = generateTicketId(800 + MOCK_TICKETS.length + 1);
  const newTicket = {
    id: newId,
    title: ticket.title,
    author: ticket.author || `${CURRENT_SESSION.name} (${CURRENT_SESSION.role})`,
    blockFarm: CURRENT_SESSION.farm || 'Nacayao Block Farm A',
    category: ticket.category || 'General Support',
    priority: ticket.priority || 'Normal',
    status: 'Open',
    date: new Date().toISOString().split('T')[0],
    details: ticket.details,
    resolutionNotes: '',
    createdAt: new Date().toISOString()
  };
  MOCK_TICKETS.unshift(newTicket);

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

    // 3. Live Operation Logs Listener (Bidirectional Sync)
    const unsubLogs = onSnapshot(collection(db, 'operation_logs'), (snapshot) => {
      if (snapshot.empty) return;
      const remoteLogs = [];
      snapshot.forEach(docSnap => remoteLogs.push({ id: docSnap.id, ...docSnap.data() }));

      let logsUpdated = false;
      remoteLogs.forEach(rl => {
        const idx = MOCK_LOGS.findIndex(ll => ll.id === rl.id);
        if (idx >= 0) {
          MOCK_LOGS[idx] = { ...MOCK_LOGS[idx], ...rl };
          logsUpdated = true;
        } else {
          MOCK_LOGS.unshift(rl);
          logsUpdated = true;
        }
      });
      if (logsUpdated) {
        saveItem(STORAGE_KEYS.LOGS, MOCK_LOGS);
        notify();
      }
    }, (err) => console.warn('[Mobile] Operation logs listener notice:', err));

    // 4. Live Support Tickets Listener
    const unsubTickets = onSnapshot(collection(db, 'support_tickets'), (snapshot) => {
      if (snapshot.empty) return;
      const remoteTickets = [];
      snapshot.forEach(docSnap => remoteTickets.push({ id: docSnap.id, ...docSnap.data() }));

      let ticketsUpdated = false;
      remoteTickets.forEach(rt => {
        const idx = MOCK_TICKETS.findIndex(lt => lt.id === rt.id);
        if (idx >= 0) {
          MOCK_TICKETS[idx] = { ...MOCK_TICKETS[idx], ...rt };
          ticketsUpdated = true;
        } else {
          MOCK_TICKETS.unshift(rt);
          ticketsUpdated = true;
        }
      });
      if (ticketsUpdated) {
        saveItem(STORAGE_KEYS.TICKETS, MOCK_TICKETS);
        notify();
      }
    }, (err) => console.warn('[Mobile] Support tickets listener notice:', err));

    return () => {
      unsubPrices();
      unsubFields();
      unsubLogs();
      unsubTickets();
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
  
  // Process outbox queue and flush directly to Cloud Firestore
  await flushOutboxToFirestore();

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
    
    // Check outbox count to update pending logs indicator
    const outboxCount = getOutboxCount();
    if (outboxCount > 0) {
      IS_SYNCED = false;
      CURRENT_SESSION.pendingLogs = outboxCount;
    }

    notify();

    // Start real-time Firestore listeners
    try {
      listenToCloudSync();
    } catch (cloudErr) {
      console.warn('[dataStore] Cloud sync listener deferred:', cloudErr);
    }
  } catch (error) {
    console.warn('[dataStore] Startup hydration failed, using memory seeds:', error);
  }
};

// Auto-invoke hydration on bundle load
initializeOfflineStorage();

export const MOCK_AUDIT_HISTORY = [
  {
    id: 'AUD-2026-05-NCY',
    month: 'May 2026',
    dateGenerated: 'May 21, 2026 · 6:30 PM',
    status: 'Verified SRA Compliance',
    blockFarm: 'Nacayao Block Farm A',
    totalCost: 141100,
    fieldsReported: 5,
    logsCount: 11,
    verifiedBy: 'SRA Inspector Maria Santos',
    qrSignature: 'HUGPONG-SRA-AUDIT-2026-05-MAY-NCY-8849',
    stageBreakdown: [
      { stageNum: 1, name: 'Stage 1: Land Prep & Soil Sampling', cost: 24000, logs: 2 },
      { stageNum: 2, name: 'Stage 2: Planting & Crop Establishment', cost: 35000, logs: 3 },
      { stageNum: 3, name: 'Stage 3: Basal Nutrition & Early Care', cost: 41600, logs: 3 },
      { stageNum: 4, name: 'Stage 4: Cultivation & Weed Management', cost: 18000, logs: 1 },
      { stageNum: 5, name: 'Stage 5: Maintenance & Hilling-Up', cost: 10000, logs: 1 },
      { stageNum: 6, name: 'Stage 6: Harvesting & Mill Transport', cost: 12500, logs: 1 }
    ]
  },
  {
    id: 'AUD-2026-04-NCY',
    month: 'April 2026',
    dateGenerated: 'Apr 28, 2026 · 5:15 PM',
    status: 'Verified SRA Compliance',
    blockFarm: 'Nacayao Block Farm A',
    totalCost: 215400,
    fieldsReported: 5,
    logsCount: 18,
    verifiedBy: 'SRA Inspector Maria Santos',
    qrSignature: 'HUGPONG-SRA-AUDIT-2026-04-APR-NCY-7731',
    stageBreakdown: [
      { stageNum: 1, name: 'Stage 1: Land Prep & Soil Sampling', cost: 48000, logs: 4 },
      { stageNum: 2, name: 'Stage 2: Planting & Crop Establishment', cost: 62000, logs: 5 },
      { stageNum: 3, name: 'Stage 3: Basal Nutrition & Early Care', cost: 58000, logs: 4 },
      { stageNum: 4, name: 'Stage 4: Cultivation & Weed Management', cost: 27400, logs: 3 },
      { stageNum: 5, name: 'Stage 5: Maintenance & Hilling-Up', cost: 20000, logs: 2 }
    ]
  },
  {
    id: 'AUD-2026-03-NCY',
    month: 'March 2026',
    dateGenerated: 'Mar 30, 2026 · 4:45 PM',
    status: 'Verified SRA Compliance',
    blockFarm: 'Nacayao Block Farm A',
    totalCost: 178200,
    fieldsReported: 4,
    logsCount: 14,
    verifiedBy: 'SRA Inspector Maria Santos',
    qrSignature: 'HUGPONG-SRA-AUDIT-2026-03-MAR-NCY-6520',
    stageBreakdown: [
      { stageNum: 1, name: 'Stage 1: Land Prep & Soil Sampling', cost: 52000, logs: 5 },
      { stageNum: 2, name: 'Stage 2: Planting & Crop Establishment', cost: 71000, logs: 5 },
      { stageNum: 3, name: 'Stage 3: Basal Nutrition & Early Care', cost: 55200, logs: 4 }
    ]
  },
  {
    id: 'AUD-2026-02-NCY',
    month: 'February 2026',
    dateGenerated: 'Feb 26, 2026 · 3:20 PM',
    status: 'Verified SRA Compliance',
    blockFarm: 'Nacayao Block Farm A',
    totalCost: 152000,
    fieldsReported: 4,
    logsCount: 12,
    verifiedBy: 'SRA Inspector Maria Santos',
    qrSignature: 'HUGPONG-SRA-AUDIT-2026-02-FEB-NCY-5419',
    stageBreakdown: [
      { stageNum: 1, name: 'Stage 1: Land Prep & Soil Sampling', cost: 68000, logs: 6 },
      { stageNum: 2, name: 'Stage 2: Planting & Crop Establishment', cost: 84000, logs: 6 }
    ]
  }
];
