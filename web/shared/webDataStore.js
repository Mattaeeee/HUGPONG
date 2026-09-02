const SRA_BENCHMARKS = {
  associationName: 'Nacayao Small Farmers Association',
  location: 'Hda. Nacayao, Brgy. Kapitan Ramon, Silay City, Negros Occidental',
  totalBlockFarmArea: 30.1118,
  newPlantHa: 15.25,
  batch1Ha: 8.50,
  batch2Ha: 6.75,
  directCostPerHa: 66900,
  millingCostPerHa: 51000,
  totalCostPerHa: 117900,
  totalSeedcaneLac: 76.25,
  seedcaneLacPerHa: 5.0,
  totalFertilizerBags: 289.75,
  totalTillagePassesPerHa: 10,
  totalTillageHectarePasses: 152.5,
  targetYieldTonsPerHa: 60,
  totalHarvestTons: 915.0
};

const INITIAL_DATABASE = {
  fields: [
    // ── Block Farm A: Nacayao Small Farmers Association (15.25 Ha)
    { id: 'FLD-NCY-001', member: 'Juan dela Cruz', ha: 1.50, stage: 'Pre-Planting & Land Preparation', age: '0.5 months', synced: true, lastSync: '15 mins ago', syncLagDays: 0, blockFarm: 'Nacayao Block Farm A', batchMonth: 1, customStages: [] },
    { id: 'FLD-NCY-002', member: 'Jose Reyes', ha: 2.50, stage: 'Planting & Crop Establishment', age: '1.0 months', synced: true, lastSync: '4 days ago', syncLagDays: 4, blockFarm: 'Nacayao Block Farm A', batchMonth: 1, customStages: [] },
    { id: 'FLD-NCY-003', member: 'Maria Santos', ha: 4.50, stage: 'Basal Nutrition & Early Care', age: '1.2 months', synced: true, lastSync: '2 hrs ago', syncLagDays: 0, blockFarm: 'Nacayao Block Farm A', batchMonth: 1, customStages: [] },
    { id: 'FLD-NCY-004', member: 'Pedro Reyes', ha: 3.50, stage: 'Cultivation & Weed Management', age: '2.5 months', synced: true, lastSync: '1 hr ago', syncLagDays: 0, blockFarm: 'Nacayao Block Farm A', batchMonth: 2, customStages: [] },
    { id: 'FLD-NCY-005', member: 'Ana Gomez', ha: 3.25, stage: 'Crop Maintenance & Final Hilling-Up', age: '3.5 months', synced: true, lastSync: '5 hrs ago', syncLagDays: 0, blockFarm: 'Nacayao Block Farm A', batchMonth: 2, customStages: [] },

    // ── Block Farm B: Victorias Planters Cluster (28.00 Ha)
    { id: 'FLD-VIC-001', member: 'Emilio Aguinaldo', ha: 7.00, stage: 'Pre-Planting & Land Preparation', age: '0.8 months', synced: true, lastSync: '2 hrs ago', syncLagDays: 0, blockFarm: 'Block Farm B', batchMonth: 1, customStages: [] },
    { id: 'FLD-VIC-002', member: 'Gregorio del Pilar', ha: 8.00, stage: 'Planting & Crop Establishment', age: '1.1 months', synced: true, lastSync: '3 hrs ago', syncLagDays: 0, blockFarm: 'Block Farm B', batchMonth: 1, customStages: [] },
    { id: 'FLD-VIC-003', member: 'Marcelo H. del Pilar', ha: 6.50, stage: 'Basal Nutrition & Early Care', age: '1.4 months', synced: true, lastSync: '1 hr ago', syncLagDays: 0, blockFarm: 'Block Farm B', batchMonth: 2, customStages: [] },
    { id: 'FLD-VIC-004', member: 'Juan Luna', ha: 6.50, stage: 'Cultivation & Weed Management', age: '2.8 months', synced: true, lastSync: '30 mins ago', syncLagDays: 0, blockFarm: 'Block Farm B', batchMonth: 2, customStages: [] },

    // ── Block Farm C: Talisay Agrarian Cooperative (45.20 Ha)
    { id: 'FLD-TLS-001', member: 'Andres Bonifacio', ha: 12.00, stage: 'Basal Nutrition & Early Care', age: '1.5 months', synced: true, lastSync: '4 hrs ago', syncLagDays: 0, blockFarm: 'Block Farm C', batchMonth: 1, customStages: [] },
    { id: 'FLD-TLS-002', member: 'Apolinario Mabini', ha: 11.20, stage: 'Cultivation & Weed Management', age: '2.7 months', synced: true, lastSync: '6 hrs ago', syncLagDays: 0, blockFarm: 'Block Farm C', batchMonth: 1, customStages: [] },
    { id: 'FLD-TLS-003', member: 'Melchora Aquino', ha: 10.00, stage: 'Crop Maintenance & Final Hilling-Up', age: '4.0 months', synced: true, lastSync: '1 day ago', syncLagDays: 1, blockFarm: 'Block Farm C', batchMonth: 2, customStages: [] },
    { id: 'FLD-TLS-004', member: 'Gabriela Silang', ha: 12.00, stage: 'Harvesting & Post-Harvest Transport', age: '11.2 months', synced: true, lastSync: '15 mins ago', syncLagDays: 0, blockFarm: 'Block Farm C', batchMonth: 2, customStages: [] },

    // ── Block Farm D: Manapla Sugarcane Group (22.00 Ha)
    { id: 'FLD-MNP-001', member: 'Diego Silang', ha: 7.50, stage: 'Crop Maintenance & Final Hilling-Up', age: '3.8 months', synced: true, lastSync: '2 hrs ago', syncLagDays: 0, blockFarm: 'Block Farm D', batchMonth: 1, customStages: [] },
    { id: 'FLD-MNP-002', member: 'Teresa Magbanua', ha: 8.50, stage: 'Harvesting & Post-Harvest Transport', age: '11.0 months', synced: true, lastSync: '3 hrs ago', syncLagDays: 0, blockFarm: 'Block Farm D', batchMonth: 1, customStages: [] },
    { id: 'FLD-MNP-003', member: 'Francisco Dagohoy', ha: 6.00, stage: 'Planting & Crop Establishment', age: '1.0 months', synced: true, lastSync: '5 hrs ago', syncLagDays: 0, blockFarm: 'Block Farm D', batchMonth: 2, customStages: [] }
  ],
  logs: [
    {
      id: 'LOG-2026-NCY-001-001',
      fieldId: 'FLD-NCY-001',
      stageNumber: 1,
      stageName: 'Stage 1: Pre-Planting & Land Preparation',
      taskId: 'S1',
      sraOperationId: 'SRA-02',
      operationName: 'Land Preparation (Mechanical & Draft)',
      activity: 'Land Preparation (Mechanical & Draft)',
      category: 'prep',
      cost: 18000,
      totalCost: 18000,
      costPerHa: 12000,
      hectares: '1.5',
      people: '2',
      date: '2026-05-02',
      approved: false,
      status: 'Recorded',
      loggedBy: 'Farmer (Juan dela Cruz)',
      subItems: [
        { id: 'SI-LOG-NCY001-001-1', description: '1st Pass Disc Plowing (Tractor)', qty: 1.5, unit: 'ha', unitCost: 5000, subTotal: 7500 },
        { id: 'SI-LOG-NCY001-001-2', description: '2nd Pass Disc Harrowing', qty: 1.5, unit: 'ha', unitCost: 4000, subTotal: 6000 },
        { id: 'SI-LOG-NCY001-001-3', description: 'Furrowing / Tudling', qty: 1.5, unit: 'ha', unitCost: 3000, subTotal: 4500 }
      ]
    },
    {
      id: 'LOG-2026-NCY-002-001',
      fieldId: 'FLD-NCY-002',
      stageNumber: 2,
      stageName: 'Stage 2: Planting & Crop Establishment',
      taskId: 'S2',
      sraOperationId: 'SRA-03',
      operationName: 'Planting Material (Seedpieces)',
      activity: 'Planting Material (Seedpieces)',
      category: 'plant',
      cost: 37500,
      totalCost: 37500,
      costPerHa: 15000,
      hectares: '2.5',
      people: '4',
      date: '2026-05-08',
      approved: false,
      status: 'Recorded',
      loggedBy: 'Manager (Jose Reyes - Takeover)',
      subItems: [
        { id: 'SI-LOG-NCY002-001-1', description: 'Cane Points (Patdan - VMC 84-524)', qty: 12.5, unit: 'lac', unitCost: 3000, subTotal: 37500 }
      ]
    },
    {
      id: 'LOG-2026-NCY-003-001',
      fieldId: 'FLD-NCY-003',
      stageNumber: 3,
      stageName: 'Stage 3: Basal Nutrition & Early Care',
      taskId: 'S3',
      sraOperationId: 'SRA-05',
      operationName: 'Basal Fertilization',
      activity: 'Basal Fertilization',
      category: 'fert',
      cost: 38850,
      totalCost: 38850,
      costPerHa: 8633,
      hectares: '4.5',
      people: '3',
      date: '2026-05-12',
      approved: false,
      status: 'Recorded',
      loggedBy: 'Farmer (Ana Gomez)',
      subItems: [
        { id: 'SI-LOG-NCY003-001-1', description: 'Application of 46-00-00 (Urea Fertilizer)', qty: 6, unit: 'bag', unitCost: 2200, subTotal: 13200 },
        { id: 'SI-LOG-NCY003-001-2', description: 'Application of 18-46-00 (DAP / Complete)', qty: 9, unit: 'bag', unitCost: 2500, subTotal: 22500 },
        { id: 'SI-LOG-NCY003-001-3', description: 'Application of 00-00-60 (MOP / Potash)', qty: 6, unit: 'bag', unitCost: 2100, subTotal: 12600 },
        { id: 'SI-LOG-NCY003-001-4', description: 'Fertilizer Application Labor', qty: 3.0, unit: 'ha', unitCost: 1050, subTotal: 3150 }
      ]
    }
  ],
  priceHistory: [
    { week: 'Week 4 May', price: 2950, molasses: 4400, date: '2026-05-21', change: 70, molassesChange: 100, source: 'SRA Circular #105' },
    { week: 'Week 3 May', price: 2880, molasses: 4300, date: '2026-05-14', change: 80, molassesChange: 50, source: 'SRA Circular #104' },
    { week: 'Week 2 May', price: 2800, molasses: 4250, date: '2026-05-07', change: 50, molassesChange: 50, source: 'SRA Circular #103' },
    { week: 'Week 1 May', price: 2750, molasses: 4200, date: '2026-04-30', change: 50, molassesChange: 0, source: 'SRA Circular #102' },
    { week: 'Week 4 Apr', price: 2700, molasses: 4200, date: '2026-04-23', change: 50, molassesChange: 0, source: 'SRA Circular #99' },
    { week: 'Week 3 Apr', price: 2650, molasses: 4200, date: '2026-04-16', change: -20, molassesChange: -50, source: 'SRA Circular #98' },
    { week: 'Week 2 Apr', price: 2670, molasses: 4250, date: '2026-04-09', change: 70, molassesChange: 50, source: 'SRA Circular #97' },
    { week: 'Week 1 Apr', price: 2600, molasses: 4200, date: '2026-04-02', change: 50, molassesChange: 50, source: 'SRA Circular #96' },
    { week: 'Week 4 Mar', price: 2550, molasses: 4150, date: '2026-03-26', change: 70, molassesChange: 50, source: 'SRA Circular #95' },
    { week: 'Week 3 Mar', price: 2480, molasses: 4100, date: '2026-03-19', change: -20, molassesChange: 0, source: 'SRA Circular #94' },
    { week: 'Week 2 Mar', price: 2500, molasses: 4100, date: '2026-03-12', change: 50, molassesChange: 50, source: 'SRA Circular #93' },
    { week: 'Week 1 Mar', price: 2450, molasses: 4050, date: '2026-03-05', change: 0, molassesChange: 0, source: 'SRA Circular #92' }
  ],
  users: [
    { employeeId: '02000001', contact: '09194448888', name: 'Maria Santos', role: 'SRA (Admin)', blockFarm: 'Silay Sugar Regulatory Administration', logsHandled: 42, regDate: '2026-02-01' },
    { employeeId: '04000001', contact: '09171234567', name: 'Juan dela Cruz', role: 'Member', blockFarm: 'Nacayao Block Farm A', fieldId: 'FLD-NCY-001', logsHandled: 14, regDate: '2026-02-10' },
    { employeeId: '04000002', contact: '09179876543', name: 'Jose Reyes', role: 'Member', blockFarm: 'Nacayao Block Farm A', fieldId: 'FLD-NCY-002', logsHandled: 6, regDate: '2026-02-12' },
    { employeeId: '04000003', contact: '09194448889', name: 'Maria Santos', role: 'Member', blockFarm: 'Nacayao Block Farm A', fieldId: 'FLD-NCY-003', logsHandled: 10, regDate: '2026-02-15' },
    { employeeId: '04000004', contact: '09987654321', name: 'Pedro Reyes', role: 'Member', blockFarm: 'Nacayao Block Farm A', fieldId: 'FLD-NCY-004', logsHandled: 6, regDate: '2026-03-15' },
    { employeeId: '04000005', contact: '09555444333', name: 'Ana Gomez', role: 'Member', blockFarm: 'Nacayao Block Farm A', fieldId: 'FLD-NCY-005', logsHandled: 4, regDate: '2026-03-20' },
    { employeeId: '01000001', contact: '09187654321', name: 'Capstone Group', role: 'Super Admin', blockFarm: 'Central Governance', logsHandled: 256, regDate: '2026-01-01' },
    { employeeId: '03000001', contact: '09189876543', name: 'Jose Reyes', role: 'Farm Manager', blockFarm: 'Nacayao Block Farm A', logsHandled: 128, regDate: '2026-02-01' },
    { employeeId: '03000002', contact: '09123456789', name: 'Elena Ramos', role: 'Farm Manager', blockFarm: 'Block Farm B', logsHandled: 18, regDate: '2026-03-01' },
    { employeeId: '03000003', contact: '09171112233', name: 'Elena Batongbakal', role: 'Farm Manager', blockFarm: 'Block Farm C', logsHandled: 14, regDate: '2026-03-05' },
    { employeeId: '03000004', contact: '09174445566', name: 'Ricardo Dalisay', role: 'Farm Manager', blockFarm: 'Block Farm D', logsHandled: 9, regDate: '2026-03-12' }
  ],
  pendingUsers: [
    { contact: '0917-111-2233', name: 'Danilo Cruz', role: 'Member', blockFarm: 'Block Farm A', fieldId: 'FLD-KTR-007', area: '1.5 Ha', regDate: '2026-05-20' },
    { contact: '0918-222-3344', name: 'Elena Ramos', role: 'Farm Manager', blockFarm: 'Block Farm B', regDate: '2026-05-21' }
  ],
  systemHistory: [
    {
      id: 'AUD-094',
      timestamp: 'May 23, 2026, 04:00 PM',
      category: 'audit',
      categoryLabel: 'SRA Audit',
      eventType: 'Full Season Crop Audit Certified',
      entity: 'HUG-CROP-2026-FULL (Nacayao Block Farm A)',
      details: 'Verified and issued official SRA compliance certificate for 15.25 Ha New Plant full season ledger (14 certified operations, ₱1,797,550 total cost).',
      actor: 'SRA Inspectorate Maria Santos',
      status: 'Verified'
    },
    {
      id: 'AUD-093',
      timestamp: 'May 23, 2026, 08:45 AM',
      category: 'block',
      categoryLabel: 'Block Farm Registry',
      eventType: 'Block Farm Enrolled',
      entity: 'Block Farm C · Talisay (45.2 Ha)',
      details: 'Registered 45.2 Ha cooperative cluster under Silay Sugar Regulatory Administration oversight assigned to Manager Elena Batongbakal.',
      actor: 'Silay SRA Administrator',
      status: 'Enrolled'
    },
    {
      id: 'AUD-092',
      timestamp: 'May 22, 2026, 04:30 PM',
      category: 'block',
      categoryLabel: 'Block Farm Registry',
      eventType: 'Block Farm Enrolled',
      entity: 'Block Farm B · Victorias (28.0 Ha)',
      details: 'Registered 28.0 Ha cooperative cluster under Silay Sugar Regulatory Administration oversight assigned to Manager Elena Ramos.',
      actor: 'Silay SRA Administrator',
      status: 'Enrolled'
    },
    {
      id: 'AUD-091',
      timestamp: 'May 22, 2026, 02:00 PM',
      category: 'block',
      categoryLabel: 'Block Farm Registry',
      eventType: 'Block Farm Enrolled',
      entity: 'Nacayao Block Farm A · Silay (15.25 Ha)',
      details: 'Registered 15.25 Ha cooperative cluster under Silay Sugar Regulatory Administration oversight assigned to Manager Jose Reyes.',
      actor: 'Silay SRA Administrator',
      status: 'Enrolled'
    },
    {
      id: 'AUD-090',
      timestamp: 'May 22, 2026, 02:45 PM',
      category: 'audit',
      categoryLabel: 'SRA Audit',
      eventType: 'Field Operations QR Audit Verified',
      entity: 'HUG-202605-A3F9 (FLD-KTR-001)',
      details: 'Cryptographic QR signature verified for Juan dela Cruz field ops (Land Prep & Basal Nutrition). Certified for SRA production audit.',
      actor: 'SRA Inspectorate Maria Santos',
      status: 'Verified'
    },
    {
      id: 'AUD-089',
      timestamp: 'May 22, 2026, 03:15 PM',
      category: 'operation',
      categoryLabel: 'Field Operation',
      eventType: 'Manager Log Correction',
      entity: 'FLD-KTR-001 (Juan dela Cruz)',
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
      entity: 'FLD-KTR-002 (Jose Reyes)',
      details: 'Directly logged Planting (Patdan) 40,000 pcs on behalf of member. Advanced stage to Weeding.',
      actor: 'Farm Manager Jose Reyes',
      status: 'Recorded'
    },
    {
      id: 'AUD-087',
      timestamp: 'May 21, 2026, 09:00 AM',
      category: 'price',
      categoryLabel: 'SRA Price',
      eventType: 'Weekly SRA Price Broadcast',
      entity: 'District Millsite Benchmark',
      details: 'Posted Week 4 May Raw Sugar price: ₱2,950 / Lkg and Molasses: ₱4,400 / MT (Official SRA Circular #105).',
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
      entity: 'FLD-KTR-001 (Juan dela Cruz)',
      details: 'Offline log recorded: 4 bags Urea Fertilizer (₱6,400) applied by 4 workers.',
      actor: 'Member Juan dela Cruz',
      status: 'Recorded'
    },
    {
      id: 'AUD-081',
      timestamp: 'May 05, 2026, 05:00 PM',
      category: 'audit',
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
    { id: 'HIST-REG-001', date: '2026-02-15', entityType: 'Block Farm', entityId: 'BLK-A', name: 'Nacayao Block Farm A', manager: 'Jose Reyes', ha: 15.25, action: 'Initial Cooperative Enrollment', authority: 'Silay SRA Circular #88' },
    { id: 'HIST-REG-002', date: '2026-02-18', entityType: 'Block Farm', entityId: 'BLK-B', name: 'Block Farm B', manager: 'Elena Ramos', ha: 28.0, action: 'Initial Cooperative Enrollment', authority: 'Silay SRA Circular #89' },
    { id: 'HIST-REG-003', date: '2026-03-01', entityType: 'Block Farm', entityId: 'BLK-C', name: 'Block Farm C', manager: 'Elena Batongbakal', ha: 45.2, action: 'Initial Cooperative Enrollment', authority: 'Silay SRA Circular #91' },
    { id: 'HIST-REG-004', date: '2026-03-05', entityType: 'Block Farm', entityId: 'BLK-D', name: 'Block Farm D', manager: 'Ricardo Dalisay', ha: 22.0, action: 'Initial Cooperative Enrollment', authority: 'Silay SRA Circular #93' },
    { id: 'HIST-REG-005', date: '2026-03-10', entityType: 'Field Plot', entityId: 'FLD-KTR-001', name: 'Nacayao Block Farm A · Plot 1', member: 'Juan dela Cruz', ha: 1.5, action: 'Field Boundary Registration & Soil Test', authority: 'Farm Manager Jose Reyes' },
    { id: 'HIST-REG-006', date: '2026-03-12', entityType: 'Field Plot', entityId: 'FLD-KTR-002', name: 'Nacayao Block Farm A · Plot 2', member: 'Jose Reyes', ha: 2.5, action: 'Field Boundary Registration', authority: 'Farm Manager Jose Reyes' },
    { id: 'HIST-REG-007', date: '2026-03-15', entityType: 'Field Plot', entityId: 'FLD-KTR-003', name: 'Nacayao Block Farm A · Plot 3', member: 'Maria Santos', ha: 4.5, action: 'Field Boundary Registration', authority: 'Farm Manager Jose Reyes' },
    { id: 'HIST-REG-008', date: '2026-03-18', entityType: 'Field Plot', entityId: 'FLD-KTR-004', name: 'Nacayao Block Farm A · Plot 4', member: 'Pedro Reyes', ha: 3.5, action: 'Field Boundary Registration', authority: 'Farm Manager Jose Reyes' },
    { id: 'HIST-REG-009', date: '2026-03-20', entityType: 'Field Plot', entityId: 'FLD-KTR-005', name: 'Nacayao Block Farm A · Plot 5', member: 'Ana Gomez', ha: 3.25, action: 'Field Boundary Registration', authority: 'Farm Manager Jose Reyes' },
    { id: 'HIST-REG-010', date: '2026-03-22', entityType: 'Field Plot', entityId: 'FLD-KTR-006', name: 'Block Farm B · Plot 1', member: 'Emilio Aguinaldo', ha: 7.0, action: 'Field Boundary Registration', authority: 'Farm Manager Elena Ramos' },
    { id: 'HIST-REG-011', date: '2026-04-01', entityType: 'Field Plot', entityId: 'FLD-KTR-007', name: 'Block Farm C · Plot 1', member: 'Andres Bonifacio', ha: 12.0, action: 'Field Boundary Registration', authority: 'Farm Manager Elena Batongbakal' },
    { id: 'HIST-REG-012', date: '2026-04-05', entityType: 'Field Plot', entityId: 'FLD-KTR-008', name: 'Block Farm C · Plot 2', member: 'Apolinario Mabini', ha: 11.2, action: 'Field Boundary Registration', authority: 'Farm Manager Elena Batongbakal' },
    { id: 'HIST-REG-013', date: '2026-04-10', entityType: 'Field Plot', entityId: 'FLD-KTR-009', name: 'Block Farm D · Plot 1', member: 'Diego Silang', ha: 7.5, action: 'Field Boundary Registration', authority: 'Farm Manager Ricardo Dalisay' },
    { id: 'HIST-REG-014', date: '2026-04-15', entityType: 'Field Plot', entityId: 'FLD-KTR-010', name: 'Block Farm D · Plot 2', member: 'Teresa Magbanua', ha: 8.5, action: 'Field Boundary Registration', authority: 'Farm Manager Ricardo Dalisay' }
  ],
  supportTickets: [
    { id: 'TCK-801', title: 'Offline Log Sync Failure after 3 days offline', author: 'Juan dela Cruz (Member - FLD-KTR-001)', blockFarm: 'Nacayao Block Farm A', category: 'Offline Sync Collision', priority: 'High', status: 'Open', date: '2026-05-23', details: 'Completed 3 manual weeding and fertilization logs while in northern field without 4G. Logs remain in device queue after Wi-Fi reconnection.', resolutionNotes: '' },
    { id: 'TCK-802', title: 'Plot Boundary Hectarage Discrepancy', author: 'Jose Reyes (Farm Manager)', blockFarm: 'Nacayao Block Farm A', category: 'Plot Boundary Conflict', priority: 'Medium', status: 'In Progress', date: '2026-05-22 02:15 PM', details: 'FLD-KTR-002 surveyed area is 2.5 Ha but satellite map boundary shows overlap with adjacent FLD-KTR-005 by 0.3 Ha.', resolutionNotes: 'Re-survey coordinates dispatched to Silay surveyor.' },
    { id: 'TCK-803', title: 'QR Compilation Audit Scanner Timeout', author: 'Maria Santos (SRA Admin)', blockFarm: 'Silay Sugar Regulatory Administration', category: 'Hardware / App Crash', priority: 'Critical', status: 'In Progress', date: '2026-05-21 11:45 AM', details: 'Scanning high-density 24-log compressed QR code on older Android 11 terminal fails camera focus after 10s.', resolutionNotes: 'Compressing QR payload chunk size in upcoming hotfix.' },
    { id: 'TCK-804', title: 'Member Phone Number / OTP Lockout', author: 'Ana Gomez (Member - FLD-KTR-005)', blockFarm: 'Nacayao Block Farm A', category: 'Account / OTP Lockout', priority: 'Low', status: 'Resolved', date: '2026-05-19 04:00 PM', details: 'Lost SIM card 09555444333. Requested account number update to new SIM 09555444334.', resolutionNotes: 'Verified identity with Farm Manager Jose Reyes and updated user profile.' }
  ],
  terminalDiagnostics: [
    { deviceId: 'TRM-ANDR-01', model: 'Samsung Galaxy A14', staff: 'Jose Reyes (Manager)', blockFarm: 'Nacayao Block Farm A', os: 'Android 13', appVersion: 'v2.4.1-rc3', battery: '88%', cachedLogs: 0, lastSync: '2 mins ago', status: 'Optimal' },
    { deviceId: 'TRM-ANDR-02', model: 'Xiaomi Redmi 12', staff: 'Juan dela Cruz (Member)', blockFarm: 'Nacayao Block Farm A', os: 'Android 12', appVersion: 'v2.4.1-rc3', battery: '42%', cachedLogs: 2, lastSync: '3 hrs ago', status: 'Optimal' },
    { deviceId: 'TRM-ANDR-03', model: 'Realme C55', staff: 'Elena Ramos (Manager)', blockFarm: 'Block Farm B', os: 'Android 13', appVersion: 'v2.4.0', battery: '76%', cachedLogs: 0, lastSync: '15 mins ago', status: 'Optimal' },
    { deviceId: 'TRM-ANDR-04', model: 'Infinix Hot 30i', staff: 'Pedro Reyes (Member)', blockFarm: 'Block Farm C', os: 'Android 11', appVersion: 'v2.3.9 (Outdated)', battery: '19%', cachedLogs: 5, lastSync: '8 days ago', status: 'Lagging Alert' }
  ]
};

if (typeof window !== 'undefined') { window.SRA_BENCHMARKS = SRA_BENCHMARKS; window.INITIAL_DATABASE = INITIAL_DATABASE; }
