// In-memory store with dummy data. Replace with real DB in production.

export const roles = Object.freeze({ ADMIN: 'admin', DOCTOR: 'doctor', STAFF: 'staff', PATIENT: 'patient' });

export const departments = [
  { id: 'dept-1', name: 'Cardiology', floor: 2 },
  { id: 'dept-2', name: 'Neurology', floor: 3 },
  { id: 'dept-3', name: 'Orthopedics', floor: 1 },
  { id: 'dept-4', name: 'Pediatrics', floor: 1 },
  { id: 'dept-5', name: 'General Medicine', floor: 1 },
  { id: 'dept-6', name: 'Dermatology', floor: 2 },
  { id: 'dept-7', name: 'Emergency', floor: 0 },
];

export const users = [
  // Admin
  { id: 'user-admin', email: 'admin@hospital.com', password: 'admin123', role: 'admin', name: 'Sarah Mitchell', avatar: null },
  // Doctors
  { id: 'user-d1', email: 'dr.khan@hospital.com', password: 'doctor123', role: 'doctor', name: 'Dr. Aisha Khan', avatar: null, doctorId: 'doc-1' },
  { id: 'user-d2', email: 'dr.chen@hospital.com', password: 'doctor123', role: 'doctor', name: 'Dr. James Chen', avatar: null, doctorId: 'doc-2' },
  { id: 'user-d3', email: 'dr.okonkwo@hospital.com', password: 'doctor123', role: 'doctor', name: 'Dr. Ngozi Okonkwo', avatar: null, doctorId: 'doc-3' },
  { id: 'user-d4', email: 'dr.patel@hospital.com', password: 'doctor123', role: 'doctor', name: 'Dr. Priya Patel', avatar: null, doctorId: 'doc-4' },
  { id: 'user-d5', email: 'dr.mueller@hospital.com', password: 'doctor123', role: 'doctor', name: 'Dr. Hans Mueller', avatar: null, doctorId: 'doc-5' },
  // Staff
  { id: 'user-s1', email: 'maria.garcia@hospital.com', password: 'staff123', role: 'staff', name: 'Maria Garcia', avatar: null },
  { id: 'user-s2', email: 'john.wright@hospital.com', password: 'staff123', role: 'staff', name: 'John Wright', avatar: null },
  // Patients
  { id: 'user-p1', email: 'emily.jones@email.com', password: 'patient123', role: 'patient', name: 'Emily Jones', avatar: null, patientId: 'pat-1' },
  { id: 'user-p2', email: 'michael.brown@email.com', password: 'patient123', role: 'patient', name: 'Michael Brown', avatar: null, patientId: 'pat-2' },
  { id: 'user-p3', email: 'olivia.davis@email.com', password: 'patient123', role: 'patient', name: 'Olivia Davis', avatar: null, patientId: 'pat-3' },
];

export const doctors = [
  { id: 'doc-1', userId: 'user-d1', departmentId: 'dept-1', specialization: 'Cardiology', qualification: 'MD, FACC', experienceYears: 12, consultationFee: 150, bio: 'Expert in interventional cardiology and heart failure management.' },
  { id: 'doc-2', userId: 'user-d2', departmentId: 'dept-2', specialization: 'Neurology', qualification: 'MD, PhD', experienceYears: 15, consultationFee: 180, bio: 'Specializes in stroke prevention and movement disorders.' },
  { id: 'doc-3', userId: 'user-d3', departmentId: 'dept-4', specialization: 'Pediatrics', qualification: 'MD, FAAP', experienceYears: 10, consultationFee: 120, bio: 'Dedicated to child health from infancy through adolescence.' },
  { id: 'doc-4', userId: 'user-d4', departmentId: 'dept-3', specialization: 'Orthopedics', qualification: 'MD, FAAOS', experienceYears: 14, consultationFee: 175, bio: 'Sports medicine and joint replacement specialist.' },
  { id: 'doc-5', userId: 'user-d5', departmentId: 'dept-5', specialization: 'General Medicine', qualification: 'MD, Internal Medicine', experienceYears: 8, consultationFee: 100, bio: 'Primary care and preventive medicine.' },
];

export const patients = [
  { id: 'pat-1', userId: 'user-p1', dateOfBirth: '1985-03-12', bloodGroup: 'O+', phone: '+1-555-0101', address: '123 Oak Street, Springfield', emergencyContact: 'Tom Jones (+1-555-0102)' },
  { id: 'pat-2', userId: 'user-p2', dateOfBirth: '1990-07-22', bloodGroup: 'A+', phone: '+1-555-0201', address: '456 Maple Ave, Riverside', emergencyContact: 'Jane Brown (+1-555-0202)' },
  { id: 'pat-3', userId: 'user-p3', dateOfBirth: '1978-11-05', bloodGroup: 'B+', phone: '+1-555-0301', address: '789 Pine Rd, Lakeside', emergencyContact: 'Robert Davis (+1-555-0302)' },
];

// Mutable copies for runtime (appointments get added)
let appointments = [
  { id: 'apt-1', patientId: 'pat-1', doctorId: 'doc-1', date: '2025-02-10', time: '09:00', status: 'completed', notes: 'Routine cardiac checkup.' },
  { id: 'apt-2', patientId: 'pat-2', doctorId: 'doc-5', date: '2025-02-12', time: '14:30', status: 'scheduled', notes: '' },
  { id: 'apt-3', patientId: 'pat-3', doctorId: 'doc-2', date: '2025-02-15', time: '10:00', status: 'scheduled', notes: '' },
  { id: 'apt-4', patientId: 'pat-1', doctorId: 'doc-4', date: '2025-02-18', time: '11:00', status: 'scheduled', notes: 'Knee pain follow-up.' },
];

export function getAppointments() {
  return appointments;
}

export function addAppointment(apt) {
  const id = 'apt-' + (appointments.length + 1);
  appointments = [...appointments, { ...apt, id }];
  return appointments[appointments.length - 1];
}

export function updateAppointment(id, updates) {
  const idx = appointments.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  appointments[idx] = { ...appointments[idx], ...updates };
  return appointments[idx];
}
