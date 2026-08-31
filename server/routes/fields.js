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
  const { id, member, ha, stage, blockFarm, customStages } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, error: 'Field ID is required.' });
  }

  const fieldPayload = {
    id,
    member: member || 'Unassigned',
    ha: Number(ha) || 1.5,
    stage: stage || 'Pre-Planting & Land Preparation',
    blockFarm: blockFarm || 'Nacayao Block Farm A',
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
