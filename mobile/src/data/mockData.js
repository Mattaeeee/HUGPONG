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
    [2350, 2400, 2450, 2620, 2800, 2810],
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
  'SRA Checker': {
    name: 'Maria Santos',
    role: 'SRA Checker',
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

