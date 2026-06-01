import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev-secret';

export const signToken = (user) =>
  jwt.sign({ id: user.id, nom: user.nom, role: user.role }, SECRET, { expiresIn: '8h' });

export function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token manquant' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide' });
  }
}

export const adminOnly = (req, res, next) =>
  req.user?.role === 'admin' ? next() : res.status(403).json({ error: 'Accès réservé aux administrateurs' });
