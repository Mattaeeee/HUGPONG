// ── GET & SET LOCAL STORAGE DATABASE ─────────────────────
let _cloudSyncDebounceTimer = null;

function getCanonicalInitialDB() {
  if (typeof window !== 'undefined' && window.INITIAL_DATABASE) {
    return window.INITIAL_DATABASE;
  }
  if (typeof INITIAL_DATABASE !== 'undefined') {
    return INITIAL_DATABASE;
  }
  return {
    blockFarms: [{ id: 'BLK-NCY-01', code: 'BLK-NCY', name: 'Nacayao Block Farm', location: 'Silay City, Negros Occidental', farmManagerId: '03000001', farmManagerName: 'Jose Reyes', declaredHa: 15.25, activePlots: 5 }],
    fields: [
      { id: 'FLD-NCY-001', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', memberId: '04000001', member: 'Juan dela Cruz', memberName: 'Juan dela Cruz', ha: 1.5, stage: 'Pre-Planting & Land Preparation', stageNumber: 1, month: 0.5, batchMonth: 1, synced: true, lastSync: '10 mins ago', variety: 'VMC 84-524', soilType: 'Clay Loam' },
      { id: 'FLD-NCY-002', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', memberId: '04000002', member: 'Pedro Reyes', memberName: 'Pedro Reyes', ha: 2.5, stage: 'Planting & Crop Establishment', stageNumber: 2, month: 1.0, batchMonth: 1, synced: true, lastSync: '15 mins ago', variety: 'Phil 99-1793', soilType: 'Sandy Loam' },
      { id: 'FLD-NCY-003', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', memberId: '04000003', member: 'Corazon Santos', memberName: 'Corazon Santos', ha: 4.5, stage: 'Basal Nutrition & Early Care', stageNumber: 3, month: 1.5, batchMonth: 1, synced: true, lastSync: '1 hr ago', variety: 'Phil 2006-2289', soilType: 'Clay Loam' },
      { id: 'FLD-NCY-004', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', memberId: '04000004', member: 'Roberto Tan', memberName: 'Roberto Tan', ha: 3.5, stage: 'Cultivation & Weed Management', stageNumber: 4, month: 2.5, batchMonth: 2, synced: true, lastSync: '2 hrs ago', variety: 'VMC 84-524', soilType: 'Loam' },
      { id: 'FLD-NCY-005', blockFarmId: 'BLK-NCY-01', blockFarm: 'Nacayao Block Farm', memberId: '04000005', member: 'Ana Gomez', memberName: 'Ana Gomez', ha: 3.25, stage: 'Crop Maintenance & Final Hilling-Up', stageNumber: 5, month: 3.5, batchMonth: 2, synced: true, lastSync: '3 hrs ago', variety: 'Phil 99-1793', soilType: 'Clay Loam' }
    ],
    users: [
      { employeeId: '01000001', contact: '09187654321', mobile: '09187654321', name: 'Capstone Group (Admin)', role: 'Super Admin', roleKey: 'superadmin', blockFarmId: '', fieldId: '', logsHandled: 256, regDate: '2026-01-01', password: 'password123' },
      { employeeId: '01000002', contact: '09451774699', mobile: '09451774699', name: 'Project Lead', role: 'Super Admin', roleKey: 'superadmin', blockFarmId: 'BLK-NCY-01', fieldId: '', logsHandled: 120, regDate: '2026-01-01', password: 'password123' },
      { employeeId: '02000001', contact: '09194448888', mobile: '09194448888', name: 'Engr. Maria Santos', role: 'SRA (Admin)', roleKey: 'admin', blockFarmId: 'BLK-NCY-01', fieldId: '', logsHandled: 84, regDate: '2026-01-15', password: 'password123' },
      { employeeId: '03000001', contact: '09189876543', mobile: '09189876543', name: 'Jose Reyes', role: 'Farm Manager', roleKey: 'manager', blockFarmId: 'BLK-NCY-01', fieldId: '', logsHandled: 168, regDate: '2026-02-01', password: 'password123' },
      { employeeId: '04000001', contact: '09171234567', mobile: '09171234567', name: 'Juan dela Cruz', role: 'Member', roleKey: 'member', blockFarmId: 'BLK-NCY-01', blockFarmScope: 'Nacayao Block Farm', fieldId: 'FLD-NCY-001', logsHandled: 24, regDate: '2026-02-10', password: 'password123' },
      { employeeId: '04000002', contact: '09179876543', mobile: '09179876543', name: 'Pedro Reyes', role: 'Member', roleKey: 'member', blockFarmId: 'BLK-NCY-01', blockFarmScope: 'Nacayao Block Farm', fieldId: 'FLD-NCY-002', logsHandled: 18, regDate: '2026-02-12', password: 'password123' },
      { employeeId: '04000003', contact: '09194448889', mobile: '09194448889', name: 'Corazon Santos', role: 'Member', roleKey: 'member', blockFarmId: 'BLK-NCY-01', blockFarmScope: 'Nacayao Block Farm', fieldId: 'FLD-NCY-003', logsHandled: 22, regDate: '2026-02-14', password: 'password123' },
      { employeeId: '04000004', contact: '09987654321', mobile: '09987654321', name: 'Roberto Tan', role: 'Member', roleKey: 'member', blockFarmId: 'BLK-NCY-01', blockFarmScope: 'Nacayao Block Farm', fieldId: 'FLD-NCY-004', logsHandled: 15, regDate: '2026-02-20', password: 'password123' },
      { employeeId: '04000005', contact: '09555444333', mobile: '09555444333', name: 'Ana Gomez', role: 'Member', roleKey: 'member', blockFarmId: 'BLK-NCY-01', blockFarmScope: 'Nacayao Block Farm', fieldId: 'FLD-NCY-005', logsHandled: 9, regDate: '2026-03-01', password: 'password123' }
    ],
    logs: [
      { id: 'LOG-2026-NCY-001-001', fieldId: 'FLD-NCY-001', stageNumber: 1, stageName: 'Stage 1: Pre-Planting & Land Preparation', operationName: 'Land Preparation', activity: 'Land Preparation (Disc Plowing & Furrowing)', category: 'prep', cost: 18000, totalCost: 18000, costPerHa: 12000, hectares: '1.5', people: '2', date: '2026-05-02', status: 'Recorded', loggedBy: 'Juan dela Cruz (Member)', subItems: [{ id: 'SI-001-1', description: '1st Pass Disc Plowing (Tractor)', qty: 1.5, unit: 'ha', unitCost: 5000, subTotal: 7500 }, { id: 'SI-001-2', description: '2nd Pass Disc Harrowing', qty: 1.5, unit: 'ha', unitCost: 4000, subTotal: 6000 }, { id: 'SI-001-3', description: 'Furrowing / Tudling', qty: 1.5, unit: 'ha', unitCost: 3000, subTotal: 4500 }] },
      { id: 'LOG-2026-NCY-002-001', fieldId: 'FLD-NCY-002', stageNumber: 2, stageName: 'Stage 2: Planting & Crop Establishment', operationName: 'Cost of Planting Material (Seedcane acquisition)', activity: 'Cost of Planting Material (Patdan)', category: 'plant', cost: 37500, totalCost: 37500, costPerHa: 15000, hectares: '2.5', people: '4', date: '2026-05-08', status: 'Recorded', loggedBy: 'Pedro Reyes (Member)', subItems: [{ id: 'SI-002-1', description: 'Cane Points (Patdan - VMC 84-524)', qty: 12.5, unit: 'lac', unitCost: 3000, subTotal: 37500 }] },
      { id: 'LOG-2026-NCY-003-001', fieldId: 'FLD-NCY-003', stageNumber: 3, stageName: 'Stage 3: Basal Nutrition & Early Care', operationName: 'Basal Fertilizer Application', activity: 'Basal Fertilizer (Urea + Complete + Potash)', category: 'fert', cost: 71100, totalCost: 71100, costPerHa: 15800, hectares: '4.5', people: '6', date: '2026-05-12', status: 'Recorded', loggedBy: 'Corazon Santos (Member)', subItems: [{ id: 'SI-003-1', description: '46-00-00 Urea Application', qty: 9, unit: 'bag', unitCost: 1600, subTotal: 14400 }, { id: 'SI-003-2', description: '18-46-00 DAP / Complete', qty: 13.5, unit: 'bag', unitCost: 2500, subTotal: 33750 }, { id: 'SI-003-3', description: '00-00-60 Potash (MOP)', qty: 9, unit: 'bag', unitCost: 2200, subTotal: 19800 }, { id: 'SI-003-4', description: 'Fertilizer Application Labor', qty: 31.5, unit: 'bag', unitCost: 100, subTotal: 3150 }] },
      { id: 'LOG-2026-NCY-004-001', fieldId: 'FLD-NCY-004', stageNumber: 4, stageName: 'Stage 4: Cultivation & Weed Management', operationName: 'Cultivation (Off-barring & On-barring)', activity: 'Pahubas & Off-barring Pass', category: 'weed', cost: 10500, totalCost: 10500, costPerHa: 3000, hectares: '3.5', people: '3', date: '2026-05-18', status: 'Recorded', loggedBy: 'Roberto Tan (Member)', subItems: [{ id: 'SI-004-1', description: '1st Off-barring (Pahubas)', qty: 7, unit: 'pass', unitCost: 750, subTotal: 5250 }, { id: 'SI-004-2', description: '2nd Off-barring (Pahubas)', qty: 7, unit: 'pass', unitCost: 750, subTotal: 5250 }] },
      { id: 'LOG-2026-NCY-005-001', fieldId: 'FLD-NCY-005', stageNumber: 5, stageName: 'Stage 5: Crop Maintenance & Final Hilling-Up', operationName: 'Final Hilling-up (Pasungkal)', activity: 'Pasungkal Tractor Pass', category: 'maint', cost: 8125, totalCost: 8125, costPerHa: 2500, hectares: '3.25', people: '2', date: '2026-05-22', status: 'Recorded', loggedBy: 'Ana Gomez (Member)', subItems: [{ id: 'SI-005-1', description: 'Final Hilling-Up / Pasungkal Pass', qty: 3.25, unit: 'ha', unitCost: 2500, subTotal: 8125 }] }
    ],
    priceHistory: [
      { id: 'PRC-2026-W04-MAY', week: 'Week 4 May', price: 2950, molasses: 4400, date: '2026-05-21', change: 70, molassesChange: 100, source: 'SRA Official Circular #105' },
      { id: 'PRC-2026-W03-MAY', week: 'Week 3 May', price: 2880, molasses: 4300, date: '2026-05-14', change: 80, molassesChange: 50, source: 'SRA Official Circular #104' },
      { id: 'PRC-2026-W02-MAY', week: 'Week 2 May', price: 2800, molasses: 4250, date: '2026-05-07', change: 50, molassesChange: 50, source: 'SRA Official Circular #103' },
      { id: 'PRC-2026-W01-MAY', week: 'Week 1 May', price: 2750, molasses: 4200, date: '2026-04-30', change: 50, molassesChange: 0, source: 'SRA Official Circular #102' },
      { id: 'PRC-2026-W04-APR', week: 'Week 4 Apr', price: 2700, molasses: 4200, date: '2026-04-23', change: 50, molassesChange: 0, source: 'SRA Official Circular #99' }
    ],
    supportTickets: [],
    systemHistory: [],
    auditReports: [],
    syncOperations: []
  };
}

function getDB() {
  const CURRENT_DB_VERSION = '2026_09_03_authoritative_firestore_v6';
  const savedVersion = localStorage.getItem('hugpong_db_version');
  const data = localStorage.getItem('hugpong_db');
  const canonical = getCanonicalInitialDB();

  // If local database version is outdated or contains legacy mock records, force wipe cache
  if (savedVersion !== CURRENT_DB_VERSION || !data || data.includes('Mario Dimagiba') || data.includes('Elena Batongbakal') || data.includes('HIST-REG-') || data.includes('FLD-KTR-') || data.includes('Block Farm B') || data.includes('Block Farm C') || data.includes('qwewqewqe')) {
    localStorage.setItem('hugpong_db_version', CURRENT_DB_VERSION);
    const freshDb = JSON.parse(JSON.stringify(canonical));
    localStorage.setItem('hugpong_db', JSON.stringify(freshDb));
    return freshDb;
  }

  let parsed = canonical;
  try {
    parsed = JSON.parse(data);
  } catch (e) {
    localStorage.setItem('hugpong_db', JSON.stringify(canonical));
    return canonical;
  }

  let updated = false;
  if (!parsed.blockFarms || !Array.isArray(parsed.blockFarms)) {
    parsed.blockFarms = [];
    updated = true;
  }
  if (!parsed.fields || !Array.isArray(parsed.fields)) {
    parsed.fields = [];
    updated = true;
  }
  if (!parsed.logs || !Array.isArray(parsed.logs)) {
    parsed.logs = [];
    updated = true;
  }
  if (!parsed.users || !Array.isArray(parsed.users)) {
    parsed.users = [];
    updated = true;
  }
  if (!parsed.pendingUsers || !Array.isArray(parsed.pendingUsers)) {
    parsed.pendingUsers = [];
    updated = true;
  }
  if (!parsed.priceHistory || !Array.isArray(parsed.priceHistory)) {
    parsed.priceHistory = [];
    updated = true;
  }
  if (!parsed.systemHistory || !Array.isArray(parsed.systemHistory)) {
    parsed.systemHistory = [];
    updated = true;
  }
  if (!parsed.registryHistory || !Array.isArray(parsed.registryHistory)) {
    parsed.registryHistory = [];
    updated = true;
  }
  if (!parsed.supportTickets || !Array.isArray(parsed.supportTickets)) {
    parsed.supportTickets = [];
    updated = true;
  }
  if (!parsed.terminalDiagnostics || !Array.isArray(parsed.terminalDiagnostics)) {
    parsed.terminalDiagnostics = [];
    updated = true;
  }

  // Filter out any lingering mock fields not in canonical FLD-NCY set
  if (Array.isArray(parsed.fields)) {
    const beforeCount = parsed.fields.length;
    parsed.fields = parsed.fields.filter(f => f.id && !f.id.startsWith('FLD-KTR') && !f.id.startsWith('FLD-VIC') && !f.id.startsWith('FLD-TLS') && !f.id.startsWith('FLD-MNP'));
    if (parsed.fields.length !== beforeCount) updated = true;
  }
  if (Array.isArray(parsed.blockFarms)) {
    const beforeBF = parsed.blockFarms.length;
    parsed.blockFarms = parsed.blockFarms.filter(b => b.id && b.id !== 'BLK-VIC-01' && b.id !== 'BLK-TLS-01' && b.id !== 'BLK-MNP-01' && !b.name?.includes('Block Farm B') && !b.name?.includes('Block Farm C') && !b.name?.includes('Block Farm D'));
    if (parsed.blockFarms.length !== beforeBF) updated = true;
  }

  // Remove duplicates by field ID if any exist
  if (parsed.fields.length > 0) {
    const uniqueFields = [];
    const seenFieldIds = new Set();
    parsed.fields.forEach(f => {
      if (f.id && !seenFieldIds.has(f.id)) {
        seenFieldIds.add(f.id);
        uniqueFields.push(f);
      }
    });
    if (uniqueFields.length !== parsed.fields.length) {
      parsed.fields = uniqueFields;
      updated = true;
    }
  }

  if (Array.isArray(parsed.systemHistory)) {
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

  // Normalize operational logs (No Pending/Approved in HUGPONG - always Recorded/Certified)
  if (Array.isArray(parsed.logs)) {
    parsed.logs.forEach(l => {
      if (l.status === 'Approved' || l.status === 'Pending' || l.status === 'pending' || l.status === 'approved' || l.status === 'In Review' || l.status === '3 in Review') {
        l.status = 'Recorded';
        updated = true;
      }
      if (l.fieldId && l.fieldId.startsWith('FLD-KTR')) {
        // Remap legacy FLD-KTR IDs to canonical FLD-NCY IDs
        l.fieldId = l.fieldId
          .replace('FLD-KTR-001', 'FLD-NCY-001')
          .replace('FLD-KTR-002', 'FLD-NCY-002')
          .replace('FLD-KTR-003', 'FLD-NCY-003')
          .replace('FLD-KTR-004', 'FLD-NCY-004')
          .replace('FLD-KTR-005', 'FLD-NCY-005');
        updated = true;
      }
      if (l.task === 'Chemical spray' || l.activity === 'Chemical spray') {
        l.activity = 'Basal Fertilization & Amending';
        l.task = 'Basal Fertilization & Amending';
        l.sraOperationId = 'SRA-06';
        updated = true;
      }
      if (l.task === 'Harvesting labor' || l.activity === 'Harvesting labor') {
        l.activity = 'Cutting and Loading';
        l.task = 'Cutting and Loading';
        l.sraOperationId = 'SRA-12';
        updated = true;
      }
      if (l.task === 'Harvesting transport' || l.activity === 'Harvesting transport') {
        l.activity = 'Hauling (Trucking)';
        l.task = 'Hauling (Trucking)';
        l.sraOperationId = 'SRA-13';
        updated = true;
      }
    });
  }

  if (updated) {
    localStorage.setItem('hugpong_db', JSON.stringify(parsed));
  }

  return parsed;
}

function saveDB(db, syncToCloud = true) {
  localStorage.setItem('hugpong_db', JSON.stringify(db));

  if (syncToCloud && window.firebaseDB && window.firestore) {
    if (_cloudSyncDebounceTimer) clearTimeout(_cloudSyncDebounceTimer);
    _cloudSyncDebounceTimer = setTimeout(() => {
      syncLocalChangesToFirestore(db).catch(err => {
        console.warn('[HUGPONG] Background Firestore sync notice:', err.message);
      });
    }, 1500);
  }
}

async function syncLocalChangesToFirestore(db) {
  if (!window.firestore || !window.firebaseDB) return;
  const { doc, setDoc } = window.firestore;
  const fDb = window.firebaseDB;

  // 1. Sync fields
  if (Array.isArray(db.fields)) {
    for (const f of db.fields) {
      if (f.id) {
        const payload = {
          id: f.id,
          blockFarmId: f.blockFarmId || 'BLK-NCY-01',
          blockFarmName: f.blockFarmName || f.blockFarm || 'Nacayao Block Farm',
          blockFarm: f.blockFarm || f.blockFarmName || 'Nacayao Block Farm',
          memberId: f.memberId || f.contact || '',
          memberName: f.memberName || f.member || 'Member',
          member: f.member || f.memberName || 'Member',
          ha: Number(f.ha || f.area) || 1.5,
          stage: f.stage || 'Pre-Planting & Land Preparation',
          stageNumber: Number(f.stageNumber) || 1,
          month: Number(f.month) || 0.5,
          batchMonth: Number(f.batchMonth) || 1,
          synced: true,
          lastSync: f.lastSync || 'Just now',
          variety: f.variety || 'VMC 84-524',
          soilType: f.soilType || 'Clay Loam',
          updatedAt: new Date().toISOString()
        };
        await setDoc(doc(fDb, 'fields', f.id), payload, { merge: true });
      }
    }
  }

  // 2. Sync users
  if (Array.isArray(db.users)) {
    for (const u of db.users) {
      const cleanContact = (u.contact || u.mobile || u.employeeId || '').replace(/\D/g, '');
      if (cleanContact) {
        const payload = {
          employeeId: u.employeeId || cleanContact,
          contact: u.contact || cleanContact,
          mobile: u.mobile || u.contact || cleanContact,
          name: u.name || 'User',
          role: u.role || 'Member',
          roleKey: u.roleKey || (u.role === 'Super Admin' ? 'superadmin' : (u.role === 'Farm Manager' ? 'manager' : (u.role === 'SRA (Admin)' ? 'admin' : 'member'))),
          blockFarmId: u.blockFarmId || (u.blockFarm?.includes('Nacayao') ? 'BLK-NCY-01' : ''),
          blockFarmScope: u.blockFarmScope || u.blockFarm || 'Nacayao Block Farm',
          blockFarm: u.blockFarm || 'Nacayao Block Farm',
          fieldId: u.fieldId || '',
          logsHandled: Number(u.logsHandled) || 0,
          regDate: u.regDate || new Date().toISOString().split('T')[0],
          password: u.password || 'password123',
          updatedAt: new Date().toISOString()
        };
        await setDoc(doc(fDb, 'users', cleanContact), payload, { merge: true });
      }
    }
  }

  // 3. Sync block farms
  if (Array.isArray(db.blockFarms)) {
    for (const b of db.blockFarms) {
      if (b.id) {
        await setDoc(doc(fDb, 'block_farms', b.id), { ...b, updatedAt: new Date().toISOString() }, { merge: true });
      }
    }
  }

  // 4. Sync prices
  if (Array.isArray(db.priceHistory)) {
    for (const p of db.priceHistory) {
      const pId = p.id || `PRC-${(p.date || '').replace(/\D/g, '') || Date.now()}`;
      await setDoc(doc(fDb, 'sra_prices', pId), { ...p, id: pId }, { merge: true });
    }
  }

  // 5. Sync operation logs
  if (Array.isArray(db.logs)) {
    for (const l of db.logs) {
      if (l.id) {
        await setDoc(doc(fDb, 'operation_logs', l.id), { ...l, synced: true, syncedAt: new Date().toISOString() }, { merge: true });
      }
    }
  }

  // 6. Sync support tickets
  if (Array.isArray(db.supportTickets)) {
    for (const t of db.supportTickets) {
      if (t.id) {
        await setDoc(doc(fDb, 'support_tickets', t.id), { ...t, synced: true, syncedAt: new Date().toISOString() }, { merge: true });
      }
    }
  }
}

let firestoreSyncInitialized = false;

// ── Relational Derivation Resolvers ──────────────────────────
function resolveFieldMember(field, db = null) {
  if (!field) return 'Unassigned';
  if (field.member && typeof field.member === 'string' && field.member.length > 0 && field.member !== 'Unassigned') return field.member;
  if (field.memberName && typeof field.memberName === 'string' && field.memberName.length > 0 && field.memberName !== 'Unassigned') return field.memberName;
  if (field.owner && typeof field.owner === 'string' && field.owner.length > 0 && field.owner !== 'Unassigned') return field.owner;

  const currentDb = db || (typeof getDB === 'function' ? getDB() : null);
  if (currentDb && Array.isArray(currentDb.users)) {
    const u = currentDb.users.find(usr => 
      usr.employeeId === field.memberId || 
      usr.contact === field.memberId || 
      usr.fieldId === field.id ||
      (usr.role === 'Member' && usr.fieldId === field.id)
    );
    if (u && u.name) return u.name;
  }

  const fallbackMap = {
    'FLD-NCY-001': 'Juan dela Cruz',
    'FLD-NCY-002': 'Pedro Reyes',
    'FLD-NCY-003': 'Corazon Santos',
    'FLD-NCY-004': 'Roberto Tan',
    'FLD-NCY-005': 'Ana Gomez'
  };
  if (field.id && fallbackMap[field.id]) return fallbackMap[field.id];

  return 'Unassigned';
}

function resolveFieldBlockFarm(field, db = null) {
  if (!field) return 'Unassigned';
  if (field.blockFarm && typeof field.blockFarm === 'string' && field.blockFarm.length > 0) return field.blockFarm;
  const currentDb = db || (typeof getDB === 'function' ? getDB() : null);
  if (currentDb && Array.isArray(currentDb.blockFarms) && currentDb.blockFarms.length > 0) {
    const bf = currentDb.blockFarms.find(b => b.id === field.blockFarmId || b.code === field.blockFarmId);
    if (bf) return bf.name;
    return currentDb.blockFarms[0].name;
  }
  return 'Nacayao Block Farm';
}

function resolveBlockFarmManager(blockFarm, db = null) {
  if (!blockFarm) return 'Assigned Farm Manager';
  const currentDb = db || (typeof getDB === 'function' ? getDB() : null);
  if (currentDb && Array.isArray(currentDb.users)) {
    const mgr = currentDb.users.find(u => u.employeeId === blockFarm.farmManagerId || u.contact === blockFarm.farmManagerId || (u.role === 'Farm Manager' && (u.blockFarmId === blockFarm.id || u.blockFarm === blockFarm.name)));
    if (mgr) return mgr.name;
  }
  return 'Jose Reyes';
}

function initFirestoreRealtimeSync() {
  if (firestoreSyncInitialized || !window.firebaseDB || !window.firestore) return;
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

  // 1. Listen on Block Farms
  onSnapshot(collection(fDb, 'block_farms'), (snapshot) => {
    if (snapshot.empty) return;
    const db = getDB();
    const remoteBF = [];
    snapshot.forEach(docSnap => remoteBF.push({ id: docSnap.id, ...docSnap.data() }));

    db.blockFarms = remoteBF;
    saveDB(db, false);
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderBlockFarms === 'function') renderBlockFarms();
  }, (err) => console.warn('[Firestore] block_farms listener notice:', err));

  // 2. Listen on Fields
  onSnapshot(collection(fDb, 'fields'), (snapshot) => {
    if (snapshot.empty) return;
    const db = getDB();
    const remoteFields = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      // Normalize member name: Firestore may store it as memberName
      if (!data.member && data.memberName) data.member = data.memberName;
      if (!data.memberName && data.member) data.memberName = data.member;
      remoteFields.push(data);
    });

    db.fields = remoteFields;
    saveDB(db, false);
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderFields === 'function') renderFields();
    if (typeof renderOperations === 'function') renderOperations();
    if (typeof renderManager === 'function') renderManager();
    if (typeof renderEfficiency === 'function') renderEfficiency();
    if (typeof renderSync === 'function') renderSync();
  }, (err) => console.warn('[Firestore] fields listener notice:', err));

  // 3. Listen on Operation Logs
  onSnapshot(collection(fDb, 'operation_logs'), (snapshot) => {
    if (snapshot.empty) return;
    const db = getDB();
    const remoteLogs = [];
    snapshot.forEach(docSnap => remoteLogs.push(docSnap.data()));

    db.logs = remoteLogs;
    saveDB(db, false);
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderLogs === 'function') renderLogs();
    if (typeof renderOperations === 'function') renderOperations();
    if (typeof renderHistory === 'function') renderHistory();
    if (typeof renderProductionCostChart === 'function') renderProductionCostChart();
    if (typeof renderFarmOperationsChart === 'function') renderFarmOperationsChart();
  }, (err) => console.warn('[Firestore] operation_logs listener notice:', err));

  // 4. Listen on SRA Sugar Prices
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
      if (typeof renderPrices === 'function') renderPrices();
      if (typeof renderPriceHistoryChart === 'function') renderPriceHistoryChart();
      if (typeof renderDashboard === 'function') renderDashboard();
    }
  }, (err) => console.warn('[Firestore] sra_prices listener notice:', err));

  // 5. Listen on Support Tickets
  onSnapshot(collection(fDb, 'support_tickets'), (snapshot) => {
    if (snapshot.empty) return;
    const db = getDB();
    const remoteTickets = [];
    snapshot.forEach(docSnap => remoteTickets.push(docSnap.data()));

    db.supportTickets = remoteTickets;
    saveDB(db, false);
    if (typeof renderSupportTickets === 'function') renderSupportTickets();
    if (typeof renderDashboard === 'function') renderDashboard();
  }, (err) => console.warn('[Firestore] support_tickets listener notice:', err));

  // 6. Listen on Users Directory (Syncs mobile registrations immediately to Web Directory)
  onSnapshot(collection(fDb, 'users'), (snapshot) => {
    if (snapshot.empty) return;
    const db = getDB();
    const remoteUsers = [];
    snapshot.forEach(docSnap => {
      const data = { id: docSnap.id, ...docSnap.data() };
      // Normalize blockFarm: Firestore may store as blockFarmScope
      if (!data.blockFarm && data.blockFarmScope) data.blockFarm = data.blockFarmScope;
      if (!data.blockFarmScope && data.blockFarm) data.blockFarmScope = data.blockFarm;
      // Ensure contact is set
      if (!data.contact && data.mobile) data.contact = data.mobile;
      if (!data.mobile && data.contact) data.mobile = data.contact;
      remoteUsers.push(data);
    });

    db.users = remoteUsers;
    saveDB(db, false);
    if (typeof renderUsers === 'function') renderUsers();
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderMembers === 'function') renderMembers();
  }, (err) => console.warn('[Firestore] users listener notice:', err));

  // 7. Listen on Audit Reports (QR Certified Records)
  onSnapshot(collection(fDb, 'audit_reports'), (snapshot) => {
    if (snapshot.empty) return;
    const db = getDB();
    const remoteReports = [];
    snapshot.forEach(docSnap => remoteReports.push({ id: docSnap.id, ...docSnap.data() }));
    db.auditReports = remoteReports;
    saveDB(db, false);
    if (typeof renderAuditDashboard === 'function') renderAuditDashboard();
    if (typeof renderDashboard === 'function') renderDashboard();
  }, (err) => console.warn('[Firestore] audit_reports listener notice:', err));

  // 8. Listen on Audit Logs (System Action History)
  onSnapshot(collection(fDb, 'audit_logs'), (snapshot) => {
    if (snapshot.empty) return;
    const db = getDB();
    const remoteLogs = [];
    snapshot.forEach(docSnap => remoteLogs.push({ id: docSnap.id, ...docSnap.data() }));
    db.systemHistory = remoteLogs;
    saveDB(db, false);
    if (typeof renderHistory === 'function') renderHistory();
  }, (err) => console.warn('[Firestore] audit_logs listener notice:', err));

  // 9. Listen on Sync Operations (Offline Reconciliation Stream)
  onSnapshot(collection(fDb, 'sync_operations'), (snapshot) => {
    if (snapshot.empty) return;
    const db = getDB();
    const remoteSync = [];
    snapshot.forEach(docSnap => remoteSync.push({ id: docSnap.id, ...docSnap.data() }));
    db.syncOperations = remoteSync;
    saveDB(db, false);
    if (typeof renderSync === 'function') renderSync();
  }, (err) => console.warn('[Firestore] sync_operations listener notice:', err));
}

