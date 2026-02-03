import express from 'express';
import cors from 'cors';
import {
  users,
  doctors,
  patients,
  departments,
  getAppointments,
  addAppointment,
  updateAppointment,
  addPatient,
  updatePatient,
  deletePatient,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  addStaff,
  updateUser,
  deleteUser,
} from './data/db.js';
import {
  signToken,
  hashPassword,
  comparePassword,
  requireAuth,
  requireAdmin,
  requireAdminOrStaff,
  requireAdminOrDoctor,
  requireAdminOrStaffOrDoctor,
} from './auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// --- Input validation helpers ---
const MAX = { name: 200, email: 254, password: 128, text: 2000, phone: 30, address: 500 };
function trim(str, maxLen = 0) {
  if (typeof str !== 'string') return '';
  const s = str.trim();
  return maxLen ? s.slice(0, maxLen) : s;
}
function validEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const e = email.trim().toLowerCase();
  return e.length <= MAX.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
function strongPassword(pwd) {
  if (!pwd || typeof pwd !== 'string') return false;
  if (pwd.length < 8) return false;
  return /\d/.test(pwd) && /[a-zA-Z]/.test(pwd);
}

// Helper: get user without password
function sanitizeUser(u) {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
}

// --- Auth: login (returns JWT) ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const email = trim(req.body?.email, MAX.email).toLowerCase();
    const password = typeof req.body?.password === 'string' ? req.body.password.trim() : '';
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = users.find((u) => u.email && u.email.toLowerCase() === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const ok = await comparePassword(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = signToken({ id: user.id, role: user.role });
    const withDetails = { ...sanitizeUser(user), token };
    if (user.role === 'doctor' && user.doctorId) {
      const doc = doctors.find((d) => d.id === user.doctorId);
      if (doc) {
        withDetails.doctor = { ...doc, department: departments.find((d) => d.id === doc.departmentId) || null };
      }
    }
    if (user.role === 'patient' && user.patientId) {
      withDetails.patient = patients.find((p) => p.id === user.patientId) || null;
    }
    return res.json(withDetails);
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// --- Auth: patient signup (validation + hashed password) ---
const signupAttempts = new Map();
const SIGNUP_RATE_LIMIT = 5;
const SIGNUP_RATE_WINDOW_MS = 60 * 60 * 1000;

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
}

app.post('/api/auth/signup', async (req, res) => {
  const ip = getClientIp(req);
  const now = Date.now();
  const attempts = signupAttempts.get(ip) || [];
  const recent = attempts.filter((t) => now - t < SIGNUP_RATE_WINDOW_MS);
  if (recent.length >= SIGNUP_RATE_LIMIT) {
    return res.status(429).json({ error: 'Too many signup attempts. Try again later.' });
  }
  recent.push(now);
  signupAttempts.set(ip, recent);

  const name = trim(req.body?.name, MAX.name);
  const email = trim(req.body?.email, MAX.email).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password.trim() : '';
  const dateOfBirth = trim(req.body?.dateOfBirth, 20);
  const bloodGroup = trim(req.body?.bloodGroup, 10);
  const phone = trim(req.body?.phone, MAX.phone);
  const address = trim(req.body?.address, MAX.address);
  const emergencyContact = trim(req.body?.emergencyContact, 200);

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  if (!validEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }
  if (!strongPassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters and contain both letters and numbers' });
  }
  if (users.some((u) => u.email.toLowerCase() === email)) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const hashed = await hashPassword(password);
  const created = addPatient({
    name,
    email,
    password: hashed,
    dateOfBirth,
    bloodGroup,
    phone,
    address,
    emergencyContact,
  });
  if (!created) return res.status(400).json({ error: 'Could not create account' });
  res.status(201).json({ message: 'Account created. You can now log in.', email: created.email });
});

// Departments (public)
app.get('/api/departments', (req, res) => {
  res.json(departments);
});

// Doctors list (public for browsing)
app.get('/api/doctors', (req, res) => {
  const list = doctors.map((d) => {
    const user = users.find((u) => u.id === d.userId);
    const dept = departments.find((x) => x.id === d.departmentId);
    return { ...d, doctorName: user?.name, departmentName: dept?.name };
  });
  res.json(list);
});

// Appointments: list (require auth; filter by JWT role)
app.get('/api/appointments', requireAuth, (req, res) => {
  const { role, doctorId, patientId } = req.query;
  const payload = req.user;

  let list = getAppointments();
  if (payload.role === 'doctor' && payload.id) {
    const doc = doctors.find((d) => d.userId === payload.id);
    if (doc) list = list.filter((a) => a.doctorId === doc.id);
  } else if (payload.role === 'patient' && payload.id) {
    const pat = patients.find((p) => p.userId === payload.id);
    if (pat) list = list.filter((a) => a.patientId === pat.id);
  }
  // staff and admin see all appointments

  const enriched = list.map((a) => {
    const doc = doctors.find((d) => d.id === a.doctorId);
    const docUser = users.find((u) => u.id === doc?.userId);
    const pat = a.patientId ? patients.find((p) => p.id === a.patientId) : null;
    const patUser = users.find((u) => u.id === pat?.userId);
    const dept = doc ? departments.find((d) => d.id === doc.departmentId) : null;
    return {
      ...a,
      doctorName: docUser?.name,
      doctorSpecialization: doc?.specialization,
      departmentName: dept?.name,
      patientName: patUser?.name ?? a.patientName ?? '—',
      patientPhone: pat?.phone ?? a.patientPhone ?? '',
    };
  });
  res.json(enriched);
});

app.post('/api/appointments', requireAuth, (req, res) => {
  const patientId = trim(req.body?.patientId, 50);
  const patientName = trim(req.body?.patientName, 200);
  const patientPhone = trim(req.body?.patientPhone, 50);
  const doctorId = trim(req.body?.doctorId, 50);
  const date = trim(req.body?.date, 20);
  const time = trim(req.body?.time, 20);
  const notes = trim(req.body?.notes, MAX.text);
  const hasPatientId = !!patientId;
  const hasWalkIn = !!(patientName && patientPhone);
  if ((!hasPatientId && !hasWalkIn) || !doctorId || !date || !time) {
    return res.status(400).json({ error: 'Provide either patientId or both patientName and patientPhone; and doctorId, date, time' });
  }
  const apt = addAppointment({
    ...(hasPatientId ? { patientId } : { patientName, patientPhone }),
    doctorId,
    date,
    time,
    status: 'scheduled',
    notes: notes || '',
  });
  res.status(201).json(apt);
});

app.patch('/api/appointments/:id', requireAuth, (req, res) => {
  const updates = {};
  if (req.body?.date != null) updates.date = trim(String(req.body.date), 20);
  if (req.body?.time != null) updates.time = trim(String(req.body.time), 20);
  if (req.body?.status != null) updates.status = ['scheduled', 'completed', 'cancelled'].includes(req.body.status) ? req.body.status : undefined;
  if (req.body?.notes != null) updates.notes = trim(String(req.body.notes), MAX.text);
  const updated = updateAppointment(req.params.id, updates);
  if (!updated) return res.status(404).json({ error: 'Appointment not found' });
  res.json(updated);
});

// Protected: list users (admin and staff only)
app.get('/api/users', requireAuth, requireAdminOrStaff, (req, res) => {
  const list = users.map(sanitizeUser);
  res.json(list);
});

// Protected: list patients
app.get('/api/patients', requireAuth, (req, res) => {
  const list = patients.map((p) => {
    const user = users.find((u) => u.id === p.userId);
    return { ...p, name: user?.name, email: user?.email };
  });
  res.json(list);
});

// --- Admin, Staff, or Doctor: add / edit / remove patients (JWT) ---
app.post('/api/patients', requireAuth, requireAdminOrStaffOrDoctor, async (req, res) => {
  const name = trim(req.body?.name, MAX.name);
  const email = validEmail(req.body?.email) ? trim(req.body.email, MAX.email).toLowerCase() : '';
  let password = req.body?.password;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  if (users.some((u) => u.email.toLowerCase() === email)) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }
  if (password && typeof password === 'string') {
    password = password.length >= 6 ? await hashPassword(password) : undefined;
  }
  const created = addPatient({
    name,
    email,
    password: password || (await hashPassword('patient123')),
    dateOfBirth: trim(req.body?.dateOfBirth, 20),
    bloodGroup: trim(req.body?.bloodGroup, 10),
    phone: trim(req.body?.phone, MAX.phone),
    address: trim(req.body?.address, MAX.address),
    emergencyContact: trim(req.body?.emergencyContact, 200),
  });
  if (!created) return res.status(400).json({ error: 'Could not create patient' });
  res.status(201).json(created);
});

