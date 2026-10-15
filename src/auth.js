const TOKENS = new Map([[process.env.ADMIN_TOKEN || 'dev-admin', { user: 'admin', role: 'admin' }]]);

export function authenticate(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const session = token && TOKENS.get(token);
  if (!session) return res.status(401).json({ error: 'unauthorized' });
  req.user = session;
  next();
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'forbidden' });
  next();
}
