import React, { useEffect, useState } from 'react';
import styles from './Staff.module.css';

export default function Staff() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  const staff = users.filter((u) => u.role === 'staff' || u.role === 'doctor' || u.role === 'admin');

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Staff & Doctors</h1>
      <p className={styles.subtitle}>Hospital staff and doctor accounts. Admin-only.</p>
      <div className={styles.grid}>
        {staff.map((u) => (
          <div key={u.id} className={styles.card}>
            <span className={styles.role}>{u.role}</span>
            <h3>{u.name}</h3>
            <p>{u.email}</p>
          </div>
        ))}
      </div>
      {staff.length === 0 && <p className={styles.empty}>No staff found.</p>}
    </div>
  );
}
