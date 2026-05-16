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

export const MOCK_PROFILE = {
  name: 'Gabe',
  role: 'Lead Cabo',
  farm: 'Silay Block Farm – Sector B',
  pendingLogs: 5,
  syncedLogs: 142,
};

export const MOCK_AUDIT_LOGS = [
  { time: '12:12 AM', msg: 'Local Activity Logged: Plot A11' },
  { time: '12:45 AM', msg: 'Price Cache Updated via Broadcast' },
  { time: '11:30 PM', msg: 'Task Completed: Fertilization Plot 4' },
];
