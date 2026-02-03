import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, isAdmin, isDoctor, isStaff, isPatient } = useAuth();
  const [stats, setStats] = useState({ appointments: 0, today: 0 });

  useEffect(() => {
    fetch('/api/appointments')
      .then((r) => r.json())
      .then((list) => {
        const today = new Date().toISOString().slice(0, 10);
        setStats({
          appointments: list.length,
          today: list.filter((a) => a.date === today).length,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Welcome, {user?.name}</h1>
      <p className={styles.role}>You are signed in as <strong>{user?.role}</strong>.</p>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Appointments</h3>
          <p className={styles.big}>{stats.appointments}</p>
          <p className={styles.muted}>Total</p>
          <Link to="/dashboard/appointments">View all →</Link>
        </div>
        <div className={styles.card}>
          <h3>Today</h3>
          <p className={styles.big}>{stats.today}</p>
          <p className={styles.muted}>Scheduled today</p>
        </div>
        {isPatient && (
          <Link to="/dashboard/book" className={styles.cardAction}>
            <h3>Book appointment</h3>
            <p>Choose a doctor and schedule a visit.</p>
          </Link>
        )}
        {(isAdmin || isStaff) && (
          <Link to="/dashboard/patients" className={styles.cardAction}>
            <h3>Patients</h3>
            <p>View and manage patient records.</p>
          </Link>
        )}
        {(isAdmin || isStaff) && (
          <Link to="/dashboard/admin" className={styles.cardAction}>
            <h3>Admin</h3>
            <p>System overview and settings.</p>
          </Link>
        )}
      </div>

      <section className={styles.section}>
        <h2>Quick actions</h2>
        <div className={styles.actions}>
          <Link to="/dashboard/doctors">Browse doctors</Link>
          <Link to="/dashboard/appointments">My appointments</Link>
          {isPatient && <Link to="/dashboard/book">Book new appointment</Link>}
          {(isAdmin || isStaff) && <Link to="/dashboard/patients">Patient list</Link>}
          {(isAdmin || isStaff) && <Link to="/dashboard/staff">Staff management</Link>}
        </div>
      </section>
    </div>
  );
}
