// ══════════════════════════════════════════════════════════════
// HUGPONG — Field Plot Registry API
// ══════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const { db } = require('../firebase-admin');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');

// ── GET /api/fields ──────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    let fields = [];
    if (db) {
      const snap = await db.collection('fields').get();
      if (!snap.empty) {
        snap.forEach(docSnap => fields.push({ id: docSnap.id, ...docSnap.data() }));
      }
    }
    return res.json({ success: true, count: fields.length, data: fields });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/fields (Managers & Admins) ──────────────────────
router.post('/', requireAuth, requireRole(['farm manager', 'super admin', 'admin']), async (req, res) => {
  const { id, memberId, memberName, member, blockFarmId, ha, stage, blockFarm, customStages } = req.body;

  const sessionUser = req.session ? req.session.user : null;
  const isManager = sessionUser && String(sessionUser.role || '').toLowerCase().includes('manager');
  const isSuperAdmin = sessionUser && String(sessionUser.role || '').toLowerCase().includes('super');
  const isSRAAdmin = sessionUser && (String(sessionUser.role || '').toLowerCase().includes('sra') || (String(sessionUser.role || '').toLowerCase().includes('admin') && !isManager));

  if (isManager && !isSuperAdmin && !isSRAAdmin) {
    const mgrFarm = (sessionUser.blockFarm || '').trim().toLowerCase();
    const reqFarm = (blockFarm || '').trim().toLowerCase();
    if (mgrFarm && reqFarm && mgrFarm !== reqFarm) {
      return res.status(403).json({
        success: false,
        error: `Permission Denied: Farm Managers are restricted to their assigned block farm (${sessionUser.blockFarm}).`
      });
    }
  }

  const assignedBlockFarm = (isManager && !isSuperAdmin && !isSRAAdmin && sessionUser?.blockFarm) 
    ? sessionUser.blockFarm 
    : (blockFarm || 'Nacayao Block Farm');

  const fieldPayload = {
    id,
    blockFarmId: blockFarmId || 'BLK-NCY-01',
    blockFarm: assignedBlockFarm,
    memberId: memberId || '04000001',
    memberName: memberName || member || 'Assigned Member',
    ha: Number(ha) || 1.5,
    stage: stage || 'Pre-Planting & Land Preparation',
    customStages: customStages || [],
    synced: true,
    lastSync: 'Just now',
    updatedAt: new Date().toISOString()
  };

  try {
    if (db) {
      await db.collection('fields').doc(id).set(fieldPayload, { merge: true });
    }
    console.log(`[HUGPONG Fields] Field Updated: ${id} (${fieldPayload.stage})`);
    return res.json({ success: true, data: fieldPayload });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
