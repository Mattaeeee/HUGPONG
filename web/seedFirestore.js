// ══════════════════════════════════════════════════════════════
// HUGPONG — Automated Cloud Firestore Database Seeder
// Project: hugpong-ff
// ══════════════════════════════════════════════════════════════

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js';
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  writeBatch
} from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js';

import { webFirebaseConfig } from './shared/firebase-init.js';

export async function seedFirestoreDatabase(force = false) {
  const app = initializeApp(webFirebaseConfig);
  const db = getFirestore(app);

  console.log('[HUGPONG Seeder] Checking Firestore collections on hugpong-ff...');

  // Check if fields collection is already populated
  const fieldsSnap = await getDocs(collection(db, 'fields'));
  if (!force && !fieldsSnap.empty) {
    console.log(`[HUGPONG Seeder] Database already populated with ${fieldsSnap.size} field plots. Skipping seed.`);
    return { status: 'already_seeded', fieldCount: fieldsSnap.size };
  }

  console.log('[HUGPONG Seeder] Seeding initial cooperative dataset to Firestore...');

  const batch = writeBatch(db);

  // 1. SEED BLOCK FARMS (Canonical Block Farm Entities)
  const initialBlockFarms = [
    { id: 'BLK-NCY-01', code: 'BLK-NCY', name: 'Nacayao Block Farm', location: 'Silay City, Negros Occidental', farmManagerId: '03000001', declaredHa: 15.25, activePlots: 5 }
  ];

  initialBlockFarms.forEach(bf => {
    const ref = doc(db, 'block_farms', bf.id);
    batch.set(ref, { ...bf, updatedAt: new Date().toISOString() }, { merge: true });
  });

  // 2. SEED FIELDS (Relational: references blockFarmId and memberId)
  const initialFields = [
    { id: 'FLD-NCY-001', blockFarmId: 'BLK-NCY-01', memberId: '04000001', ha: 1.5, stage: 'Pre-Planting & Land Preparation', stageNumber: 1, month: 0.5, batchMonth: 1, synced: true, lastSync: '15 mins ago', customStages: [] },
    { id: 'FLD-NCY-002', blockFarmId: 'BLK-NCY-01', memberId: '04000002', ha: 2.5, stage: 'Planting & Crop Establishment', stageNumber: 2, month: 1.0, batchMonth: 1, synced: true, lastSync: '10 mins ago', customStages: [] },
    { id: 'FLD-NCY-003', blockFarmId: 'BLK-NCY-01', memberId: '04000003', ha: 4.5, stage: 'Basal Nutrition & Early Care', stageNumber: 3, month: 1.2, batchMonth: 1, synced: true, lastSync: '2 hrs ago', customStages: [] },
    { id: 'FLD-NCY-004', blockFarmId: 'BLK-NCY-01', memberId: '04000004', ha: 3.5, stage: 'Cultivation & Weed Management', stageNumber: 4, month: 2.5, batchMonth: 2, synced: true, lastSync: '1 hr ago', customStages: [] },
    { id: 'FLD-NCY-005', blockFarmId: 'BLK-NCY-01', memberId: '04000005', ha: 3.25, stage: 'Crop Maintenance & Final Hilling-Up', stageNumber: 5, month: 3.5, batchMonth: 2, synced: true, lastSync: '4 hrs ago', customStages: [] },
  ];

  initialFields.forEach(f => {
    const ref = doc(db, 'fields', f.id);
    batch.set(ref, { ...f, updatedAt: new Date().toISOString() }, { merge: true });
  });

  // 3. SEED USERS DIRECTORY (8-Digit Role-Prefixed Numeric IDs)
  // 01xxxxxx: Super Admin | 02xxxxxx: SRA Admin | 03xxxxxx: Farm Manager | 04xxxxxx: Member
  const initialUsers = [
    { employeeId: '02000001', contact: '09194448888', name: 'Maria Santos', role: 'SRA (Admin)', blockFarmId: 'BLK-NCY-01', fieldId: '', logsHandled: 42, regDate: '2026-01-15' },
    { employeeId: '03000001', contact: '09189876543', name: 'Jose Reyes', role: 'Farm Manager', blockFarmId: 'BLK-NCY-01', fieldId: '', logsHandled: 128, regDate: '2026-02-01' },
    { employeeId: '01000001', contact: '09187654321', name: 'Capstone Group', role: 'Super Admin', blockFarmId: '', fieldId: '', logsHandled: 256, regDate: '2026-01-01' },
    { employeeId: '04000001', contact: '09171234567', name: 'Juan dela Cruz', role: 'Member', blockFarmId: 'BLK-NCY-01', fieldId: 'FLD-NCY-001', logsHandled: 14, regDate: '2026-02-10' },
    { employeeId: '04000002', contact: '09179876543', name: 'Jose Reyes', role: 'Member', blockFarmId: 'BLK-NCY-01', fieldId: 'FLD-NCY-002', logsHandled: 8, regDate: '2026-02-12' },
    { employeeId: '04000003', contact: '09194448889', name: 'Maria Santos', role: 'Member', blockFarmId: 'BLK-NCY-01', fieldId: 'FLD-NCY-003', logsHandled: 19, regDate: '2026-02-14' },
    { employeeId: '04000004', contact: '09987654321', name: 'Pedro Reyes', role: 'Member', blockFarmId: 'BLK-NCY-01', fieldId: 'FLD-NCY-004', logsHandled: 23, regDate: '2026-02-20' },
    { employeeId: '04000005', contact: '09555444333', name: 'Ana Gomez', role: 'Member', blockFarmId: 'BLK-NCY-01', fieldId: 'FLD-NCY-005', logsHandled: 3, regDate: '2026-03-01' },
  ];

  initialUsers.forEach(u => {
    const cleanId = u.contact.replace(/\D/g, '');
    const ref = doc(db, 'users', cleanId);
    batch.set(ref, { ...u, updatedAt: new Date().toISOString() }, { merge: true });
  });

  // 3. SEED SRA WEEKLY SUGAR & MOLASSES PRICES
  const initialPrices = [
    { id: 'PRC-2026-W04-MAY', week: 'Week 4 May', price: 2950, molasses: 4400, date: '2026-05-21', change: 70, molassesChange: 100, source: 'SRA Circular #105' },
    { id: 'PRC-2026-W03-MAY', week: 'Week 3 May', price: 2880, molasses: 4300, date: '2026-05-14', change: 80, molassesChange: 50, source: 'SRA Circular #104' },
    { id: 'PRC-2026-W02-MAY', week: 'Week 2 May', price: 2800, molasses: 4250, date: '2026-05-07', change: 50, molassesChange: 50, source: 'SRA Circular #103' },
    { id: 'PRC-2026-W01-MAY', week: 'Week 1 May', price: 2750, molasses: 4200, date: '2026-04-30', change: 50, molassesChange: 0, source: 'SRA Circular #102' },
    { id: 'PRC-2026-W04-APR', week: 'Week 4 Apr', price: 2700, molasses: 4200, date: '2026-04-23', change: 50, molassesChange: 0, source: 'SRA Circular #99' },
    { id: 'PRC-2026-W03-APR', week: 'Week 3 Apr', price: 2650, molasses: 4200, date: '2026-04-16', change: -20, molassesChange: -50, source: 'SRA Circular #98' },
    { id: 'PRC-2026-W02-APR', week: 'Week 2 Apr', price: 2670, molasses: 4250, date: '2026-04-09', change: 70, molassesChange: 50, source: 'SRA Circular #97' },
    { id: 'PRC-2026-W01-APR', week: 'Week 1 Apr', price: 2600, molasses: 4200, date: '2026-04-02', change: 50, molassesChange: 50, source: 'SRA Circular #96' }
  ];

  initialPrices.forEach(p => {
    const ref = doc(db, 'sra_prices', p.id);
    batch.set(ref, { ...p, createdAt: new Date().toISOString() }, { merge: true });
  });

  // 4. SEED OPERATION LOGS (With Standard Sub-Items Schema)
  const initialLogs = [
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
      loggedBy: 'Manager (Jose Reyes - Takeover)',
      subItems: [
        { id: 'SI-LOG-NCY002-001-1', description: 'Cane Points (Patdan - VMC 84-524)', qty: 12.5, unit: 'lac', unitCost: 3000, subTotal: 37500 }
      ]
    },
    {
      id: 'LOG-2026-NCY-004-001',
      fieldId: 'FLD-NCY-004',
      stageNumber: 1,
      stageName: 'Stage 1: Pre-Planting & Land Preparation',
      taskId: 'S1',
      sraOperationId: 'SRA-02',
      operationName: 'Land Preparation',
      activity: 'Land Preparation (Disc Plowing & Furrowing)',
      category: 'prep',
      cost: 42000,
      totalCost: 42000,
      costPerHa: 12000,
      hectares: '3.5',
      people: '4',
      date: '2026-05-15',
      approved: true,
      status: 'Recorded',
      isOffline: false,
      loggedBy: 'Farmer (Pedro Reyes)',
      subItems: [
        { id: 'SI-LOG-NCY004-001-1', description: '1st Pass Disc Plowing (Tractor)', qty: 3.5, unit: 'ha', unitCost: 5000, subTotal: 17500 },
        { id: 'SI-LOG-NCY004-001-2', description: '2nd Pass Disc Harrowing', qty: 3.5, unit: 'ha', unitCost: 4000, subTotal: 14000 },
        { id: 'SI-LOG-NCY004-001-3', description: 'Furrowing / Tudling', qty: 3.5, unit: 'ha', unitCost: 3000, subTotal: 10500 }
      ]
    }
  ];

  initialLogs.forEach(l => {
    const ref = doc(db, 'operation_logs', l.id);
    batch.set(ref, { ...l, createdAt: new Date().toISOString() }, { merge: true });
  });

  // 5. SEED SUPPORT TICKETS
  const initialTickets = [
    {
      id: 'TCK-2026-00801',
      title: 'Offline Log Sync Failure after 3 days offline',
      author: 'Juan dela Cruz (Member)',
      blockFarm: 'Nacayao Block Farm',
      category: 'Offline Sync',
      priority: 'High',
      status: 'Open',
      date: '2026-05-23',
      details: 'Completed 3 manual weeding and fertilization logs while in northern field without 4G. Logs remain in device queue after Wi-Fi reconnection.',
      resolutionNotes: '',
      createdAt: new Date().toISOString()
    },
    {
      id: 'TCK-2026-00802',
      title: 'Plot Boundary Hectarage Discrepancy',
      author: 'Jose Reyes (Farm Manager)',
      blockFarm: 'Nacayao Block Farm',
      category: 'Field Boundary',
      priority: 'Medium',
      status: 'In Progress',
      date: '2026-05-22',
      details: 'FLD-NCY-002 surveyed area is 2.5 Ha but satellite map boundary shows overlap with adjacent plot.',
      resolutionNotes: 'Re-survey coordinates dispatched to Silay surveyor.',
      createdAt: new Date().toISOString()
    }
  ];

  initialTickets.forEach(t => {
    const ref = doc(db, 'support_tickets', t.id);
    batch.set(ref, { ...t, createdAt: new Date().toISOString() }, { merge: true });
  });

  // Commit all writes
  await batch.commit();
  console.log('[HUGPONG Seeder] Success! All collections seeded to Firestore (hugpong-ff).');
  return { status: 'success', seededCount: initialFields.length + initialUsers.length + initialPrices.length + initialLogs.length + initialTickets.length };
}

// Auto-seed on load if requested or in browser context
if (typeof window !== 'undefined') {
  window.seedFirestoreDatabase = seedFirestoreDatabase;
}
