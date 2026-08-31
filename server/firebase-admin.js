// ══════════════════════════════════════════════════════════════
// HUGPONG Backend — Firebase Admin SDK Initializer
// Project: hugpong-ff
// ══════════════════════════════════════════════════════════════

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
let isInitialized = false;
let hasServiceAccount = false;
let db = null;
let auth = null;

try {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id || 'hugpong-ff'
    });
    console.log('[HUGPONG Server] Firebase Admin initialized with serviceAccountKey.json');
    isInitialized = true;
    hasServiceAccount = true;
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp();
    console.log('[HUGPONG Server] Firebase Admin initialized with GOOGLE_APPLICATION_CREDENTIALS');
    isInitialized = true;
    hasServiceAccount = true;
  } else {
    // Standard mode for project hugpong-ff
    admin.initializeApp({
      projectId: 'hugpong-ff'
    });
    console.log('[HUGPONG Server] Firebase Admin initialized in standard mode for project: hugpong-ff');
    console.log('[HUGPONG Server] Tip: Drop serviceAccountKey.json into server/ for elevated Admin credentials');
    isInitialized = true;
    hasServiceAccount = false;
  }

  db = admin.firestore();
  auth = admin.auth();
} catch (error) {
  console.warn('[HUGPONG Server] Firebase Admin initialization note:', error.message);
  db = null;
  auth = null;
}

module.exports = {
  admin,
  db,
  auth,
  isInitialized,
  hasServiceAccount
};
