# Meridian General Hospital – Management Software

A full-stack hospital management app with **role-based access**: admins, doctors, staff, and patients. Patients can browse doctors by department and book appointments. Dummy data is included so you can log in and use it immediately.

## Features

- **Roles**
  - **Admin** – Full access: staff list, patients, appointments, admin dashboard.
  - **Doctor** – Own schedule and appointments, patient list.
  - **Staff** – Appointments, patient list (reception/nursing).
  - **Patient** – Browse doctors, book appointments, view own appointments.

- **Patient flow**
  - Browse doctors by department.
  - View specialization, qualification, experience, consultation fee.
  - Book an appointment with a chosen doctor (date, time, notes).

- **Dummy data**
  - Departments: Cardiology, Neurology, Orthopedics, Pediatrics, General Medicine, Dermatology, Emergency.
  - 5 doctors with profiles and fees.
  - 3 patients, staff accounts, and sample appointments.

## Tech stack

- **Frontend:** React 18, Vite, React Router, CSS modules.
- **Backend:** Node.js, Express, in-memory/JSON data (replace with a real DB for production).

## Setup

1. Install dependencies (root, server, client):

   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

2. Start both server and client (from project root):

   ```bash
   npm run dev
   ```

   - API: http://localhost:3001  
   - App: http://localhost:5173  

   Or run separately: `npm run dev:server` and `npm run dev:client`.

## Demo logins

| Role   | Email                     | Password   |
|--------|---------------------------|------------|
| Admin  | admin@hospital.com        | admin123   |
| Doctor | dr.khan@hospital.com      | doctor123  |
| Staff  | maria.garcia@hospital.com | staff123   |
| Patient| emily.jones@email.com     | patient123 |

More doctors: `dr.chen@hospital.com`, `dr.okonkwo@hospital.com`, `dr.patel@hospital.com`, `dr.mueller@hospital.com` (same password: `doctor123`).

## Project structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Layout, shared UI
│   │   ├── context/        # AuthContext
│   │   └── pages/          # Login, Dashboard, Doctors, Book, Appointments, Patients, Staff, Admin
│   └── vite.config.js      # Proxies /api to backend
├── server/                 # Express API
│   ├── data/db.js          # Dummy data & in-memory store
│   └── index.js            # Routes: auth, doctors, appointments, patients, users
├── package.json            # Root scripts (concurrently)
└── README.md
```

## API (overview)

- `POST /api/auth/login` – Login (email, password).
- `GET /api/departments` – List departments.
- `GET /api/doctors` – List doctors (for patient choice).
- `GET /api/appointments?role=&doctorId=&patientId=` – List appointments (filtered by role).
- `POST /api/appointments` – Create appointment (patientId, doctorId, date, time, notes).
- `GET /api/patients` – List patients (admin/staff/doctor).
- `GET /api/users` – List users (admin).

For production, replace the in-memory store in `server/data/db.js` with a database (e.g. PostgreSQL, MongoDB) and add proper authentication (e.g. JWT).
