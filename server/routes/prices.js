// ══════════════════════════════════════════════════════════════
// HUGPONG — SRA Sugar Price Management API
// ══════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const { db } = require('../firebase-admin');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');

// ── GET /api/prices ──────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    let prices = [];
    if (db) {
      const snap = await db.collection('sra_prices').get();
      if (!snap.empty) {
        snap.forEach(docSnap => prices.push({ id: docSnap.id, ...docSnap.data() }));
      }
    }
    prices.sort((a, b) => (b.timestamp || new Date(b.date || 0).getTime()) - (a.timestamp || new Date(a.date || 0).getTime()));
    return res.json({ success: true, count: prices.length, data: prices });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/prices (SRA Admin only) ────────────────────────
router.post('/', requireAuth, requireRole(['sra (admin)', 'admin', 'super admin']), async (req, res) => {
  const { price, change, molasses, molassesChange, week, month, date, source } = req.body;

  if (!price) {
    return res.status(400).json({ success: false, error: 'Price value is required.' });
  }

  const pricePayload = {
    price: Number(price),
    change: Number(change) || 0,
    molasses: Number(molasses) || 4300,
    molassesChange: Number(molassesChange) || 0,
    week: week || 'Current Circular',
    month: month || 'May',
    date: date || new Date().toISOString().split('T')[0],
    source: source || 'Official SRA Circular',
    publishedBy: req.session.user ? req.session.user.name : 'SRA Administrator',
    createdAt: new Date().toISOString(),
    timestamp: Date.now()
  };

  try {
    const pId = `PRC-${Date.now()}`;
    if (db) {
      await db.collection('sra_prices').doc(pId).set({ ...pricePayload, id: pId });
    }
    console.log(`[HUGPONG Prices] SRA Price Published: ₱${price}/Lkg by ${pricePayload.publishedBy}`);
    return res.json({ success: true, data: { id: pId, ...pricePayload } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
