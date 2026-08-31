// ══════════════════════════════════════════════════════════════
// HUGPONG — Role-Based Access Control Middleware
// Ensures the user has the required clearance level
// ══════════════════════════════════════════════════════════════

function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Required: Session not established.',
        code: 'UNAUTHENTICATED'
      });
    }

    const userRole = (req.session.user.role || '').toLowerCase();
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

    // Super Admin has universal access
    if (userRole === 'super admin' || userRole === 'superadmin') {
      return next();
    }

    const hasPermission = normalizedAllowed.some(allowed => {
      if (allowed === 'admin' || allowed === 'sra' || allowed === 'sra (admin)') {
        return userRole.includes('admin') || userRole.includes('sra');
      }
      if (allowed === 'manager' || allowed === 'farm manager') {
        return userRole.includes('manager');
      }
      if (allowed === 'member') {
        return userRole.includes('member');
      }
      return userRole === allowed;
    });

    if (hasPermission) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: `Access Denied: Required clearance [${allowedRoles.join(', ')}]. Current role: ${req.session.user.role}`,
      code: 'FORBIDDEN'
    });
  };
}

module.exports = {
  requireRole
};
