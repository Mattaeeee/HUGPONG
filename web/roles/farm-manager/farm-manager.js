// ══════════════════════════════════════════════════════════════
// HUGPONG — Farm Manager Operations Workspace
// Role: Farm Manager (Jose Reyes · Nacayao Block Farm)
// ══════════════════════════════════════════════════════════════

console.log('[HUGPONG] Initializing Farm Manager workspace...');

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
      localStorage.setItem('hugpong_role', user.roleKey || 'manager');
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
  if (!roleLower.includes('manager') && !roleLower.includes('admin') && !roleLower.includes('super')) {
    console.warn('[HUGPONG] Unauthorized access attempt to Farm Manager workspace.');
    alert('Access Restricted: You do not have Farm Manager permissions.');
    window.location.replace('../../login.html');
    return;
  }

  localStorage.setItem('hugpong_role', 'manager');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (typeof applyRoleLayout === 'function') applyRoleLayout('manager');
      if (typeof renderDashboard === 'function') renderDashboard();
    });
  } else {
    if (typeof applyRoleLayout === 'function') applyRoleLayout('manager');
    if (typeof renderDashboard === 'function') renderDashboard();
  }
})();
