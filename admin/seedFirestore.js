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

import { webFirebaseConfig } from './firebaseConfig.js';

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

  // 1. SEED FIELDS (8 Standard Regional Plots)
  const initialFields = [
    { id: 'FLD-KTR-001', member: 'Juan dela Cruz', owner: 'Juan dela Cruz', ha: 1.5, area: 1.5, stage: 'Fertilization (Patubas)', age: '2.5 months', synced: true, lastSync: '10m ago', lag: 'Synced', blockFarm: 'Block Farm A', customStages: [] },
    { id: 'FLD-KTR-002', member: 'Jose Rizal', owner: 'Jose Rizal', ha: 2.1, area: 2.1, stage: 'Planting (Patdan)', age: '1.0 month', synced: true, lastSync: '1h ago', lag: 'Synced', blockFarm: 'Block Farm A', customStages: [] },
    { id: 'FLD-KTR-003', member: 'Maria Santos', owner: 'Maria Santos', ha: 1.8, area: 1.8, stage: 'Weeding (Hilamon)', age: '3.2 months', synced: true, lastSync: '2h ago', lag: 'Synced', blockFarm: 'Block Farm B', customStages: [] },
    { id: 'FLD-KTR-004', member: 'Emilio Aguinaldo', owner: 'Emilio Aguinaldo', ha: 3.0, area: 3.0, stage: 'Land Prep (Hilamon)', age: '0.5 months', synced: true, lastSync: '30m ago', lag: 'Synced', blockFarm: 'Block Farm B', customStages: [] },
    { id: 'FLD-KTR-005', member: 'Pedro Reyes', owner: 'Pedro Reyes', ha: 2.4, area: 2.4, stage: 'Harvesting (Tapas)', age: '11.8 months', synced: true, lastSync: '5m ago', lag: 'Synced', blockFarm: 'Block Farm C', customStages: [] },
    { id: 'FLD-KTR-006', member: 'Andres Bonifacio', owner: 'Andres Bonifacio', ha: 1.2, area: 1.2, stage: 'Ratoon Maintenance', age: '4.0 months', synced: true, lastSync: '4h ago', lag: 'Synced', blockFarm: 'Block Farm C', customStages: [] },
    { id: 'FLD-KTR-007', member: 'Ana Gomez', owner: 'Ana Gomez', ha: 2.0, area: 2.0, stage: 'Fertilization (Patubas)', age: '6.0 months', synced: false, lastSync: '8 days ago', lag: 'Offline Warning', blockFarm: 'Block Farm D', customStages: [] },
    { id: 'FLD-KTR-008', member: 'Apolinario Mabini', owner: 'Apolinario Mabini', ha: 1.6, area: 1.6, stage: 'Tillering (Pangabak)', age: '4.5 months', synced: true, lastSync: '15m ago', lag: 'Synced', blockFarm: 'Block Farm D', customStages: [] }
  ];

  initialFields.forEach(f => {
    const ref = doc(db, 'fields', f.id);
    batch.set(ref, { ...f, updatedAt: new Date().toISOString() }, { merge: true });
  });

  // 2. SEED USERS DIRECTORY
  const initialUsers = [
    { contact: '09171234567', name: 'SRA Administrator Juan dela Cruz', role: 'SRA (Admin)', blockFarm: 'SRA District VII', fieldId: '', logsHandled: 42, regDate: '2026-01-15' },
    { contact: '09189876543', name: 'Farm Manager Jose Reyes', role: 'Farm Manager', blockFarm: 'Block Farm A', fieldId: '', logsHandled: 128, regDate: '2026-02-01' },
    { contact: '09187654321', name: 'Super Admin Terminal (Capstone)', role: 'Super Admin', blockFarm: 'All Block Farms (Central)', fieldId: '', logsHandled: 256, regDate: '2026-01-01' },
    { contact: '09175550101', name: 'Juan dela Cruz (Member)', role: 'Member', blockFarm: 'Block Farm A', fieldId: 'FLD-KTR-001', logsHandled: 14, regDate: '2026-02-10' },
    { contact: '09175550102', name: 'Jose Rizal', role: 'Member', blockFarm: 'Block Farm A', fieldId: 'FLD-KTR-002', logsHandled: 8, regDate: '2026-02-12' },
    { contact: '09175550103', name: 'Maria Santos', role: 'Member', blockFarm: 'Block Farm B', fieldId: 'FLD-KTR-003', logsHandled: 19, regDate: '2026-02-14' },
    { contact: '09175550104', name: 'Emilio Aguinaldo', role: 'Member', blockFarm: 'Block Farm B', fieldId: 'FLD-KTR-004', logsHandled: 6, regDate: '2026-02-18' },
    { contact: '09175550105', name: 'Pedro Reyes', role: 'Member', blockFarm: 'Block Farm C', fieldId: 'FLD-KTR-005', logsHandled: 23, regDate: '2026-02-20' },
    { contact: '09175550106', name: 'Andres Bonifacio', role: 'Member', blockFarm: 'Block Farm C', fieldId: 'FLD-KTR-006', logsHandled: 11, regDate: '2026-02-22' },
    { contact: '09175550107', name: 'Ana Gomez', role: 'Member', blockFarm: 'Block Farm D', fieldId: 'FLD-KTR-007', logsHandled: 3, regDate: '2026-03-01' },
    { contact: '09175550108', name: 'Apolinario Mabini', role: 'Member', blockFarm: 'Block Farm D', fieldId: 'FLD-KTR-008', logsHandled: 15, regDate: '2026-03-05' }
  ];

  initialUsers.forEach(u => {
    const cleanId = u.contact.replace(/\D/g, '');
    const ref = doc(db, 'users', cleanId);
    batch.set(ref, { ...u, updatedAt: new Date().toISOString() }, { merge: true });
  });

  // 3. SEED SRA WEEKLY SUGAR PRICES
  const initialPrices = [
    { id: 'PRC-2026-W04-MAY', week: 'Week 4 May', price: 2800, date: '2026-05-21', change: 0, source: 'SRA Circular #104' },
    { id: 'PRC-2026-W03-MAY', week: 'Week 3 May', price: 2800, date: '2026-05-14', change: 50, source: 'SRA Circular #102' },
    { id: 'PRC-2026-W02-MAY', week: 'Week 2 May', price: 2750, date: '2026-05-07', change: 30, source: 'SRA Circular #101' },
    { id: 'PRC-2026-W01-MAY', week: 'Week 1 May', price: 2720, date: '2026-04-30', change: 20, source: 'SRA Circular #100' },
    { id: 'PRC-2026-W04-APR', week: 'Week 4 Apr', price: 2700, date: '2026-04-23', change: 50, source: 'SRA Circular #99' },
    { id: 'PRC-2026-W03-APR', week: 'Week 3 Apr', price: 2650, date: '2026-04-16', change: -20, source: 'SRA Circular #98' },
    { id: 'PRC-2026-W02-APR', week: 'Week 2 Apr', price: 2670, date: '2026-04-09', change: 70, source: 'SRA Circular #97' },
    { id: 'PRC-2026-W01-APR', week: 'Week 1 Apr', price: 2600, date: '2026-04-02', change: 50, source: 'SRA Circular #96' }
  ];

  initialPrices.forEach(p => {
    const ref = doc(db, 'sra_prices', p.id);
    batch.set(ref, { ...p, createdAt: new Date().toISOString() }, { merge: true });
  });

  // 4. SEED OPERATION LOGS
  const initialLogs = [
    { id: 'LOG-KTR-001', fieldId: 'FLD-KTR-001', activity: 'Land Preparation & Tractor Furrowing', cost: 18000, hectares: '1.5', people: '3', date: '2026-05-18', approved: true, isOffline: false, createdBy: 'Juan dela Cruz', scheduleType: 'Routine' },
    { id: 'LOG-KTR-002', fieldId: 'FLD-KTR-002', activity: 'High-Yield Point-Cane Planting', cost: 12500, hectares: '2.1', people: '8', date: '2026-05-19', approved: true, isOffline: false, createdBy: 'Jose Rizal', scheduleType: 'Routine' },
    { id: 'LOG-KTR-003', fieldId: 'FLD-KTR-003', activity: 'Organic Fertilizer Application (Stage 2)', cost: 15400, hectares: '1.8', people: '5', date: '2026-05-20', approved: true, isOffline: false, createdBy: 'Maria Santos', scheduleType: 'Fertilizer' },
    { id: 'LOG-KTR-004', fieldId: 'FLD-KTR-004', activity: 'Selective Chemical Weeding & Spraying', cost: 8900, hectares: '3.0', people: '4', date: '2026-05-21', approved: true, isOffline: false, createdBy: 'Emilio Aguinaldo', scheduleType: 'Weeding' },
    { id: 'LOG-KTR-005', fieldId: 'FLD-KTR-005', activity: 'Sugar Mill Delivery & Cane Cutting', cost: 32000, hectares: '2.4', people: '12', date: '2026-05-22', approved: true, isOffline: false, createdBy: 'Pedro Reyes', scheduleType: 'Harvest' }
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
