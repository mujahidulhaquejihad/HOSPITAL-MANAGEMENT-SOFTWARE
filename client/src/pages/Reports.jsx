import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Reports.module.css';

export default function Reports() {
  return (
    <div className={styles.reports}>
      <h1 className={styles.title}>Online Report</h1>
      <p className={styles.subtitle}>Your lab and diagnostic reports</p>
      <div className={styles.card}>
        <p className={styles.body}>
          Your lab and diagnostic reports will appear here after your visit. Reports are typically available within 24–48 hours.
        </p>
        <p className={styles.muted}>You have no reports yet. Book an appointment or visit the lab to generate reports.</p>
        <Link to="/dashboard/appointments" className={styles.link}>View Appointments</Link>
      </div>
    </div>
  );
}
