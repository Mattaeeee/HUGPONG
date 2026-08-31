// ══════════════════════════════════════════════════════════════
// HUGPONG — SRA Administrator Console
// Role: SRA (Admin) (Silay Sugar Regulatory Administration)
// ══════════════════════════════════════════════════════════════

console.log('[HUGPONG] Initializing SRA Admin workspace...');

// Enforce role context
localStorage.setItem('hugpong_role', 'admin');

document.addEventListener('DOMContentLoaded', () => {
  if (typeof applyRoleLayout === 'function') {
    applyRoleLayout('admin');
  }
  if (typeof renderDashboard === 'function') {
    renderDashboard();
  }
});
