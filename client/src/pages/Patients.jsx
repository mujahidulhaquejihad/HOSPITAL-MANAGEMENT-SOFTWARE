import React, { useEffect, useState } from 'react';
import styles from './Patients.module.css';

export default function Patients() {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch('/api/patients')
      .then((r) => r.json())
      .then(setList)
      .catch(() => setList([]));
  }, []);

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Patients</h1>
      <p className={styles.subtitle}>Patient records and contact information.</p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date of birth</th>
              <th>Blood group</th>
              <th>Address</th>
              <th>Emergency contact</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>{p.phone}</td>
                <td>{p.dateOfBirth}</td>
                <td>{p.bloodGroup}</td>
                <td>{p.address}</td>
                <td>{p.emergencyContact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {list.length === 0 && <p className={styles.empty}>No patients found.</p>}
    </div>
  );
}
