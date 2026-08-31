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

  // 1. SEED FIELDS (Nacayao Small Farmers Association - 15.25 Ha New Plant)
  const initialFields = [
    { id: 'FLD-KTR-001', member: 'Juan dela Cruz', owner: 'Juan dela Cruz', ha: 1.5, area: 1.5, stage: 'Fertilization (2nd Dose)', month: 3.5, batch: 'Batch 1 (Month 1)', batchMonth: 1, synced: true, lastSync: '15 mins ago', blockFarm: 'Nacayao Block Farm A', customStages: [] },
    { id: 'FLD-KTR-002', member: 'Jose Rizal', owner: 'Jose Rizal', ha: 2.5, area: 2.5, stage: 'Cultivation & Off-barring', month: 2.5, batch: 'Batch 1 (Month 1)', batchMonth: 1, synced: true, lastSync: '10 mins ago', blockFarm: 'Nacayao Block Farm A', customStages: [] },
    { id: 'FLD-KTR-003', member: 'Maria Santos', owner: 'Maria Santos', ha: 4.5, area: 4.5, stage: 'Land Preparation', month: 0.5, batch: 'Batch 1 (Month 1)', batchMonth: 1, synced: true, lastSync: '2 hrs ago', blockFarm: 'Nacayao Block Farm A', customStages: [] },
    { id: 'FLD-KTR-004', member: 'Pedro Reyes', owner: 'Pedro Reyes', ha: 3.5, area: 3.5, stage: 'Basal Fertilization', month: 2.0, batch: 'Batch 2 (Month 2)', batchMonth: 2, synced: true, lastSync: '1 hr ago', blockFarm: 'Nacayao Block Farm A', customStages: [] },
    { id: 'FLD-KTR-005', member: 'Ana Gomez', owner: 'Ana Gomez', ha: 3.25, area: 3.25, stage: 'Planting (Patdan)', month: 1.0, batch: 'Batch 2 (Month 2)', batchMonth: 2, synced: true, lastSync: '4 hrs ago', blockFarm: 'Nacayao Block Farm A', customStages: [] },
  ];

  initialFields.forEach(f => {
    const ref = doc(db, 'fields', f.id);
    batch.set(ref, { ...f, updatedAt: new Date().toISOString() }, { merge: true });
  });

  // 2. SEED USERS DIRECTORY
  const initialUsers = [
    { contact: '09194448888', name: 'SRA Administrator Maria Santos', role: 'SRA (Admin)', blockFarm: 'Silay Sugar Regulatory Administration', fieldId: '', logsHandled: 42, regDate: '2026-01-15' },
    { contact: '09189876543', name: 'Farm Manager Jose Reyes', role: 'Farm Manager', blockFarm: 'Nacayao Block Farm A', fieldId: '', logsHandled: 128, regDate: '2026-02-01' },
    { contact: '09187654321', name: 'Capstone Group', role: 'Super Admin', blockFarm: 'Central Governance', fieldId: '', logsHandled: 256, regDate: '2026-01-01' },
    { contact: '09171234567', name: 'Juan dela Cruz (Member)', role: 'Member', blockFarm: 'Nacayao Block Farm A', fieldId: 'FLD-KTR-001', logsHandled: 14, regDate: '2026-02-10' },
    { contact: '09175550102', name: 'Jose Rizal', role: 'Member', blockFarm: 'Nacayao Block Farm A', fieldId: 'FLD-KTR-002', logsHandled: 8, regDate: '2026-02-12' },
    { contact: '09175550103', name: 'Maria Santos', role: 'Member', blockFarm: 'Nacayao Block Farm A', fieldId: 'FLD-KTR-003', logsHandled: 19, regDate: '2026-02-14' },
    { contact: '09175550105', name: 'Pedro Reyes', role: 'Member', blockFarm: 'Nacayao Block Farm A', fieldId: 'FLD-KTR-004', logsHandled: 23, regDate: '2026-02-20' },
    { contact: '09175550107', name: 'Ana Gomez', role: 'Member', blockFarm: 'Nacayao Block Farm A', fieldId: 'FLD-KTR-005', logsHandled: 3, regDate: '2026-03-01' },
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

  // 4. SEED OPERATION LOGS (With Sub-Items Schema)
  const initialLogs = [
    {
      id: 'LOG-KTR-001',
      fieldId: 'FLD-KTR-001',
      sraOperationId: 'SRA-02',
      operationName: 'Land Preparation',
      activity: 'Land Preparation',
      category: 'prep',
      cost: 18000,
      totalCost: 18000,
      costPerHa: 12000,
      hectares: '1.5',
      people: '2',
      date: '2026-05-18',
      approved: true,
      status: 'Approved',
      isOffline: false,
      loggedBy: 'Farmer (Juan dela Cruz)',
      subItems: [
        { id: 'SI-1', description: '1st Pass Disc Plowing (Tractor)', qty: 1.5, unit: 'ha', unitCost: 5000, subTotal: 7500 },
        { id: 'SI-2', description: '2nd Pass Disc Harrowing', qty: 1.5, unit: 'ha', unitCost: 4000, subTotal: 6000 },
        { id: 'SI-3', description: 'Furrowing / Tudling', qty: 1.5, unit: 'ha', unitCost: 3000, subTotal: 4500 }
      ]
    },
    {
      id: 'LOG-KTR-002',
      fieldId: 'FLD-KTR-002',
      sraOperationId: 'SRA-03',
      operationName: 'Cost of Planting Material (Seedcane acquisition)',
      activity: 'Cost of Planting Material (Seedcane acquisition)',
      category: 'plant',
      cost: 37500,
      totalCost: 37500,
      costPerHa: 15000,
      hectares: '2.5',
      people: '4',
      date: '2026-05-19',
      approved: true,
      status: 'Approved',
      isOffline: false,
      loggedBy: 'Farmer (Jose Rizal)',
      subItems: [
        { id: 'SI-4', description: 'Cane Points (Patdan - High Yielding Variety)', qty: 12.5, unit: 'lac', unitCost: 3000, subTotal: 37500 }
      ]
    },
    {
      id: 'LOG-KTR-003',
      fieldId: 'FLD-KTR-004',
      sraOperationId: 'SRA-05',
      operationName: 'Basal Fertilization',
      activity: 'Basal Fertilization',
      category: 'fert',
      cost: 52850,
      totalCost: 52850,
      costPerHa: 15100,
      hectares: '3.5',
      people: '4',
      date: '2026-05-20',
      approved: true,
      status: 'Approved',
      isOffline: false,
      loggedBy: 'Farmer (Pedro Reyes)',
      subItems: [
        { id: 'SI-5', description: 'Application of 46-0-0 (Urea)', qty: 7, unit: 'bag', unitCost: 1600, subTotal: 11200 },
        { id: 'SI-6', description: 'Application of 18-46-00 (DAP / Complete)', qty: 10.5, unit: 'bag', unitCost: 2500, subTotal: 26250 },
        { id: 'SI-7', description: 'Application of 00-00-60 (MOP / Muriate of Potash)', qty: 7, unit: 'bag', unitCost: 2200, subTotal: 15400 }
      ]
    }
  ];

  initialLogs.forEach(l => {
    const ref = doc(db, 'operation_logs', l.id);
    batch.set(ref, { ...l, createdAt: new Date().toISOString() }, { merge: true });
  });

  // Commit all writes
  await batch.commit();
  console.log('[HUGPONG Seeder] Success! All collections seeded to Firestore (hugpong-ff).');
  return { status: 'success', seededCount: initialFields.length + initialUsers.length + initialPrices.length + initialLogs.length };
}

// Auto-seed on load if requested or in browser context
if (typeof window !== 'undefined') {
  window.seedFirestoreDatabase = seedFirestoreDatabase;
}