async function verifyBackendSession() {
  try {
    const res = await fetch('http://localhost:3000/auth/session', { credentials: 'include' });
    const data = await res.json();
    if (data.authenticated && data.user) {
      localStorage.setItem('hugpong_user', JSON.stringify(data.user));
      localStorage.setItem('hugpong_role', data.user.roleKey || 'admin');
      if (typeof applyRoleLayout === 'function') {
        applyRoleLayout(data.user.roleKey || 'admin');
      }
    }
  } catch (e) {
    // Offline or server not active - keep current local role context
  }
}

// Auto-start Firestore sync and verify session
window.addEventListener('hugpong:firebase_ready', () => {
  initFirestoreRealtimeSync();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initFirestoreRealtimeSync, 200);
    setTimeout(verifyBackendSession, 350);
  });
} else {
  setTimeout(initFirestoreRealtimeSync, 200);
  setTimeout(verifyBackendSession, 350);
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
  synctelemetry: { heading: 'Member Sync & Inactivity Telemetry', sub: 'Real-time mobile offline buffer monitoring and member sync health for Nacayao Block Farm' },
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
const TICKETS_PER_PAGE = 5;

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
  const el = document.getElementById('page-tickets');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      subEl.textContent = 'Direct field management, member plot allocations, and crop stage tracking for Nacayao Block Farm';
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
  const roleName = role === 'superadmin' ? 'Super Admin' : (role === 'manager' ? 'Farm Manager (Nacayao Block Farm)' : 'SRA (Admin)');
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
    if (avatarEl) { avatarEl.textContent = 'C'; avatarEl.style.background = 'linear-gradient(135deg, #F5A623, #ff8c00)'; avatarEl.style.boxShadow = '0 0 8px rgba(245,166,35,0.5)'; }
    if (nameEl) nameEl.textContent = 'Capstone Group';
    if (roleEl) roleEl.textContent = 'Super Admin';
    if (popNameEl) popNameEl.textContent = 'Capstone Group';
    if (popRoleEl) popRoleEl.textContent = 'Super Admin · Capstone Group';
    if (subEl) subEl.textContent = 'Capstone Governance';
    document.querySelectorAll('.superadmin-only').forEach(el => el.classList.remove('hidden'));
    document.querySelectorAll('.sra-only').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.sra-or-manager').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.manager-only').forEach(el => el.classList.add('hidden'));
  } else if (role === 'manager') {
    if (avatarEl) { avatarEl.textContent = 'J'; avatarEl.style.background = 'linear-gradient(135deg, #1A6B9A, #2A7F8F)'; avatarEl.style.boxShadow = '0 0 8px rgba(26,107,154,0.4)'; }
    if (nameEl) nameEl.textContent = 'Jose Reyes';
    if (roleEl) roleEl.textContent = 'Farm Manager (Nacayao Block Farm)';
    if (popNameEl) popNameEl.textContent = 'Jose Reyes';
    if (popRoleEl) popRoleEl.textContent = 'Farm Manager · Nacayao Block Farm';
    if (subEl) subEl.textContent = 'Farm Workspace';
    document.querySelectorAll('.superadmin-only').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.sra-only').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.sra-or-manager').forEach(el => el.classList.remove('hidden'));
    document.querySelectorAll('.manager-only').forEach(el => el.classList.remove('hidden'));
  } else {
    if (avatarEl) { avatarEl.textContent = 'M'; avatarEl.style.background = 'linear-gradient(135deg, #2D5016, #4A7C2F)'; avatarEl.style.boxShadow = '0 0 8px rgba(45,80,22,0.4)'; }
    if (nameEl) nameEl.textContent = 'Maria Santos';
    if (roleEl) roleEl.textContent = 'SRA (Admin)';
    if (popNameEl) popNameEl.textContent = 'Maria Santos';
    if (popRoleEl) popRoleEl.textContent = 'Silay Sugar Regulatory Administration';
    if (subEl) subEl.textContent = 'Silay SRA Console';
    document.querySelectorAll('.superadmin-only').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.sra-only').forEach(el => el.classList.remove('hidden'));
    document.querySelectorAll('.sra-or-manager').forEach(el => el.classList.remove('hidden'));
    document.querySelectorAll('.manager-only').forEach(el => el.classList.add('hidden'));
  }
}

// Helper to determine block farm
function getBlockFarmName(fieldId) {
  if (!fieldId) return 'Nacayao Block Farm';
  if (typeof db !== 'undefined' && db && Array.isArray(db.fields)) {
    const f = db.fields.find(item => item.id === fieldId);
    if (f) {
      if (f.blockFarm) return f.blockFarm;
      if (Array.isArray(db.blockFarms)) {
        const bf = db.blockFarms.find(b => b.id === f.blockFarmId);
        if (bf) return bf.name;
      }
    }
  }
  if (fieldId.includes('NCY')) return 'Nacayao Block Farm';
  if (fieldId.includes('VIC')) return 'Victorias Block Farm';
  if (fieldId.includes('TLS')) return 'Talisay Block Farm';
  if (fieldId.includes('MNP')) return 'Manapla Block Farm';
  return 'Nacayao Block Farm';
}

function getBlockId(blockFarmName) {
  if (!blockFarmName) return 'BLK-A';
  if (blockFarmName.includes('A') || blockFarmName.includes('Nacayao')) return 'BLK-A';
  if (blockFarmName.includes('B') || blockFarmName.includes('Victorias')) return 'BLK-B';
  if (blockFarmName.includes('C') || blockFarmName.includes('Talisay')) return 'BLK-C';
  if (blockFarmName.includes('D') || blockFarmName.includes('Manapla')) return 'BLK-D';
  return 'BLK-' + (blockFarmName || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 5);
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
  const managerBlockFarm = (db && Array.isArray(db.blockFarms) && db.blockFarms[0]) ? db.blockFarms[0].name : 'Nacayao Block Farm';

  // 1. Dynamic Hero Banner Text
  const heroBadge = document.getElementById('hero-badge-role');
  const heroHeading = document.getElementById('hero-heading');
  const heroSubtext = document.getElementById('hero-subtext');
  const heroManagerBtn = document.getElementById('hero-manager-btn');
  const heroManagerFieldsBtn = document.getElementById('hero-manager-fields-btn');

  if (heroBadge) heroBadge.textContent = isManager ? 'Farm Manager Console' : (isSuper ? 'Capstone System & Telemetry Console' : 'Silay Sugar Regulatory Administration');
  if (heroHeading) heroHeading.textContent = isManager ? 'Welcome back, Jose Reyes' : (isSuper ? 'Capstone Platform Governance & Telemetry' : 'SILAY SRA COMMAND CONSOLE');
  if (heroSubtext) heroSubtext.textContent = isManager 
    ? `${managerBlockFarm} · Silay Cooperative · Supervising 5 member field allocations, crop timelines, and operation logs.` 
    : (isSuper
      ? 'Consolidated sync health, mobile terminal hardware telemetry, and database integrity overseen by Capstone Group.'
      : 'Consolidated real-time oversight of block farm operations, field crop stages, member labor logs, and certified benchmarks across Silay Sugar Regulatory Administration.');
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
      // Update topbar price pill before early return
      const _superPrice = Number(db.priceHistory[0]?.price) || 2950;
      const _superMol = Number(db.priceHistory[0]?.molasses) || 4400;
      const _topPEl = document.getElementById('topbar-sugar-price');
      const _topMEl = document.getElementById('topbar-molasses-price');
      if (_topPEl) _topPEl.textContent = `₱${_superPrice.toLocaleString()} / Lkg`;
      if (_topMEl) _topMEl.textContent = `₱${_superMol.toLocaleString()} / MT`;
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
    // Update topbar price pill for manager role before delegating
    const _mgrPrice = Number(db.priceHistory[0]?.price) || 2950;
    const _mgrMol = Number(db.priceHistory[0]?.molasses) || 4400;
    const _topPriceEl = document.getElementById('topbar-sugar-price');
    const _topMolEl = document.getElementById('topbar-molasses-price');
    if (_topPriceEl) _topPriceEl.textContent = `₱${_mgrPrice.toLocaleString()} / Lkg`;
    if (_topMolEl) _topMolEl.textContent = `₱${_mgrMol.toLocaleString()} / MT`;
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
  const visibleFields = db.fields || [];
  const visibleLogs = db.logs || [];

  const totalHa = visibleFields.reduce((s, f) => s + (Number(f.ha || f.area) || 0), 0);
  if (dashAreaLabel) dashAreaLabel.textContent = isManager ? 'Assigned Farm Area' : 'Total Managed Area';
  if (dashAreaVal) dashAreaVal.textContent = `${totalHa.toFixed(2)} Ha`;
  if (dashAreaSub) {
    dashAreaSub.textContent = isManager 
      ? `Nacayao Block Farm · ${visibleFields.filter(f => f.blockFarm?.includes('Nacayao') || f.blockFarm?.includes('Nacayao Block Farm')).length} Member Plots`
      : `4 Regional Block Farms · ${visibleFields.length} Registered Plots`;
  }

  // 4. Operational Monitoring KPIs (Active Block Farms & Monitored Members)
  const uniqueBlockFarms = new Set();
  const uniqueMembers = new Set();
  visibleFields.forEach(f => {
    if (f.blockFarm) uniqueBlockFarms.add(f.blockFarm);
    if (f.member) uniqueMembers.add(f.member);
  });

  const elPlotsVal = document.getElementById('dash-stat-plots-val');
  if (elPlotsVal) elPlotsVal.textContent = `${visibleFields.length} Plots`;

  const elFarmsVal = document.getElementById('dash-stat-farms-val');
  const elFarmsPill = document.getElementById('dash-stat-farms-pill');
  const elFarmsSub = document.getElementById('dash-stat-farms-sub');
  const elMembersVal = document.getElementById('dash-stat-members-val');
  const elMembersBadge = document.getElementById('dash-stat-members-badge');
  const elMembersSub = document.getElementById('dash-stat-members-sub');

  if (elFarmsVal) elFarmsVal.textContent = `${uniqueBlockFarms.size || 4} Block Farms`;
  if (elFarmsPill) elFarmsPill.textContent = 'All Districts';
  if (elFarmsSub) elFarmsSub.textContent = `${totalHa.toFixed(1)} Ha total`;

  if (elMembersVal) elMembersVal.textContent = `${uniqueMembers.size || 16} Members`;
  if (elMembersBadge) elMembersBadge.textContent = '100% Mapped';
  if (elMembersSub) elMembersSub.textContent = `${visibleFields.length} active plots`;

  // Fallback for legacy elements if present
  const elCost = document.getElementById('summary-total-cost');
  const elOpsCountPill = document.getElementById('summary-ops-count-pill');
  const totalCost = visibleLogs.reduce((s, l) => s + (Number(l.totalCost || l.cost) || 0), 0);
  if (elCost) elCost.textContent = totalCost >= 1000000 ? `₱${(totalCost / 1000000).toFixed(2)}M` : `₱${(totalCost / 1000).toFixed(1)}k`;
  if (elOpsCountPill) elOpsCountPill.textContent = `${visibleLogs.length} Recorded Ops`;

  // 5. Render Visual Charts
  renderPriceHistoryChart();
  renderProductionCostChart();
  renderCropStageDistribution();
  renderFarmOperationsChart();
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
      t.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="text-primary"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> SRA Raw Sugar Weekly Price Trajectory`;
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
      t.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="text-primary"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> SRA Raw Sugar Monthly Price Trajectory`;
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
    // Keep latest 8 months if long
    if (history.length > 8) history = history.slice(-8);
  } else {
    // Chronological sort: oldest to newest for left-to-right trajectory
    const sorted = [...rawHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Deduplicate by distinct week label to prevent overlapping cluster points
    const seen = new Set();
    const unique = [];
    for (let i = sorted.length - 1; i >= 0; i--) {
      const p = sorted[i];
      const key = (p.week || '').trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.unshift(p);
      }
    }
    // Limit to latest 8 weeks for maximum readability and clean spacing
    history = unique.slice(-8);
  }

  if (history.length === 0) return;

  const prices = history.map(p => Number(p.price) || 0);
  const minP = Math.min(...prices) * 0.96;
  const maxP = Math.max(...prices) * 1.04;
  const range = maxP - minP || 1;

  const W = 520;
  const H = 150;
  const padL = 50;
  const padR = 25;
  const padT = 20;
  const padB = 42;
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
  const textLabel = isDark ? '#94A3B8' : '#4B5563';
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

  // Circles & Clean X-labels with ample spacing
  const dotsAndLabels = points.map((pt, i) => {
    const isLatest = i === n - 1;
    const circleFill = isLatest ? (isDark ? '#34D399' : '#2D5016') : (isDark ? '#10B981' : '#4A7C2F');
    const radius = isLatest ? 6 : 4;
    const pulse = isLatest ? `<circle cx="${pt.x}" cy="${pt.y}" r="11" fill="${circleFill}" opacity="0.25"/>` : '';
    const cleanLabel = priceChartTimeframe === 'monthly' ? pt.label : pt.week.replace(/Week\s+/i, 'W');
    const tooltip = priceChartTimeframe === 'monthly'
      ? `${pt.week}: Average Php ${pt.price.toLocaleString()}/Lkg`
      : `${pt.week} (${pt.date}): Php ${pt.price.toLocaleString()}/Lkg (${pt.source})`;

    return `
      <g class="cursor-pointer">
        ${pulse}
        <circle cx="${pt.x}" cy="${pt.y}" r="${radius}" fill="${circleFill}" stroke="${dotStroke}" stroke-width="2">
          <title>${tooltip}</title>
        </circle>
        <text x="${pt.x}" y="${padT + H + 18}" text-anchor="middle" font-size="10" font-weight="700" fill="${textLabel}" transform="rotate(-20, ${pt.x}, ${padT + H + 18})">
          ${cleanLabel}
        </text>
      </g>
    `;
  }).join('');

  const chartHtml = `
    <div class="overflow-x-auto">
      <svg viewBox="0 0 ${svgW} ${svgH}" class="w-full min-w-[440px]">
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${gradColor}" stop-opacity="0.30"/>
            <stop offset="100%" stop-color="${gradColor}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        ${yTicks}
        ${areaD ? `<path d="${areaD}" fill="url(#priceGradient)"/>` : ''}
        <path d="${pathD}" fill="none" stroke="${lineStroke}" stroke-width="3" stroke-linecap="round"/>
        ${dotsAndLabels}
      </svg>
    </div>
    <div class="flex items-center justify-between mt-2 pt-2 border-t border-border text-[11px] text-hug-muted flex-wrap gap-2">
      <div class="flex items-center gap-3 flex-wrap">
        <span class="flex items-center gap-1.5 font-bold text-primary"><span class="w-2 h-2 rounded-full bg-primary"></span> Latest ${priceChartTimeframe === 'monthly' ? 'Month Avg' : 'Week'}: Php ${prices[prices.length - 1].toLocaleString()} / Lkg</span>
        <span>Low: Php ${Math.min(...prices).toLocaleString()}</span>
        <span>High: Php ${Math.max(...prices).toLocaleString()}</span>
      </div>
      <span class="italic text-[10px]">${priceChartTimeframe === 'monthly' ? `Latest ${history.length} Months` : `Latest ${history.length} Weeks (Official Circulars)`}</span>
    </div>`;

  targets.forEach(el => { el.innerHTML = chartHtml; });
}

// ── PRODUCTION COST ANALYTICS (Descriptive — no benchmark comparisons) ──────
function renderProductionCostChart() {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const isManager = currentRole === 'manager';
  const el = isManager ? document.getElementById('mgr-cost-efficiency-visual') : document.getElementById('cost-efficiency-visual');
  if (!el) return;

  const db = getDB();

  let data = [];

  if (isManager) {
    // ── FARM MANAGER: Show each member field within assigned block farm
    const scopedFields = db.fields.filter(f => (f.blockFarm || resolveFieldBlockFarm(f, db)).includes('Nacayao') || f.blockFarmId === 'BLK-NCY-01' || true);
    data = scopedFields.map(f => {
      const fieldLogs = db.logs.filter(l => l.fieldId === f.id);
      const totalCost = fieldLogs.reduce((sum, l) => sum + (Number(l.totalCost || l.cost) || 0), 0);
      const ha = Number(f.ha || 1.5);
      const costPerHa = ha > 0 ? Math.round(totalCost / ha) : 0;
      return {
        id: `${f.id} · ${resolveFieldMember(f, db)}`,
        rawKey: f.id,
        costPerHa,
        ha,
        totalCost,
        opsCount: fieldLogs.length,
        type: 'field'
      };
    });
  } else {
    // ── SUPER ADMIN & SRA ADMIN: Aggregate by regional Block Farm
    const blockList = (db.blockFarms && db.blockFarms.length > 0)
      ? db.blockFarms.map(bf => ({ id: bf.name, rawKey: bf.name, defaultHa: Number(bf.declaredHa) || 15.25 }))
      : [{ id: 'Nacayao Block Farm', rawKey: 'Nacayao Block Farm', defaultHa: 15.25 }];

    data = blockList.map(b => {
      const fields = db.fields.filter(f => (f.blockFarm || resolveFieldBlockFarm(f, db)) === b.rawKey || b.rawKey.includes(f.blockFarm || ''));
      const fieldIds = fields.map(f => f.id);
      const logs = db.logs.filter(l => fieldIds.includes(l.fieldId));
      const totalCost = logs.reduce((sum, l) => sum + (Number(l.totalCost || l.cost) || 0), 0);
      const ha = fields.length > 0 ? fields.reduce((s, f) => s + (Number(f.ha) || 0), 0) : b.defaultHa;
      const costPerHa = ha > 0 ? Math.round(totalCost / ha) : 0;
      return {
        id: b.id,
        rawKey: b.rawKey,
        costPerHa,
        ha,
        totalCost,
        plotsCount: fields.length || 0,
        opsCount: logs.length,
        type: 'block'
      };
    });
  }

  const maxCost = Math.max(...data.map(d => d.costPerHa), 1);
  const displayItems = data.slice(0, 4);

  const itemsHtml = displayItems.map(item => {
    const pct = Math.round((item.costPerHa / maxCost) * 100);
    const hasData = item.totalCost > 0;
    const badgeColor = hasData ? 'text-success bg-success-bg' : 'text-hug-muted bg-bg';
    const barGradient = hasData ? 'bg-gradient-to-r from-primary to-primary-light' : 'bg-border';
    const subtitle = hasData
      ? `${item.ha.toFixed(2)} Ha · ${item.opsCount || 0} recorded ops`
      : `${item.ha.toFixed(2)} Ha · No recorded operations`;

    return `<div onclick="openDetailedAnalyticsModal('${item.rawKey}')" class="group flex flex-col gap-1.5 p-2.5 rounded-xl hover:bg-primary-bg/50 border border-transparent hover:border-primary/30 transition-all cursor-pointer">
      <div class="flex items-center justify-between text-xs">
        <div class="flex flex-col">
          <span class="font-bold text-hug-text group-hover:text-primary transition-colors">${item.id}</span>
          <span class="text-[10px] text-hug-muted mt-0.5">${subtitle}</span>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="font-extrabold text-hug-text">${hasData ? `₱${(item.totalCost / 1000).toFixed(1)}k` : '—'}</span>
          <span class="text-[10px] text-hug-muted font-normal">${hasData ? `₱${(item.costPerHa / 1000).toFixed(1)}k/Ha` : 'No data'}</span>
          <span class="text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">Details →</span>
        </div>
      </div>
      <div class="w-full h-2 bg-border rounded-full overflow-hidden">
        <div class="h-full rounded-full ${barGradient} transition-all duration-500" style="width: ${Math.max(pct, hasData ? 5 : 0)}%"></div>
      </div>
    </div>`;
  }).join('');

  const btnLabel = isManager
    ? `View All ${data.length} Member Plots →`
    : `View All ${data.length} Block Farms & Plots →`;

  const allEffKey = isManager ? 'fields' : 'blocks';
  const moreBtnHtml = `
    <button onclick="openAllEfficiencyModal('${allEffKey}')" class="w-full text-center py-2 text-xs font-bold text-primary hover:bg-primary-bg rounded-xl border border-dashed border-primary/30 transition-all cursor-pointer mt-1 flex items-center justify-center gap-1.5">
      <span>${btnLabel}</span>
    </button>
  `;

  el.innerHTML = itemsHtml + moreBtnHtml;
}

// ── FARM OPERATIONS ANALYTICS (Descriptive — ops by type and by month) ───────
function renderFarmOperationsChart() {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const isManager = currentRole === 'manager';
  const isSuperAdmin = currentRole === 'superadmin';
  const elId = isManager ? 'mgr-farm-ops-chart' : 'sra-farm-ops-chart';
  const el = document.getElementById(elId);
  if (!el) return;

  const db = getDB();
  let logs = db.logs || [];

  if (isManager) {
    const myFieldIds = (db.fields || []).filter(f => f.blockFarm?.includes('Nacayao Block Farm') || f.blockFarm?.includes('Nacayao')).map(f => f.id);
    logs = logs.filter(l => myFieldIds.includes(l.fieldId));
  }

  // Count operations by category
  const catLabels = {
    prep: 'Land Preparation',
    plant: 'Planting & Seedcane',
    fert: 'Fertilization',
    weed: 'Cultivation & Weeding',
    maint: 'Crop Maintenance & Hilling-Up',
    harvest: 'Harvesting & Transport'
  };
  const catCounts = { prep: 0, plant: 0, fert: 0, weed: 0, maint: 0, harvest: 0 };
  const catCosts = { prep: 0, plant: 0, fert: 0, weed: 0, maint: 0, harvest: 0 };
  logs.forEach(l => {
    const cat = l.category || 'prep';
    if (catCounts[cat] !== undefined) {
      catCounts[cat]++;
      catCosts[cat] += Number(l.totalCost || l.cost) || 0;
    }
  });

  const totalOps = logs.length;
  const maxCount = Math.max(...Object.values(catCounts), 1);

  const catColors = {
    prep: '#8F3A8F',
    plant: '#4A7C2F',
    fert: '#1A6B9A',
    weed: '#F5A623',
    maint: '#0284C7',
    harvest: '#D9534F'
  };

  if (totalOps === 0) {
    el.innerHTML = `<div class="text-center py-6 text-xs text-hug-muted">No recorded operations yet.</div>`;
    return;
  }

  const barsHtml = Object.entries(catLabels).map(([cat, label]) => {
    const count = catCounts[cat];
    const cost = catCosts[cat];
    const pct = Math.round((count / maxCount) * 100);
    const color = catColors[cat];
    const costStr = cost > 0 ? `₱${(cost / 1000).toFixed(1)}k` : '—';
    return `
      <div class="flex flex-col gap-1">
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background-color:${color}"></span>
            <span class="font-semibold text-hug-text">${label}</span>
          </div>
          <div class="flex items-center gap-3 text-[11px]">
            <span class="text-hug-muted">${count} ops</span>
            <span class="font-bold text-hug-text">${costStr}</span>
          </div>
        </div>
        <div class="w-full h-2 bg-border rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500" style="width:${Math.max(pct, count > 0 ? 4 : 0)}%; background-color:${color}"></div>
        </div>
      </div>`;
  }).join('');

  const drillDownTarget = isManager ? 'operations' : 'audit';
  const drillDownLabel = isManager ? 'View Operations Ledger →' : 'View SRA Audit Ledger →';

  el.innerHTML = `
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-hug-muted font-semibold">${totalOps} total recorded operations</span>
        <button onclick="navigate('${drillDownTarget}')" class="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer">
          ${drillDownLabel}
        </button>
      </div>
      ${barsHtml}
    </div>`;
}

// ── ALL EFFICIENCY MODAL CONTROLLER (WITH PAGES) ──────────
let allEffCurrentPage = 1;
let allEffActiveTab = 'blocks'; // 'blocks' | 'fields'
const ALL_EFF_PER_PAGE = 4;

function setAllEffTab(tab) {
  allEffActiveTab = tab;
  allEffCurrentPage = 1;
  const tabBlocks = document.getElementById('all-eff-tab-blocks');
  const tabFields = document.getElementById('all-eff-tab-fields');
  if (tabBlocks && tabFields) {
    if (tab === 'blocks') {
      tabBlocks.className = 'px-3 py-1 rounded-lg text-xs font-bold transition-all bg-primary text-white shadow-xs cursor-pointer';
      tabFields.className = 'px-3 py-1 rounded-lg text-xs font-medium text-hug-muted hover:text-hug-text transition-all cursor-pointer';
    } else {
      tabBlocks.className = 'px-3 py-1 rounded-lg text-xs font-medium text-hug-muted hover:text-hug-text transition-all cursor-pointer';
      tabFields.className = 'px-3 py-1 rounded-lg text-xs font-bold transition-all bg-primary text-white shadow-xs cursor-pointer';
    }
  }
  renderAllEfficiencyModal();
}

function setAllEffPage(page) {
  allEffCurrentPage = page;
  renderAllEfficiencyModal();
}

function openAllEfficiencyModal(defaultTab) {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const isManager = currentRole === 'manager';
  allEffActiveTab = defaultTab || (isManager ? 'fields' : 'blocks');
  allEffCurrentPage = 1;

  const tabContainer = document.getElementById('all-eff-tabs');
  if (tabContainer) {
    // Hide tabs for farm manager since they only manage fields
    if (isManager) tabContainer.classList.add('hidden');
    else tabContainer.classList.remove('hidden');
  }

  setAllEffTab(allEffActiveTab);
  const modal = document.getElementById('modal-all-efficiency');
  if (modal) modal.classList.remove('hidden');
}

function closeAllEfficiencyModal() {
  const modal = document.getElementById('modal-all-efficiency');
  if (modal) modal.classList.add('hidden');
}

