import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Doctors.module.css';

export default function Doctors() {
  const { isPatient } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [deptFilter, setDeptFilter] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetch('/api/doctors')
      .then((r) => r.json())
      .then(setDoctors)
      .catch(() => setDoctors([]));
    fetch('/api/departments')
      .then((r) => r.json())
      .then(setDepartments)
      .catch(() => setDepartments([]));
  }, []);

  const filtered = deptFilter
    ? doctors.filter((d) => d.departmentId === deptFilter)
    : doctors;

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Our Doctors</h1>
      <p className={styles.subtitle}>Browse by department and choose a doctor for your appointment.</p>

      <div className={styles.toolbar}>
        <label>
          Department
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.grid}>
        {filtered.map((doc) => (
          <article key={doc.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.dept}>{doc.departmentName}</span>
              <span className={styles.fee}>${doc.consultationFee} consultation</span>
            </div>
            <h2 className={styles.name}>{doc.doctorName}</h2>
            <p className={styles.spec}>{doc.specialization}</p>
            <p className={styles.qual}>{doc.qualification}</p>
            <p className={styles.bio}>{doc.bio}</p>
            <p className={styles.exp}>{doc.experienceYears} years experience</p>
            {isPatient && (
              <Link to={`/book?doctorId=${doc.id}`} className={styles.bookBtn}>Book appointment</Link>
            )}
          </article>
        ))}
      </div>
      {filtered.length === 0 && <p className={styles.empty}>No doctors found.</p>}
    </div>
  );
}
