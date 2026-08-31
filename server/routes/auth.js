// ══════════════════════════════════════════════════════════════
// HUGPONG — Authentication Routes
// Handles Login, Session Verification, and Logout
// ══════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();
const { db, hasServiceAccount } = require('../firebase-admin');

// Standard verified directory
const VERIFIED_DIRECTORY = [
  { contact: '09187654321', password: 'hugpong2026', name: 'Capstone Group', role: 'Super Admin', roleKey: 'superadmin', blockFarm: 'Central Governance' },
  { contact: '09194448888', password: 'admin123', name: 'Maria Santos', role: 'SRA (Admin)', roleKey: 'admin', blockFarm: 'Silay Sugar Regulatory Administration' },
  { contact: '09189876543', password: 'manager123', name: 'Jose Reyes', role: 'Farm Manager', roleKey: 'manager', blockFarm: 'Nacayao Block Farm A' },
  { contact: '09171234567', password: 'password123', name: 'Juan dela Cruz', role: 'Member', roleKey: 'member', blockFarm: 'Nacayao Block Farm A', fieldId: 'FLD-KTR-001' },
];

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

    // 1. Try querying Cloud Firestore if credentials are active
    if (db && hasServiceAccount) {
      try {
        const queryPromise = db.collection('users').get();
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 2000));
        const snapshot = await Promise.race([queryPromise, timeoutPromise]);
        
        if (snapshot && !snapshot.empty) {
          snapshot.forEach(docSnap => {
            const u = docSnap.data();
            if (normalizeContact(u.contact) === cleanContact) {
              matchedUser = { ...u, id: docSnap.id };
            }
          });
        }
      } catch (dbErr) {
        // Fallback gracefully
      }
    }

    // 2. Lookup in verified directory
    if (!matchedUser) {
      matchedUser = VERIFIED_DIRECTORY.find(u => u.contact === cleanContact);
    }

    if (!matchedUser) {
      return res.status(401).json({
        success: false,
        error: 'Account not found. Please check contact number or register.'
      });
    }

    // Validate password (supports universal master key 'hugpong2026' or user-specific password)
    const validPassword = matchedUser.password || 'hugpong2026';
    if (password !== validPassword && password !== 'hugpong2026') {
      return res.status(401).json({
        success: false,
        error: 'Invalid password. Please try again.'
      });
    }

    const roleKey = matchedUser.roleKey || getRoleKey(matchedUser.role);

    // Establish server-side session
    req.session.user = {
      contact: cleanContact,
      name: matchedUser.name || 'HUGPONG Operator',
      role: matchedUser.role || 'Member',
      roleKey: roleKey,
      blockFarm: matchedUser.blockFarm || 'Nacayao Block Farm A',
      fieldId: matchedUser.fieldId || '',
      authenticatedAt: new Date().toISOString()
    };

    console.log(`[HUGPONG Auth] User authenticated: ${req.session.user.name} (${req.session.user.role})`);

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
