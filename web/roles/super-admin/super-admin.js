// ══════════════════════════════════════════════════════════════
// HUGPONG — Super Admin Workspace & Governance Console
// Role: Super Admin (Capstone Group)
// ══════════════════════════════════════════════════════════════

console.log('[HUGPONG] Initializing Super Admin workspace...');

// Enforce role context
localStorage.setItem('hugpong_role', 'superadmin');

document.addEventListener('DOMContentLoaded', () => {
  if (typeof applyRoleLayout === 'function') {
    applyRoleLayout('superadmin');
  }
  if (typeof renderDashboard === 'function') {
    renderDashboard();
  }
});
