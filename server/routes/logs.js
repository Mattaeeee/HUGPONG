// ══════════════════════════════════════════════════════════════
// HUGPONG — Operation Logs & Certification API
// ══════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const { db } = require('../firebase-admin');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');

// ── GET /api/logs ────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    let logs = [];
    if (db) {
      const snap = await db.collection('operation_logs').get();
      if (!snap.empty) {
        snap.forEach(docSnap => logs.push({ id: docSnap.id, ...docSnap.data() }));
      }
    }
    return res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/logs (Create/Submit Operation Log) ───────────
router.post('/', async (req, res) => {
  const logData = req.body;
  if (!logData || !logData.fieldId) {
    return res.status(400).json({ success: false, error: 'Field ID and log details are required.' });
  }

  const logId = logData.id || `LOG-${Date.now()}`;
  const logPayload = {
    ...logData,
    id: logId,
    status: logData.status || 'Recorded',
    createdAt: logData.createdAt || new Date().toISOString()
  };

  try {
    if (db) {
      await db.collection('operation_logs').doc(logId).set(logPayload, { merge: true });
    }
    console.log(`[HUGPONG Logs] Log Created: ${logId} for Field ${logPayload.fieldId}`);
    return res.json({ success: true, data: logPayload });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/logs/certify (Managers & SRA Admins) ───────────
router.post('/certify', requireAuth, requireRole(['farm manager', 'sra (admin)', 'super admin']), async (req, res) => {
  const { logId, status, notes } = req.body;

  if (!logId) {
    return res.status(400).json({ success: false, error: 'Log ID is required.' });
  }

  const certificationPayload = {
    status: status || 'Certified',
    certifiedBy: req.session.user ? req.session.user.name : 'Authorized Officer',
    certifiedAt: new Date().toISOString(),
    notes: notes || 'Verified and approved in operations review'
  };

  try {
    if (db) {
      await db.collection('operation_logs').doc(logId).set(certificationPayload, { merge: true });
    }
    console.log(`[HUGPONG Logs] Log Certified: ${logId} by ${certificationPayload.certifiedBy}`);
    return res.json({ success: true, logId, data: certificationPayload });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