app.patch('/api/patients/:id', requireAuth, requireAdminOrStaffOrDoctor, (req, res) => {
  const updates = {};
  if (req.body?.name != null) updates.name = trim(req.body.name, MAX.name);
  if (req.body?.email != null && validEmail(req.body.email)) updates.email = trim(req.body.email, MAX.email).toLowerCase();
  if (req.body?.dateOfBirth != null) updates.dateOfBirth = trim(String(req.body.dateOfBirth), 20);
  if (req.body?.bloodGroup != null) updates.bloodGroup = trim(String(req.body.bloodGroup), 10);
  if (req.body?.phone != null) updates.phone = trim(String(req.body.phone), MAX.phone);
  if (req.body?.address != null) updates.address = trim(String(req.body.address), MAX.address);
  if (req.body?.emergencyContact != null) updates.emergencyContact = trim(String(req.body.emergencyContact), 200);
  const updated = updatePatient(req.params.id, updates);
  if (!updated) return res.status(404).json({ error: 'Patient not found' });
  res.json(updated);
});

app.delete('/api/patients/:id', requireAuth, requireAdminOrStaffOrDoctor, (req, res) => {
  const ok = deletePatient(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Patient not found' });
  res.status(204).send();
});

// --- Admin or Staff: add / edit / remove doctors (JWT + hash password) ---
app.post('/api/doctors', requireAuth, requireAdminOrStaff, async (req, res) => {
  const email = validEmail(req.body?.email) ? trim(req.body.email, MAX.email).toLowerCase() : '';
  if (email && users.some((u) => u.email.toLowerCase() === email)) {
    return res.status(400).json({ error: 'An account with this email already exists. Use a different login ID (email).' });
  }
  let password = req.body?.password;
  if (password && typeof password === 'string' && password.length >= 6) {
    password = await hashPassword(password);
  } else {
    password = await hashPassword('doctor123');
  }
  const created = addDoctor({
    ...req.body,
    name: trim(req.body?.name, MAX.name),
    email: email || trim(req.body?.email, MAX.email).toLowerCase(),
    password,
    departmentId: req.body?.departmentId,
    specialization: trim(req.body?.specialization, 100),
  });
  if (!created) return res.status(400).json({ error: 'Invalid or missing name, email (login ID), departmentId, or specialization' });
  res.status(201).json(created);
});

app.patch('/api/doctors/:id', requireAuth, requireAdminOrStaff, async (req, res) => {
  const updates = { ...req.body };
  if (updates.password !== undefined) {
    updates.password = updates.password && updates.password.length >= 6 ? await hashPassword(updates.password) : undefined;
  }
  const updated = updateDoctor(req.params.id, updates);
  if (!updated) return res.status(404).json({ error: 'Doctor not found' });
  res.json(updated);
});

app.delete('/api/doctors/:id', requireAuth, requireAdminOrStaff, (req, res) => {
  const ok = deleteDoctor(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Doctor not found' });
  res.status(204).send();
});

// --- Admin or Staff: add / edit / remove staff (staff cannot add/remove admin) ---
app.post('/api/users/staff', requireAuth, requireAdminOrStaff, async (req, res) => {
  const email = validEmail(req.body?.email) ? trim(req.body.email, MAX.email).toLowerCase() : '';
  if (email && users.some((u) => u.email.toLowerCase() === email)) {
    return res.status(400).json({ error: 'An account with this email already exists. Use a different login ID (email).' });
  }
  let password = req.body?.password;
  if (password && typeof password === 'string' && password.length >= 6) {
    password = await hashPassword(password);
  } else {
    password = await hashPassword('staff123');
  }
  const created = addStaff({
    name: trim(req.body?.name, MAX.name),
    email: email || trim(req.body?.email, MAX.email).toLowerCase(),
    password,
  });
  if (!created) return res.status(400).json({ error: 'Invalid or missing name, email (login ID), or password' });
  res.status(201).json(created);
});

app.patch('/api/users/:id', requireAuth, requireAdminOrStaff, async (req, res) => {
  const target = users.find((u) => u.id === req.params.id);
  if (!target) return res.status(404).json({ error: 'User not found' });
  if (req.user.role === 'staff' && target.role === 'admin') {
    return res.status(403).json({ error: 'Only an administrator can modify an admin account.' });
  }
  const updates = {};
  if (req.body?.name != null) updates.name = trim(req.body.name, MAX.name);
  if (req.body?.email != null && validEmail(req.body.email)) updates.email = trim(req.body.email, MAX.email).toLowerCase();
  if (req.body?.password !== undefined) {
    updates.password = req.body.password && req.body.password.length >= 6 ? await hashPassword(req.body.password) : undefined;
  }
  const updated = updateUser(req.params.id, updates);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json(updated);
});

app.delete('/api/users/:id', requireAuth, requireAdminOrStaff, (req, res) => {
  const target = users.find((u) => u.id === req.params.id);
  if (!target) return res.status(404).json({ error: 'User not found' });
  if (req.user.role === 'staff' && target.role === 'admin') {
    return res.status(403).json({ error: 'Only an administrator can remove an admin.' });
  }
  const ok = deleteUser(req.params.id);
  if (!ok) return res.status(404).json({ error: 'User not found or cannot delete admin' });
  res.status(204).send();
});

// Start server (seed users use plaintext passwords; comparePassword supports both plaintext and bcrypt)
app.listen(PORT, () => {
  console.log(`Hospital API running at http://localhost:${PORT}`);
});
