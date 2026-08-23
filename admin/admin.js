// ── INITIAL STATE CONFIGURATION ──────────────────────────
const INITIAL_DATABASE = {
  fields: [
    { id: 'FLD-KTR-001', member: 'Mario Dimagiba', ha: 1.5, stage: 'Fertilization Stage 2', age: '3.2 months', synced: true, lastSync: '15 mins ago', syncLagDays: 0, blockFarm: 'Block Farm A', customStages: [] },
    { id: 'FLD-KTR-002', member: 'Jose Rizal', ha: 2.1, stage: 'Planting', age: '1.2 months', synced: true, lastSync: '4 days ago', syncLagDays: 4, blockFarm: 'Block Farm A', customStages: [] },
    { id: 'FLD-KTR-005', member: 'Roberto Tan', ha: 1.8, stage: 'Planting (Patdan)', age: '2.0 months', synced: false, lastSync: '8 days ago', syncLagDays: 8, blockFarm: 'Block Farm A', customStages: [] },
    { id: 'FLD-KTR-006', member: 'Antonio Luna', ha: 1.2, stage: 'Weeding (Hilamon)', age: '1.5 months', synced: true, lastSync: '2 hrs ago', syncLagDays: 0, blockFarm: 'Block Farm A', customStages: [] },
    { id: 'FLD-KTR-003', member: 'Maria Santos', ha: 2.0, stage: 'Land Preparation', age: '0.3 months', synced: true, lastSync: '2 hrs ago', syncLagDays: 0, blockFarm: 'Block Farm B', customStages: [] },
    { id: 'FLD-KTR-004', member: 'Emilio Aguinaldo', ha: 1.8, stage: 'Weeding', age: '4.1 months', synced: true, lastSync: '3 hrs ago', syncLagDays: 0, blockFarm: 'Block Farm B', customStages: [] },
    { id: 'FLD-KTR-007', member: 'Pedro Reyes', ha: 1.0, stage: 'Harvesting', age: '10.5 months', synced: false, lastSync: '4 days ago', syncLagDays: 4, blockFarm: 'Block Farm C', customStages: [] },
    { id: 'FLD-KTR-008', member: 'Andres Bonifacio', ha: 3.0, stage: 'Harvesting', age: '11.0 months', synced: true, lastSync: '5 hrs ago', syncLagDays: 0, blockFarm: 'Block Farm C', customStages: [] },
    { id: 'FLD-KTR-009', member: 'Ana Gomez', ha: 0.8, stage: 'Weeding', age: '5.1 months', synced: true, lastSync: '1 hr ago', syncLagDays: 0, blockFarm: 'Block Farm D', customStages: [] },
    { id: 'FLD-KTR-010', member: 'Apolinario Mabini', ha: 1.2, stage: 'Fertilization Stage 1', age: '2.5 months', synced: true, lastSync: '6 hrs ago', syncLagDays: 0, blockFarm: 'Block Farm D', customStages: [] }
  ],
  logs: [
    // Standard schedules logs
    { id: 'L1', fieldId: 'FLD-KTR-001', category: 'weed', schedule: 'Weekly', type: 'weekly', task: 'Weeding labor', activity: 'Weeding labor', cost: 1200, date: '2026-05-07', status: 'Approved', approved: true },
    { id: 'L2', fieldId: 'FLD-KTR-001', category: 'fert', schedule: 'Monthly', type: 'monthly', task: 'Urea fertilizer (4 bags)', activity: 'Urea fertilizer (4 bags)', cost: 6400, date: '2026-05-01', status: 'Approved', approved: true },
    { id: 'L3', fieldId: 'FLD-KTR-003', category: 'prep', schedule: 'Weekly', type: 'weekly', task: 'Land plowing (tractor)', activity: 'Land plowing (tractor)', cost: 5000, date: '2026-05-14', status: 'Approved', approved: true },
    { id: 'L4', fieldId: 'FLD-KTR-002', category: 'plant', schedule: 'Weekly', type: 'weekly', task: 'Planting labor crew', activity: 'Planting labor crew', cost: 3500, date: '2026-05-15', status: 'Approved', approved: true },
    { id: 'L5', fieldId: 'FLD-KTR-004', category: 'weed', schedule: 'Monthly', type: 'monthly', task: 'Herbicide spray', activity: 'Herbicide spray', cost: 1800, date: '2026-05-18', status: 'Approved', approved: true },
    
    // QR compilation logs for HUG-202605-A3F9 (compiled on May 5, total approved cost = Php 19,350)
    { id: 'AUD-001', fieldId: 'FLD-KTR-001', category: 'fert', schedule: 'Monthly', type: 'monthly', task: 'Fertilizer application (2 bags Urea)', activity: 'Fertilizer application (2 bags Urea)', cost: 3200, date: '2026-04-28', status: 'Approved', approved: true },
    { id: 'AUD-002', fieldId: 'FLD-KTR-001', category: 'weed', schedule: 'Weekly', type: 'weekly', task: 'Weeding labor', activity: 'Weeding labor', cost: 1200, date: '2026-05-02', status: 'Approved', approved: true },
    { id: 'AUD-003', fieldId: 'FLD-KTR-003', category: 'prep', schedule: 'Weekly', type: 'weekly', task: 'Land plowing (tractor)', activity: 'Land plowing (tractor)', cost: 5000, date: '2026-04-25', status: 'Approved', approved: true },
    { id: 'AUD-004', fieldId: 'FLD-KTR-003', category: 'plant', schedule: 'Monthly', type: 'monthly', task: 'Planting labor crew', activity: 'Planting labor crew', cost: 2500, date: '2026-04-27', status: 'Approved', approved: true },
    { id: 'AUD-005', fieldId: 'FLD-KTR-007', category: 'harvest', schedule: 'Weekly', type: 'weekly', task: 'Harvesting labor', activity: 'Harvesting labor', cost: 4000, date: '2026-04-30', status: 'Approved', approved: true },
    { id: 'AUD-006', fieldId: 'FLD-KTR-009', category: 'prep', schedule: 'Weekly', type: 'weekly', task: 'Land clearing', activity: 'Land clearing', cost: 1500, date: '2026-04-24', status: 'Approved', approved: true },
    { id: 'AUD-007', fieldId: 'FLD-KTR-009', category: 'prep', schedule: 'Monthly', type: 'monthly', task: 'Furrowing (tractor)', activity: 'Furrowing (tractor)', cost: 1200, date: '2026-04-26', status: 'Approved', approved: true },
    { id: 'AUD-008', fieldId: 'FLD-KTR-009', category: 'weed', schedule: 'Weekly', type: 'weekly', task: 'Weeding', activity: 'Weeding', cost: 750, date: '2026-05-03', status: 'Approved', approved: true },
    { id: 'AUD-009', fieldId: 'FLD-KTR-007', category: 'weed', schedule: 'Weekly', type: 'weekly', task: 'Chemical spray', activity: 'Chemical spray', cost: 800, date: '2026-05-04', status: 'Approved', approved: true },
    { id: 'AUD-010', fieldId: 'FLD-KTR-001', category: 'harvest', schedule: 'Weekly', type: 'weekly', task: 'Excess hauling charge', activity: 'Excess hauling charge', cost: 1500, date: '2026-05-05', status: 'Approved', approved: true },
    { id: 'L6', fieldId: 'FLD-KTR-008', category: 'harvest', schedule: 'Weekly', type: 'weekly', task: 'Harvesting transport', activity: 'Harvesting transport', cost: 6000, date: '2026-05-20', status: 'Approved', approved: true },
    { id: 'L7', fieldId: 'FLD-KTR-010', category: 'fert', schedule: 'Monthly', type: 'monthly', task: '18-46 Fertilizer application', activity: '18-46 Fertilizer application', cost: 4200, date: '2026-05-22', status: 'Approved', approved: true }
  ],
  priceHistory: [
    { week: 'Week 4 May', price: 2800, date: '2026-05-21', change: 0, source: 'SRA Circular #104' },
    { week: 'Week 3 May', price: 2800, date: '2026-05-14', change: 50, source: 'SRA Circular #102' },
    { week: 'Week 2 May', price: 2750, date: '2026-05-07', change: 30, source: 'SRA Circular #101' },
    { week: 'Week 1 May', price: 2720, date: '2026-04-30', change: 20, source: 'SRA Circular #100' },
    { week: 'Week 4 Apr', price: 2700, date: '2026-04-23', change: 50, source: 'SRA Circular #99' },
    { week: 'Week 3 Apr', price: 2650, date: '2026-04-16', change: -20, source: 'SRA Circular #98' },
    { week: 'Week 2 Apr', price: 2670, date: '2026-04-09', change: 70, source: 'SRA Circular #97' },
    { week: 'Week 1 Apr', price: 2600, date: '2026-04-02', change: 50, source: 'SRA Circular #96' },
    { week: 'Week 4 Mar', price: 2550, date: '2026-03-26', change: 70, source: 'SRA Circular #95' },
    { week: 'Week 3 Mar', price: 2480, date: '2026-03-19', change: -20, source: 'SRA Circular #94' },
    { week: 'Week 2 Mar', price: 2500, date: '2026-03-12', change: 50, source: 'SRA Circular #93' },
    { week: 'Week 1 Mar', price: 2450, date: '2026-03-05', change: 0, source: 'SRA Circular #92' }
  ],
  users: [
    { contact: '09171234567', name: 'Juan dela Cruz', role: 'SRA (Admin)', blockFarm: 'District VII (SRA Regulatory)', logsHandled: 42, regDate: '2026-02-01' },
    { contact: '09176543210', name: 'Mario Dimagiba', role: 'Member', blockFarm: 'Block Farm A', fieldId: 'FLD-KTR-001', logsHandled: 8, regDate: '2026-03-10' },
    { contact: '09179876543', name: 'Jose Rizal', role: 'Member', blockFarm: 'Block Farm A', fieldId: 'FLD-KTR-002', logsHandled: 6, regDate: '2026-03-12' },
    { contact: '09175550101', name: 'Roberto Tan', role: 'Member', blockFarm: 'Block Farm A', fieldId: 'FLD-KTR-005', logsHandled: 2, regDate: '2026-03-20' },
    { contact: '09172223344', name: 'Antonio Luna', role: 'Member', blockFarm: 'Block Farm A', fieldId: 'FLD-KTR-006', logsHandled: 5, regDate: '2026-03-22' },
    { contact: '09187654321', name: 'Engr. Mateo Alcantara', role: 'Super Admin', blockFarm: 'All Block Farms', logsHandled: 12, regDate: '2026-02-15' },
    { contact: '09189876543', name: 'Jose Reyes', role: 'Farm Manager', blockFarm: 'Block Farm A', logsHandled: 24, regDate: '2026-03-01' },
    { contact: '09123456789', name: 'Maria Santos', role: 'Farm Manager', blockFarm: 'Block Farm B', logsHandled: 18, regDate: '2026-03-01' },
    { contact: '09171112233', name: 'Elena Batongbakal', role: 'Farm Manager', blockFarm: 'Block Farm C', logsHandled: 14, regDate: '2026-03-05' },
    { contact: '09174445566', name: 'Ricardo Dalisay', role: 'Farm Manager', blockFarm: 'Block Farm D', logsHandled: 9, regDate: '2026-03-12' },
    { contact: '09987654321', name: 'Pedro Reyes', role: 'Member', blockFarm: 'Block Farm C', fieldId: 'FLD-KTR-007', logsHandled: 6, regDate: '2026-03-15' },
    { contact: '09555444333', name: 'Ana Gomez', role: 'Member', blockFarm: 'Block Farm D', fieldId: 'FLD-KTR-009', logsHandled: 4, regDate: '2026-04-01' }
  ],
  pendingUsers: [
    { contact: '0917-111-2233', name: 'Danilo Cruz', role: 'Member', blockFarm: 'Block Farm A', fieldId: 'FLD-KTR-007', area: '1.5 Ha', regDate: '2026-05-20' },
    { contact: '0918-222-3344', name: 'Elena Ramos', role: 'Farm Manager', blockFarm: 'Block Farm B', regDate: '2026-05-21' }
  ],
  systemHistory: [
    {
      id: 'AUD-094',
      timestamp: 'May 23, 2026, 09:30 AM',
      category: 'block',
      categoryLabel: 'Block Farm Registry',
      eventType: 'Block Farm Enrolled',
      entity: 'Block Farm D · Manapla (28.0 Ha)',
      details: 'Registered 28.0 Ha cooperative cluster under SRA District VII oversight assigned to Manager Ricardo Dalisay.',
      actor: 'SRA District Administrator',
      status: 'Enrolled'
    },
    {
      id: 'AUD-093',
      timestamp: 'May 23, 2026, 08:45 AM',
      category: 'block',
      categoryLabel: 'Block Farm Registry',
      eventType: 'Block Farm Enrolled',
      entity: 'Block Farm C · Sagay (22.5 Ha)',
      details: 'Registered 22.5 Ha cooperative cluster under SRA District VII oversight assigned to Manager Elena Batongbakal.',
      actor: 'SRA District Administrator',
      status: 'Enrolled'
    },
    {
      id: 'AUD-092',
      timestamp: 'May 22, 2026, 04:30 PM',
      category: 'block',
      categoryLabel: 'Block Farm Registry',
      eventType: 'Block Farm Enrolled',
      entity: 'Block Farm B · Cadiz (25.0 Ha)',
      details: 'Registered 25.0 Ha cooperative cluster under SRA District VII oversight assigned to Manager Maria Santos.',
      actor: 'SRA District Administrator',
      status: 'Enrolled'
    },
    {
      id: 'AUD-091',
      timestamp: 'May 22, 2026, 02:00 PM',
      category: 'block',
      categoryLabel: 'Block Farm Registry',
      eventType: 'Block Farm Enrolled',
      entity: 'Block Farm A · Silay (20.0 Ha)',
      details: 'Registered 20.0 Ha cooperative cluster under SRA District VII oversight assigned to Manager Jose Reyes.',
      actor: 'SRA District Administrator',
      status: 'Enrolled'
    },
    {
      id: 'AUD-089',
      timestamp: 'May 22, 2026, 03:15 PM',
      category: 'operation',
      categoryLabel: 'Field Operation',
      eventType: 'Manager Log Correction',
      entity: 'FLD-KTR-001 (Mario Dimagiba)',
      details: 'Corrected Urea bags from 40 to 4 (typo adjustment). Cost adjusted from ₱74,000 to ₱7,400.',
      actor: 'Farm Manager Jose Reyes',
      status: 'Recorded'
    },
    {
      id: 'AUD-088',
      timestamp: 'May 22, 2026, 11:30 AM',
      category: 'operation',
      categoryLabel: 'Field Operation',
      eventType: 'Manager Take Over Entry',
      entity: 'FLD-KTR-002 (Jose Rizal)',
      details: 'Directly logged Planting (Patdan) 40,000 pcs on behalf of member. Advanced stage to Weeding.',
      actor: 'Farm Manager Jose Reyes',
      status: 'Recorded'
    },
    {
      id: 'AUD-087',
      timestamp: 'May 21, 2026, 09:00 AM',
      category: 'sra',
      categoryLabel: 'SRA Price',
      eventType: 'Weekly SRA Price Broadcast',
      entity: 'District Millsite Benchmark',
      details: 'Posted Week 4 May Raw Sugar price: ₱2,800 / Lkg (Official SRA Circular #104).',
      actor: 'SRA Admin',
      status: 'Verified'
    },
    {
      id: 'AUD-086',
      timestamp: 'May 20, 2026, 04:45 PM',
      category: 'user',
      categoryLabel: 'User Management',
      eventType: 'Member Registration Approved',
      entity: 'Antonio Luna (0917-888-2233)',
      details: 'Approved farmer membership for Block Farm A and assigned field FLD-KTR-006 (1.2 Ha).',
      actor: 'Farm Manager Jose Reyes',
      status: 'Approved'
    },
    {
      id: 'AUD-085',
      timestamp: 'May 19, 2026, 02:10 PM',
      category: 'plot',
      categoryLabel: 'Plot Registry',
      eventType: 'Field Plot Registered',
      entity: 'FLD-KTR-006 (1.2 Ha)',
      details: 'Enrolled 1.2 Ha sugarcane field in Silay Block Farm A with soil classification Guimbalaon Clay.',
      actor: 'Farm Manager Jose Reyes',
      status: 'Enrolled'
    },
    {
      id: 'AUD-084',
      timestamp: 'May 18, 2026, 01:20 PM',
      category: 'user',
      categoryLabel: 'User Management',
      eventType: 'User Access Revoked',
      entity: '0917-555-9999 (Carlos Tan)',
      details: 'Access credentials revoked due to lease expiration in Block Farm B.',
      actor: 'SRA Admin',
      status: 'Revoked'
    },
    {
      id: 'AUD-083',
      timestamp: 'May 16, 2026, 10:15 AM',
      category: 'plot',
      categoryLabel: 'Plot Registry',
      eventType: 'Field Plot Archived',
      entity: 'FLD-KTR-099 (0.5 Ha)',
      details: 'Archived temporary seedbed field following seedling harvest and distribution.',
      actor: 'Farm Manager Jose Reyes',
      status: 'Archived'
    },
    {
      id: 'AUD-082',
      timestamp: 'May 15, 2026, 08:30 AM',
      category: 'operation',
      categoryLabel: 'Field Operation',
      eventType: 'Member Log Submitted',
      entity: 'FLD-KTR-001 (Mario Dimagiba)',
      details: 'Offline log recorded: 4 bags Urea Fertilizer (₱6,400) applied by 4 workers.',
      actor: 'Member Mario Dimagiba',
      status: 'Recorded'
    },
    {
      id: 'AUD-081',
      timestamp: 'May 05, 2026, 05:00 PM',
      category: 'sra',
      categoryLabel: 'SRA Audit',
      eventType: 'Monthly QR Audit Certification',
      entity: 'Block Farm A (HUG-202605-A3F9)',
      details: 'Validated 10 field operations total ₱19,350 across 5.3 Ha. Certified digital compliance signature.',
      actor: 'SRA Auditor',
      status: 'Verified'
    }
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
  ],
  registryHistory: [
    { id: 'HIST-REG-001', date: '2026-02-15', entityType: 'Block Farm', entityId: 'BLK-A', name: 'Block Farm A', manager: 'Jose Reyes', ha: 6.6, action: 'Initial Cooperative Enrollment', authority: 'SRA District VII Circular #88' },
    { id: 'HIST-REG-002', date: '2026-02-18', entityType: 'Block Farm', entityId: 'BLK-B', name: 'Block Farm B', manager: 'Maria Santos', ha: 3.8, action: 'Initial Cooperative Enrollment', authority: 'SRA District VII Circular #89' },
    { id: 'HIST-REG-003', date: '2026-03-01', entityType: 'Block Farm', entityId: 'BLK-C', name: 'Block Farm C', manager: 'Elena Batongbakal', ha: 4.0, action: 'Initial Cooperative Enrollment', authority: 'SRA District VII Circular #91' },
    { id: 'HIST-REG-004', date: '2026-03-05', entityType: 'Block Farm', entityId: 'BLK-D', name: 'Block Farm D', manager: 'Ricardo Dalisay', ha: 2.0, action: 'Initial Cooperative Enrollment', authority: 'SRA District VII Circular #93' },
    { id: 'HIST-REG-005', date: '2026-03-10', entityType: 'Field Plot', entityId: 'FLD-KTR-001', name: 'Block Farm A · Plot 1', member: 'Mario Dimagiba', ha: 1.5, action: 'Field Boundary Registration & Soil Test', authority: 'Farm Manager Jose Reyes' },
    { id: 'HIST-REG-006', date: '2026-03-12', entityType: 'Field Plot', entityId: 'FLD-KTR-002', name: 'Block Farm A · Plot 2', member: 'Jose Rizal', ha: 2.1, action: 'Field Boundary Registration', authority: 'Farm Manager Jose Reyes' },
    { id: 'HIST-REG-007', date: '2026-03-15', entityType: 'Field Plot', entityId: 'FLD-KTR-003', name: 'Block Farm B · Plot 1', member: 'Maria Santos', ha: 2.0, action: 'Field Boundary Registration', authority: 'Farm Manager Maria Santos' },
    { id: 'HIST-REG-008', date: '2026-03-18', entityType: 'Field Plot', entityId: 'FLD-KTR-004', name: 'Block Farm B · Plot 2', member: 'Emilio Aguinaldo', ha: 1.8, action: 'Field Boundary Registration', authority: 'Farm Manager Maria Santos' },
    { id: 'HIST-REG-009', date: '2026-03-20', entityType: 'Field Plot', entityId: 'FLD-KTR-005', name: 'Block Farm A · Plot 3', member: 'Roberto Tan', ha: 1.8, action: 'Field Boundary Registration', authority: 'Farm Manager Jose Reyes' },
    { id: 'HIST-REG-010', date: '2026-03-22', entityType: 'Field Plot', entityId: 'FLD-KTR-006', name: 'Block Farm A · Plot 4', member: 'Antonio Luna', ha: 1.2, action: 'Field Boundary Registration', authority: 'Farm Manager Jose Reyes' },
    { id: 'HIST-REG-011', date: '2026-04-01', entityType: 'Field Plot', entityId: 'FLD-KTR-007', name: 'Block Farm C · Plot 1', member: 'Pedro Reyes', ha: 1.0, action: 'Field Boundary Registration', authority: 'Farm Manager Elena Batongbakal' },
    { id: 'HIST-REG-012', date: '2026-04-05', entityType: 'Field Plot', entityId: 'FLD-KTR-008', name: 'Block Farm C · Plot 2', member: 'Andres Bonifacio', ha: 3.0, action: 'Field Boundary Registration', authority: 'Farm Manager Elena Batongbakal' },
    { id: 'HIST-REG-013', date: '2026-04-10', entityType: 'Field Plot', entityId: 'FLD-KTR-009', name: 'Block Farm D · Plot 1', member: 'Ana Gomez', ha: 0.8, action: 'Field Boundary Registration', authority: 'Farm Manager Ricardo Dalisay' },
    { id: 'HIST-REG-014', date: '2026-04-15', entityType: 'Field Plot', entityId: 'FLD-KTR-010', name: 'Block Farm D · Plot 2', member: 'Apolinario Mabini', ha: 1.2, action: 'Field Boundary Registration', authority: 'Farm Manager Ricardo Dalisay' }
  ],
  supportTickets: [
    { id: 'TCK-801', title: 'Offline Log Sync Failure after 3 days offline', author: 'Mario Dimagiba (Member - FLD-KTR-001)', blockFarm: 'Block Farm A', category: 'Offline Sync Collision', priority: 'High', status: 'Open', date: '2026-05-23', details: 'Completed 3 manual weeding and fertilization logs while in northern field without 4G. Logs remain in device queue after Wi-Fi reconnection.', resolutionNotes: '' },
    { id: 'TCK-802', title: 'Plot Boundary Hectarage Discrepancy', author: 'Jose Reyes (Farm Manager)', blockFarm: 'Block Farm A', category: 'Plot Boundary Conflict', priority: 'Medium', status: 'In Progress', date: '2026-05-22 02:15 PM', details: 'FLD-KTR-002 surveyed area is 2.1 Ha but satellite map boundary shows overlap with adjacent FLD-KTR-005 by 0.3 Ha.', resolutionNotes: 'Re-survey coordinates dispatched to Silay surveyor.' },
    { id: 'TCK-803', title: 'QR Compilation Audit Scanner Timeout', author: 'Juan dela Cruz (SRA Admin)', blockFarm: 'District VII', category: 'Hardware / App Crash', priority: 'Critical', status: 'In Progress', date: '2026-05-21 11:45 AM', details: 'Scanning high-density 24-log compressed QR code on older Android 11 terminal fails camera focus after 10s.', resolutionNotes: 'Compressing QR payload chunk size in upcoming hotfix.' },
    { id: 'TCK-804', title: 'Member Phone Number / OTP Lockout', author: 'Antonio Luna (Member - FLD-KTR-006)', blockFarm: 'Block Farm A', category: 'Account / OTP Lockout', priority: 'Low', status: 'Resolved', date: '2026-05-19 04:00 PM', details: 'Lost SIM card 09172223344. Requested account number update to new SIM 09173334455.', resolutionNotes: 'Verified identity with Farm Manager Jose Reyes and updated user profile.' }
  ],
  terminalDiagnostics: [
    { deviceId: 'TRM-ANDR-01', model: 'Samsung Galaxy A14', staff: 'Jose Reyes (Manager)', blockFarm: 'Block Farm A', os: 'Android 13', appVersion: 'v2.4.1-rc3', battery: '88%', cachedLogs: 0, lastSync: '2 mins ago', status: 'Optimal' },
    { deviceId: 'TRM-ANDR-02', model: 'Xiaomi Redmi 12', staff: 'Mario Dimagiba (Member)', blockFarm: 'Block Farm A', os: 'Android 12', appVersion: 'v2.4.1-rc3', battery: '42%', cachedLogs: 2, lastSync: '3 hrs ago', status: 'Optimal' },
    { deviceId: 'TRM-ANDR-03', model: 'Realme C55', staff: 'Maria Santos (Manager)', blockFarm: 'Block Farm B', os: 'Android 13', appVersion: 'v2.4.0', battery: '76%', cachedLogs: 0, lastSync: '15 mins ago', status: 'Optimal' },
    { deviceId: 'TRM-ANDR-04', model: 'Infinix Hot 30i', staff: 'Pedro Reyes (Member)', blockFarm: 'Block Farm C', os: 'Android 11', appVersion: 'v2.3.9 (Outdated)', battery: '19%', cachedLogs: 5, lastSync: '8 days ago', status: 'Lagging Alert' }
  ]
};

// ── GET & SET LOCAL STORAGE DATABASE ─────────────────────
function getDB() {
  const data = localStorage.getItem('hugpong_db');
  if (!data) {
    saveDB(INITIAL_DATABASE);
    return INITIAL_DATABASE;
  }
  let parsed = INITIAL_DATABASE;
  try {
    parsed = JSON.parse(data);
  } catch (e) {
    saveDB(INITIAL_DATABASE);
    return INITIAL_DATABASE;
  }

  let updated = false;
  if (!parsed.fields || !Array.isArray(parsed.fields) || parsed.fields.length === 0) {
    parsed.fields = JSON.parse(JSON.stringify(INITIAL_DATABASE.fields));
    updated = true;
  }
  if (!parsed.systemHistory || !Array.isArray(parsed.systemHistory) || parsed.systemHistory.length === 0) {
    parsed.systemHistory = JSON.parse(JSON.stringify(INITIAL_DATABASE.systemHistory));
    updated = true;
  }
  if (!parsed.registryHistory || !Array.isArray(parsed.registryHistory) || parsed.registryHistory.length === 0) {
    parsed.registryHistory = JSON.parse(JSON.stringify(INITIAL_DATABASE.registryHistory));
    updated = true;
  }
  if (!parsed.supportTickets || !Array.isArray(parsed.supportTickets) || parsed.supportTickets.length === 0) {
    parsed.supportTickets = JSON.parse(JSON.stringify(INITIAL_DATABASE.supportTickets));
    updated = true;
  }
  if (!parsed.terminalDiagnostics || !Array.isArray(parsed.terminalDiagnostics) || parsed.terminalDiagnostics.length === 0) {
    parsed.terminalDiagnostics = JSON.parse(JSON.stringify(INITIAL_DATABASE.terminalDiagnostics));
    updated = true;
  }

  // Normalize legacy status labels & merge initial history
  if (Array.isArray(parsed.systemHistory)) {
    INITIAL_DATABASE.systemHistory.forEach(initH => {
      if (!parsed.systemHistory.some(h => h.id === initH.id)) {
        parsed.systemHistory.unshift(initH);
        updated = true;
      }
    });
    parsed.systemHistory.forEach(h => {
      if (h.status === 'Completed') {
        h.status = 'Recorded';
        updated = true;
      }
      if (h.details && /\bparcel\b/i.test(h.details)) {
        h.details = h.details.replace(/\bfield parcel\b/gi, 'field plot').replace(/\bplot parcel\b/gi, 'field plot').replace(/\bparcels\b/gi, 'plots').replace(/\bparcel\b/gi, 'plot');
        updated = true;
      }
      if (h.entity && /\bparcel\b/i.test(h.entity)) {
        h.entity = h.entity.replace(/\bfield parcel\b/gi, 'field plot').replace(/\bplot parcel\b/gi, 'field plot').replace(/\bparcels\b/gi, 'plots').replace(/\bparcel\b/gi, 'plot');
        updated = true;
      }
      if (h.eventType && /\bparcel\b/i.test(h.eventType)) {
        h.eventType = h.eventType.replace(/\bfield parcel\b/gi, 'field plot').replace(/\bplot parcel\b/gi, 'field plot').replace(/\bparcels\b/gi, 'plots').replace(/\bparcel\b/gi, 'plot');
        updated = true;
      }
    });
  }

  if (Array.isArray(parsed.registryHistory)) {
    parsed.registryHistory.forEach(r => {
      if (r.action && /\bparcel\b/i.test(r.action)) {
        r.action = r.action.replace(/\bfield parcel\b/gi, 'field plot').replace(/\bplot parcel\b/gi, 'field plot').replace(/\bparcels\b/gi, 'plots').replace(/\bparcel\b/gi, 'plot');
        updated = true;
      }
    });
  }

  if (updated) {
    saveDB(parsed);
  }

  return parsed;
}

function saveDB(db, syncToCloud = true) {
  localStorage.setItem('hugpong_db', JSON.stringify(db));

  if (syncToCloud && window.firebaseDB && window.firestore) {
    syncLocalChangesToFirestore(db).catch(err => {
      console.warn('[HUGPONG] Background Firestore sync notice:', err.message);
    });
  }
}

async function syncLocalChangesToFirestore(db) {
  const { doc, setDoc } = window.firestore;
  const fDb = window.firebaseDB;
  if (!fDb) return;

  // Sync fields
  if (Array.isArray(db.fields)) {
    for (const f of db.fields) {
      if (f.id) {
        await setDoc(doc(fDb, 'fields', f.id), { ...f, updatedAt: new Date().toISOString() }, { merge: true });
      }
    }
  }

  // Sync prices
  if (Array.isArray(db.priceHistory)) {
    for (const p of db.priceHistory) {
      const pId = p.id || `PRC-${(p.date || '').replace(/\D/g, '') || Date.now()}`;
      await setDoc(doc(fDb, 'sra_prices', pId), { ...p, id: pId }, { merge: true });
    }
  }
}

let firestoreSyncInitialized = false;

function initFirestoreRealtimeSync() {
  if (firestoreSyncInitialized) return;
  if (!window.firebaseDB || !window.firestore) {
    window.addEventListener('hugpong:firebase_ready', initFirestoreRealtimeSync, { once: true });
    return;
  }

  firestoreSyncInitialized = true;
  const { collection, onSnapshot } = window.firestore;
  const fDb = window.firebaseDB;

  console.log('[HUGPONG] Attaching real-time Firestore listeners (hugpong-ff)...');

  // Auto-seed if empty
  if (typeof window.seedFirestoreDatabase === 'function') {
    window.seedFirestoreDatabase(false).catch(err => {
      console.warn('[HUGPONG] Seeder check notice:', err);
    });
  }

  // 1. Listen on Fields
  onSnapshot(collection(fDb, 'fields'), (snapshot) => {
    if (snapshot.empty) return;
    const db = getDB();
    const remoteFields = [];
    snapshot.forEach(docSnap => remoteFields.push(docSnap.data()));

    let changed = false;
    remoteFields.forEach(rf => {
      const idx = db.fields.findIndex(lf => lf.id === rf.id);
      if (idx >= 0) {
        db.fields[idx] = { ...db.fields[idx], ...rf };
        changed = true;
      } else {
        db.fields.push(rf);
        changed = true;
      }
    });

    if (changed) {
      saveDB(db, false);
      renderDashboard();
      if (currentPage === 'fields') renderFields();
      if (currentPage === 'operations') renderOperations();
      if (currentPage === 'manager') renderManager();
    }
  }, (err) => console.warn('[Firestore] fields listener notice:', err));

  // 2. Listen on Operation Logs
  onSnapshot(collection(fDb, 'operation_logs'), (snapshot) => {
    if (snapshot.empty) return;
    const db = getDB();
    const remoteLogs = [];
    snapshot.forEach(docSnap => remoteLogs.push(docSnap.data()));

    let changed = false;
    remoteLogs.forEach(rl => {
      const idx = db.logs.findIndex(ll => ll.id === rl.id);
      if (idx >= 0) {
        db.logs[idx] = { ...db.logs[idx], ...rl };
        changed = true;
      } else {
        db.logs.unshift(rl);
        changed = true;
      }
    });

    if (changed) {
      saveDB(db, false);
      renderDashboard();
      if (currentPage === 'logs') renderLogs();
      if (currentPage === 'operations') renderOperations();
    }
  }, (err) => console.warn('[Firestore] operation_logs listener notice:', err));

  // 3. Listen on SRA Sugar Prices
  onSnapshot(collection(fDb, 'sra_prices'), (snapshot) => {
    if (snapshot.empty) return;
    const db = getDB();
    const remotePrices = [];
    snapshot.forEach(docSnap => remotePrices.push(docSnap.data()));

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

    // Sort by timestamp descending (newest first)
    remotePrices.sort((a, b) => parsePriceTime(b) - parsePriceTime(a));

    if (remotePrices.length > 0) {
      db.priceHistory = remotePrices;
      saveDB(db, false);
      renderPrices();
      renderPriceHistoryChart();
    }
  }, (err) => console.warn('[Firestore] sra_prices listener notice:', err));
}

// Auto-start Firestore sync
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initFirestoreRealtimeSync, 300));
} else {
  setTimeout(initFirestoreRealtimeSync, 300);
}

// ── NAVIGATION CONTROLLER ────────────────────────────────
const PAGES = {
  dashboard: { heading: 'Dashboard', sub: 'Overview of block farm operations & system telemetry' },
  manager: { heading: 'Farm Manager Workspace', sub: 'Direct supervision, field assignments, and log approvals for your block farm' },
  members: { heading: 'Block Farm Members', sub: 'Directory of registered members and their allocated sugarcane plots' },
  operations: { heading: 'Field Operations & Take Over', sub: 'Monitor crop cycle stages, review recorded progress, and take over field management' },
  audit: { heading: 'SRA Audit Desk', sub: 'Scan mobile compiled QR reports and verify operation logs' },
  prices: { heading: 'SRA Price Monitor', sub: 'Supervise and post official SRA Raw Sugar weekly prices' },
  logs: { heading: 'Field Operation Logs', sub: 'Review operation logs logged by members' },
  users: { heading: 'User Management', sub: 'Review active directory roles and approve pending registrations' },
  fields: { heading: 'Block Farm Registry', sub: 'Supervise registered block farms, transfer ownership IDs, and track sync statuses' },
  history: { heading: 'System Audit & Event Ledger', sub: 'Comprehensive auditable ledger of district operations, land registrations, user authorizations, and regulatory events' },
  sync: { heading: 'Sync & Inactivity Monitor', sub: 'Real-time telemetry, offline buffer health, and device connectivity across all district block farms' },
  synctelemetry: { heading: 'Member Sync & Inactivity Telemetry', sub: 'Real-time mobile offline buffer monitoring and member sync health for Block Farm A' },
  tickets: { heading: 'Support & Issue Ticketing Desk', sub: 'Triage offline sync issues, app crashes, and member support requests' },
  maintenance: { heading: 'System Maintenance & Security', sub: 'Manage global parameters, database health, and security' },
  settings: { heading: 'Settings & Security Console', sub: 'System preferences, account credentials, and platform diagnostics' }
};

let currentPage = 'dashboard';
let logStatusFilter = 'all';
let historyActiveCategory = 'all';
let historyCurrentPage = 1;
const historyItemsPerPage = 8;
let syncActiveBlockFilter = 'all';
let syncCurrentPage = 1;
const syncItemsPerPage = 5;
let ticketsCurrentPage = 1;
const TICKETS_PER_PAGE = 3;

function setSyncBlockFilter(bName) {
  if (syncActiveBlockFilter === bName) {
    syncActiveBlockFilter = 'all';
    toast('Showing all mobile terminals');
  } else {
    syncActiveBlockFilter = bName;
    toast(`Filtered devices for ${bName}`);
  }
  syncCurrentPage = 1;
  renderSync();
}

function setSyncPage(p) {
  syncCurrentPage = p;
  renderSync();
}

function setHistoryPage(p) {
  historyCurrentPage = p;
  renderHistory();
}

