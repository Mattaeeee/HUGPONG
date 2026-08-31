// ══════════════════════════════════════════════════════════════
// HUGPONG — Authentication Guard Middleware
// Ensures the request has a verified active session
// ══════════════════════════════════════════════════════════════

function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({
    success: false,
    error: 'Authentication Required: Please sign in to access this resource.',
    code: 'UNAUTHENTICATED'
  });
}

module.exports = {
  requireAuth
};
