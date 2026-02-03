import React from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, isPatient, isDoctor, isStaff, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>My Profile</h1>
      <p className={styles.subtitle}>Your account and profile information.</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Account</h2>
        <dl className={styles.dl}>
          <dt>Name</dt>
          <dd>{user.name}</dd>
          <dt>Email (login ID)</dt>
          <dd>{user.email}</dd>
          <dt>Role</dt>
          <dd className={styles.role}>{user.role}</dd>
        </dl>
      </section>

      {isPatient && user.patient && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Patient details</h2>
          <dl className={styles.dl}>
            <dt>Date of birth</dt>
            <dd>{user.patient.dateOfBirth || '—'}</dd>
            <dt>Blood group</dt>
            <dd>{user.patient.bloodGroup || '—'}</dd>
            <dt>Phone</dt>
            <dd>{user.patient.phone || '—'}</dd>
            <dt>Address</dt>
            <dd>{user.patient.address || '—'}</dd>
            <dt>Emergency contact</dt>
            <dd>{user.patient.emergencyContact || '—'}</dd>
          </dl>
        </section>
      )}

      {isDoctor && user.doctor && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Doctor details</h2>
          <dl className={styles.dl}>
            <dt>Department</dt>
            <dd>{user.doctor.department?.name || user.doctor.departmentId || '—'}</dd>
            <dt>Specialization</dt>
            <dd>{user.doctor.specialization || '—'}</dd>
            <dt>Qualification</dt>
            <dd>{user.doctor.qualification || '—'}</dd>
            <dt>Experience</dt>
            <dd>{user.doctor.experienceYears != null ? `${user.doctor.experienceYears} years` : '—'}</dd>
            <dt>Consultation fee</dt>
            <dd>{user.doctor.consultationFee != null ? `৳${user.doctor.consultationFee}` : '—'}</dd>
            <dt>Bio</dt>
            <dd>{user.doctor.bio || '—'}</dd>
          </dl>
        </section>
      )}

      {(isStaff || isAdmin) && !user.doctor && (
        <section className={styles.section}>
          <p className={styles.muted}>Staff and admin profiles show account info above. Contact admin to update your details.</p>
        </section>
      )}
    </div>
  );
}
