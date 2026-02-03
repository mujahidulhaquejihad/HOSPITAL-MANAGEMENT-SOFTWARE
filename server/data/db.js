// In-memory store with Bangladeshi dummy data. Replace with real DB in production.

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

// Bangladeshi first names (male/female) and surnames
const bdFirstNames = [
  'Mohammad', 'Abdul', 'Hasan', 'Rahim', 'Karim', 'Jamal', 'Rafiq', 'Sohel', 'Kamal', 'Nasir',
  'Fatima', 'Ayesha', 'Nasrin', 'Shabnam', 'Rupa', 'Jahanara', 'Sharmin', 'Tahmina', 'Nargis', 'Salma',
  'Rahim', 'Sultan', 'Faruk', 'Tariq', 'Imran', 'Shafiq', 'Mahmud', 'Rashid', 'Akram', 'Habib',
];
const bdSurnames = ['Ahmed', 'Khan', 'Rahman', 'Hossain', 'Islam', 'Ali', 'Siddique', 'Chowdhury', 'Haque', 'Uddin', 'Miah', 'Sarker', 'Mollah', 'Bhuiyan', 'Mia'];

const bdCities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Comilla', 'Gazipur', 'Narayanganj', 'Rangpur', 'Mymensingh', 'Tangail', 'Jessore', 'Bogra', 'Dinajpur'];
const bdAreas = ['Dhanmondi', 'Gulshan', 'Banani', 'Motijheel', 'Uttara', 'Mirpur', 'Mohakhali', 'Farmgate', 'Shyamoli', 'Malibagh', 'Bashundhara', 'Tejgaon', 'Old Town', 'Agrabad', 'Patenga'];

function bdPhone() {
  const digits = () => Math.floor(Math.random() * 10);
  return `+880 1${digits()}${digits()}${digits()}-${digits()}${digits()}${digits()}${digits()}${digits()}`;
}
function bdAddress() {
  const num = Math.floor(Math.random() * 199) + 1;
  const area = bdAreas[Math.floor(Math.random() * bdAreas.length)];
  const city = bdCities[Math.floor(Math.random() * bdCities.length)];
  return `${num}, ${area}, ${city}, Bangladesh`;
}

// Admin & staff
const adminUser = { id: 'user-admin', email: 'admin@hospital.com', password: 'admin123', role: 'admin', name: 'Dr. Faruq Ahmed', avatar: null };
const staffUsers = [
  { id: 'user-s1', email: 'maria.akter@hospital.com', password: 'staff123', role: 'staff', name: 'Maria Akter', avatar: null },
  { id: 'user-s2', email: 'jahangir.alam@hospital.com', password: 'staff123', role: 'staff', name: 'Jahangir Alam', avatar: null },
];

// 20 doctors: names and specializations
const doctorNames = [
  'Dr. Ayesha Siddika', 'Dr. Mohammad Rahman', 'Dr. Nasrin Khan', 'Dr. Hasan Mahmud', 'Dr. Shabnam Ahmed',
  'Dr. Rahim Uddin', 'Dr. Fatima Chowdhury', 'Dr. Jamal Hossain', 'Dr. Tahmina Islam', 'Dr. Rafiq Miah',
  'Dr. Nargis Haque', 'Dr. Sohel Khan', 'Dr. Salma Rahman', 'Dr. Kamal Siddique', 'Dr. Sharmin Ali',
  'Dr. Nasir Bhuiyan', 'Dr. Jahanara Sarker', 'Dr. Imran Mollah', 'Dr. Rupa Miah', 'Dr. Tariq Ahmed',
];
const doctorSpecs = [
  { spec: 'Cardiology', deptId: 'dept-1', qual: 'MD, FCPS (Cardiology), DMC', fee: 1500, exp: 12, bio: 'Interventional cardiology and heart failure. Ex-BIRDEM.' },
  { spec: 'Neurology', deptId: 'dept-2', qual: 'MD, FCPS (Neurology), PhD', fee: 1800, exp: 15, bio: 'Stroke and movement disorders. BSMMU trained.' },
  { spec: 'Pediatrics', deptId: 'dept-4', qual: 'MD, DCH, FCPS (Paediatrics)', fee: 1200, exp: 10, bio: 'Child health and vaccination. Dhaka Shishu Hospital.' },
  { spec: 'Orthopedics', deptId: 'dept-3', qual: 'MS (Ortho), FCPS, FACS', fee: 1750, exp: 14, bio: 'Joint replacement and sports medicine.' },
  { spec: 'General Medicine', deptId: 'dept-5', qual: 'MBBS, MD (Medicine), FCPS', fee: 1000, exp: 8, bio: 'Primary care and chronic disease management.' },
  { spec: 'Dermatology', deptId: 'dept-6', qual: 'MD (Dermatology), DDV, FCPS', fee: 1100, exp: 9, bio: 'Skin, hair and cosmetic dermatology.' },
  { spec: 'Emergency Medicine', deptId: 'dept-7', qual: 'FCPS (EM), MD (Emergency)', fee: 800, exp: 7, bio: 'Emergency and critical care.' },
];

