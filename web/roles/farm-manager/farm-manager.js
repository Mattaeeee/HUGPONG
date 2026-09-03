// ══════════════════════════════════════════════════════════════
// HUGPONG — Farm Manager Operations Workspace
// Role: Farm Manager (Jose Reyes · Nacayao Block Farm)
// ══════════════════════════════════════════════════════════════

console.log('[HUGPONG] Initializing Farm Manager workspace...');

// Enforce role context
localStorage.setItem('hugpong_role', 'manager');

document.addEventListener('DOMContentLoaded', () => {
  if (typeof applyRoleLayout === 'function') {
    applyRoleLayout('manager');
  }
  if (typeof renderDashboard === 'function') {
    renderDashboard();
  }
});
