// ══════════════════════════════════════════════════════════════
// HUGPONG — Canonical Block Farm Registry API
// ══════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const { db } = require('../firebase-admin');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');

// ── GET /api/block-farms ─────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    let blockFarms = [];
    if (db) {
      const snap = await db.collection('block_farms').get();
      if (!snap.empty) {
        snap.forEach(docSnap => blockFarms.push({ id: docSnap.id, ...docSnap.data() }));
      }
    }
    return res.json({ success: true, count: blockFarms.length, data: blockFarms });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/block-farms (SRA Admin / Super Admin) ──────────
router.post('/', requireAuth, requireRole(['sra (admin)', 'super admin', 'admin']), async (req, res) => {
  const { id, code, name, location, farmManagerId, declaredHa } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, error: 'Block farm name is required.' });
  }

  const blockFarmId = id || `BLK-${Date.now().toString(36).toUpperCase()}`;
  const payload = {
    id: blockFarmId,
    code: code || 'BLK-NEW',
    name,
    location: location || 'Silay City, Negros Occidental',
    farmManagerId: farmManagerId || '03000001',
    declaredHa: Number(declaredHa) || 15.25,
    activePlots: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    if (db) {
      await db.collection('block_farms').doc(blockFarmId).set(payload, { merge: true });
    }
    console.log(`[HUGPONG Block Farms] Block Farm Created: ${blockFarmId} (${name})`);
    return res.json({ success: true, data: payload });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
