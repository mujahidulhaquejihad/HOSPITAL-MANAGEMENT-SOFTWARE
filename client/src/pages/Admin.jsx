import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Admin.module.css';

export default function Admin() {
  const [stats, setStats] = useState({ users: 0, patients: 0, appointments: 0, doctors: 0 });

  useEffect(() => {
    Promise.all([
      fetch('/api/users').then((r) => r.json()),
      fetch('/api/patients').then((r) => r.json()),
      fetch('/api/appointments').then((r) => r.json()),
      fetch('/api/doctors').then((r) => r.json()),
    ])
      .then(([users, patients, appointments, doctors]) => {
        setStats({
          users: users.length,
          patients: patients.length,
          appointments: appointments.length,
          doctors: doctors.length,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Admin dashboard</h1>
      <p className={styles.subtitle}>System overview and privileged actions.</p>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Users</h3>
          <p className={styles.big}>{stats.users}</p>
          <p className={styles.muted}>Total accounts</p>
          <Link to="/staff">View staff →</Link>
        </div>
        <div className={styles.card}>
          <h3>Patients</h3>
          <p className={styles.big}>{stats.patients}</p>
          <p className={styles.muted}>Registered patients</p>
          <Link to="/patients">View patients →</Link>
        </div>
        <div className={styles.card}>
          <h3>Doctors</h3>
          <p className={styles.big}>{stats.doctors}</p>
          <p className={styles.muted}>Active doctors</p>
          <Link to="/doctors">View doctors →</Link>
        </div>
        <div className={styles.card}>
          <h3>Appointments</h3>
          <p className={styles.big}>{stats.appointments}</p>
          <p className={styles.muted}>Total appointments</p>
          <Link to="/appointments">View appointments →</Link>
        </div>
      </div>

      <section className={styles.section}>
        <h2>Admin actions</h2>
        <ul>
          <li><Link to="/staff">Manage staff & doctor accounts</Link></li>
          <li><Link to="/patients">View all patient records</Link></li>
          <li><Link to="/appointments">View all appointments</Link></li>
        </ul>
      </section>
    </div>
  );
}
