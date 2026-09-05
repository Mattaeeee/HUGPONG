// ══════════════════════════════════════════════════════════════
// HUGPONG — Super Admin Workspace & Governance Console
// Role: Super Admin (Capstone Group)
// ══════════════════════════════════════════════════════════════

console.log('[HUGPONG] Initializing Super Admin workspace...');

(async function verifyRoleAccess() {
  const currentRole = localStorage.getItem('hugpong_role');
  const userJson = localStorage.getItem('hugpong_user');
  let user = null;
  try { user = userJson ? JSON.parse(userJson) : null; } catch (e) {}

  // Verify against backend session if server is reachable
  try {
    const res = await fetch('http://localhost:3000/auth/session', { credentials: 'include' });
    const data = await res.json();
    if (data.authenticated && data.user) {
      user = data.user;
      localStorage.setItem('hugpong_user', JSON.stringify(user));
      localStorage.setItem('hugpong_role', user.roleKey || 'superadmin');
    } else if (!user) {
      window.location.replace('../../login.html');
      return;
    }
  } catch (e) {
    // Offline mode: verify local user profile exists
    if (!user) {
      window.location.replace('../../login.html');
      return;
    }
  }

  const roleLower = String(user?.roleKey || user?.role || currentRole || '').toLowerCase();
  if (!roleLower.includes('super')) {
    console.warn('[HUGPONG] Unauthorized access attempt to Super Admin console.');
    alert('Access Restricted: You do not have Super Admin permissions.');
    window.location.replace('../../login.html');
    return;
  }

  localStorage.setItem('hugpong_role', 'superadmin');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (typeof applyRoleLayout === 'function') applyRoleLayout('superadmin');
      if (typeof renderDashboard === 'function') renderDashboard();
    });
  } else {
    if (typeof applyRoleLayout === 'function') applyRoleLayout('superadmin');
    if (typeof renderDashboard === 'function') renderDashboard();
  }
})();
