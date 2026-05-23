// Mock local data store (replace with SQLite / AsyncStorage later)

export const MOCK_PRICE = {
  value: 2800,
  change: 50.08,
  unit: 'Lkg',
  mill: 'HPCo',
  location: 'Silay',
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

export const MOCK_TASKS = [
  {
    id: '1',
    sector: 'Sector B',
    plot: 'Plot 4',
    name: 'Fertilization – "Abono"',
    status: 'pending',
    time: '7:00 AM',
    cabo: 'Gabe',
    target: '12 Bags Urea / 2.0 Ha',
    icon: 'leaf',
    date: new Date(),
  },
  {
    id: '2',
    sector: 'Sector A',
    plot: 'Plot 7',
    name: 'Weeding – "Hilamon"',
    status: 'in-progress',
    time: '9:30 AM',
    cabo: 'Jun',
    target: '2.5 Ha',
    icon: 'flower',
    date: new Date(),
  },
  {
    id: '3',
    sector: 'Sector C',
    plot: 'Plot 2',
    name: 'Harvesting – "Pitas"',
    status: 'pending',
    time: '1:00 PM',
    cabo: 'Mark',
    target: '1.8 Ha',
    icon: 'basket',
    date: new Date(),
  },
  {
    id: '4',
    sector: 'Sector B',
    plot: 'Plot 1',
    name: 'Spraying – "Pang-abono"',
    status: 'pending',
    time: '3:30 PM',
    cabo: 'Ed',
    target: '15 L Solution / 2.0 Ha',
    icon: 'water',
    date: new Date(),
  },
];

export const DEMO_ACCOUNTS = {
  'Member': {
    name: 'Juan dela Cruz',
    role: 'Member',
    employeeId: 'MBR-2026-004',
    fieldId: 'FLD-KTR-001',
    farm: 'Silay Block Farm',
    mobile: '0917 123 4567',
    pendingLogs: 0,
    syncedLogs: 24,
  },
  'Farm Manager': {
    name: 'Jose Reyes',
    role: 'Farm Manager',
    employeeId: 'MGR-2026-001',
    fieldId: 'FLD-KTR-001',
    farm: 'Silay Block Farm',
    mobile: '0918 987 6543',
    pendingLogs: 0,
    syncedLogs: 142,
  },
  'SRA (Admin)': {
    name: 'Maria Santos',
    role: 'SRA (Admin)',
    employeeId: 'SRA-2026-088',
    fieldId: 'FLD-KTR-003',
    farm: 'SRA Sugar District VII',
    mobile: '0919 444 8888',
    pendingLogs: 0,
    syncedLogs: 512,
  },
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

const notify = () => {
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

export const setSynced = (synced) => {
  IS_SYNCED = synced;
  if (!synced) {
    CURRENT_SESSION.pendingLogs = CURRENT_SESSION.pendingLogs + 1;
  } else {
    CURRENT_SESSION.syncedLogs = CURRENT_SESSION.syncedLogs + CURRENT_SESSION.pendingLogs;
    CURRENT_SESSION.pendingLogs = 0;
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
}; // backward compatibility

export const MOCK_FIELDS = [
  { id: 'FLD-KTR-001', member: 'Juan dela Cruz', ha: '1.5', stage: 'Fertilization Stage 2', month: 3.2, synced: true, lastSync: '10 mins ago', blockFarm: 'Silay Block Farm A' },
  { id: 'FLD-KTR-003', member: 'Maria Santos', ha: '2.0', stage: 'Land Preparation', month: 0.3, synced: true, lastSync: '2 hrs ago', blockFarm: 'Silay Block Farm A' },
  { id: 'FLD-KTR-007', member: 'Pedro Reyes', ha: '1.0', stage: 'Harvesting', month: 10.5, synced: false, lastSync: '4 days ago', blockFarm: 'Silay Block Farm B' },
  { id: 'FLD-KTR-009', member: 'Ana Gomez', ha: '0.8', stage: 'Weeding', month: 5.1, synced: true, lastSync: '1 hr ago', blockFarm: 'Silay Block Farm C' },
];

export const MOCK_MANAGERS = [
  { id: 'M1', name: 'Carlos Dimayuga', blockFarm: 'Silay Block Farm A' },
  { id: 'M2', name: 'Elena Batongbakal', blockFarm: 'Silay Block Farm B' },
  { id: 'M3', name: 'Ricardo Dalisay', blockFarm: 'Silay Block Farm C' },
];

export let MOCK_LOGS = [
  { id: 'L1', fieldId: 'FLD-KTR-001', type: 'weekly', week: 'Week 1 – May', activity: 'Weeding labor', cost: 1200, date: 'May 7, 2026', approved: true },
  { id: 'L2', fieldId: 'FLD-KTR-001', type: 'monthly', month: 'May 2026', activity: 'Urea fertilizer (4 bags)', cost: 6400, date: 'May 1, 2026', approved: false },
  { id: 'L3', fieldId: 'FLD-KTR-003', type: 'weekly', week: 'Week 2 – May', activity: 'Land plowing (tractor)', cost: 5000, date: 'May 14, 2026', approved: true },
  { id: 'L4', fieldId: 'FLD-KTR-007', type: 'weekly', week: 'Week 3 – May', activity: 'Cane harvesting', cost: 8500, date: 'May 18, 2026', approved: true },
  { id: 'L5', fieldId: 'FLD-KTR-007', type: 'monthly', month: 'May 2026', activity: 'Trucking & hauling', cost: 4200, date: 'May 19, 2026', approved: false },
];

export let DRAFT_LOGS = [
  { id: 'D1', fieldId: 'FLD-KTR-007', type: 'weekly', activity: 'Post-harvest clearing', cost: 1500, hours: '6', hectares: '1.0', people: '3', date: 'May 21, 2026' }
];

export let MOCK_ASSIGNMENT_REQUESTS = [];

export const requestFieldAssignment = (fieldId, memberName, ha = '0.0') => {
  MOCK_ASSIGNMENT_REQUESTS.push({
    id: `REQ-${Date.now()}`,
    fieldId,
    memberName,
    ha,
    date: new Date().toLocaleDateString('en-US'),
    status: 'pending'
  });
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
  // Also update the MOCK_PRICE current value
  MOCK_PRICE.value = price;
  MOCK_PRICE.lastUpdated = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  notify();
};