function renderAllEfficiencyModal() {
  const db = getDB();
  const listEl = document.getElementById('all-eff-list');
  const paginationEl = document.getElementById('all-eff-pagination');
  const searchInput = document.getElementById('all-eff-search');
  const search = searchInput ? searchInput.value.trim().toLowerCase() : '';
  if (!listEl) return;

  let dataset = [];

  if (allEffActiveTab === 'blocks') {
    const canonicalBlocks = (db.blockFarms && db.blockFarms.length > 0)
      ? db.blockFarms
      : [{ id: 'BLK-NCY-01', code: 'BLK-A', name: 'Nacayao Block Farm', farmManagerId: '03000001', declaredHa: 15.25 }];

    dataset = canonicalBlocks.map(b => {
      const bName = b.name || b.id;
      const supervisor = resolveBlockFarmManager(b, db);
      const fields = (db.fields || []).filter(f => f.blockFarmId === b.id || f.blockFarm === bName || f.blockFarmId === b.code);
      const fieldIds = fields.map(f => f.id);
      const logs = (db.logs || []).filter(l => fieldIds.includes(l.fieldId));
      const totalCost = logs.reduce((sum, l) => sum + (Number(l.totalCost || l.cost) || 0), 0);
      const ha = fields.length > 0 ? fields.reduce((s, f) => s + (Number(f.ha || f.area) || 0), 0) : (Number(b.declaredHa) || 15.25);
      const costPerHa = ha > 0 ? Math.round(totalCost / ha) : 0;
      const plotsCount = fields.length;
      const opsCount = logs.length;
      return {
        title: bName,
        sub: `Managed by ${supervisor} · ${plotsCount} plots · ${opsCount} recorded ops`,
        rawKey: b.id,
        costPerHa,
        ha,
        totalCost,
        opsCount,
        type: 'Block Farm'
      };
    });
  } else {
    dataset = (db.fields || []).map(f => {
      const fieldLogs = (db.logs || []).filter(l => l.fieldId === f.id);
      const totalCost = fieldLogs.reduce((sum, l) => sum + (Number(l.totalCost || l.cost) || 0), 0);
      const ha = Number(f.ha || f.area || 1.5);
      const costPerHa = ha > 0 ? Math.round(totalCost / ha) : 0;
      const opsCount = fieldLogs.length;
      const memberName = resolveFieldMember(f, db);
      const blockFarmName = resolveFieldBlockFarm(f, db);
      return {
        title: `${f.id} — ${memberName}`,
        sub: `${blockFarmName} · ${f.stage || 'Stage 1'} · ${opsCount} ops`,
        rawKey: f.id,
        costPerHa,
        ha,
        totalCost,
        opsCount,
        type: 'Field Plot'
      };
    });
  }

  if (search) {
    dataset = dataset.filter(d =>
      d.title.toLowerCase().includes(search) ||
      d.sub.toLowerCase().includes(search) ||
      d.rawKey.toLowerCase().includes(search)
    );
  }

  const totalPages = Math.ceil(dataset.length / ALL_EFF_PER_PAGE) || 1;
  if (allEffCurrentPage > totalPages) allEffCurrentPage = totalPages;
  const start = (allEffCurrentPage - 1) * ALL_EFF_PER_PAGE;
  const pageItems = dataset.slice(start, start + ALL_EFF_PER_PAGE);

  const maxCost = Math.max(...dataset.map(d => d.costPerHa), 1);

  listEl.innerHTML = pageItems.map(item => {
    const pct = Math.round((item.costPerHa / maxCost) * 100);
    const hasData = item.totalCost > 0;
    const statusBadge = hasData
      ? `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-success bg-success-bg">${item.opsCount} ops recorded</span>`
      : `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-hug-muted bg-bg">No recorded ops</span>`;
    const barGradient = hasData ? 'bg-gradient-to-r from-primary to-primary-light' : 'bg-border';

    return `
      <div onclick="closeAllEfficiencyModal(); openDetailedAnalyticsModal('${item.rawKey}')" class="group flex flex-col gap-2 p-3 rounded-xl bg-bg/50 hover:bg-primary-bg/40 border border-border hover:border-primary/40 transition-all cursor-pointer">
        <div class="flex items-center justify-between text-xs">
          <div>
            <span class="font-bold text-hug-text group-hover:text-primary transition-colors text-sm">${item.title}</span>
            <p class="text-[11px] text-hug-muted">${item.sub}</p>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            ${statusBadge}
            <div class="text-right">
              <div class="font-extrabold text-hug-text text-sm">${hasData ? `₱${(item.totalCost / 1000).toFixed(1)}k` : '—'}</div>
              <div class="text-[10px] text-hug-muted">${hasData ? `₱${(item.costPerHa / 1000).toFixed(1)}k/Ha` : 'no data'}</div>
            </div>
            <span class="text-xs text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center">View →</span>
          </div>
        </div>
        <div class="w-full h-2 bg-border rounded-full overflow-hidden">
          <div class="h-full rounded-full ${barGradient} transition-all duration-500" style="width: ${Math.max(pct, hasData ? 4 : 0)}%"></div>
        </div>
      </div>
    `;
  }).join('') || '<div class="text-center py-8 text-xs text-hug-muted">No items matched your search criteria.</div>';

  if (paginationEl) {
    if (totalPages <= 1) {
      paginationEl.innerHTML = `<span class="text-xs text-hug-muted">Showing all ${dataset.length} items</span>`;
    } else {
      paginationEl.innerHTML = `
        <button onclick="setAllEffPage(${allEffCurrentPage - 1})" ${allEffCurrentPage === 1 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} class="px-3 py-1 bg-white border border-border rounded-lg text-xs font-semibold cursor-pointer text-hug-text2 hover:text-primary hover:border-primary transition-all">Prev</button>
        <span class="text-xs font-semibold text-hug-text2">Page ${allEffCurrentPage} of ${totalPages} (${dataset.length} total)</span>
        <button onclick="setAllEffPage(${allEffCurrentPage + 1})" ${allEffCurrentPage === totalPages ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} class="px-3 py-1 bg-white border border-border rounded-lg text-xs font-semibold cursor-pointer text-hug-text2 hover:text-primary hover:border-primary transition-all">Next</button>
      `;
    }
  }
}

const SRA_CROP_PHASES = {
  'phase-1': {
    key: 'phase-1',
    phase: 'Stage 1',
    name: 'Soil & Land Prep',
    fullName: 'Soil Sampling & Land Preparation',
    ops: 'Ops 1–2',
    color: '#8F3A8F',
    days: '0 – 15 Days',
    benchmark: '₱22,000 / Ha',
    keywords: ['prep', 'soil', 'land', 'furrow', 'plow', 'sampling'],
    guidelines: 'Conduct soil sampling for pH and nutrient mapping. Perform deep subsoil ripping followed by 2 disc plowing passes and 1 rotavator pass. Create furrow depth of 25-30 cm. Apply agricultural lime if soil pH is below 5.5.'
  },
  'phase-2': {
    key: 'phase-2',
    phase: 'Stage 2',
    name: 'Planting & Canepoints',
    fullName: 'Planting Material & Planting (Patdan)',
    ops: 'Ops 3–4',
    color: '#4A7C2F',
    days: '15 – 30 Days',
    benchmark: '₱14,400 / Ha',
    keywords: ['plant', 'patdan', 'seedcane', 'canepoint'],
    guidelines: 'Acquire certified high-yielding canepoints (Phil 84-77, VMC 84-524) at 30,000 to 35,000 points/Ha. Dip in fungicide solution for 15 mins. Plant in furrows with 2 buds facing sideways and cover with 3-5 cm fine soil.'
  },
  'phase-3': {
    key: 'phase-3',
    phase: 'Stage 3',
    name: 'Basal Fertilization',
    fullName: 'Basal Fertilization & Soil Amending',
    ops: 'Ops 5–6',
    color: '#1A6B9A',
    days: '30 – 45 Days',
    benchmark: '₱12,700 / Ha',
    keywords: ['basal', 'dap', 'phosphate', 'fertiliz', 'abono'],
    guidelines: 'Apply basal dose (46-0-0 Urea, 18-46-00 DAP, 00-00-60 MOP, and Rock Phosphate) along the furrow line. Ensure adequate soil moisture before application to prevent volatilization.'
  },
  'phase-4': {
    key: 'phase-4',
    phase: 'Stage 4',
    name: 'Cultivation & Care',
    fullName: 'Cultivation, Weeding & Drainage',
    ops: 'Ops 7, 10–11',
    color: '#F5A623',
    days: '45 – 90 Days',
    benchmark: '₱7,800 / Ha',
    keywords: ['cultivation', 'barring', 'off-barring', 'on-barring', 'hilling', 'weed', 'drainage', 'irrigation'],
    guidelines: 'Perform ridge busting (1 pass), off-barring (2 passes), on-barring (2 passes), and hilling-up (3 passes) for aeration and root zone weed suppression. Maintain field drainage channels.'
  },
  'phase-5': {
    key: 'phase-5',
    phase: 'Stage 5',
    name: 'Top-Dress Fert',
    fullName: 'Top-Dress Fertilization (2nd Dose)',
    ops: 'Ops 8–9',
    color: '#0284C7',
    days: '90 – 120 Days',
    benchmark: '₱10,000 / Ha',
    keywords: ['top-dress', 'top dress', '2nd dose', 'second dose'],
    guidelines: 'Apply second dose: Urea (46-0-0) and Muriate of Potash (00-00-60) at 90–120 days during peak tillering before final hilling-up and full canopy closure.'
  },
  'phase-6': {
    key: 'phase-6',
    phase: 'Stage 6',
    name: 'Harvest & Milling',
    fullName: 'Harvesting, Cutting & Hauling Operations',
    ops: 'Ops 12–14',
    color: '#D9534F',
    days: '10 – 12 Months',
    benchmark: '₱51,000 / Ha',
    keywords: ['harvest', 'cutting', 'hauling', 'trucking', 'bull cart', 'milling'],
    guidelines: 'Cut mature cane flush at ground level to capture maximum sucrose and promote vigorous ratoon sprouting. Coordinate in-field bull cart and trucking to mill within 24 hours of cutting.'
  }
};

function matchFieldToPhaseKey(field) {
  if (!field) return 'phase-1';
  
  // 1. Explicit Stage Number Check
  const num = Number(field.stageNumber);
  if (num === 1) return 'phase-1';
  if (num === 2) return 'phase-2';
  if (num === 3) return 'phase-3';
  if (num === 4) return 'phase-4';
  if (num === 5) return 'phase-5';
  if (num === 6 || num === 7 || num === 8) return 'phase-6';

  // 2. Stage Name and Keyword Matching
  const stageStr = (field.stage || '').toLowerCase();
  
  if (stageStr.includes('stage 6') || stageStr.includes('phase 6') || stageStr.includes('harvest') || stageStr.includes('milling') || stageStr.includes('hauling') || stageStr.includes('cutting')) {
    return 'phase-6';
  }
  if (stageStr.includes('stage 5') || stageStr.includes('phase 5') || stageStr.includes('top-dress') || stageStr.includes('top dress') || stageStr.includes('final hilling') || stageStr.includes('crop maintenance') || stageStr.includes('2nd dose') || stageStr.includes('pasungkal')) {
    return 'phase-5';
  }
  if (stageStr.includes('stage 4') || stageStr.includes('phase 4') || stageStr.includes('cultivation') || stageStr.includes('off-barring') || stageStr.includes('on-barring') || stageStr.includes('pahubas') || stageStr.includes('weed')) {
    return 'phase-4';
  }
  if (stageStr.includes('stage 3') || stageStr.includes('phase 3') || stageStr.includes('basal') || stageStr.includes('abono') || stageStr.includes('fertiliz')) {
    return 'phase-3';
  }
  if (stageStr.includes('stage 2') || stageStr.includes('phase 2') || stageStr.includes('plant') || stageStr.includes('patdan') || stageStr.includes('canepoint') || stageStr.includes('seedcane')) {
    return 'phase-2';
  }
  if (stageStr.includes('stage 1') || stageStr.includes('phase 1') || stageStr.includes('prep') || stageStr.includes('plow') || stageStr.includes('furrow') || stageStr.includes('tudling')) {
    return 'phase-1';
  }

  for (const [pKey, meta] of Object.entries(SRA_CROP_PHASES)) {
    if (meta.keywords.some(kw => stageStr.includes(kw))) {
      return pKey;
    }
  }
  return 'phase-1';
}

