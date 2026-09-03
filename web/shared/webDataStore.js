// ══════════════════════════════════════════════════════════════
// HUGPONG — Canonical Database Schema & Domain Configuration
// Single Canonical Source of Truth: Cloud Firestore / Server DB
// ══════════════════════════════════════════════════════════════

var INITIAL_DATABASE = {
  blockFarms: [
    {
      id: 'BLK-NCY-01',
      code: 'BLK-NCY-01',
      name: 'Nacayao Block Farm',
      location: 'Silay City, Negros Occidental',
      farmManagerId: '03000001',
      farmManagerName: 'Jose Reyes',
      declaredHa: 15.25,
      activePlots: 5,
      cooperative: 'Silay Planters Sugarcane Agrarian Reform Cooperative',
      createdAt: '2026-05-01T08:00:00Z',
      updatedAt: '2026-05-01T08:00:00Z'
    }
  ],
  fields: [
    { id: 'FLD-NCY-001', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', memberId: '04000001', member: 'Juan dela Cruz', memberName: 'Juan dela Cruz', ha: 1.5, stage: 'Pre-Planting & Land Preparation', stageNumber: 1, month: 0.5, batchMonth: 1, synced: true, lastSync: '10 mins ago', variety: 'VMC 84-524', soilType: 'Clay Loam' },
    { id: 'FLD-NCY-002', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', memberId: '04000002', member: 'Pedro Reyes', memberName: 'Pedro Reyes', ha: 2.5, stage: 'Planting & Crop Establishment', stageNumber: 2, month: 1.0, batchMonth: 1, synced: true, lastSync: '15 mins ago', variety: 'Phil 99-1793', soilType: 'Sandy Loam' },
    { id: 'FLD-NCY-003', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', memberId: '04000003', member: 'Corazon Santos', memberName: 'Corazon Santos', ha: 4.5, stage: 'Basal Nutrition & Early Care', stageNumber: 3, month: 1.5, batchMonth: 1, synced: true, lastSync: '1 hr ago', variety: 'Phil 2006-2289', soilType: 'Clay Loam' },
    { id: 'FLD-NCY-004', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', memberId: '04000004', member: 'Roberto Tan', memberName: 'Roberto Tan', ha: 3.5, stage: 'Cultivation & Weed Management', stageNumber: 4, month: 2.5, batchMonth: 2, synced: true, lastSync: '2 hrs ago', variety: 'VMC 84-524', soilType: 'Loam' },
    { id: 'FLD-NCY-005', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', memberId: '04000005', member: 'Ana Gomez', memberName: 'Ana Gomez', ha: 3.25, stage: 'Crop Maintenance & Final Hilling-Up', stageNumber: 5, month: 3.5, batchMonth: 2, synced: true, lastSync: '3 hrs ago', variety: 'Phil 99-1793', soilType: 'Clay Loam' }
  ],
  users: [
    { employeeId: '01000001', contact: '09187654321', mobile: '09187654321', name: 'Capstone Group (Admin)', role: 'Super Admin', roleKey: 'superadmin', blockFarmId: '', blockFarm: '', blockFarmScope: '', fieldId: '', logsHandled: 256, regDate: '2026-01-01', password: 'password123' },
    { employeeId: '01000002', contact: '09451774699', mobile: '09451774699', name: 'Project Lead', role: 'Super Admin', roleKey: 'superadmin', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', blockFarmScope: 'Nacayao Block Farm', fieldId: '', logsHandled: 120, regDate: '2026-01-01', password: 'password123' },
    { employeeId: '02000001', contact: '09194448888', mobile: '09194448888', name: 'Engr. Maria Santos', role: 'SRA (Admin)', roleKey: 'admin', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', blockFarmScope: 'Nacayao Block Farm', fieldId: '', logsHandled: 84, regDate: '2026-01-15', password: 'password123' },
    { employeeId: '03000001', contact: '09189876543', mobile: '09189876543', name: 'Jose Reyes', role: 'Farm Manager', roleKey: 'manager', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', blockFarmScope: 'Nacayao Block Farm', fieldId: '', logsHandled: 168, regDate: '2026-02-01', password: 'password123' },
    { employeeId: '04000001', contact: '09171234567', mobile: '09171234567', name: 'Juan dela Cruz', role: 'Member', roleKey: 'member', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', blockFarmScope: 'Nacayao Block Farm', fieldId: 'FLD-NCY-001', logsHandled: 24, regDate: '2026-02-10', password: 'password123' },
    { employeeId: '04000002', contact: '09179876543', mobile: '09179876543', name: 'Pedro Reyes', role: 'Member', roleKey: 'member', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', blockFarmScope: 'Nacayao Block Farm', fieldId: 'FLD-NCY-002', logsHandled: 18, regDate: '2026-02-12', password: 'password123' },
    { employeeId: '04000003', contact: '09194448889', mobile: '09194448889', name: 'Corazon Santos', role: 'Member', roleKey: 'member', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', blockFarmScope: 'Nacayao Block Farm', fieldId: 'FLD-NCY-003', logsHandled: 22, regDate: '2026-02-14', password: 'password123' },
    { employeeId: '04000004', contact: '09987654321', mobile: '09987654321', name: 'Roberto Tan', role: 'Member', roleKey: 'member', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', blockFarmScope: 'Nacayao Block Farm', fieldId: 'FLD-NCY-004', logsHandled: 15, regDate: '2026-02-20', password: 'password123' },
    { employeeId: '04000005', contact: '09555444333', mobile: '09555444333', name: 'Ana Gomez', role: 'Member', roleKey: 'member', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', blockFarmScope: 'Nacayao Block Farm', fieldId: 'FLD-NCY-005', logsHandled: 9, regDate: '2026-03-01', password: 'password123' }
  ],
  logs: [
    {
      id: 'LOG-2026-NCY-001-001',
      fieldId: 'FLD-NCY-001',
      stageNumber: 1,
      stageName: 'Stage 1: Pre-Planting & Land Preparation',
      taskId: 'S1',
      sraOperationId: 'SRA-02',
      operationName: 'Land Preparation',
      activity: 'Land Preparation (Disc Plowing & Furrowing)',
      category: 'prep',
      cost: 18000,
      totalCost: 18000,
      costPerHa: 12000,
      hectares: '1.5',
      people: '2',
      date: '2026-05-02',
      approved: true,
      status: 'Recorded',
      isOffline: false,
      loggedBy: 'Juan dela Cruz (Member)',
      subItems: [
        { id: 'SI-001-1', description: '1st Pass Disc Plowing (Tractor)', qty: 1.5, unit: 'ha', unitCost: 5000, subTotal: 7500 },
        { id: 'SI-001-2', description: '2nd Pass Disc Harrowing', qty: 1.5, unit: 'ha', unitCost: 4000, subTotal: 6000 },
        { id: 'SI-001-3', description: 'Furrowing / Tudling', qty: 1.5, unit: 'ha', unitCost: 3000, subTotal: 4500 }
      ]
    },
    {
      id: 'LOG-2026-NCY-002-001',
      fieldId: 'FLD-NCY-002',
      stageNumber: 2,
      stageName: 'Stage 2: Planting & Crop Establishment',
      taskId: 'S2',
      sraOperationId: 'SRA-03',
      operationName: 'Cost of Planting Material (Seedcane acquisition)',
      activity: 'Cost of Planting Material (Patdan)',
      category: 'plant',
      cost: 37500,
      totalCost: 37500,
      costPerHa: 15000,
      hectares: '2.5',
      people: '4',
      date: '2026-05-08',
      approved: true,
      status: 'Recorded',
      isOffline: false,
      loggedBy: 'Pedro Reyes (Member)',
      subItems: [
        { id: 'SI-002-1', description: 'Cane Points (Patdan - VMC 84-524)', qty: 12.5, unit: 'lac', unitCost: 3000, subTotal: 37500 }
      ]
    },
    {
      id: 'LOG-2026-NCY-003-001',
      fieldId: 'FLD-NCY-003',
      stageNumber: 3,
      stageName: 'Stage 3: Basal Nutrition & Early Care',
      taskId: 'S3',
      sraOperationId: 'SRA-05',
      operationName: 'Basal Fertilizer Application',
      activity: 'Basal Fertilizer (Urea + Complete + Potash)',
      category: 'fert',
      cost: 71100,
      totalCost: 71100,
      costPerHa: 15800,
      hectares: '4.5',
      people: '6',
      date: '2026-05-12',
      approved: true,
      status: 'Recorded',
      isOffline: false,
      loggedBy: 'Corazon Santos (Member)',
      subItems: [
        { id: 'SI-003-1', description: '46-00-00 Urea Application', qty: 9, unit: 'bag', unitCost: 1600, subTotal: 14400 },
        { id: 'SI-003-2', description: '18-46-00 DAP / Complete', qty: 13.5, unit: 'bag', unitCost: 2500, subTotal: 33750 },
        { id: 'SI-003-3', description: '00-00-60 Potash (MOP)', qty: 9, unit: 'bag', unitCost: 2200, subTotal: 19800 },
        { id: 'SI-003-4', description: 'Fertilizer Application Labor', qty: 31.5, unit: 'bag', unitCost: 100, subTotal: 3150 }
      ]
    },
    {
      id: 'LOG-2026-NCY-004-001',
      fieldId: 'FLD-NCY-004',
      stageNumber: 4,
      stageName: 'Stage 4: Cultivation & Weed Management',
      taskId: 'S4',
      sraOperationId: 'SRA-07',
      operationName: 'Cultivation (Off-barring & On-barring)',
      activity: 'Pahubas & Off-barring Pass',
      category: 'weed',
      cost: 10500,
      totalCost: 10500,
      costPerHa: 3000,
      hectares: '3.5',
      people: '3',
      date: '2026-05-18',
      approved: true,
      status: 'Recorded',
      isOffline: false,
      loggedBy: 'Roberto Tan (Member)',
      subItems: [
        { id: 'SI-004-1', description: '1st Off-barring (Pahubas)', qty: 7, unit: 'pass', unitCost: 750, subTotal: 5250 },
        { id: 'SI-004-2', description: '2nd Off-barring (Pahubas)', qty: 7, unit: 'pass', unitCost: 750, subTotal: 5250 }
      ]
    },
    {
      id: 'LOG-2026-NCY-005-001',
      fieldId: 'FLD-NCY-005',
      stageNumber: 5,
      stageName: 'Stage 5: Crop Maintenance & Final Hilling-Up',
      taskId: 'S5',
      sraOperationId: 'SRA-10',
      operationName: 'Final Hilling-up (Pasungkal)',
      activity: 'Pasungkal Tractor Pass',
      category: 'maint',
      cost: 8125,
      totalCost: 8125,
      costPerHa: 2500,
      hectares: '3.25',
      people: '2',
      date: '2026-05-22',
      approved: true,
      status: 'Recorded',
      isOffline: false,
      loggedBy: 'Ana Gomez (Member)',
      subItems: [
        { id: 'SI-005-1', description: 'Final Hilling-Up / Pasungkal Pass', qty: 3.25, unit: 'ha', unitCost: 2500, subTotal: 8125 }
      ]
    }
  ],
  priceHistory: [
    { id: 'PRC-2026-W04-MAY', week: 'Week 4 May', price: 2950, molasses: 4400, date: '2026-05-21', change: 70, molassesChange: 100, source: 'SRA Official Circular #105' },
    { id: 'PRC-2026-W03-MAY', week: 'Week 3 May', price: 2880, molasses: 4300, date: '2026-05-14', change: 80, molassesChange: 50, source: 'SRA Official Circular #104' },
    { id: 'PRC-2026-W02-MAY', week: 'Week 2 May', price: 2800, molasses: 4250, date: '2026-05-07', change: 50, molassesChange: 50, source: 'SRA Official Circular #103' },
    { id: 'PRC-2026-W01-MAY', week: 'Week 1 May', price: 2750, molasses: 4200, date: '2026-04-30', change: 50, molassesChange: 0, source: 'SRA Official Circular #102' },
    { id: 'PRC-2026-W04-APR', week: 'Week 4 Apr', price: 2700, molasses: 4200, date: '2026-04-23', change: 50, molassesChange: 0, source: 'SRA Official Circular #99' }
  ],
  supportTickets: [
    {
      id: 'TCK-2026-001',
      memberId: '04000001',
      memberName: 'Juan dela Cruz',
      contact: '09171234567',
      fieldId: 'FLD-NCY-001',
      blockFarm: 'Nacayao Block Farm',
      subject: 'Inquiry on SRA Cal-Mag / Agricultural Lime Allocation',
      category: 'Fertilizer Allocation',
      priority: 'Normal',
      status: 'Open',
      createdAt: '2026-05-20T10:00:00Z',
      messages: [
        { sender: 'Juan dela Cruz', text: 'Good morning Manager Jose, ask ko lang if available na sa co-op bodega ang 2 tons of lime allocation for FLD-NCY-001?', timestamp: '2026-05-20T10:00:00Z' }
      ]
    },
    {
      id: 'TCK-2026-002',
      memberId: '04000002',
      memberName: 'Pedro Reyes',
      contact: '09179876543',
      fieldId: 'FLD-NCY-002',
      blockFarm: 'Nacayao Block Farm',
      subject: 'Tractor Schedule for 2nd Off-barring',
      category: 'Machinery Scheduling',
      priority: 'High',
      status: 'In Progress',
      createdAt: '2026-05-21T08:30:00Z',
      messages: [
        { sender: 'Pedro Reyes', text: 'Requesting tractor assistance for FLD-NCY-002 this Friday.', timestamp: '2026-05-21T08:30:00Z' },
        { sender: 'Jose Reyes (Manager)', text: 'Noted Pedro. Scheduled Tractor #2 for Friday 7:00 AM.', timestamp: '2026-05-21T09:15:00Z' }
      ]
    }
  ],
  auditReports: [
    {
      id: 'RPT-2026-05-NCY01',
      reportId: 'RPT-2026-05-NCY01',
      qrHash: 'HUG-202605-A3F9',
      qrPayload: 'HUG-202605-A3F9',
      blockFarmId: 'BLK-NCY-01',
      blockFarmName: 'Nacayao Block Farm',
      period: 'May 2026',
      totalHectares: 15.25,
      activePlots: 5,
      totalLogs: 14,
      totalCost: 145225,
      certifiedBy: 'Engr. Maria Santos (SRA Officer)',
      certifiedRole: 'SRA (Admin)',
      certifiedAt: '2026-05-30T14:30:00Z',
      status: 'Certified',
      notes: 'Fully audited against SRA S1-S14 Sugar Agronomic Benchmark standards.'
    }
  ],
  systemHistory: [
    {
      id: 'AUD-2026-0001',
      category: 'audit',
      categoryLabel: 'SRA Price / Audit',
      eventType: 'Report Certification',
      entity: 'RPT-2026-05-NCY01',
      entityType: 'Audit Report',
      actor: 'Engr. Maria Santos (SRA Officer)',
      actorId: '02000001',
      details: 'Certified May 2026 Block Farm Monthly Agronomic Report with QR Hash HUG-202605-A3F9.',
      timestamp: 'May 30, 2026, 02:30 PM',
      createdAt: '2026-05-30T14:30:00Z',
      status: 'Success'
    },
    {
      id: 'AUD-2026-0002',
      category: 'plot',
      categoryLabel: 'Plot Registry',
      eventType: 'Field Stage Advance',
      entity: 'FLD-NCY-002',
      entityType: 'Field Plot',
      actor: 'Jose Reyes (Farm Manager)',
      actorId: '03000001',
      details: 'Updated FLD-NCY-002 crop stage to Stage 2: Planting & Crop Establishment.',
      timestamp: 'May 08, 2026, 11:00 AM',
      createdAt: '2026-05-08T11:00:00Z',
      status: 'Recorded'
    },
    {
      id: 'AUD-2026-0003',
      category: 'sra',
      categoryLabel: 'SRA Price / Audit',
      eventType: 'Price Circular Published',
      entity: 'PRC-2026-W04-MAY',
      entityType: 'SRA Price',
      actor: 'Capstone Group (Super Admin)',
      actorId: '01000001',
      details: 'Broadcasted SRA Circular #105 (₱2,950/Lkg Sugar, ₱4,400/MT Molasses).',
      timestamp: 'May 21, 2026, 09:00 AM',
      createdAt: '2026-05-21T09:00:00Z',
      status: 'Recorded'
    }
  ],
  syncOperations: [
    {
      id: 'SYNC-2026-0001',
      clientLogId: 'LOG-2026-NCY-001-001',
      deviceId: 'SM-A546E-01',
      memberId: '04000001',
      memberName: 'Juan dela Cruz',
      fieldId: 'FLD-NCY-001',
      operation: 'SRA-02: Land Preparation',
      status: 'Reconciled',
      syncedAt: '2026-05-02T16:20:00Z'
    },
    {
      id: 'SYNC-2026-0002',
      clientLogId: 'LOG-2026-NCY-003-001',
      deviceId: 'SM-G990B-02',
      memberId: '04000003',
      memberName: 'Corazon Santos',
      fieldId: 'FLD-NCY-003',
      operation: 'SRA-05: Basal Fertilization',
      status: 'Reconciled',
      syncedAt: '2026-05-12T17:45:00Z'
    }
  ],
  pendingUsers: [],
  syncLogs: [],
  securityLogs: [],
  registryHistory: [],
  terminalDiagnostics: []
};

if (typeof window !== 'undefined') {
  window.INITIAL_DATABASE = INITIAL_DATABASE;
}
