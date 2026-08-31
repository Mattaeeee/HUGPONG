// ══════════════════════════════════════════════════════════════
// HUGPONG Shared Firebase Project Configuration
// Project: hugpong-ff
// ══════════════════════════════════════════════════════════════

const HUGPONG_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDYkv9afZa2ZlhxLzIEZfk2b5wP_s2XXpI",
  authDomain: "hugpong-ff.firebaseapp.com",
  projectId: "hugpong-ff",
  storageBucket: "hugpong-ff.firebasestorage.app",
  messagingSenderId: "516809927909",
  appId: "1:516809927909:web:195ec4886bde93e811f80c"
};

// Expose globally for script-tag includes and export for ES modules
if (typeof window !== 'undefined') {
  window.HUGPONG_FIREBASE_CONFIG = HUGPONG_FIREBASE_CONFIG;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HUGPONG_FIREBASE_CONFIG };
}
