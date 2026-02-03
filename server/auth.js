import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production-use-env';
const SALT_ROUNDS = 10;

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function comparePassword(plain, hash) {
  if (!hash || typeof plain !== 'string') return false;
  try {
    if (hash.startsWith('$2')) return await bcrypt.compare(plain, hash);
    return plain === hash;
  } catch {
    return false;
  }
}

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  const token = auth && auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.user = payload;
  next();
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

export function requireAdminOrStaff(req, res, next) {
  if (req.user?.role !== 'admin' && req.user?.role !== 'staff') {
    return res.status(403).json({ error: 'Admin or staff access required' });
  }
  next();
}

export function requireAdminOrDoctor(req, res, next) {
  if (req.user?.role !== 'admin' && req.user?.role !== 'doctor') {
    return res.status(403).json({ error: 'Admin or doctor access required' });
  }
  next();
}

export function requireAdminOrStaffOrDoctor(req, res, next) {
  if (req.user?.role !== 'admin' && req.user?.role !== 'staff' && req.user?.role !== 'doctor') {
    return res.status(403).json({ error: 'Admin, staff, or doctor access required' });
  }
  next();
}
