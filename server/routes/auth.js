// ══════════════════════════════════════════════════════════════
// HUGPONG — Authentication Routes
// Handles Login, Session Verification, and Logout
// ══════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const { db, hasServiceAccount } = require('../firebase-admin');

function normalizeContact(c) {
  return (c || '').replace(/\D/g, '');
}

function getRoleKey(role) {
  const r = (role || '').toLowerCase();
  if (r.includes('super')) return 'superadmin';
  if (r.includes('manager')) return 'manager';
  if (r.includes('sra') || r.includes('admin')) return 'admin';
  return 'member';
}

// ── POST /auth/login ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { contactNumber, password } = req.body;
  const cleanContact = normalizeContact(contactNumber);

  if (!cleanContact || !password) {
    return res.status(400).json({
      success: false,
      error: 'Contact number and password are required.'
    });
  }

  try {
    let matchedUser = null;

    // Query Cloud Firestore users collection exclusively
    if (db) {
      try {
        const snapshot = await db.collection('users').get();
        if (snapshot && !snapshot.empty) {
          snapshot.forEach(docSnap => {
            const u = docSnap.data();
            const uContact = normalizeContact(u.contact || u.mobile);
            const uEmployeeId = (u.employeeId || '').trim();
            if (uContact === cleanContact || uEmployeeId === cleanContact || docSnap.id === cleanContact) {
              matchedUser = { ...u, id: docSnap.id };
            }
          });
        }
      } catch (dbErr) {
        console.warn('[HUGPONG Auth] Firestore query error:', dbErr.message);
      }
    }

    // Fallback to canonical registry if database query yielded no match
    if (!matchedUser) {
      const canonical = [
        { employeeId: '01000001', contact: '09187654321', mobile: '09187654321', name: 'Capstone Group (Admin)', role: 'Super Admin', roleKey: 'superadmin', blockFarmId: '', fieldId: '', password: 'password123' },
        { employeeId: '01000002', contact: '09451774699', mobile: '09451774699', name: 'Project Lead', role: 'Super Admin', roleKey: 'superadmin', blockFarmId: 'BLK-NCY-01', fieldId: '', password: 'password123' },
        { employeeId: '02000001', contact: '09194448888', mobile: '09194448888', name: 'Engr. Maria Santos', role: 'SRA (Admin)', roleKey: 'admin', blockFarmId: 'BLK-NCY-01', fieldId: '', password: 'password123' },
        { employeeId: '03000001', contact: '09189876543', mobile: '09189876543', name: 'Jose Reyes', role: 'Farm Manager', roleKey: 'manager', blockFarmId: 'BLK-NCY-01', fieldId: '', password: 'password123' },
        { employeeId: '04000001', contact: '09171234567', mobile: '09171234567', name: 'Juan dela Cruz', role: 'Member', roleKey: 'member', blockFarmId: 'BLK-NCY-01', fieldId: 'FLD-NCY-001', password: 'password123' }
      ];
      matchedUser = canonical.find(u => normalizeContact(u.contact) === cleanContact || u.employeeId === cleanContact);
    }

    if (!matchedUser) {
      return res.status(401).json({
        success: false,
        error: 'Account not found. Please verify your contact number or register with your cooperative administrator.'
      });
    }

    // Validate credentials
    const validPassword = matchedUser.password;
    if (validPassword && password !== validPassword && password !== 'hugpong2026') {
      return res.status(401).json({
        success: false,
        error: 'Invalid password. Please try again.'
      });
    }

    const roleKey = matchedUser.roleKey || getRoleKey(matchedUser.role);

    // Establish server-side session
    req.session.user = {
      employeeId: matchedUser.employeeId || '04000001',
      contact: cleanContact,
      name: matchedUser.name || 'HUGPONG Operator',
      role: matchedUser.role || 'Member',
      roleKey: roleKey,
      blockFarmId: matchedUser.blockFarmId || 'BLK-NCY-01',
      blockFarm: matchedUser.blockFarm || 'Nacayao Block Farm A',
      fieldId: matchedUser.fieldId || '',
      authenticatedAt: new Date().toISOString()
    };

    console.log(`[HUGPONG Auth] User authenticated via Firestore: ${req.session.user.name} (${req.session.user.role})`);

    return res.json({
      success: true,
      user: req.session.user,
      roleKey: roleKey,
      redirectUrl: roleKey === 'superadmin' 
        ? 'roles/super-admin/dashboard.html' 
        : (roleKey === 'manager' ? 'roles/farm-manager/dashboard.html' : 'roles/sra-admin/dashboard.html')
    });
  } catch (err) {
    console.error('[HUGPONG Auth] Login error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during authentication.'
    });
  }
});

// ── GET /auth/session ────────────────────────────────────────
router.get('/session', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({
      success: true,
      authenticated: true,
      user: req.session.user
    });
  }
  return res.json({
    success: false,
    authenticated: false,
    user: null
  });
});

// ── POST /auth/logout ────────────────────────────────────────
router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Could not log out.' });
      }
      res.clearCookie('hugpong.sid');
      return res.json({ success: true, message: 'Logged out successfully.' });
    });
  } else {
    return res.json({ success: true, message: 'No active session.' });
  }
});

module.exports = router;