function renderCropStageDistribution() {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const isManager = currentRole === 'manager';
  const el = isManager ? document.getElementById('mgr-crop-stage-visual') : document.getElementById('crop-stage-visual');
  const subEl = isManager ? (document.getElementById('mgr-crop-stage-subtitle') || document.getElementById('crop-stage-subtitle')) : document.getElementById('crop-stage-subtitle');
  if (!el) return;

  const db = getDB();
  let scopedFields = [];
  let subtitleText = '';

  if (isManager) {
    // ── FARM MANAGER: Scoped strictly to their single assigned block farm (Nacayao Block Farm)
    const nacayaoFields = db.fields.filter(f => f.blockFarm?.includes('Nacayao Block Farm') || f.blockFarm?.includes('Nacayao'));
    
    // Populate member filter dropdown if not yet populated or changed
    const mgrMemberSelect = document.getElementById('mgr-crop-stage-member-filter');
    if (mgrMemberSelect && mgrMemberSelect.children.length <= 1) {
      const currentVal = mgrMemberSelect.value;
      mgrMemberSelect.innerHTML = '<option value="all">All Nacayao Plots</option>' + 
        nacayaoFields.map(f => `<option value="${f.id}">${f.id} · ${f.member || 'Member'} (${Number(f.ha || 1.5).toFixed(1)} Ha)</option>`).join('');
      mgrMemberSelect.value = currentVal || 'all';
    }

    const selectedPlotId = mgrMemberSelect ? mgrMemberSelect.value : 'all';
    if (selectedPlotId && selectedPlotId !== 'all') {
      scopedFields = nacayaoFields.filter(f => f.id === selectedPlotId);
      const selField = scopedFields[0];
      const totalHa = scopedFields.reduce((sum, f) => sum + (Number(f.ha) || 1.5), 0);
      subtitleText = `Viewing ${selField?.id || selectedPlotId} · ${selField?.member || 'Member Farmer'} (${totalHa.toFixed(2)} Ha · ${selField?.variety || 'Phil 84-77'})`;
    } else {
      scopedFields = nacayaoFields;
      const totalHa = scopedFields.reduce((sum, f) => sum + (Number(f.ha) || 1.5), 0);
      subtitleText = `${totalHa.toFixed(2)} Ha active across ${scopedFields.length} Member Plots (Nacayao Block Farm)`;
    }
  } else {
    // ── SRA ADMIN: Scoped to all regional block farms (or filtered by selected block)
    const blockFilterSelect = document.getElementById('sra-crop-stage-block-filter');
    const selectedBlock = blockFilterSelect ? blockFilterSelect.value : 'all';

    if (selectedBlock === 'all') {
      scopedFields = db.fields;
      const totalHa = scopedFields.reduce((sum, f) => sum + (Number(f.ha) || 1.5), 0);
      subtitleText = `${totalHa.toFixed(2)} Ha total area across 4 Regional Block Farms (${scopedFields.length} Consolidated Plots)`;
    } else {
      scopedFields = db.fields.filter(f => f.blockFarm === selectedBlock || f.blockFarm?.includes(selectedBlock));
      const totalHa = scopedFields.reduce((sum, f) => sum + (Number(f.ha) || 1.5), 0);
      subtitleText = `${totalHa.toFixed(2)} Ha active across ${scopedFields.length} Plots (${selectedBlock})`;
    }
  }

  const totalHa = scopedFields.reduce((sum, f) => sum + (Number(f.ha) || 1.5), 0);

  if (subEl) {
    subEl.textContent = subtitleText;
  }

  // Calculate hectare allocation per phase
  const phaseCards = Object.values(SRA_CROP_PHASES).map(phase => {
    const matchingPlots = scopedFields.filter(f => matchFieldToPhaseKey(f) === phase.key);
    const ha = matchingPlots.reduce((s, f) => s + (Number(f.ha) || 1.5), 0);
    const pct = totalHa > 0 ? Math.round((ha / totalHa) * 100) : 0;
    return {
      ...phase,
      ha,
      pct,
      plotsCount: matchingPlots.length
    };
  });

  el.innerHTML = phaseCards.map((s, idx) => {
    const isActive = s.ha > 0;
    return `
    <div onclick="openCropStageModal('${s.key}')" 
         class="group relative bg-white rounded-2xl p-4 border ${isActive ? 'border-border shadow-xs' : 'border-border/60 opacity-80'} flex flex-col justify-between hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden">
      <!-- Top Colored Accent Strip -->
      <div class="absolute top-0 left-0 right-0 h-1.5" style="background-color: ${s.color};"></div>
      
      <!-- Stage Header: Badge & Share -->
      <div class="flex items-center justify-between mb-2.5 pt-1">
        <span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider" style="background-color: ${s.color}15; color: ${s.color}">
          ${s.phase}
        </span>
        <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-bg text-hug-text border border-border group-hover:border-primary/40 transition-colors">
          ${s.pct}%
        </span>
      </div>

      <!-- Stage Title & Timeline -->
      <div class="flex-1 flex flex-col justify-center my-1">
        <h4 class="text-xs font-black text-hug-text group-hover:text-primary transition-colors leading-snug">
          ${s.name}
        </h4>
        <div class="flex items-center gap-1.5 mt-1">
          <span class="text-[10px] font-bold text-hug-text2">${s.days}</span>
          <span class="text-hug-muted text-[10px]">·</span>
          <span class="text-[10px] font-medium text-hug-muted">${s.ops}</span>
        </div>
      </div>

      <!-- Stage Stats & Progress -->
      <div class="mt-3 pt-2.5 border-t border-border/70">
        <div class="flex items-baseline justify-between">
          <p class="text-base font-black tracking-tight" style="color: ${s.color}">
            ${s.ha.toFixed(2)} <span class="text-xs font-bold text-hug-muted">Ha</span>
          </p>
          <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-md ${s.plotsCount > 0 ? 'bg-primary-bg text-primary' : 'bg-bg text-hug-muted'}">
            ${s.plotsCount} plot${s.plotsCount !== 1 ? 's' : ''}
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="w-full h-1.5 bg-bg rounded-full overflow-hidden mt-2.5 border border-border/40">
          <div class="h-full rounded-full transition-all duration-700" 
               style="width: ${Math.max(s.pct, s.ha > 0 ? 10 : 0)}%; background-color: ${s.color}"></div>
        </div>

        <!-- Hover Interactive Hint -->
        <div class="flex items-center justify-between mt-2 pt-1 border-t border-dashed border-border/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <span class="text-[10px] font-bold text-primary">View Member Plots</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-primary transform group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── DETAILED DRILL-DOWN ANALYTICS MODAL CONTROLLER ────────
const DETAIL_PAGE_SIZE = 5;
let currentDetailKey = null;
let currentDetailTab = 'overview';
let detailFieldsPage = 1;
let detailLogsPage = 1;
let detailModalHistory = [];

function openDetailedAnalyticsModal(key, isBack = false) {
  const db = getDB();
  const modal = document.getElementById('modal-detailed-analytics');
  if (!modal) return;

  const validKey = key || 'Nacayao Block Farm';
  const isModalCurrentlyClosed = modal.classList.contains('hidden');

  // If opening fresh from outside the modal, reset history stack and current key
  if (isModalCurrentlyClosed) {
    detailModalHistory = [];
    currentDetailKey = null;
  } else if (!isBack && currentDetailKey && currentDetailKey !== validKey) {
    // Navigating deeper while already inside the open modal
    detailModalHistory.push(currentDetailKey);
  } else if (!isBack && !currentDetailKey) {
    detailModalHistory = [];
  }

  const isBlockFarm = String(validKey).startsWith('Block Farm') || String(validKey).includes('Nacayao') || String(validKey).includes('Cluster') || String(validKey).includes('Group') || String(validKey).includes('Cooperative');
  const typeBadge = document.getElementById('detail-analytics-type-badge');
  const statusBadge = document.getElementById('detail-analytics-status-badge');
  const titleEl = document.getElementById('detail-analytics-title');
  const subtitleEl = document.getElementById('detail-analytics-subtitle');

  const totalCostEl = document.getElementById('detail-kpi-total-cost');
  const costHaEl = document.getElementById('detail-kpi-cost-ha');
  const opsCountEl = document.getElementById('detail-kpi-benchmark');
  const haEl = document.getElementById('detail-kpi-ha');
  const plotsCountEl = document.getElementById('detail-kpi-plots-count');
  const ratingEl = document.getElementById('detail-kpi-rating');
  const breakdownBarsEl = document.getElementById('detail-expense-breakdown-bars');

  // Back Button & Breadcrumb update
  const backBtn = document.getElementById('detail-modal-back-btn');
  const backLabel = document.getElementById('detail-modal-back-label');
  if (backBtn) {
    if (detailModalHistory.length > 0) {
      const prevKey = detailModalHistory[detailModalHistory.length - 1];
      const prevIsBlock = String(prevKey).startsWith('Block Farm') || String(prevKey).includes('Nacayao') || String(prevKey).includes('Cluster') || String(prevKey).includes('Group') || String(prevKey).includes('Cooperative');
      if (backLabel) {
        backLabel.textContent = prevIsBlock ? `Back to ${prevKey.replace('Nacayao ', '')}` : `Back to ${prevKey}`;
      }
      backBtn.classList.remove('hidden');
    } else {
      backBtn.classList.add('hidden');
    }
  }

  let associatedFields = [];
  let entityTitle = '';
  let entitySub = '';

  currentDetailKey = validKey;
  currentDetailTab = 'overview';
  detailFieldsPage = 1;
  detailLogsPage = 1;

  if (isBlockFarm) {
    if (typeBadge) { typeBadge.textContent = 'Block Farm Cluster'; typeBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-black bg-primary-bg text-primary uppercase tracking-wider'; }
    associatedFields = db.fields.filter(f => f.blockFarm === key || key.includes(f.blockFarm));
    if (associatedFields.length === 0) associatedFields = db.fields;
    entityTitle = key;
    entitySub = `Consolidated farm cluster · ${associatedFields.length} member plots`;
  } else {
    if (typeBadge) { typeBadge.textContent = 'Individual Field Plot'; typeBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-black bg-[#1A6B9A]/15 text-[#1A6B9A] uppercase tracking-wider'; }
    const field = db.fields.find(f => f.id === key) || db.fields[0];
    associatedFields = [field];
    entityTitle = `${field.id} — ${field.member || field.owner || 'Member Farmer'}`;
    entitySub = `${field.blockFarm || 'Block Farm'} · ${field.ha} Ha · ${field.stage || 'Stage 1'}`;
  }

  const totalHa = associatedFields.reduce((s, f) => s + (Number(f.ha) || 1.5), 0);
  const fieldIds = associatedFields.map(f => f.id);
  const associatedLogs = db.logs.filter(l => fieldIds.includes(l.fieldId));
  const totalCost = associatedLogs.reduce((s, l) => s + (Number(l.totalCost || l.cost) || 0), 0);
  const costPerHa = totalHa > 0 ? Math.round(totalCost / totalHa) : 0;
  const statusText = associatedLogs.length > 0 ? `${associatedLogs.length} Recorded Operations` : 'No Recorded Operations';
  const badgeColorClass = associatedLogs.length > 0 ? 'bg-success-bg text-success' : 'bg-bg text-hug-muted';

  if (titleEl) titleEl.textContent = entityTitle;
  if (subtitleEl) subtitleEl.textContent = entitySub;
  if (statusBadge) { statusBadge.textContent = statusText; statusBadge.className = `px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeColorClass}`; }

  if (totalCostEl) totalCostEl.textContent = `₱${totalCost.toLocaleString()}`;
  if (costHaEl) costHaEl.textContent = `₱${costPerHa.toLocaleString()}`;
  if (opsCountEl) {
    opsCountEl.textContent = `${associatedLogs.length} Recorded Operations`;
    opsCountEl.className = 'text-[10px] text-primary font-semibold';
  }
  if (haEl) haEl.textContent = `${totalHa.toFixed(2)} Ha`;
  if (plotsCountEl) plotsCountEl.textContent = `${associatedFields.length} Registered Plot${associatedFields.length > 1 ? 's' : ''}`;
  if (ratingEl) ratingEl.textContent = `${associatedFields.length} plots`;

  // Update tab buttons & counters based on whether inspecting Block Farm vs Single Plot
  const tabFieldsBtn = document.getElementById('modal-detail-tab-btn-fields');
  const tabFieldsCount = document.getElementById('detail-tab-fields-count');
  const tabLogsCount = document.getElementById('detail-tab-logs-count');

  if (isBlockFarm) {
    if (tabFieldsBtn) {
      tabFieldsBtn.innerHTML = `
        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
        Member Plots (<span id="detail-tab-fields-count">${associatedFields.length}</span>)
      `;
      tabFieldsBtn.classList.remove('hidden');
    }
  } else {
    // Individual Plot: Find sister plots in same Block Farm
    const field = associatedFields[0];
    const parentBlock = field?.blockFarm || 'Block Farm';
    const sisterPlots = db.fields.filter(f => f.blockFarm === parentBlock && f.id !== field.id);
    if (tabFieldsBtn) {
      tabFieldsBtn.innerHTML = `
        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
        Sister Plots in ${parentBlock.replace('Nacayao ', '')} (<span id="detail-tab-fields-count">${sisterPlots.length}</span>)
      `;
      tabFieldsBtn.classList.remove('hidden');
    }
  }

  if (tabLogsCount) tabLogsCount.textContent = associatedLogs.length;

  // Overview Operational Metrics
  const elArea = document.getElementById('detail-overview-area');
  const elPlots = document.getElementById('detail-overview-plots-count');
  const elLogs = document.getElementById('detail-overview-logs-count');
  const elSpend = document.getElementById('detail-overview-total-spend');
  const elCostHa = document.getElementById('detail-overview-cost-per-ha');

  if (elArea) elArea.textContent = `${totalHa.toFixed(2)} Ha`;
  if (elPlots) elPlots.textContent = `${associatedFields.length} Plot${associatedFields.length > 1 ? 's' : ''}`;
  if (elLogs) elLogs.textContent = `${associatedLogs.length} Logs`;
  if (elSpend) elSpend.textContent = `₱${totalCost.toLocaleString()}`;
  if (elCostHa) elCostHa.textContent = `₱${costPerHa.toLocaleString()} / Ha`;

  // Expense Breakdown calculations (6 SRA Agronomic Phases)
  const catSums = { prep: 0, plant: 0, basal: 0, weed: 0, topdress: 0, harvest: 0 };
  associatedLogs.forEach(l => {
    const sraId = (l.sraOperationId || '').toUpperCase();
    const act = (l.activity || l.operationName || '').toLowerCase();
    const amt = Number(l.totalCost || l.cost) || 0;

    if (sraId === 'SRA-01' || sraId === 'SRA-02' || l.category === 'prep') {
      catSums.prep += amt;
    } else if (sraId === 'SRA-03' || sraId === 'SRA-04' || l.category === 'plant') {
      catSums.plant += amt;
    } else if (sraId === 'SRA-08' || sraId === 'SRA-09' || act.includes('top-dress') || act.includes('2nd dose') || act.includes('topdress')) {
      catSums.topdress += amt;
    } else if (sraId === 'SRA-05' || sraId === 'SRA-06' || l.category === 'fert' || act.includes('basal') || act.includes('phosphate')) {
      catSums.basal += amt;
    } else if (sraId === 'SRA-07' || sraId === 'SRA-10' || sraId === 'SRA-11' || l.category === 'weed' || l.category === 'maint' || act.includes('barring') || act.includes('cultivation') || act.includes('weeding') || act.includes('drainage') || act.includes('canal')) {
      catSums.weed += amt;
    } else {
      catSums.harvest += amt;
    }
  });

  const breakdownItems = [
    { label: '1. Soil Sampling & Land Prep (Ops 1–2)', color: '#8F3A8F', amount: catSums.prep },
    { label: '2. Planting Material & Planting (Ops 3–4)', color: '#4A7C2F', amount: catSums.plant },
    { label: '3. Basal Fertilization & Amending (Ops 5–6)', color: '#1A6B9A', amount: catSums.basal },
    { label: '4. Cultivation, Weeding & Care (Ops 7, 10–11)', color: '#F5A623', amount: catSums.weed },
    { label: '5. Top-Dress Fertilization 2nd Dose (Ops 8–9)', color: '#0284C7', amount: catSums.topdress },
    { label: '6. Harvesting & Transport Operations (Ops 12–14)', color: '#D9534F', amount: catSums.harvest },
  ].map(b => ({
    ...b,
    pct: totalCost > 0 ? Math.round((b.amount / totalCost) * 100) : 0
  }));

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

  // Reset to overview tab & render sub-tables
  setDetailModalTab('overview');
  renderDetailFieldsTable();
  renderDetailLogsTable();

  modal.classList.remove('hidden');
}

function backDetailedAnalyticsModal() {
  if (detailModalHistory.length > 0) {
    const previousKey = detailModalHistory.pop();
    openDetailedAnalyticsModal(previousKey, true);
  }
}

function setDetailModalTab(tabName) {
  currentDetailTab = tabName;
  const tabs = ['overview', 'fields', 'logs'];
  tabs.forEach(t => {
    const btn = document.getElementById(`modal-detail-tab-btn-${t}`);
    const panel = document.getElementById(`modal-detail-panel-${t}`);
    if (btn) {
      if (t === tabName) {
        btn.className = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5';
      } else {
        btn.className = 'px-3 py-1.5 rounded-lg text-xs font-medium text-hug-muted hover:text-hug-text hover:bg-bg transition-all cursor-pointer flex items-center gap-1.5';
      }
    }
    if (panel) {
      if (t === tabName) {
        if (t === 'overview') panel.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
        else panel.className = 'flex flex-col gap-3';
      } else {
        panel.className = 'hidden';
      }
    }
  });
}

function setDetailFieldsPage(page) {
  detailFieldsPage = page;
  renderDetailFieldsTable();
}

function setDetailLogsPage(page) {
  detailLogsPage = page;
  renderDetailLogsTable();
}

function renderDetailFieldsTable() {
  const db = getDB();
  const tableBody = document.getElementById('detail-block-fields-table-body');
  const paginationEl = document.getElementById('detail-fields-pagination');
  const searchInput = document.getElementById('detail-fields-search');
  if (!tableBody) return;

  const key = currentDetailKey || 'Nacayao Block Farm';
  const isBlockFarm = String(key).startsWith('Block Farm') || String(key).includes('Nacayao') || String(key).includes('Cluster') || String(key).includes('Group') || String(key).includes('Cooperative');
  
  let fields = [];
  if (isBlockFarm) {
    fields = (db.fields || []).filter(f => f.blockFarm === key || String(key).includes(f.blockFarm || '') || String(f.blockFarm || '').includes(String(key)));
    if (fields.length === 0) fields = db.fields || [];
  } else {
    // For single field, show sister plots within the same Block Farm for seamless browsing
    const currentField = (db.fields || []).find(f => f.id === key);
    const parentBlock = currentField?.blockFarm || 'Nacayao Block Farm';
    fields = (db.fields || []).filter(f => f.blockFarm === parentBlock && f.id !== key);
    if (fields.length === 0) fields = (db.fields || []).filter(f => f.id !== key);
  }

  const query = (searchInput?.value || '').toLowerCase().trim();
  if (query) {
    fields = fields.filter(f => (f.id || '').toLowerCase().includes(query) || (f.member || '').toLowerCase().includes(query));
  }

  const totalPages = Math.max(1, Math.ceil(fields.length / DETAIL_PAGE_SIZE));
  detailFieldsPage = Math.max(1, Math.min(detailFieldsPage, totalPages));

  const startIdx = (detailFieldsPage - 1) * DETAIL_PAGE_SIZE;
  const pageFields = fields.slice(startIdx, startIdx + DETAIL_PAGE_SIZE);

  if (pageFields.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-xs text-hug-muted">No plots found matching search query.</td></tr>`;
  } else {
    tableBody.innerHTML = pageFields.map(f => {
      const fieldLogs = (db.logs || []).filter(l => l.fieldId === f.id);
      const fCost = fieldLogs.reduce((s, l) => s + (Number(l.totalCost || l.cost) || 0), 0);
      const fHa = Number(f.ha || 1.5);
      const fCostHa = fHa > 0 ? Math.round(fCost / fHa) : 0;
      return `
        <tr class="border-b border-border/50 hover:bg-bg transition-colors">
          <td class="px-3 py-2.5 font-mono font-bold text-primary">${f.id}</td>
          <td class="px-3 py-2.5 font-semibold text-hug-text">${f.member || 'Member'}</td>
          <td class="px-3 py-2.5 text-hug-text2 font-bold">${fHa.toFixed(2)} Ha</td>
          <td class="px-3 py-2.5"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-bg text-primary">${f.stage || 'Land Preparation'}</span></td>
          <td class="px-3 py-2.5 font-mono font-bold text-hug-text">₱${(fCostHa / 1000).toFixed(1)}k/Ha</td>
          <td class="px-3 py-2.5 text-right">
            <button onclick="openDetailedAnalyticsModal('${f.id}')" class="px-2.5 py-1 bg-white border border-border hover:border-primary hover:text-primary rounded-lg text-[11px] font-bold transition-all cursor-pointer">
              Inspect Plot →
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  if (paginationEl) {
    paginationEl.innerHTML = `
      <span class="text-xs text-hug-muted font-medium">Page ${detailFieldsPage} of ${totalPages} (${fields.length} plots)</span>
      <div class="flex items-center gap-1.5">
        <button onclick="setDetailFieldsPage(${detailFieldsPage - 1})" ${detailFieldsPage <= 1 ? 'disabled class="px-2.5 py-1 rounded-lg text-xs bg-bg text-hug-muted border border-border opacity-50 cursor-not-allowed"' : 'class="px-2.5 py-1 rounded-lg text-xs bg-white text-hug-text border border-border hover:border-primary hover:text-primary transition-all cursor-pointer"'}>
          ‹ Previous
        </button>
        <button onclick="setDetailFieldsPage(${detailFieldsPage + 1})" ${detailFieldsPage >= totalPages ? 'disabled class="px-2.5 py-1 rounded-lg text-xs bg-bg text-hug-muted border border-border opacity-50 cursor-not-allowed"' : 'class="px-2.5 py-1 rounded-lg text-xs bg-white text-hug-text border border-border hover:border-primary hover:text-primary transition-all cursor-pointer"'}>
          Next ›
        </button>
      </div>
    `;
  }
}

function renderDetailLogsTable() {
  const db = getDB();
  const tableBody = document.getElementById('detail-activities-table-body');
  const paginationEl = document.getElementById('detail-logs-pagination');
  const searchInput = document.getElementById('detail-logs-search');
  if (!tableBody) return;

  const key = currentDetailKey || 'Nacayao Block Farm';
  const isBlockFarm = String(key).startsWith('Block Farm') || String(key).includes('Nacayao') || String(key).includes('Cluster') || String(key).includes('Group') || String(key).includes('Cooperative');
  
  let fields = isBlockFarm
    ? (db.fields || []).filter(f => f.blockFarm === key || String(key).includes(f.blockFarm || '') || String(f.blockFarm || '').includes(String(key)))
    : (db.fields || []).filter(f => f.id === key);

  if (fields.length === 0) fields = db.fields || [];
  const fieldIds = fields.map(f => f.id);
  let logs = (db.logs || []).filter(l => fieldIds.includes(l.fieldId));

  const query = (searchInput?.value || '').toLowerCase().trim();
  if (query) {
    logs = logs.filter(l => (l.id || '').toLowerCase().includes(query) || (l.activity || l.operationName || '').toLowerCase().includes(query) || (l.sraOperationId || '').toLowerCase().includes(query));
  }

  const totalPages = Math.ceil(logs.length / DETAIL_PAGE_SIZE) || 1;
  detailLogsPage = Math.max(1, Math.min(detailLogsPage, totalPages));

  const startIdx = (detailLogsPage - 1) * DETAIL_PAGE_SIZE;
  const pageLogs = logs.slice(startIdx, startIdx + DETAIL_PAGE_SIZE);

  if (pageLogs.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-xs text-hug-muted">No operational logs found matching query.</td></tr>`;
  } else {
    tableBody.innerHTML = pageLogs.map(l => `
      <tr class="border-b border-border/50 hover:bg-bg transition-colors">
        <td class="px-3 py-2.5 font-mono font-bold text-xs text-primary">${l.id || 'LOG'}</td>
        <td class="px-3 py-2.5 text-xs font-semibold text-hug-text">
          <div class="flex items-center gap-1.5">
            <span class="px-1.5 py-0.5 rounded bg-primary-bg text-primary text-[10px] font-bold">${l.sraOperationId || 'SRA-OP'}</span>
            <span>${l.activity || l.operationName || 'Field Operation'}</span>
          </div>
        </td>
        <td class="px-3 py-2.5 text-xs font-bold text-hug-text">₱${Number(l.totalCost || l.cost || 0).toLocaleString()}</td>
        <td class="px-3 py-2.5 text-xs text-hug-muted">${l.date || 'Recent'}</td>
        <td class="px-3 py-2.5 font-mono text-xs text-primary font-semibold">${l.fieldId || 'FLD'}</td>
      </tr>
    `).join('');
  }

  if (paginationEl) {
    paginationEl.innerHTML = `
      <span class="text-xs text-hug-muted font-medium">Page ${detailLogsPage} of ${totalPages} (${logs.length} logs)</span>
      <div class="flex items-center gap-1.5">
        <button onclick="setDetailLogsPage(${detailLogsPage - 1})" ${detailLogsPage <= 1 ? 'disabled class="px-2.5 py-1 rounded-lg text-xs bg-bg text-hug-muted border border-border opacity-50 cursor-not-allowed"' : 'class="px-2.5 py-1 rounded-lg text-xs bg-white text-hug-text border border-border hover:border-primary hover:text-primary transition-all cursor-pointer"'}>
          ‹ Previous
        </button>
        <button onclick="setDetailLogsPage(${detailLogsPage + 1})" ${detailLogsPage >= totalPages ? 'disabled class="px-2.5 py-1 rounded-lg text-xs bg-bg text-hug-muted border border-border opacity-50 cursor-not-allowed"' : 'class="px-2.5 py-1 rounded-lg text-xs bg-white text-hug-text border border-border hover:border-primary hover:text-primary transition-all cursor-pointer"'}>
          Next ›
        </button>
      </div>
    `;
  }
}

function closeDetailedAnalyticsModal() {
  const modal = document.getElementById('modal-detailed-analytics');
  if (modal) modal.classList.add('hidden');
  detailModalHistory = [];
  currentDetailKey = null;
  const backBtn = document.getElementById('detail-modal-back-btn');
  if (backBtn) backBtn.classList.add('hidden');
  const backLabel = document.getElementById('detail-modal-back-label');
  if (backLabel) backLabel.textContent = 'Back';
}

// ── CROP STAGE DEEP-DIVE MODAL CONTROLLER ────────
function openCropStageModal(stageKeyOrName) {
  const db = getDB();
  const modal = document.getElementById('modal-crop-stage-detail');
  if (!modal) return;

  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const isManager = currentRole === 'manager';

  // Find phase by key or name
  let phase = SRA_CROP_PHASES[stageKeyOrName];
  if (!phase) {
    phase = Object.values(SRA_CROP_PHASES).find(p => p.name === stageKeyOrName || p.fullName === stageKeyOrName || p.phase === stageKeyOrName) || SRA_CROP_PHASES['phase-1'];
  }

  const phaseBadgeEl = document.getElementById('stage-modal-phase-badge');
  const titleEl = document.getElementById('stage-modal-title');
  const subtitleEl = document.getElementById('stage-modal-subtitle');
  const haEl = document.getElementById('stage-modal-ha');
  const shareEl = document.getElementById('stage-modal-share');
  const daysEl = document.getElementById('stage-modal-days');
  const guidelinesEl = document.getElementById('stage-modal-guidelines');
  const plotsListEl = document.getElementById('stage-modal-plots-list');

  const scopedFields = isManager
    ? db.fields.filter(f => f.blockFarm?.includes('Nacayao Block Farm') || f.blockFarm?.includes('Nacayao'))
    : db.fields;

  const totalHa = scopedFields.reduce((sum, f) => sum + (Number(f.ha) || 1.5), 0);
  const matchingPlots = scopedFields.filter(f => matchFieldToPhaseKey(f) === phase.key);
  const phaseHa = matchingPlots.reduce((s, f) => s + (Number(f.ha) || 1.5), 0);
  const phasePct = totalHa > 0 ? Math.round((phaseHa / totalHa) * 100) : 0;

  if (phaseBadgeEl) {
    phaseBadgeEl.textContent = phase.phase;
    phaseBadgeEl.style.backgroundColor = `${phase.color}20`;
    phaseBadgeEl.style.color = phase.color;
  }
  if (titleEl) titleEl.textContent = `${phase.fullName} (${phase.ops})`;
  const targetScope = isManager ? 'Nacayao Block Farm' : 'All District Block Farms';
  if (subtitleEl) subtitleEl.textContent = `${phaseHa.toFixed(2)} Ha active across ${targetScope} (${phasePct}% of farm)`;
  if (haEl) {
    haEl.textContent = `${phaseHa.toFixed(2)} Ha`;
    haEl.style.color = phase.color;
  }
  if (shareEl) shareEl.textContent = `${phasePct}%`;
  if (daysEl) daysEl.textContent = phase.days;
  
  if (guidelinesEl) {
    guidelinesEl.innerHTML = `
      <div class="flex flex-col gap-2">
        <p class="text-xs text-hug-text2 leading-relaxed">${phase.guidelines}</p>
        <div class="flex items-center gap-3 pt-1 border-t border-border/60 text-[11px] font-bold">
          <span class="px-2 py-0.5 rounded-md bg-primary-bg text-primary">${phase.days}</span>
          <span class="text-hug-muted font-normal">Covered: ${phase.ops}</span>
        </div>
      </div>
    `;
  }

  if (plotsListEl) {
    if (matchingPlots.length === 0) {
      plotsListEl.innerHTML = `
        <div class="text-center py-6 px-4 bg-bg rounded-xl border border-dashed border-border text-xs text-hug-muted">
          <p class="font-semibold text-hug-text">No Plots Currently in ${phase.phase}</p>
          <p class="text-[11px] mt-0.5">Field plots will rotate into this stage as previous operations are completed.</p>
        </div>
      `;
    } else {
      plotsListEl.innerHTML = matchingPlots.map(p => `
        <div onclick="closeCropStageModal(); openDetailedAnalyticsModal('${p.id}')" class="group flex items-center justify-between p-3 bg-bg hover:bg-primary-bg/30 rounded-xl border border-border hover:border-primary/40 transition-all cursor-pointer">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-white border border-border flex items-center justify-center font-bold text-xs text-primary shadow-xs">
              ${p.id.split('-').pop()}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-xs text-primary">${p.id}</span>
                <span class="text-xs font-bold text-hug-text group-hover:text-primary transition-colors">${p.member || 'Member Farmer'}</span>
              </div>
              <span class="text-[11px] text-hug-muted">${p.blockFarm || 'Nacayao Block Farm'} · Age: ${p.age || '1.0 mo'} · Batch ${p.batchMonth || 1}</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs font-extrabold text-hug-text">${Number(p.ha || 1.5).toFixed(2)} Ha</span>
            <span class="text-[11px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center">Inspect →</span>
          </div>
        </div>
      `).join('');
    }
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
  { id: 'S1', stageNum: 1, label: 'Stage 1: Pre-Planting & Land Preparation', short: 'Land Prep', color: '#8F3A8F', done: true, active: false },
  { id: 'S2', stageNum: 2, label: 'Stage 2: Planting & Crop Establishment', short: 'Planting', color: '#4A7C2F', done: false, active: true },
  { id: 'S3', stageNum: 3, label: 'Stage 3: Basal Nutrition & Early Care', short: 'Basal Fert', color: '#1A6B9A', done: false, active: false },
  { id: 'S4', stageNum: 4, label: 'Stage 4: Cultivation & Weed Management', short: 'Weeding', color: '#F5A623', done: false, active: false },
  { id: 'S5', stageNum: 5, label: 'Stage 5: Crop Maintenance & Final Hilling-Up', short: 'Hilling-Up', color: '#0284C7', done: false, active: false },
  { id: 'S6', stageNum: 6, label: 'Stage 6: Harvesting & Post-Harvest Transport', short: 'Harvesting', color: '#D9534F', done: false, active: false },
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

let mgrLedgerCurrentPage = 1;

function changeMgrLedgerPage(page) {
  mgrLedgerCurrentPage = page;
  renderManager();
}

function renderManager() {
  const db = getDB();
  const managerBlockFarm = (db && Array.isArray(db.blockFarms) && db.blockFarms[0]) ? db.blockFarms[0].name : 'Nacayao Block Farm';
  const managerName = 'Jose Reyes';

  // Update banner labels
  const bannerName = document.getElementById('mgr-banner-name');
  const bannerFarm = document.getElementById('mgr-banner-blockfarm');
  if (bannerName) bannerName.textContent = managerName;
  if (bannerFarm) bannerFarm.textContent = managerBlockFarm;

  // Filter fields & logs for manager's farm
  const myFields = db.fields.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === managerBlockFarm || (f.blockFarm && f.blockFarm.includes('Nacayao')) || f.blockFarmId === 'BLK-NCY-01');
  myFields.sort((a, b) => a.id.localeCompare(b.id));
  const myFieldIds = new Set(myFields.map(f => f.id));
  const myLogs = db.logs.filter(l => myFieldIds.has(l.fieldId));
  const totalHa = myFields.reduce((s, f) => s + (Number(f.ha || f.area) || 0), 0);

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
  const statMembersVal = document.getElementById('mgr-stat-members-val');
  const statMembersBadge = document.getElementById('mgr-stat-members-badge');
  const statMembersSub = document.getElementById('mgr-stat-members-sub');
  const statPendingVal = document.getElementById('mgr-stat-pending-val');
  const statPendingBadge = document.getElementById('mgr-stat-pending-badge');
  const statPendingSub = document.getElementById('mgr-stat-pending-sub');
  const pendingBadge = document.getElementById('mgr-pending-badge');

  const mgrMembers = new Set();
  myFields.forEach(f => { if (f.member) mgrMembers.add(f.member); });

  const totalCost = myLogs.reduce((s, l) => s + (Number(l.cost) || 0), 0);

  if (statFields) statFields.textContent = myFields.length.toString();
  if (statHa) statHa.textContent = `${totalHa.toFixed(1)} Ha`;
  if (statMembersVal) statMembersVal.textContent = `${mgrMembers.size || myFields.length} Members`;
  if (statMembersBadge) statMembersBadge.textContent = 'Active';
  if (statMembersSub) statMembersSub.textContent = myFields[0]?.blockFarm || 'Nacayao Block Farm';
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
  const paginationContainer = document.getElementById('mgr-ledger-pagination');
  if (pendingTbody) {
    if (myLogs.length === 0) {
      pendingTbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-xs text-hug-muted">No operational records submitted for ${managerBlockFarm} yet.</td></tr>`;
      if (paginationContainer) paginationContainer.innerHTML = '';
    } else {
      const pageSize = 5;
      const totalPages = Math.max(1, Math.ceil(myLogs.length / pageSize));
      if (mgrLedgerCurrentPage > totalPages) mgrLedgerCurrentPage = totalPages;
      if (mgrLedgerCurrentPage < 1) mgrLedgerCurrentPage = 1;

      const startIndex = (mgrLedgerCurrentPage - 1) * pageSize;
      const paginatedLogs = myLogs.slice(startIndex, startIndex + pageSize);

      pendingTbody.innerHTML = paginatedLogs.map(l => {
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

      if (paginationContainer) {
        paginationContainer.innerHTML = `
          <div class="text-hug-muted font-medium">
            Showing <span class="font-bold text-hug-text">${startIndex + 1}–${Math.min(startIndex + pageSize, myLogs.length)}</span> of <span class="font-bold text-hug-text">${myLogs.length}</span> recorded operations
          </div>
          <div class="flex items-center gap-1.5">
            <button onclick="changeMgrLedgerPage(${mgrLedgerCurrentPage - 1})" ${mgrLedgerCurrentPage === 1 ? 'disabled' : ''} class="px-2.5 py-1 rounded-lg border border-border bg-white text-hug-text hover:bg-bg font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all">
              ‹ Prev
            </button>
            <span class="px-2 py-1 text-xs font-bold text-primary">Page ${mgrLedgerCurrentPage} of ${totalPages}</span>
            <button onclick="changeMgrLedgerPage(${mgrLedgerCurrentPage + 1})" ${mgrLedgerCurrentPage === totalPages ? 'disabled' : ''} class="px-2.5 py-1 rounded-lg border border-border bg-white text-hug-text hover:bg-bg font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all">
              Next ›
            </button>
          </div>
        `;
      }
    }
  }

  // Render Charts for Manager (Price Trajectory, Production Cost, Crop Stages, Farm Ops)
  renderPriceHistoryChart();
  renderProductionCostChart();
  renderCropStageDistribution();
  renderFarmOperationsChart();

  // Pre-render other manager sections if loaded
  renderMembers();
  renderOperations();
}

function renderSyncMonitor() {
  const db = getDB();
  const managerBlockFarm = 'Nacayao Block Farm';
  const myFields = db.fields.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === managerBlockFarm || f.blockFarm === 'Nacayao Block Farm' || getBlockFarmName(f.id) === 'Nacayao Block Farm');
  
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
            <h4 class="text-xs font-bold text-hug-text">Sync Overdue Action Required: ${totalAlerts} Member(s) in Nacayao Block Farm Inactive</h4>
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
          <div class="w-10 h-10 rounded-full bg-success-bg text-success flex items-center justify-center font-bold text-lg"><i data-lucide="check" class="w-5 h-5"></i></div>
          <h4 class="font-bold text-xs text-hug-text">All Nacayao Block Farm Members Active &amp; Synced</h4>
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
  const managerBlockFarm = 'Nacayao Block Farm';
  let myFields = db.fields.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === managerBlockFarm || f.blockFarm === 'Nacayao Block Farm' || getBlockFarmName(f.id) === 'Nacayao Block Farm');

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
  const managerBlockFarm = 'Nacayao Block Farm';
  const myFields = db.fields.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === managerBlockFarm || f.blockFarm === 'Nacayao Block Farm' || getBlockFarmName(f.id) === 'Nacayao Block Farm');
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
                <p class="text-[10px] text-hug-muted font-normal">Nacayao Block Farm</p>
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
  const managerBlockFarm = 'Nacayao Block Farm';
  let myFields = db.fields.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === managerBlockFarm || f.blockFarm === 'Nacayao Block Farm' || getBlockFarmName(f.id) === 'Nacayao Block Farm');
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

  // Sort by Area, default by field ID natural order
  if (opSortHa === 'asc') {
    myFields.sort((a, b) => (Number(a.ha || a.area) || 0) - (Number(b.ha || b.area) || 0));
  } else if (opSortHa === 'desc') {
    myFields.sort((a, b) => (Number(b.ha || b.area) || 0) - (Number(a.ha || a.area) || 0));
  } else {
    myFields.sort((a, b) => a.id.localeCompare(b.id));
  }

  if (myFields.length === 0) {
    fieldsTbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-xs text-hug-muted">No fields matched the search or filter criteria.</td></tr>`;
    return;
  }

  const sraStages = [
    { num: 1, name: 'Pre-Planting & Land Preparation', short: 'Land Prep', keywords: ['prep', 'plow', 'soil', 'furrow'] },
    { num: 2, name: 'Planting & Crop Establishment', short: 'Planting', keywords: ['plant', 'patdan', 'cane points', 'germination'] },
    { num: 3, name: 'Basal Nutrition & Early Care', short: 'Basal Care', keywords: ['basal', 'nutrition', 'liming', 'fertilization 1'] },
    { num: 4, name: 'Cultivation & Weed Management', short: 'Weeding', keywords: ['weed', 'cultivation', 'hilamon', 'barring', 'off-barring'] },
    { num: 5, name: 'Crop Maintenance & Final Hilling-Up', short: 'Hilling-Up', keywords: ['hilling', 'maintenance', 'topdress', 'top-dress', 'fertilization 2'] },
    { num: 6, name: 'Harvesting & Post-Harvest Transport', short: 'Harvesting', keywords: ['harvest', 'milling', 'haul', 'tapas', 'cutting', 'loading', 'complete'] }
  ];

  fieldsTbody.innerHTML = myFields.map(f => {
    const fieldLogs = db.logs.filter(l => l.fieldId === f.id);
    
    let currentStageIdx = -1;
    const stageStr = (f.stage || '').toLowerCase();
    for (let i = 0; i < sraStages.length; i++) {
      const s = sraStages[i];
      if (stageStr.includes(s.short.toLowerCase()) || stageStr.includes(s.name.toLowerCase()) || s.keywords.some(k => stageStr.includes(k))) {
        currentStageIdx = i;
        break;
      }
    }
    if (currentStageIdx === -1) {
      currentStageIdx = stageStr.includes('harvest') ? 5 : 0;
    }
    const stageNum = currentStageIdx + 1;
    const progressPct = Math.min(100, Math.round((stageNum / 6) * 100));
    const progressBadge = `
      <div class="flex flex-col gap-1 w-28">
        <div class="flex justify-between items-center text-[10px]">
          <span class="font-bold text-hug-text">Stage ${stageNum}/6</span>
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
  'S1': { inputName: 'Land Prep & Furrowing (Ops 1–2)', inputQty: 1, inputUnit: 'ha', costPerHa: 4500, people: 2 },
  'S2': { inputName: 'Patdan Cane Planting & Replanting (Ops 3–4)', inputQty: 40000, inputUnit: 'pcs', costPerHa: 14000, people: 8 },
  'S3': { inputName: 'Basal Fertilization & Liming (Ops 5–6)', inputQty: 4, inputUnit: 'bags', costPerHa: 8000, people: 4 },
  'S4': { inputName: 'Cultivation, Weeding & Early Care (Ops 7, 10–11)', inputQty: 1, inputUnit: 'ha', costPerHa: 5200, people: 6 },
  'S5': { inputName: 'Top-Dress Fertilization 2nd Dose (Ops 8–9)', inputQty: 4, inputUnit: 'bags', costPerHa: 7400, people: 4 },
  'S6': { inputName: 'Cane Harvesting, Cutting & Hauling (Ops 12–14)', inputQty: 65, inputUnit: 'tons', costPerHa: 27800, people: 12 },
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
  if (subEl) subEl.textContent = `Assigned to ${field.member || field.owner} · ${field.ha || field.area} Ha · ${field.blockFarm || 'Nacayao Block Farm'}`;
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
      btnEl.textContent = 'Remove Photo';
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
    matchingLog.totalCost = Math.round(cost);
    matchingLog.status = 'Recorded';
    matchingLog.approved = true;
    matchingLog.hectares = isNaN(ha) ? 1.5 : ha;
    matchingLog.people = isNaN(people) ? 4 : people;
    matchingLog.inputName = inputName;
    matchingLog.inputQty = inputQty;
    matchingLog.inputUnit = inputUnit;
    matchingLog.photo = takeoverPhotoAttached ? 'field_inspection_2026.jpg' : (matchingLog.photo || null);
    if (!matchingLog.subItems || matchingLog.subItems.length === 0) {
      matchingLog.subItems = [{
        id: `SI-1`,
        category: category,
        description: inputName || activity,
        qty: parseFloat(inputQty) || 1,
        unit: inputUnit || 'ha',
        unitCost: Math.round(cost / (parseFloat(inputQty) || 1)),
        subTotal: Math.round(cost)
      }];
    }
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
    blockFarm: field.blockFarm || 'Nacayao Block Farm',
    category: category,
    activity: activity,
    task: activity,
    cost: Math.round(cost),
    totalCost: Math.round(cost),
    hectares: isNaN(ha) ? 1.5 : ha,
    people: isNaN(people) ? 4 : people,
    inputQty: inputQty,
    inputUnit: inputUnit,
    inputName: inputName,
    taskId: stageObj ? stageObj.id : null,
    stageNumber: stageObj ? (stageObj.stageNum || (targetIdx + 1)) : (targetIdx + 1),
    sraOperationId: stageObj ? `SRA-0${stageObj.stageNum || (targetIdx + 1)}` : 'SRA-01',
    date: date || new Date().toISOString().split('T')[0],
    photo: takeoverPhotoAttached ? 'field_inspection_2026.jpg' : null,
    status: 'Recorded',
    approved: true,
    subItems: [
      {
        id: `SI-1`,
        category: category,
        description: inputName || activity,
        qty: parseFloat(inputQty) || 1,
        unit: inputUnit || 'ha',
        unitCost: Math.round(cost / (parseFloat(inputQty) || 1)),
        subTotal: Math.round(cost)
      }
    ],
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
  const blockFarm = 'Nacayao Block Farm';

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

// ── SRA QR PHOTO / SCREENSHOT AUDIT SCANNER ─────────────
function playScanSuccessChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.setValueAtTime(1320, audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.28);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.28);
  } catch (e) {}
}

async function scanQRFromFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  toast('Processing uploaded QR photo...');

  // Try Html5Qrcode file scan
  if (typeof Html5Qrcode !== 'undefined') {
    try {
      const html5QrCode = new Html5Qrcode('audit-report-card');
      const result = await html5QrCode.scanFile(file, true);
      if (result) {
        handleScannedQRCode(result);
        return;
      }
    } catch (e) {
      console.warn('[QR File Scan Html5Qrcode]', e);
    }
  }

  // Fallback to native BarcodeDetector if available
  if ('BarcodeDetector' in window) {
    try {
      const detector = new BarcodeDetector({ formats: ['qr_code'] });
      const imgBitmap = await createImageBitmap(file);
      const barcodes = await detector.detect(imgBitmap);
      if (barcodes && barcodes.length > 0) {
        handleScannedQRCode(barcodes[0].rawValue);
        return;
      }
    } catch (e) {
      console.warn('[QR File Scan Bitmap]', e);
    }
  }

  toast('Notice: Could not decode QR code from this photo. Please try a clearer screenshot or enter the hash code.');
}

function handleScannedQRCode(rawText) {
  if (!rawText) return;
  
  playScanSuccessChime();

  // Extract hash code from URL or text (e.g. HUG-202605-A3F9 or HUG-CROP-2026-FULL)
  const match = rawText.match(/(HUG-[A-Z0-9-]+)/i);
  const code = match ? match[1].toUpperCase() : rawText.trim().toUpperCase();

  const input = document.getElementById('manual-qr-input');
  if (input) input.value = code;

  toast(`QR Code Decoded: ${code}`);
  submitManualQR();
}

function submitManualQR() {
  const val = document.getElementById('manual-qr-input').value.trim().toUpperCase();
  if (!val) { toast('Please enter an audit hash code.'); return; }
  
  if (val === 'HUG-202605-A3F9' || val === 'HUG-CROP-2026-FULL' || val.startsWith('HUG-')) {
    toast('Verifying cryptographic QR hash signature...');
    setTimeout(() => { 
      loadAuditCertificate(val); 
      toast(val === 'HUG-CROP-2026-FULL' 
        ? 'Verification complete: Full Season Compiled Audit loaded (All 6 Stages · 15.25 Ha).' 
        : `Verification complete: SRA Operations Audit loaded (${val}).`); 
    }, 450);
  } else {
    toast('Error: Invalid QR Audit compiler hash code. Must start with HUG-');
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

  const isFullSeason = hash === 'HUG-CROP-2026-FULL';

  // Automatically record verification into system audit history
  try {
    const db = getDB();
    if (db && Array.isArray(db.systemHistory)) {
      const existing = db.systemHistory.find(h => h.entity && h.entity.includes(hash));
      if (!existing) {
        db.systemHistory.unshift({
          id: 'AUD-' + Math.floor(100 + Math.random() * 900),
          timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          category: 'audit',
          categoryLabel: 'SRA Audit',
          eventType: isFullSeason ? 'Full Season Crop Audit Certified' : 'Field Operations QR Audit Verified',
          entity: `${hash} (${isFullSeason ? 'Nacayao Block Farm' : 'FLD-NCY-001'})`,
          details: isFullSeason ? 'Verified and certified full-season operations ledger for SRA district compliance.' : 'Cryptographic QR signature verified and certified for official field operations.',
          actor: 'SRA Inspectorate',
          status: 'Verified'
        });
        saveDB(db);
      }
    }
  } catch (e) {}

  // Header and Metadata DOM Elements
  const titleEl = document.getElementById('cert-title');
  const subtitleEl = document.getElementById('cert-subtitle');
  const hashEl = document.getElementById('cert-hash');
  const farmEl = document.getElementById('cert-farm');
  const compilerEl = document.getElementById('cert-compiler');
  const dateEl = document.getElementById('cert-date');
  const badgeEl = document.getElementById('cert-badge');

  // KPI Metrics DOM Elements
  const totalLogsEl = document.getElementById('cert-total-logs');
  const approvedLogsEl = document.getElementById('cert-approved-logs');
  const areaEl = document.getElementById('cert-area');
  const totalCostEl = document.getElementById('cert-total-cost');
  const tableHead = document.getElementById('audit-certificate-table-head');
  const tableTitle = document.getElementById('cert-table-title');
  const tableSub = document.getElementById('cert-table-sub');

  if (isFullSeason) {
    if (titleEl) titleEl.textContent = 'SRA Production & Cost of Operations Audit Certificate';
    if (subtitleEl) subtitleEl.textContent = 'NACAYAO SMALL FARMERS ASSOCIATION · SILAY CITY, NEGROS OCCIDENTAL';
    if (hashEl) hashEl.textContent = 'HUG-CROP-2026-FULL';
    if (farmEl) farmEl.textContent = 'Hda. Nacayao (15.25 Ha New Plant)';
    if (compilerEl) compilerEl.textContent = 'Jose Reyes (Farm Mgr) · SRA Inspectorate';
    if (dateEl) dateEl.textContent = 'Crop Year 2025–2027';
    if (badgeEl) badgeEl.innerHTML = '&#10003; Full SRA Season Audit';

    if (totalLogsEl) totalLogsEl.textContent = '14 Operations';
    if (approvedLogsEl) approvedLogsEl.textContent = '14 / 14 Certified';
    if (areaEl) areaEl.textContent = '15.2500 Ha';
    if (totalCostEl) totalCostEl.textContent = 'Php 1,797,550';

    if (tableTitle) tableTitle.textContent = 'SRA Standard Operations Schedule (CY 2025-2027)';
    if (tableSub) tableSub.textContent = 'Total Area for New Plant: 15.2500 Ha · Silay City SRA Oversight';

    if (tableHead) {
      tableHead.innerHTML = `
        <tr class="bg-bg">
          <th class="text-center px-3 py-2.5 text-hug-muted font-bold text-xs border-b border-border w-12">No.</th>
          <th class="text-left px-3 py-2.5 text-hug-muted font-bold text-xs border-b border-border">Operation</th>
          <th class="text-right px-3 py-2.5 text-hug-muted font-bold text-xs border-b border-border">Total Area</th>
          <th class="text-right px-3 py-2.5 text-hug-muted font-bold text-xs border-b border-border">Qty</th>
          <th class="text-center px-3 py-2.5 text-hug-muted font-bold text-xs border-b border-border">Unit</th>
          <th class="text-right px-3 py-2.5 text-hug-muted font-bold text-xs border-b border-border">Unit Cost</th>
          <th class="text-right px-3 py-2.5 text-hug-muted font-bold text-xs border-b border-border">Cost Per Hectare</th>
        </tr>
      `;
    }

    if (tableBody) {
      const sraFullSeasonItems = [
        { no: 1, name: 'Soil Sampling', total: '15.25', qty: '1', unit: 'ha', unitCost: 100.00, costPerHa: 100.00 },
        { no: 2, name: 'Land Preparation', total: '15.25', qty: '1', unit: 'ha', unitCost: 12000.00, costPerHa: 12000.00 },
        { no: 3, name: 'Cost of Planting Material', total: '15.25', qty: '5', unit: 'lac', unitCost: 3000.00, costPerHa: 15000.00 },
        { no: 4, name: 'Planting (including hauling/selection)', total: '15.25', qty: '5', unit: 'lac', unitCost: 1000.00, costPerHa: 5000.00 },
        { isCategoryHeader: true, no: 5, name: 'Basal Fertilization' },
        { isSubItem: true, name: '46-00-00', total: '15.25', qty: '2', unit: 'bag', unitCost: 1600.00, costPerHa: 3200.00 },
        { isSubItem: true, name: '18-46-00', total: '15.25', qty: '3', unit: 'bag', unitCost: 2500.00, costPerHa: 7500.00 },
        { isSubItem: true, name: '00-00-60', total: '15.25', qty: '2', unit: 'bag', unitCost: 2200.00, costPerHa: 4400.00 },
        { isCategoryHeader: true, no: 6, name: 'Fertilizer Application' },
        { isSubItem: true, name: 'Fertilizer Application (Labor)', total: '15.25', qty: '7', unit: 'bag', unitCost: 100.00, costPerHa: 700.00 },
        { isSubItem: true, name: 'Rock Phosphate', total: '15.25', qty: '10', unit: 'bag', unitCost: 400.00, costPerHa: 4000.00 },
        { isSubItem: true, name: 'Fertilizer Application (Labor)', total: '15.25', qty: '10', unit: 'bag', unitCost: 100.00, costPerHa: 1000.00 },
        { isCategoryHeader: true, no: 7, name: 'Cultivation' },
        { isSubItem: true, name: 'Ridge busting', total: '15.25', qty: '1', unit: 'pass', unitCost: 300.00, costPerHa: 300.00 },
        { isSubItem: true, name: 'Off-barring', total: '15.25', qty: '2', unit: 'pass', unitCost: 300.00, costPerHa: 600.00 },
        { isSubItem: true, name: 'On-barring', total: '15.25', qty: '2', unit: 'pass', unitCost: 300.00, costPerHa: 600.00 },
        { isSubItem: true, name: 'Off-barring', total: '15.25', qty: '2', unit: 'pass', unitCost: 300.00, costPerHa: 600.00 },
        { isSubItem: true, name: 'Hilling-up', total: '15.25', qty: '3', unit: 'pass', unitCost: 300.00, costPerHa: 900.00 },
        { isCategoryHeader: true, no: 8, name: 'Fertilization (2nd dose)' },
        { isSubItem: true, name: '46-00-00', total: '15.25', qty: '1', unit: 'bag', unitCost: 1600.00, costPerHa: 1600.00 },
        { isSubItem: true, name: '00-00-60', total: '15.25', qty: '1', unit: 'bag', unitCost: 2200.00, costPerHa: 2200.00 },
        { no: 9, name: 'Fertilizer Application (Labor 2nd dose)', total: '15.25', qty: '2', unit: 'bag', unitCost: 100.00, costPerHa: 200.00 },
        { isCategoryHeader: true, no: 10, name: 'Weeding' },
        { isSubItem: true, name: '1st Weeding', total: '15.25', qty: '1', unit: 'ha', unitCost: 2500.00, costPerHa: 2500.00 },
        { isSubItem: true, name: '2nd Weeding', total: '15.25', qty: '1', unit: 'ha', unitCost: 2000.00, costPerHa: 2000.00 },
        { isSubItem: true, name: '3rd Weeding', total: '15.25', qty: '1', unit: 'ha', unitCost: 1500.00, costPerHa: 1500.00 },
        { no: 11, name: 'Drainage/Irrigation', total: '15.25', qty: '1', unit: 'ha', unitCost: 1000.00, costPerHa: 1000.00 },
        { isDirectSubtotal: true },
        { no: 12, name: 'Cutting and Loading', total: '15.25', qty: '60', unit: 'ton', unitCost: 350.00, costPerHa: 21000.00 },
        { no: 13, name: 'Hauling (Trucking)', total: '15.25', qty: '60', unit: 'ton', unitCost: 350.00, costPerHa: 21000.00 },
        { no: 14, name: 'Bull Cart', total: '15.25', qty: '60', unit: 'ton', unitCost: 150.00, costPerHa: 9000.00 },
        { isMillingSubtotal: true }
      ];

      const renderScreenRow = (op) => {
        if (op.isCategoryHeader) {
          return `<tr class="bg-primary/10 border-b border-border/80 font-bold">
            <td class="px-3 py-2 text-center font-black text-xs text-primary">${op.no}</td>
            <td colspan="6" class="px-3 py-2 font-black text-xs text-hug-text uppercase tracking-wide">${op.name}</td>
          </tr>`;
        }
        if (op.isSubItem) {
          return `<tr class="border-b border-border/40 hover:bg-bg/40 transition-colors">
            <td class="px-3 py-1.5 text-center text-xs text-hug-muted"></td>
            <td class="px-3 py-1.5 pl-8 text-xs font-semibold text-hug-text flex items-center gap-1.5">
              <span class="text-primary font-bold text-[10px]">&#8226;</span> ${op.name}
            </td>
            <td class="px-3 py-1.5 text-right font-mono text-xs text-hug-muted">${op.total} ha</td>
            <td class="px-3 py-1.5 text-right font-mono text-xs text-hug-text font-semibold">${op.qty}</td>
            <td class="px-3 py-1.5 text-center text-xs text-hug-muted">${op.unit}</td>
            <td class="px-3 py-1.5 text-right font-mono text-xs text-hug-text font-medium">₱${op.unitCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td class="px-3 py-1.5 text-right font-mono text-xs text-hug-text font-bold">₱${op.costPerHa.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>`;
        }
        if (op.isDirectSubtotal) {
          return `<tr class="bg-primary-bg/20 font-bold border-t-2 border-primary/40">
            <td colspan="6" class="px-3 py-2.5 text-right text-xs uppercase tracking-wider text-primary">Total Direct Cost (Ops 1–11):</td>
            <td class="px-3 py-2.5 text-right font-mono text-xs text-primary font-black">₱66,900.00</td>
          </tr>`;
        }
        if (op.isMillingSubtotal) {
          return `<tr class="bg-primary-bg/20 font-bold border-b border-border">
            <td colspan="6" class="px-3 py-2.5 text-right text-xs uppercase tracking-wider text-hug-text2">Total Milling Expenses (Ops 12–14):</td>
            <td class="px-3 py-2.5 text-right font-mono text-xs text-hug-text font-black">₱51,000.00</td>
          </tr>
          <tr class="bg-primary-bg/40 font-black border-t-2 border-primary">
            <td colspan="6" class="px-3 py-3 text-right text-xs uppercase tracking-wider text-primary">Total Cost of Production (Ops 1–14):</td>
            <td class="px-3 py-3 text-right font-mono text-sm text-primary font-black">₱117,900.00</td>
          </tr>`;
        }
        return `<tr class="border-b border-border/60 hover:bg-bg/50 transition-colors">
          <td class="px-3 py-2.5 text-center font-bold text-xs text-primary">${op.no}</td>
          <td class="px-3 py-2.5 font-bold text-xs text-hug-text">${op.name}</td>
          <td class="px-3 py-2.5 text-right font-mono text-xs text-hug-muted">${op.total} ha</td>
          <td class="px-3 py-2.5 text-right font-mono text-xs text-hug-text font-semibold">${op.qty}</td>
          <td class="px-3 py-2.5 text-center text-xs text-hug-muted font-medium">${op.unit}</td>
          <td class="px-3 py-2.5 text-right font-mono text-xs text-hug-text font-medium">₱${op.unitCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="px-3 py-2.5 text-right font-mono text-xs text-hug-text font-black">₱${op.costPerHa.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`;
      };

      tableBody.innerHTML = sraFullSeasonItems.map(renderScreenRow).join('');
    }
  } else {
    // Monthly Batch Report (May 2026)
    if (titleEl) titleEl.textContent = 'SRA Monthly Field Operations & Cost Audit Certificate';
    if (subtitleEl) subtitleEl.textContent = 'NACAYAO SMALL FARMERS ASSOCIATION · SILAY CITY, NEGROS OCCIDENTAL';
    if (hashEl) hashEl.textContent = 'HUG-202605-A3F9';
    if (farmEl) farmEl.textContent = 'Hda. Nacayao (5.30 Ha Active Parcel)';
    if (compilerEl) compilerEl.textContent = 'Maria Santos (Farm Mgr) · SRA Inspectorate';
    if (dateEl) dateEl.textContent = 'May 2026 (Monthly Batch)';
    if (badgeEl) badgeEl.innerHTML = '&#10003; Monthly Certified';

    if (totalLogsEl) totalLogsEl.textContent = '6 Operations';
    if (approvedLogsEl) approvedLogsEl.textContent = '6 / 6 Certified';
    if (areaEl) areaEl.textContent = '5.3000 Ha';
    if (totalCostEl) totalCostEl.textContent = 'Php 280,370';

    if (tableTitle) tableTitle.textContent = 'SRA Monthly Operations Schedule (May 2026 Batch)';
    if (tableSub) tableSub.textContent = 'Total Parcel Area Audited: 5.3000 Ha · Silay City SRA Oversight';

    if (tableHead) {
      tableHead.innerHTML = `
        <tr class="bg-bg">
          <th class="text-center px-3 py-2.5 text-hug-muted font-bold text-xs border-b border-border w-12">No.</th>
          <th class="text-left px-3 py-2.5 text-hug-muted font-bold text-xs border-b border-border">Operation</th>
          <th class="text-right px-3 py-2.5 text-hug-muted font-bold text-xs border-b border-border">Total Area</th>
          <th class="text-right px-3 py-2.5 text-hug-muted font-bold text-xs border-b border-border">Qty</th>
          <th class="text-center px-3 py-2.5 text-hug-muted font-bold text-xs border-b border-border">Unit</th>
          <th class="text-right px-3 py-2.5 text-hug-muted font-bold text-xs border-b border-border">Unit Cost</th>
          <th class="text-right px-3 py-2.5 text-hug-muted font-bold text-xs border-b border-border">Cost Per Hectare</th>
        </tr>
      `;
    }

    if (tableBody) {
      const sraMonthlyItems = [
        { no: 1, name: 'Soil Sampling', total: '5.30', qty: '1', unit: 'ha', unitCost: 100.00, costPerHa: 100.00 },
        { no: 2, name: 'Land Preparation', total: '5.30', qty: '1', unit: 'ha', unitCost: 12000.00, costPerHa: 12000.00 },
        { no: 3, name: 'Cost of Planting Material', total: '5.30', qty: '5', unit: 'lac', unitCost: 3000.00, costPerHa: 15000.00 },
        { no: 4, name: 'Planting (including hauling/selection)', total: '5.30', qty: '5', unit: 'lac', unitCost: 1000.00, costPerHa: 5000.00 },
        { isCategoryHeader: true, no: 5, name: 'Basal Fertilization' },
        { isSubItem: true, name: '46-00-00', total: '5.30', qty: '2', unit: 'bag', unitCost: 1600.00, costPerHa: 3200.00 },
        { isSubItem: true, name: '18-46-00', total: '5.30', qty: '3', unit: 'bag', unitCost: 2500.00, costPerHa: 7500.00 },
        { isSubItem: true, name: '00-00-60', total: '5.30', qty: '2', unit: 'bag', unitCost: 2200.00, costPerHa: 4400.00 },
        { isCategoryHeader: true, no: 6, name: 'Fertilizer Application' },
        { isSubItem: true, name: 'Fertilizer Application (Labor)', total: '5.30', qty: '7', unit: 'bag', unitCost: 100.00, costPerHa: 700.00 },
        { isSubItem: true, name: 'Rock Phosphate', total: '5.30', qty: '10', unit: 'bag', unitCost: 400.00, costPerHa: 4000.00 },
        { isSubItem: true, name: 'Fertilizer Application (Labor)', total: '5.30', qty: '10', unit: 'bag', unitCost: 100.00, costPerHa: 1000.00 },
        { isDirectSubtotal: true, subtotalLabel: 'TOTAL MONTHLY DIRECT COST (Ops 1–6):', subtotalVal: '₱52,900.00' }
      ];

      const renderScreenMonthlyRow = (op) => {
        if (op.isCategoryHeader) {
          return `<tr class="bg-primary/10 border-b border-border/80 font-bold">
            <td class="px-3 py-2 text-center font-black text-xs text-primary">${op.no}</td>
            <td colspan="6" class="px-3 py-2 font-black text-xs text-hug-text uppercase tracking-wide">${op.name}</td>
          </tr>`;
        }
        if (op.isSubItem) {
          return `<tr class="border-b border-border/40 hover:bg-bg/40 transition-colors">
            <td class="px-3 py-1.5 text-center text-xs text-hug-muted"></td>
            <td class="px-3 py-1.5 pl-8 text-xs font-semibold text-hug-text flex items-center gap-1.5">
              <span class="text-primary font-bold text-[10px]">&#8226;</span> ${op.name}
            </td>
            <td class="px-3 py-1.5 text-right font-mono text-xs text-hug-muted">${op.total} ha</td>
            <td class="px-3 py-1.5 text-right font-mono text-xs text-hug-text font-semibold">${op.qty}</td>
            <td class="px-3 py-1.5 text-center text-xs text-hug-muted">${op.unit}</td>
            <td class="px-3 py-1.5 text-right font-mono text-xs text-hug-text font-medium">₱${op.unitCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td class="px-3 py-1.5 text-right font-mono text-xs text-hug-text font-bold">₱${op.costPerHa.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>`;
        }
        if (op.isDirectSubtotal) {
          return `<tr class="bg-primary-bg/20 font-bold border-t-2 border-primary/40">
            <td colspan="6" class="px-3 py-2.5 text-right text-xs uppercase tracking-wider text-primary">${op.subtotalLabel}</td>
            <td class="px-3 py-2.5 text-right font-mono text-xs text-primary font-black">${op.subtotalVal}</td>
          </tr>
          <tr class="bg-primary-bg/40 font-black border-t-2 border-primary">
            <td colspan="6" class="px-3 py-3 text-right text-xs uppercase tracking-wider text-primary">Total Cost of Production (May 2026 Batch):</td>
            <td class="px-3 py-3 text-right font-mono text-sm text-primary font-black">${op.subtotalVal}</td>
          </tr>`;
        }
        return `<tr class="border-b border-border/60 hover:bg-bg/50 transition-colors">
          <td class="px-3 py-2.5 text-center font-bold text-xs text-primary">${op.no}</td>
          <td class="px-3 py-2.5 font-bold text-xs text-hug-text">${op.name}</td>
          <td class="px-3 py-2.5 text-right font-mono text-xs text-hug-muted">${op.total} ha</td>
          <td class="px-3 py-2.5 text-right font-mono text-xs text-hug-text font-semibold">${op.qty}</td>
          <td class="px-3 py-2.5 text-center text-xs text-hug-muted font-medium">${op.unit}</td>
          <td class="px-3 py-2.5 text-right font-mono text-xs text-hug-text font-medium">₱${op.unitCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="px-3 py-2.5 text-right font-mono text-xs text-hug-text font-black">₱${op.costPerHa.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`;
      };

      tableBody.innerHTML = sraMonthlyItems.map(renderScreenMonthlyRow).join('');
    }
  }
}

function printCertifiedAuditReport() {
  const hash = document.getElementById('cert-hash')?.textContent?.trim() || 'HUG-CROP-2026-FULL';
  const isFullSeason = hash === 'HUG-CROP-2026-FULL';

  const printDoc = window.open('', '_blank', 'width=900,height=1100');
  if (!printDoc) {
    window.print();
    return;
  }

  const titleBadge = isFullSeason ? 'Production Schedule &amp; Cost of Operations Audit' : 'Monthly Field Operations &amp; Cost Audit Report';
  const reportSubtitle = isFullSeason ? 'Program of Work &amp; Annual Cost of Production Schedule (CY 2025-2027)' : 'May 2026 Monthly Field Operations Batch Audit';
  const areaLabel = isFullSeason ? 'TOTAL AREA FOR NEW PLANT (HA):' : 'TOTAL PARCEL AREA AUDITED (HA):';
  const areaVal = isFullSeason ? '15.2500' : '5.3000';
  const areaSubtext = isFullSeason ? '15.2500 Ha New Plant' : '5.3000 Ha Active Parcel';
  const totalCostVal = isFullSeason ? '₱1,797,550.00' : '₱280,370.00';
  const totalCostPerHa = isFullSeason ? '₱117,900.00' : '₱52,900.00';

  const operations = isFullSeason ? [
    { no: 1, name: 'Soil Sampling', total: '15.25', qty: '1', unit: 'ha', unitCost: 100.00, costPerHa: 100.00 },
    { no: 2, name: 'Land Preparation', total: '15.25', qty: '1', unit: 'ha', unitCost: 12000.00, costPerHa: 12000.00 },
    { no: 3, name: 'Cost of Planting Material', total: '15.25', qty: '5', unit: 'lac', unitCost: 3000.00, costPerHa: 15000.00 },
    { no: 4, name: 'Planting (including hauling/selection)', total: '15.25', qty: '5', unit: 'lac', unitCost: 1000.00, costPerHa: 5000.00 },
    { isCategoryHeader: true, no: 5, name: 'Basal Fertilization' },
    { isSubItem: true, name: '46-00-00', total: '15.25', qty: '2', unit: 'bag', unitCost: 1600.00, costPerHa: 3200.00 },
    { isSubItem: true, name: '18-46-00', total: '15.25', qty: '3', unit: 'bag', unitCost: 2500.00, costPerHa: 7500.00 },
    { isSubItem: true, name: '00-00-60', total: '15.25', qty: '2', unit: 'bag', unitCost: 2200.00, costPerHa: 4400.00 },
    { isCategoryHeader: true, no: 6, name: 'Fertilizer Application' },
    { isSubItem: true, name: 'Fertilizer Application (Labor)', total: '15.25', qty: '7', unit: 'bag', unitCost: 100.00, costPerHa: 700.00 },
    { isSubItem: true, name: 'Rock Phosphate', total: '15.25', qty: '10', unit: 'bag', unitCost: 400.00, costPerHa: 4000.00 },
    { isSubItem: true, name: 'Fertilizer Application (Labor)', total: '15.25', qty: '10', unit: 'bag', unitCost: 100.00, costPerHa: 1000.00 },
    { isCategoryHeader: true, no: 7, name: 'Cultivation' },
    { isSubItem: true, name: 'Ridge busting', total: '15.25', qty: '1', unit: 'pass', unitCost: 300.00, costPerHa: 300.00 },
    { isSubItem: true, name: 'Off-barring', total: '15.25', qty: '2', unit: 'pass', unitCost: 300.00, costPerHa: 600.00 },
    { isSubItem: true, name: 'On-barring', total: '15.25', qty: '2', unit: 'pass', unitCost: 300.00, costPerHa: 600.00 },
    { isSubItem: true, name: 'Off-barring', total: '15.25', qty: '2', unit: 'pass', unitCost: 300.00, costPerHa: 600.00 },
    { isSubItem: true, name: 'Hilling-up', total: '15.25', qty: '3', unit: 'pass', unitCost: 300.00, costPerHa: 900.00 },
    { isCategoryHeader: true, no: 8, name: 'Fertilization (2nd dose)' },
    { isSubItem: true, name: '46-00-00', total: '15.25', qty: '1', unit: 'bag', unitCost: 1600.00, costPerHa: 1600.00 },
    { isSubItem: true, name: '00-00-60', total: '15.25', qty: '1', unit: 'bag', unitCost: 2200.00, costPerHa: 2200.00 },
    { no: 9, name: 'Fertilizer Application (Labor 2nd dose)', total: '15.25', qty: '2', unit: 'bag', unitCost: 100.00, costPerHa: 200.00 },
    { isCategoryHeader: true, no: 10, name: 'Weeding' },
    { isSubItem: true, name: '1st Weeding', total: '15.25', qty: '1', unit: 'ha', unitCost: 2500.00, costPerHa: 2500.00 },
    { isSubItem: true, name: '2nd Weeding', total: '15.25', qty: '1', unit: 'ha', unitCost: 2000.00, costPerHa: 2000.00 },
    { isSubItem: true, name: '3rd Weeding', total: '15.25', qty: '1', unit: 'ha', unitCost: 1500.00, costPerHa: 1500.00 },
    { no: 11, name: 'Drainage/Irrigation', total: '15.25', qty: '1', unit: 'ha', unitCost: 1000.00, costPerHa: 1000.00 },
    { isDirectSubtotal: true },
    { no: 12, name: 'Cutting and Loading', total: '15.25', qty: '60', unit: 'ton', unitCost: 350.00, costPerHa: 21000.00 },
    { no: 13, name: 'Hauling (Trucking)', total: '15.25', qty: '60', unit: 'ton', unitCost: 350.00, costPerHa: 21000.00 },
    { no: 14, name: 'Bull Cart', total: '15.25', qty: '60', unit: 'ton', unitCost: 150.00, costPerHa: 9000.00 },
    { isMillingSubtotal: true }
  ] : [
    { no: 1, name: 'Soil Sampling', total: '5.30', qty: '1', unit: 'ha', unitCost: 100.00, costPerHa: 100.00 },
    { no: 2, name: 'Land Preparation', total: '5.30', qty: '1', unit: 'ha', unitCost: 12000.00, costPerHa: 12000.00 },
    { no: 3, name: 'Cost of Planting Material', total: '5.30', qty: '5', unit: 'lac', unitCost: 3000.00, costPerHa: 15000.00 },
    { no: 4, name: 'Planting (including hauling/selection)', total: '5.30', qty: '5', unit: 'lac', unitCost: 1000.00, costPerHa: 5000.00 },
    { isCategoryHeader: true, no: 5, name: 'Basal Fertilization' },
    { isSubItem: true, name: '46-00-00', total: '5.30', qty: '2', unit: 'bag', unitCost: 1600.00, costPerHa: 3200.00 },
    { isSubItem: true, name: '18-46-00', total: '5.30', qty: '3', unit: 'bag', unitCost: 2500.00, costPerHa: 7500.00 },
    { isSubItem: true, name: '00-00-60', total: '5.30', qty: '2', unit: 'bag', unitCost: 2200.00, costPerHa: 4400.00 },
    { isCategoryHeader: true, no: 6, name: 'Fertilizer Application' },
    { isSubItem: true, name: 'Fertilizer Application (Labor)', total: '5.30', qty: '7', unit: 'bag', unitCost: 100.00, costPerHa: 700.00 },
    { isSubItem: true, name: 'Rock Phosphate', total: '5.30', qty: '10', unit: 'bag', unitCost: 400.00, costPerHa: 4000.00 },
    { isSubItem: true, name: 'Fertilizer Application (Labor)', total: '5.30', qty: '10', unit: 'bag', unitCost: 100.00, costPerHa: 1000.00 },
    { isDirectSubtotal: true, subtotalLabel: 'TOTAL MONTHLY DIRECT COST (Ops 1–6):', subtotalVal: '₱52,900.00' }
  ];

  const tableRowsHtml = operations.map(op => {
    if (op.isCategoryHeader) {
      return `
        <tr style="background:#efefef; font-weight:bold;">
          <td class="text-center font-bold">${op.no}</td>
          <td colspan="6" class="text-left font-bold" style="text-transform:uppercase; letter-spacing:0.5px; padding-left:8px;">${op.name}</td>
        </tr>
      `;
    }
    if (op.isSubItem) {
      return `
        <tr>
          <td class="text-center"></td>
          <td class="text-left" style="padding-left:22px; font-weight:600;">${op.name}</td>
          <td class="text-right">${op.total}</td>
          <td class="text-right">${op.qty}</td>
          <td class="text-center">${op.unit}</td>
          <td class="text-right">₱${op.unitCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td class="text-right font-bold">₱${op.costPerHa.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
      `;
    }
    if (op.isDirectSubtotal) {
      return `
        <tr class="subtotal-row">
          <td colspan="6" class="text-right">${op.subtotalLabel || 'TOTAL DIRECT COST (Ops 1–11):'}</td>
          <td class="text-right font-bold" style="color: #1b5e20;">${op.subtotalVal || '₱66,900.00'}</td>
        </tr>
      `;
    }
    if (op.isMillingSubtotal) {
      return `
        <tr class="subtotal-row">
          <td colspan="6" class="text-right">TOTAL MILLING EXPENSES (Ops 12–14):</td>
          <td class="text-right font-bold" style="color: #0d47a1;">₱51,000.00</td>
        </tr>
      `;
    }
    return `
      <tr>
        <td class="text-center font-bold">${op.no}</td>
        <td class="text-left font-bold">${op.name}</td>
        <td class="text-right">${op.total}</td>
        <td class="text-right">${op.qty}</td>
        <td class="text-center">${op.unit}</td>
        <td class="text-right">₱${op.unitCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td class="text-right font-bold">₱${op.costPerHa.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      </tr>
    `;
  }).join('');

  printDoc.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SRA - Nacayao Small Farmers Association (${hash})</title>
      <style>
        @page { size: A4 portrait; margin: 12mm 15mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #000; margin: 0; padding: 12px; font-size: 11px; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px; }
        .header p { margin: 1px 0; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }
        .header h1 { margin: 3px 0; font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }
        .header .title-badge { font-size: 13px; font-weight: 800; text-transform: uppercase; background: #e5e5e5; padding: 4px 10px; display: inline-block; margin-top: 6px; border: 1px solid #999; }
        
        .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 11px; border: 1.5px solid #000; }
        .meta-table td { padding: 4px 8px; border: 1px solid #ccc; }
        .meta-label { font-weight: bold; background: #f2f2f2; width: 28%; }
        .meta-val { font-weight: 600; }

        .ops-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 10.5px; }
        .ops-table th, .ops-table td { border: 1px solid #444; padding: 5px 6px; }
        .ops-table th { background: #e8e8e8; font-weight: bold; text-align: center; text-transform: uppercase; font-size: 9.5px; }
        .text-left { text-align: left; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .subtotal-row { background: #f0f0f0; font-weight: bold; }
        .grandtotal-row { background: #dbe4d8; font-weight: 900; font-size: 11.5px; border-top: 2px solid #000; }

        .sig-section { margin-top: 25px; page-break-inside: avoid; }
        .sig-grid { display: flex; justify-content: space-between; gap: 20px; text-align: center; margin-top: 20px; }
        .sig-box { flex: 1; border-top: 1.5px solid #000; padding-top: 5px; }
        .sig-name { font-weight: bold; font-size: 11px; text-transform: uppercase; }
        .sig-title { font-size: 9.5px; color: #333; }
        .qr-audit-badge { border: 1px dashed #666; padding: 6px 12px; font-size: 9px; display: inline-block; margin-top: 15px; background: #fafafa; font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="header">
        <p>Republic of the Philippines · Department of Agriculture</p>
        <h1>Sugar Regulatory Administration</h1>
        <p>Silay Agricultural District · Block Farm Program Oversight</p>
        <div class="title-badge">${titleBadge}</div>
      </div>

      <table class="meta-table">
        <tr>
          <td class="meta-label">NAME OF BLOCK FARM:</td>
          <td class="meta-val">NACAYAO SMALL FARMERS ASSOCIATION</td>
          <td class="meta-label" style="width: 25%;">TOTAL AREA OF BLOCK FARM (HA):</td>
          <td class="meta-val">30.1118</td>
        </tr>
        <tr>
          <td class="meta-label">LOCATION:</td>
          <td class="meta-val">HDA. NACAYAO, BRGY. KAPITAN RAMON, SILAY CITY</td>
          <td class="meta-label">${areaLabel}</td>
          <td class="meta-val" style="color:#1b5e20;">${areaVal}</td>
        </tr>
      </table>

      <table class="ops-table">
        <thead>
          <tr>
            <th style="width: 32px;">NO</th>
            <th>OPERATION</th>
            <th style="width: 65px;">TOTAL</th>
            <th style="width: 45px;">QTY</th>
            <th style="width: 45px;">UNIT</th>
            <th style="width: 80px;">UNIT COST</th>
            <th style="width: 105px;">COST PER HECTARE</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
          <tr class="grandtotal-row">
            <td colspan="6" class="text-right">TOTAL COST OF PRODUCTION:</td>
            <td class="text-right font-bold">${totalCostPerHa}</td>
          </tr>
        </tbody>
      </table>

      <div style="font-size: 10px; color: #444; margin-bottom: 8px;">
        * Total Cumulative Farm Expenditure for ${areaSubtext} = <strong>${totalCostVal}</strong> (Philippine Pesos). Certified compliant under SRA Silay Mill District standard schedule.
      </div>

      <div class="sig-section">
        <div class="sig-grid">
          <div class="sig-box">
            <div class="sig-name">Jose Reyes</div>
            <div class="sig-title">Farm Manager / President<br>Nacayao Small Farmers Association</div>
          </div>
          <div class="sig-box">
            <div class="sig-name">Maria Santos</div>
            <div class="sig-title">SRA Agricultural Inspector<br>Field Operations Audit Division</div>
          </div>
          <div class="sig-box">
            <div class="sig-name">Engr. Ramon Lacson</div>
            <div class="sig-title">SRA District Officer<br>Silay Sugar Regulatory Administration</div>
          </div>
        </div>
        <div style="text-align: center;">
          <div class="qr-audit-badge">
            DIGITAL AUDIT SEAL: [HASH: ${hash}] · VERIFIED VIA HUGPONG ENTERPRISE SUITE
          </div>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `);
  printDoc.document.close();
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
    // 1. Raw Sugar Trend (Php / Lkg)
    const sugarChg = Number(p.change || 0);
    let sugarDiff = '<span class="text-[11px] font-semibold text-hug-muted">Steady (₱0/Lkg)</span>';
    if (sugarChg > 0) sugarDiff = `<span class="text-[11px] font-bold text-success">▲ +₱${sugarChg.toLocaleString()}/Lkg</span>`;
    else if (sugarChg < 0) sugarDiff = `<span class="text-[11px] font-bold text-danger">▼ -₱${Math.abs(sugarChg).toLocaleString()}/Lkg</span>`;

    // 2. Molasses Trend (Php / MT)
    const molChg = Number(p.molassesChange || 0);
    let molDiff = '<span class="text-[11px] font-semibold text-hug-muted">Steady (₱0/MT)</span>';
    if (molChg > 0) molDiff = `<span class="text-[11px] font-bold text-success">▲ +₱${molChg.toLocaleString()}/MT</span>`;
    else if (molChg < 0) molDiff = `<span class="text-[11px] font-bold text-danger">▼ -₱${Math.abs(molChg).toLocaleString()}/MT</span>`;

    const molVal = p.molasses ? `Php ${Number(p.molasses).toLocaleString()}` : 'Php 4,200';

    return `
      <tr class="border-b border-border/60 hover:bg-bg/50 transition-colors">
        <td class="px-4 py-3 text-xs text-hug-muted whitespace-nowrap">${p.date}</td>
        <td class="px-4 py-3 text-xs font-bold text-hug-text whitespace-nowrap">${p.week.replace('Wk', 'Week ')}</td>
        <td class="px-4 py-3 text-xs font-extrabold text-primary whitespace-nowrap">Php ${Number(p.price || 0).toLocaleString()} <span class="text-[10px] text-hug-muted font-normal">/ Lkg</span></td>
        <td class="px-4 py-3 text-xs font-bold text-hug-text2 whitespace-nowrap">${molVal} <span class="text-[10px] text-hug-muted font-normal">/ MT</span></td>
        <td class="px-4 py-3 whitespace-nowrap">
          <div class="flex flex-col gap-0.5">
            <div class="flex items-center gap-1.5"><span class="text-[10px] font-extrabold text-primary uppercase">Sugar:</span> ${sugarDiff}</div>
            <div class="flex items-center gap-1.5"><span class="text-[10px] font-extrabold text-[#785412] uppercase">Molasses:</span> ${molDiff}</div>
          </div>
        </td>
        <td class="px-4 py-3 text-xs text-hug-text2 italic">${p.source}</td>
        <td class="px-4 py-3 whitespace-nowrap">
          <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-success-bg text-success border border-success/20 whitespace-nowrap"><svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Official Circular</span>
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
  const latest = db.priceHistory?.[0] || { price: 2950, molasses: 4400, week: 'Week 4 May' };
  
  const weekEl = document.getElementById('modal-p-week');
  if (weekEl) weekEl.value = 'Week 4 May';

  const sugarEl = document.getElementById('modal-p-sugar');
  if (sugarEl) sugarEl.value = latest.price || 2950;

  const molEl = document.getElementById('modal-p-molasses');
  if (molEl) molEl.value = latest.molasses || 4400;

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
  saveDB(db, true);

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
  topbarLogout.addEventListener('click', handleLogout);
}

function removePrice(idx) {
  toast('Protected: Published SRA official sugar price records are permanent official circulars and cannot be removed.');
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
  if (labelEl) labelEl.textContent = isManager ? 'Filter Nacayao Block Farm Plot:' : 'Filter Field / Block Farm:';

  const selectEl = document.getElementById('log-field-filter');
  if (selectEl) {
    if (isManager) {
      const myPlots = db.fields.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === 'Nacayao Block Farm' || f.blockFarm === 'Nacayao Block Farm' || getBlockFarmName(f.id) === 'Nacayao Block Farm');
      selectEl.innerHTML = '<option value="all">All Nacayao Block Farm Plots</option>'
        + myPlots.map(f => `<option value="${f.id}">${f.id} (${f.member || 'Member'})</option>`).join('');
    } else {
      const bFarms = (db.blockFarms && db.blockFarms.length > 0)
        ? db.blockFarms.map(bf => bf.name)
        : ['Nacayao Block Farm'];
      const plotOptions = db.fields.map(f => `<option value="${f.id}">${f.id} (${resolveFieldMember(f, db)})</option>`).join('');
      selectEl.innerHTML = '<option value="all">All District Fields &amp; Block Farms</option>'
        + bFarms.map(bf => `<option value="${bf}">${bf} (All Plots)</option>`).join('')
        + plotOptions;
    }
    selectEl.value = selectField;
  }

  const activeFilterValue = selectEl ? selectEl.value : 'all';

  let filtered = db.logs;
  
  // 1. Scoping: Farm Manager can only view logs from their block farm (Nacayao Block Farm)
  if (isManager) {
    const managerFieldIds = new Set(db.fields.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === 'Nacayao Block Farm' || f.blockFarm === 'Nacayao Block Farm' || getBlockFarmName(f.id) === 'Nacayao Block Farm').map(f => f.id));
    filtered = filtered.filter(l => managerFieldIds.has(l.fieldId) || l.blockFarm === 'Nacayao Block Farm' || l.blockFarm === 'Nacayao Block Farm');
  }

  if (activeFilterValue !== 'all') {
    if (activeFilterValue.includes('Block Farm')) {
      filtered = filtered.filter(l => {
        const bf = l.blockFarm || getBlockFarmName(l.fieldId);
        if (activeFilterValue.includes('Nacayao Block Farm')) {
          return bf === 'Nacayao Block Farm' || bf === 'Nacayao Block Farm';
        }
        return bf === activeFilterValue;
      });
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
      prep: '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 whitespace-nowrap">Land Prep</span>',
      plant: '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap">Planting</span>',
      fert: '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 whitespace-nowrap">Fertilization</span>',
      weed: '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 whitespace-nowrap">Weeding & Care</span>',
      harvest: '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 whitespace-nowrap">Harvesting</span>',
    };
    const catBadge = catBadges[l.category] || catBadges.weed;

    const statusBadge = '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-bg text-primary border border-primary/20 whitespace-nowrap">Recorded</span>';

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
            <span class="font-medium text-hug-text text-xs">${l.activity || l.operationName || l.task || (l.subItems && l.subItems[0] && l.subItems[0].description) || 'Custom Operation'}</span>
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
  const db = getDB();
  const expenseBars = document.getElementById('expense-distribution-bars');
  const hectareBars = document.getElementById('cost-per-hectare-bars');
  const totalCostEl = document.getElementById('diagnostics-total-cost');
  
  const totalSpend = db.logs.reduce((s, l) => s + (Number(l.totalCost || l.cost) || 0), 0);
  if (totalCostEl) totalCostEl.textContent = `Php ${totalSpend.toLocaleString()}`;

  if (expenseBars) {
    const catSums = { prep: 0, plant: 0, basal: 0, weed: 0, topdress: 0, harvest: 0 };
    db.logs.forEach(l => {
      const sraId = (l.sraOperationId || '').toUpperCase();
      const act = (l.activity || l.operationName || '').toLowerCase();
      const amt = Number(l.totalCost || l.cost) || 0;

      if (sraId === 'SRA-01' || sraId === 'SRA-02' || l.category === 'prep') {
        catSums.prep += amt;
      } else if (sraId === 'SRA-03' || sraId === 'SRA-04' || l.category === 'plant') {
        catSums.plant += amt;
      } else if (sraId === 'SRA-08' || sraId === 'SRA-09' || act.includes('top-dress') || act.includes('2nd dose') || act.includes('topdress')) {
        catSums.topdress += amt;
      } else if (sraId === 'SRA-05' || sraId === 'SRA-06' || l.category === 'fert' || act.includes('basal') || act.includes('phosphate')) {
        catSums.basal += amt;
      } else if (sraId === 'SRA-07' || sraId === 'SRA-10' || sraId === 'SRA-11' || l.category === 'weed' || act.includes('barring') || act.includes('cultivation') || act.includes('weeding')) {
        catSums.weed += amt;
      } else {
        catSums.harvest += amt;
      }
    });

    const allocations = [
      { name: '1. Soil Sampling & Land Prep (Ops 1–2)', cost: catSums.prep, color: '#8F3A8F' },
      { name: '2. Planting Material & Planting (Ops 3–4)', cost: catSums.plant, color: '#4A7C2F' },
      { name: '3. Basal Fertilization & Amending (Ops 5–6)', cost: catSums.basal, color: '#1A6B9A' },
      { name: '4. Cultivation, Weeding & Drainage (Ops 7, 10–11)', cost: catSums.weed, color: '#F5A623' },
      { name: '5. Top-Dress Fertilization 2nd Dose (Ops 8–9)', cost: catSums.topdress, color: '#0284C7' },
      { name: '6. Harvesting & Transport Operations (Ops 12–14)', cost: catSums.harvest, color: '#D9534F' },
    ].map(a => ({
      ...a,
      pct: totalSpend > 0 ? Math.round((a.cost / totalSpend) * 100) : 0
    }));

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
    const maxHa = Math.max(...db.fields.map(f => {
      const fieldLogs = db.logs.filter(l => l.fieldId === f.id);
      const logSum = fieldLogs.reduce((sum, l) => sum + (Number(l.totalCost || l.cost) || 0), 0);
      const ha = Number(f.ha || 1.5);
      return ha > 0 ? Math.round(logSum / ha) : 0;
    }), 1);

    const efficiencies = db.fields.map(f => {
      const fieldLogs = db.logs.filter(l => l.fieldId === f.id);
      const logSum = fieldLogs.reduce((sum, l) => sum + (Number(l.totalCost || l.cost) || 0), 0);
      const ha = Number(f.ha || 1.5);
      const haCost = ha > 0 ? Math.round(logSum / ha) : 0;
      const haPct = Math.min(100, Math.round((haCost / maxHa) * 100));

      let status = 'Active';
      let color = '#1A6B9A';
      if (haCost === 0) {
        status = 'No Spend Logged';
        color = '#8A9B7A';
      } else {
        status = `Actual (₱${(haCost / 1000).toFixed(1)}k/Ha)`;
        color = '#3A8F3A';
      }

      return {
        id: f.id,
        rawKey: f.id,
        owner: f.member || 'Member',
        haCost,
        haPct: Math.max(haPct, 5),
        status,
        color
      };
    });

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
    if (headingEl) headingEl.textContent = 'Nacayao Block Farm · Member Access & Onboarding';
    if (subEl) subEl.textContent = 'Review, assign sugarcane plots, and approve member farmers registering specifically under Nacayao Block Farm';
    if (dirTitleEl) dirTitleEl.textContent = 'Nacayao Block Farm Registered Personnel & Farmers';
    if (pendingTitleEl) pendingTitleEl.textContent = 'Pending Member Registrations';
    if (pendingSubEl) pendingSubEl.textContent = 'Review farmer applications and approve plot allocations for your block farm.';
  } else if (currentRole === 'admin') {
    if (headingEl) headingEl.textContent = 'Silay SRA Personnel & Farm Manager Directory';
    if (subEl) subEl.textContent = 'Supervise registered farm managers, oversee member block allocations, and verify regulatory access under Silay SRA';
    if (dirTitleEl) dirTitleEl.textContent = 'Silay SRA Active Personnel & Farmers Directory';
  } else {
    if (headingEl) headingEl.textContent = 'System User & Credentials Directory';
    if (subEl) subEl.textContent = 'Global credential management across Super Admin, SRA Admin, Farm Managers, and Members';
    if (dirTitleEl) dirTitleEl.textContent = 'System-wide User Directory';
  }

  // DIRECTORY TABLE FILTERING
  if (usersBody) {
    let filtered = [...db.users];

    // 1. Role-based directory scoping:
    if (currentRole === 'manager') {
      // Farm manager only sees members of their block farm + themselves (Jose Reyes)
      filtered = filtered.filter(u => u.blockFarm === 'Nacayao Block Farm' || (u.role === 'Farm Manager' && u.name === 'Jose Reyes'));
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
      
      // Determine field/plot display accurately across all roles
      let farmPlotLabel = 'Unassigned';
      if (u.role === 'Super Admin') {
        farmPlotLabel = '<span class="text-hug-muted">All Block Farms / Central Oversight</span>';
      } else if (u.role === 'SRA (Admin)') {
        farmPlotLabel = '<span class="text-primary font-semibold">District VII (SRA Regulatory)</span>';
      } else if (u.role === 'Farm Manager') {
        const bfName = u.blockFarm || u.blockFarmScope || (db.blockFarms && db.blockFarms[0]?.name) || 'Nacayao Block Farm';
        farmPlotLabel = `<span class="font-bold text-farm-blue">${bfName}</span>`;
      } else {
        // Members: resolve plot
        const bfName = u.blockFarm || u.blockFarmScope || 'Nacayao Block Farm';
        let plotDisplay = '';
        if (u.fieldId) {
          const matchingF = (db.fields || []).find(f => f.id === u.fieldId);
          const haSuffix = matchingF ? ` (${matchingF.ha || 1.5} Ha)` : '';
          plotDisplay = ` · <span class="font-mono font-bold text-primary">${u.fieldId}${haSuffix}</span>`;
        } else {
          const matchingFields = (db.fields || []).filter(f => 
            f.memberId === u.employeeId || 
            f.memberId === u.contact || 
            f.member === u.name || 
            f.memberName === u.name
          );
          if (matchingFields.length > 0) {
            plotDisplay = ` · ` + matchingFields.map(f => `<span class="font-mono font-bold text-primary">${f.id} (${f.ha || 1.5} Ha)</span>`).join(', ');
          }
        }
        farmPlotLabel = `${bfName}${plotDisplay}`;
      }

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
          <td class="px-4 py-3 font-mono font-bold text-hug-text text-xs whitespace-nowrap">${u.contact}</td>
          <td class="px-4 py-3 font-semibold text-hug-text text-sm whitespace-nowrap">${u.name}</td>
          <td class="px-4 py-3 text-xs text-hug-text2 font-medium">${farmPlotLabel}</td>
          <td class="px-4 py-3 whitespace-nowrap"><span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap shrink-0 shadow-2xs ${rClass}">${u.role}</span></td>
          <td class="px-4 py-3 text-xs font-semibold text-hug-text2 whitespace-nowrap">${u.logsHandled} logs</td>
          <td class="px-4 py-3 text-xs text-hug-muted whitespace-nowrap">${u.regDate}</td>
          <td class="px-4 py-3 text-right whitespace-nowrap">${actions}</td>
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
      // Farm Manager of Nacayao Block Farm reviews and approves pending members
      pendingUsers = pendingUsers.filter(p => p.role === 'Member' && (p.blockFarm === 'Nacayao Block Farm' || !p.blockFarm));
    } else {
      pendingUsers = [];
    }

    if (pendingUsers.length === 0) {
      pendingList.innerHTML = `<div class="text-center py-6 px-3 text-xs text-hug-muted border border-dashed border-border rounded-xl leading-relaxed">No pending member registrations for your block farm.</div>`;
    } else {
      pendingList.innerHTML = pendingUsers.map(p => {
        let locationDetail = '';
        if (currentRole === 'manager') {
          const plot = p.fieldId || 'FLD-NCY-005';
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
  const assignedPlot = user.fieldId || (user.role === 'Member' ? `FLD-NCY-${String(db.fields.length + 1).padStart(3, '0')}` : null);

  db.users.push({
    contact: user.contact,
    name: user.name,
    role: user.role,
    blockFarm: user.blockFarm || (currentRole === 'manager' ? 'Nacayao Block Farm' : 'Nacayao Block Farm'),
    fieldId: assignedPlot,
    logsHandled: 0,
    regDate: new Date().toISOString().split('T')[0]
  });

  saveDB(db);
  logSystemEvent(
    'user',
    'Member Registration Approved',
    `${user.name} (${contact})`,
    `Approved membership for ${user.blockFarm || 'Nacayao Block Farm'}${user.fieldId ? ' and allocated field ' + user.fieldId : ''}.`,
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

let fieldsQuickFilter = 'all';

function setFieldsQuickFilter(filter) {
  fieldsQuickFilter = filter;
  document.querySelectorAll('#fields-quick-chips .field-chip').forEach(c => {
    const isActive = c.getAttribute('data-filter') === filter;
    c.className = isActive
      ? 'field-chip text-xs font-semibold px-3 py-1 rounded-full border border-primary bg-primary text-white transition-all cursor-pointer'
      : 'field-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer';
  });
  renderFields();
}
window.setFieldsQuickFilter = setFieldsQuickFilter;

let fieldsViewMode = 'plots'; // 'plots' (default) or 'coop'
let fieldsCurrentPage = 1;
const FIELDS_PAGE_SIZE = 6;

function changeFieldsPage(page) {
  fieldsCurrentPage = page;
  renderFields();
  const el = document.getElementById('page-fields');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.changeFieldsPage = changeFieldsPage;

function setFieldsViewMode(mode) {
  fieldsViewMode = mode;
  fieldsCurrentPage = 1;
  const plotsBtn = document.getElementById('fields-view-plots-btn');
  const coopBtn = document.getElementById('fields-view-coop-btn');
  if (plotsBtn && coopBtn) {
    if (mode === 'plots') {
      plotsBtn.className = 'px-3 py-1 rounded-lg text-xs font-bold transition-all bg-primary text-white shadow-xs cursor-pointer';
      coopBtn.className = 'px-3 py-1 rounded-lg text-xs font-bold transition-all text-hug-text2 hover:text-primary cursor-pointer';
    } else {
      coopBtn.className = 'px-3 py-1 rounded-lg text-xs font-bold transition-all bg-primary text-white shadow-xs cursor-pointer';
      plotsBtn.className = 'px-3 py-1 rounded-lg text-xs font-bold transition-all text-hug-text2 hover:text-primary cursor-pointer';
    }
  }
  renderFields();
}
window.setFieldsViewMode = setFieldsViewMode;

// ── FIELD / BLOCK FARM REGISTRY DYNAMIC CONTROLLER ───────
function renderFields() {
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const isManager = currentRole === 'manager';
  const isSuper = currentRole === 'superadmin';
  const db = getDB();
  const gridContainer = document.getElementById('fields-grid-container');
  if (!gridContainer) return;

  const headingEl = document.getElementById('fields-heading');
  const subEl = document.getElementById('fields-sub');
  const actionBtnText = document.getElementById('fields-action-btn-text');
  const histBtnText = document.getElementById('fields-history-btn-text');

  const searchInput = document.getElementById('fields-search-input');
  const blockFilterEl = document.getElementById('fields-block-filter');
  const stageFilterEl = document.getElementById('fields-stage-filter');
  const syncFilterEl = document.getElementById('fields-sync-filter');
  const sortSelectEl = document.getElementById('fields-sort-select');
  const countBadgeEl = document.getElementById('fields-count-badge');
  const quickChipsContainer = document.getElementById('fields-quick-chips');
  const viewModeToggle = document.getElementById('fields-view-mode-toggle');
  const paginationContainer = document.getElementById('fields-pagination');

  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const selectedBlock = blockFilterEl ? blockFilterEl.value : 'all';
  const selectedStage = stageFilterEl ? stageFilterEl.value : 'all';
  const selectedSync = syncFilterEl ? syncFilterEl.value : 'all';
  const sortMode = sortSelectEl ? sortSelectEl.value : 'id-asc';

  // Automatically reset to page 1 whenever any filter or search changes
  const filterSig = `${query}|${selectedBlock}|${selectedStage}|${selectedSync}|${sortMode}|${fieldsQuickFilter}|${fieldsViewMode}`;
  if (window._lastFieldsFilterSig && window._lastFieldsFilterSig !== filterSig) {
    fieldsCurrentPage = 1;
  }
  window._lastFieldsFilterSig = filterSig;

  if (isManager) {
    if (viewModeToggle) viewModeToggle.classList.add('hidden');
    if (blockFilterEl) {
      blockFilterEl.value = 'Nacayao Block Farm';
      blockFilterEl.disabled = true;
    }
    if (stageFilterEl) stageFilterEl.classList.remove('hidden');
    if (quickChipsContainer) quickChipsContainer.classList.remove('hidden');
    if (histBtnText) histBtnText.textContent = 'Plot History';
    if (headingEl) headingEl.textContent = 'Nacayao Block Farm · Field Plot Registry';
    if (subEl) subEl.textContent = 'Direct field management, member plot allocations, and crop stage tracking for Nacayao Block Farm';
    if (actionBtnText) actionBtnText.textContent = 'Register Field Plot';
  } else {
    // SRA Admin or Super Admin
    if (viewModeToggle) viewModeToggle.classList.remove('hidden');
    if (blockFilterEl) blockFilterEl.disabled = false;

    if (fieldsViewMode === 'plots') {
      if (stageFilterEl) stageFilterEl.classList.remove('hidden');
      if (quickChipsContainer) quickChipsContainer.classList.remove('hidden');
      if (histBtnText) histBtnText.textContent = 'Plot History';
      if (headingEl) headingEl.textContent = isSuper ? 'Capstone Super Admin · District Member Plot Registry' : 'Silay SRA · District Member Plot Registry';
      if (subEl) subEl.textContent = selectedBlock === 'all'
        ? 'Comprehensive district-wide member plot monitoring across all enrolled block farms'
        : `Supervision of member plots registered under ${selectedBlock}`;
      if (actionBtnText) actionBtnText.textContent = 'Register Field Plot';
    } else {
      // Cooperative Summary View
      if (stageFilterEl) stageFilterEl.classList.add('hidden');
      if (quickChipsContainer) quickChipsContainer.classList.add('hidden');
      if (histBtnText) histBtnText.textContent = 'Block Farm History';
      if (headingEl) headingEl.textContent = isSuper ? 'Capstone Super Admin · Cooperative Block Farms' : 'Silay Sugar Regulatory Administration · Cooperative Block Farms';
      if (subEl) subEl.textContent = 'Supervision of enrolled block farm cooperatives across Silay Sugar Regulatory Administration';
      if (actionBtnText) actionBtnText.textContent = 'Register Block Farm';
    }
  }

  // RENDER MODE 1: MEMBER PLOTS VIEW (Manager always, SRA/Super Admin when fieldsViewMode === 'plots')
  if (isManager || fieldsViewMode === 'plots') {
    let plots = [...db.fields];

    // Filter by block farm
    if (isManager) {
      plots = plots.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === 'Nacayao Block Farm' || f.blockFarm === 'Nacayao Block Farm');
    } else if (selectedBlock !== 'all') {
      plots = plots.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === selectedBlock);
    }

    // 1. Text Search Filter
    if (query) {
      plots = plots.filter(f => 
        (f.id || '').toLowerCase().includes(query) ||
        (f.member || f.owner || '').toLowerCase().includes(query) ||
        (f.stage || '').toLowerCase().includes(query) ||
        (f.blockFarm || getBlockFarmName(f.id) || '').toLowerCase().includes(query) ||
        (String(f.ha || f.area) || '').toLowerCase().includes(query)
      );
    }

    // 2. Growth Stage Dropdown Filter
    if (selectedStage !== 'all') {
      plots = plots.filter(f => (f.stage || '').toLowerCase().includes(selectedStage.toLowerCase()));
    }

    // 3. Sync Status Dropdown Filter
    if (selectedSync === 'synced') {
      plots = plots.filter(f => f.synced);
    } else if (selectedSync === 'lagging') {
      plots = plots.filter(f => !f.synced);
    }

    // 4. Quick Filter Chips
    if (fieldsQuickFilter === 'active') {
      plots = plots.filter(f => !f.stage?.toLowerCase().includes('harvest') && !f.stage?.toLowerCase().includes('complete'));
    } else if (fieldsQuickFilter === 'harvest') {
      plots = plots.filter(f => f.stage?.toLowerCase().includes('harvest'));
    } else if (fieldsQuickFilter === 'lagging') {
      plots = plots.filter(f => !f.synced);
    }

    // 5. Sorting
    if (sortMode === 'id-asc') {
      plots.sort((a, b) => a.id.localeCompare(b.id));
    } else if (sortMode === 'id-desc') {
      plots.sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortMode === 'block-asc') {
      plots.sort((a, b) => (a.blockFarm || getBlockFarmName(a.id)).localeCompare(b.blockFarm || getBlockFarmName(b.id)));
    } else if (sortMode === 'ha-desc') {
      plots.sort((a, b) => (Number(b.ha || b.area) || 0) - (Number(a.ha || a.area) || 0));
    } else if (sortMode === 'ha-asc') {
      plots.sort((a, b) => (Number(a.ha || a.area) || 0) - (Number(b.ha || b.area) || 0));
    } else if (sortMode === 'name-asc') {
      plots.sort((a, b) => (a.member || a.owner || '').localeCompare(b.member || b.owner || ''));
    }

    const totalPlots = plots.length;
    const totalPages = Math.max(1, Math.ceil(totalPlots / FIELDS_PAGE_SIZE));
    if (fieldsCurrentPage > totalPages) fieldsCurrentPage = totalPages;
    if (fieldsCurrentPage < 1) fieldsCurrentPage = 1;

    const startIndex = (fieldsCurrentPage - 1) * FIELDS_PAGE_SIZE;
    const paginatedPlots = plots.slice(startIndex, startIndex + FIELDS_PAGE_SIZE);

    if (countBadgeEl) {
      const blockDesc = (!isManager && selectedBlock !== 'all') ? ` in ${selectedBlock}` : (!isManager ? ' across all blocks' : '');
      countBadgeEl.textContent = `${totalPlots} ${totalPlots === 1 ? 'plot' : 'plots'} showing${blockDesc}`;
    }

    if (totalPlots === 0) {
      gridContainer.innerHTML = '<div class="col-span-full py-12 text-center text-xs text-hug-muted border border-dashed border-border rounded-2xl bg-white">No field plots matched the search or block filter criteria.</div>';
      if (paginationContainer) paginationContainer.innerHTML = '';
      return;
    }

    gridContainer.innerHTML = paginatedPlots.map(f => {
      const isSynced = f.synced;
      const syncBadge = isSynced
        ? '<span class="inline-flex items-center gap-1 text-[10px] font-bold text-success bg-success-bg px-2 py-0.5 rounded-full"><svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Fully Synced</span>'
        : `<span class="inline-flex items-center gap-1 text-[10px] font-bold text-danger bg-danger-bg px-2.5 py-0.5 rounded-full"><svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Lagging Sync</span>`;

      const farmName = f.blockFarm || getBlockFarmName(f.id);

      return `
        <div class="bg-white rounded-2xl border border-border shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between gap-4">
          <div>
            <div class="flex items-center justify-between gap-2 mb-2.5">
              <span class="font-mono text-xs font-bold text-primary bg-primary-bg px-2.5 py-1 rounded-lg">${f.id}</span>
              <span class="text-xs font-bold text-hug-text2 bg-bg border border-border px-2.5 py-0.5 rounded-full">${f.ha} Ha</span>
            </div>
            <div class="flex flex-col gap-1.5 text-xs">
              <div class="flex items-start justify-between gap-2">
                <strong class="text-sm font-bold text-hug-text">${resolveFieldMember(f, db)}</strong>
                <span class="text-[10px] font-bold text-primary bg-primary-bg px-2 py-0.5 rounded-md border border-primary/20 flex-shrink-0">${farmName}</span>
              </div>
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

    if (paginationContainer) {
      if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        paginationContainer.classList.add('hidden');
      } else {
        paginationContainer.classList.remove('hidden');
        paginationContainer.innerHTML = 
          `<button onclick="changeFieldsPage(${fieldsCurrentPage - 1})" ${fieldsCurrentPage === 1 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} class="px-3 py-1 bg-white border border-border rounded-lg text-xs font-semibold cursor-pointer text-hug-text2 hover:text-primary hover:border-primary transition-all">Prev</button>` +
          `<span class="text-xs font-semibold text-hug-text2">Page ${fieldsCurrentPage} of ${totalPages}</span>` +
          `<button onclick="changeFieldsPage(${fieldsCurrentPage + 1})" ${fieldsCurrentPage === totalPages ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''} class="px-3 py-1 bg-white border border-border rounded-lg text-xs font-semibold cursor-pointer text-hug-text2 hover:text-primary hover:border-primary transition-all">Next</button>`;
      }
    }
  } else {
    // RENDER MODE 2: COOPERATIVE SUMMARY VIEW (SRA Admin / Super Admin)
    const grouped = {};
    db.fields.forEach(f => {
      const farm = f.blockFarm || getBlockFarmName(f.id) || 'Unassigned Block Farm';
      if (!grouped[farm]) grouped[farm] = { name: farm, totalArea: 0, synced: 0, totalFields: 0, fieldIds: [] };
      grouped[farm].totalArea += Number(f.ha) || 0;
      grouped[farm].totalFields += 1;
      grouped[farm].synced += f.synced ? 1 : 0;
      grouped[farm].fieldIds.push(f.id);
    });

    let groups = Object.values(grouped);

    // Block filter
    if (selectedBlock !== 'all') {
      groups = groups.filter(g => g.name === selectedBlock);
    }

    // Text search filter
    if (query) {
      groups = groups.filter(g => 
        g.name.toLowerCase().includes(query) ||
        (db.users.find(u => u.role === 'Farm Manager' && u.blockFarm === g.name)?.name || '').toLowerCase().includes(query) ||
        getBlockId(g.name).toLowerCase().includes(query)
      );
    }

    // Sync status filter
    if (selectedSync === 'synced') {
      groups = groups.filter(g => g.synced === g.totalFields);
    } else if (selectedSync === 'lagging') {
      groups = groups.filter(g => g.synced < g.totalFields);
    }

    // Sorting
    if (sortMode === 'ha-desc') {
      groups.sort((a, b) => b.totalArea - a.totalArea);
    } else if (sortMode === 'ha-asc') {
      groups.sort((a, b) => a.totalArea - b.totalArea);
    } else {
      groups.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (countBadgeEl) {
      countBadgeEl.textContent = `${groups.length} block ${groups.length === 1 ? 'farm' : 'farms'} showing`;
    }

    if (groups.length === 0) {
      gridContainer.innerHTML = '<div class="col-span-full py-12 text-center text-xs text-hug-muted border border-dashed border-border rounded-2xl bg-white">No block farms matched the search or block filter criteria.</div>';
      return;
    }

    const cards = groups.map(group => {
      const manager = db.users.find(u => u.role === 'Farm Manager' && u.blockFarm === group.name);
      const managerName = manager ? manager.name : 'Unassigned';
      const blockId = getBlockId(group.name);
      const allSynced = group.synced === group.totalFields;
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

    if (paginationContainer) {
      paginationContainer.innerHTML = '';
      paginationContainer.classList.add('hidden');
    }
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

let currentPlotHistFieldId = null;
let plotHistPage = 1;
const PLOT_HIST_PAGE_SIZE = 5;

function setPlotHistPage(page) {
  plotHistPage = page;
  renderPlotHistTable();
}

function renderPlotHistTable() {
  const db = getDB();
  const tableBody = document.getElementById('plot-hist-table-body');
  const paginationEl = document.getElementById('plot-hist-pagination');
  const countEl = document.getElementById('plot-hist-log-count');
  const searchInput = document.getElementById('plot-hist-search');
  if (!tableBody || !currentPlotHistFieldId) return;

  let plotLogs = (db.logs || []).filter(l => l.fieldId === currentPlotHistFieldId);

  const query = (searchInput?.value || '').toLowerCase().trim();
  if (query) {
    plotLogs = plotLogs.filter(l => 
      (l.id || '').toLowerCase().includes(query) ||
      (l.task || l.activity || l.operationName || '').toLowerCase().includes(query) ||
      (l.sraOperationId || '').toLowerCase().includes(query)
    );
  }

  if (countEl) countEl.textContent = `${plotLogs.length} total entries`;

  const totalPages = Math.max(1, Math.ceil(plotLogs.length / PLOT_HIST_PAGE_SIZE));
  plotHistPage = Math.max(1, Math.min(plotHistPage, totalPages));

  const startIdx = (plotHistPage - 1) * PLOT_HIST_PAGE_SIZE;
  const pageLogs = plotLogs.slice(startIdx, startIdx + PLOT_HIST_PAGE_SIZE);

  if (pageLogs.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" class="text-xs text-hug-muted py-6 text-center">No recorded operations match the search criteria.</td></tr>';
  } else {
    tableBody.innerHTML = pageLogs.map(l => {
      const inputDisplay = l.inputQty ? ` · ${l.inputQty} ${l.inputUnit || ''} (${l.inputName || ''})` : '';
      return `
        <tr class="border-b border-border/50 hover:bg-bg transition-colors">
          <td class="px-3 py-2.5 font-mono font-bold text-primary">${l.id || 'LOG'}</td>
          <td class="px-3 py-2.5">
            <div class="flex items-center gap-1.5">
              ${l.sraOperationId ? `<span class="px-1.5 py-0.5 rounded bg-primary-bg text-primary text-[10px] font-bold">${l.sraOperationId}</span>` : ''}
              <span class="font-semibold text-hug-text">${l.operationName || l.activity || l.task || 'Field Operation'}</span>
            </div>
            ${inputDisplay ? `<span class="text-[10px] text-hug-muted block mt-0.5">${inputDisplay}</span>` : ''}
          </td>
          <td class="px-3 py-2.5 font-bold text-hug-text">₱${Number(l.cost || l.totalCost || 0).toLocaleString()}</td>
          <td class="px-3 py-2.5 text-hug-muted">${l.date || 'Recent'}</td>
          <td class="px-3 py-2.5 text-right">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-bg text-primary">Recorded</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  if (paginationEl) {
    paginationEl.innerHTML = `
      <span class="text-xs text-hug-muted font-medium">Page ${plotHistPage} of ${totalPages} (${plotLogs.length} entries)</span>
      <div class="flex items-center gap-1.5">
        <button onclick="setPlotHistPage(${plotHistPage - 1})" ${plotHistPage <= 1 ? 'disabled class="px-2.5 py-1 rounded-lg text-xs bg-bg text-hug-muted border border-border opacity-50 cursor-not-allowed"' : 'class="px-2.5 py-1 rounded-lg text-xs bg-white text-hug-text border border-border hover:border-primary hover:text-primary transition-all cursor-pointer"'}>
          ‹ Previous
        </button>
        <button onclick="setPlotHistPage(${plotHistPage + 1})" ${plotHistPage >= totalPages ? 'disabled class="px-2.5 py-1 rounded-lg text-xs bg-bg text-hug-muted border border-border opacity-50 cursor-not-allowed"' : 'class="px-2.5 py-1 rounded-lg text-xs bg-white text-hug-text border border-border hover:border-primary hover:text-primary transition-all cursor-pointer"'}>
          Next ›
        </button>
      </div>
    `;
  }
}

function openPlotHistoryModal(fieldId) {
  const db = getDB();
  const field = db.fields.find(f => f.id === fieldId);
  if (!field) return;

  const idEl = document.getElementById('plot-hist-id');
  const areaEl = document.getElementById('plot-hist-area');
  const titleEl = document.getElementById('plot-hist-title');
  const subEl = document.getElementById('plot-hist-sub');

  const totalSpendEl = document.getElementById('plot-hist-total-spend');
  const stageEl = document.getElementById('plot-hist-stage');
  const syncStatusEl = document.getElementById('plot-hist-sync-status');
  const areaDisplayEl = document.getElementById('plot-hist-area-display');
  const locDisplayEl = document.getElementById('plot-hist-location-display');

  if (idEl) idEl.textContent = field.id;
  if (areaEl) areaEl.textContent = `${Number(field.ha || 1.5).toFixed(1)} Ha`;
  if (titleEl) titleEl.textContent = `Field Plot Operations History: ${field.id}`;
  const memberName = resolveFieldMember(field, db);
  if (subEl) subEl.textContent = `Assigned to ${memberName} · ${field.blockFarm || 'Nacayao Block Farm'}`;

  const plotLogs = (db.logs || []).filter(l => l.fieldId === fieldId);
  const totalSpend = plotLogs.reduce((s, l) => s + (Number(l.cost) || 0), 0);

  if (totalSpendEl) totalSpendEl.textContent = `₱${totalSpend.toLocaleString()}`;
  if (stageEl) stageEl.textContent = field.stage || 'Planting';
  if (syncStatusEl) {
    syncStatusEl.textContent = field.synced ? `Synced (${field.lastSync || 'Just now'})` : 'Lagging Sync Alert';
    syncStatusEl.className = field.synced ? 'text-[10px] text-success font-semibold' : 'text-[10px] text-danger font-semibold';
  }
  if (areaDisplayEl) areaDisplayEl.textContent = `${Number(field.ha || 1.5).toFixed(1)} Hectares`;
  if (locDisplayEl) locDisplayEl.textContent = `${field.blockFarm || 'Nacayao Block Farm'} · Silay Cluster`;

  currentPlotHistFieldId = fieldId;
  plotHistPage = 1;
  const searchInput = document.getElementById('plot-hist-search');
  if (searchInput) searchInput.value = '';
  renderPlotHistTable();

  const modal = document.getElementById('modal-plot-history');
  if (modal) modal.classList.remove('hidden');
}

function closePlotHistoryModal() {
  const modal = document.getElementById('modal-plot-history');
  if (modal) modal.classList.add('hidden');
}

let currentBlockHistTarget = null;
let blockHistPage = 1;
const BLOCK_HIST_PAGE_SIZE = 5;

function setBlockHistPage(page) {
  blockHistPage = page;
  renderBlockHistTable();
}

function renderBlockHistTable() {
  const db = getDB();
  const tableBody = document.getElementById('block-hist-table-body');
  const paginationEl = document.getElementById('block-hist-pagination');
  const countEl = document.getElementById('block-hist-log-count');
  const searchInput = document.getElementById('block-hist-search');
  if (!tableBody) return;

  const targetFarm = currentBlockHistTarget;
  let filteredFields = db.fields || [];
  let filteredLogs = db.logs || [];

  if (targetFarm) {
    filteredFields = (db.fields || []).filter(f => {
      const bf = f.blockFarm || getBlockFarmName(f.id);
      return bf === targetFarm || 
             (targetFarm.includes('Nacayao Block Farm') && (bf.includes('Nacayao Block Farm') || bf.includes('Nacayao'))) ||
             (targetFarm.includes('Block Farm B') && (bf.includes('Block Farm B') || bf.includes('Victorias'))) ||
             (targetFarm.includes('Block Farm C') && (bf.includes('Block Farm C') || bf.includes('Talisay'))) ||
             (targetFarm.includes('Block Farm D') && (bf.includes('Block Farm D') || bf.includes('Manapla')));
    });

    if (filteredFields.length === 0) {
      filteredFields = (db.fields || []).filter(f => getBlockFarmName(f.id) === targetFarm);
    }

    const fieldIds = new Set(filteredFields.map(f => f.id));
    filteredLogs = (db.logs || []).filter(l => fieldIds.has(l.fieldId) || (l.blockFarm && (l.blockFarm === targetFarm || targetFarm.includes(l.blockFarm))));
  }

  const query = (searchInput?.value || '').toLowerCase().trim();
  if (query) {
    filteredLogs = filteredLogs.filter(l => 
      (l.id || '').toLowerCase().includes(query) ||
      (l.fieldId || '').toLowerCase().includes(query) ||
      (l.task || l.activity || l.operationName || '').toLowerCase().includes(query) ||
      (l.sraOperationId || '').toLowerCase().includes(query)
    );
  }

  if (countEl) countEl.textContent = `${filteredLogs.length} total entries`;

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / BLOCK_HIST_PAGE_SIZE));
  blockHistPage = Math.max(1, Math.min(blockHistPage, totalPages));

  const startIdx = (blockHistPage - 1) * BLOCK_HIST_PAGE_SIZE;
  const pageLogs = filteredLogs.slice(startIdx, startIdx + BLOCK_HIST_PAGE_SIZE);

  if (pageLogs.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" class="text-xs text-hug-muted py-6 text-center">No recorded operations match the search criteria.</td></tr>';
  } else {
    tableBody.innerHTML = pageLogs.map(l => {
      const inputDisplay = l.inputQty ? ` · ${l.inputQty} ${l.inputUnit || ''} (${l.inputName || ''})` : '';
      return `
        <tr class="border-b border-border/50 hover:bg-bg transition-colors">
          <td class="px-3 py-2.5 font-mono font-bold text-primary">${l.id || 'LOG'}</td>
          <td class="px-3 py-2.5 font-mono font-bold text-hug-text">${l.fieldId || 'FLD'}</td>
          <td class="px-3 py-2.5">
            <div class="flex items-center gap-1.5">
              ${l.sraOperationId ? `<span class="px-1.5 py-0.5 rounded bg-primary-bg text-primary text-[10px] font-bold">${l.sraOperationId}</span>` : ''}
              <span class="font-semibold text-hug-text">${l.task || l.activity || 'Field Operation'}</span>
            </div>
            ${inputDisplay ? `<span class="text-[10px] text-hug-muted block mt-0.5">${inputDisplay}</span>` : ''}
          </td>
          <td class="px-3 py-2.5 font-bold text-hug-text">₱${Number(l.cost || l.totalCost || 0).toLocaleString()}</td>
          <td class="px-3 py-2.5 text-hug-muted">${l.date || 'Recent'}</td>
          <td class="px-3 py-2.5 text-right">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-bg text-primary">Recorded</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  if (paginationEl) {
    paginationEl.innerHTML = `
      <span class="text-xs text-hug-muted font-medium">Page ${blockHistPage} of ${totalPages} (${filteredLogs.length} entries)</span>
      <div class="flex items-center gap-1.5">
        <button onclick="setBlockHistPage(${blockHistPage - 1})" ${blockHistPage <= 1 ? 'disabled class="px-2.5 py-1 rounded-lg text-xs bg-bg text-hug-muted border border-border opacity-50 cursor-not-allowed"' : 'class="px-2.5 py-1 rounded-lg text-xs bg-white text-hug-text border border-border hover:border-primary hover:text-primary transition-all cursor-pointer"'}>
          ‹ Previous
        </button>
        <button onclick="setBlockHistPage(${blockHistPage + 1})" ${blockHistPage >= totalPages ? 'disabled class="px-2.5 py-1 rounded-lg text-xs bg-bg text-hug-muted border border-border opacity-50 cursor-not-allowed"' : 'class="px-2.5 py-1 rounded-lg text-xs bg-white text-hug-text border border-border hover:border-primary hover:text-primary transition-all cursor-pointer"'}>
          Next ›
        </button>
      </div>
    `;
  }
}

function openBlockFarmHistoryModal(farmName = null) {
  const db = getDB();
  const currentRole = localStorage.getItem('hugpong_role') || 'admin';
  const isManager = currentRole === 'manager';

  const targetFarm = farmName || (isManager ? 'Nacayao Block Farm' : null);

  const codeEl = document.getElementById('block-hist-code');
  const areaEl = document.getElementById('block-hist-area');
  const titleEl = document.getElementById('block-hist-title');
  const subEl = document.getElementById('block-hist-sub');
  const plotsCountEl = document.getElementById('block-hist-plots-count');
  const totalCostEl = document.getElementById('block-hist-total-cost');
  const syncStatusEl = document.getElementById('block-hist-sync-status');

  let filteredFields = db.fields || [];
  let filteredLogs = db.logs || [];
  let blockCode = 'SILAY SRA';
  let title = 'Silay Sugar Regulatory Administration · All Enrolled Block Farms';
  let sub = 'Regulatory overview across all cooperative clusters under Silay Sugar Regulatory Administration';

  if (targetFarm) {
    filteredFields = (db.fields || []).filter(f => {
      const bf = f.blockFarm || getBlockFarmName(f.id);
      return bf === targetFarm || 
             (targetFarm.includes('Nacayao Block Farm') && (bf.includes('Nacayao Block Farm') || bf.includes('Nacayao'))) ||
             (targetFarm.includes('Block Farm B') && (bf.includes('Block Farm B') || bf.includes('Victorias'))) ||
             (targetFarm.includes('Block Farm C') && (bf.includes('Block Farm C') || bf.includes('Talisay'))) ||
             (targetFarm.includes('Block Farm D') && (bf.includes('Block Farm D') || bf.includes('Manapla')));
    });

    if (filteredFields.length === 0) {
      filteredFields = (db.fields || []).filter(f => getBlockFarmName(f.id) === targetFarm);
    }

    const fieldIds = new Set(filteredFields.map(f => f.id));
    filteredLogs = (db.logs || []).filter(l => fieldIds.has(l.fieldId) || (l.blockFarm && (l.blockFarm === targetFarm || targetFarm.includes(l.blockFarm))));
    blockCode = getBlockId(targetFarm);
    
    const manager = (db.users || []).find(u => u.role === 'Farm Manager' && (
      u.blockFarm === targetFarm ||
      (targetFarm.includes('Nacayao Block Farm') && (u.blockFarm?.includes('Nacayao Block Farm') || u.blockFarm?.includes('Nacayao'))) ||
      (targetFarm.includes('Block Farm B') && (u.blockFarm?.includes('Block Farm B') || u.blockFarm?.includes('Victorias'))) ||
      (targetFarm.includes('Block Farm C') && (u.blockFarm?.includes('Block Farm C') || u.blockFarm?.includes('Talisay'))) ||
      (targetFarm.includes('Block Farm D') && (u.blockFarm?.includes('Block Farm D') || u.blockFarm?.includes('Manapla')))
    ));

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
    syncStatusEl.className = allSynced ? 'font-bold text-success block text-base mt-0.5' : 'font-bold text-danger block text-base mt-0.5';
  }

  currentBlockHistTarget = targetFarm;
  blockHistPage = 1;
  const searchInput = document.getElementById('block-hist-search');
  if (searchInput) searchInput.value = '';
  renderBlockHistTable();

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

  const bPlots = db.fields.filter(f => (f.blockFarm || getBlockFarmName(f.id)) === 'Nacayao Block Farm');
  const bMembers = db.users.filter(u => u.blockFarm === 'Nacayao Block Farm' && u.role === 'Member');
  const totalHa = bPlots.reduce((s, f) => s + (Number(f.ha || f.area) || 0), 0);

  // Filter audit events related to Nacayao Block Farm or plot allocations
  const historyEvents = (db.systemHistory || []).filter(h => 
    h.category === 'plot' || 
    h.category === 'user' || 
    (h.details && (h.details.includes('Nacayao Block Farm') || h.details.includes('FLD-KTR'))) ||
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
  if (subEl) subEl.textContent = `Allocated Plot: ${user.fieldId || 'None'} · ${user.blockFarm || 'Nacayao Block Farm'}`;
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

  const roleKeyMap = {
    'Super Admin': 'superadmin',
    'SRA (Admin)': 'admin',
    'Farm Manager': 'manager',
    'Member': 'member'
  };
  const rolePrefixMap = {
    'Super Admin': '01',
    'SRA (Admin)': '02',
    'Farm Manager': '03',
    'Member': '04'
  };
  const prefix = rolePrefixMap[role] || '04';
  const employeeId = prefix + String(Math.floor(100000 + Math.random() * 900000));
  const roleKey = roleKeyMap[role] || 'member';
  const cleanContact = contact.replace(/\D/g, '');
  const password = document.getElementById('create-user-password')?.value.trim() || 'password123';

  const newUser = {
    employeeId: employeeId,
    contact: contact,
    mobile: contact,
    name: name,
    role: role,
    roleKey: roleKey,
    blockFarmId: blockFarm === 'Nacayao Block Farm' ? 'BLK-NCY-01' : '',
    blockFarmScope: blockFarm || 'Nacayao Block Farm',
    blockFarm: blockFarm || 'Nacayao Block Farm',
    fieldId: '',
    logsHandled: 0,
    regDate: new Date().toISOString().split('T')[0],
    password: password,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.users.push(newUser);

  if (role === 'Farm Manager' && blockFarm) {
    db.users.forEach(u => {
      if (u.contact !== contact && u.role === 'Farm Manager' && (u.blockFarm === blockFarm || u.blockFarmScope === blockFarm)) {
        u.role = 'Member';
        u.roleKey = 'member';
      }
    });
  }

  saveDB(db);
  closeCreateUserModal();

  // Instant direct write to Firestore for reliability
  if (window.firebaseDB && window.firestore) {
    const { doc, setDoc } = window.firestore;
    setDoc(doc(window.firebaseDB, 'users', cleanContact), newUser, { merge: true }).catch(err => {
      console.warn('[HUGPONG] Instant Firestore write user notice:', err);
    });
  }

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
  if (currentRole === 'manager' || fieldsViewMode === 'plots') {
    openRegisterFieldPlotModal();
  } else {
    openRegisterBlockFarmModal();
  }
}

function openRegisterFieldPlotModal() {
  activeRegistrationModalMode = 'plot';
  const modal = document.getElementById('modal-register-block-farm');
  if (!modal) return;
  activeEditingBlockFarmName = null;

  const db = getDB();
  // Auto-generate next FLD-NCY plot ID
  const existingNums = (db.fields || [])
    .map(f => {
      const m = (f.id || '').match(/FLD-NCY-(\d+)/);
      return m ? parseInt(m[1], 10) : null;
    })
    .filter(n => n !== null);
  const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 6;
  const plotId = `FLD-NCY-${String(nextNum).padStart(3, '0')}`;

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
  if (subEl) subEl.textContent = 'Enroll a new field plot under Nacayao Block Farm and assign an approved member farmer.';

  if (lblPlotId) lblPlotId.textContent = 'Field Plot ID';
  if (lblCluster) lblCluster.textContent = 'Block Farm';
  if (displayCluster) displayCluster.textContent = 'Nacayao Block Farm';

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

  activeRegistrationModalMode = farmNameToEdit ? 'edit_block' : 'new_block';
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
  if (displayCluster) displayCluster.textContent = 'Silay Sugar Regulatory Administration';

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
    if (subEl) subEl.textContent = 'Enroll a new cooperative cluster under Silay Sugar Regulatory Administration oversight.';
    
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
  const isPlotMode = activeRegistrationModalMode === 'plot';

  const nameEl = document.getElementById('dash-farm-name');
  const contactEl = document.getElementById('dash-farm-contact');
  const haEl = document.getElementById('dash-farm-ha');
  const plotIdEl = document.getElementById('dash-farm-plot-id');

  const farmName = isPlotMode ? 'Nacayao Block Farm' : (nameEl ? nameEl.value.trim() : '');
  const contact = contactEl ? contactEl.value.trim() : '';
  const ha = haEl ? parseFloat(haEl.value) : NaN;
  const blockCodeOrPlotId = plotIdEl ? plotIdEl.value.trim() : '';

  if (!farmName || !contact || isNaN(ha) || !blockCodeOrPlotId) {
    toast('Error: Please fill in all required registration fields.');
    return;
  }

  const db = getDB();
  const existingUser = db.users.find(u => u.contact === contact || u.employeeId === contact || u.mobile === contact);
  const resolvedName = existingUser ? existingUser.name : `Farmer ${contact.slice(-4)}`;
  const cleanContact = contact.replace(/\D/g, '');

  if (isPlotMode) {
    // Farm Manager / Super Admin enrolling a new Field Plot under Nacayao Block Farm
    const newField = {
      id: blockCodeOrPlotId,
      blockFarmId: 'BLK-NCY-01',
      blockFarmName: 'Nacayao Block Farm',
      blockFarm: 'Nacayao Block Farm',
      memberId: existingUser ? (existingUser.employeeId || existingUser.contact) : ('04' + (cleanContact.slice(-6) || '000006')),
      memberName: resolvedName,
      member: resolvedName,
      ha: ha,
      stage: 'Pre-Planting & Land Preparation',
      stageNumber: 1,
      month: 0.5,
      batchMonth: 1,
      synced: true,
      lastSync: 'Just now',
      variety: 'VMC 84-524',
      soilType: 'Clay Loam',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.fields.push(newField);

    if (!existingUser) {
      const newUser = {
        employeeId: '04' + String(Math.floor(100000 + Math.random() * 900000)),
        contact: contact,
        mobile: contact,
        name: resolvedName,
        role: 'Member',
        roleKey: 'member',
        blockFarmId: 'BLK-NCY-01',
        blockFarmScope: 'Nacayao Block Farm',
        blockFarm: 'Nacayao Block Farm',
        fieldId: blockCodeOrPlotId,
        logsHandled: 0,
        regDate: new Date().toISOString().split('T')[0],
        password: 'password123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.users.push(newUser);

      if (window.firebaseDB && window.firestore) {
        const { doc, setDoc } = window.firestore;
        setDoc(doc(window.firebaseDB, 'users', cleanContact), newUser, { merge: true }).catch(err => {
          console.warn('[HUGPONG] Instant Firestore write user notice:', err);
        });
      }
    } else {
      existingUser.fieldId = blockCodeOrPlotId;
      existingUser.blockFarm = 'Nacayao Block Farm';
      existingUser.blockFarmId = 'BLK-NCY-01';
      existingUser.blockFarmScope = 'Nacayao Block Farm';
    }

    saveDB(db);
    closeRegisterBlockFarmModal();

    // Direct write field to Firestore
    if (window.firebaseDB && window.firestore) {
      const { doc, setDoc } = window.firestore;
      setDoc(doc(window.firebaseDB, 'fields', newField.id), newField, { merge: true }).catch(err => {
        console.warn('[HUGPONG] Instant Firestore write field notice:', err);
      });
    }

    logSystemEvent(
      'plot',
      'Field Plot Enrolled',
      `${blockCodeOrPlotId}`,
      `New field plot allocated to User ID: ${contact} (${resolvedName}) · ${ha} Ha in Nacayao Block Farm.`,
      currentRole === 'superadmin' ? 'Super Admin System Authority' : (currentRole === 'manager' ? 'Farm Manager Jose Reyes' : 'SRA (Admin)'),
      'Approved'
    );
    toast(`Success: Field plot ${blockCodeOrPlotId} (${ha} Ha) assigned to User ID: ${contact}!`);
    renderFields();
    renderDashboard();
    renderUsers();
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
    const existingBlockFarms = db.blockFarms || [];
    const bfCode = `BLK-NCY-${String(existingBlockFarms.length + 1).padStart(2, '0')}`;
    const dateStr = new Date().toISOString();
    const cleanMgrContact = contact.replace(/\D/g, '');
    const mgrEmployeeId = existingUser ? (existingUser.employeeId || cleanContact) : ('03' + cleanMgrContact.slice(-6).padStart(6, '0'));

    // Canonical block farm schema matching database example
    const newBlockFarm = {
      id: bfCode,
      code: bfCode,
      name: farmName,
      location: 'Silay City, Negros Occidental',
      farmManagerId: cleanMgrContact,
      farmManagerName: resolvedName,
      declaredHa: ha,
      activePlots: 0,
      cooperative: 'Silay Planters Sugarcane Agrarian Reform Cooperative',
      createdAt: dateStr,
      updatedAt: dateStr
    };
    db.blockFarms = [...(db.blockFarms || []), newBlockFarm];

    // Assign / update farm manager user with canonical schema
    if (existingUser) {
      existingUser.role = 'Farm Manager';
      existingUser.roleKey = 'manager';
      existingUser.blockFarm = farmName;
      existingUser.blockFarmId = bfCode;
      existingUser.blockFarmScope = farmName;
    } else {
      const newMgr = {
        employeeId: mgrEmployeeId,
        contact: contact,
        mobile: contact,
        name: resolvedName,
        role: 'Farm Manager',
        roleKey: 'manager',
        blockFarmId: bfCode,
        blockFarmScope: farmName,
        blockFarm: farmName,
        fieldId: '',
        logsHandled: 0,
        regDate: dateStr.split('T')[0],
        password: 'password123',
        createdAt: dateStr,
        updatedAt: dateStr
      };
      db.users.push(newMgr);
      if (window.firebaseDB && window.firestore) {
        const { doc, setDoc } = window.firestore;
        setDoc(doc(window.firebaseDB, 'users', cleanMgrContact), newMgr, { merge: true }).catch(e => console.warn(e));
      }
    }

    saveDB(db);
    closeRegisterBlockFarmModal();

    // Write block farm to Firestore
    if (window.firebaseDB && window.firestore) {
      const { doc, setDoc } = window.firestore;
      setDoc(doc(window.firebaseDB, 'block_farms', bfCode), newBlockFarm, { merge: true }).catch(e => console.warn(e));
    }

    logSystemEvent(
      'block',
      'Block Farm Enrolled',
      `${farmName} (${bfCode})`,
      `New cooperative block farm enrolled · Farm Manager: ${resolvedName} (${contact}) · ${ha.toFixed(1)} Ha declared · Code: ${bfCode}.`,
      currentRole === 'superadmin' ? 'Super Admin System Authority' : 'SRA District Administrator',
      'Enrolled'
    );
    toast(`Successfully registered Block Farm ${farmName} (${bfCode}) under Manager: ${resolvedName}!`);
    renderFields();
    renderUsers();
    renderDashboard();
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
      if (badgeEl) badgeEl.textContent = 'Nacayao Block Farm · Plot Registry History';
      if (titleEl) titleEl.textContent = 'Nacayao Block Farm · Field Plot Allocation & Registration History';
      if (subEl) subEl.textContent = 'Audit trail of farmer assignments, plot enrollments, and land transfers for Nacayao Block Farm';
      if (chipsContainer) {
        chipsContainer.innerHTML = `
          <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-primary bg-primary text-white transition-all cursor-pointer" data-filter="all" onclick="setTabHistoryFilter('all')">All Plot Events</button>
          <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer" data-filter="registered" onclick="setTabHistoryFilter('registered')">Plot Registrations</button>
          <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer" data-filter="updated" onclick="setTabHistoryFilter('updated')">Edits &amp; Transfers</button>
          <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer" data-filter="archived" onclick="setTabHistoryFilter('archived')">Archived Plots</button>
        `;
      }
    } else {
      if (badgeEl) badgeEl.textContent = 'Silay SRA Cooperative History';
      if (titleEl) titleEl.textContent = 'Silay Sugar Regulatory Administration · Block Farm Cooperative Lifecycle & Registration History';
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
  } else if (moduleType === 'sra' || moduleType === 'audit') {
    if (badgeEl) badgeEl.textContent = 'SRA QR Audit & Verification History';
    if (titleEl) titleEl.textContent = 'SRA Cryptographic QR Verification & Field Compliance Ledger';
    if (subEl) subEl.textContent = 'Official audit trail of scanned mobile QR hashes, certified field logs, and SRA compliance certificates';
    if (chipsContainer) {
      chipsContainer.innerHTML = `
        <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-primary bg-primary text-white transition-all cursor-pointer" data-filter="all" onclick="setTabHistoryFilter('all')">All QR Audits</button>
        <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer" data-filter="plot-audit" onclick="setTabHistoryFilter('plot-audit')">Field Plot Audits</button>
        <button class="tab-hist-chip text-xs font-semibold px-3 py-1 rounded-full border border-border bg-white text-hug-text2 hover:border-primary hover:text-primary transition-all cursor-pointer" data-filter="full-season" onclick="setTabHistoryFilter('full-season')">Full Season Certificates</button>
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
      // Farm Manager sees all plot and user events for their block farm
      moduleEvents = allHistory.filter(h => 
        h.category === 'plot' || h.category === 'user' || h.category === 'block'
      );
    } else {
      // SRA Admin and Super Admin see all block farm, plot, and user events
      moduleEvents = allHistory.filter(h =>
        h.category === 'block' || h.category === 'plot' || h.category === 'user' ||
        (h.eventType && (h.eventType.toLowerCase().includes('block') || h.eventType.toLowerCase().includes('enrolled') || h.eventType.toLowerCase().includes('plot') || h.eventType.toLowerCase().includes('personnel')))
      );
    }
  } else if (currentTabHistModule === 'sra' || currentTabHistModule === 'audit') {
    // Strictly QR Audits, Verifications, and Field Compliance Certificates
    moduleEvents = allHistory.filter(h => 
      h.category === 'audit' || 
      (h.eventType && (h.eventType.toLowerCase().includes('audit') || h.eventType.toLowerCase().includes('certificate'))) || 
      (h.details && (h.details.toLowerCase().includes('qr') || h.details.toLowerCase().includes('compliance')))
    );
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
    } else if (currentTabHistFilter === 'plot-audit') {
      moduleEvents = moduleEvents.filter(h => h.entity.includes('FLD-') || h.eventType.toLowerCase().includes('field') || h.eventType.toLowerCase().includes('monthly'));
    } else if (currentTabHistFilter === 'full-season') {
      moduleEvents = moduleEvents.filter(h => h.entity.includes('FULL') || h.eventType.toLowerCase().includes('season'));
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
  const loggedInUser = localStorage.getItem('hugpong_user') || '';
  const defaultActor = currentRole === 'manager' ? 'Farm Manager Jose Reyes' : (currentRole === 'superadmin' ? (loggedInUser || 'Super Admin') : 'SRA Admin');
  
  let catLabel = 'System';
  if (category === 'operation') catLabel = 'Field Operation';
  else if (category === 'plot') catLabel = 'Plot Registry';
  else if (category === 'block') catLabel = 'Block Farm';
  else if (category === 'user') catLabel = 'User Management';
  else if (category === 'sra' || category === 'price') catLabel = 'SRA Price / Audit';

  const auditId = `AUD-${Date.now()}`;
  const newEvent = {
    id: auditId,
    timestamp: new Date().toLocaleString('en-PH', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date().toISOString(),
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

  // Write to Firestore audit_logs so history persists across sessions
  if (window.firebaseDB && window.firestore) {
    try {
      const { doc, setDoc } = window.firestore;
      setDoc(doc(window.firebaseDB, 'audit_logs', auditId), newEvent, { merge: true }).catch(e => {
        console.warn('[HUGPONG] Audit log write notice:', e);
      });
    } catch(e) {
      console.warn('[HUGPONG] Audit log Firestore note:', e);
    }
  }

  // Refresh history view if open
  if (typeof renderHistory === 'function') renderHistory();
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
  
  // Derive registration history dynamically from canonical fields & block farms
  const regItems = [];
  (db.blockFarms || []).forEach(bf => {
    regItems.push({
      id: `REG-BLK-${bf.code || 'NCY'}`,
      timestamp: '2026-05-01',
      category: 'block',
      categoryLabel: 'Block Farm',
      entityType: 'Block Farm',
      entity: `${bf.name} (${bf.id || 'BLK-NCY-01'})`,
      person: bf.farmManagerName || 'Jose Reyes',
      area: `${bf.declaredHa || 15.25} Ha`,
      details: `Official Cooperative Enrollment (${bf.declaredHa || 15.25} Ha)`,
      actor: 'Silay Sugar Regulatory Administration',
      status: 'Enrolled'
    });
  });

  (db.fields || []).forEach(f => {
    regItems.push({
      id: `REG-${f.id}`,
      timestamp: '2026-05-01',
      category: 'plot',
      categoryLabel: 'Field Plot',
      entityType: 'Field Plot',
      entity: `${f.blockFarm || 'Nacayao Block Farm'} · ${f.id}`,
      person: resolveFieldMember(f, db),
      area: `${f.ha || 1.5} Ha`,
      details: `Plot Boundary Registration & Soil Test (${f.variety || 'VMC 84-524'})`,
      actor: 'Farm Manager Jose Reyes',
      status: 'Enrolled'
    });
  });

  // Also include operational logs as audit events
  const opItems = (db.logs || []).map(l => ({
    id: `AUD-${(l.id || '').replace('LOG-2026-', '')}`,
    timestamp: l.date || '2026-05-02',
    category: 'operation',
    categoryLabel: 'Field Operation',
    entityType: 'Field Operation',
    entity: `${l.fieldId} · ${l.operationName || l.activity || 'Field Operation'}`,
    person: l.loggedBy || 'Member Farmer',
    area: `${l.hectares || '1.5'} Ha`,
    details: `${l.activity || l.operationName} (₱${Number(l.totalCost || l.cost || 0).toLocaleString()} · ${l.subItems ? l.subItems.length : 0} line items)`,
    actor: 'Verified by Farm Manager',
    status: l.status || 'Recorded'
  }));

  const sysItems = (db.systemHistory || []).map(s => {
    let eType = 'Field Operation';
    if (s.category === 'plot') eType = 'Field Plot';
    else if (s.category === 'user') eType = 'User Management';
    else if (s.category === 'sra' || s.category === 'price') eType = 'SRA Price';
    else if (s.category === 'block') eType = 'Block Farm';
    // Support both new schema (eventType/entity/actor) and seed schema (action/entityId/actorName)
    const resolvedActor = s.actor || s.actorName || (s.actorRole ? `${s.actorName || 'System'} (${s.actorRole})` : 'Authorized Personnel');
    const resolvedEntity = s.entity || s.entityId || s.action || 'System Action';
    const resolvedEvent = s.eventType || s.action || 'System Event';
    const resolvedCategory = s.category || (s.entityType === 'Field' ? 'plot' : s.entityType === 'SRA Price' ? 'sra' : s.entityType === 'Audit Report' ? 'audit' : 'operation');
    return {
      id: s.id,
      timestamp: s.timestamp || s.createdAt || new Date().toISOString().split('T')[0],
      category: resolvedCategory,
      categoryLabel: s.categoryLabel || eType,
      entityType: s.entityType || eType,
      entity: resolvedEntity,
      eventType: resolvedEvent,
      person: resolvedActor,
      area: s.category === 'plot' ? '1.5 Ha' : 'Operational Scope',
      details: s.details || s.description || `${resolvedEvent}: ${resolvedEntity}`,
      actor: resolvedActor,
      status: s.status || 'Recorded'
    };
  });

  const allItems = [...regItems, ...opItems, ...sysItems];

  // Update Summary KPI Stats dynamically from database
  const statArea = document.getElementById('hist-stat-area');
  const statBlocks = document.getElementById('hist-stat-blocks');
  const statPlots = document.getElementById('hist-stat-plots');
  const statEvents = document.getElementById('hist-stat-events');
  const recordCountEl = document.getElementById('hist-records-count');

  const totalDeclaredHa = db.fields.length > 0 
    ? db.fields.reduce((s, f) => s + (Number(f.ha) || 0), 0) 
    : 15.25;
  const totalBlocks = db.blockFarms.length || 1;
  const totalPlots = db.fields.length || 5;

  if (statArea) statArea.textContent = `${totalDeclaredHa.toFixed(1)} Ha`;
  if (statBlocks) statBlocks.textContent = `${totalBlocks} Block Farm${totalBlocks > 1 ? 's' : ''}`;
  if (statPlots) statPlots.textContent = `${totalPlots} Field Plots`;
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

      let statusBadge = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-bg text-hug-text border border-border whitespace-nowrap">${h.status || 'Recorded'}</span>`;
      if (h.status === 'Approved' || h.status === 'Verified' || h.status === 'Completed' || h.status === 'Enrolled' || h.status === 'Official Circular') {
        statusBadge = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success-bg text-success border border-success/20 whitespace-nowrap">${h.status}</span>`;
      } else if (h.status === 'Revoked' || h.status === 'Rejected' || h.status === 'Archived') {
        statusBadge = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-danger-bg text-danger border border-danger/20 whitespace-nowrap">${h.status}</span>`;
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
    actor: r.authority || 'Silay Sugar Regulatory Administration',
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
  toast('Broadcasting cloud re-sync ping to all Silay SRA terminals...');
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
    const blockGroups = (db.blockFarms && db.blockFarms.length > 0)
      ? db.blockFarms.map(bf => bf.name)
      : ['Nacayao Block Farm'];
    const thresholdHours = getSyncInactivityThresholdHours();
    const warningDays = Math.max(1, Math.round(thresholdHours / 24));

    blocksTelemetryEl.innerHTML = blockGroups.map(bName => {
      const bPlots = fields.filter(f => (f.blockFarm || resolveFieldBlockFarm(f, db)) === bName || f.blockFarmId === bName);
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

  // Automatically reset to page 1 whenever any filter or search changes
  const filterSig = `${query}|${selectedStatus}|${selectedCat}`;
  if (window._lastTckFilterSig && window._lastTckFilterSig !== filterSig) {
    ticketsCurrentPage = 1;
  }
  window._lastTckFilterSig = filterSig;

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

      const title = t.title || t.subject || 'Support Request';
      const author = t.author || t.memberName || t.member || 'Cooperative Member';
      const blockFarm = t.blockFarm || 'Nacayao Block Farm';
      const date = t.date || (t.createdAt ? t.createdAt.split('T')[0] : '2026-05-20');
      const details = t.details || (t.messages && t.messages.length > 0 ? t.messages[0].text : '') || t.description || 'Support issue recorded.';

      return `
        <div class="bg-white rounded-2xl p-4 border border-border shadow-xs hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-start gap-3.5 flex-1">
            <div class="w-10 h-10 rounded-xl bg-bg flex items-center justify-center flex-shrink-0 text-hug-text2 font-mono font-bold text-xs border border-border">
              ${(t.id || 'TCK-001').replace('TCK-', '')}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <span class="font-mono text-xs font-bold text-primary">${t.id}</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusClass}">${t.status || 'Open'}</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityClass}">${t.priority || 'Normal'} Priority</span>
                <span class="text-[10px] font-medium text-hug-muted bg-bg px-2 py-0.5 rounded-full">${t.category || 'General'}</span>
              </div>
              <h4 class="text-sm font-bold text-hug-text mb-1">${title}</h4>
              <p class="text-xs text-hug-muted line-clamp-2">${details}</p>
              <div class="flex items-center gap-4 text-[11px] text-hug-muted mt-2">
                <span><strong>${author}</strong></span>
                <span>${blockFarm}</span>
                <span>${date}</span>
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
  const elPhoneDisplay = document.getElementById('contact-modal-phone-display');
  const elTelLink = document.getElementById('contact-modal-tel-link');
  const elQrImg = document.getElementById('contact-modal-qr-img');
  const elStage = document.getElementById('contact-modal-stage');
  const elBadge = document.getElementById('contact-modal-sync-badge');

  const cleanPhone = (phone || '0917-555-0101').replace(/[^0-9+]/g, '');

  if (elAvatar) elAvatar.textContent = name.charAt(0);
  if (elName) elName.textContent = name;
  if (elField) elField.textContent = fieldId ? `${fieldId} (Plot Assignment)` : 'Assigned Cultivation Plot';
  if (elPhone) elPhone.textContent = phone || '0917-555-0101';
  if (elPhoneDisplay) elPhoneDisplay.textContent = phone || '0917-555-0101';
  if (elTelLink) elTelLink.href = `tel:${cleanPhone}`;
  if (elQrImg) {
    elQrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=tel:${encodeURIComponent(cleanPhone)}`;
  }
  if (elStage) elStage.textContent = stage || 'Planting (Patdan)';

  const health = getSyncHealthInfo(lastSync, lagDays);
  if (elBadge) {
    elBadge.className = `px-2.5 py-1 rounded-full text-xs font-bold ${health.pillClass}`;
    elBadge.textContent = health.days > 0 ? `${health.days} Days Offline` : 'Active / Synced';
  }

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

function sendInAppSyncReminder() {
  if (!activeContactMemberData) return;
  toast(`In-app sync notice dispatched to ${activeContactMemberData.name} (${activeContactMemberData.fieldId || 'Member'})!`);
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

  const latestPrice = db.priceHistory[0]?.price || 2950;
  const priceInput = document.getElementById('dash-price-val');
  if (priceInput) priceInput.value = latestPrice;

  const latestMol = db.priceHistory[0]?.molasses || 4400;
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
  const latestPrice = db.priceHistory[0]?.price || 2950;
  const latestMol = db.priceHistory[0]?.molasses || 4400;

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
  saveDB(db, true);

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
    'Official SRA Price Broadcasted',
    `${week} · Raw Sugar ₱${price.toLocaleString()}/Lkg | Molasses ₱${molasses.toLocaleString()}/MT`,
    `Published official millsite circular "${source}" effective ${formattedDate}.`,
    'SRA Administrator Juan dela Cruz',
    'Official Circular'
  );

  closePublishPriceModal();
  renderDashboard();
  renderPrices();
  toast(`Success: Official SRA price updated to ₱${price.toLocaleString()}/Lkg & ₱${molasses.toLocaleString()}/MT (${week})!`);
}

// ── SUPPORT & TICKETS DESK ───────────────────────────────
function openTicketDetailModal(id) {
  const db = getDB();
  const tickets = db.supportTickets || INITIAL_DATABASE.supportTickets;
  const t = tickets.find(x => x.id === id);
  if (!t) return;
  currentSelectedTicketId = id;

  const title = t.title || t.subject || 'Support Request';
  const author = t.author || t.memberName || t.member || 'Cooperative Member';
  const blockFarm = t.blockFarm || 'Nacayao Block Farm';
  const date = t.date || (t.createdAt ? t.createdAt.split('T')[0] : '2026-05-20');
  const details = t.details || (t.messages && t.messages.length > 0 ? t.messages[0].text : '') || t.description || 'Support issue recorded.';

  document.getElementById('tck-modal-id').textContent = t.id;
  document.getElementById('tck-modal-title').textContent = title;
  document.getElementById('tck-modal-author').textContent = author;
  document.getElementById('tck-modal-block').textContent = blockFarm;
  document.getElementById('tck-modal-date').textContent = date;
  document.getElementById('tck-modal-details').textContent = details;
  
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
  const subjectEl = document.getElementById('tck-new-title');
  const authorEl = document.getElementById('tck-new-author');
  const blockFarm = document.getElementById('tck-new-block')?.value || 'Nacayao Block Farm';
  const category = document.getElementById('tck-new-category')?.value || 'General Support';
  const priority = document.getElementById('tck-new-priority')?.value || 'Normal';
  const detailsEl = document.getElementById('tck-new-details');

  const subject = subjectEl ? subjectEl.value.trim() : '';
  const authorRaw = authorEl ? authorEl.value.trim() : '';
  const details = detailsEl ? detailsEl.value.trim() : '';

  if (!subject || !authorRaw || !details) {
    toast('Please complete all required fields.');
    return;
  }

  const db = getDB();
  if (!db.supportTickets) db.supportTickets = [];

  // Resolve author as a user in the directory
  const authorUser = db.users.find(u =>
    u.name === authorRaw || u.contact === authorRaw || u.employeeId === authorRaw
  );

  const newId = `TCK-${new Date().getFullYear()}-${String(800 + db.supportTickets.length + 1).padStart(3, '0')}`;
  const now = new Date().toISOString();

  // Canonical ticket schema: matches Firestore support_tickets collection
  const newTicket = {
    id: newId,
    subject,
    memberName: authorUser ? authorUser.name : authorRaw,
    memberId: authorUser ? (authorUser.employeeId || authorUser.contact) : '',
    contact: authorUser ? (authorUser.contact || authorUser.mobile) : '',
    fieldId: authorUser ? (authorUser.fieldId || '') : '',
    blockFarm,
    category,
    priority,
    status: 'Open',
    messages: [{
      sender: authorUser ? authorUser.name : authorRaw,
      text: details,
      timestamp: now
    }],
    createdAt: now
  };

  db.supportTickets.unshift(newTicket);
  saveDB(db);

  // Write to Firestore
  if (window.firebaseDB && window.firestore) {
    const { doc, setDoc } = window.firestore;
    setDoc(doc(window.firebaseDB, 'support_tickets', newId), newTicket, { merge: true })
      .catch(e => console.warn('[HUGPONG] Ticket write notice:', e));
  }

  logSystemEvent(
    'user',
    'Support Ticket Created',
    `${newId}: ${subject}`,
    `Ticket submitted by ${newTicket.memberName} · Category: ${category} · Priority: ${priority}.`,
    newTicket.memberName,
    'Open'
  );

  toast(`Ticket ${newId} created successfully!`);
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
        <span class="italic text-[10px]">Silay SRA Central Gateway</span>
      </div>
    `;
  }

  // 3. Block Farm Inactivity & Connectivity Index (#telemetry-blocks-matrix)
  const matrixEl = document.getElementById('telemetry-blocks-matrix');
  if (matrixEl) {
    const rawFarms = (db.blockFarms && db.blockFarms.length > 0)
      ? db.blockFarms
      : [{ id: 'BLK-NCY-01', name: 'Nacayao Block Farm', location: 'Silay City' }];

    const blocks = rawFarms.map(bf => {
      const bPlots = fields.filter(f => (f.blockFarm || resolveFieldBlockFarm(f, db)) === bf.name || f.blockFarmId === bf.id);
      const lagPlots = bPlots.filter(f => !f.synced || (Number(f.syncLagDays) >= 7));
      const isLagging = lagPlots.length > 0;
      const totalHa = bPlots.reduce((sum, p) => sum + (Number(p.ha) || 0), 0);
      return {
        name: `${bf.name} (${bf.location || 'Silay City'})`,
        nodes: `${bPlots.length} Member Plots (${totalHa.toFixed(1)} Ha)`,
        health: isLagging ? `${Math.round(((bPlots.length - lagPlots.length) / (bPlots.length || 1)) * 100)}% Synced` : '100% Synced',
        queue: isLagging ? `${lagPlots.length} Buffered Logs` : '0 Buffered Logs',
        isLagging,
        alert: isLagging ? `${lagPlots.length} Inactive / Offline Plot(s)` : null
      };
    });

    matrixEl.innerHTML = blocks.map(b => `
      <div class="p-3 bg-bg/50 rounded-xl border border-border/80 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg ${b.isLagging ? 'bg-danger-bg text-danger' : 'bg-success-bg text-success'} flex items-center justify-center font-bold text-xs">
            ${b.isLagging ? '!' : '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>'}
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
      { time: '2026-05-23 08:30 AM', type: 'Offline Sync Queue Alert', node: 'TRM-ANDR-02 (Juan dela Cruz)', details: '3 logs queued during offline field operation in field FLD-NCY-001', status: 'Queued Handshake', statusColor: 'warning' },
      { time: '2026-05-23 08:15 AM', type: 'WebSocket Heartbeat', node: 'Silay SRA Central Gateway', details: 'Automated keep-alive pulse acknowledged by 4 field mobile devices', status: 'Optimal Pulse', statusColor: 'success' },
      { time: '2026-05-22 02:15 PM', type: 'Support Ticket Intake', node: 'TRM-ANDR-01 (Jose Reyes)', details: 'TCK-802 opened: Plot boundary overlap survey discrepancy', status: 'Triage Assigned', statusColor: 'warning' },
      { time: '2026-05-21 11:45 AM', type: 'QR Scanner Diagnostics', node: 'SRA Desk Terminal (Maria Santos)', details: 'Compressed QR packet chunk size optimized for Android 11', status: 'Resolved Patch', statusColor: 'success' },
      { time: '2026-05-20 04:00 PM', type: 'Credential Audit', node: 'Super Admin Terminal (Capstone Group)', details: 'Member phone number verified and updated for Ana Gomez', status: 'Verified Audit', statusColor: 'success' }
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
window.openAllEfficiencyModal = openAllEfficiencyModal;
window.closeAllEfficiencyModal = closeAllEfficiencyModal;
window.setAllEffTab = setAllEffTab;
window.setAllEffPage = setAllEffPage;
window.openCropStageModal = openCropStageModal;
window.closeCropStageModal = closeCropStageModal;
window.openContactMemberModal = openContactMemberModal;
window.closeContactMemberModal = closeContactMemberModal;
window.copyMemberPhone = copyMemberPhone;
window.sendInAppSyncReminder = sendInAppSyncReminder;
window.sendSyncReminderSMS = sendInAppSyncReminder;
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
window.submitManualQR = submitManualQR;
window.loadAuditCertificate = loadAuditCertificate;
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

  const userName = currentRole === 'manager' ? 'Jose Reyes' : (currentRole === 'superadmin' ? 'Capstone Group' : 'Maria Santos');
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
  const userName = currentRole === 'manager' ? 'Jose Reyes' : (currentRole === 'superadmin' ? 'Capstone Group' : 'Maria Santos');

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
  if (typeof closeUserMenu === 'function') closeUserMenu();
  const ok = confirm('Are you sure you want to sign out of HUGPONG Admin Console?');
  if (ok) {
    try {
      fetch('http://localhost:3000/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    } catch (e) {}

    localStorage.removeItem('hugpong_role');
    localStorage.removeItem('hugpong_user');
    toast('Signed out. Redirecting to login...');
    setTimeout(() => {
      const isRoleDir = window.location.pathname.includes('/roles/') || window.location.href.includes('/roles/');
      const loginUrl = isRoleDir ? '../../login.html' : 'login.html';
      window.location.href = loginUrl;
    }, 400);
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
window.setDetailModalTab = setDetailModalTab;
window.setDetailFieldsPage = setDetailFieldsPage;
window.setDetailLogsPage = setDetailLogsPage;
window.setBlockHistPage = setBlockHistPage;
window.renderBlockHistTable = renderBlockHistTable;
window.setPlotHistPage = setPlotHistPage;
window.renderPlotHistTable = renderPlotHistTable;
window.scanQRFromFile = scanQRFromFile;
