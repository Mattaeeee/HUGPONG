// ══════════════════════════════════════════════════════════════
// HUGPONG — User Management API
// ══════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const { db } = require('../firebase-admin');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');

// ── GET /api/users ───────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    let users = [];
    if (db) {
      const snap = await db.collection('users').get();
      if (!snap.empty) {
        snap.forEach(docSnap => users.push({ id: docSnap.id, ...docSnap.data() }));
      }
    }
    return res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/users/approve (Super Admin & Managers) ────────
router.post('/approve', requireAuth, requireRole(['super admin', 'farm manager', 'admin']), async (req, res) => {
  const { contact, name, role, blockFarm, fieldId } = req.body;

  if (!contact) {
    return res.status(400).json({ success: false, error: 'User contact is required.' });
  }

  const cleanContact = contact.replace(/\D/g, '');
  const userPayload = {
    contact: cleanContact,
    name: name || 'Approved Member',
    role: role || 'Member',
    blockFarm: blockFarm || 'Nacayao Block Farm A',
    fieldId: fieldId || 'Unassigned',
    status: 'Active',
    approvedBy: req.session.user ? req.session.user.name : 'Administrator',
    approvedAt: new Date().toISOString()
  };

  try {
    if (db) {
      await db.collection('users').doc(cleanContact).set(userPayload, { merge: true });
    }
    console.log(`[HUGPONG Users] User Approved: ${userPayload.name} (${userPayload.role})`);
    return res.json({ success: true, data: userPayload });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