const deptCycle = ['dept-1', 'dept-2', 'dept-3', 'dept-4', 'dept-5', 'dept-6', 'dept-7', 'dept-1', 'dept-2', 'dept-3', 'dept-4', 'dept-5', 'dept-6', 'dept-7', 'dept-1', 'dept-2', 'dept-3', 'dept-4', 'dept-5', 'dept-6'];
const specCycle = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Dermatology', 'Emergency', 'Cardiology', 'Neurology', 'Pediatrics', 'General Medicine', 'Orthopedics', 'Dermatology', 'Emergency', 'Cardiology', 'General Medicine', 'Pediatrics', 'Neurology', 'Orthopedics', 'Dermatology'];

const usersDoctors = [];
const doctorsList = [];

for (let i = 0; i < 20; i++) {
  const uid = `user-d${i + 1}`;
  const docId = `doc-${i + 1}`;
  const email = `dr.${doctorNames[i].toLowerCase().replace(/[\s.]/g, '')}@hospital.com`;
  usersDoctors.push({
    id: uid,
    email: email.replace(' ', ''),
    password: 'doctor123',
    role: 'doctor',
    name: doctorNames[i],
    avatar: null,
    doctorId: docId,
  });
  const deptId = deptCycle[i];
  const dept = departments.find((d) => d.id === deptId);
  doctorsList.push({
    id: docId,
    userId: uid,
    departmentId: deptId,
    specialization: specCycle[i],
    qualification: 'MBBS, FCPS, ' + (dept?.name || 'Specialist'),
    experienceYears: 8 + (i % 10),
    consultationFee: 800 + (i % 12) * 100,
    bio: 'Experienced specialist. Trained in leading Bangladeshi hospitals.',
  });
}