function setTicketsPage(p) {
  ticketsCurrentPage = p;
  renderTickets();
}

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
  if (page === 'manager') {
    navigate('dashboard');
    return;
  }
  if (page === 'logs') {
    navigate('operations');
    return;
  }
  if (currentRole !== 'superadmin' && ['sync', 'history', 'tickets', 'maintenance'].includes(page)) {
    toast('Access Denied: Requires Super Admin clearance.');
    navigate('dashboard');
    return;
  }
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  const targetEl = document.getElementById('page-' + page);
  if (targetEl) targetEl.classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.nav-item[data-page="' + page + '"]').forEach(btn => btn.classList.add('active'));
  const headingEl = document.getElementById('page-heading');
  const subEl = document.getElementById('page-sub');
  if (headingEl && PAGES[page]) {
    if (page === 'fields' && currentRole === 'manager') {
      headingEl.textContent = 'Field Plot Registry';
      subEl.textContent = 'Direct field management, member plot allocations, and crop stage tracking for Block Farm A';
    } else {
      headingEl.textContent = PAGES[page].heading;
      subEl.textContent = PAGES[page].sub;
    }
  }
  currentPage = page;
  if (page === 'dashboard') renderDashboard();
  if (page === 'manager') renderManager();
  if (page === 'members') renderMembers();
  if (page === 'operations') renderOperations();
  if (page === 'audit') resetAuditCenter();
  if (page === 'prices') renderPrices();
  if (page === 'logs') renderLogs();
  if (page === 'users') renderUsers();
  if (page === 'fields') renderFields();
  if (page === 'history') renderHistory();
  if (page === 'sync') renderSync();
  if (page === 'synctelemetry') renderManagerFullSyncTelemetry();
  if (page === 'tickets') renderTickets();
  if (page === 'maintenance') renderMaintenance();
  if (page === 'settings') renderSettings();
}

function switchRole(role) {
  localStorage.setItem('hugpong_role', role);
  applyRoleLayout(role);
  const roleName = role === 'superadmin' ? 'Super Admin' : (role === 'manager' ? 'Farm Manager (Block Farm A)' : 'SRA (Admin)');
  toast(`Switched identity to: ${roleName}`);
  navigate('dashboard');
}

function applyRoleLayout(role) {
  const avatarEl = document.getElementById('sidebar-admin-avatar');
  const nameEl = document.getElementById('sidebar-admin-name');
  const roleEl = document.getElementById('sidebar-admin-role');
  const subEl = document.getElementById('sidebar-app-sub');
  const popNameEl = document.getElementById('popover-user-name');
  const popRoleEl = document.getElementById('popover-user-role');

  if (role === 'superadmin') {
    if (avatarEl) { avatarEl.textContent = 'M'; avatarEl.style.background = 'linear-gradient(135deg, #F5A623, #ff8c00)'; avatarEl.style.boxShadow = '0 0 8px rgba(245,166,35,0.5)'; }
    if (nameEl) nameEl.textContent = 'Engr. Mateo Alcantara';
    if (roleEl) roleEl.textContent = 'Super Admin';
    if (popNameEl) popNameEl.textContent = 'Engr. Mateo Alcantara';
    if (popRoleEl) popRoleEl.textContent = 'Super Admin · Systems Director';
    if (subEl) subEl.textContent = 'System Governance';
    document.querySelectorAll('.superadmin-only').forEach(el => el.classList.remove('hidden'));
    document.querySelectorAll('.sra-only').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.sra-or-manager').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.manager-only').forEach(el => el.classList.add('hidden'));
  } else if (role === 'manager') {
    if (avatarEl) { avatarEl.textContent = 'J'; avatarEl.style.background = 'linear-gradient(135deg, #1A6B9A, #2A7F8F)'; avatarEl.style.boxShadow = '0 0 8px rgba(26,107,154,0.4)'; }
    if (nameEl) nameEl.textContent = 'Jose Reyes';
    if (roleEl) roleEl.textContent = 'Farm Manager (Block Farm A)';
    if (popNameEl) popNameEl.textContent = 'Jose Reyes';
    if (popRoleEl) popRoleEl.textContent = 'Farm Manager · Block Farm A';
    if (subEl) subEl.textContent = 'Farm Workspace';
    document.querySelectorAll('.superadmin-only').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.sra-only').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.sra-or-manager').forEach(el => el.classList.remove('hidden'));
    document.querySelectorAll('.manager-only').forEach(el => el.classList.remove('hidden'));
  } else {
    if (avatarEl) { avatarEl.textContent = 'J'; avatarEl.style.background = ''; avatarEl.style.boxShadow = ''; }
    if (nameEl) nameEl.textContent = 'Juan dela Cruz';
    if (roleEl) roleEl.textContent = 'SRA (Admin)';
    if (popNameEl) popNameEl.textContent = 'Juan dela Cruz';
    if (popRoleEl) popRoleEl.textContent = 'SRA Regulatory Officer';
    if (subEl) subEl.textContent = 'SRA District Console';
    document.querySelectorAll('.superadmin-only').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.sra-only').forEach(el => el.classList.remove('hidden'));
    document.querySelectorAll('.sra-or-manager').forEach(el => el.classList.remove('hidden'));
    document.querySelectorAll('.manager-only').forEach(el => el.classList.add('hidden'));
  }
}

// Helper to determine block farm
function getBlockFarmName(fieldId) {
  const farmMap = {
    'FLD-KTR-001': 'Block Farm A', 'FLD-KTR-002': 'Block Farm A',
    'FLD-KTR-003': 'Block Farm B', 'FLD-KTR-004': 'Block Farm B',
    'FLD-KTR-007': 'Block Farm C', 'FLD-KTR-008': 'Block Farm C',
    'FLD-KTR-009': 'Block Farm D', 'FLD-KTR-010': 'Block Farm D'
  };
  return farmMap[fieldId] || 'Block Farm A';
}

function getBlockId(blockFarmName) {
  const map = {
    'Block Farm A': 'BLK-A',
    'Block Farm B': 'BLK-B',
    'Block Farm C': 'BLK-C',
    'Block Farm D': 'BLK-D'
  };
  return map[blockFarmName] || ('BLK-' + blockFarmName.replace(/[^A-Za-z0-9]/g, '').toUpperCase());
}

// ── SUPER ADMIN DASHBOARD VIEW SWITCHER ─────────────────
let currentSuperadminDashboardView = 'agri';

function updateSuperadminViewButtons(view) {
  const btnAgri = document.getElementById('super-btn-agri');
  const btnTel = document.getElementById('super-btn-telemetry');
  if (view === 'agri') {
    if (btnAgri) btnAgri.className = 'flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 bg-primary text-white shadow-xs';
    if (btnTel) btnTel.className = 'flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold text-hug-muted hover:text-hug-text transition-all cursor-pointer flex items-center justify-center gap-1.5';
  } else {
    if (btnTel) btnTel.className = 'flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 bg-primary text-white shadow-xs';
    if (btnAgri) btnAgri.className = 'flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold text-hug-muted hover:text-hug-text transition-all cursor-pointer flex items-center justify-center gap-1.5';
  }
}

function switchSuperadminDashboardView(view) {
  currentSuperadminDashboardView = view;
  const db = getDB();
  renderDashboard(db);
}
window.switchSuperadminDashboardView = switchSuperadminDashboardView;

