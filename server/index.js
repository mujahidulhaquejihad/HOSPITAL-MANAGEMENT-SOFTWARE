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
} from './data/db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Helper: get user without password
function sanitizeUser(u) {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
}

// Auth: login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const withDetails = { ...sanitizeUser(user) };
  if (user.role === 'doctor' && user.doctorId) {
    withDetails.doctor = doctors.find((d) => d.id === user.doctorId);
    withDetails.doctor.department = departments.find((d) => d.id === withDetails.doctor.departmentId);
  }
  if (user.role === 'patient' && user.patientId) {
    withDetails.patient = patients.find((p) => p.id === user.patientId);
  }
  res.json(withDetails);
});

// Departments (public for patient doctor browsing)
app.get('/api/departments', (req, res) => {
  res.json(departments);
});

// Doctors list (for patients to choose) – include department and user name
app.get('/api/doctors', (req, res) => {
  const list = doctors.map((d) => {
    const user = users.find((u) => u.id === d.userId);
    const dept = departments.find((x) => x.id === d.departmentId);
    return { ...d, doctorName: user?.name, departmentName: dept?.name };
  });
  res.json(list);
});

// Appointments
app.get('/api/appointments', (req, res) => {
  const { role, doctorId, patientId } = req.query;
  let list = getAppointments();
  if (role === 'doctor' && doctorId) list = list.filter((a) => a.doctorId === doctorId);
  if (role === 'patient' && patientId) list = list.filter((a) => a.patientId === patientId);
  const enriched = list.map((a) => {
    const doc = doctors.find((d) => d.id === a.doctorId);
    const docUser = users.find((u) => u.id === doc?.userId);
    const pat = patients.find((p) => p.id === a.patientId);
    const patUser = users.find((u) => u.id === pat?.userId);
    const dept = doc ? departments.find((d) => d.id === doc.departmentId) : null;
    return {
      ...a,
      doctorName: docUser?.name,
      doctorSpecialization: doc?.specialization,
      departmentName: dept?.name,
      patientName: patUser?.name,
      patientPhone: pat?.phone,
    };
  });
  res.json(enriched);
});

app.post('/api/appointments', (req, res) => {
  const { patientId, doctorId, date, time, notes } = req.body || {};
  if (!patientId || !doctorId || !date || !time) {
    return res.status(400).json({ error: 'Missing patientId, doctorId, date, or time' });
  }
  const apt = addAppointment({
    patientId,
    doctorId,
    date,
    time,
    status: 'scheduled',
    notes: notes || '',
  });
  res.status(201).json(apt);
});

app.patch('/api/appointments/:id', (req, res) => {
  const updated = updateAppointment(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Appointment not found' });
  res.json(updated);
});

// Admin/Staff: list users (simplified – no passwords)
app.get('/api/users', (req, res) => {
  const list = users.map(sanitizeUser);
  res.json(list);
});

// Admin/Staff: list patients with user info
app.get('/api/patients', (req, res) => {
  const list = patients.map((p) => {
    const user = users.find((u) => u.id === p.userId);
    return { ...p, name: user?.name, email: user?.email };
  });
  res.json(list);
});

app.listen(PORT, () => {
  console.log(`Hospital API running at http://localhost:${PORT}`);
});