// 100 patients: Bangladeshi names and details
const patientFirst = [
  'Rokeya', 'Abdul', 'Shirin', 'Mizan', 'Laila', 'Rafiq', 'Nargis', 'Habib', 'Shabana', 'Salam',
  'Taslima', 'Jahangir', 'Kulsum', 'Morshed', 'Ferdousi', 'Alam', 'Nasima', 'Shafiq', 'Rahima', 'Kamal',
  'Shahnaz', 'Moin', 'Jahanara', 'Siraj', 'Ruma', 'Azad', 'Shahida', 'Rashid', 'Feroza', 'Anwar',
  'Sharmin', 'Mahbub', 'Rupali', 'Selim', 'Tania', 'Babul', 'Nazma', 'Khalil', 'Rehana', 'Mannan',
  'Shabnam', 'Rafiqul', 'Rokeya', 'Sazzad', 'Lutfa', 'Mizanur', 'Nasrin', 'Shamsul', 'Fahima', 'Jahangir',
  'Tahmina', 'Abdul', 'Shabana', 'Habibur', 'Nargis', 'Rashidul', 'Rupa', 'Mahmud', 'Shirin', 'Karim',
  'Jahanara', 'Sohel', 'Ferdous', 'Rahim', 'Kulsum', 'Nasir', 'Salma', 'Faruk', 'Laila', 'Tariq',
  'Rahima', 'Imran', 'Shabnam', 'Akram', 'Nasima', 'Shafiqul', 'Rokeya', 'Sultan', 'Taslima', 'Rafiq',
  'Nazma', 'Jamal', 'Feroza', 'Kamrul', 'Shahida', 'Morshed', 'Rupali', 'Babul', 'Sharmin', 'Selim',
  'Rehana', 'Mahbub', 'Jahanara', 'Azad', 'Shabana', 'Anwar', 'Kulsum', 'Khalil', 'Nargis', 'Moin',
];
const patientLast = ['Begum', 'Ahmed', 'Khan', 'Rahman', 'Hossain', 'Islam', 'Ali', 'Siddique', 'Chowdhury', 'Uddin', 'Miah', 'Haque', 'Sarker', 'Bhuiyan', 'Mollah'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const usersPatients = [];
const patientsList = [];

for (let i = 0; i < 100; i++) {
  const uid = `user-p${i + 1}`;
  const patId = `pat-${i + 1}`;
  const first = patientFirst[i % patientFirst.length];
  const last = patientLast[i % patientLast.length];
  const fullName = `${first} ${last}`;
  const email = `${first.toLowerCase()}.${last.toLowerCase()}${i + 1}@email.com`;
  usersPatients.push({
    id: uid,
    email,
    password: 'patient123',
    role: 'patient',
    name: fullName,
    avatar: null,
    patientId: patId,
  });
  const dobYear = 1950 + (i % 55);
  const dobMonth = String((i % 12) + 1).padStart(2, '0');
  const dobDay = String((i % 28) + 1).padStart(2, '0');
  patientsList.push({
    id: patId,
    userId: uid,
    dateOfBirth: `${dobYear}-${dobMonth}-${dobDay}`,
    bloodGroup: bloodGroups[i % bloodGroups.length],
    phone: bdPhone(),
    address: bdAddress(),
    emergencyContact: `${patientFirst[(i + 5) % patientFirst.length]} ${patientLast[(i + 3) % patientLast.length]} (${bdPhone()})`,
  });
}

export const users = [adminUser, ...staffUsers, ...usersDoctors, ...usersPatients];
export const doctors = doctorsList;
export const patients = patientsList;

// Mutable copies for runtime (appointments get added)
let appointments = [
  { id: 'apt-1', patientId: 'pat-1', doctorId: 'doc-1', date: '2025-02-10', time: '09:00', status: 'completed', notes: 'Routine checkup.' },
  { id: 'apt-2', patientId: 'pat-2', doctorId: 'doc-5', date: '2025-02-12', time: '14:30', status: 'scheduled', notes: '' },
  { id: 'apt-3', patientId: 'pat-3', doctorId: 'doc-2', date: '2025-02-15', time: '10:00', status: 'scheduled', notes: '' },
  { id: 'apt-4', patientId: 'pat-1', doctorId: 'doc-4', date: '2025-02-18', time: '11:00', status: 'scheduled', notes: 'Follow-up.' },
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

// --- Admin-only mutations (patients, doctors, users) ---
function nextNum(prefix, list, idKey = 'id') {
  const re = new RegExp(`^${prefix}-(\\d+)$`);
  const nums = list.map((x) => { const m = (x[idKey] || '').match(re); return m ? parseInt(m[1], 10) : 0; });
  return (nums.length ? Math.max(...nums) : 0) + 1;
}

export function addPatient(data) {
  const n = nextNum('pat', patients);
  const patId = `pat-${n}`;
  const uid = `user-p${n}`;
  const { name, email, password = 'patient123', dateOfBirth, bloodGroup, phone, address, emergencyContact } = data;
  if (!name || !email) return null;
  const user = { id: uid, email, password, role: 'patient', name, avatar: null, patientId: patId };
  const patient = { id: patId, userId: uid, dateOfBirth: dateOfBirth || '', bloodGroup: bloodGroup || '', phone: phone || '', address: address || '', emergencyContact: emergencyContact || '' };
  users.push(user);
  patients.push(patient);
  return { ...patient, name, email };
}

export function updatePatient(id, updates) {
  const pat = patients.find((p) => p.id === id);
  if (!pat) return null;
  const user = users.find((u) => u.id === pat.userId);
  const { name, email, dateOfBirth, bloodGroup, phone, address, emergencyContact } = updates;
  if (name !== undefined && user) user.name = name;
  if (email !== undefined && user) user.email = email;
  if (dateOfBirth !== undefined) pat.dateOfBirth = dateOfBirth;
  if (bloodGroup !== undefined) pat.bloodGroup = bloodGroup;
  if (phone !== undefined) pat.phone = phone;
  if (address !== undefined) pat.address = address;
  if (emergencyContact !== undefined) pat.emergencyContact = emergencyContact;
  return { ...pat, name: user?.name, email: user?.email };
}

export function deletePatient(id) {
  const idx = patients.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  const pat = patients[idx];
  const uIdx = users.findIndex((u) => u.id === pat.userId);
  if (uIdx !== -1) users.splice(uIdx, 1);
  patients.splice(idx, 1);
  return true;
}

export function addDoctor(data) {
  const n = nextNum('doc', doctors);
  const docId = `doc-${n}`;
  const uid = `user-d${n}`;
  const { name, email, password = 'doctor123', departmentId, specialization, qualification, experienceYears, consultationFee, bio } = data;
  if (!name || !email || !departmentId || !specialization) return null;
  const user = { id: uid, email, password, role: 'doctor', name, avatar: null, doctorId: docId };
  const doctor = { id: docId, userId: uid, departmentId, specialization, qualification: qualification || '', experienceYears: experienceYears ?? 8, consultationFee: consultationFee ?? 1000, bio: bio || '' };
  users.push(user);
  doctors.push(doctor);
  return doctor;
}

export function updateDoctor(id, updates) {
  const doc = doctors.find((d) => d.id === id);
  if (!doc) return null;
  const user = users.find((u) => u.id === doc.userId);
  const { name, email, departmentId, specialization, qualification, experienceYears, consultationFee, bio } = updates;
  if (name !== undefined && user) user.name = name;
  if (email !== undefined && user) user.email = email;
  if (departmentId !== undefined) doc.departmentId = departmentId;
  if (specialization !== undefined) doc.specialization = specialization;
  if (qualification !== undefined) doc.qualification = qualification;
  if (experienceYears !== undefined) doc.experienceYears = experienceYears;
  if (consultationFee !== undefined) doc.consultationFee = consultationFee;
  if (bio !== undefined) doc.bio = bio;
  return doc;
}

export function deleteDoctor(id) {
  const idx = doctors.findIndex((d) => d.id === id);
  if (idx === -1) return false;
  const doc = doctors[idx];
  const uIdx = users.findIndex((u) => u.id === doc.userId);
  if (uIdx !== -1) users.splice(uIdx, 1);
  doctors.splice(idx, 1);
  return true;
}

export function addStaff(data) {
  const staffNums = users.filter((u) => u.id.startsWith('user-s')).map((u) => parseInt(u.id.replace('user-s', ''), 10)).filter((n) => !isNaN(n));
  const n = staffNums.length ? Math.max(...staffNums) + 1 : 1;
  const uid = `user-s${n}`;
  const { name, email, password = 'staff123' } = data;
  if (!name || !email) return null;
  const user = { id: uid, email, password, role: 'staff', name, avatar: null };
  users.push(user);
  return { ...user, password: undefined };
}

export function updateUser(id, updates) {
  const user = users.find((u) => u.id === id);
  if (!user) return null;
  const { name, email, password } = updates;
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (password !== undefined && password) user.password = password;
  return sanitizeUser(user);
}

function sanitizeUser(u) {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
}

export function deleteUser(id) {
  if (id === 'user-admin') return false;
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return false;
  const user = users[idx];
  if (user.doctorId) {
    const dIdx = doctors.findIndex((d) => d.id === user.doctorId);
    if (dIdx !== -1) doctors.splice(dIdx, 1);
  }
  if (user.patientId) {
    const pIdx = patients.findIndex((p) => p.id === user.patientId);
    if (pIdx !== -1) patients.splice(pIdx, 1);
  }
  users.splice(idx, 1);
  return true;
}