// ── DASHBOARD VIEW (ELEVATED VISUALS) ───────────────────
function renderDashboard() {
  const db = getDB();
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const isManager = currentRole === 'manager';
  const isSuper = currentRole === 'superadmin';
  const managerBlockFarm = 'Block Farm A';

  // 1. Dynamic Hero Banner Text
  const heroBadge = document.getElementById('hero-badge-role');
  const heroHeading = document.getElementById('hero-heading');
  const heroSubtext = document.getElementById('hero-subtext');
  const heroManagerBtn = document.getElementById('hero-manager-btn');
  const heroManagerFieldsBtn = document.getElementById('hero-manager-fields-btn');

  if (heroBadge) heroBadge.textContent = isManager ? 'Farm Manager Console' : (isSuper ? 'System Infrastructure & Telemetry Console' : 'SRA Command Center');
  if (heroHeading) heroHeading.textContent = isManager ? 'Welcome back, Jose Reyes' : (isSuper ? 'System Telemetry & Platform Governance' : 'Negros Sugarcane Supervision Console');
  if (heroSubtext) heroSubtext.textContent = isManager 
    ? 'Block Farm A · Silay Cooperative · Supervising 2 active field allocations, crop timelines, and member operation logs.' 
    : (isSuper
      ? 'Consolidated district sync health, mobile terminal hardware telemetry, database integrity, and system support ticketing desk.'
      : 'Consolidated real-time oversight of block farm operations, field crop stages, member labor logs, and certified SRA audit benchmarks.');
  if (heroManagerBtn) {
    if (isManager) heroManagerBtn.classList.remove('hidden');
    else heroManagerBtn.classList.add('hidden');
  }
  if (heroManagerFieldsBtn) {
    if (isManager) heroManagerFieldsBtn.classList.remove('hidden');
    else heroManagerFieldsBtn.classList.add('hidden');
  }

  const sraView = document.getElementById('sra-dashboard-view');
  const mgrView = document.getElementById('manager-dashboard-view');
  const superView = document.getElementById('superadmin-dashboard-view');

  if (isSuper) {
    if (mgrView) mgrView.classList.add('hidden');
    updateSuperadminViewButtons(currentSuperadminDashboardView);
    if (currentSuperadminDashboardView === 'telemetry') {
      if (sraView) sraView.classList.add('hidden');
      if (superView) superView.classList.remove('hidden');
      renderSuperadminTelemetryDashboard(db);
      return;
    } else {
      if (superView) superView.classList.add('hidden');
      if (sraView) sraView.classList.remove('hidden');
      // Continue below to render full sugarcane agricultural analytics for Super Admin!
    }
  } else if (isManager) {
    if (sraView) sraView.classList.add('hidden');
    if (superView) superView.classList.add('hidden');
    if (mgrView) mgrView.classList.remove('hidden');
    renderManager();
    return;
  } else {
    // SRA Admin Dashboard View
    if (mgrView) mgrView.classList.add('hidden');
    if (superView) superView.classList.add('hidden');
    if (sraView) sraView.classList.remove('hidden');
  }

  const dashAreaLabel = document.getElementById('dash-stat-area-label');
  const dashAreaVal = document.getElementById('dash-stat-area-val');
  const dashAreaSub = document.getElementById('dash-stat-area-sub');

  // 2. Load prices KPIs (Dual: Raw Sugar & Molasses)
  const currentPrice = Number(db.priceHistory[0]?.price) || 2950;
  const prevPrice = Number(db.priceHistory[1]?.price) || 2880;
  const change = db.priceHistory[0]?.change !== undefined ? Number(db.priceHistory[0].change) : (currentPrice - prevPrice);

  const currentMol = Number(db.priceHistory[0]?.molasses) || 4400;
  const prevMol = Number(db.priceHistory[1]?.molasses) || 4300;
  const molChange = db.priceHistory[0]?.molassesChange !== undefined ? Number(db.priceHistory[0].molassesChange) : (currentMol - prevMol);

  const topPriceEl = document.getElementById('topbar-sugar-price');
  const topMolEl = document.getElementById('topbar-molasses-price');
  const dashPriceEl = document.getElementById('dashboard-sugar-price');
  const dashMolPriceEl = document.getElementById('dashboard-molasses-price');
  const dashChangeEl = document.getElementById('dashboard-sugar-change');
  const dashMolChangeEl = document.getElementById('dashboard-molasses-change');

  if (topPriceEl) topPriceEl.textContent = `₱${currentPrice.toLocaleString()} / Lkg`;
  if (topMolEl) topMolEl.textContent = `₱${currentMol.toLocaleString()} / MT`;

  if (dashPriceEl) dashPriceEl.innerHTML = `₱${currentPrice.toLocaleString()} <span class="text-xs font-semibold text-hug-muted font-normal">/ Lkg</span>`;
  if (dashMolPriceEl) dashMolPriceEl.innerHTML = `₱${currentMol.toLocaleString()} <span class="text-xs font-semibold text-hug-muted font-normal">/ MT</span>`;

  if (dashChangeEl) {
    if (change > 0) {
      dashChangeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success';
      dashChangeEl.textContent = `▲ +₱${change.toLocaleString()} / Lkg`;
    } else if (change < 0) {
      dashChangeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger-bg text-danger';
      dashChangeEl.textContent = `▼ -₱${Math.abs(change).toLocaleString()} / Lkg`;
    } else {
      dashChangeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-bg text-hug-muted';
      dashChangeEl.textContent = `Steady (₱0)`;
    }
  }

  if (dashMolChangeEl) {
    if (molChange > 0) {
      dashMolChangeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success';
      dashMolChangeEl.textContent = `▲ +₱${molChange.toLocaleString()} / MT`;
    } else if (molChange < 0) {
      dashMolChangeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger-bg text-danger';
      dashMolChangeEl.textContent = `▼ -₱${Math.abs(molChange).toLocaleString()} / MT`;
    } else {
      dashMolChangeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-bg text-hug-muted';
      dashMolChangeEl.textContent = `Steady (₱0)`;
    }
  }

  // 3. Active fields & logs based on role
  const visibleFields = db.fields;
  const visibleLogs = db.logs;

  const totalHa = visibleFields.reduce((s, f) => s + (Number(f.ha || f.area) || 0), 0);
  if (dashAreaLabel) dashAreaLabel.textContent = 'Total Managed Area';
  if (dashAreaVal) dashAreaVal.textContent = `${totalHa.toFixed(1)} Ha`;
  if (dashAreaSub) dashAreaSub.textContent = '4 active block farms · 100% mapped';

  // 4. Investment & Counts
  const approvedLogs = visibleLogs.filter(l => l.status === 'Approved');
  const pendingLogs = visibleLogs.filter(l => l.status === 'Pending');
  const totalCost = approvedLogs.reduce((s, l) => s + (Number(l.cost) || 0), 0);

  const elCost = document.getElementById('summary-total-cost');
  const elApprovedPill = document.getElementById('summary-approved-logs-pill');
  const elAuditVal = document.getElementById('dashboard-audit-val');
  const elAuditBadge = document.getElementById('dashboard-audit-badge');
  const elAuditSub = document.getElementById('dashboard-audit-sub');

  if (elCost) elCost.textContent = totalCost >= 1000000 ? `₱${(totalCost / 1000000).toFixed(2)}M` : `₱${(totalCost / 1000).toFixed(1)}k`;
  if (elApprovedPill) elApprovedPill.textContent = `${approvedLogs.length} Logs`;

  const certPct = visibleLogs.length > 0 ? Math.round((approvedLogs.length / visibleLogs.length) * 100) : 100;
  if (elAuditVal) elAuditVal.textContent = `${certPct}% Certified`;
  if (elAuditBadge) {
    if (pendingLogs.length > 0) {
      elAuditBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-warning-bg text-[#C97A00]';
      elAuditBadge.textContent = `${pendingLogs.length} in Review`;
    } else {
      elAuditBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success';
      elAuditBadge.textContent = 'All Recorded';
    }
  }
  if (elAuditSub) elAuditSub.textContent = `${approvedLogs.length} of ${visibleLogs.length} logs recorded`;

  // 5. Render Visual Charts
  renderPriceHistoryChart();
  renderCostEfficiencyChart();
  renderCropStageDistribution();
}

// ── SUGAR PRICE ANALYTICS TIMEFRAME CONTROLS ──────────────
let priceChartTimeframe = 'weekly'; // 'weekly' or 'monthly'

function setPriceChartTimeframe(tf) {
  priceChartTimeframe = tf;
  const weekBtns = document.querySelectorAll('.price-tf-week');
  const monthBtns = document.querySelectorAll('.price-tf-month');
  const titleEls = document.querySelectorAll('.price-chart-title');
  const subEls = document.querySelectorAll('.price-chart-sub');

  if (tf === 'weekly') {
    weekBtns.forEach(b => {
      b.className = 'price-tf-week px-3 py-1 rounded-lg text-xs font-bold transition-all bg-primary text-white shadow-xs cursor-pointer';
    });
    monthBtns.forEach(b => {
      b.className = 'price-tf-month px-3 py-1 rounded-lg text-xs font-medium text-hug-muted hover:text-hug-text transition-all cursor-pointer';
    });
    titleEls.forEach(t => {
      t.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="text-primary"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> SRA Raw Sugar 12-Week Price Trajectory`;
    });
    subEls.forEach(s => {
      s.textContent = 'Historical millsite weekly price benchmarks (Php per Lkg bag)';
    });
  } else {
    weekBtns.forEach(b => {
      b.className = 'price-tf-week px-3 py-1 rounded-lg text-xs font-medium text-hug-muted hover:text-hug-text transition-all cursor-pointer';
    });
    monthBtns.forEach(b => {
      b.className = 'price-tf-month px-3 py-1 rounded-lg text-xs font-bold transition-all bg-primary text-white shadow-xs cursor-pointer';
    });
    titleEls.forEach(t => {
      t.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="text-primary"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> SRA Raw Sugar Monthly Benchmark Trajectory`;
    });
    subEls.forEach(s => {
      s.textContent = 'Aggregated monthly average millsite prices (Php per Lkg bag)';
    });
  }

  renderPriceHistoryChart();
}

function renderPriceHistoryChart() {
  const targets = [
    document.getElementById('price-trend-chart'), 
    document.getElementById('mgr-price-trend-chart'),
    document.getElementById('prices-page-trend-chart')
  ].filter(Boolean);
  if (targets.length === 0) return;
  const db = getDB();
  const rawHistory = db.priceHistory || [];
  if (rawHistory.length === 0) return;

  let history = [];

  if (priceChartTimeframe === 'monthly') {
    // Group by month-year
    const monthMap = new Map();
    const sorted = [...rawHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
    const mNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    sorted.forEach(p => {
      const d = new Date(p.date);
      const key = `${mNames[d.getMonth()]} ${d.getFullYear()}`;
      if (!monthMap.has(key)) {
        monthMap.set(key, { label: key, prices: [], lastDate: p.date, source: p.source });
      }
      monthMap.get(key).prices.push(Number(p.price) || 0);
    });

    let prevAvg = null;
    history = Array.from(monthMap.entries()).map(([k, v]) => {
      const avg = Math.round(v.prices.reduce((sum, val) => sum + val, 0) / v.prices.length);
      const change = prevAvg !== null ? (avg - prevAvg) : 0;
      prevAvg = avg;
      return {
        label: k,
        week: k,
        date: v.lastDate,
        price: avg,
        min: Math.min(...v.prices),
        max: Math.max(...v.prices),
        count: v.prices.length,
        change: change,
        source: `${v.prices.length} weekly circulars`
      };
    });
  } else {
    // Chronological sort: oldest to newest for left-to-right trajectory
    history = [...rawHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  if (history.length === 0) return;

  const prices = history.map(p => Number(p.price) || 0);
  const minP = Math.min(...prices) * 0.96;
  const maxP = Math.max(...prices) * 1.04;
  const range = maxP - minP || 1;

  const W = 540;
  const H = 160;
  const padL = 45;
  const padR = 25;
  const padT = 20;
  const padB = 48;
  const svgW = W + padL + padR;
  const svgH = H + padT + padB;
  const n = history.length;

  const points = history.map((p, i) => {
    const x = n > 1 ? padL + (i / (n - 1)) * W : padL + W / 2;
    const y = padT + H - ((p.price - minP) / range) * H;
    return { x, y, ...p };
  });

  // Smooth Bezier Curve or straight line for fewer points
  let pathD = `M ${points[0].x} ${points[0].y}`;
  if (points.length > 1) {
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const mx = (p0.x + p1.x) / 2;
      pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
  }
  const areaD = points.length > 1
    ? `${pathD} L ${points[points.length - 1].x} ${padT + H} L ${points[0].x} ${padT + H} Z`
    : '';

  const isDark = document.documentElement.classList.contains('dark');
  const gridStroke = isDark ? '#232E3C' : '#E2E8DC';
  const textMuted = isDark ? '#64748B' : '#8A9B7A';
  const textLabel = isDark ? '#94A3B8' : '#5A6B4A';
  const lineStroke = isDark ? '#10B981' : '#2D5016';
  const gradColor = isDark ? '#10B981' : '#4A7C2F';
  const dotStroke = isDark ? '#151C24' : '#FFFFFF';

  // Gridlines & Y-ticks
  const yTicks = [0, 0.33, 0.66, 1].map(frac => {
    const val = Math.round(minP + frac * range);
    const y = padT + H - frac * H;
    return `<line x1="${padL}" y1="${y}" x2="${padL + W}" y2="${y}" stroke="${gridStroke}" stroke-width="1" stroke-dasharray="3 3"/>
      <text x="${padL - 8}" y="${y + 3}" text-anchor="end" font-size="10" font-weight="600" fill="${textMuted}">${val.toLocaleString()}</text>`;
  }).join('');

  // Circles & Clean X-labels
  const dotsAndLabels = points.map((pt, i) => {
    const isLatest = i === n - 1;
    const circleFill = isLatest ? (isDark ? '#34D399' : '#2D5016') : (isDark ? '#10B981' : '#4A7C2F');
    const radius = isLatest ? 6 : 4;
    const pulse = isLatest ? `<circle cx="${pt.x}" cy="${pt.y}" r="11" fill="${circleFill}" opacity="0.25"/>` : '';
    const cleanLabel = priceChartTimeframe === 'monthly' ? pt.label : pt.week.replace(/Week\s+/i, 'W');
    const tooltip = priceChartTimeframe === 'monthly'
      ? `${pt.week}: Average Php ${pt.price.toLocaleString()}/Lkg (Range: ₱${pt.min.toLocaleString()} - ₱${pt.max.toLocaleString()} across ${pt.count} posts)`
      : `${pt.week} (${pt.date}): Php ${pt.price.toLocaleString()}/Lkg (${pt.source})`;

    return `
      <g class="cursor-pointer">
        ${pulse}
        <circle cx="${pt.x}" cy="${pt.y}" r="${radius}" fill="${circleFill}" stroke="${dotStroke}" stroke-width="2">
          <title>${tooltip}</title>
        </circle>
        <text x="${pt.x}" y="${padT + H + 18}" text-anchor="middle" font-size="9" font-weight="700" fill="${textLabel}" transform="rotate(-35, ${pt.x}, ${padT + H + 18})">
          ${cleanLabel}
        </text>
      </g>
    `;
  }).join('');

  const chartHtml = `
    <div class="overflow-x-auto">
      <svg viewBox="0 0 ${svgW} ${svgH}" class="w-full min-w-[460px]">
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${gradColor}" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="${gradColor}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        ${yTicks}
        ${areaD ? `<path d="${areaD}" fill="url(#priceGradient)"/>` : ''}
        <path d="${pathD}" fill="none" stroke="${lineStroke}" stroke-width="3.5" stroke-linecap="round"/>
        ${dotsAndLabels}
      </svg>
    </div>
    <div class="flex items-center justify-between mt-2 pt-2 border-t border-border text-[11px] text-hug-muted flex-wrap gap-2">
      <div class="flex items-center gap-3 flex-wrap">
        <span class="flex items-center gap-1.5 font-semibold text-primary"><span class="w-2 h-2 rounded-full bg-primary"></span> Latest ${priceChartTimeframe === 'monthly' ? 'Month Avg' : 'Week'}: Php ${prices[prices.length - 1].toLocaleString()}</span>
        <span>Low: Php ${Math.min(...prices).toLocaleString()}</span>
        <span>High: Php ${Math.max(...prices).toLocaleString()}</span>
      </div>
      <span class="italic text-[10px]">${priceChartTimeframe === 'monthly' ? `Aggregated ${history.length} Months (${rawHistory.length} circulars)` : 'Benchmark: Official SRA Circulars'}</span>
    </div>`;

  targets.forEach(el => { el.innerHTML = chartHtml; });
}

function getDistrictBenchmarkCostPerHa() {
  const db = getDB();
  const fields = db.fields || [];
  const logs = db.logs || [];

  const totalSpend = logs.reduce((s, l) => s + (Number(l.cost) || 0), 0);
  const totalHa = fields.reduce((s, f) => s + (Number(f.ha || f.area) || 0), 0);

  if (totalSpend > 0 && totalHa > 0) {
    return Math.round(totalSpend / totalHa);
  }

  // Representative weighted average across all 4 regional block farms (129.7 Ha / ₱1.52M)
  return 11950;
}

function renderCostEfficiencyChart() {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const isManager = currentRole === 'manager';
  const el = isManager ? document.getElementById('mgr-cost-efficiency-visual') : document.getElementById('cost-efficiency-visual');
  if (!el) return;

  const benchmark = getDistrictBenchmarkCostPerHa();
  const badgeEl = isManager 
    ? document.getElementById('mgr-cost-efficiency-benchmark-badge') 
    : document.getElementById('cost-efficiency-benchmark-badge');
  if (badgeEl) {
    badgeEl.textContent = `District Benchmark: ₱${(benchmark / 1000).toFixed(1)}k/Ha (Live Avg)`;
    badgeEl.title = `Automatically computed weighted average cost across active district operations (₱${benchmark.toLocaleString()}/Ha)`;
  }

  const data = isManager ? [
    { id: 'FLD-KTR-001 (Juan dela Cruz)', rawKey: 'FLD-KTR-001', costPerHa: 12400, ha: 1.5 },
    { id: 'FLD-KTR-002 (Jose Rizal)', rawKey: 'FLD-KTR-002', costPerHa: 11200, ha: 2.1 }
  ] : [
    { id: 'Block Farm A (Silay)', rawKey: 'Block Farm A', costPerHa: 12400, ha: 34.5 },
    { id: 'Block Farm B (Victorias)', rawKey: 'Block Farm B', costPerHa: 14200, ha: 28.0 },
    { id: 'Block Farm C (Talisay)', rawKey: 'Block Farm C', costPerHa: 9800, ha: 45.2 },
    { id: 'Block Farm D (Bago)', rawKey: 'Block Farm D', costPerHa: 11500, ha: 22.0 }
  ];

  const maxCost = Math.max(...data.map(d => d.costPerHa)) * 1.1;

  el.innerHTML = data.map(item => {
    const pct = Math.round((item.costPerHa / maxCost) * 100);
    const diffPct = Math.round(((item.costPerHa - benchmark) / benchmark) * 100);
    
    let rating = 'Optimal';
    let badgeColor = 'text-primary bg-primary-bg';
    let barGradient = 'bg-gradient-to-r from-primary to-primary-light';

    if (diffPct <= -10) {
      rating = `Leader (${diffPct}%)`;
      badgeColor = 'text-success bg-success-bg';
      barGradient = 'bg-gradient-to-r from-success to-primary';
    } else if (diffPct >= 10) {
      rating = `Higher Overhead (+${diffPct}%)`;
      badgeColor = 'text-danger bg-danger-bg';
      barGradient = 'bg-gradient-to-r from-danger to-[#F5A623]';
    } else {
      rating = diffPct >= 0 ? `Optimal (+${diffPct}%)` : `Optimal (${diffPct}%)`;
      badgeColor = 'text-primary bg-primary-bg';
      barGradient = 'bg-gradient-to-r from-primary to-primary-light';
    }

    return `<div onclick="openDetailedAnalyticsModal('${item.rawKey}')" class="group flex flex-col gap-1.5 p-2.5 rounded-xl hover:bg-primary-bg/50 border border-transparent hover:border-primary/30 transition-all cursor-pointer">
      <div class="flex items-center justify-between text-xs">
        <div class="flex items-center gap-2">
          <span class="font-bold text-hug-text group-hover:text-primary transition-colors">${item.id}</span>
          <span class="text-[11px] text-hug-muted">(${item.ha.toFixed(1)} Ha)</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}">${rating}</span>
          <span class="font-extrabold text-hug-text">₱${(item.costPerHa / 1000).toFixed(1)}k <span class="text-[10px] font-normal text-hug-muted">/ Ha</span></span>
          <span class="text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center">Details →</span>
        </div>
      </div>
      <div class="w-full h-2.5 bg-border rounded-full overflow-hidden">
        <div class="h-full rounded-full ${barGradient} transition-all duration-500" style="width: ${pct}%"></div>
      </div>
    </div>`;
  }).join('');
}

function renderCropStageDistribution() {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const isManager = currentRole === 'manager';
  const el = isManager ? document.getElementById('mgr-crop-stage-visual') : document.getElementById('crop-stage-visual');
  const subEl = document.getElementById('crop-stage-subtitle');
  if (!el) return;
  const scale = isManager ? 0.3 : 1;

  const stages = [
    { name: 'Land Preparation', ha: 28.5 * scale, color: '#8F3A8F', phase: 'Stage 1' },
    { name: 'Planting (Patdan)', ha: 34.0 * scale, color: '#4A7C2F', phase: 'Stage 2' },
    { name: 'Fertilization (1 & 2)', ha: 42.2 * scale, color: '#1A6B9A', phase: 'Stage 3' },
    { name: 'Weeding & Care', ha: 15.0 * scale, color: '#F5A623', phase: 'Stage 4' },
    { name: 'Harvesting & Milling', ha: 10.0 * scale, color: '#D9534F', phase: 'Stage 5' },
  ];
  const total = stages.reduce((s, st) => s + st.ha, 0);

  if (subEl && !isManager) {
    subEl.textContent = `${total.toFixed(1)} Ha active across 4 regional block farms (Click stage for breakdown)`;
  }

  el.innerHTML = stages.map(s => {
    const pct = Math.round((s.ha / total) * 100);
    return `<div onclick="openCropStageModal('${s.name}')" class="group bg-bg rounded-xl p-3 border border-border flex flex-col justify-between hover:border-primary hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
      <div class="flex items-center justify-between mb-2">
        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" style="background-color: ${s.color}15; color: ${s.color}">${s.phase}</span>
        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-hug-text border border-border group-hover:border-primary transition-colors">${pct}%</span>
      </div>
      <div>
        <p class="text-xs font-bold text-hug-text truncate group-hover:text-primary transition-colors">${s.name}</p>
        <p class="text-sm font-black mt-0.5" style="color: ${s.color}">${s.ha.toFixed(1)} Ha</p>
      </div>
      <div class="w-full h-1.5 bg-border rounded-full overflow-hidden mt-2">
        <div class="h-full rounded-full" style="width: ${pct}%; background-color: ${s.color}"></div>
      </div>
    </div>`;
  }).join('');
}

// ── DETAILED DRILL-DOWN ANALYTICS MODAL CONTROLLER ────────
function openDetailedAnalyticsModal(key) {
  const db = getDB();
  const modal = document.getElementById('modal-detailed-analytics');
  if (!modal) return;

  const isBlockFarm = key.startsWith('Block Farm');
  const typeBadge = document.getElementById('detail-analytics-type-badge');
  const statusBadge = document.getElementById('detail-analytics-status-badge');
  const titleEl = document.getElementById('detail-analytics-title');
  const subtitleEl = document.getElementById('detail-analytics-subtitle');

  const totalCostEl = document.getElementById('detail-kpi-total-cost');
  const costHaEl = document.getElementById('detail-kpi-cost-ha');
  const benchmarkEl = document.getElementById('detail-kpi-benchmark');
  const haEl = document.getElementById('detail-kpi-ha');
  const plotsCountEl = document.getElementById('detail-kpi-plots-count');
  const ratingEl = document.getElementById('detail-kpi-rating');
  const breakdownBarsEl = document.getElementById('detail-expense-breakdown-bars');
  const stageBarsEl = document.getElementById('detail-crop-stage-bars');
  const tableBodyEl = document.getElementById('detail-activities-table-body');

  let entityTitle = '';
  let entitySub = '';
  let totalHa = 0;
  let costPerHa = 12400;
  let totalCost = 0;
  let ratingText = 'Optimal';
  let badgeColorClass = 'bg-success-bg text-success';
  let associatedFields = [];
  let associatedLogs = [];

  const districtBenchmark = getDistrictBenchmarkCostPerHa();

  if (isBlockFarm) {
    if (typeBadge) { typeBadge.textContent = 'Block Farm'; typeBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-black bg-primary-bg text-primary uppercase tracking-wider'; }
    associatedFields = db.fields.filter(f => f.blockFarm === key);
    
    if (key === 'Block Farm A') {
      entityTitle = 'Block Farm A (Silay Sugar Cooperative)';
      entitySub = 'Supervised by Jose Reyes · 34.5 Ha active';
      totalHa = 34.5;
      costPerHa = 12400;
      totalCost = 427800;
      ratingText = 'Optimal';
      badgeColorClass = 'bg-success-bg text-success';
    } else if (key === 'Block Farm B') {
      entityTitle = 'Block Farm B (Victorias District)';
      entitySub = 'Supervised by Maria Santos · 28.0 Ha active';
      totalHa = 28.0;
      costPerHa = 14200;
      totalCost = 397600;
      ratingText = 'Higher Overhead (+18.3%)';
      badgeColorClass = 'bg-warning-bg text-[#C97A00]';
    } else if (key === 'Block Farm C') {
      entityTitle = 'Block Farm C (Talisay Agrarian Zone)';
      entitySub = 'Supervised by Elena Batongbakal · 45.2 Ha active';
      totalHa = 45.2;
      costPerHa = 9800;
      totalCost = 442960;
      ratingText = 'Efficiency Leader (-18.3%)';
      badgeColorClass = 'bg-success-bg text-success';
    } else {
      entityTitle = 'Block Farm D (Bago Cooperative Cluster)';
      entitySub = 'Supervised by Ricardo Dalisay · 22.0 Ha active';
      totalHa = 22.0;
      costPerHa = 11500;
      totalCost = 253000;
      ratingText = 'Optimal (-4.1%)';
      badgeColorClass = 'bg-success-bg text-success';
    }

    const fieldIds = associatedFields.map(f => f.id);
    associatedLogs = db.logs.filter(l => fieldIds.includes(l.fieldId));
  } else {
    // Single Field Plot
    if (typeBadge) { typeBadge.textContent = 'Field Plot'; typeBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-black bg-[#1A6B9A]/15 text-[#1A6B9A] uppercase tracking-wider'; }
    const field = db.fields.find(f => f.id === key) || db.fields[0];
    associatedFields = [field];
    totalHa = field.ha || 1.5;
    entityTitle = `${field.id} — ${field.member || field.owner}`;
    entitySub = `${field.blockFarm || 'Block Farm A'} · Cultivated Area: ${totalHa} Ha · Stage: ${field.stage}`;
    
    if (field.id === 'FLD-KTR-001') {
      costPerHa = 12400;
      totalCost = Math.round(costPerHa * totalHa);
      ratingText = 'Optimal';
      badgeColorClass = 'bg-success-bg text-success';
    } else {
      costPerHa = 11200;
      totalCost = Math.round(costPerHa * totalHa);
      ratingText = 'Highly Efficient';
      badgeColorClass = 'bg-success-bg text-success';
    }

    associatedLogs = db.logs.filter(l => l.fieldId === field.id);
  }

  if (titleEl) titleEl.textContent = entityTitle;
  if (subtitleEl) subtitleEl.textContent = entitySub;
  if (statusBadge) { statusBadge.textContent = ratingText; statusBadge.className = `px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeColorClass}`; }

  if (totalCostEl) totalCostEl.textContent = `₱${(totalCost / 1000).toFixed(1)}k`;
  if (costHaEl) costHaEl.textContent = `₱${costPerHa.toLocaleString()}`;
  if (benchmarkEl) {
    const diff = Math.round(((costPerHa - districtBenchmark) / districtBenchmark) * 100);
    benchmarkEl.textContent = diff === 0 
      ? `Exact District Avg (₱${(districtBenchmark / 1000).toFixed(1)}k/Ha)` 
      : (diff > 0 ? `+${diff}% vs District Avg (₱${(districtBenchmark / 1000).toFixed(1)}k)` : `${diff}% below District Avg (₱${(districtBenchmark / 1000).toFixed(1)}k)`);
    benchmarkEl.className = diff > 10 ? 'text-[10px] text-danger font-semibold' : 'text-[10px] text-success font-semibold';
  }
  if (haEl) haEl.textContent = `${totalHa.toFixed(1)} Ha`;
  if (plotsCountEl) plotsCountEl.textContent = `${associatedFields.length} Registered Plot${associatedFields.length > 1 ? 's' : ''}`;
  if (ratingEl) ratingEl.textContent = `${Math.min(100, Math.round(100 - ((costPerHa - 9800) / 50)))}%`;

  // Expense Breakdown calculations
  const breakdownItems = [
    { label: 'Land Preparation & Tillage', pct: 38, color: '#8F3A8F', amount: totalCost * 0.38 },
    { label: 'Fertilizers (Complete 14-14-14 & Urea)', pct: 32, color: '#1A6B9A', amount: totalCost * 0.32 },
    { label: 'Labor Wages (Weeding & Care)', pct: 18, color: '#4A7C2F', amount: totalCost * 0.18 },
    { label: 'Chemical Spraying & Crop Protection', pct: 8, color: '#F5A623', amount: totalCost * 0.08 },
    { label: 'Transport, Hauling & Machinery', pct: 4, color: '#8A9B7A', amount: totalCost * 0.04 },
  ];

  if (breakdownBarsEl) {
    breakdownBarsEl.innerHTML = breakdownItems.map(b => `
      <div class="flex flex-col gap-1">
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background-color: ${b.color}"></span>
            <span class="font-bold text-hug-text">${b.label}</span>
          </div>
          <span class="font-extrabold text-hug-text">₱${Math.round(b.amount).toLocaleString()} <span class="text-[10px] text-hug-muted font-normal">(${b.pct}%)</span></span>
        </div>
        <div class="w-full h-2 bg-border rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500" style="width: ${b.pct}%; background-color: ${b.color}"></div>
        </div>
      </div>
    `).join('');
  }

  // Crop Stage Progression
  const stageAllocation = isBlockFarm ? [
    { name: 'Fertilization (1 & 2)', ha: (totalHa * 0.38).toFixed(1), color: '#1A6B9A' },
    { name: 'Planting (Patdan)', ha: (totalHa * 0.32).toFixed(1), color: '#4A7C2F' },
    { name: 'Land Preparation', ha: (totalHa * 0.20).toFixed(1), color: '#8F3A8F' },
    { name: 'Weeding & Care', ha: (totalHa * 0.10).toFixed(1), color: '#F5A623' },
  ] : [
    { name: associatedFields[0]?.stage || 'Fertilization Stage 2', ha: totalHa.toFixed(1), color: '#1A6B9A' }
  ];

  if (stageBarsEl) {
    stageBarsEl.innerHTML = stageAllocation.map(s => {
      const sPct = Math.round((parseFloat(s.ha) / totalHa) * 100);
      return `
        <div class="flex items-center justify-between p-2 bg-white rounded-lg border border-border text-xs">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full" style="background-color: ${s.color}"></span>
            <span class="font-bold text-hug-text">${s.name}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-black text-primary">${s.ha} Ha</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bg text-hug-muted border border-border">${sPct}%</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Recent Logs Table
  if (tableBodyEl) {
    if (associatedLogs.length === 0) {
      tableBodyEl.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-hug-muted italic text-xs">No recent field logs for this selection.</td></tr>`;
    } else {
      tableBodyEl.innerHTML = associatedLogs.slice(0, 5).map(l => `
        <tr class="hover:bg-bg border-b border-border/50 transition-colors">
          <td class="px-3 py-2 font-mono font-bold text-primary">${l.id}</td>
          <td class="px-3 py-2 font-semibold text-hug-text">${l.activity || l.task}</td>
          <td class="px-3 py-2 font-bold text-hug-text">₱${l.cost.toLocaleString()}</td>
          <td class="px-3 py-2 text-hug-muted font-mono text-[11px]">${l.date}</td>
          <td class="px-3 py-2">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success">
              Recorded
            </span>
          </td>
        </tr>
      `).join('');
    }
  }

  modal.classList.remove('hidden');
}

function closeDetailedAnalyticsModal() {
  const modal = document.getElementById('modal-detailed-analytics');
  if (modal) modal.classList.add('hidden');
}

// ── CROP STAGE DEEP-DIVE MODAL CONTROLLER ────────
function openCropStageModal(stageName) {
  const db = getDB();
  const modal = document.getElementById('modal-crop-stage-detail');
  if (!modal) return;

  const phaseBadgeEl = document.getElementById('stage-modal-phase-badge');
  const titleEl = document.getElementById('stage-modal-title');
  const subtitleEl = document.getElementById('stage-modal-subtitle');
  const haEl = document.getElementById('stage-modal-ha');
  const shareEl = document.getElementById('stage-modal-share');
  const daysEl = document.getElementById('stage-modal-days');
  const guidelinesEl = document.getElementById('stage-modal-guidelines');
  const plotsListEl = document.getElementById('stage-modal-plots-list');

  const STAGE_META = {
    'Land Preparation': {
      phase: 'Stage 1',
      color: '#8F3A8F',
      ha: 28.5,
      share: '22%',
      days: '0 - 15 Days',
      guidelines: 'Deep subsoil ripping followed by 2 disc plowing passes and 1 rotavator pass. Create furrow depth of 25-30 cm. Apply agricultural lime if soil pH is below 5.5.',
      plots: [
        { id: 'FLD-KTR-003', blockFarm: 'Block Farm B', member: 'Maria Santos', ha: '2.0 Ha', lastSync: '2 hrs ago' },
        { id: 'FLD-KTR-009', blockFarm: 'Block Farm D', member: 'Ana Gomez', ha: '0.8 Ha', lastSync: '1 hr ago' },
        { id: 'FLD-KTR-011', blockFarm: 'Block Farm A', member: 'Silay Pool Plot', ha: '25.7 Ha', lastSync: '15 mins ago' }
      ]
    },
    'Planting (Patdan)': {
      phase: 'Stage 2',
      color: '#4A7C2F',
      ha: 34.0,
      share: '26%',
      days: '15 - 30 Days',
      guidelines: 'Plant high-yielding cane setts (Phil 84-77, VMC 84-524) at 30,000 to 35,000 canepoints/Ha. Soak canepoints in fungicide solution for 15 mins prior to planting.',
      plots: [
        { id: 'FLD-KTR-002', blockFarm: 'Block Farm A', member: 'Jose Rizal', ha: '2.1 Ha', lastSync: '4 days ago' },
        { id: 'FLD-KTR-005', blockFarm: 'Block Farm A', member: 'Roberto Tan', ha: '1.8 Ha', lastSync: '8 days ago' },
        { id: 'FLD-KTR-012', blockFarm: 'Block Farm C', member: 'Talisay Farm Pool', ha: '30.1 Ha', lastSync: '3 hrs ago' }
      ]
    },
    'Fertilization (1 & 2)': {
      phase: 'Stage 3',
      color: '#1A6B9A',
      ha: 42.2,
      share: '33%',
      days: '45 - 90 Days',
      guidelines: 'Apply first dose: 4 bags Urea (46-0-0) + 2 bags Complete (14-14-14) per Ha at 45 days. Second dose: 3 bags Urea at 90 days. Ensure optimal soil moisture.',
      plots: [
        { id: 'FLD-KTR-001', blockFarm: 'Block Farm A', member: 'Juan dela Cruz', ha: '1.5 Ha', lastSync: '15 mins ago' },
        { id: 'FLD-KTR-010', blockFarm: 'Block Farm D', member: 'Apolinario Mabini', ha: '1.2 Ha', lastSync: '6 hrs ago' },
        { id: 'FLD-KTR-013', blockFarm: 'Block Farm B', member: 'Victorias Cluster', ha: '39.5 Ha', lastSync: '1 hr ago' }
      ]
    },
    'Weeding & Care': {
      phase: 'Stage 4',
      color: '#F5A623',
      ha: 15.0,
      share: '12%',
      days: '90 - 180 Days',
      guidelines: 'Conduct off-barring followed by manual hilamon (inter-row weeding). Maintain clean drainage furrows to prevent waterlogging during monsoon showers.',
      plots: [
        { id: 'FLD-KTR-006', blockFarm: 'Block Farm A', member: 'Antonio Luna', ha: '1.2 Ha', lastSync: '2 hrs ago' },
        { id: 'FLD-KTR-004', blockFarm: 'Block Farm B', member: 'Emilio Aguinaldo', ha: '1.8 Ha', lastSync: '3 hrs ago' },
        { id: 'FLD-KTR-014', blockFarm: 'Block Farm C', member: 'Negros North Zone', ha: '12.0 Ha', lastSync: '4 hrs ago' }
      ]
    },
    'Harvesting & Milling': {
      phase: 'Stage 5',
      color: '#D9534F',
      ha: 10.0,
      share: '8%',
      days: '10 - 12 Months',
      guidelines: 'Cut cane flush at ground level to maximize sucrose content and ensure vigorous ratoon sprouting. Transport cane to HPCo Silay within 24 hours of harvest.',
      plots: [
        { id: 'FLD-KTR-007', blockFarm: 'Block Farm C', member: 'Pedro Reyes', ha: '1.0 Ha', lastSync: '4 days ago' },
        { id: 'FLD-KTR-008', blockFarm: 'Block Farm C', member: 'Andres Bonifacio', ha: '3.0 Ha', lastSync: '5 hrs ago' },
        { id: 'FLD-KTR-015', blockFarm: 'Block Farm D', member: 'Bago Harvest Cluster', ha: '6.0 Ha', lastSync: '2 hrs ago' }
      ]
    }
  };

  const meta = STAGE_META[stageName] || STAGE_META['Fertilization (1 & 2)'];

  if (phaseBadgeEl) phaseBadgeEl.textContent = meta.phase;
  if (titleEl) titleEl.textContent = stageName;
  if (subtitleEl) subtitleEl.textContent = `${meta.ha} Ha active across regional block farms`;
  if (haEl) haEl.textContent = `${meta.ha} Ha`;
  if (shareEl) shareEl.textContent = meta.share;
  if (daysEl) daysEl.textContent = meta.days;
  if (guidelinesEl) guidelinesEl.textContent = meta.guidelines;

  if (plotsListEl) {
    plotsListEl.innerHTML = meta.plots.map(p => `
      <div class="flex items-center justify-between p-3 bg-bg rounded-xl border border-border hover:border-primary transition-all">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary-bg text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
            ${p.id.slice(-2)}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-xs text-primary">${p.id}</span>
              <span class="text-xs font-bold text-hug-text">${p.member}</span>
            </div>
            <span class="text-[11px] text-hug-muted">${p.blockFarm} · Last Sync: ${p.lastSync}</span>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-black text-primary block">${p.ha}</span>
          <span class="text-[10px] text-success font-semibold">Active</span>
        </div>
      </div>
    `).join('');
  }

  modal.classList.remove('hidden');
}

function closeCropStageModal() {
  const modal = document.getElementById('modal-crop-stage-detail');
  if (modal) modal.classList.add('hidden');
}

// ── FARM MANAGER WORKSPACE & TAKE OVER CONTROLLER ────────
let expandedFieldId = null;
let activeTakeOverFieldId = null;
let activeTakeOverStages = [];

const SRA_STANDARD_STAGES = [
  { id: 'S1', label: 'Land Preparation', color: '#8F3A8F', done: true, active: false },
  { id: 'S2', label: 'Planting (Patdan)', color: '#4A7C2F', done: false, active: true },
  { id: 'S3', label: 'Pre-emergence Spraying', color: '#1A6B9A', done: false, active: false },
  { id: 'S4', label: 'Weeding (Hilamon)', color: '#F5A623', done: false, active: false },
  { id: 'S5', label: 'Fertilization Stage 1', color: '#1A6B9A', done: false, active: false },
  { id: 'S6', label: 'Fertilization Stage 2', color: '#4A7C2F', done: false, active: false },
  { id: 'S7', label: 'Off-barring & Hilling-up', color: '#5B4DA7', done: false, active: false },
  { id: 'S8', label: 'Harvesting & Milling', color: '#D9534F', done: false, active: false },
];

function toggleFieldLogs(fieldId) {
  expandedFieldId = expandedFieldId === fieldId ? null : fieldId;
  renderOperations();
}

function getSyncInactivityThresholdHours() {
  return parseInt(localStorage.getItem('hugpong_sync_threshold_hours') || '48', 10);
}

function setSyncInactivityThresholdHours(hours) {
  localStorage.setItem('hugpong_sync_threshold_hours', hours);
  toast(`Inactivity alert threshold set to ${hours} hours.`);
  renderSync();
  renderManagerFullSyncTelemetry();
}

function getSyncHealthInfo(lastSyncStr, syncLagDays) {
  const thresholdHours = getSyncInactivityThresholdHours();
  const warningDaysThreshold = Math.max(1, Math.round(thresholdHours / 24));
  const criticalDaysThreshold = Math.max(warningDaysThreshold + 1, warningDaysThreshold * 2);

  const days = syncLagDays !== undefined ? syncLagDays : (
    lastSyncStr.includes('8 days') ? 8 : (
      lastSyncStr.includes('4 days') ? 4 : (
        lastSyncStr.includes('days') ? parseInt(lastSyncStr, 10) || 3 : 0
      )
    )
  );

  if (days >= criticalDaysThreshold) {
    return {
      status: 'critical',
      days: days,
      label: `Critical: ${days}d Offline`,
      shortLabel: `${days}d Offline`,
      badgeClass: 'bg-danger-bg text-danger border-danger/30',
      pillClass: 'bg-danger text-white',
      dotClass: 'bg-danger animate-pulse',
      warn: true,
      severity: 'High'
    };
  } else if (days >= warningDaysThreshold) {
    return {
      status: 'warning',
      days: days,
      label: `Warning: ${days}d Lag`,
      shortLabel: `${days}d Lag`,
      badgeClass: 'bg-warning-bg text-[#C97A00] border-warning/30',
      pillClass: 'bg-accent text-hug-text',
      dotClass: 'bg-[#C97A00]',
      warn: true,
      severity: 'Moderate'
    };
  } else {
    return {
      status: 'healthy',
      days: 0,
      label: `Active (${lastSyncStr || 'Synced'})`,
      shortLabel: lastSyncStr || 'Active',
      badgeClass: 'bg-success-bg text-success border-success/30',
      pillClass: 'bg-success text-white',
      dotClass: 'bg-success',
      warn: false,
      severity: 'Normal'
    };
  }
}

function renderManager() {
  const db = getDB();
  const managerBlockFarm = 'Block Farm A';
  const managerName = 'Jose Reyes';

  // Update banner labels
  const bannerName = document.getElementById('mgr-banner-name');
  const bannerFarm = document.getElementById('mgr-banner-blockfarm');
  if (bannerName) bannerName.textContent = managerName;
  if (bannerFarm) bannerFarm.textContent = managerBlockFarm;

  // Filter fields & logs for manager's farm
  const myFields = db.fields.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === managerBlockFarm);
  const myFieldIds = new Set(myFields.map(f => f.id));
  const myLogs = db.logs.filter(l => myFieldIds.has(l.fieldId));
  const pendingLogs = myLogs.filter(l => l.status === 'Pending');
  const approvedLogs = myLogs.filter(l => l.status === 'Approved');
  const totalHa = myFields.reduce((s, f) => s + (Number(f.ha || f.area) || 0), 0);
  const totalApprovedCost = approvedLogs.reduce((s, l) => s + (Number(l.cost) || 0), 0);

  // SRA Price Benchmark for Manager (Dual: Raw Sugar & Molasses)
  const currentPrice = Number(db.priceHistory[0]?.price) || 2950;
  const prevPrice = Number(db.priceHistory[1]?.price) || 2880;
  const change = db.priceHistory[0]?.change !== undefined ? Number(db.priceHistory[0].change) : (currentPrice - prevPrice);

  const currentMol = Number(db.priceHistory[0]?.molasses) || 4400;
  const prevMol = Number(db.priceHistory[1]?.molasses) || 4300;
  const molChange = db.priceHistory[0]?.molassesChange !== undefined ? Number(db.priceHistory[0].molassesChange) : (currentMol - prevMol);

  const mgrPriceEl = document.getElementById('mgr-dashboard-sugar-price');
  const mgrMolPriceEl = document.getElementById('mgr-dashboard-molasses-price');
  const mgrChangeEl = document.getElementById('mgr-dashboard-sugar-change');
  const mgrMolChangeEl = document.getElementById('mgr-dashboard-molasses-change');

  if (mgrPriceEl) mgrPriceEl.innerHTML = `₱${currentPrice.toLocaleString()} <span class="text-xs font-semibold text-hug-muted font-normal">/ Lkg</span>`;
  if (mgrMolPriceEl) mgrMolPriceEl.innerHTML = `₱${currentMol.toLocaleString()} <span class="text-xs font-semibold text-hug-muted font-normal">/ MT</span>`;

  if (mgrChangeEl) {
    if (change > 0) {
      mgrChangeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success';
      mgrChangeEl.textContent = `▲ +₱${change.toLocaleString()} / Lkg`;
    } else if (change < 0) {
      mgrChangeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger-bg text-danger';
      mgrChangeEl.textContent = `▼ -₱${Math.abs(change).toLocaleString()} / Lkg`;
    } else {
      mgrChangeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-bg text-hug-muted';
      mgrChangeEl.textContent = `Steady (₱0)`;
    }
  }

  if (mgrMolChangeEl) {
    if (molChange > 0) {
      mgrMolChangeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success';
      mgrMolChangeEl.textContent = `▲ +₱${molChange.toLocaleString()} / MT`;
    } else if (molChange < 0) {
      mgrMolChangeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger-bg text-danger';
      mgrMolChangeEl.textContent = `▼ -₱${Math.abs(molChange).toLocaleString()} / MT`;
    } else {
      mgrMolChangeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-bg text-hug-muted';
      mgrMolChangeEl.textContent = `Steady (₱0)`;
    }
  }

  // Stats row
  const statFields = document.getElementById('mgr-stat-fields');
  const statHa = document.getElementById('mgr-stat-ha');
  const statPendingVal = document.getElementById('mgr-stat-pending-val');
  const statPendingBadge = document.getElementById('mgr-stat-pending-badge');
  const statPendingSub = document.getElementById('mgr-stat-pending-sub');
  const pendingBadge = document.getElementById('mgr-pending-badge');

  const totalCost = myLogs.reduce((s, l) => s + (Number(l.cost) || 0), 0);

  if (statFields) statFields.textContent = myFields.length.toString();
  if (statHa) statHa.textContent = `${totalHa.toFixed(1)} Ha`;
  if (statPendingVal) statPendingVal.textContent = `${myLogs.length} Active`;
  if (statPendingBadge) {
    statPendingBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success';
    statPendingBadge.textContent = 'All Recorded';
  }
  if (statPendingSub) {
    statPendingSub.textContent = `₱${(totalCost / 1000).toFixed(1)}k recorded`;
  }
  if (pendingBadge) pendingBadge.textContent = `${myLogs.length} Recorded`;

  // Render Sync Telemetry & Health Monitor
  renderSyncMonitor();

  // Render Recent Operations Ledger
  const pendingTbody = document.getElementById('mgr-pending-tbody');
  if (pendingTbody) {
    if (myLogs.length === 0) {
      pendingTbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-xs text-hug-muted">No operational records submitted for ${managerBlockFarm} yet.</td></tr>`;
    } else {
      pendingTbody.innerHTML = myLogs.map(l => {
        const field = myFields.find(f => f.id === l.fieldId);
        const memberName = field ? (field.member || field.owner) : 'Assigned Member';
        const taskName = l.task || l.activity || 'Field Operation';
        const costVal = (l.cost || 0).toLocaleString();
        const inputDisplay = l.inputQty ? `${l.inputQty} ${l.inputUnit || ''} ${l.inputName ? `· ${l.inputName}` : ''}` : '<span class="text-hug-muted italic">Standard Labor</span>';

        return `<tr class="border-b border-border hover:bg-bg transition-all">
          <td class="px-4 py-3 font-bold text-xs text-hug-text font-mono">${l.id}</td>
          <td class="px-4 py-3 font-semibold text-xs text-farm-blue font-mono">${l.fieldId}</td>
          <td class="px-4 py-3 text-xs text-hug-text2 font-semibold">${memberName}</td>
          <td class="px-4 py-3 text-xs text-hug-text font-medium">${taskName}</td>
          <td class="px-4 py-3 text-xs text-hug-text2">${inputDisplay}</td>
          <td class="px-4 py-3 text-xs font-bold text-hug-text">Php ${costVal}</td>
          <td class="px-4 py-3 text-xs text-hug-muted">${l.date}</td>
          <td class="px-4 py-3">
            <button onclick="viewFieldOperationsFromLedger('${l.fieldId}')" class="px-2.5 py-1 bg-white border border-border text-hug-text2 hover:border-primary hover:text-primary text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-xs" title="Open Field Operations & History">
              View Plot →
            </button>
          </td>
        </tr>`;
      }).join('');
    }
  }

  // Render Charts for Manager (Price Trajectory, Cost Efficiency, Crop Stages)
  renderPriceHistoryChart();
  renderCostEfficiencyChart();
  renderCropStageDistribution();

  // Pre-render other manager sections if loaded
  renderMembers();
  renderOperations();
}

function renderSyncMonitor() {
  const db = getDB();
  const managerBlockFarm = 'Block Farm A';
  const myFields = db.fields.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === managerBlockFarm);
  
  const pillsContainer = document.getElementById('mgr-sync-summary-pills');
  const bannerContainer = document.getElementById('mgr-sync-warning-banner');
  const gridContainer = document.getElementById('mgr-sync-telemetry-grid');

  let activeSyncedCount = 0;
  let warningCount = 0;
  let criticalCount = 0;
  const overdueMembers = [];
  const attentionFields = [];

  myFields.forEach(f => {
    const memberName = f.member || f.owner || 'Unassigned';
    const userObj = db.users.find(u => u.name.toLowerCase() === memberName.toLowerCase()) || {};
    const contact = userObj.contact || '0917-xxx-xxxx';
    const health = getSyncHealthInfo(f.lastSync || 'Just now', f.syncLagDays);

    if (health.status === 'healthy') {
      activeSyncedCount++;
    } else {
      if (health.status === 'warning') warningCount++;
      if (health.status === 'critical') criticalCount++;
      overdueMembers.push({ name: memberName, fieldId: f.id, contact: contact, lagDays: health.days, stage: f.stage });
      attentionFields.push(f);
    }
  });

  if (pillsContainer) {
    pillsContainer.innerHTML = `
      <span class="px-2.5 py-1 rounded-full font-bold bg-success-bg text-success border border-success/20">${activeSyncedCount} Active Synced</span>
      ${warningCount > 0 ? `<span class="px-2.5 py-1 rounded-full font-bold bg-warning-bg text-[#C97A00] border border-warning/20">${warningCount} Warning Lag</span>` : ''}
      ${criticalCount > 0 ? `<span class="px-2.5 py-1 rounded-full font-bold bg-danger-bg text-danger border border-danger/20">${criticalCount} Critical Offline</span>` : ''}
    `;
  }

  if (bannerContainer) {
    const totalAlerts = warningCount + criticalCount;
    if (totalAlerts > 0) {
      const topOffender = overdueMembers[0];
      bannerContainer.classList.remove('hidden');
      bannerContainer.className = criticalCount > 0
        ? 'rounded-xl p-4 border border-danger/30 bg-danger-bg/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'
        : 'rounded-xl p-4 border border-warning/30 bg-warning-bg/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3';

      bannerContainer.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl ${criticalCount > 0 ? 'bg-danger text-white' : 'bg-accent text-hug-text'} flex items-center justify-center flex-shrink-0 font-bold">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div>
            <h4 class="text-xs font-bold text-hug-text">Sync Overdue Action Required: ${totalAlerts} Member(s) in Block Farm A Inactive</h4>
            <p class="text-[11px] text-hug-muted mt-0.5">${topOffender.name} (${topOffender.fieldId}) has not synced in ${topOffender.lagDays} days. Check with member to ensure timely audit submission.</p>
          </div>
        </div>
        <div class="flex gap-2 flex-shrink-0">
          <button onclick="openContactMemberModal('${topOffender.name}', '${topOffender.contact}', '${topOffender.fieldId}', '${topOffender.stage}', '${topOffender.lagDays} days ago', ${topOffender.lagDays})" class="px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-light transition-all cursor-pointer shadow-xs">
            Follow up with ${topOffender.name.split(' ')[0]}
          </button>
        </div>
      `;
    } else {
      bannerContainer.classList.add('hidden');
    }
  }

  if (gridContainer) {
    if (attentionFields.length === 0) {
      gridContainer.innerHTML = `
        <div class="col-span-full p-6 text-center bg-white border border-border rounded-2xl flex flex-col items-center justify-center gap-2 shadow-xs">
          <div class="w-10 h-10 rounded-full bg-success-bg text-success flex items-center justify-center font-bold text-lg">✓</div>
          <h4 class="font-bold text-xs text-hug-text">All Block Farm A Members Active &amp; Synced</h4>
          <p class="text-xs text-hug-muted">No overdue mobile offline buffers or lagging members requiring immediate follow-up.</p>
          <button onclick="navigate('synctelemetry')" class="mt-1 text-xs font-bold text-primary hover:underline cursor-pointer">Open Full Telemetry Hub →</button>
        </div>
      `;
    } else {
      gridContainer.innerHTML = attentionFields.map(f => {
        const memberName = f.member || f.owner || 'Unassigned';
        const userObj = db.users.find(u => u.name.toLowerCase() === memberName.toLowerCase()) || {};
        const contact = userObj.contact || '0917-xxx-xxxx';
        const health = getSyncHealthInfo(f.lastSync || 'Just now', f.syncLagDays);
        const initial = memberName.charAt(0);
        const borderHighlight = health.status === 'critical' ? 'border-danger/40 bg-danger-bg/20' : 'border-[#C97A00]/40 bg-warning-bg/20';

        return `<div class="p-4 rounded-xl border ${borderHighlight} flex flex-col justify-between gap-3 hover:shadow-xs transition-all">
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center font-bold text-xs text-primary flex-shrink-0">
                ${initial}
              </div>
              <div class="min-w-0">
                <p class="text-xs font-bold text-hug-text truncate">${memberName}</p>
                <p class="text-[11px] text-farm-blue font-mono font-bold">${f.id} <span class="text-hug-muted font-normal font-sans">(${f.ha || f.area} Ha)</span></p>
              </div>
            </div>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${health.badgeClass}">
              <span class="w-1.5 h-1.5 rounded-full ${health.dotClass}"></span>
              ${health.shortLabel}
            </span>
          </div>

          <div class="text-[11px] text-hug-muted flex items-center justify-between pt-2 border-t border-border/60">
            <span>Stage: <strong class="text-hug-text2 font-semibold">${f.stage || 'In Progress'}</strong></span>
            <span>${f.lastSync || 'Recently'}</span>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-1">
            <button onclick="openContactMemberModal('${memberName}', '${contact}', '${f.id}', '${f.stage || 'Planting'}', '${f.lastSync || 'Recently'}', ${health.days})" class="px-2.5 py-1.5 bg-white border border-border text-hug-text2 text-[11px] font-bold rounded-lg hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-1 cursor-pointer">
              <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Contact
            </button>
            <button onclick="openTakeOverModal('${f.id}')" class="px-2.5 py-1.5 bg-accent text-hug-text text-[11px] font-bold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-1 cursor-pointer">
              <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              Take Over
            </button>
          </div>
        </div>`;
      }).join('');
    }
  }
}

function renderManagerFullSyncTelemetry() {
  const db = getDB();
  const managerBlockFarm = 'Block Farm A';
  let myFields = db.fields.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === managerBlockFarm);

  const searchInput = document.getElementById('mgr-full-sync-search');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  if (query) {
    myFields = myFields.filter(f =>
      f.id.toLowerCase().includes(query) ||
      (f.member || f.owner || '').toLowerCase().includes(query) ||
      (f.stage || '').toLowerCase().includes(query)
    );
  }

  let activeCount = 0;
  let warningCount = 0;
  let criticalCount = 0;

  myFields.forEach(f => {
    const health = getSyncHealthInfo(f.lastSync || 'Just now', f.syncLagDays);
    if (health.status === 'healthy') activeCount++;
    else if (health.status === 'warning') warningCount++;
    else if (health.status === 'critical') criticalCount++;
  });

  const activeEl = document.getElementById('mgr-full-sync-active-count');
  const warningEl = document.getElementById('mgr-full-sync-warning-count');
  const criticalEl = document.getElementById('mgr-full-sync-critical-count');
  if (activeEl) activeEl.textContent = `${activeCount} Members`;
  if (warningEl) warningEl.textContent = `${warningCount} Members`;
  if (criticalEl) criticalEl.textContent = `${criticalCount} Members`;

  const gridContainer = document.getElementById('mgr-full-sync-cards-grid');
  if (!gridContainer) return;

  if (myFields.length === 0) {
    gridContainer.innerHTML = `<div class="col-span-full py-10 text-center text-xs text-hug-muted border border-dashed border-border rounded-2xl">No members matched your search query.</div>`;
    return;
  }

  gridContainer.innerHTML = myFields.map(f => {
    const memberName = f.member || f.owner || 'Unassigned';
    const userObj = db.users.find(u => u.name.toLowerCase() === memberName.toLowerCase()) || {};
    const contact = userObj.contact || '0917-xxx-xxxx';
    const health = getSyncHealthInfo(f.lastSync || 'Just now', f.syncLagDays);
    const initial = memberName.charAt(0);
    const borderHighlight = health.status === 'critical' ? 'border-danger/40 bg-danger-bg/20' : (health.status === 'warning' ? 'border-[#C97A00]/40 bg-warning-bg/20' : 'border-border bg-white');

    return `<div class="p-5 rounded-2xl border ${borderHighlight} flex flex-col justify-between gap-3 shadow-xs hover:shadow-md transition-all">
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-full bg-primary-bg text-primary border border-primary/20 flex items-center justify-center font-bold text-xs flex-shrink-0">
            ${initial}
          </div>
          <div class="min-w-0">
            <p class="text-xs font-bold text-hug-text truncate">${memberName}</p>
            <p class="text-[11px] text-farm-blue font-mono font-bold">${f.id} <span class="text-hug-muted font-normal font-sans">(${f.ha || f.area} Ha)</span></p>
          </div>
        </div>
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${health.badgeClass}">
          <span class="w-1.5 h-1.5 rounded-full ${health.dotClass}"></span>
          ${health.shortLabel}
        </span>
      </div>

      <div class="text-xs text-hug-muted flex items-center justify-between pt-2 border-t border-border/60">
        <span>Stage: <strong class="text-hug-text2 font-semibold">${f.stage || 'In Progress'}</strong></span>
        <span>Last Sync: <strong class="text-hug-text font-semibold">${f.lastSync || 'Recently'}</strong></span>
      </div>

      <div class="grid grid-cols-2 gap-2 pt-1">
        <button onclick="openContactMemberModal('${memberName}', '${contact}', '${f.id}', '${f.stage || 'Planting'}', '${f.lastSync || 'Recently'}', ${health.days})" class="px-3 py-1.5 bg-white border border-border text-hug-text2 text-xs font-bold rounded-xl hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          Contact Member
        </button>
        <button onclick="openTakeOverModal('${f.id}')" class="px-3 py-1.5 bg-accent text-hug-text text-xs font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          Take Over
        </button>
      </div>
    </div>`;
  }).join('');
}

// ── MEMBERS & OPERATIONS FILTER STATE ───────────────────
let memberFilterStatus = 'all';
let memberSortHa = 'none';
let opFilterStatus = 'all';
let opSortHa = 'none';

function setMemberFilter(filter) {
  memberFilterStatus = filter;
  document.querySelectorAll('#mgr-member-filter-chips .member-filter-chip').forEach(c => {
    const isActive = c.getAttribute('data-filter') === filter;
    c.className = isActive
      ? 'member-filter-chip text-xs font-medium px-3.5 py-1.5 rounded-full border border-primary bg-primary text-white transition-all cursor-pointer'
      : 'member-filter-chip text-xs font-medium px-3.5 py-1.5 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer';
  });
  renderMembers();
}

function toggleMemberSortHa() {
  if (memberSortHa === 'none') memberSortHa = 'desc';
  else if (memberSortHa === 'desc') memberSortHa = 'asc';
  else memberSortHa = 'none';

  const btn = document.getElementById('mgr-member-sort-ha');
  if (btn) {
    btn.textContent = 'Sort Area: ' + (memberSortHa === 'none' ? 'Default' : (memberSortHa === 'asc' ? 'Ascending' : 'Descending'));
  }
  renderMembers();
}

function setOpFilter(filter) {
  opFilterStatus = filter;
  document.querySelectorAll('#mgr-op-filter-chips .op-filter-chip').forEach(c => {
    const isActive = c.getAttribute('data-filter') === filter;
    c.className = isActive
      ? 'op-filter-chip text-xs font-medium px-3.5 py-1.5 rounded-full border border-primary bg-primary text-white transition-all cursor-pointer'
      : 'op-filter-chip text-xs font-medium px-3.5 py-1.5 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer';
  });
  renderOperations();
}

function toggleOpSortHa() {
  if (opSortHa === 'none') opSortHa = 'desc';
  else if (opSortHa === 'desc') opSortHa = 'asc';
  else opSortHa = 'none';

  const btn = document.getElementById('mgr-op-sort-ha');
  if (btn) {
    btn.textContent = 'Sort Area: ' + (opSortHa === 'none' ? 'Default' : (opSortHa === 'asc' ? 'Ascending' : 'Descending'));
  }
  renderOperations();
}

function renderMembers() {
  const db = getDB();
  const managerBlockFarm = 'Block Farm A';
  const myFields = db.fields.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === managerBlockFarm);
  const membersTbody = document.getElementById('mgr-members-tbody');
  const membersCountBadge = document.getElementById('mgr-members-count-badge');
  
  // Group fields by member
  const memberMap = {};
  myFields.forEach(f => {
    const mName = f.member || f.owner || 'Unassigned';
    if (!memberMap[mName]) {
      const userObj = db.users.find(u => u.name.toLowerCase() === mName.toLowerCase()) || {};
      memberMap[mName] = {
        name: mName,
        contact: userObj.contact || '0917-555-0101',
        fields: [],
        totalHa: 0,
        stages: [],
        worstSyncDays: 0,
        latestSyncStr: f.lastSync || 'Recently'
      };
    }
    memberMap[mName].fields.push(f);
    memberMap[mName].totalHa += Number(f.ha || f.area) || 0;
    if (f.stage && !memberMap[mName].stages.includes(f.stage)) {
      memberMap[mName].stages.push(f.stage);
    }
    const days = f.syncLagDays || 0;
    if (days > memberMap[mName].worstSyncDays) {
      memberMap[mName].worstSyncDays = days;
      memberMap[mName].latestSyncStr = f.lastSync || `${days} days ago`;
    }
  });

  let memberList = Object.values(memberMap);

  // Search filtering
  const searchInput = document.getElementById('mgr-member-search');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  if (query) {
    memberList = memberList.filter(m => 
      m.name.toLowerCase().includes(query) ||
      m.contact.toLowerCase().includes(query) ||
      m.fields.some(f => f.id.toLowerCase().includes(query)) ||
      m.stages.some(s => s.toLowerCase().includes(query))
    );
  }

  // Filter chips
  if (memberFilterStatus === 'synced-active') {
    memberList = memberList.filter(m => m.worstSyncDays < 3);
  } else if (memberFilterStatus === 'sync-warning') {
    memberList = memberList.filter(m => m.worstSyncDays >= 3 && m.worstSyncDays < 7);
  } else if (memberFilterStatus === 'sync-critical') {
    memberList = memberList.filter(m => m.worstSyncDays >= 7);
  } else if (memberFilterStatus === 'multi-field') {
    memberList = memberList.filter(m => m.fields.length > 1);
  }

  // Sort by area
  if (memberSortHa === 'asc') {
    memberList.sort((a, b) => a.totalHa - b.totalHa);
  } else if (memberSortHa === 'desc') {
    memberList.sort((a, b) => b.totalHa - a.totalHa);
  }

  if (membersCountBadge) membersCountBadge.textContent = `${memberList.length} Member${memberList.length === 1 ? '' : 's'}`;

  if (membersTbody) {
    if (memberList.length === 0) {
      membersTbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-xs text-hug-muted">No members matched the search or filter criteria.</td></tr>`;
    } else {
      membersTbody.innerHTML = memberList.map(m => {
        const fieldBadges = m.fields.map(f => `
          <span class="inline-flex items-center gap-1 bg-primary-bg text-primary px-2.5 py-1 rounded-full text-xs font-bold border border-primary/20">
            <span>${f.id}</span>
            <span class="opacity-75 font-normal">(${f.ha || f.area} Ha)</span>
          </span>
        `).join(' ');

        const stageText = m.stages.join(', ') || 'In Progress';
        const primaryField = m.fields[0] || {};
        const health = getSyncHealthInfo(m.latestSyncStr, m.worstSyncDays);

        const syncBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${health.badgeClass}">
          <span class="w-1.5 h-1.5 rounded-full ${health.dotClass}"></span>
          ${health.label}
        </span>`;

        return `<tr class="border-b border-border hover:bg-bg transition-all">
          <td class="px-4 py-3 text-xs font-bold text-hug-text">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-primary-bg text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">${m.name.charAt(0)}</div>
              <div>
                <p class="font-bold text-hug-text">${m.name}</p>
                <p class="text-[10px] text-hug-muted font-normal">Block Farm A</p>
              </div>
            </div>
          </td>
          <td class="px-4 py-3 text-xs text-hug-muted font-mono font-medium">${m.contact}</td>
          <td class="px-4 py-3"><div class="flex flex-wrap gap-1.5">${fieldBadges}</div></td>
          <td class="px-4 py-3 text-xs font-bold text-hug-text">${m.totalHa.toFixed(1)} Ha</td>
          <td class="px-4 py-3 text-xs font-semibold text-farm-blue">${stageText}</td>
          <td class="px-4 py-3 text-xs">${syncBadge}</td>
          <td class="px-4 py-3 text-xs">
            <button onclick="openContactMemberModal('${m.name}', '${m.contact}', '${primaryField.id || ''}', '${stageText}', '${m.latestSyncStr}', ${m.worstSyncDays})" class="px-3 py-1.5 bg-white border border-border text-hug-text2 hover:border-primary hover:text-primary font-bold text-xs rounded-lg transition-all cursor-pointer shadow-xs">
              Contact
            </button>
          </td>
        </tr>`;
      }).join('');
    }
  }
}

function renderOperations() {
  const db = getDB();
  const managerBlockFarm = 'Block Farm A';
  let myFields = db.fields.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === managerBlockFarm);
  const fieldsTbody = document.getElementById('mgr-fields-tbody');
  if (!fieldsTbody) return;

  // Search filtering
  const searchInput = document.getElementById('mgr-op-search');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  if (query) {
    myFields = myFields.filter(f => 
      f.id.toLowerCase().includes(query) ||
      (f.member || f.owner || '').toLowerCase().includes(query) ||
      (f.stage || '').toLowerCase().includes(query)
    );
  }

  // Stage dropdown filter
  const stageFilterEl = document.getElementById('mgr-op-stage-filter');
  const selectedStage = stageFilterEl ? stageFilterEl.value : 'all';
  if (selectedStage !== 'all') {
    myFields = myFields.filter(f => (f.stage || '').toLowerCase().includes(selectedStage.toLowerCase()));
  }

  // Filter chips
  if (opFilterStatus === 'active') {
    myFields = myFields.filter(f => !f.stage?.toLowerCase().includes('harvest') && !f.stage?.toLowerCase().includes('complete'));
  } else if (opFilterStatus === 'harvest') {
    myFields = myFields.filter(f => f.stage?.toLowerCase().includes('harvest'));
  } else if (opFilterStatus === 'completed') {
    myFields = myFields.filter(f => f.stage?.toLowerCase().includes('complete'));
  }

  // Sort by Area
  if (opSortHa === 'asc') {
    myFields.sort((a, b) => (Number(a.ha || a.area) || 0) - (Number(b.ha || b.area) || 0));
  } else if (opSortHa === 'desc') {
    myFields.sort((a, b) => (Number(b.ha || b.area) || 0) - (Number(a.ha || a.area) || 0));
  }

  if (myFields.length === 0) {
    fieldsTbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-xs text-hug-muted">No fields matched the search or filter criteria.</td></tr>`;
    return;
  }

  const sraStages = ['Land Prep', 'Planting', 'Weeding', 'Fertilization 1', 'Fertilization 2', 'Off-barring', 'Maturation', 'Harvesting'];

  fieldsTbody.innerHTML = myFields.map(f => {
    const fieldLogs = db.logs.filter(l => l.fieldId === f.id);
    
    let currentStageIdx = sraStages.findIndex(s => (f.stage || '').toLowerCase().includes(s.toLowerCase()));
    if (currentStageIdx === -1) {
      currentStageIdx = (f.stage || '').toLowerCase().includes('complete') ? 7 : 3;
    }
    const stageNum = currentStageIdx + 1;
    const progressPct = Math.min(100, Math.round((stageNum / 8) * 100));
    const progressBadge = `
      <div class="flex flex-col gap-1 w-28">
        <div class="flex justify-between items-center text-[10px]">
          <span class="font-bold text-hug-text">Stage ${stageNum}/8</span>
          <span class="font-bold text-primary">${progressPct}%</span>
        </div>
        <div class="w-full bg-bg rounded-full h-1.5 overflow-hidden border border-border">
          <div class="bg-primary h-full rounded-full transition-all" style="width: ${progressPct}%"></div>
        </div>
      </div>
    `;

    const isExpanded = expandedFieldId === f.id;

    let logsDrawer = '';
    if (isExpanded) {
      const logsList = fieldLogs.length === 0
        ? '<p class="text-xs text-hug-muted py-2">No operation logs submitted for this field yet.</p>'
        : fieldLogs.map(fl => {
            const inputTxt = fl.inputQty ? ` · ${fl.inputQty} ${fl.inputUnit || ''} (${fl.inputName || ''})` : '';

            return `<div class="flex items-center justify-between py-2.5 px-3 bg-white rounded-lg border border-border text-xs mb-1.5 shadow-xs flex-wrap gap-2">
              <div>
                <strong class="font-bold text-hug-text">${fl.task || fl.activity}</strong>
                <span class="text-hug-muted ml-2">Php ${(fl.cost || 0).toLocaleString()} · ${fl.date}${inputTxt}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full font-bold text-[10px] text-success bg-success-bg border border-success/20">Recorded</span>
                <button onclick="openTakeOverModal('${f.id}', '${fl.taskId || fl.task || fl.activity}')" class="px-2.5 py-1 border border-border bg-white text-hug-text2 hover:text-primary hover:border-primary text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1">
                  <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                  Take Over &amp; Edit
                </button>
              </div>
            </div>`;
          }).join('');

      logsDrawer = `<tr>
        <td colspan="7" class="bg-bg/60 p-4 border-b border-border">
          <div class="bg-white p-4 rounded-xl border border-border shadow-xs">
            <div class="flex justify-between items-center mb-3 flex-wrap gap-2">
              <div>
                <h4 class="text-xs font-bold text-primary flex items-center gap-2">
                  <span>Submitted Operations Log History — ${f.id}</span>
                  <span class="text-hug-muted font-normal">(${f.member || f.owner})</span>
                </h4>
                <p class="text-[11px] text-hug-muted">All field progress, inputs, and labor entries recorded for SRA audit certification.</p>
              </div>
              <span class="text-[10px] font-bold text-hug-muted uppercase tracking-wider">${fieldLogs.length} recorded entries</span>
            </div>
            ${logsList}
          </div>
        </td>
      </tr>`;
    }

    return `<tr data-field-id="${f.id}" class="border-b border-border hover:bg-bg transition-all">
      <td class="px-4 py-3 font-bold text-xs text-primary font-mono">${f.id}</td>
      <td class="px-4 py-3 text-xs font-semibold text-hug-text">${f.member || f.owner}</td>
      <td class="px-4 py-3 text-xs text-hug-text2 font-medium">${f.ha || f.area} Ha</td>
      <td class="px-4 py-3">
        <span class="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A6B9A]">
          <span class="w-2 h-2 rounded-full bg-[#1A6B9A]"></span>
          ${f.stage}
        </span>
      </td>
      <td class="px-4 py-3">${progressBadge}</td>
      <td class="px-4 py-3 text-xs text-hug-text2 font-medium">
        <span class="text-success font-bold">${fieldLogs.length}</span> recorded entries
      </td>
      <td class="px-4 py-3">
        <div class="flex gap-2">
          <button onclick="openTakeOverModal('${f.id}')" class="px-3 py-1.5 bg-accent text-hug-text text-xs font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Take Over
          </button>
          <button onclick="toggleFieldLogs('${f.id}')" class="px-3 py-1.5 border border-border bg-white text-hug-text2 text-xs font-semibold rounded-lg hover:border-primary hover:text-primary transition-all cursor-pointer">
            ${isExpanded ? '▲ Hide Operations' : '▼ View Operations'}
          </button>
        </div>
      </td>
    </tr>${logsDrawer}`;
  }).join('');
}

function viewFieldOperationsFromLedger(fieldId) {
  if (!fieldId) return;
  navigate('operations');
  expandedFieldId = fieldId;
  renderOperations();
  setTimeout(() => {
    const row = document.querySelector(`tr[data-field-id="${fieldId}"]`);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      row.classList.add('bg-primary-bg/40');
      setTimeout(() => row.classList.remove('bg-primary-bg/40'), 2000);
    }
  }, 120);
}

// ── TAKE OVER CONTROLLER FUNCTIONS ───────────────────────
let selectedTakeOverStageId = null;

const STAGE_INPUT_BENCHMARKS = {
  'S1': { inputName: 'Tractor Plowing & Furrowing', inputQty: 1, inputUnit: 'ha', costPerHa: 4500, people: 2 },
  'S2': { inputName: 'Cane Points (Patdan)', inputQty: 40000, inputUnit: 'pcs', costPerHa: 14000, people: 10 },
  'S3': { inputName: 'Pre-emergence Herbicide', inputQty: 3, inputUnit: 'liters', costPerHa: 3500, people: 4 },
  'S4': { inputName: 'Manual Weeding Crew', inputQty: 1, inputUnit: 'ha', costPerHa: 1800, people: 4 },
  'S5': { inputName: '18-46 Fertilizer', inputQty: 3, inputUnit: 'bags', costPerHa: 6600, people: 3 },
  'S6': { inputName: 'Urea (46-0-0) Fertilizer', inputQty: 4, inputUnit: 'bags', costPerHa: 7400, people: 4 },
  'S7': { inputName: 'Off-barring & Hilling-up (Tractor)', inputQty: 1, inputUnit: 'ha', costPerHa: 2500, people: 2 },
  'S8': { inputName: 'Cane Harvesting & Milling Haul', inputQty: 60, inputUnit: 'tons', costPerHa: 21000, people: 12 },
};

function openTakeOverModal(fieldId, targetStageIdOrName = null) {
  if (!fieldId) return;
  const db = getDB();
  const field = db.fields.find(f => f.id === fieldId);
  if (!field) {
    toast(`Field ${fieldId} not found.`);
    return;
  }

  activeTakeOverFieldId = fieldId;
  const fieldLogs = db.logs.filter(l => l.fieldId === fieldId);

  // Initialize stages
  if (Array.isArray(field.customStages) && field.customStages.length > 0) {
    activeTakeOverStages = field.customStages.map(s => {
      const hasLog = fieldLogs.some(l => (l.task || l.activity || '').toLowerCase().includes(s.label.toLowerCase()) || l.taskId === s.id);
      return {
        ...s,
        done: s.done || hasLog
      };
    });
  } else {
    activeTakeOverStages = SRA_STANDARD_STAGES.map(s => {
      const hasLog = fieldLogs.some(l => (l.task || l.activity || '').toLowerCase().includes(s.label.toLowerCase()) || l.taskId === s.id);
      return {
        ...s,
        done: s.done || hasLog,
        active: s.label === field.stage
      };
    });
  }

  // Update header text
  const badgeEl = document.getElementById('takeover-field-id-badge');
  const titleEl = document.getElementById('takeover-field-title');
  const subEl = document.getElementById('takeover-field-sub');
  const stagePillEl = document.getElementById('takeover-current-stage-pill');
  const haInput = document.getElementById('takeover-log-ha');

  if (badgeEl) badgeEl.textContent = field.id;
  if (titleEl) titleEl.textContent = `Take Over: ${field.id}`;
  if (subEl) subEl.textContent = `Assigned to ${field.member || field.owner} · ${field.ha || field.area} Ha · ${field.blockFarm || 'Block Farm A'}`;
  if (stagePillEl) stagePillEl.textContent = `Current Stage: ${field.stage}`;
  if (haInput) haInput.value = field.ha || field.area || '1.5';

  // Target stage selection: specific stage requested or first active/pending
  let targetStage = null;
  if (targetStageIdOrName) {
    const q = String(targetStageIdOrName).toLowerCase();
    targetStage = activeTakeOverStages.find(s => s.id.toLowerCase() === q || s.label.toLowerCase().includes(q));
  }
  if (!targetStage) {
    targetStage = activeTakeOverStages.find(s => s.active || !s.done) || activeTakeOverStages[0];
  }

  if (targetStage) {
    takeOverSelectStage(targetStage.id);
  } else {
    renderTakeOverTimeline();
  }

  renderTakeOverStagesEditor();

  const modal = document.getElementById('takeover-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeTakeOverModal() {
  const modal = document.getElementById('takeover-modal');
  if (modal) modal.classList.add('hidden');
  activeTakeOverFieldId = null;
  selectedTakeOverStageId = null;
  renderManager();
}

let takeoverPhotoAttached = false;

function takeOverSetUnit(unit) {
  const hiddenInput = document.getElementById('takeover-log-input-unit');
  if (hiddenInput) hiddenInput.value = unit;

  document.querySelectorAll('#takeover-unit-chips .takeover-unit-chip').forEach(chip => {
    const isSelected = chip.getAttribute('data-unit') === unit;
    chip.className = isSelected
      ? 'takeover-unit-chip text-[10px] font-bold px-2 py-1 rounded-md border border-primary bg-primary text-white transition-all cursor-pointer'
      : 'takeover-unit-chip text-[10px] font-medium px-2 py-1 rounded-md border border-border bg-white text-hug-text2 hover:border-primary transition-all cursor-pointer';
  });
}

function takeOverChangeCategory(catKey) {
  const unitMap = {
    'prep': 'ha',
    'plant': 'pcs',
    'fert': 'bags',
    'weed': 'liters',
    'harvest': 'tons'
  };
  if (unitMap[catKey]) {
    takeOverSetUnit(unitMap[catKey]);
  }
}

function takeOverTogglePhoto() {
  takeoverPhotoAttached = !takeoverPhotoAttached;
  const statusEl = document.getElementById('takeover-photo-status');
  const btnEl = document.getElementById('takeover-photo-btn');

  if (takeoverPhotoAttached) {
    if (statusEl) {
      statusEl.textContent = 'Photo attached: field_inspection_2026.jpg';
      statusEl.className = 'text-[10px] text-success font-bold';
    }
    if (btnEl) {
      btnEl.textContent = '✕ Remove Photo';
      btnEl.className = 'px-3 py-1.5 bg-danger-bg border border-danger/30 text-danger text-xs font-bold rounded-lg hover:bg-danger/20 transition-all cursor-pointer shadow-xs';
    }
    toast('Field inspection photo attached.');
  } else {
    if (statusEl) {
      statusEl.textContent = 'Optional receipt / proof for SRA district audit';
      statusEl.className = 'text-[10px] text-hug-muted';
    }
    if (btnEl) {
      btnEl.textContent = '+ Attach Photo';
      btnEl.className = 'px-3 py-1.5 bg-white border border-border text-hug-text2 text-xs font-semibold rounded-lg hover:border-primary hover:text-primary transition-all cursor-pointer shadow-xs';
    }
  }
}

function takeOverSelectStage(stageId) {
  selectedTakeOverStageId = stageId;
  const db = getDB();
  const field = db.fields.find(f => f.id === activeTakeOverFieldId);
  const stage = activeTakeOverStages.find(s => s.id === stageId);
  if (!stage || !field) return;

  const haNum = Number(field.ha || field.area) || 1.5;
  const fieldLogs = db.logs.filter(l => l.fieldId === activeTakeOverFieldId);
  const matchingLog = fieldLogs.find(l => 
    (l.task || l.activity || '').toLowerCase().includes(stage.label.toLowerCase()) || 
    l.taskId === stage.id
  );

  const benchmark = STAGE_INPUT_BENCHMARKS[stageId] || {
    inputName: stage.label,
    inputQty: 1 * haNum,
    inputUnit: 'ha',
    costPerHa: 3000,
    people: 4
  };

  const titleEl = document.getElementById('takeover-active-stage-title');
  const dateEl = document.getElementById('takeover-log-date');
  const catEl = document.getElementById('takeover-log-category');
  const activityEl = document.getElementById('takeover-log-activity');
  const costEl = document.getElementById('takeover-log-cost');
  const haEl = document.getElementById('takeover-log-ha');
  const peopleEl = document.getElementById('takeover-log-people');
  const inputNameEl = document.getElementById('takeover-log-input-name');
  const inputQtyEl = document.getElementById('takeover-log-input-qty');
  const noteEl = document.getElementById('takeover-log-note');
  const auditSection = document.getElementById('takeover-audit-trail-section');
  const auditList = document.getElementById('takeover-audit-trail-list');
  const hintEl = document.getElementById('takeover-selected-stage-hint');
  const badgeEl = document.getElementById('takeover-stage-badge');
  const btnTextEl = document.getElementById('takeover-submit-btn-text');

  if (titleEl) titleEl.textContent = stage.label;
  if (noteEl) noteEl.value = '';

  // Infer category from stage label
  const stageNameLower = (stage.label || '').toLowerCase();
  let defaultCategory = 'fert';
  if (stageNameLower.includes('prep') || stageNameLower.includes('plow')) defaultCategory = 'prep';
  else if (stageNameLower.includes('plant') || stageNameLower.includes('patdan')) defaultCategory = 'plant';
  else if (stageNameLower.includes('weed') || stageNameLower.includes('barring') || stageNameLower.includes('hilamon')) defaultCategory = 'weed';
  else if (stageNameLower.includes('harvest') || stageNameLower.includes('milling') || stageNameLower.includes('tapas')) defaultCategory = 'harvest';

  if (catEl) catEl.value = defaultCategory;

  // Reset photo state
  takeoverPhotoAttached = false;
  const photoStatusEl = document.getElementById('takeover-photo-status');
  const photoBtnEl = document.getElementById('takeover-photo-btn');
  if (photoStatusEl) {
    photoStatusEl.textContent = 'Optional receipt / proof for SRA district audit';
    photoStatusEl.className = 'text-[10px] text-hug-muted';
  }
  if (photoBtnEl) {
    photoBtnEl.textContent = '+ Attach Photo';
    photoBtnEl.className = 'px-3 py-1.5 bg-white border border-border text-hug-text2 text-xs font-semibold rounded-lg hover:border-primary hover:text-primary transition-all cursor-pointer shadow-xs';
  }

  if (matchingLog) {
    // Populate with actual recorded values
    if (dateEl) dateEl.value = toISODateString(matchingLog.date);
    if (activityEl) activityEl.value = matchingLog.task || matchingLog.activity || stage.label;
    if (costEl) costEl.value = matchingLog.cost || 0;
    if (haEl) haEl.value = matchingLog.hectares || haNum.toFixed(1);
    if (peopleEl) peopleEl.value = matchingLog.people || benchmark.people;
    if (inputNameEl) inputNameEl.value = matchingLog.inputName || '';
    if (inputQtyEl) inputQtyEl.value = matchingLog.inputQty || '';
    takeOverSetUnit(matchingLog.inputUnit || benchmark.inputUnit || 'bags');
    if (hintEl) hintEl.textContent = `Stage completed & recorded on ${matchingLog.date || 'prior date'} (₱${(matchingLog.cost || 0).toLocaleString()})`;
    if (badgeEl) {
      badgeEl.className = 'text-[10px] font-bold px-2.5 py-1 rounded-full bg-success-bg text-success border border-success/30';
      badgeEl.textContent = 'Stage Completed';
    }
    if (btnTextEl) btnTextEl.textContent = 'Update Recorded Stage Details';

    // Show audit trail if available
    if (auditSection && auditList) {
      if (Array.isArray(matchingLog.editHistory) && matchingLog.editHistory.length > 0) {
        auditSection.classList.remove('hidden');
        auditList.innerHTML = matchingLog.editHistory.map(h => `
          <div class="p-1.5 bg-white rounded border border-border">
            <p class="font-bold text-hug-text text-[10px]">${h.editedBy} · <span class="font-normal text-hug-muted">${h.editedAt}</span></p>
            <p class="text-[10px] text-hug-text2">${h.note || 'Details corrected'}</p>
          </div>
        `).join('');
      } else {
        auditSection.classList.add('hidden');
        auditList.innerHTML = '';
      }
    }
  } else {
    // Populate with standard benchmark
    if (dateEl) dateEl.value = new Date().toISOString().split('T')[0];
    if (activityEl) activityEl.value = stage.label;
    if (costEl) costEl.value = Math.round(benchmark.costPerHa * haNum);
    if (haEl) haEl.value = haNum.toFixed(1);
    if (peopleEl) peopleEl.value = benchmark.people;
    if (inputNameEl) inputNameEl.value = benchmark.inputName;
    if (inputQtyEl) inputQtyEl.value = (benchmark.inputQty * (benchmark.inputUnit === 'pcs' || benchmark.inputUnit === 'tons' || benchmark.inputUnit === 'bags' || benchmark.inputUnit === 'liters' ? haNum : 1)).toString();
    takeOverSetUnit(benchmark.inputUnit || 'bags');
    if (hintEl) hintEl.textContent = `Standard benchmark loaded for ${haNum.toFixed(1)} Ha plot`;
    if (badgeEl) {
      badgeEl.className = 'text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary-bg text-primary border border-primary/20';
      badgeEl.textContent = 'Selected Stage';
    }
    if (btnTextEl) btnTextEl.textContent = 'Record Operation & Save Progress';
    if (auditSection) auditSection.classList.add('hidden');
  }

  renderTakeOverTimeline();
}

function renderTakeOverTimeline() {
  const container = document.getElementById('takeover-timeline-container');
  if (!container) return;

  const db = getDB();
  const field = db.fields.find(f => f.id === activeTakeOverFieldId);
  const fieldLogs = db.logs.filter(l => l.fieldId === activeTakeOverFieldId);
  const haNum = Number(field?.ha || field?.area) || 1.5;

  container.innerHTML = activeTakeOverStages.map((stage, idx) => {
    const matchingLog = fieldLogs.find(l => 
      (l.task || l.activity || '').toLowerCase().includes(stage.label.toLowerCase()) || 
      l.taskId === stage.id
    );
    const isDone = stage.done || Boolean(matchingLog);
    const isSelected = selectedTakeOverStageId === stage.id;
    const benchmark = STAGE_INPUT_BENCHMARKS[stage.id];
    const benchCost = benchmark ? Math.round(benchmark.costPerHa * haNum) : 3000;

    let statusPill = '';
    if (isDone) {
      statusPill = '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success border border-success/30"><svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Done</span>';
    } else if (stage.active) {
      statusPill = '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white animate-pulse">Active</span>';
    } else {
      statusPill = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-bg text-hug-muted border border-border">Pending</span>';
    }

    return `<div onclick="takeOverSelectStage('${stage.id}')" class="p-3 rounded-xl border transition-all cursor-pointer ${isSelected ? 'border-primary bg-primary-bg/25 shadow-xs ring-2 ring-primary/20' : 'border-border bg-white hover:border-primary/40 hover:bg-bg/40'}">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0 shadow-xs" style="background-color:${stage.color}">
            ${idx + 1}
          </div>
          <div class="min-w-0">
            <h4 class="text-xs font-bold text-hug-text truncate">${stage.label}</h4>
            <p class="text-[10px] text-hug-muted mt-0.5">
              ${isDone && matchingLog ? `Recorded: ₱${(matchingLog.cost || 0).toLocaleString()}` : `Est: ~₱${benchCost.toLocaleString()} · ${benchmark ? benchmark.inputName : 'Standard'}`}
            </p>
          </div>
        </div>
        ${statusPill}
      </div>
    </div>`;
  }).join('');
}

function takeOverSubmitLog() {
  const dateEl = document.getElementById('takeover-log-date');
  const catEl = document.getElementById('takeover-log-category');
  const activityEl = document.getElementById('takeover-log-activity');
  const costEl = document.getElementById('takeover-log-cost');
  const haEl = document.getElementById('takeover-log-ha');
  const peopleEl = document.getElementById('takeover-log-people');
  const inputNameEl = document.getElementById('takeover-log-input-name');
  const inputQtyEl = document.getElementById('takeover-log-input-qty');
  const inputUnitEl = document.getElementById('takeover-log-input-unit');
  const noteEl = document.getElementById('takeover-log-note');

  const date = dateEl ? dateEl.value : new Date().toISOString().split('T')[0];
  const category = catEl ? catEl.value : 'fert';
  const activity = activityEl ? activityEl.value.trim() : '';
  const cost = costEl ? parseFloat(costEl.value) : NaN;
  const ha = haEl ? parseFloat(haEl.value) : NaN;
  const people = peopleEl ? parseInt(peopleEl.value, 10) : 1;
  const inputName = inputNameEl ? inputNameEl.value.trim() : '';
  const inputQty = inputQtyEl ? inputQtyEl.value.trim() : '';
  const inputUnit = inputUnitEl ? inputUnitEl.value : 'bags';
  const note = noteEl ? noteEl.value.trim() : '';

  if (!activity || isNaN(cost) || cost <= 0) {
    toast('Error: Please enter an operation activity name and valid operational cost.');
    return;
  }

  const db = getDB();
  const field = db.fields.find(f => f.id === activeTakeOverFieldId);
  if (!field) return;

  const targetIdx = selectedTakeOverStageId 
    ? activeTakeOverStages.findIndex(s => s.id === selectedTakeOverStageId)
    : activeTakeOverStages.findIndex(s => s.active || !s.done);

  const stageObj = targetIdx > -1 ? activeTakeOverStages[targetIdx] : null;

  // Check if an existing log exists for this completed stage
  const fieldLogs = db.logs.filter(l => l.fieldId === activeTakeOverFieldId);
  const matchingLog = fieldLogs.find(l => 
    (stageObj && l.taskId === stageObj.id) ||
    (stageObj && (l.task || l.activity || '').toLowerCase().includes(stageObj.label.toLowerCase()))
  );

  if (matchingLog) {
    // Dirty check: check if anything actually changed
    const isChanged = (
      (date && toISODateString(date) !== toISODateString(matchingLog.date)) ||
      activity !== (matchingLog.task || matchingLog.activity || '') ||
      Math.round(cost) !== Math.round(matchingLog.cost || 0) ||
      (!isNaN(ha) && String(ha) !== String(matchingLog.hectares || '')) ||
      people !== (parseInt(matchingLog.people, 10) || 4) ||
      inputName !== (matchingLog.inputName || '') ||
      inputQty !== (matchingLog.inputQty || '') ||
      inputUnit !== (matchingLog.inputUnit || 'bags') ||
      Boolean(note) ||
      takeoverPhotoAttached
    );

    if (!isChanged) {
      toast('No changes detected for this completed stage.');
      return;
    }

    // Update existing record in-place
    matchingLog.date = date || matchingLog.date;
    matchingLog.category = category || matchingLog.category;
    matchingLog.task = activity;
    matchingLog.activity = activity;
    matchingLog.cost = Math.round(cost);
    matchingLog.hectares = isNaN(ha) ? 1.5 : ha;
    matchingLog.people = isNaN(people) ? 4 : people;
    matchingLog.inputName = inputName;
    matchingLog.inputQty = inputQty;
    matchingLog.inputUnit = inputUnit;
    matchingLog.photo = takeoverPhotoAttached ? 'field_inspection_2026.jpg' : (matchingLog.photo || null);
    matchingLog.editHistory = matchingLog.editHistory || [];
    matchingLog.editHistory.push({
      editedBy: 'Farm Manager (Take Over Update)',
      editedAt: new Date().toLocaleString('en-PH'),
      note: note || 'Updated stage record details'
    });

    saveDB(db);
    toast(`Updated stage record for ${stageObj ? stageObj.label : activeTakeOverFieldId}!`);
    logSystemEvent(
      'operation',
      'Manager Stage Correction',
      `${activeTakeOverFieldId}`,
      `Updated ${stageObj?.label || 'stage'} record (₱${Math.round(cost).toLocaleString()})${note ? ' (Note: ' + note + ')' : ''}.`,
      'Farm Manager Jose Reyes',
      'Recorded'
    );
    renderTakeOverTimeline();
    renderManager();
    renderOperations();
    return;
  }

  // New log creation for unrecorded stage
  const newLog = {
    id: `L-${Date.now().toString().slice(-4)}`,
    fieldId: activeTakeOverFieldId,
    category: category,
    activity: activity,
    task: activity,
    cost: Math.round(cost),
    hectares: isNaN(ha) ? 1.5 : ha,
    people: isNaN(people) ? 4 : people,
    inputQty: inputQty,
    inputUnit: inputUnit,
    inputName: inputName,
    taskId: stageObj ? stageObj.id : null,
    date: date || new Date().toISOString().split('T')[0],
    photo: takeoverPhotoAttached ? 'field_inspection_2026.jpg' : null,
    status: 'Approved',
    approved: true,
    editHistory: [{
      editedBy: 'Farm Manager (Take Over)',
      editedAt: new Date().toLocaleString('en-PH'),
      note: 'Direct supervisor entry via Web Console'
    }]
  };

  db.logs.unshift(newLog);

  // Mark target stage done and advance
  if (targetIdx > -1) {
    activeTakeOverStages[targetIdx].done = true;
    activeTakeOverStages[targetIdx].active = false;
    
    // Find next pending stage
    const nextIdx = activeTakeOverStages.findIndex((s, i) => i > targetIdx && !s.done);
    if (nextIdx > -1) {
      activeTakeOverStages[nextIdx].active = true;
      field.stage = activeTakeOverStages[nextIdx].label;
    } else {
      const anyPending = activeTakeOverStages.find(s => !s.done);
      if (anyPending) {
        anyPending.active = true;
        field.stage = anyPending.label;
      } else {
        field.stage = 'Harvesting & Milling (Completed)';
      }
    }
  }

  field.customStages = activeTakeOverStages.map(s => ({ ...s }));
  field.synced = true;
  field.lastSync = 'Just now (Manager Take Over)';
  saveDB(db);

  const stagePillEl = document.getElementById('takeover-current-stage-pill');
  if (stagePillEl) stagePillEl.textContent = `Current Stage: ${field.stage}`;

  toast(`Operation recorded for ${activeTakeOverFieldId}! Stage completed and advanced.`);
  logSystemEvent(
    'operation',
    'Manager Take Over Entry',
    `${activeTakeOverFieldId}`,
    `Directly recorded ${activity} (₱${cost.toLocaleString()}) and advanced cycle stage to ${field.stage}.`,
    'Farm Manager Jose Reyes',
    'Recorded'
  );
  renderTakeOverTimeline();
  renderManager();
  renderOperations();
}

function toISODateString(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return new Date().toISOString().split('T')[0];
}

function openEditLogModal(logId) {
  const db = getDB();
  const log = db.logs.find(l => l.id === logId);
  if (!log) {
    toast('Error: Log not found.');
    return;
  }
  openTakeOverModal(log.fieldId, log.taskId || log.task || log.activity);
}

function renderTakeOverStagesEditor() {
  const listEl = document.getElementById('takeover-editable-stages-list');
  if (!listEl) return;

  listEl.innerHTML = activeTakeOverStages.map((stage, idx) => `
    <div class="flex items-center justify-between p-2 bg-white rounded-lg border border-border text-xs">
      <div class="flex items-center gap-2 flex-1">
        <span class="w-3 h-3 rounded-full" style="background-color:${stage.color}"></span>
        <span class="font-bold text-hug-text">${stage.label}</span>
      </div>
      <div class="flex items-center gap-1">
        <button onclick="takeOverMoveStage(${idx}, -1)" ${idx === 0 ? 'disabled' : ''} class="p-1 text-hug-muted hover:text-primary ${idx === 0 ? 'opacity-30' : 'cursor-pointer'}">
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <button onclick="takeOverMoveStage(${idx}, 1)" ${idx === activeTakeOverStages.length - 1 ? 'disabled' : ''} class="p-1 text-hug-muted hover:text-primary ${idx === activeTakeOverStages.length - 1 ? 'opacity-30' : 'cursor-pointer'}">
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <button onclick="takeOverRemoveStage(${idx})" class="p-1 text-danger hover:bg-danger-bg rounded cursor-pointer" title="Remove Stage">
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

function takeOverMoveStage(idx, dir) {
  const targetIdx = idx + dir;
  if (targetIdx < 0 || targetIdx >= activeTakeOverStages.length) return;
  const temp = activeTakeOverStages[idx];
  activeTakeOverStages[idx] = activeTakeOverStages[targetIdx];
  activeTakeOverStages[targetIdx] = temp;
  renderTakeOverStagesEditor();
  renderTakeOverTimeline();
}

function takeOverAddPresetStage(name, color) {
  activeTakeOverStages.push({
    id: `CS-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    label: name,
    color: color || '#2D5016',
    done: false,
    active: false
  });
  renderTakeOverStagesEditor();
  renderTakeOverTimeline();
  toast(`Added stage: ${name}`);
}

function takeOverAddCustomStage() {
  const inputEl = document.getElementById('takeover-custom-stage-input');
  const name = inputEl ? inputEl.value.trim() : '';
  if (!name) {
    toast('Please enter a stage name.');
    return;
  }
  takeOverAddPresetStage(name, '#5B4DA7');
  if (inputEl) inputEl.value = '';
}

function takeOverRemoveStage(idx) {
  activeTakeOverStages.splice(idx, 1);
  renderTakeOverStagesEditor();
  renderTakeOverTimeline();
}

function takeOverResetToSRA() {
  activeTakeOverStages = SRA_STANDARD_STAGES.map(s => ({ ...s }));
  renderTakeOverStagesEditor();
  renderTakeOverTimeline();
  toast('Reset to SRA Standard 8-Stage Template.');
}

function takeOverSaveStages() {
  const db = getDB();
  const field = db.fields.find(f => f.id === activeTakeOverFieldId);
  if (!field) return;

  field.customStages = activeTakeOverStages.map(s => ({ ...s }));
  const activeS = activeTakeOverStages.find(s => s.active);
  field.stage = activeS ? activeS.label : (activeTakeOverStages.length > 0 ? (activeTakeOverStages.every(s => s.done) ? 'Harvesting & Milling (Completed)' : (activeTakeOverStages.some(s => s.done) ? 'Waiting to Start Next Stage' : 'Not Started')) : 'Not Started');

  saveDB(db);
  toast(`Stage plan saved for ${field.id}!`);
  renderManager();
}

function managerAssignField() {
  const fieldIdEl = document.getElementById('mgr-field-id');
  const memberEl = document.getElementById('mgr-member-name');
  const haEl = document.getElementById('mgr-field-ha');

  const fieldId = fieldIdEl ? fieldIdEl.value.trim().toUpperCase() : '';
  const member = memberEl ? memberEl.value.trim() : '';
  const ha = haEl ? parseFloat(haEl.value) : NaN;
  const blockFarm = 'Block Farm A';

  if (!fieldId || !member || isNaN(ha) || ha <= 0) {
    toast('Error: Please enter a valid Field ID, Member Name, and positive Hectare size.');
    return;
  }

  const db = getDB();
  const existing = db.fields.find(f => f.id === fieldId);
  if (existing) {
    existing.member = member;
    existing.owner = member;
    existing.ha = ha;
    existing.area = ha;
    existing.blockFarm = blockFarm;
    toast(`Updated assignment for ${fieldId} to ${member}`);
  } else {
    db.fields.push({
      id: fieldId,
      member: member,
      owner: member,
      ha: ha,
      area: ha,
      stage: 'Land Preparation',
      age: '0.1 months',
      synced: true,
      lastSync: 'Just now',
      lag: 'Synced',
      blockFarm: blockFarm,
      customStages: []
    });
    toast(`Assigned ${fieldId} (${ha} Ha) to ${member} in ${blockFarm}`);
  }

  saveDB(db);
  if (fieldIdEl) fieldIdEl.value = '';
  if (memberEl) memberEl.value = '';
  if (haEl) haEl.value = '';
  renderManager();
  renderDashboard();
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
        ? '<span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success border border-success/20">Approved</span>'
        : l.status === 'Pending'
          ? '<span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-warning-bg text-warning border border-warning/20">Pending</span>'
          : '<span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-danger-bg text-danger border border-danger/20">Flagged</span>';
      return `<tr class="border-b border-border/60 hover:bg-bg/50 transition-colors">
        <td class="px-3 py-2 font-mono font-bold text-xs text-hug-text">${l.fieldId}</td>
        <td class="px-3 py-2 text-xs text-hug-muted">${l.schedule || l.type || 'Monthly'}</td>
        <td class="px-3 py-2 text-xs font-semibold text-hug-text">${l.task || l.activity}</td>
        <td class="px-3 py-2 text-xs font-bold text-hug-text">Php ${(l.cost || 0).toLocaleString()}</td>
        <td class="px-3 py-2">${badge}</td>
      </tr>`;
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

  let filtered = (db.priceHistory || []).map((p, idx) => ({ ...p, _originalIdx: idx }));

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
    let diff = '<span class="text-xs font-semibold text-hug-muted">Steady</span>';
    if (p.change > 0) diff = '<span class="text-xs font-bold text-success">▲ Php ' + p.change + '</span>';
    else if (p.change < 0) diff = '<span class="text-xs font-bold text-danger">▼ Php ' + Math.abs(p.change) + '</span>';

    const molVal = p.molasses ? `Php ${p.molasses.toLocaleString()}` : 'Php 4,200';

    return `
      <tr class="border-b border-border/60 hover:bg-bg/50 transition-colors">
        <td class="px-4 py-3 text-xs text-hug-muted whitespace-nowrap">${p.date}</td>
        <td class="px-4 py-3 text-xs font-bold text-hug-text whitespace-nowrap">${p.week.replace('Wk', 'Week ')}</td>
        <td class="px-4 py-3 text-xs font-extrabold text-primary whitespace-nowrap">Php ${p.price.toLocaleString()}</td>
        <td class="px-4 py-3 text-xs font-bold text-success whitespace-nowrap">${molVal}</td>
        <td class="px-4 py-3 whitespace-nowrap">${diff}</td>
        <td class="px-4 py-3 text-xs text-hug-text2 italic">${p.source}</td>
        <td class="px-4 py-3 whitespace-nowrap">
          <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-success-bg text-success border border-success/20">
            <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            Official Circular
          </span>
        </td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="7" class="text-center py-8 text-hug-muted text-xs">No price records matched your search.</td></tr>';

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

  renderPriceHistoryChart();
}

function openPublishPriceModal() {
  const modal = document.getElementById('modal-publish-price');
  if (!modal) return;
  
  const today = new Date().toISOString().split('T')[0];
  const dateEl = document.getElementById('modal-p-date');
  if (dateEl) dateEl.value = today;

  const db = getDB();
  const latest = db.priceHistory?.[0] || { price: 2800, molasses: 4200, week: 'Week 4 May' };
  
  const weekEl = document.getElementById('modal-p-week');
  if (weekEl) weekEl.value = 'Week 4 May';

  const sugarEl = document.getElementById('modal-p-sugar');
  if (sugarEl) sugarEl.value = latest.price || 2800;

  const molEl = document.getElementById('modal-p-molasses');
  if (molEl) molEl.value = latest.molasses || 4200;

  const sourceEl = document.getElementById('modal-p-source');
  if (sourceEl) sourceEl.value = 'SRA Sugar Order & Circular #105';

  modal.classList.remove('hidden');
}

function closePublishPriceModal() {
  const modal = document.getElementById('modal-publish-price');
  if (modal) modal.classList.add('hidden');
}

async function submitPublishPrice() {
  const weekEl = document.getElementById('modal-p-week');
  const dateEl = document.getElementById('modal-p-date');
  const sugarEl = document.getElementById('modal-p-sugar');
  const molEl = document.getElementById('modal-p-molasses');
  const sourceEl = document.getElementById('modal-p-source');

  const week = weekEl ? weekEl.value.trim() : '';
  const dateStr = dateEl ? dateEl.value : '';
  const sugarPrice = sugarEl ? parseFloat(sugarEl.value) : NaN;
  const molassesPrice = molEl ? parseFloat(molEl.value) : 4200;
  const source = sourceEl && sourceEl.value.trim() ? sourceEl.value.trim() : 'Official SRA release';

  if (!week || isNaN(sugarPrice) || !dateStr) {
    toast('Error: Please fill in all required price fields.');
    return;
  }

  const db = getDB();
  const prevPrice = db.priceHistory?.[0]?.price || sugarPrice;
  const prevMol = db.priceHistory?.[0]?.molasses || molassesPrice;
  const change = sugarPrice - prevPrice;
  const molChange = molassesPrice - prevMol;

  const dateObj = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${months[dateObj.getMonth()]} ${String(dateObj.getDate()).padStart(2, '0')}, ${dateObj.getFullYear()}`;

  const pId = `PRC-${Date.now()}`;
  const newPost = {
    id: pId,
    week,
    price: sugarPrice,
    molasses: molassesPrice,
    date: formattedDate,
    isoDate: dateStr,
    timestamp: Date.now(),
    change,
    molassesChange: molChange,
    source,
    createdAt: new Date().toISOString()
  };

  db.priceHistory.unshift(newPost);
  saveDB(db);

  // Directly push to Firestore if online
  if (window.firebaseDB && window.firestore) {
    try {
      const { doc, setDoc } = window.firestore;
      await setDoc(doc(window.firebaseDB, 'sra_prices', pId), newPost, { merge: true });
      console.log('[HUGPONG] Published price committed to Firestore:', pId);
    } catch (e) {
      console.warn('[HUGPONG] Direct Firestore price publish note:', e);
    }
  }

  logSystemEvent(
    'price',
    'SRA Benchmark Broadcasted',
    `${week} · Raw Sugar ₱${sugarPrice.toLocaleString()}/Lkg | Molasses ₱${molassesPrice.toLocaleString()}/MT`,
    `Published official millsite circular "${source}" effective ${formattedDate}.`,
    'SRA Administrator Juan dela Cruz',
    'Official Circular'
  );

  closePublishPriceModal();
  renderPrices();
  renderDashboard();
  toast(`Success: Published SRA Sugar (₱${sugarPrice.toLocaleString()}/Lkg) & Molasses (₱${molassesPrice.toLocaleString()}/MT)!`);
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
  toast('Protected: Published SRA sugar price benchmarks are permanent official circulars and cannot be removed.');
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

// ── FIELD OPERATION LOGS CONTROLLER ───────────────────────
function renderLogs() {
  const db = getDB();
  const selectField = document.getElementById('log-field-filter')?.value || 'all';
  const body = document.getElementById('logs-table-body');
  if (!body) return;

  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const isManager = currentRole === 'manager';
  const isAdmin = currentRole === 'admin';
  const isSuperAdmin = currentRole === 'superadmin';

  const labelEl = document.querySelector('label[for="log-field-filter"]');
  if (labelEl) labelEl.textContent = isManager ? 'Filter Block Farm A Plot:' : 'Filter Field / Farm:';

  const selectEl = document.getElementById('log-field-filter');
  if (selectEl) {
    if (isManager) {
      selectEl.innerHTML = '<option value="all">All Block Farm A Plots</option>'
        + '<option value="FLD-KTR-001">FLD-KTR-001 (Mario Dimagiba)</option>'
        + '<option value="FLD-KTR-002">FLD-KTR-002 (Jose Rizal)</option>'
        + '<option value="FLD-KTR-005">FLD-KTR-005 (Roberto Tan)</option>'
        + '<option value="FLD-KTR-006">FLD-KTR-006 (Antonio Luna)</option>';
    } else {
      selectEl.innerHTML = '<option value="all">All District Fields &amp; Blocks</option>'
        + '<option value="Block Farm A">Block Farm A (All Plots)</option>'
        + '<option value="Block Farm B">Block Farm B (All Plots)</option>'
        + '<option value="Block Farm C">Block Farm C (All Plots)</option>'
        + '<option value="Block Farm D">Block Farm D (All Plots)</option>'
        + '<option value="FLD-KTR-001">FLD-KTR-001 (Mario Dimagiba)</option>'
        + '<option value="FLD-KTR-002">FLD-KTR-002 (Jose Rizal)</option>'
        + '<option value="FLD-KTR-003">FLD-KTR-003 (Maria Santos)</option>'
        + '<option value="FLD-KTR-004">FLD-KTR-004 (Emilio Aguinaldo)</option>'
        + '<option value="FLD-KTR-007">FLD-KTR-007 (Pedro Reyes)</option>'
        + '<option value="FLD-KTR-008">FLD-KTR-008 (Andres Bonifacio)</option>'
        + '<option value="FLD-KTR-009">FLD-KTR-009 (Ana Gomez)</option>'
        + '<option value="FLD-KTR-010">FLD-KTR-010 (Apolinario Mabini)</option>';
    }
    selectEl.value = selectField;
  }

  const activeFilterValue = selectEl ? selectEl.value : 'all';

  let filtered = db.logs;
  
  // 1. Scoping: Farm Manager can only view logs from their block farm (Block Farm A)
  if (isManager) {
    const managerFieldIds = new Set(db.fields.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === 'Block Farm A').map(f => f.id));
    filtered = filtered.filter(l => managerFieldIds.has(l.fieldId) || (l.blockFarm === 'Block Farm A'));
  }

  if (activeFilterValue !== 'all') {
    if (activeFilterValue.startsWith('Block Farm')) {
      filtered = filtered.filter(l => (l.blockFarm || getBlockFarmName(l.fieldId)) === activeFilterValue);
    } else {
      filtered = filtered.filter(l => l.fieldId === activeFilterValue);
    }
  }

  if (logStatusFilter !== 'all') {
    filtered = filtered.filter(l => l.status === logStatusFilter);
  }

  const searchInput = document.getElementById('log-search');
  const logSearchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
  if (logSearchQuery) {
    filtered = filtered.filter(l => 
      l.id.toLowerCase().includes(logSearchQuery) || 
      (l.task || l.activity || '').toLowerCase().includes(logSearchQuery) || 
      l.fieldId.toLowerCase().includes(logSearchQuery) ||
      (l.blockFarm && l.blockFarm.toLowerCase().includes(logSearchQuery))
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
    const farmName = l.blockFarm || getBlockFarmName(l.fieldId);
    const fieldObj = db.fields.find(f => f.id === l.fieldId);
    const memberName = fieldObj ? (fieldObj.member || fieldObj.owner) : '';

    let actionBtn = '';
    if (isAdmin || isSuperAdmin) {
      actionBtn = `<span class="text-hug-muted text-[11px] font-medium italic flex items-center gap-1">
        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        ${isSuperAdmin ? 'System Monitor' : 'Regulatory Monitor'}
      </span>`;
    } else {
      actionBtn = `
        <button onclick="openTakeOverModal('${l.fieldId}')" class="px-2.5 py-1 bg-accent text-hug-text text-xs font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer shadow-xs">
          <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          Take Over
        </button>
      `;
    }

    const catBadges = {
      prep: '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Land Prep</span>',
      plant: '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Planting</span>',
      fert: '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Fertilization</span>',
      weed: '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Weeding & Care</span>',
      harvest: '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Harvesting</span>',
    };
    const catBadge = catBadges[l.category] || catBadges.weed;

    const statusBadge = l.status === 'Approved'
      ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success border border-success/20">Approved</span>'
      : '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-warning-bg text-[#C97A00] border border-warning/20">Pending</span>';

    return `
      <tr class="hover:bg-bg/50 transition-colors border-b border-border/50">
        <td class="px-4 py-3 font-mono font-bold text-hug-text text-xs">${l.id}</td>
        <td class="px-4 py-3">
          <div class="flex flex-col">
            <div class="flex items-center gap-1.5">
              <span class="font-mono font-bold text-primary text-xs">${l.fieldId}</span>
              ${memberName ? `<span class="text-[10px] text-hug-muted font-normal">(${memberName})</span>` : ''}
            </div>
            <span class="text-[11px] font-semibold text-hug-text2">${farmName}</span>
          </div>
        </td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-2">
            ${catBadge}
            <span class="font-medium text-hug-text text-xs">${l.task || l.activity}</span>
          </div>
        </td>
        <td class="px-4 py-3 font-bold text-hug-text text-xs">Php ${(l.cost || 0).toLocaleString()}</td>
        <td class="px-4 py-3 text-xs text-hug-muted">${l.date}</td>
        <td class="px-4 py-3">${statusBadge}</td>
        <td class="px-4 py-3">${actionBtn}</td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="7" class="text-center py-8 text-hug-muted text-xs">No operational records matched the selected filters.</td></tr>';

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
      `<div class="flex flex-col gap-1.5">
        <div class="flex justify-between items-baseline">
          <span class="text-xs font-semibold text-hug-text">${a.name}</span>
          <span class="text-xs font-bold" style="color:${a.color};">Php ${a.cost.toLocaleString()} · ${a.pct}%</span>
        </div>
        <div class="w-full h-2.5 bg-border rounded-full overflow-hidden">
          <div class="h-full rounded-full" style="width:${a.pct}%;background-color:${a.color};"></div>
        </div>
      </div>`
    ).join('');
  }
  if (hectareBars) {
    const efficiencies = [
      { id: 'Block Farm A', rawKey: 'Block Farm A', owner: 'Juan dela Cruz & Jose Rizal', haCost: 12400, haPct: 82, status: 'Average (₱12.4k/Ha)', color: '#4A7C2F' },
      { id: 'Block Farm B', rawKey: 'Block Farm B', owner: 'Maria Santos & Emilio', haCost: 8900, haPct: 58, status: 'Most Efficient (₱8.9k/Ha)', color: '#3A8F3A' },
      { id: 'Block Farm C', rawKey: 'Block Farm C', owner: 'Pedro Reyes & Andres', haCost: 15200, haPct: 100, status: 'Alert: Heavy Overhead (₱15.2k/Ha)', color: '#D9534F' },
      { id: 'Block Farm D', rawKey: 'Block Farm D', owner: 'Ana Gomez & Apolinario', haCost: 10100, haPct: 66, status: 'Satisfactory (₱10.1k/Ha)', color: '#1A6B9A' },
    ];
    hectareBars.innerHTML = efficiencies.map(e =>
      `<div onclick="openDetailedAnalyticsModal('${e.rawKey}')" class="group flex flex-col gap-1.5 p-2 rounded-xl hover:bg-bg border border-transparent hover:border-primary/30 transition-all cursor-pointer">
        <div class="flex justify-between items-baseline">
          <span class="text-xs font-bold text-hug-text group-hover:text-primary transition-colors">${e.id} <span class="text-[10px] font-normal text-hug-muted">(${e.owner})</span></span>
          <div class="flex items-center gap-2">
            <span class="text-xs font-extrabold" style="color: ${e.color};">₱${e.haCost.toLocaleString()}/Ha</span>
            <span class="text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">Details →</span>
          </div>
        </div>
        <div class="w-full h-3 bg-border rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500" style="width: ${e.haPct}%; background-color: ${e.color};"></div>
        </div>
        <span class="text-[10px] font-semibold" style="color: ${e.color};">${e.status}</span>
      </div>`
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

// ── USER MANAGEMENT & ROLE ISOLATION ─────────────────────
function renderUsers() {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const db = getDB();
  const usersBody = document.getElementById('users-table-body');
  const pendingList = document.getElementById('pending-users-list');

  // Dynamic titles according to user role
  const headingEl = document.getElementById('user-mgmt-heading');
  const subEl = document.getElementById('user-mgmt-sub');
  const dirTitleEl = document.getElementById('user-directory-title');
  const pendingTitleEl = document.getElementById('pending-users-title');
  const pendingSubEl = document.getElementById('pending-users-sub');

  if (currentRole === 'manager') {
    if (headingEl) headingEl.textContent = 'Block Farm A · Member Access & Onboarding';
    if (subEl) subEl.textContent = 'Review and approve member farmers registering specifically under Block Farm A';
    if (dirTitleEl) dirTitleEl.textContent = 'Block Farm A Registered Personnel & Farmers';
    if (pendingTitleEl) pendingTitleEl.textContent = 'Pending Block Farm A Registrations';
    if (pendingSubEl) pendingSubEl.textContent = 'Only you (Farm Manager) can approve members for your assigned block farm.';
  } else if (currentRole === 'admin') {
    if (headingEl) headingEl.textContent = 'SRA District Personnel & Farm Manager Directory';
    if (subEl) subEl.textContent = 'Supervise registered farm managers, oversee member block allocations, and verify access';
    if (dirTitleEl) dirTitleEl.textContent = 'District VII Active Personnel & Farmers Directory';
    if (pendingTitleEl) pendingTitleEl.textContent = 'Pending Farm Manager Appointments';
    if (pendingSubEl) pendingSubEl.textContent = 'SRA Admin approval required for Farm Manager appointments. Member approvals are handled by their respective Farm Managers.';
  } else {
    if (headingEl) headingEl.textContent = 'System User & Credentials Directory';
    if (subEl) subEl.textContent = 'Global credential management across Super Admin, SRA Admin, Farm Managers, and Members';
    if (dirTitleEl) dirTitleEl.textContent = 'System-wide User Directory';
    if (pendingTitleEl) pendingTitleEl.textContent = 'All Pending Registrations';
    if (pendingSubEl) pendingSubEl.textContent = 'Super Admin root approval for all tiers.';
  }

  // DIRECTORY TABLE FILTERING
  if (usersBody) {
    let filtered = [...db.users];

    // 1. Role-based directory scoping:
    if (currentRole === 'manager') {
      // Farm manager only sees members of their block farm + themselves (Jose Reyes)
      filtered = filtered.filter(u => u.blockFarm === 'Block Farm A' || (u.role === 'Farm Manager' && u.name === 'Jose Reyes'));
    } else if (currentRole === 'admin') {
      // SRA Admin CANNOT see Super Admin, but CAN see Farm Managers and all Members with their block farm and field/plot
      filtered = filtered.filter(u => u.role !== 'Super Admin');
    }

    const searchInput = document.getElementById('user-search');
    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
    
    if (searchQuery) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchQuery) || 
        u.contact.toLowerCase().includes(searchQuery) || 
        u.role.toLowerCase().includes(searchQuery) ||
        (u.blockFarm && u.blockFarm.toLowerCase().includes(searchQuery)) ||
        (u.fieldId && u.fieldId.toLowerCase().includes(searchQuery))
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
      const roleBadges = { 
        'Super Admin': 'bg-farm-purple-bg text-farm-purple border border-farm-purple/20', 
        'SRA (Admin)': 'bg-primary-bg text-primary border border-primary/20', 
        'Farm Manager': 'bg-farm-blue-bg text-farm-blue border border-farm-blue/20', 
        'Member': 'bg-bg text-hug-text2 border border-border' 
      };
      const rClass = roleBadges[u.role] || roleBadges['Member'];
      
      // Determine field/plot display (e.g. Block Farm A · FLD-KTR-001 (1.5Ha), FLD-KTR-005 (2.0Ha))
      let plotDisplay = '';
      if (u.fieldId) {
        plotDisplay = ` · <span class="font-mono font-bold text-primary">${u.fieldId}</span>`;
      } else if (u.role === 'Member') {
        const foundFields = db.fields.filter(f => f.member === u.name || f.owner === u.name);
        if (foundFields.length > 0) {
          plotDisplay = ` · ` + foundFields.map(f => `<span class="font-mono font-bold text-primary">${f.id} (${f.ha}Ha)</span>`).join(', ');
        }
      }
      const farmPlotLabel = u.blockFarm ? `${u.blockFarm}${plotDisplay}` : 'Unassigned';

      // Action permissions:
      let canEdit = (currentRole === 'superadmin' || currentRole === 'admin');
      let canRevoke = false;
      if (currentRole === 'manager' && u.role === 'Member') canRevoke = true;
      if (currentRole === 'admin' && u.role === 'Farm Manager') canRevoke = true;
      if (currentRole === 'superadmin' && u.role !== 'Super Admin') canRevoke = true;

      const editBtn = canEdit
        ? `<button onclick="openEditUserModal('${u.contact}')" class="text-hug-muted hover:text-primary p-1 rounded-lg hover:bg-primary-bg transition-all cursor-pointer mr-1" title="Edit User Profile & Role"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>`
        : '';

      const deleteBtn = canRevoke 
        ? `<button onclick="removeDirectoryUser('${u.contact}')" class="text-hug-muted hover:text-danger p-1 rounded-lg hover:bg-danger-bg transition-all cursor-pointer" title="Revoke Access"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>`
        : '';

      const actions = (editBtn || deleteBtn) ? `<div class="flex items-center justify-end">${editBtn}${deleteBtn}</div>` : '<span class="text-[10px] text-hug-muted italic">Read Only</span>';

      return `
        <tr class="hover:bg-bg/50 transition-colors border-b border-border/50">
          <td class="px-4 py-3 font-mono font-bold text-hug-text text-xs">${u.contact}</td>
          <td class="px-4 py-3 font-semibold text-hug-text text-sm">${u.name}</td>
          <td class="px-4 py-3 text-xs text-hug-text2 font-medium">${farmPlotLabel}</td>
          <td class="px-4 py-3"><span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${rClass}">${u.role}</span></td>
          <td class="px-4 py-3 text-xs font-semibold text-hug-text2">${u.logsHandled} logs</td>
          <td class="px-4 py-3 text-xs text-hug-muted">${u.regDate}</td>
          <td class="px-4 py-3 text-right">${actions}</td>
        </tr>
      `;
    }).join('') || '<tr><td colspan="7" class="text-center py-8 text-hug-muted text-xs">No users matched your criteria.</td></tr>';

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

  // PENDING REGISTRATIONS SCOPING
  if (pendingList) {
    let pendingUsers = [...db.pendingUsers];

    if (currentRole === 'manager') {
      // Farm Manager of Block Farm A ONLY sees pending members for Block Farm A
      pendingUsers = pendingUsers.filter(p => p.role === 'Member' && (p.blockFarm === 'Block Farm A' || !p.blockFarm));
    } else if (currentRole === 'admin') {
      // SRA Admin ONLY approves Farm Managers (Members are approved by their respective Farm Manager)
      pendingUsers = pendingUsers.filter(p => p.role === 'Farm Manager');
    }

    if (pendingUsers.length === 0) {
      const emptyNotice = currentRole === 'admin'
        ? 'No pending Farm Manager applications. (Member farmer registrations are routed directly to their respective Farm Manager for review).'
        : 'No pending member registrations for your block farm.';
      pendingList.innerHTML = `<div class="text-center py-6 px-3 text-xs text-hug-muted border border-dashed border-border rounded-xl leading-relaxed">${emptyNotice}</div>`;
    } else {
      pendingList.innerHTML = pendingUsers.map(p => {
        let locationDetail = '';
        if (currentRole === 'manager') {
          const plot = p.fieldId || 'FLD-KTR-006';
          const ha = p.area || '1.4 Ha';
          locationDetail = `<p class="text-[11px] text-hug-muted mt-0.5">Assigned Field Plot: <span class="text-primary font-mono font-bold">${plot}</span> <span class="text-hug-text2 font-semibold">(${ha})</span></p>`;
        } else if (currentRole === 'admin') {
          locationDetail = `<p class="text-[11px] text-hug-muted mt-0.5">Assigned Block Farm: <span class="text-primary font-bold">${p.blockFarm || 'Block Farm B'}</span></p>`;
        } else {
          locationDetail = `<p class="text-[11px] text-hug-muted mt-0.5">Farm / Field: <span class="text-primary font-bold">${p.blockFarm || 'Unassigned'}</span> ${p.fieldId ? `· <span class="font-mono font-bold">${p.fieldId}</span>` : ''}</p>`;
        }

        return `
          <div class="border border-border rounded-xl p-3.5 bg-bg/40 flex flex-col gap-2.5">
            <div class="flex justify-between items-start">
              <div>
                <strong class="text-xs font-bold text-hug-text block">${p.name}</strong>
                ${locationDetail}
                <p class="text-[10px] text-hug-muted mt-0.5">Role Applied: <span class="text-primary font-bold uppercase tracking-wider">${p.role}</span></p>
              </div>
              <span class="text-[10px] text-hug-muted">${p.regDate}</span>
            </div>
            <p class="text-xs font-bold font-mono text-hug-text2">PH: ${p.contact}</p>
            <div class="flex gap-2 pt-1 border-t border-border/50">
              <button onclick="approveRegistration('${p.contact}')" class="flex-1 bg-primary text-white text-xs font-bold py-1.5 rounded-lg hover:bg-primary-light transition-all cursor-pointer shadow-xs">
                Confirm Approval
              </button>
              <button onclick="rejectRegistration('${p.contact}')" class="flex-1 border border-danger/40 text-danger text-xs font-semibold py-1.5 rounded-lg hover:bg-danger-bg transition-all cursor-pointer">
                Reject
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

function approveRegistration(contact) {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const db = getDB();
  const idx = db.pendingUsers.findIndex(u => u.contact === contact);
  if (idx === -1) return;

  const user = db.pendingUsers[idx];

  // Role gate:
  if (currentRole === 'manager' && user.role !== 'Member') {
    toast('Access Denied: Farm Managers can only approve Member farmers.');
    return;
  }
  if (currentRole === 'admin' && user.role !== 'Farm Manager') {
    toast('Notice: Member farmer approvals are handled by their respective Farm Manager.');
    return;
  }

  db.pendingUsers.splice(idx, 1);

  // Generate plot ID for member if applicable
  const assignedPlot = user.fieldId || (user.role === 'Member' ? `FLD-KTR-${String(db.fields.length + 1).padStart(3, '0')}` : null);

  db.users.push({
    contact: user.contact,
    name: user.name,
    role: user.role,
    blockFarm: user.blockFarm || (currentRole === 'manager' ? 'Block Farm A' : 'Block Farm A'),
    fieldId: assignedPlot,
    logsHandled: 0,
    regDate: new Date().toISOString().split('T')[0]
  });

  saveDB(db);
  logSystemEvent(
    'user',
    'Member Registration Approved',
    `${user.name} (${contact})`,
    `Approved membership for ${user.blockFarm || 'Block Farm A'}${user.fieldId ? ' and allocated field ' + user.fieldId : ''}.`,
    'Farm Manager Jose Reyes',
    'Approved'
  );
  renderUsers();
  renderDashboard();
  toast(`Success: ${user.name} approved as ${user.role}!`);
}

function rejectRegistration(contact) {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  if (currentRole !== 'manager' && currentRole !== 'admin') {
    toast('Access Denied: Farm Manager or SRA Admin approval required.');
    return;
  }
  const db = getDB();
  const user = db.pendingUsers.find(u => u.contact === contact);
  if (!user) return;

  db.pendingUsers = db.pendingUsers.filter(u => u.contact !== contact);
  saveDB(db);
  logSystemEvent(
    'user',
    'Member Registration Declined',
    `${user.name} (${contact})`,
    `Registration application declined for ${user.blockFarm || 'Block Farm'}.`,
    'Farm Manager Jose Reyes',
    'Rejected'
  );
  renderUsers();
  renderDashboard();
  toast(`Registration Rejected for: ${user.name} (${contact})`);
}

function removeDirectoryUser(contact) {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const db = getDB();
  const target = db.users.find(u => u.contact === contact);
  if (!target) return;

  if (target.role === 'Super Admin') {
    toast('Access Denied: Super Admin account cannot be revoked.');
    return;
  }

  if (currentRole === 'manager' && target.role !== 'Member') {
    toast('Access Denied: Farm Managers can only revoke member farmers in their block farm.');
    return;
  }

  if (currentRole === 'admin' && target.role !== 'Farm Manager') {
    toast('Access Denied: SRA Admin can only manage and revoke Farm Manager appointments.');
    return;
  }

  db.users = db.users.filter(u => u.contact !== contact);
  saveDB(db);
  logSystemEvent(
    'user',
    'User Access Revoked',
    `${target.name} (${contact})`,
    `Access credentials revoked for ${target.role} in ${target.blockFarm || 'cooperative'}.`,
    'Farm Manager Jose Reyes',
    'Revoked'
  );
  renderUsers();
  renderDashboard();
  toast(`User Access Revoked for: ${target.name} (${contact})`);
}

// ── FIELD / BLOCK FARM REGISTRY DYNAMIC CONTROLLER ───────
function renderFields() {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const isManager = currentRole === 'manager';
  const db = getDB();
  const gridContainer = document.getElementById('fields-grid-container');
  if (!gridContainer) return;

  const headingEl = document.getElementById('fields-heading');
  const subEl = document.getElementById('fields-sub');
  const actionBtnText = document.getElementById('fields-action-btn-text');
  const histBtnText = document.getElementById('fields-history-btn-text');

  if (histBtnText) {
    histBtnText.textContent = isManager ? 'Plot History' : 'Block Farm History';
  }

  if (isManager) {
    // Farm Manager sees each individual field plot inside Block Farm A
    if (headingEl) headingEl.textContent = 'Block Farm A · Field Plot Registry';
    if (subEl) subEl.textContent = 'Direct field management, member plot allocations, and crop stage tracking for Block Farm A';
    if (actionBtnText) actionBtnText.textContent = '+ Register Field Plot';

    const plots = db.fields.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === 'Block Farm A');

    if (plots.length === 0) {
      gridContainer.innerHTML = '<div class="col-span-full py-12 text-center text-xs text-hug-muted border border-dashed border-border rounded-2xl">No field plots registered under Block Farm A yet.</div>';
      return;
    }

    gridContainer.innerHTML = plots.map(f => {
      const isSynced = f.synced;
      const syncBadge = isSynced
        ? '<span class="inline-flex items-center gap-1 text-[10px] font-bold text-success bg-success-bg px-2.5 py-0.5 rounded-full"><svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Fully Synced</span>'
        : `<span class="inline-flex items-center gap-1 text-[10px] font-bold text-danger bg-danger-bg px-2.5 py-0.5 rounded-full"><svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Lagging Sync</span>`;

      return `
        <div class="bg-white rounded-2xl border border-border shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between gap-4">
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="font-mono text-xs font-bold text-primary bg-primary-bg px-2.5 py-1 rounded-lg">${f.id}</span>
              <span class="text-xs font-bold text-hug-text2 bg-bg border border-border px-2.5 py-0.5 rounded-full">${f.ha} Ha</span>
            </div>
            <div class="flex flex-col gap-1 text-xs">
              <strong class="text-sm font-bold text-hug-text">${f.member || 'Unassigned'}</strong>
              <p class="text-hug-muted">Current Stage: <span class="font-semibold text-primary">${f.stage || 'Land Preparation'}</span></p>
              <p class="text-hug-muted text-[11px]">Last Sync: <span class="font-medium text-hug-text2">${f.lastSync || 'Just now'}</span></p>
            </div>
            <div class="mt-3">
              ${syncBadge}
            </div>
          </div>
          <div class="flex items-center gap-2 pt-3 border-t border-border/60">
            <button onclick="openPlotHistoryModal('${f.id}')" class="flex-1 text-center py-2 px-3 border border-border rounded-xl text-xs font-semibold text-hug-text2 hover:text-primary hover:border-primary hover:bg-bg transition-all cursor-pointer">
              View History
            </button>
            <button onclick="openEditPlotModal('${f.id}')" class="py-2 px-3 border border-border rounded-xl text-xs font-semibold text-hug-text2 hover:text-primary hover:border-primary hover:bg-bg transition-all cursor-pointer" title="Edit Plot Allocation or Transfer Member">
              Edit
            </button>
            <button onclick="archiveFieldPlot('${f.id}')" class="py-2 px-3 border border-danger/30 text-danger rounded-xl text-xs font-medium hover:bg-danger-bg transition-all cursor-pointer" title="Archive Field Plot">
              Archive
            </button>
          </div>
        </div>
      `;
    }).join('');
  } else {
    // SRA Admin / Superadmin sees all Block Farms aggregated
    if (headingEl) headingEl.textContent = 'District VII · Cooperative Block Farms';
    if (subEl) subEl.textContent = 'Supervision of enrolled block farm cooperatives across Silay district';
    if (actionBtnText) actionBtnText.textContent = '+ Register Block Farm';

    const grouped = {};
    db.fields.forEach(f => {
      const farm = f.blockFarm || getBlockFarmName(f.id) || 'Unassigned Block Farm';
      if (!grouped[farm]) grouped[farm] = { name: farm, totalArea: 0, synced: 0, totalFields: 0, fieldIds: [] };
      grouped[farm].totalArea += Number(f.ha) || 0;
      grouped[farm].totalFields += 1;
      grouped[farm].synced += f.synced ? 1 : 0;
      grouped[farm].fieldIds.push(f.id);
    });

    const cards = Object.values(grouped).map(group => {
      const manager = db.users.find(u => u.role === 'Farm Manager' && u.blockFarm === group.name);
      const managerName = manager ? manager.name : 'Unassigned';
      const blockId = getBlockId(group.name);
      const allSynced = group.synced === group.totalFields;
      const borderColor = allSynced ? '#E2E8DC' : '#D9534F';
      const syncBadge = allSynced
        ? '<span class="inline-flex items-center gap-1 text-[10px] font-bold text-success bg-success-bg px-2.5 py-0.5 rounded-full"><svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Fully Synced</span>'
        : '<span class="inline-flex items-center gap-1 text-[10px] font-bold text-danger bg-danger-bg px-2.5 py-0.5 rounded-full"><svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Partial Sync</span>';

      return `
        <div class="bg-white rounded-2xl border border-border shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between gap-4">
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <strong class="text-base font-extrabold text-primary">${group.name}</strong>
              <span class="text-xs font-bold text-hug-text2 bg-bg border border-border px-2.5 py-0.5 rounded-full">${group.totalArea.toFixed(1)} Ha</span>
            </div>
            <div class="flex flex-col gap-1.5 text-xs">
              <p class="text-hug-muted">Farm Manager: <strong class="text-hug-text font-bold">${managerName}</strong></p>
              <p class="text-hug-muted text-[11px]">Block Code: <span class="font-mono font-semibold text-hug-text2">${blockId}</span></p>
              <p class="text-hug-muted text-[11px]">Registered Plots: <span class="font-bold text-primary">${group.totalFields} plots</span></p>
            </div>
            <div class="mt-3">
              ${syncBadge}
            </div>
          </div>
          <div class="flex items-center gap-2 pt-3 border-t border-border/60">
            <button onclick="openBlockFarmHistoryModal('${group.name}')" class="flex-1 text-center py-2 px-3 border border-border rounded-xl text-xs font-semibold text-hug-text2 hover:text-primary hover:border-primary hover:bg-bg transition-all cursor-pointer">
              View History
            </button>
            <button onclick="openEditBlockFarmModal('${group.name}')" class="flex-1 text-center py-2 px-3 border border-border rounded-xl text-xs font-semibold text-hug-text2 hover:text-primary hover:border-primary hover:bg-bg transition-all cursor-pointer">
              Edit Block Farm
            </button>
            <button onclick="archiveBlockFarm('${group.name}')" class="py-2 px-3 border border-danger/30 text-danger rounded-xl text-xs font-medium hover:bg-danger-bg transition-all cursor-pointer" title="Archive Block Farm">
              Archive
            </button>
          </div>
        </div>
      `;
    });

    gridContainer.innerHTML = cards.join('');
  }
}

function archiveFieldPlot(fieldId) {
  if (!confirm(`Are you sure you want to archive field plot ${fieldId}?`)) return;
  const db = getDB();
  db.fields = db.fields.filter(f => f.id !== fieldId);
  saveDB(db);
  logSystemEvent(
    'plot',
    'Field Plot Archived',
    `${fieldId}`,
    `Archived field from active registry.`,
    'Farm Manager Jose Reyes',
    'Archived'
  );
  renderFields();
  renderDashboard();
  toast(`Field plot ${fieldId} archived.`);
}

function openPlotHistoryModal(fieldId) {
  const db = getDB();
  const field = db.fields.find(f => f.id === fieldId);
  if (!field) return;

  const idEl = document.getElementById('plot-hist-id');
  const areaEl = document.getElementById('plot-hist-area');
  const titleEl = document.getElementById('plot-hist-title');
  const subEl = document.getElementById('plot-hist-sub');
  const countEl = document.getElementById('plot-hist-log-count');
  const logsListEl = document.getElementById('plot-hist-logs-list');

  const totalSpendEl = document.getElementById('plot-hist-total-spend');
  const stageEl = document.getElementById('plot-hist-stage');
  const syncStatusEl = document.getElementById('plot-hist-sync-status');
  const areaDisplayEl = document.getElementById('plot-hist-area-display');
  const locDisplayEl = document.getElementById('plot-hist-location-display');

  if (idEl) idEl.textContent = field.id;
  if (areaEl) areaEl.textContent = `${Number(field.ha || 1.5).toFixed(1)} Ha`;
  if (titleEl) titleEl.textContent = `Field Plot Operations History: ${field.id}`;
  if (subEl) subEl.textContent = `Assigned to ${field.member || 'Unassigned'} · ${field.blockFarm || 'Block Farm A'}`;

  const plotLogs = db.logs.filter(l => l.fieldId === fieldId);
  const totalSpend = plotLogs.reduce((s, l) => s + (Number(l.cost) || 0), 0);

  if (totalSpendEl) totalSpendEl.textContent = `₱${totalSpend.toLocaleString()}`;
  if (stageEl) stageEl.textContent = field.stage || 'Planting';
  if (syncStatusEl) {
    syncStatusEl.textContent = field.synced ? `Synced (${field.lastSync || 'Just now'})` : 'Lagging Sync Alert';
    syncStatusEl.className = field.synced ? 'text-[10px] text-success font-semibold' : 'text-[10px] text-danger font-semibold';
  }
  if (areaDisplayEl) areaDisplayEl.textContent = `${Number(field.ha || 1.5).toFixed(1)} Hectares`;
  if (locDisplayEl) locDisplayEl.textContent = `${field.blockFarm || 'Block Farm A'} · Silay Cluster`;

  if (countEl) countEl.textContent = `${plotLogs.length} total entries`;

  if (logsListEl) {
    if (plotLogs.length === 0) {
      logsListEl.innerHTML = '<p class="text-xs text-hug-muted py-3 text-center">No historical operations logged for this field yet.</p>';
    } else {
      logsListEl.innerHTML = plotLogs.map(l => {
        const inputDisplay = l.inputQty ? ` · ${l.inputQty} ${l.inputUnit || ''} (${l.inputName || ''})` : '';
        return `
          <div class="p-3 bg-bg/50 rounded-xl border border-border flex items-center justify-between text-xs">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-hug-text">${l.task || l.activity}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success">Recorded</span>
              </div>
              <p class="text-[11px] text-hug-muted mt-0.5">₱${(l.cost || 0).toLocaleString()} · ${l.date}${inputDisplay}</p>
            </div>
            <span class="text-[10px] font-mono text-hug-muted">${l.id}</span>
          </div>
        `;
      }).join('');
    }
  }

  const modal = document.getElementById('modal-plot-history');
  if (modal) modal.classList.remove('hidden');
}

function closePlotHistoryModal() {
  const modal = document.getElementById('modal-plot-history');
  if (modal) modal.classList.add('hidden');
}

function openBlockFarmHistoryModal(farmName = null) {
  const db = getDB();
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const isManager = currentRole === 'manager';

  const targetFarm = farmName || (isManager ? 'Block Farm A' : null);

  const codeEl = document.getElementById('block-hist-code');
  const areaEl = document.getElementById('block-hist-area');
  const titleEl = document.getElementById('block-hist-title');
  const subEl = document.getElementById('block-hist-sub');
  const plotsCountEl = document.getElementById('block-hist-plots-count');
  const totalCostEl = document.getElementById('block-hist-total-cost');
  const syncStatusEl = document.getElementById('block-hist-sync-status');
  const countEl = document.getElementById('block-hist-log-count');
  const logsListEl = document.getElementById('block-hist-logs-list');

  let filteredFields = db.fields;
  let filteredLogs = db.logs;
  let blockCode = 'DISTRICT VII';
  let title = 'District VII · All Enrolled Block Farms';
  let sub = 'Regulatory overview across all cooperative clusters in Silay District';

  if (targetFarm) {
    filteredFields = db.fields.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === targetFarm);
    const fieldIds = new Set(filteredFields.map(f => f.id));
    filteredLogs = db.logs.filter(l => fieldIds.has(l.fieldId) || (l.blockFarm && l.blockFarm === targetFarm));
    blockCode = getBlockId(targetFarm);
    const manager = db.users.find(u => u.role === 'Farm Manager' && u.blockFarm === targetFarm);
    title = `${targetFarm} · Cooperative History & Audit`;
    sub = `Supervised by ${manager ? manager.name : 'Jose Reyes'} · ${filteredFields.length} Enrolled Member Plots`;
  }

  const totalHa = filteredFields.reduce((s, f) => s + (Number(f.ha || f.area) || 0), 0);
  const totalSpend = filteredLogs.reduce((s, l) => s + (Number(l.cost) || 0), 0);
  const allSynced = filteredFields.every(f => f.synced);

  if (codeEl) codeEl.textContent = blockCode;
  if (areaEl) areaEl.textContent = `${totalHa.toFixed(1)} Total Ha`;
  if (titleEl) titleEl.textContent = title;
  if (subEl) subEl.textContent = sub;
  if (plotsCountEl) plotsCountEl.textContent = `${filteredFields.length} Plots`;
  if (totalCostEl) totalCostEl.textContent = `₱${totalSpend.toLocaleString()}`;
  if (syncStatusEl) {
    syncStatusEl.textContent = allSynced ? '100% Synced' : 'Sync Lag Detected';
    syncStatusEl.className = allSynced ? 'font-bold text-success block mt-0.5' : 'font-bold text-danger block mt-0.5';
  }
  if (countEl) countEl.textContent = `${filteredLogs.length} total entries`;

  if (logsListEl) {
    if (filteredLogs.length === 0) {
      logsListEl.innerHTML = '<p class="text-xs text-hug-muted py-3 text-center">No historical operations logged for this block farm yet.</p>';
    } else {
      logsListEl.innerHTML = filteredLogs.map(l => {
        const inputDisplay = l.inputQty ? ` · ${l.inputQty} ${l.inputUnit || ''} (${l.inputName || ''})` : '';
        return `
          <div class="p-3 bg-bg/50 rounded-xl border border-border flex items-center justify-between text-xs hover:bg-bg transition-colors">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-primary-bg text-primary">${l.fieldId || 'FLD'}</span>
                <span class="font-bold text-hug-text">${l.task || l.activity}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success">${l.status || 'Recorded'}</span>
              </div>
              <p class="text-[11px] text-hug-muted mt-0.5">₱${(l.cost || 0).toLocaleString()} · ${l.date}${inputDisplay}</p>
            </div>
            <span class="text-[10px] font-mono text-hug-muted">${l.id}</span>
          </div>
        `;
      }).join('');
    }
  }

  const modal = document.getElementById('modal-block-farm-history');
  if (modal) modal.classList.remove('hidden');
}

function closeBlockFarmHistoryModal() {
  const modal = document.getElementById('modal-block-farm-history');
  if (modal) modal.classList.add('hidden');
}

function openPlotRegistryAuditModal() {
  const db = getDB();
  const modal = document.getElementById('modal-plot-registry-history');
  if (!modal) return;

  const haEl = document.getElementById('plot-reg-hist-ha');
  const plotsCountEl = document.getElementById('plot-reg-hist-plots-count');
  const usersCountEl = document.getElementById('plot-reg-hist-users-count');
  const eventsCountEl = document.getElementById('plot-reg-hist-events-count');
  const countEl = document.getElementById('plot-reg-hist-log-count');
  const eventsListEl = document.getElementById('plot-reg-hist-events-list');

  const bPlots = db.fields.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === 'Block Farm A');
  const bMembers = db.users.filter(u => u.blockFarm === 'Block Farm A' && u.role === 'Member');
  const totalHa = bPlots.reduce((s, f) => s + (Number(f.ha || f.area) || 0), 0);

  // Filter audit events related to Block Farm A or plot allocations
  const historyEvents = (db.systemHistory || []).filter(h => 
    h.category === 'plot' || 
    h.category === 'user' || 
    (h.details && (h.details.includes('Block Farm A') || h.details.includes('FLD-KTR'))) ||
    (h.actor && h.actor.includes('Jose Reyes'))
  );

  if (haEl) haEl.textContent = `${totalHa.toFixed(1)} Ha Allocated`;
  if (plotsCountEl) plotsCountEl.textContent = `${bPlots.length} Plots`;
  if (usersCountEl) usersCountEl.textContent = `${bMembers.length} Members`;
  if (eventsCountEl) eventsCountEl.textContent = `${historyEvents.length} Events`;
  if (countEl) countEl.textContent = `${historyEvents.length} events logged`;

  if (eventsListEl) {
    if (historyEvents.length === 0) {
      eventsListEl.innerHTML = '<p class="text-xs text-hug-muted py-3 text-center">No plot allocation or ownership change events recorded yet.</p>';
    } else {
      eventsListEl.innerHTML = historyEvents.map(e => `
        <div class="p-3 bg-bg/50 rounded-xl border border-border flex items-start justify-between text-xs gap-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-primary-bg text-primary">${e.id}</span>
              <span class="font-bold text-hug-text">${e.eventType || e.action || 'Registry Update'}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success">${e.status || 'Enrolled'}</span>
            </div>
            <p class="text-hug-text2 font-medium text-xs">${e.details}</p>
            <p class="text-[10px] text-hug-muted mt-1">Authorized by: <span class="font-semibold text-hug-text">${e.actor}</span> · ${e.timestamp}</p>
          </div>
        </div>
      `).join('');
    }
  }

  modal.classList.remove('hidden');
}

function closePlotRegistryAuditModal() {
  const modal = document.getElementById('modal-plot-registry-history');
  if (modal) modal.classList.add('hidden');
}

function openTabHistoryModal(type) {
  if (type === 'plot') {
    const currentRole = localStorage.getItem('hugpong_role') || 'admin';
    if (currentRole === 'manager') {
      openPlotRegistryAuditModal();
    } else {
      openBlockFarmHistoryModal(null);
    }
  } else if (type === 'user') {
    const db = getDB();
    const firstUser = db.users[0];
    if (firstUser) openUserHistoryModal(firstUser.contact);
  }
}

function openUserHistoryModal(contact) {
  const db = getDB();
  const user = db.users.find(u => u.contact === contact);
  if (!user) return;

  const roleEl = document.getElementById('user-hist-role');
  const contactEl = document.getElementById('user-hist-contact');
  const nameEl = document.getElementById('user-hist-name');
  const subEl = document.getElementById('user-hist-sub');
  const lastSyncEl = document.getElementById('user-hist-last-sync');
  const regDateEl = document.getElementById('user-hist-reg-date');
  const countEl = document.getElementById('user-hist-log-count');
  const logsListEl = document.getElementById('user-hist-logs-list');

  if (roleEl) roleEl.textContent = user.role;
  if (contactEl) contactEl.textContent = user.contact;
  if (nameEl) nameEl.textContent = user.name;
  if (subEl) subEl.textContent = `Allocated Plot: ${user.fieldId || 'None'} · ${user.blockFarm || 'Block Farm A'}`;
  if (lastSyncEl) lastSyncEl.textContent = 'Today, 08:30 AM';
  if (regDateEl) regDateEl.textContent = user.regDate || 'May 01, 2026';

  // Find logs submitted for the user's field or by this user
  const userLogs = db.logs.filter(l => l.fieldId === user.fieldId || l.member === user.name);
  if (countEl) countEl.textContent = `${userLogs.length} total entries`;

  if (logsListEl) {
    if (userLogs.length === 0) {
      logsListEl.innerHTML = '<p class="text-xs text-hug-muted py-3 text-center">No field operation submissions recorded for this member yet.</p>';
    } else {
      logsListEl.innerHTML = userLogs.map(l => {
        const inputDisplay = l.inputQty ? ` · ${l.inputQty} ${l.inputUnit || ''} (${l.inputName || ''})` : '';
        return `
          <div class="p-3 bg-bg/50 rounded-xl border border-border flex items-center justify-between text-xs">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-hug-text">${l.task || l.activity}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success">Recorded</span>
              </div>
              <p class="text-[11px] text-hug-muted mt-0.5">₱${(l.cost || 0).toLocaleString()} · ${l.date}${inputDisplay}</p>
            </div>
            <span class="text-[10px] font-mono text-hug-muted">${l.id}</span>
          </div>
        `;
      }).join('');
    }
  }

  const modal = document.getElementById('modal-user-history');
  if (modal) modal.classList.remove('hidden');
}

function closeUserHistoryModal() {
  const modal = document.getElementById('modal-user-history');
  if (modal) modal.classList.add('hidden');
}

let activeEditingUserContact = null;

function openEditUserModal(contact) {
  const db = getDB();
  const user = db.users.find(u => u.contact === contact);
  if (!user) {
    toast('Error: User not found in directory.');
    return;
  }

  activeEditingUserContact = contact;

  const origContactEl = document.getElementById('edit-user-orig-contact');
  const nameEl = document.getElementById('edit-user-name');
  const contactEl = document.getElementById('edit-user-contact');
  const roleEl = document.getElementById('edit-user-role');
  const blockEl = document.getElementById('edit-user-blockfarm');
  const fieldEl = document.getElementById('edit-user-field-id');

  if (origContactEl) origContactEl.value = user.contact;
  if (nameEl) nameEl.value = user.name || '';
  if (contactEl) contactEl.value = user.contact || '';
  if (roleEl) roleEl.value = user.role || 'Member';
  if (blockEl) blockEl.value = user.blockFarm || '';
  if (fieldEl) fieldEl.value = user.fieldId || '';

  const modal = document.getElementById('modal-edit-user');
  if (modal) modal.classList.remove('hidden');
}

function closeEditUserModal() {
  const modal = document.getElementById('modal-edit-user');
  if (modal) modal.classList.add('hidden');
  activeEditingUserContact = null;
}

function saveEditUserModal() {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  if (currentRole !== 'superadmin' && currentRole !== 'admin') {
    toast('Access Denied: Requires SRA (Admin) or Super Admin clearance.');
    return;
  }

  const origContact = document.getElementById('edit-user-orig-contact')?.value;
  const name = document.getElementById('edit-user-name')?.value.trim();
  const contact = document.getElementById('edit-user-contact')?.value.trim();
  const role = document.getElementById('edit-user-role')?.value;
  const blockFarm = document.getElementById('edit-user-blockfarm')?.value;
  const fieldId = document.getElementById('edit-user-field-id')?.value.trim();

  if (!name || !contact) {
    toast('Error: Please enter both full name and contact number.');
    return;
  }

  const db = getDB();
  const user = db.users.find(u => u.contact === origContact);
  if (!user) {
    toast('Error: User record not found.');
    return;
  }

  const prevRole = user.role;
  const prevFarm = user.blockFarm;

  user.name = name;
  user.contact = contact;
  user.role = role;
  user.blockFarm = blockFarm || null;
  user.fieldId = fieldId || null;

  // If role is changed to Farm Manager for a block, update references
  if (role === 'Farm Manager' && blockFarm) {
    db.users.forEach(u => {
      if (u.contact !== contact && u.role === 'Farm Manager' && u.blockFarm === blockFarm) {
        u.role = 'Member';
      }
    });
  }

  saveDB(db);
  closeEditUserModal();
  logSystemEvent(
    'user',
    'User Profile & Role Updated',
    `${name} (${contact})`,
    `Role set to ${role} · Assigned: ${blockFarm || 'Unassigned'}${fieldId ? ' (' + fieldId + ')' : ''} (Previous: ${prevRole} in ${prevFarm || 'None'}).`,
    currentRole === 'superadmin' ? 'Super Admin System Authority' : 'SRA District Administrator',
    'Approved'
  );
  toast(`User ${name} updated successfully!`);
  renderUsers();
  renderFields();
  renderDashboard();
}

function openCreateUserModal() {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  if (currentRole !== 'superadmin' && currentRole !== 'admin') {
    toast('Access Denied: Requires SRA (Admin) or Super Admin clearance.');
    return;
  }

  const nameEl = document.getElementById('create-user-name');
  const contactEl = document.getElementById('create-user-contact');
  const roleEl = document.getElementById('create-user-role');
  const blockEl = document.getElementById('create-user-blockfarm');

  if (nameEl) nameEl.value = '';
  if (contactEl) contactEl.value = '';
  if (roleEl) {
    roleEl.value = currentRole === 'superadmin' ? 'SRA (Admin)' : 'Farm Manager';
    const superOpt = roleEl.querySelector('option[value="Super Admin"]');
    if (superOpt) superOpt.disabled = (currentRole !== 'superadmin');
  }
  if (blockEl) blockEl.value = '';

  const modal = document.getElementById('modal-create-user');
  if (modal) modal.classList.remove('hidden');
}

function closeCreateUserModal() {
  const modal = document.getElementById('modal-create-user');
  if (modal) modal.classList.add('hidden');
}

function submitCreateUser() {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  if (currentRole !== 'superadmin' && currentRole !== 'admin') {
    toast('Access Denied: Requires SRA (Admin) or Super Admin clearance.');
    return;
  }

  const name = document.getElementById('create-user-name')?.value.trim();
  const contact = document.getElementById('create-user-contact')?.value.trim();
  const role = document.getElementById('create-user-role')?.value;
  const blockFarm = document.getElementById('create-user-blockfarm')?.value;

  if (!name || !contact) {
    toast('Error: Please enter both full name and contact number.');
    return;
  }

  if (role === 'Super Admin' && currentRole !== 'superadmin') {
    toast('Access Denied: Only Super Admin can provision Super Admin accounts.');
    return;
  }

  const db = getDB();
  const existing = db.users.find(u => u.contact === contact);
  if (existing) {
    toast(`Notice: User with contact ${contact} already exists in directory.`);
    return;
  }

  const newUser = {
    contact: contact,
    name: name,
    role: role,
    blockFarm: blockFarm || null,
    fieldId: null,
    logsHandled: 0,
    regDate: new Date().toISOString().split('T')[0]
  };

  db.users.push(newUser);

  if (role === 'Farm Manager' && blockFarm) {
    db.users.forEach(u => {
      if (u.contact !== contact && u.role === 'Farm Manager' && u.blockFarm === blockFarm) {
        u.role = 'Member';
      }
    });
  }

  saveDB(db);
  closeCreateUserModal();
  logSystemEvent(
    'user',
    'Personnel Provisioned',
    `${name} (${contact})`,
    `Provisioned new ${role} account · Assigned: ${blockFarm || 'District Central'}.`,
    currentRole === 'superadmin' ? 'Super Admin System Authority' : 'SRA District Administrator',
    'Approved'
  );

  toast(`Successfully registered ${name} as ${role}!`);
  renderUsers();
  renderFields();
  renderDashboard();
}

let activeEditingPlotId = null;

function openEditPlotModal(fieldId) {
  const db = getDB();
  const field = db.fields.find(f => f.id === fieldId);
  if (!field) {
    toast(`Error: Field plot ${fieldId} not found.`);
    return;
  }

  activeEditingPlotId = fieldId;

  const titleEl = document.getElementById('edit-plot-modal-title');
  const subEl = document.getElementById('edit-plot-modal-sub');
  const displayId = document.getElementById('edit-plot-display-id');
  const displayBlock = document.getElementById('edit-plot-display-block');
  const origIdInput = document.getElementById('edit-plot-orig-id');
  const memberIdInput = document.getElementById('edit-plot-member-id');
  const haInput = document.getElementById('edit-plot-ha');

  const blockName = field.blockFarm || getBlockFarmName(field.id);

  if (titleEl) titleEl.textContent = `Edit Field Plot: ${field.id}`;
  if (subEl) subEl.textContent = `Modify member assignment or land area for plot ${field.id} under ${blockName}.`;
  if (displayId) displayId.textContent = field.id;
  if (displayBlock) displayBlock.textContent = blockName;
  if (origIdInput) origIdInput.value = field.id;

  // Pre-fill with current member's contact/User ID
  if (memberIdInput) {
    const currentMemberName = field.member || field.owner;
    const db2 = getDB();
    const matchedUser = db2.users.find(u => u.name === currentMemberName || u.fieldId === field.id);
    memberIdInput.value = matchedUser ? matchedUser.contact : '';
  }

  if (haInput) haInput.value = field.ha || field.area || '1.5';

  const modal = document.getElementById('modal-edit-plot');
  if (modal) modal.classList.remove('hidden');
}

function closeEditPlotModal() {
  const modal = document.getElementById('modal-edit-plot');
  if (modal) modal.classList.add('hidden');
  activeEditingPlotId = null;
}

function saveEditPlotModal() {
  if (!activeEditingPlotId) return;
  const db = getDB();
  const field = db.fields.find(f => f.id === activeEditingPlotId);
  if (!field) return;

  const memberContact = document.getElementById('edit-plot-member-id')?.value.trim();
  const ha = parseFloat(document.getElementById('edit-plot-ha')?.value);

  if (!memberContact) {
    toast('Error: Please enter a valid Member User ID.');
    return;
  }

  // Look up member name by contact
  const matchedUser = db.users.find(u => u.contact === memberContact);
  const memberName = matchedUser ? matchedUser.name : memberContact;
  const memberContact2 = memberContact;

  const prevMember = field.member || field.owner;
  const prevHa = field.ha;

  field.member = memberName;
  field.owner = memberName;
  field.ha = ha;
  field.area = ha;

  // Auto update user directory if member exists
  const existingUser = db.users.find(u => (memberContact && u.contact === memberContact) || u.name.toLowerCase() === memberName.toLowerCase());
  if (existingUser) {
    if (!existingUser.fieldId) existingUser.fieldId = field.id;
    if (!existingUser.blockFarm) existingUser.blockFarm = field.blockFarm || getBlockFarmName(field.id);
  }

  saveDB(db);
  closeEditPlotModal();
  logSystemEvent(
    'plot',
    'Plot Allocation Updated',
    `${field.id}`,
    `Assigned to User ID: ${memberContact || 'N/A'} (${memberName}) · ${ha} Ha (Previous owner: ${prevMember || 'Unassigned'}).`,
    'Farm Manager Jose Reyes',
    'Approved'
  );
  toast(`Field plot ${field.id} updated & assigned to User ID: ${memberContact || memberName}!`);
  renderFields();
  renderUsers();
  renderOperations();
  renderDashboard();
}

function handleFieldsActionClick() {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  if (currentRole === 'manager') {
    openRegisterFieldPlotModal();
  } else {
    openRegisterBlockFarmModal();
  }
}

function openRegisterFieldPlotModal() {
  const modal = document.getElementById('modal-register-block-farm');
  if (!modal) return;
  activeEditingBlockFarmName = null;

  const db = getDB();
  const nextPlotNum = db.fields.length + 1;
  const plotId = `FLD-KTR-${String(nextPlotNum).padStart(3, '0')}`;

  const badgeEl = document.getElementById('dash-modal-farm-badge');
  const titleEl = document.getElementById('dash-modal-farm-title');
  const subEl = document.getElementById('dash-modal-farm-sub');
  const submitBtn = document.getElementById('dash-modal-farm-submit-btn');

  const lblPlotId = document.getElementById('dash-modal-lbl-farm-plot-id');
  const lblCluster = document.getElementById('dash-modal-lbl-farm-cluster');
  const displayCluster = document.getElementById('dash-modal-display-cluster');
  const nameWrapper = document.getElementById('dash-modal-farm-name-wrapper');
  const lblContact = document.getElementById('dash-modal-lbl-farm-contact');
  const subContact = document.getElementById('dash-modal-sub-farm-contact');
  const lblHa = document.getElementById('dash-modal-lbl-farm-ha');

  const contactEl = document.getElementById('dash-farm-contact');
  const haEl = document.getElementById('dash-farm-ha');
  const plotIdEl = document.getElementById('dash-farm-plot-id');
  const plotIdDisplayEl = document.getElementById('dash-farm-plot-id-display');
  const plotIdBadgeEl = document.getElementById('dash-farm-plot-id-badge');

  if (badgeEl) {
    badgeEl.textContent = 'Field Plot Allocation';
    badgeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-black bg-primary-bg text-primary uppercase tracking-wider';
  }
  if (titleEl) {
    const s = titleEl.querySelector('span');
    if (s) s.textContent = 'Register New Field Plot';
  }
  if (subEl) subEl.textContent = 'Enroll a new field plot under Block Farm A and assign an approved member farmer.';

  if (lblPlotId) lblPlotId.textContent = 'Field Plot ID';
  if (lblCluster) lblCluster.textContent = 'Block Farm';
  if (displayCluster) displayCluster.textContent = 'Block Farm A';

  if (nameWrapper) nameWrapper.classList.add('hidden');

  if (lblContact) lblContact.innerHTML = 'Assigned Member User ID <span class="text-danger">*</span>';
  if (subContact) subContact.textContent = 'Enter the registered User ID (contact number) of the member farmer managing this field plot.';
  if (contactEl) { contactEl.value = ''; contactEl.placeholder = 'e.g. 0917-654-3210'; }

  if (lblHa) lblHa.innerHTML = 'Declared Land Area (Hectares) <span class="text-danger">*</span>';
  if (haEl) { haEl.value = ''; haEl.placeholder = 'e.g. 1.5'; }

  if (plotIdEl) plotIdEl.value = plotId;
  if (plotIdDisplayEl) plotIdDisplayEl.textContent = plotId;
  if (plotIdBadgeEl) plotIdBadgeEl.textContent = 'Auto-generated';

  if (submitBtn) submitBtn.innerHTML = '<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Register Field Plot';

  modal.classList.remove('hidden');
}

function openEditBlockFarmModal(farmName) {
  openRegisterBlockFarmModal(farmName);
}

function openRegisterBlockFarmModal(farmNameToEdit = null) {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  if (!farmNameToEdit && currentRole === 'manager') {
    openRegisterFieldPlotModal();
    return;
  }

  const modal = document.getElementById('modal-register-block-farm');
  if (!modal) return;

  const badgeEl = document.getElementById('dash-modal-farm-badge');
  const titleEl = document.getElementById('dash-modal-farm-title');
  const subEl = document.getElementById('dash-modal-farm-sub');
  const submitBtn = document.getElementById('dash-modal-farm-submit-btn');

  const lblPlotId = document.getElementById('dash-modal-lbl-farm-plot-id');
  const lblCluster = document.getElementById('dash-modal-lbl-farm-cluster');
  const displayCluster = document.getElementById('dash-modal-display-cluster');
  const nameWrapper = document.getElementById('dash-modal-farm-name-wrapper');
  const lblName = document.getElementById('dash-modal-lbl-farm-name');
  const lblContact = document.getElementById('dash-modal-lbl-farm-contact');
  const subContact = document.getElementById('dash-modal-sub-farm-contact');
  const lblHa = document.getElementById('dash-modal-lbl-farm-ha');

  const nameEl = document.getElementById('dash-farm-name');
  const contactEl = document.getElementById('dash-farm-contact');
  const haEl = document.getElementById('dash-farm-ha');
  const plotIdEl = document.getElementById('dash-farm-plot-id');
  const plotIdDisplayEl = document.getElementById('dash-farm-plot-id-display');
  const plotIdBadgeEl = document.getElementById('dash-farm-plot-id-badge');

  if (nameWrapper) nameWrapper.classList.remove('hidden');
  if (lblCluster) lblCluster.textContent = 'District Cluster';
  if (displayCluster) displayCluster.textContent = 'SRA District VII';

  if (farmNameToEdit) {
    activeEditingBlockFarmName = farmNameToEdit;
    const db = getDB();
    const manager = db.users.find(u => u.role === 'Farm Manager' && u.blockFarm === farmNameToEdit);
    const farmPlots = db.fields.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === farmNameToEdit);
    const totalHa = farmPlots.reduce((s, f) => s + (Number(f.ha || f.area) || 0), 0);
    const blockCode = getBlockId(farmNameToEdit);

    if (badgeEl) {
      badgeEl.textContent = 'Cooperative Cluster Configuration';
      badgeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-black bg-primary-bg text-primary uppercase tracking-wider';
    }
    if (titleEl) { const s = titleEl.querySelector('span'); if (s) s.textContent = `Edit Block Farm: ${farmNameToEdit}`; }
    if (subEl) subEl.textContent = `Modify cooperative cluster details, hectares, and assigned Farm Manager for ${farmNameToEdit}.`;
    
    if (lblPlotId) lblPlotId.textContent = 'Block Farm Code';
    if (lblName) lblName.innerHTML = 'Block Farm Cooperative Name <span class="text-danger">*</span>';
    if (lblContact) lblContact.innerHTML = 'Assigned Farm Manager User ID <span class="text-danger">*</span>';
    if (subContact) subContact.textContent = 'Enter the registered User ID (contact number) of the farm manager supervising this block.';
    if (lblHa) lblHa.innerHTML = 'Total Declared Hectarage (Ha) <span class="text-danger">*</span>';

    if (submitBtn) submitBtn.innerHTML = '<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Save Block Farm Changes';

    if (nameEl) nameEl.value = farmNameToEdit;
    if (contactEl) contactEl.value = manager ? manager.contact : '';
    if (haEl) haEl.value = totalHa > 0 ? totalHa.toFixed(1) : '20.0';
    if (plotIdEl) plotIdEl.value = blockCode;
    if (plotIdDisplayEl) plotIdDisplayEl.textContent = blockCode;
    if (plotIdBadgeEl) plotIdBadgeEl.textContent = 'Immutable';
  } else {
    activeEditingBlockFarmName = null;
    const db = getDB();
    if (badgeEl) {
      badgeEl.textContent = 'Spatial District Aggregation';
      badgeEl.className = 'px-2 py-0.5 rounded-full text-[10px] font-black bg-[#1A6B9A]/15 text-[#1A6B9A] uppercase tracking-wider';
    }
    if (titleEl) { const s = titleEl.querySelector('span'); if (s) s.textContent = 'Register New Block Farm Entity'; }
    if (subEl) subEl.textContent = 'Enroll a new cooperative cluster under SRA Sugar District VII oversight.';
    
    if (lblPlotId) lblPlotId.textContent = 'Block Farm Code';
    if (lblName) lblName.innerHTML = 'Block Farm Cooperative Name <span class="text-danger">*</span>';
    if (lblContact) lblContact.innerHTML = 'Assigned Farm Manager User ID <span class="text-danger">*</span>';
    if (subContact) subContact.textContent = 'Enter the registered User ID (contact number) of the farm manager supervising this block.';
    if (lblHa) lblHa.innerHTML = 'Total Declared Hectarage (Ha) <span class="text-danger">*</span>';

    if (submitBtn) submitBtn.innerHTML = '<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Register Block Farm';

    const existingFarms = Array.from(new Set(db.fields.map(f => f.blockFarm || getBlockFarmName(f.id))));
    const nextCodeLetter = String.fromCharCode(65 + existingFarms.length);
    const newBlockCode = `BLK-${nextCodeLetter}`;

    if (nameEl) nameEl.value = '';
    if (contactEl) contactEl.value = '';
    if (haEl) { haEl.value = ''; haEl.placeholder = 'e.g. 20.0'; }
    if (plotIdEl) plotIdEl.value = newBlockCode;
    if (plotIdDisplayEl) plotIdDisplayEl.textContent = newBlockCode;
    if (plotIdBadgeEl) plotIdBadgeEl.textContent = 'Auto-generated';
  }

  modal.classList.remove('hidden');
}

function closeRegisterBlockFarmModal() {
  const modal = document.getElementById('modal-register-block-farm');
  if (modal) modal.classList.add('hidden');
  activeEditingBlockFarmName = null;
}

function submitRegisterBlockFarmFromDashboard() {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const isManager = currentRole === 'manager';

  const nameEl = document.getElementById('dash-farm-name');
  const contactEl = document.getElementById('dash-farm-contact');
  const haEl = document.getElementById('dash-farm-ha');
  const plotIdEl = document.getElementById('dash-farm-plot-id');

  const farmName = isManager ? 'Block Farm A' : (nameEl ? nameEl.value.trim() : '');
  const contact = contactEl ? contactEl.value.trim() : '';
  const ha = haEl ? parseFloat(haEl.value) : NaN;
  const blockCodeOrPlotId = plotIdEl ? plotIdEl.value.trim() : '';

  if (!farmName || !contact || isNaN(ha) || !blockCodeOrPlotId) {
    toast('Error: Please fill in all required registration fields.');
    return;
  }

  const db = getDB();
  const existingUser = db.users.find(u => u.contact === contact);
  const resolvedName = existingUser ? existingUser.name : `Farmer ${contact.slice(-4)}`;

  if (isManager) {
    // Farm Manager enrolling a new Field Plot under Block Farm A
    db.fields.push({
      id: blockCodeOrPlotId,
      member: resolvedName,
      owner: resolvedName,
      ha: ha,
      area: ha,
      stage: 'Land Preparation',
      age: '0.1 months',
      synced: true,
      lastSync: 'Just now',
      lag: 'Synced',
      blockFarm: 'Block Farm A',
      customStages: []
    });

    if (!existingUser) {
      db.users.push({
        contact: contact,
        name: resolvedName,
        role: 'Member',
        blockFarm: 'Block Farm A',
        fieldId: blockCodeOrPlotId,
        logsHandled: 0,
        regDate: new Date().toISOString().split('T')[0]
      });
    } else {
      if (!existingUser.fieldId) existingUser.fieldId = blockCodeOrPlotId;
      if (!existingUser.blockFarm) existingUser.blockFarm = 'Block Farm A';
    }

    saveDB(db);
    closeRegisterBlockFarmModal();
    logSystemEvent(
      'plot',
      'Field Plot Enrolled',
      `${blockCodeOrPlotId}`,
      `New field plot allocated to User ID: ${contact} (${resolvedName}) · ${ha} Ha in Block Farm A.`,
      'Farm Manager Jose Reyes',
      'Approved'
    );
    toast(`Success: Field plot ${blockCodeOrPlotId} (${ha} Ha) assigned to User ID: ${contact}!`);
  } else if (activeEditingBlockFarmName) {
    // SRA Admin editing existing block farm
    const oldFarmName = activeEditingBlockFarmName;
    
    // Update existing fields in that block
    db.fields.forEach(f => {
      if ((f.blockFarm || getBlockFarmName(f.id)) === oldFarmName) {
        f.blockFarm = farmName;
      }
    });

    // Update / Reassign Farm Manager in user directory
    let existingMgr = db.users.find(u => u.role === 'Farm Manager' && u.blockFarm === oldFarmName);
    if (existingMgr) {
      existingMgr.contact = contact;
      existingMgr.blockFarm = farmName;
      if (existingUser && existingUser.name) existingMgr.name = existingUser.name;
    } else {
      let userByContact = db.users.find(u => u.contact === contact);
      if (userByContact) {
        userByContact.role = 'Farm Manager';
        userByContact.blockFarm = farmName;
      } else {
        db.users.push({
          contact: contact,
          name: resolvedName,
          role: 'Farm Manager',
          blockFarm: farmName,
          fieldId: blockCodeOrPlotId,
          logsHandled: 0,
          regDate: new Date().toISOString().split('T')[0]
        });
      }
    }

    saveDB(db);
    closeRegisterBlockFarmModal();
    logSystemEvent(
      'plot',
      'Block Farm Reassigned',
      `${farmName}`,
      `Farm Manager User ID set to ${contact} (${resolvedName}) for ${farmName} (${ha.toFixed(1)} Ha).`,
      'SRA District Administrator',
      'Approved'
    );
    toast(`Block Farm ${farmName} updated with Manager User ID: ${contact}!`);
  } else {
    // SRA Admin registering new block farm
    const newPlotId = `FLD-KTR-${String(db.fields.length + 1).padStart(3, '0')}`;
    
    db.fields.push({
      id: newPlotId,
      member: resolvedName,
      owner: resolvedName,
      ha: ha,
      area: ha,
      stage: 'Land Preparation',
      age: '0.1 months',
      synced: true,
      lastSync: 'Just now',
      lag: 'Synced',
      blockFarm: farmName,
      customStages: []
    });

    if (existingUser) {
      existingUser.role = 'Farm Manager';
      existingUser.blockFarm = farmName;
    } else {
      db.users.push({
        contact: contact,
        name: resolvedName,
        role: 'Farm Manager',
        blockFarm: farmName,
        fieldId: newPlotId,
        logsHandled: 0,
        regDate: new Date().toISOString().split('T')[0]
      });
    }

    saveDB(db);
    closeRegisterBlockFarmModal();
    logSystemEvent(
      'plot',
      'New Block Farm Enrolled',
      `${farmName} (${newPlotId})`,
      `Enrolled under supervision of Farm Manager User ID: ${contact} (${resolvedName}) with ${ha.toFixed(1)} Ha.`,
      'SRA District Administrator',
      'Approved'
    );
    toast(`Successfully registered ${farmName} under Manager User ID: ${contact}!`);
  }

  renderFields();
  renderUsers();
  renderDashboard();
}

function loadFieldForEdit(fieldId) {
  const db = getDB();
  const f = db.fields.find(field => field.id === fieldId);
  if (!f) return;

  const farmName = f.blockFarm || getBlockFarmName(f.id);
  openRegisterBlockFarmModal(farmName);
}

function showNewFieldForm() {
  openRegisterBlockFarmModal();
}

function archiveBlockFarm(blockFarmName) {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  if (currentRole !== 'superadmin' && currentRole !== 'admin') {
    toast('Access Denied: Requires SRA (Admin) or Super Admin clearance.');
    return;
  }
  if (!confirm(`Are you sure you want to archive ${blockFarmName}?`)) return;

  const db = getDB();
  db.fields = db.fields.filter(f => (f.blockFarm || getBlockFarmName(f.id)) !== blockFarmName);
  saveDB(db);
  renderFields();
  renderDashboard();
  toast(`${blockFarmName} archived successfully.`);
}

// ── TAB-SPECIFIC TOP-BAR HISTORY CONTROLLER ──────────────────
let currentTabHistModule = 'plot';
let currentTabHistFilter = 'all';
let tabHistCurrentPage = 1;
const TAB_HIST_PER_PAGE = 5;

function setTabHistoryPage(p) {
  tabHistCurrentPage = p;
  renderTabHistory();
}

function openTabHistoryModal(moduleType) {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const isManager = currentRole === 'manager';

  currentTabHistModule = moduleType;
  currentTabHistFilter = 'all';
  tabHistCurrentPage = 1;

  const modal = document.getElementById('modal-tab-history');
  if (!modal) return;

  const badgeEl = document.getElementById('tab-hist-badge');
  const titleEl = document.getElementById('tab-hist-title');
  const subEl = document.getElementById('tab-hist-sub');
  const chipsContainer = document.getElementById('tab-hist-filter-chips');
  const searchInput = document.getElementById('tab-hist-search');
  if (searchInput) searchInput.value = '';

  if (moduleType === 'plot') {
    if (isManager) {
      if (badgeEl) badgeEl.textContent = 'Block Farm A · Plot Registry History';
      if (titleEl) titleEl.textContent = 'Block Farm A · Field Plot Allocation & Registration History';
      if (subEl) subEl.textContent = 'Audit trail of farmer assignments, plot enrollments, and land transfers for Block Farm A';
      if (chipsContainer) {
        chipsContainer.innerHTML = `
          <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-primary bg-primary text-white transition-all cursor-pointer" data-filter="all" onclick="setTabHistoryFilter('all')">All Plot Events</button>
          <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer" data-filter="registered" onclick="setTabHistoryFilter('registered')">Plot Registrations</button>
          <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer" data-filter="updated" onclick="setTabHistoryFilter('updated')">Edits &amp; Transfers</button>
          <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer" data-filter="archived" onclick="setTabHistoryFilter('archived')">Archived Plots</button>
        `;
      }
    } else {
      if (badgeEl) badgeEl.textContent = 'SRA District VII Cooperative History';
      if (titleEl) titleEl.textContent = 'District VII · Block Farm Cooperative Lifecycle & Registration History';
      if (subEl) subEl.textContent = 'Regulatory overview of cooperative block farm enrollments, manager assignments, and district certifications';
      if (chipsContainer) {
        chipsContainer.innerHTML = `
          <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-primary bg-primary text-white transition-all cursor-pointer" data-filter="all" onclick="setTabHistoryFilter('all')">All Block Events</button>
          <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer" data-filter="block" onclick="setTabHistoryFilter('block')">Block Farm Enrolled</button>
          <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer" data-filter="registered" onclick="setTabHistoryFilter('registered')">Plot Allocations</button>
          <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer" data-filter="archived" onclick="setTabHistoryFilter('archived')">Archived</button>
        `;
      }
    }
  } else if (moduleType === 'operation') {
    if (badgeEl) badgeEl.textContent = 'Operations & Edits History';
    if (titleEl) titleEl.textContent = 'Field Operations & Manager Corrections Ledger';
    if (subEl) subEl.textContent = 'Chronological record of submitted activities, manager edits/typo corrections, and take over advances';
    if (chipsContainer) {
      chipsContainer.innerHTML = `
        <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-primary bg-primary text-white transition-all cursor-pointer" data-filter="all" onclick="setTabHistoryFilter('all')">All Operations</button>
        <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer" data-filter="correction" onclick="setTabHistoryFilter('correction')">Manager Corrections</button>
        <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer" data-filter="takeover" onclick="setTabHistoryFilter('takeover')">Take Over Entries</button>
        <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer" data-filter="member" onclick="setTabHistoryFilter('member')">Member Submissions</button>
      `;
    }
  } else if (moduleType === 'user') {
    if (badgeEl) badgeEl.textContent = 'User Management History';
    if (titleEl) titleEl.textContent = 'User Authorizations & Access Credential History';
    if (subEl) subEl.textContent = 'Audit trail of registrations approved, declined applications, and revoked member credentials';
    if (chipsContainer) {
      chipsContainer.innerHTML = `
        <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-primary bg-primary text-white transition-all cursor-pointer" data-filter="all" onclick="setTabHistoryFilter('all')">All User Events</button>
        <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer" data-filter="approved" onclick="setTabHistoryFilter('approved')">Approved Registrations</button>
        <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer" data-filter="rejected" onclick="setTabHistoryFilter('rejected')">Declined Applications</button>
        <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer" data-filter="revoked" onclick="setTabHistoryFilter('revoked')">Revocations</button>
      `;
    }
  } else if (moduleType === 'sra') {
    if (badgeEl) badgeEl.textContent = 'SRA Compliance & Audit History';
    if (titleEl) titleEl.textContent = 'SRA Compliance & QR Audit Trail';
    if (subEl) subEl.textContent = 'Audit trail of encrypted QR verifications, certified compliance reports, and SRA regulatory events';
    if (chipsContainer) {
      chipsContainer.innerHTML = `
        <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-primary bg-primary text-white transition-all cursor-pointer" data-filter="all" onclick="setTabHistoryFilter('all')">All SRA Audit Events</button>
        <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer" data-filter="audit" onclick="setTabHistoryFilter('audit')">Certified QR Audits</button>
        <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer" data-filter="price" onclick="setTabHistoryFilter('price')">Price Benchmarks</button>
      `;
    }
  }

  renderTabHistory();
  modal.classList.remove('hidden');
}

function closeTabHistoryModal() {
  const modal = document.getElementById('modal-tab-history');
  if (modal) modal.classList.add('hidden');
}

function setTabHistoryFilter(filter) {
  currentTabHistFilter = filter;
  tabHistCurrentPage = 1;
  document.querySelectorAll('#tab-hist-filter-chips .tab-hist-chip').forEach(c => {
    const isActive = c.getAttribute('data-filter') === filter;
    c.className = isActive
      ? 'tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-primary bg-primary text-white transition-all cursor-pointer'
      : 'tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer';
  });
  renderTabHistory();
}

function renderTabHistory() {
  const db = getDB();
  const allHistory = db.systemHistory || [];
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const isManager = currentRole === 'manager';

  // Filter by active module
  let moduleEvents = [];
  if (currentTabHistModule === 'plot') {
    if (isManager) {
      moduleEvents = allHistory.filter(h => 
        (h.category === 'plot' || h.category === 'user') &&
        ((h.details && (h.details.includes('Block Farm A') || h.details.includes('FLD-KTR'))) || (h.actor && h.actor.includes('Jose Reyes')))
      );
    } else {
      // SRA Admin sees Block Farm registrations and all cooperative land events across district
      moduleEvents = allHistory.filter(h => h.category === 'block' || h.category === 'plot' || h.eventType.toLowerCase().includes('block'));
    }
  } else if (currentTabHistModule === 'sra' && allHistory.filter(h => h.category === 'sra').length === 0) {
    moduleEvents = allHistory.filter(h => h.category === 'price' || h.eventType.toLowerCase().includes('audit') || h.details.toLowerCase().includes('audit'));
  } else {
    moduleEvents = allHistory.filter(h => h.category === currentTabHistModule);
  }

  // Sub-filter by filter chips
  if (currentTabHistFilter !== 'all') {
    if (currentTabHistFilter === 'block') {
      moduleEvents = moduleEvents.filter(h => h.category === 'block' || h.eventType.toLowerCase().includes('block'));
    } else if (currentTabHistFilter === 'registered') {
      moduleEvents = moduleEvents.filter(h => h.eventType.toLowerCase().includes('register') || h.eventType.toLowerCase().includes('enrolled'));
    } else if (currentTabHistFilter === 'updated') {
      moduleEvents = moduleEvents.filter(h => h.eventType.toLowerCase().includes('update') || h.eventType.toLowerCase().includes('transfer'));
    } else if (currentTabHistFilter === 'archived') {
      moduleEvents = moduleEvents.filter(h => h.eventType.toLowerCase().includes('archive') || h.status === 'Archived');
    } else if (currentTabHistFilter === 'correction') {
      moduleEvents = moduleEvents.filter(h => h.eventType.toLowerCase().includes('correction'));
    } else if (currentTabHistFilter === 'takeover') {
      moduleEvents = moduleEvents.filter(h => h.eventType.toLowerCase().includes('take over'));
    } else if (currentTabHistFilter === 'member') {
      moduleEvents = moduleEvents.filter(h => h.eventType.toLowerCase().includes('member') || h.actor.toLowerCase().includes('member'));
    } else if (currentTabHistFilter === 'approved') {
      moduleEvents = moduleEvents.filter(h => h.status === 'Approved' || h.eventType.toLowerCase().includes('approved'));
    } else if (currentTabHistFilter === 'rejected') {
      moduleEvents = moduleEvents.filter(h => h.status === 'Rejected' || h.eventType.toLowerCase().includes('declined') || h.eventType.toLowerCase().includes('rejected'));
    } else if (currentTabHistFilter === 'revoked') {
      moduleEvents = moduleEvents.filter(h => h.status === 'Revoked' || h.eventType.toLowerCase().includes('revoked'));
    } else if (currentTabHistFilter === 'audit') {
      moduleEvents = moduleEvents.filter(h => h.eventType.toLowerCase().includes('audit') || h.eventType.toLowerCase().includes('verify') || h.details.toLowerCase().includes('audit'));
    } else if (currentTabHistFilter === 'price') {
      moduleEvents = moduleEvents.filter(h => h.eventType.toLowerCase().includes('price') || h.details.toLowerCase().includes('price'));
    }
  }

  // Live search query
  const searchInput = document.getElementById('tab-hist-search');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  if (query) {
    moduleEvents = moduleEvents.filter(h =>
      (h.id || '').toLowerCase().includes(query) ||
      (h.eventType || '').toLowerCase().includes(query) ||
      (h.entity || '').toLowerCase().includes(query) ||
      (h.details || '').toLowerCase().includes(query) ||
      (h.actor || '').toLowerCase().includes(query)
    );
  }

  const countEl = document.getElementById('tab-hist-count');
  if (countEl) countEl.textContent = `${moduleEvents.length} Record${moduleEvents.length === 1 ? '' : 's'}`;

  const totalTabHistItems = moduleEvents.length;
  const totalTabHistPages = Math.ceil(totalTabHistItems / TAB_HIST_PER_PAGE) || 1;
  if (tabHistCurrentPage > totalTabHistPages) tabHistCurrentPage = 1;

  const tabStartIdx = (tabHistCurrentPage - 1) * TAB_HIST_PER_PAGE;
  const pagedTabEvents = moduleEvents.slice(tabStartIdx, tabStartIdx + TAB_HIST_PER_PAGE);

  const tbody = document.getElementById('tab-hist-tbody');
  if (!tbody) return;

  if (totalTabHistItems === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-xs text-hug-muted">No historical records matched your criteria.</td></tr>';
  } else {
    tbody.innerHTML = pagedTabEvents.map(h => {
      let statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-bg text-hug-text border border-border">${h.status || 'Recorded'}</span>`;
      if (h.status === 'Approved' || h.status === 'Verified' || h.status === 'Recorded' || h.status === 'Enrolled') {
        statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success border border-success/20">${h.status}</span>`;
      } else if (h.status === 'Revoked' || h.status === 'Rejected' || h.status === 'Archived') {
        statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger-bg text-danger border border-danger/20">${h.status}</span>`;
      }

      return `
        <tr class="hover:bg-bg/40 transition-colors">
          <td class="px-4 py-2.5 text-xs text-hug-muted font-medium whitespace-nowrap">${h.timestamp}</td>
          <td class="px-4 py-2.5">
            <strong class="font-bold text-xs text-hug-text block">${h.eventType}</strong>
            <span class="text-[10px] text-hug-muted font-mono">${h.id}</span>
          </td>
          <td class="px-4 py-2.5 text-xs font-semibold text-primary">${h.entity}</td>
          <td class="px-4 py-2.5 text-xs text-hug-text2 max-w-sm leading-relaxed">${h.details}</td>
          <td class="px-4 py-2.5 text-xs font-medium text-hug-text whitespace-nowrap">${h.actor}</td>
          <td class="px-4 py-2.5">${statusBadge}</td>
        </tr>
      `;
    }).join('');
  }

  // Render Tab History Modal Pagination Controls
  const tabHistPagEl = document.getElementById('tab-hist-pagination');
  if (tabHistPagEl) {
    if (totalTabHistPages <= 1) {
      tabHistPagEl.innerHTML = '';
      tabHistPagEl.classList.add('hidden');
    } else {
      tabHistPagEl.classList.remove('hidden');
      tabHistPagEl.innerHTML = 
        `<button onclick="setTabHistoryPage(${tabHistCurrentPage - 1})" ${tabHistCurrentPage === 1 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} class="px-3 py-1 bg-white border border-border rounded-lg text-xs font-semibold cursor-pointer text-hug-text2 hover:text-primary hover:border-primary transition-all">Prev</button>` +
        `<span class="text-xs font-semibold text-hug-text2">Page ${tabHistCurrentPage} of ${totalTabHistPages}</span>` +
        `<button onclick="setTabHistoryPage(${tabHistCurrentPage + 1})" ${tabHistCurrentPage === totalTabHistPages ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} class="px-3 py-1 bg-white border border-border rounded-lg text-xs font-semibold cursor-pointer text-hug-text2 hover:text-primary hover:border-primary transition-all">Next</button>`;
    }
  }
}

function exportTabHistoryCSV() {
  const db = getDB();
  const allHistory = db.systemHistory || [];
  const moduleEvents = allHistory.filter(h => h.category === currentTabHistModule);
  if (moduleEvents.length === 0) {
    toast('No records to export for this module.');
    return;
  }

  const headers = ['Audit ID', 'Timestamp', 'Event Type', 'Target Entity', 'Details', 'Actor', 'Status'];
  const rows = moduleEvents.map(h => [
    h.id,
    `"${h.timestamp}"`,
    `"${h.eventType}"`,
    `"${h.entity}"`,
    `"${(h.details || '').replace(/"/g, '""')}"`,
    `"${h.actor}"`,
    `"${h.status}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `HUGPONG_${currentTabHistModule.toUpperCase()}_History_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast(`Exported ${currentTabHistModule} history to CSV.`);
}

function logSystemEvent(category, eventType, entity, details, actor, status = 'Recorded') {
  const db = getDB();
  db.systemHistory = db.systemHistory || [];
  const currentRole = localStorage.getItem('hugpong_role') || 'manager';
  const defaultActor = currentRole === 'manager' ? 'Farm Manager Jose Reyes' : (currentRole === 'superadmin' ? 'Super Admin' : 'SRA Admin');
  
  let catLabel = 'System';
  if (category === 'operation') catLabel = 'Field Operation';
  else if (category === 'plot') catLabel = 'Plot Registry';
  else if (category === 'user') catLabel = 'User Management';
  else if (category === 'sra') catLabel = 'SRA Price / Audit';

  const newEvent = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toLocaleString('en-PH', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    category,
    categoryLabel: catLabel,
    eventType,
    entity,
    details,
    actor: actor || defaultActor,
    status
  };

  db.systemHistory.unshift(newEvent);
  saveDB(db);
}

function setHistoryCategory(cat) {
  historyActiveCategory = cat;
  historyCurrentPage = 1;
  
  const typeFilter = document.getElementById('hist-filter-type');
  if (typeFilter) {
    if (cat === 'all') typeFilter.value = 'all';
    else if (cat === 'block') typeFilter.value = 'Block Farm';
    else if (cat === 'plot') typeFilter.value = 'Field Plot';
    else if (cat === 'operation') typeFilter.value = 'Field Operation';
    else if (cat === 'user') typeFilter.value = 'User Management';
    else if (cat === 'sra') typeFilter.value = 'SRA Price';
  }

  document.querySelectorAll('#hist-category-chips .hist-chip').forEach(c => {
    const isActive = c.getAttribute('data-cat') === cat;
    c.className = isActive
      ? 'hist-chip text-xs font-semibold px-3.5 py-1.5 rounded-full border border-primary bg-primary text-white transition-all cursor-pointer shadow-xs'
      : 'hist-chip text-xs font-semibold px-3.5 py-1.5 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer';
  });

  renderHistory();
}

function onTypeFilterChange() {
  const typeFilter = document.getElementById('hist-filter-type');
  const val = typeFilter ? typeFilter.value : 'all';
  historyCurrentPage = 1;
  if (val === 'all') historyActiveCategory = 'all';
  else if (val === 'Block Farm') historyActiveCategory = 'block';
  else if (val === 'Field Plot') historyActiveCategory = 'plot';
  else if (val === 'Field Operation') historyActiveCategory = 'operation';
  else if (val === 'User Management') historyActiveCategory = 'user';
  else if (val === 'SRA Price') historyActiveCategory = 'sra';

  document.querySelectorAll('#hist-category-chips .hist-chip').forEach(c => {
    const isActive = c.getAttribute('data-cat') === historyActiveCategory;
    c.className = isActive
      ? 'hist-chip text-xs font-semibold px-3.5 py-1.5 rounded-full border border-primary bg-primary text-white transition-all cursor-pointer shadow-xs'
      : 'hist-chip text-xs font-semibold px-3.5 py-1.5 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer';
  });

  renderHistory();
}

function renderHistory() {
  const db = getDB();
  
  // Aggregate Registry History & System History
  const regItems = (db.registryHistory || []).map(r => ({
    id: r.id,
    timestamp: r.date,
    category: r.entityType === 'Block Farm' ? 'block' : 'plot',
    categoryLabel: r.entityType,
    entityType: r.entityType,
    entity: `${r.name} (${r.entityId})`,
    person: r.manager || r.member || 'Assigned Lead',
    area: `${r.ha} Ha`,
    details: `${r.action} (${r.ha} Ha)`,
    actor: r.authority || 'SRA District VII',
    status: 'Enrolled'
  }));

  const sysItems = (db.systemHistory || []).map(s => {
    let eType = 'Field Operation';
    if (s.category === 'plot') eType = 'Field Plot';
    else if (s.category === 'user') eType = 'User Management';
    else if (s.category === 'sra') eType = 'SRA Price';
    return {
      id: s.id,
      timestamp: s.timestamp,
      category: s.category,
      categoryLabel: s.categoryLabel || eType,
      entityType: eType,
      entity: s.entity,
      person: s.actor || 'Authorized Personnel',
      area: s.category === 'plot' ? '1.5 Ha' : 'Operational Scope',
      details: s.details,
      actor: s.actor || 'Regulatory Authority',
      status: s.status || 'Recorded'
    };
  });

  const allItems = [...regItems, ...sysItems];

  // Update Summary KPI Stats
  const statArea = document.getElementById('hist-stat-area');
  const statBlocks = document.getElementById('hist-stat-blocks');
  const statPlots = document.getElementById('hist-stat-plots');
  const statEvents = document.getElementById('hist-stat-events');
  const recordCountEl = document.getElementById('hist-records-count');

  if (statArea) statArea.textContent = '16.4 Ha';
  if (statBlocks) statBlocks.textContent = '4 Block Farms';
  if (statPlots) statPlots.textContent = '10 Plots';
  if (statEvents) statEvents.textContent = `${allItems.length} Records`;

  // Search & Filter Inputs
  const searchInput = document.getElementById('hist-search');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const typeFilter = document.getElementById('hist-filter-type');
  const selectedType = typeFilter ? typeFilter.value : 'all';

  let filtered = [...allItems];

  // Category Chip Filter
  if (historyActiveCategory && historyActiveCategory !== 'all') {
    if (historyActiveCategory === 'block') {
      filtered = filtered.filter(h => h.category === 'block' || h.entityType === 'Block Farm');
    } else if (historyActiveCategory === 'plot') {
      filtered = filtered.filter(h => h.category === 'plot' || h.entityType === 'Field Plot');
    } else if (historyActiveCategory === 'operation') {
      filtered = filtered.filter(h => h.category === 'operation' || h.entityType === 'Field Operation');
    } else if (historyActiveCategory === 'user') {
      filtered = filtered.filter(h => h.category === 'user' || h.entityType === 'User Management');
    } else if (historyActiveCategory === 'sra') {
      filtered = filtered.filter(h => h.category === 'sra' || h.entityType === 'SRA Price');
    }
  }

  // Type Dropdown Filter
  if (selectedType !== 'all') {
    filtered = filtered.filter(h => (h.entityType || '').toLowerCase() === selectedType.toLowerCase());
  }

  // Live Query
  if (query) {
    filtered = filtered.filter(h =>
      (h.id || '').toLowerCase().includes(query) ||
      (h.timestamp || '').toLowerCase().includes(query) ||
      (h.entityType || '').toLowerCase().includes(query) ||
      (h.entity || '').toLowerCase().includes(query) ||
      (h.person || '').toLowerCase().includes(query) ||
      (h.area || '').toLowerCase().includes(query) ||
      (h.details || '').toLowerCase().includes(query) ||
      (h.actor || '').toLowerCase().includes(query) ||
      (h.status || '').toLowerCase().includes(query)
    );
  }

  if (recordCountEl) recordCountEl.textContent = `${filtered.length} Total Records`;

  const totalHistItems = filtered.length;
  const totalHistPages = Math.ceil(totalHistItems / historyItemsPerPage) || 1;
  if (historyCurrentPage > totalHistPages) historyCurrentPage = 1;

  const startIdx = (historyCurrentPage - 1) * historyItemsPerPage;
  const pagedHistory = filtered.slice(startIdx, startIdx + historyItemsPerPage);

  const tbody = document.getElementById('history-table-body');
  if (!tbody) return;

  if (totalHistItems === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center py-10 text-xs text-hug-muted">No historical records matched your criteria.</td></tr>';
  } else {
    tbody.innerHTML = pagedHistory.map(h => {
      let catDot = 'bg-primary';
      let catBg = 'bg-primary-bg text-primary border-primary/20';
      if (h.category === 'block') { catDot = 'bg-farm-blue'; catBg = 'bg-farm-blue-bg text-farm-blue border-farm-blue/20'; }
      else if (h.category === 'plot') { catDot = 'bg-success'; catBg = 'bg-success-bg text-success border-success/20'; }
      else if (h.category === 'user') { catDot = 'bg-accent'; catBg = 'bg-accent text-hug-text border-accent'; }
      else if (h.category === 'sra') { catDot = 'bg-farm-blue'; catBg = 'bg-farm-blue-bg text-farm-blue border-farm-blue/20'; }

      let statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-bg text-hug-text border border-border">${h.status || 'Recorded'}</span>`;
      if (h.status === 'Approved' || h.status === 'Verified' || h.status === 'Completed' || h.status === 'Enrolled') {
        statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success border border-success/20">${h.status}</span>`;
      } else if (h.status === 'Revoked' || h.status === 'Rejected' || h.status === 'Archived') {
        statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-danger-bg text-danger border border-danger/20">${h.status}</span>`;
      }

      return `
        <tr class="hover:bg-bg/40 transition-colors">
          <td class="px-4 py-3 text-xs whitespace-nowrap">
            <span class="font-mono font-bold text-hug-text block">${h.id}</span>
            <span class="text-[10px] text-hug-muted">${h.timestamp}</span>
          </td>
          <td class="px-4 py-3">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${catBg}">
              <span class="w-1.5 h-1.5 rounded-full ${catDot}"></span>
              ${h.categoryLabel || h.entityType}
            </span>
          </td>
          <td class="px-4 py-3 font-semibold text-xs text-hug-text">${h.entity}</td>
          <td class="px-4 py-3 text-xs text-hug-text2">${h.person}</td>
          <td class="px-4 py-3 text-xs font-mono font-medium text-hug-text">${h.area}</td>
          <td class="px-4 py-3 text-xs text-hug-text2 max-w-sm leading-relaxed">${h.details}</td>
          <td class="px-4 py-3 text-xs font-medium text-hug-text whitespace-nowrap">${h.actor}</td>
          <td class="px-4 py-3">${statusBadge}</td>
        </tr>
      `;
    }).join('');
  }

  // Render History Pagination Controls
  const histPagEl = document.getElementById('history-pagination');
  if (histPagEl) {
    if (totalHistPages <= 1) {
      histPagEl.innerHTML = '';
      histPagEl.classList.add('hidden');
    } else {
      histPagEl.classList.remove('hidden');
      histPagEl.innerHTML = 
        `<button onclick="setHistoryPage(${historyCurrentPage - 1})" ${historyCurrentPage === 1 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} class="px-3 py-1 bg-white border border-border rounded-lg text-xs font-semibold cursor-pointer text-hug-text2 hover:text-primary hover:border-primary transition-all">Prev</button>` +
        `<span class="text-xs font-semibold text-hug-text2">Page ${historyCurrentPage} of ${totalHistPages}</span>` +
        `<button onclick="setHistoryPage(${historyCurrentPage + 1})" ${historyCurrentPage === totalHistPages ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} class="px-3 py-1 bg-white border border-border rounded-lg text-xs font-semibold cursor-pointer text-hug-text2 hover:text-primary hover:border-primary transition-all">Next</button>`;
    }
  }
}

function exportHistoryAuditLogCSV() {
  const db = getDB();
  
  const regItems = (db.registryHistory || []).map(r => ({
    id: r.id,
    timestamp: r.date,
    entityType: r.entityType,
    entity: `${r.name} (${r.entityId})`,
    person: r.manager || r.member || 'Assigned Lead',
    area: `${r.ha} Ha`,
    details: `${r.action} (${r.ha} Ha)`,
    actor: r.authority || 'SRA District VII',
    status: 'Enrolled'
  }));

  const sysItems = (db.systemHistory || []).map(s => ({
    id: s.id,
    timestamp: s.timestamp,
    entityType: s.categoryLabel || 'Field Operation',
    entity: s.entity,
    person: s.actor || 'Authorized Personnel',
    area: s.category === 'plot' ? '1.5 Ha' : 'Operational Scope',
    details: s.details,
    actor: s.actor || 'Regulatory Authority',
    status: s.status || 'Recorded'
  }));

  const allItems = [...regItems, ...sysItems];
  if (allItems.length === 0) {
    toast('No historical events to export.');
    return;
  }

  const headers = ['Ref ID', 'Date / Timestamp', 'Entity Type', 'Entity Name & Code', 'Assigned Personnel', 'Declared Area', 'Lifecycle Action / Note', 'Regulatory Authority', 'Status'];
  const rows = allItems.map(h => [
    h.id,
    `"${h.timestamp}"`,
    `"${h.entityType}"`,
    `"${h.entity}"`,
    `"${h.person}"`,
    `"${h.area}"`,
    `"${(h.details || '').replace(/"/g, '""')}"`,
    `"${h.actor}"`,
    `"${h.status}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `HUGPONG_Historical_Registry_Archive_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast('Historical Registry Archive exported to CSV.');
}

// ── SYNC & INACTIVITY MONITOR CONTROLLER ────────────────
function dispatchRemoteResyncPing() {
  toast('Broadcasting MQTT cloud re-sync ping to all 4 District VII terminals...');
  setTimeout(() => {
    toast('4 of 4 field devices acknowledged re-sync ping. Telemetry updated.');
    const db = getDB();
    if (db.terminalDiagnostics) {
      db.terminalDiagnostics.forEach(t => {
        t.lastSync = 'Just now (Ping ACK)';
      });
      saveDB(db);
      renderSync();
    }
  }, 1000);
}

function renderSync() {
  const db = getDB();
  const fields = db.fields || INITIAL_DATABASE.fields || [];

  const threshSelect = document.getElementById('sync-inactivity-threshold-select');
  if (threshSelect) {
    threshSelect.value = String(getSyncInactivityThresholdHours());
  }
  
  // 1. Render Block Farm Inactivity Breakdown Cards (#sync-blocks-telemetry)
  const blocksTelemetryEl = document.getElementById('sync-blocks-telemetry');
  if (blocksTelemetryEl) {
    const blockGroups = ['Block Farm A', 'Block Farm B', 'Block Farm C', 'Block Farm D'];
    const thresholdHours = getSyncInactivityThresholdHours();
    const warningDays = Math.max(1, Math.round(thresholdHours / 24));

    blocksTelemetryEl.innerHTML = blockGroups.map(bName => {
      const bPlots = fields.filter(f => (f.blockFarm || 'Block Farm A') === bName);
      const lagPlots = bPlots.filter(f => !f.synced || (Number(f.syncLagDays) >= warningDays));
      const statusColor = lagPlots.length === 0 ? 'text-success' : 'text-danger';
      const statusBg = lagPlots.length === 0 ? 'bg-success-bg' : 'bg-danger-bg';
      const statusText = lagPlots.length === 0 ? 'All Active Synced' : `${lagPlots.length} Plot Lagging`;
      const totalHa = bPlots.reduce((acc, p) => acc + Number(p.ha || p.area || 0), 0).toFixed(1);
      const isSelected = syncActiveBlockFilter === bName;

      const cardBorder = isSelected ? 'border-primary ring-2 ring-primary/30 bg-primary-bg/30' : 'border-border bg-white hover:border-primary/50';
      const activeBadge = isSelected ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">Selected</span>' : '';

      return `
        <div onclick="setSyncBlockFilter('${bName}')" class="p-4 rounded-xl border ${cardBorder} flex flex-col justify-between gap-3 shadow-2xs transition-all cursor-pointer group">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-xs text-hug-text group-hover:text-primary transition-colors flex items-center gap-1.5">
              ${bName}
            </h4>
            <div class="flex items-center gap-1">
              ${activeBadge}
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBg} ${statusColor}">${statusText}</span>
            </div>
          </div>
          <div class="text-xs text-hug-muted flex flex-col gap-1">
            <p>Total Plots: <strong class="text-hug-text">${bPlots.length}</strong></p>
            <p>Declared Area: <strong class="text-hug-text">${totalHa} Ha</strong></p>
          </div>
          <div class="flex items-center justify-between gap-2">
            <span class="text-[10px] font-bold ${isSelected ? 'text-primary' : 'text-hug-muted group-hover:text-primary'}">
              ${isSelected ? 'Click to show all' : 'Click to filter devices →'}
            </span>
            <button onclick="event.stopPropagation(); dispatchRemoteResyncPing()" class="px-2.5 py-1 bg-white border border-border text-hug-text2 hover:text-primary hover:border-primary rounded-lg text-[10px] font-semibold transition-all cursor-pointer shadow-xs">
              Ping
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // 2. Render Connected Mobile Terminals & Device Health Table (#terminal-diagnostics-body)
  const diagBody = document.getElementById('terminal-diagnostics-body');
  if (diagBody) {
    let diagList = db.terminalDiagnostics || INITIAL_DATABASE.terminalDiagnostics || [];

    if (syncActiveBlockFilter !== 'all') {
      diagList = diagList.filter(d => (d.blockFarm || '').toLowerCase() === syncActiveBlockFilter.toLowerCase());
    }

    const totalSyncItems = diagList.length;
    const totalSyncPages = Math.ceil(totalSyncItems / syncItemsPerPage) || 1;
    if (syncCurrentPage > totalSyncPages) syncCurrentPage = 1;

    const startIdx = (syncCurrentPage - 1) * syncItemsPerPage;
    const pagedDiagList = diagList.slice(startIdx, startIdx + syncItemsPerPage);

    if (totalSyncItems === 0) {
      diagBody.innerHTML = '<tr><td colspan="9" class="text-center py-10 text-xs text-hug-muted">No connected mobile terminals matched this Block Farm filter.</td></tr>';
    } else {
      diagBody.innerHTML = pagedDiagList.map(d => {
        const isOptimal = d.status === 'Optimal';
        const badge = isOptimal
          ? '<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success border border-success/20"><span class="w-1.5 h-1.5 rounded-full bg-success"></span> Optimal</span>'
          : '<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-danger-bg text-danger border border-danger/20"><span class="w-1.5 h-1.5 rounded-full bg-danger"></span> Lag Alert</span>';

        return `
          <tr class="hover:bg-bg/40 transition-colors">
            <td class="px-4 py-3 font-mono font-bold text-xs text-hug-text">${d.deviceId}</td>
            <td class="px-4 py-3 text-xs font-semibold text-hug-text">${d.staff}</td>
            <td class="px-4 py-3 text-xs text-hug-text2 font-semibold">${d.blockFarm}</td>
            <td class="px-4 py-3 text-xs text-hug-muted">${d.model} · <span class="font-mono text-[11px]">${d.os}</span></td>
            <td class="px-4 py-3 text-xs font-mono text-hug-text2">${d.appVersion}</td>
            <td class="px-4 py-3 text-xs font-bold text-hug-text">${d.battery}</td>
            <td class="px-4 py-3 text-xs font-semibold ${d.cachedLogs > 0 ? 'text-[#C97A00]' : 'text-hug-muted'}">${d.cachedLogs} pending logs</td>
            <td class="px-4 py-3 text-xs text-hug-muted whitespace-nowrap">${d.lastSync}</td>
            <td class="px-4 py-3">${badge}</td>
          </tr>
        `;
      }).join('');
    }

    // Render Sync Pagination Controls
    const syncPagEl = document.getElementById('sync-pagination');
    if (syncPagEl) {
      if (totalSyncPages <= 1) {
        syncPagEl.innerHTML = '';
        syncPagEl.classList.add('hidden');
      } else {
        syncPagEl.classList.remove('hidden');
        syncPagEl.innerHTML = 
          `<button onclick="setSyncPage(${syncCurrentPage - 1})" ${syncCurrentPage === 1 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} class="px-3 py-1 bg-white border border-border rounded-lg text-xs font-semibold cursor-pointer text-hug-text2 hover:text-primary hover:border-primary transition-all">Prev</button>` +
          `<span class="text-xs font-semibold text-hug-text2">Page ${syncCurrentPage} of ${totalSyncPages}</span>` +
          `<button onclick="setSyncPage(${syncCurrentPage + 1})" ${syncCurrentPage === totalSyncPages ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} class="px-3 py-1 bg-white border border-border rounded-lg text-xs font-semibold cursor-pointer text-hug-text2 hover:text-primary hover:border-primary transition-all">Next</button>`;
      }
    }
  }
}

// ── SUPPORT & TICKETS CONTROLLER ─────────────────────────
let currentSelectedTicketId = null;

function renderTickets() {
  const db = getDB();
  const tickets = db.supportTickets || INITIAL_DATABASE.supportTickets || [];

  const statTotal = document.getElementById('tck-stat-total');
  const statOpen = document.getElementById('tck-stat-open');
  const statProg = document.getElementById('tck-stat-prog');
  const statResolved = document.getElementById('tck-stat-resolved');

  const openCount = tickets.filter(t => t.status === 'Open').length;
  const progCount = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;

  if (statTotal) statTotal.textContent = `${tickets.length} Tickets`;
  if (statOpen) statOpen.textContent = `${openCount} Open`;
  if (statProg) statProg.textContent = `${progCount} In Progress`;
  if (statResolved) statResolved.textContent = `${resolvedCount} Resolved`;

  const searchInput = document.getElementById('tck-search');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const statusFilter = document.getElementById('tck-filter-status');
  const selectedStatus = statusFilter ? statusFilter.value : 'all';
  const catFilter = document.getElementById('tck-filter-category');
  const selectedCat = catFilter ? catFilter.value : 'all';

  let filtered = [...tickets];

  if (selectedStatus !== 'all') {
    filtered = filtered.filter(t => t.status === selectedStatus);
  }
  if (selectedCat !== 'all') {
    filtered = filtered.filter(t => t.category === selectedCat);
  }
  if (query) {
    filtered = filtered.filter(t =>
      (t.id || '').toLowerCase().includes(query) ||
      (t.title || '').toLowerCase().includes(query) ||
      (t.author || '').toLowerCase().includes(query) ||
      (t.blockFarm || '').toLowerCase().includes(query) ||
      (t.details || '').toLowerCase().includes(query)
    );
  }

  const totalTickets = filtered.length;
  const totalTicketPages = Math.ceil(totalTickets / TICKETS_PER_PAGE) || 1;
  if (ticketsCurrentPage > totalTicketPages) ticketsCurrentPage = totalTicketPages;

  const tckStartIdx = (ticketsCurrentPage - 1) * TICKETS_PER_PAGE;
  const pagedTickets = filtered.slice(tckStartIdx, tckStartIdx + TICKETS_PER_PAGE);

  const container = document.getElementById('tickets-list-container');
  if (!container) return;

  if (totalTickets === 0) {
    container.innerHTML = '<div class="p-8 text-center bg-white border border-border rounded-2xl text-xs text-hug-muted">No support tickets matched the selected filters.</div>';
  } else {
    container.innerHTML = pagedTickets.map(t => {
      const statusClass = t.status === 'Open' ? 'bg-danger-bg text-danger border-danger/20' : (t.status === 'In Progress' ? 'bg-warning-bg text-[#C97A00] border-warning/20' : 'bg-success-bg text-success border-success/20');
      const priorityClass = t.priority === 'Critical' ? 'bg-danger text-white' : (t.priority === 'High' ? 'bg-danger-bg text-danger' : (t.priority === 'Medium' ? 'bg-warning-bg text-[#C97A00]' : 'bg-bg text-hug-muted'));

      return `
        <div class="bg-white rounded-2xl p-4 border border-border shadow-xs hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-start gap-3.5 flex-1">
            <div class="w-10 h-10 rounded-xl bg-bg flex items-center justify-center flex-shrink-0 text-hug-text2 font-mono font-bold text-xs border border-border">
              ${t.id.replace('TCK-', '')}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <span class="font-mono text-xs font-bold text-primary">${t.id}</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusClass}">${t.status}</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityClass}">${t.priority} Priority</span>
                <span class="text-[10px] font-medium text-hug-muted bg-bg px-2 py-0.5 rounded-full">${t.category}</span>
              </div>
              <h4 class="text-sm font-bold text-hug-text mb-1">${t.title}</h4>
              <p class="text-xs text-hug-muted line-clamp-2">${t.details}</p>
              <div class="flex items-center gap-4 text-[11px] text-hug-muted mt-2">
                <span>👤 <strong>${t.author}</strong></span>
                <span>📍 ${t.blockFarm}</span>
                <span>🕒 ${t.date}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <button onclick="openTicketDetailModal('${t.id}')" class="px-3.5 py-2 bg-bg hover:bg-primary hover:text-white text-hug-text font-bold text-xs rounded-xl border border-border transition-all cursor-pointer">
              Triage / View Details →
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Support Tickets Pagination Controls
  const tckPagEl = document.getElementById('tickets-pagination');
  if (tckPagEl) {
    if (totalTicketPages <= 1) {
      tckPagEl.innerHTML = '';
      tckPagEl.classList.add('hidden');
    } else {
      tckPagEl.classList.remove('hidden');
      tckPagEl.innerHTML = 
        `<button onclick="setTicketsPage(${ticketsCurrentPage - 1})" ${ticketsCurrentPage === 1 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} class="px-3 py-1 bg-white border border-border rounded-lg text-xs font-semibold cursor-pointer text-hug-text2 hover:text-primary hover:border-primary transition-all">Prev</button>` +
        `<span class="text-xs font-semibold text-hug-text2">Page ${ticketsCurrentPage} of ${totalTicketPages}</span>` +
        `<button onclick="setTicketsPage(${ticketsCurrentPage + 1})" ${ticketsCurrentPage === totalTicketPages ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} class="px-3 py-1 bg-white border border-border rounded-lg text-xs font-semibold cursor-pointer text-hug-text2 hover:text-primary hover:border-primary transition-all">Next</button>`;
    }
  }
}

function resolveSupportTicket(ticketId) {
  const db = getDB();
  const ticket = (db.supportTickets || []).find(t => t.id === ticketId);
  if (ticket) {
    ticket.status = 'Resolved';
    saveDB(db);
    renderTickets();
    toast(`Ticket ${ticketId} marked as Resolved.`);
  }
}

function openCreateTicketModal() {
  toast('Feature: New system diagnostic ticket dispatched to engineering.');
}

// ── MAINTENANCE & SECURITY VIEW ──────────────────────────
function renderMaintenance() {
  const db = getDB();
  const body = document.getElementById('security-logs-body');
  if (!body) return;

  const logs = db.securityLogs || INITIAL_DATABASE.securityLogs || [];
  body.innerHTML = logs.map(log => {
    let eventClass = 'text-hug-text';
    if (log.event.includes('Failed') || log.event.includes('reset')) eventClass = 'text-danger font-bold';
    if (log.event.includes('Successful') || log.event.includes('snapshot') || log.event.includes('Backup')) eventClass = 'text-success font-bold';

    return `<tr class="border-b border-border/60 hover:bg-bg/50 transition-colors">
      <td class="px-4 py-3 text-xs text-hug-muted whitespace-nowrap">${log.time}</td>
      <td class="px-4 py-3 text-xs font-semibold text-hug-text">${log.user}</td>
      <td class="px-4 py-3 text-xs font-medium ${eventClass}">${log.event}</td>
    </tr>`;
  }).join('');
}

function exportDatabaseJSON() {
  const db = getDB();
  const dateStr = new Date().toISOString().slice(0, 10);
  const timeStr = new Date().toTimeString().slice(0, 5).replace(':', '');
  const fileName = `hugpong-database-backup-${dateStr}-${timeStr}.json`;
  const jsonContent = JSON.stringify(db, null, 2);

  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const userName = currentRole === 'manager' ? 'Farm Manager Jose Reyes' : (currentRole === 'superadmin' ? 'Super Admin' : 'SRA Admin Juan dela Cruz');

  // Add security log
  if (!Array.isArray(db.securityLogs)) db.securityLogs = [];
  db.securityLogs.unshift({
    time: `${dateStr} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    user: userName,
    event: `Exported Cold Backup Snapshot (${(new Blob([jsonContent]).size / 1024).toFixed(1)} KB)`
  });
  saveDB(db);

  logSystemEvent(
    'Database Cold Backup Created',
    'System Snapshot (.JSON)',
    `Exported full database state (${(new Blob([jsonContent]).size / 1024).toFixed(1)} KB) containing ${db.fields?.length || 0} fields and ${db.logs?.length || 0} logs.`,
    userName,
    'Completed'
  );

  renderMaintenance();
  toast(`Success: Backup file ${fileName} downloaded!`);
}

function importDatabaseJSON(inputEl) {
  const file = inputEl.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.fields) || !Array.isArray(parsed.logs)) {
        toast('Error: Invalid HUGPONG backup schema. File must contain fields and logs arrays.');
        return;
      }
      const ok = confirm(`Confirm Database Restore:\n\nRestore data from "${file.name}" (${(file.size / 1024).toFixed(1)} KB)?\n\nThis will load ${parsed.fields.length} field plots, ${parsed.logs.length} operations, and ${parsed.priceHistory?.length || 0} price circulars.`);
      if (!ok) {
        inputEl.value = '';
        return;
      }
      
      const currentRole = localStorage.getItem('hugpong_role') || 'admin';
      const userName = currentRole === 'manager' ? 'Farm Manager Jose Reyes' : (currentRole === 'superadmin' ? 'Super Admin' : 'SRA Admin Juan dela Cruz');
      const dateStr = new Date().toISOString().slice(0, 10);

      if (!Array.isArray(parsed.securityLogs)) parsed.securityLogs = [];
      parsed.securityLogs.unshift({
        time: `${dateStr} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        user: userName,
        event: `Restored Database Backup Snapshot from ${file.name}`
      });

      saveDB(parsed);
      logSystemEvent(
        'Database Cold Backup Restored',
        'System Snapshot (.JSON)',
        `Restored complete database state from backup file: ${file.name}.`,
        userName,
        'Completed'
      );
      toast('Success: Database restored successfully from backup!');
      renderMaintenance();
      renderDashboard();
    } catch (err) {
      toast('Error: Failed to parse backup JSON file.');
    }
    inputEl.value = '';
  };
  reader.readAsText(file);
}

// ── CONTACT MEMBER & SYNC FOLLOW-UP CONTROLLER ───────────
let activeContactMemberData = null;

function openContactMemberModal(name, phone, fieldId, stage, lastSync, lagDays) {
  activeContactMemberData = { name, phone, fieldId, stage, lastSync, lagDays: lagDays || 0 };
  
  const modal = document.getElementById('modal-contact-member');
  const elAvatar = document.getElementById('contact-modal-avatar');
  const elName = document.getElementById('contact-modal-name');
  const elField = document.getElementById('contact-modal-field');
  const elPhone = document.getElementById('contact-modal-phone');
  const elStage = document.getElementById('contact-modal-stage');
  const elBadge = document.getElementById('contact-modal-sync-badge');
  const elSms = document.getElementById('contact-modal-sms');

  if (elAvatar) elAvatar.textContent = name.charAt(0);
  if (elName) elName.textContent = name;
  if (elField) elField.textContent = fieldId ? `${fieldId} (Plot Assignment)` : 'Assigned Cultivation Plot';
  if (elPhone) elPhone.textContent = phone || '0917-555-0101';
  if (elStage) elStage.textContent = stage || 'Planting (Patdan)';

  const health = getSyncHealthInfo(lastSync, lagDays);
  if (elBadge) {
    elBadge.className = `px-2.5 py-1 rounded-full text-xs font-bold ${health.pillClass}`;
    elBadge.textContent = health.days > 0 ? `${health.days} Days Offline` : 'Active / Synced';
  }

  const defaultMsg = health.days >= 3
    ? `Hi ${name}, this is Jose Reyes (Farm Manager - Block Farm A). We noticed your HUGPONG app hasn't synced mobile records in ${health.days} days. Please open the app and tap Sync, or let me know if you need assistance.`
    : `Hi ${name}, this is Jose Reyes (Farm Manager - Block Farm A) checking in on field progress for ${fieldId}. Please let me know if you have updated operation logs.`;

  if (elSms) elSms.value = defaultMsg;

  if (modal) modal.classList.remove('hidden');
}

function closeContactMemberModal() {
  const modal = document.getElementById('modal-contact-member');
  if (modal) modal.classList.add('hidden');
  activeContactMemberData = null;
}

function copyMemberPhone() {
  if (!activeContactMemberData || !activeContactMemberData.phone) {
    toast('Error: Contact number not available.');
    return;
  }
  navigator.clipboard?.writeText(activeContactMemberData.phone);
  toast(`Contact number ${activeContactMemberData.phone} copied to clipboard!`);
}

function sendSyncReminderSMS() {
  if (!activeContactMemberData) return;
  const smsEl = document.getElementById('contact-modal-sms');
  const msg = smsEl ? smsEl.value.trim() : '';

  if (!msg) {
    toast('Error: Message content is empty.');
    return;
  }

  toast(`Sync Follow-up SMS dispatched to ${activeContactMemberData.name} (${activeContactMemberData.phone})!`);
  closeContactMemberModal();
}

function takeOverFromContactModal() {
  if (!activeContactMemberData || !activeContactMemberData.fieldId) {
    toast('Error: No field assignment found for this member.');
    return;
  }
  const fId = activeContactMemberData.fieldId;
  closeContactMemberModal();
  navigate('operations');
  openTakeOverModal(fId);
}

// ── SRA PRICE PUBLISH DASHBOARD MODAL CONTROLLER ─────────
function openPublishPriceModal() {
  const db = getDB();
  const modal = document.getElementById('modal-post-weekly-price');
  if (!modal) return;

  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('dash-price-date');
  if (dateInput) dateInput.value = today;

  const latestPrice = db.priceHistory[0]?.price || 2800;
  const priceInput = document.getElementById('dash-price-val');
  if (priceInput) priceInput.value = latestPrice;

  const latestMol = db.priceHistory[0]?.molasses || 4200;
  const molInput = document.getElementById('dash-price-molasses');
  if (molInput) molInput.value = latestMol;

  const weekInput = document.getElementById('dash-price-week');
  if (weekInput && !weekInput.value) {
    const nextWeekNum = ((db.priceHistory.length % 4) + 1);
    weekInput.value = `Week ${nextWeekNum} Jun`;
  }

  const sourceInput = document.getElementById('dash-price-source');
  if (sourceInput && !sourceInput.value) {
    const circNum = 104 + (db.priceHistory.length - 12);
    sourceInput.value = `SRA Circular #${circNum > 104 ? circNum : 105} (Official SRA Millsite Notice)`;
  }

  calculatePriceMovementPreview();
  modal.classList.remove('hidden');
}

function closePublishPriceModal() {
  const modal = document.getElementById('modal-post-weekly-price');
  if (modal) modal.classList.add('hidden');
}

function calculatePriceMovementPreview() {
  const db = getDB();
  const latestPrice = db.priceHistory[0]?.price || 2800;
  const latestMol = db.priceHistory[0]?.molasses || 4200;

  const priceInput = document.getElementById('dash-price-val');
  const molInput = document.getElementById('dash-price-molasses');
  const previewEl = document.getElementById('dash-price-diff-preview');
  const molPreviewEl = document.getElementById('dash-molasses-diff-preview');

  if (priceInput && previewEl) {
    const currentVal = parseInt(priceInput.value);
    if (isNaN(currentVal)) {
      previewEl.textContent = 'Enter price value';
      previewEl.className = 'mt-1.5 text-[11px] font-semibold text-hug-muted';
    } else {
      const diff = currentVal - latestPrice;
      if (diff > 0) {
        previewEl.innerHTML = `<span class="text-success font-bold">▲ +₱${diff.toLocaleString()} / Lkg (Increase)</span>`;
      } else if (diff < 0) {
        previewEl.innerHTML = `<span class="text-danger font-bold">▼ -₱${Math.abs(diff).toLocaleString()} / Lkg (Decrease)</span>`;
      } else {
        previewEl.innerHTML = `<span class="text-hug-muted font-bold">Steady (₱0 / Lkg)</span>`;
      }
    }
  }

  if (molInput && molPreviewEl) {
    const currentMol = parseInt(molInput.value);
    if (isNaN(currentMol)) {
      molPreviewEl.textContent = 'Enter molasses value';
      molPreviewEl.className = 'mt-1.5 text-[11px] font-semibold text-hug-muted';
    } else {
      const diffMol = currentMol - latestMol;
      if (diffMol > 0) {
        molPreviewEl.innerHTML = `<span class="text-success font-bold">▲ +₱${diffMol.toLocaleString()} / MT (Increase)</span>`;
      } else if (diffMol < 0) {
        molPreviewEl.innerHTML = `<span class="text-danger font-bold">▼ -₱${Math.abs(diffMol).toLocaleString()} / MT (Decrease)</span>`;
      } else {
        molPreviewEl.innerHTML = `<span class="text-hug-muted font-bold">Steady (₱0 / MT)</span>`;
      }
    }
  }
}

async function submitNewWeeklyPriceFromDashboard() {
  const weekEl = document.getElementById('dash-price-week');
  const priceEl = document.getElementById('dash-price-val');
  const molEl = document.getElementById('dash-price-molasses');
  const dateEl = document.getElementById('dash-price-date');
  const sourceEl = document.getElementById('dash-price-source');

  const week = weekEl ? weekEl.value.trim() : '';
  const price = priceEl ? parseInt(priceEl.value) : NaN;
  const molasses = molEl ? parseInt(molEl.value) : 4200;
  const dateStr = dateEl ? dateEl.value : '';
  const source = sourceEl ? sourceEl.value.trim() : 'Official SRA release';

  if (!week || isNaN(price) || !dateStr) {
    toast('Error: Please complete all required price fields.');
    return;
  }

  const db = getDB();
  const prevPrice = db.priceHistory[0]?.price || price;
  const prevMol = db.priceHistory[0]?.molasses || molasses;
  const change = price - prevPrice;
  const molassesChange = molasses - prevMol;

  const dateObj = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${months[dateObj.getMonth()]} ${String(dateObj.getDate()).padStart(2, '0')}, ${dateObj.getFullYear()}`;

  const pId = `PRC-${Date.now()}`;
  const newPost = {
    id: pId,
    week,
    price,
    molasses,
    date: formattedDate,
    isoDate: dateStr,
    timestamp: Date.now(),
    change,
    molassesChange,
    source,
    createdAt: new Date().toISOString()
  };

  db.priceHistory.unshift(newPost);
  saveDB(db);

  // Directly push to Firestore if online
  if (window.firebaseDB && window.firestore) {
    try {
      const { doc, setDoc } = window.firestore;
      await setDoc(doc(window.firebaseDB, 'sra_prices', pId), newPost, { merge: true });
      console.log('[HUGPONG] Published price committed to Firestore:', pId);
    } catch (e) {
      console.warn('[HUGPONG] Direct Firestore price publish note:', e);
    }
  }

  logSystemEvent(
    'price',
    'SRA Benchmark Broadcasted',
    `${week} · Raw Sugar ₱${price.toLocaleString()}/Lkg | Molasses ₱${molasses.toLocaleString()}/MT`,
    `Published official millsite circular "${source}" effective ${formattedDate}.`,
    'SRA Administrator Juan dela Cruz',
    'Official Circular'
  );

  closePublishPriceModal();
  renderDashboard();
  renderPrices();
  toast(`Success: Official SRA benchmark updated to ₱${price.toLocaleString()}/Lkg & ₱${molasses.toLocaleString()}/MT (${week})!`);
}

// ── SUPPORT & TICKETS DESK ───────────────────────────────
function openTicketDetailModal(id) {
  const db = getDB();
  const tickets = db.supportTickets || INITIAL_DATABASE.supportTickets;
  const t = tickets.find(x => x.id === id);
  if (!t) return;
  currentSelectedTicketId = id;

  document.getElementById('tck-modal-id').textContent = t.id;
  document.getElementById('tck-modal-title').textContent = t.title;
  document.getElementById('tck-modal-author').textContent = t.author;
  document.getElementById('tck-modal-block').textContent = t.blockFarm;
  document.getElementById('tck-modal-date').textContent = t.date;
  document.getElementById('tck-modal-details').textContent = t.details;
  
  const prioPill = document.getElementById('tck-modal-priority-pill');
  if (prioPill) {
    prioPill.textContent = `${t.priority} Priority`;
    prioPill.className = t.priority === 'Critical' ? 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger text-white' : (t.priority === 'High' ? 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger-bg text-danger' : 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-warning-bg text-[#C97A00]');
  }

  document.getElementById('tck-modal-status').value = t.status;
  document.getElementById('tck-modal-priority').value = t.priority;
  document.getElementById('tck-modal-notes').value = t.resolutionNotes || '';

  const modal = document.getElementById('modal-ticket-details');
  if (modal) modal.classList.remove('hidden');
}

function closeTicketDetailModal() {
  const modal = document.getElementById('modal-ticket-details');
  if (modal) modal.classList.add('hidden');
  currentSelectedTicketId = null;
}

function saveTicketTriage() {
  if (!currentSelectedTicketId) return;
  const db = getDB();
  if (!db.supportTickets) db.supportTickets = INITIAL_DATABASE.supportTickets;
  const t = db.supportTickets.find(x => x.id === currentSelectedTicketId);
  if (t) {
    t.status = document.getElementById('tck-modal-status').value;
    t.priority = document.getElementById('tck-modal-priority').value;
    t.resolutionNotes = document.getElementById('tck-modal-notes').value;
    saveDB(db);
    toast(`Ticket ${t.id} updated to ${t.status}`);
    closeTicketDetailModal();
    renderTickets();
  }
}

function deleteCurrentTicket() {
  if (!currentSelectedTicketId) return;
  const db = getDB();
  if (!db.supportTickets) db.supportTickets = INITIAL_DATABASE.supportTickets;
  db.supportTickets = db.supportTickets.filter(x => x.id !== currentSelectedTicketId);
  saveDB(db);
  toast(`Ticket ${currentSelectedTicketId} deleted`);
  closeTicketDetailModal();
  renderTickets();
}

function openCreateTicketModal() {
  document.getElementById('tck-new-title').value = '';
  document.getElementById('tck-new-author').value = '';
  document.getElementById('tck-new-details').value = '';
  const modal = document.getElementById('modal-create-ticket');
  if (modal) modal.classList.remove('hidden');
}

function closeCreateTicketModal() {
  const modal = document.getElementById('modal-create-ticket');
  if (modal) modal.classList.add('hidden');
}

function submitNewTicket() {
  const title = document.getElementById('tck-new-title').value.trim();
  const author = document.getElementById('tck-new-author').value.trim();
  const blockFarm = document.getElementById('tck-new-block').value;
  const category = document.getElementById('tck-new-category').value;
  const priority = document.getElementById('tck-new-priority').value;
  const details = document.getElementById('tck-new-details').value.trim();

  if (!title || !author || !details) {
    toast('Please complete all required fields.');
    return;
  }

  const db = getDB();
  if (!db.supportTickets) db.supportTickets = INITIAL_DATABASE.supportTickets;

  const newId = `TCK-${800 + db.supportTickets.length + 1}`;
  const now = new Date();
  const dateStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const newTicket = {
    id: newId,
    title,
    author,
    blockFarm,
    category,
    priority,
    status: 'Open',
    date: dateStr,
    details,
    resolutionNotes: ''
  };

  db.supportTickets.unshift(newTicket);
  saveDB(db);
  toast(`Created ticket ${newId}`);
  closeCreateTicketModal();
  renderTickets();
}

// ── SUPER ADMIN SYSTEM TELEMETRY DASHBOARD ────────────────
function renderSuperadminTelemetryDashboard(db) {
  // 1. Update tickets stat
  const tickets = db.supportTickets || INITIAL_DATABASE.supportTickets;
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const tckStat = document.getElementById('dash-super-tickets-count');
  if (tckStat) tckStat.textContent = `${openCount} Open Ticket${openCount === 1 ? '' : 's'}`;

  // 2. 12-Week District Sync Telemetry Chart (#telemetry-sync-chart)
  const chartEl = document.getElementById('telemetry-sync-chart');
  if (chartEl) {
    const syncData = [
      { week: 'W1 Mar', syncRate: 94.2, packets: 98 },
      { week: 'W2 Mar', syncRate: 95.8, packets: 104 },
      { week: 'W3 Mar', syncRate: 96.0, packets: 110 },
      { week: 'W4 Mar', syncRate: 96.5, packets: 115 },
      { week: 'W1 Apr', syncRate: 97.0, packets: 120 },
      { week: 'W2 Apr', syncRate: 97.4, packets: 126 },
      { week: 'W3 Apr', syncRate: 98.0, packets: 130 },
      { week: 'W4 Apr', syncRate: 97.8, packets: 132 },
      { week: 'W1 May', syncRate: 98.2, packets: 138 },
      { week: 'W2 May', syncRate: 98.0, packets: 140 },
      { week: 'W3 May', syncRate: 98.5, packets: 141 },
      { week: 'W4 May', syncRate: 98.4, packets: 142 }
    ];

    const minR = 90;
    const maxR = 100;
    const W = 540, H = 150;
    const padL = 45, padR = 25, padT = 20, padB = 45;
    const svgW = W + padL + padR;
    const svgH = H + padT + padB;
    const n = syncData.length;

    const points = syncData.map((d, i) => {
      const x = padL + (i / (n - 1)) * W;
      const y = padT + H - ((d.syncRate - minR) / (maxR - minR)) * H;
      return { x, y, ...d };
    });

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const mx = (p0.x + p1.x) / 2;
      pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    const areaD = `${pathD} L ${points[points.length - 1].x} ${padT + H} L ${points[0].x} ${padT + H} Z`;

    const yTicks = [0, 0.5, 1].map(frac => {
      const val = Math.round(minR + frac * (maxR - minR));
      const y = padT + H - frac * H;
      return `<line x1="${padL}" y1="${y}" x2="${padL + W}" y2="${y}" stroke="#E2E8DC" stroke-width="1" stroke-dasharray="3 3"/>
        <text x="${padL - 8}" y="${y + 3}" text-anchor="end" font-size="10" font-weight="600" fill="#8A9B7A">${val}%</text>`;
    }).join('');

    const dotsAndLabels = points.map((pt, i) => {
      const isLatest = i === n - 1;
      const circleFill = isLatest ? '#2D5016' : '#4A7C2F';
      const radius = isLatest ? 5.5 : 4;
      const pulse = isLatest ? `<circle cx="${pt.x}" cy="${pt.y}" r="11" fill="#2D5016" opacity="0.25"/>` : '';

      return `
        <g class="cursor-pointer">
          ${pulse}
          <circle cx="${pt.x}" cy="${pt.y}" r="${radius}" fill="${circleFill}" stroke="#FFFFFF" stroke-width="2">
            <title>${pt.week}: ${pt.syncRate}% Sync Reliability (${pt.packets} packets)</title>
          </circle>
          <text x="${pt.x}" y="${padT + H + 18}" text-anchor="middle" font-size="9" font-weight="700" fill="#5A6B4A" transform="rotate(-35, ${pt.x}, ${padT + H + 18})">
            ${pt.week}
          </text>
        </g>
      `;
    }).join('');

    chartEl.innerHTML = `
      <div class="overflow-x-auto">
        <svg viewBox="0 0 ${svgW} ${svgH}" class="w-full min-w-[460px]">
          <defs>
            <linearGradient id="telemetryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#4A7C2F" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#4A7C2F" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          ${yTicks}
          <path d="${areaD}" fill="url(#telemetryGradient)"/>
          <path d="${pathD}" fill="none" stroke="#2D5016" stroke-width="3" stroke-linecap="round"/>
          ${dotsAndLabels}
        </svg>
      </div>
      <div class="flex items-center justify-between mt-2 pt-2 border-t border-border text-[11px] text-hug-muted">
        <span class="font-semibold text-primary">● Latest Reliability: 98.4%</span>
        <span>Peak Throughput: 142 Packets / Wk</span>
        <span class="italic text-[10px]">District VII Central SRA Gateway</span>
      </div>
    `;
  }

  // 3. Block Farm Inactivity & Connectivity Index (#telemetry-blocks-matrix)
  const matrixEl = document.getElementById('telemetry-blocks-matrix');
  if (matrixEl) {
    const blocks = [
      { name: 'Block Farm A (Silay)', nodes: '2 Android Terminals', health: '100% Synced', queue: '0 Buffered Logs', isLagging: false },
      { name: 'Block Farm B (Cadiz)', nodes: '1 Android Terminal', health: '98.5% Synced', queue: '0 Buffered Logs', isLagging: false },
      { name: 'Block Farm C (Sagay)', nodes: '1 Android Terminal', health: '86.0% Synced', queue: '5 Buffered Logs', isLagging: true, alert: '1 Inactive Member (>7d)' },
      { name: 'Block Farm D (Manapla)', nodes: '1 Android Terminal', health: '99.0% Synced', queue: '0 Buffered Logs', isLagging: false }
    ];

    matrixEl.innerHTML = blocks.map(b => `
      <div class="p-3 bg-bg/50 rounded-xl border border-border/80 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg ${b.isLagging ? 'bg-danger-bg text-danger' : 'bg-success-bg text-success'} flex items-center justify-center font-bold text-xs">
            ${b.isLagging ? '!' : '✓'}
          </div>
          <div>
            <h5 class="text-xs font-bold text-hug-text">${b.name}</h5>
            <p class="text-[10px] text-hug-muted">${b.nodes} · ${b.queue}</p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-bold ${b.isLagging ? 'text-danger' : 'text-success'}">${b.health}</span>
          ${b.alert ? `<span class="block text-[10px] text-danger font-semibold">${b.alert}</span>` : '<span class="block text-[10px] text-hug-muted">Fully Synchronized</span>'}
        </div>
      </div>
    `).join('');
  }

  // 4. Live System Diagnostic Log Stream (#telemetry-events-stream-body)
  const streamBody = document.getElementById('telemetry-events-stream-body');
  if (streamBody) {
    const events = [
      { time: '2026-05-23 08:30 AM', type: 'Offline Sync Queue Alert', node: 'TRM-ANDR-02 (Mario Dimagiba)', details: '3 logs queued during offline field operation in field FLD-KTR-001', status: 'Queued Handshake', statusColor: 'warning' },
      { time: '2026-05-23 08:15 AM', type: 'WebSocket Heartbeat', node: 'District VII Central Gateway', details: 'Automated keep-alive pulse acknowledged by 4 field mobile devices', status: 'Optimal Pulse', statusColor: 'success' },
      { time: '2026-05-22 02:15 PM', type: 'Support Ticket Intake', node: 'TRM-ANDR-01 (Jose Reyes)', details: 'TCK-802 opened: Plot boundary overlap survey discrepancy', status: 'Triage Assigned', statusColor: 'warning' },
      { time: '2026-05-21 11:45 AM', type: 'QR Scanner Diagnostics', node: 'SRA Desk Terminal (Juan dela Cruz)', details: 'Compressed QR packet chunk size optimized for Android 11', status: 'Resolved Patch', statusColor: 'success' },
      { time: '2026-05-20 04:00 PM', type: 'Credential Audit', node: 'Super Admin Terminal (Capstone)', details: 'Member phone number verified and updated for Antonio Luna', status: 'Verified Audit', statusColor: 'success' }
    ];

    streamBody.innerHTML = events.map(e => `
      <tr class="hover:bg-bg/50 transition-colors">
        <td class="px-5 py-3 font-mono text-hug-muted">${e.time}</td>
        <td class="px-5 py-3 font-bold text-hug-text">${e.type}</td>
        <td class="px-5 py-3 text-hug-text2 font-medium">${e.node}</td>
        <td class="px-5 py-3 text-hug-muted">${e.details}</td>
        <td class="px-5 py-3">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${e.statusColor === 'success' ? 'bg-success-bg text-success' : 'bg-warning-bg text-[#C97A00]'}">
            ${e.status}
          </span>
        </td>
      </tr>
    `).join('');
  }
}



// ── GLOBAL EVENT LISTENERS & BOOTSTRAP ─────────────────────
function initAdminPortal() {
  const currentRoleInit = localStorage.getItem('hugpong_role') || 'admin';
  applyRoleLayout(currentRoleInit);
  navigate(currentRoleInit === 'manager' ? 'manager' : 'dashboard');

  // Attach nav-item click handlers
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.getAttribute('data-page');
      if (page) {
        navigate(page);
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('open');
      }
    });
  });

  // Topbar refresh button
  const refreshBtn = document.getElementById('topbar-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      toast('Cloud servers synchronized.');
      navigate(currentPage);
    });
  }

  // Sidebar mobile toggle
  const toggleBtn = document.getElementById('sidebar-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.classList.toggle('open');
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminPortal);
} else {
  initAdminPortal();
}

// ── GLOBAL WINDOW BINDINGS ───────────────────────────────
window.navigate = navigate;
window.switchRole = switchRole;
window.applyRoleLayout = applyRoleLayout;
window.openDetailedAnalyticsModal = openDetailedAnalyticsModal;
window.closeDetailedAnalyticsModal = closeDetailedAnalyticsModal;
window.openCropStageModal = openCropStageModal;
window.closeCropStageModal = closeCropStageModal;
window.openContactMemberModal = openContactMemberModal;
window.closeContactMemberModal = closeContactMemberModal;
window.copyMemberPhone = copyMemberPhone;
window.sendSyncReminderSMS = sendSyncReminderSMS;
window.takeOverFromContactModal = takeOverFromContactModal;
window.openPublishPriceModal = openPublishPriceModal;
window.closePublishPriceModal = closePublishPriceModal;
window.submitPublishPrice = submitPublishPrice;
window.calculatePriceMovementPreview = calculatePriceMovementPreview;
window.submitNewWeeklyPriceFromDashboard = submitNewWeeklyPriceFromDashboard;
window.openRegisterBlockFarmModal = openRegisterBlockFarmModal;
window.closeRegisterBlockFarmModal = closeRegisterBlockFarmModal;
window.submitRegisterBlockFarmFromDashboard = submitRegisterBlockFarmFromDashboard;
window.archiveFieldPlot = archiveFieldPlot;
window.openTabHistoryModal = openTabHistoryModal;
window.closeTabHistoryModal = closeTabHistoryModal;
window.setTabHistoryFilter = setTabHistoryFilter;
window.setTabHistoryPage = setTabHistoryPage;
window.setHistoryCategory = setHistoryCategory;
window.setHistoryPage = setHistoryPage;
window.setSyncBlockFilter = setSyncBlockFilter;
window.setSyncPage = setSyncPage;
window.onTypeFilterChange = onTypeFilterChange;
window.renderHistory = renderHistory;
window.exportHistoryAuditLogCSV = exportHistoryAuditLogCSV;
window.renderSync = renderSync;
window.dispatchRemoteResyncPing = dispatchRemoteResyncPing;
window.renderTickets = renderTickets;
window.setTicketsPage = setTicketsPage;
window.openTicketDetailModal = openTicketDetailModal;
window.closeTicketDetailModal = closeTicketDetailModal;
window.saveTicketTriage = saveTicketTriage;
window.deleteCurrentTicket = deleteCurrentTicket;
window.openCreateTicketModal = openCreateTicketModal;
window.closeCreateTicketModal = closeCreateTicketModal;
window.submitNewTicket = submitNewTicket;
window.renderSuperadminTelemetryDashboard = renderSuperadminTelemetryDashboard;
window.renderManagerFullSyncTelemetry = renderManagerFullSyncTelemetry;
window.openTakeOverModal = openTakeOverModal;
window.closeTakeOverModal = closeTakeOverModal;
window.takeOverSelectStage = takeOverSelectStage;
window.takeOverSubmitLog = takeOverSubmitLog;
window.takeOverSetUnit = takeOverSetUnit;
window.takeOverChangeCategory = takeOverChangeCategory;
window.takeOverTogglePhoto = takeOverTogglePhoto;
window.takeOverAddPresetStage = takeOverAddPresetStage;
window.takeOverAddCustomStage = takeOverAddCustomStage;
window.takeOverRemoveStage = takeOverRemoveStage;
window.takeOverMoveStage = takeOverMoveStage;
window.takeOverResetToSRA = takeOverResetToSRA;
window.takeOverSaveStages = takeOverSaveStages;
window.openEditLogModal = openEditLogModal;
window.openEditUserModal = openEditUserModal;
window.closeEditUserModal = closeEditUserModal;
window.saveEditUserModal = saveEditUserModal;
window.openRegisterBlockFarmModal = openRegisterBlockFarmModal;
window.openRegisterFieldPlotModal = openRegisterFieldPlotModal;
window.openEditBlockFarmModal = openEditBlockFarmModal;
window.handleFieldsActionClick = handleFieldsActionClick;
window.closeRegisterBlockFarmModal = closeRegisterBlockFarmModal;
window.submitRegisterBlockFarmFromDashboard = submitRegisterBlockFarmFromDashboard;
window.loadFieldForEdit = loadFieldForEdit;
window.openCreateUserModal = openCreateUserModal;
window.closeCreateUserModal = closeCreateUserModal;
window.submitCreateUser = submitCreateUser;
window.openEditPlotModal = openEditPlotModal;
window.closeEditPlotModal = closeEditPlotModal;
window.saveEditPlotModal = saveEditPlotModal;
window.openPlotHistoryModal = openPlotHistoryModal;
window.closePlotHistoryModal = closePlotHistoryModal;
window.openBlockFarmHistoryModal = openBlockFarmHistoryModal;
window.closeBlockFarmHistoryModal = closeBlockFarmHistoryModal;
window.openPlotRegistryAuditModal = openPlotRegistryAuditModal;
window.closePlotRegistryAuditModal = closePlotRegistryAuditModal;
window.openTabHistoryModal = openTabHistoryModal;
window.openUserHistoryModal = openUserHistoryModal;
window.closeUserHistoryModal = closeUserHistoryModal;

// ── USER PROFILE MENU & SETTINGS (DARK MODE) ─────────────
function toggleUserMenu() {
  const popover = document.getElementById('user-profile-popover');
  if (!popover) return;
  popover.classList.toggle('hidden');
}

function closeUserMenu() {
  const popover = document.getElementById('user-profile-popover');
  if (popover) popover.classList.add('hidden');
}

// Global click outside listener to close user menu
document.addEventListener('click', (e) => {
  const popover = document.getElementById('user-profile-popover');
  const trigger = e.target.closest('button[onclick="toggleUserMenu()"]');
  if (popover && !popover.classList.contains('hidden') && !popover.contains(e.target) && !trigger) {
    popover.classList.add('hidden');
  }
});

function switchSettingsTab(tabName) {
  document.querySelectorAll('.settings-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabName) {
      btn.className = 'settings-tab-btn text-xs font-bold px-3 py-2 border-b-2 border-primary text-primary transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap';
    } else {
      btn.className = 'settings-tab-btn text-xs font-bold px-3 py-2 border-b-2 border-transparent text-hug-muted hover:text-hug-text transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap';
    }
  });

  document.querySelectorAll('.settings-tab-content').forEach(content => {
    content.classList.add('hidden');
  });
  const targetContent = document.getElementById(`settings-tab-${tabName}`);
  if (targetContent) targetContent.classList.remove('hidden');
}

function togglePwdVisibility(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

function checkPasswordStrength(val) {
  const bar = document.getElementById('pwd-strength-bar');
  const text = document.getElementById('pwd-strength-text');
  if (!bar || !text) return;

  if (!val) {
    bar.style.width = '0%';
    bar.className = 'h-full w-0 bg-danger transition-all duration-300';
    text.textContent = 'Enter password';
    text.className = 'text-[10px] font-bold text-hug-muted';
    return;
  }

  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  if (score <= 1) {
    bar.style.width = '25%';
    bar.className = 'h-full bg-danger transition-all duration-300';
    text.textContent = 'Weak';
    text.className = 'text-[10px] font-bold text-danger';
  } else if (score === 2 || score === 3) {
    bar.style.width = '65%';
    bar.className = 'h-full bg-warning transition-all duration-300';
    text.textContent = 'Medium (Good)';
    text.className = 'text-[10px] font-bold text-[#C97A00]';
  } else {
    bar.style.width = '100%';
    bar.className = 'h-full bg-success transition-all duration-300';
    text.textContent = 'Strong (Excellent)';
    text.className = 'text-[10px] font-bold text-success';
  }
}

function saveNewPasswordFromSettings() {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const currPwd = (document.getElementById('settings-curr-pwd')?.value || '').trim();
  const newPwd = (document.getElementById('settings-new-pwd')?.value || '').trim();
  const confirmPwd = (document.getElementById('settings-confirm-pwd')?.value || '').trim();

  if (!currPwd) {
    toast('Error: Please enter your current/temporary password.');
    return;
  }
  if (!newPwd) {
    toast('Error: Please enter a new secure password.');
    return;
  }
  if (newPwd.length < 6) {
    toast('Error: New password must be at least 6 characters.');
    return;
  }
  if (newPwd !== confirmPwd) {
    toast('Error: New password and confirmation do not match.');
    return;
  }

  const db = getDB();
  db.userPasswords = db.userPasswords || {};
  db.userPasswords[currentRole] = newPwd;
  saveDB(db);

  const userName = currentRole === 'manager' ? 'Jose Reyes' : (currentRole === 'superadmin' ? 'Engr. Mateo Alcantara' : 'Juan dela Cruz');
  logSystemEvent(
    'audit',
    'User Password Updated',
    `${userName} (${currentRole.toUpperCase()})`,
    'User updated security credentials via Settings Console.',
    userName,
    'Approved'
  );

  // Clear inputs and hide warning
  document.getElementById('settings-curr-pwd').value = '';
  document.getElementById('settings-new-pwd').value = '';
  document.getElementById('settings-confirm-pwd').value = '';
  checkPasswordStrength('');
  
  const tempBanner = document.getElementById('temp-pwd-warning');
  if (tempBanner) tempBanner.classList.add('hidden');

  toast('Success: Account password updated securely!');
}

function clearLocalClientCache() {
  toast('Clearing temporary client cache and session buffers...');
  setTimeout(() => {
    toast('Cache purged. All telemetry and sync queues verified!');
  }, 600);
}

function renderSettings() {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const roleName = currentRole === 'superadmin' ? 'Super Admin' : (currentRole === 'manager' ? 'Farm Manager' : 'SRA (Admin)');
  const userName = currentRole === 'manager' ? 'Jose Reyes' : (currentRole === 'superadmin' ? 'Engr. Mateo Alcantara' : 'Juan dela Cruz');

  const diagUser = document.getElementById('settings-diag-user');
  const diagRole = document.getElementById('settings-diag-role');
  const pageBadge = document.getElementById('settings-page-role-badge');
  const storageEl = document.getElementById('settings-storage-size');
  const darkToggle = document.getElementById('dark-mode-toggle');
  const tempBanner = document.getElementById('temp-pwd-warning');

  if (diagUser) diagUser.textContent = userName;
  if (diagRole) diagRole.textContent = roleName;
  if (pageBadge) pageBadge.textContent = roleName;
  if (darkToggle) darkToggle.checked = document.documentElement.classList.contains('dark');

  const db = getDB();
  const hasCustomPwd = db.userPasswords && db.userPasswords[currentRole];
  if (tempBanner) {
    if (hasCustomPwd) {
      tempBanner.classList.add('hidden');
    } else {
      tempBanner.classList.remove('hidden');
    }
  }

  // Calculate local storage size
  try {
    const raw = localStorage.getItem('hugpong_db') || '';
    const kb = (new Blob([raw]).size / 1024).toFixed(1);
    if (storageEl) storageEl.textContent = `~${kb} KB Active`;
  } catch (e) {
    if (storageEl) storageEl.textContent = 'Active (Ready)';
  }

  switchSettingsTab('appearance');
}

function toggleDarkMode(isDark) {
  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('hugpong_theme', 'dark');
    toast('Dark Mode enabled');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('hugpong_theme', 'light');
    toast('Light Mode enabled');
  }
  const darkToggle = document.getElementById('dark-mode-toggle');
  if (darkToggle) darkToggle.checked = isDark;
  renderPriceHistoryChart();
  renderCostEfficiencyChart();
}

function initTheme() {
  const savedTheme = localStorage.getItem('hugpong_theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    const darkToggle = document.getElementById('dark-mode-toggle');
    if (darkToggle) darkToggle.checked = true;
  }
}

function handleLogout() {
  closeUserMenu();
  const ok = confirm('Are you sure you want to sign out of HUGPONG Admin Console?');
  if (ok) {
    toast('Signed out. Redirecting...');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 500);
  }
}

// Initialize theme on load
initTheme();

window.toggleUserMenu = toggleUserMenu;
window.closeUserMenu = closeUserMenu;
window.renderSettings = renderSettings;
window.toggleDarkMode = toggleDarkMode;
window.handleLogout = handleLogout;
window.switchSettingsTab = switchSettingsTab;
window.togglePwdVisibility = togglePwdVisibility;
window.checkPasswordStrength = checkPasswordStrength;
window.saveNewPasswordFromSettings = saveNewPasswordFromSettings;
window.clearLocalClientCache = clearLocalClientCache;
window.exportDatabaseJSON = exportDatabaseJSON;
window.importDatabaseJSON = importDatabaseJSON;
window.setSyncInactivityThresholdHours = setSyncInactivityThresholdHours;
window.getSyncInactivityThresholdHours = getSyncInactivityThresholdHours;

