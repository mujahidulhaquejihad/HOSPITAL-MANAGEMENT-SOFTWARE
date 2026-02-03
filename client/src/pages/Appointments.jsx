import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './Appointments.module.css';

export default function Appointments() {
  const { user, isDoctor, isPatient } = useAuth();
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('all'); // all | scheduled | completed

  useEffect(() => {
    const params = new URLSearchParams();
    if (user?.role === 'doctor' && user?.doctorId) params.set('doctorId', user.doctorId);
    if (user?.role === 'patient' && user?.patientId) params.set('patientId', user.patientId);
    params.set('role', user?.role);
    fetch(`/api/appointments?${params}`)
      .then((r) => r.json())
      .then(setList)
      .catch(() => setList([]));
  }, [user]);

  const filtered = filter === 'all' ? list : list.filter((a) => a.status === filter);

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Appointments</h1>
      <div className={styles.toolbar}>
        <span>Filter:</span>
        {['all', 'scheduled', 'completed'].map((f) => (
          <button
            key={f}
            type="button"
            className={filter === f ? styles.active : ''}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              {!isPatient && <th>Patient</th>}
              {!isDoctor && <th>Doctor</th>}
              <th>Department</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td>{a.date}</td>
                <td>{a.time}</td>
                {!isPatient && <td>{a.patientName}</td>}
                {!isDoctor && <td>{a.doctorName}</td>}
                <td>{a.departmentName}</td>
                <td><span className={styles[`status_${a.status}`]}>{a.status}</span></td>
                <td>{a.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && <p className={styles.empty}>No appointments found.</p>}
    </div>
  );
}
