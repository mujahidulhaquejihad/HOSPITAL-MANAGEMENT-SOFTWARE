import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminHeaders } from '../api/adminApi';
import styles from './Staff.module.css';

const emptyStaff = { name: '', email: '', password: 'staff123' };
const emptyDoctor = { name: '', email: '', password: 'doctor123', departmentId: '', specialization: '', qualification: '', experienceYears: 8, consultationFee: 1000, bio: '' };

export default function Staff() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [mode, setMode] = useState(null); // 'staff' | 'doctor' | null
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [staffForm, setStaffForm] = useState(emptyStaff);
  const [doctorForm, setDoctorForm] = useState(emptyDoctor);
  const [message, setMessage] = useState({ type: '', text: '' });

  const load = () => {
    fetch('/api/users').then((r) => r.json()).then(setUsers).catch(() => setUsers([]));
    fetch('/api/doctors').then((r) => r.json()).then(setDoctors).catch(() => setDoctors([]));
    fetch('/api/departments').then((r) => r.json()).then(setDepartments).catch(() => setDepartments([]));
  };

  useEffect(() => { load(); }, []);

  const staffList = users.filter((u) => u.role === 'staff');
  const doctorUserIds = doctors.map((d) => d.userId);
  const doctorUsers = users.filter((u) => u.role === 'doctor' && doctorUserIds.includes(u.id));

  const openAddStaff = () => {
    setMode('staff');
    setEditingUserId(null);
    setStaffForm(emptyStaff);
    setMessage({ type: '', text: '' });
  };

  const openAddDoctor = () => {
    setMode('doctor');
    setEditingDoctorId(null);
    setDoctorForm(emptyDoctor);
    setMessage({ type: '', text: '' });
  };

  const openEditStaff = (u) => {
    setMode('staff');
    setEditingUserId(u.id);
    setStaffForm({ name: u.name, email: u.email, password: '' });
    setMessage({ type: '', text: '' });
  };

  const openEditDoctor = (u) => {
    const doc = doctors.find((d) => d.userId === u.id);
    if (!doc) return;
    setMode('doctor');
    setEditingDoctorId(doc.id);
    setDoctorForm({
      name: u.name,
      email: u.email,
      password: '',
      departmentId: doc.departmentId,
      specialization: doc.specialization,
      qualification: doc.qualification || '',
      experienceYears: doc.experienceYears ?? 8,
      consultationFee: doc.consultationFee ?? 1000,
      bio: doc.bio || '',
    });
    setMessage({ type: '', text: '' });
  };

  const closeForm = () => {
    setMode(null);
    setEditingUserId(null);
    setEditingDoctorId(null);
    setStaffForm(emptyStaff);
    setDoctorForm(emptyDoctor);
  };

  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      if (editingUserId) {
        const body = { name: staffForm.name, email: staffForm.email };
        if (staffForm.password) body.password = staffForm.password;
        const res = await fetch(`/api/users/${editingUserId}`, { method: 'PATCH', headers: adminHeaders(), body: JSON.stringify(body) });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
        setMessage({ type: 'success', text: 'Staff updated.' });
      } else {
        const res = await fetch('/api/users/staff', { method: 'POST', headers: adminHeaders(), body: JSON.stringify(staffForm) });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
        setMessage({ type: 'success', text: 'Staff added.' });
      }
      await load();
      closeForm();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Request failed' });
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      if (editingDoctorId) {
        const body = { name: doctorForm.name, email: doctorForm.email, departmentId: doctorForm.departmentId, specialization: doctorForm.specialization, qualification: doctorForm.qualification, experienceYears: doctorForm.experienceYears, consultationFee: doctorForm.consultationFee, bio: doctorForm.bio };
        if (doctorForm.password) body.password = doctorForm.password;
        const res = await fetch(`/api/doctors/${editingDoctorId}`, { method: 'PATCH', headers: adminHeaders(), body: JSON.stringify(body) });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
        setMessage({ type: 'success', text: 'Doctor updated.' });
      } else {
        const res = await fetch('/api/doctors', { method: 'POST', headers: adminHeaders(), body: JSON.stringify(doctorForm) });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
        setMessage({ type: 'success', text: 'Doctor added.' });
      }
      await load();
      closeForm();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Request failed' });
    }
  };

  const handleDeleteUser = async (id) => {
    if (id === 'user-admin') return;
    if (!window.confirm('Remove this user? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE', headers: adminHeaders() });
      if (!res.ok) throw new Error('Failed');
      await load();
      setMessage({ type: 'success', text: 'User removed.' });
    } catch {
      setMessage({ type: 'error', text: 'Could not remove user.' });
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Remove this doctor? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE', headers: adminHeaders() });
      if (!res.ok) throw new Error('Failed');
      await load();
      setMessage({ type: 'success', text: 'Doctor removed.' });
    } catch {
      setMessage({ type: 'error', text: 'Could not remove doctor.' });
    }
  };

  if (!isAdmin) {
    return (
      <div className={styles.wrap}>
        <h1 className={styles.title}>Staff & Doctors</h1>
        <p className={styles.subtitle}>Only administrators can manage staff and doctors.</p>
        <div className={styles.grid}>
          {[...staffList, ...doctorUsers].map((u) => (
            <div key={u.id} className={styles.card}>
              <span className={styles.role}>{u.role}</span>
              <h3>{u.name}</h3>
              <p>{u.email}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>Staff & Doctors</h1>
          <p className={styles.subtitle}>Admin-only: add, edit, or remove staff and doctor accounts.</p>
        </div>
        <div className={styles.headActions}>
          <button type="button" className={styles.addBtn} onClick={openAddStaff}>Add Staff</button>
          <button type="button" className={styles.addBtn} onClick={openAddDoctor}>Add Doctor</button>
        </div>
      </div>

      {message.text && (
        <div className={message.type === 'success' ? styles.success : styles.error}>{message.text}</div>
      )}

      {mode === 'staff' && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>{editingUserId ? 'Edit Staff' : 'Add Staff'}</h2>
          <form onSubmit={handleStaffSubmit} className={styles.form}>
            <label>Name <input value={staffForm.name} onChange={(e) => setStaffForm((f) => ({ ...f, name: e.target.value }))} required /></label>
            <label>Email <input type="email" value={staffForm.email} onChange={(e) => setStaffForm((f) => ({ ...f, email: e.target.value }))} required /></label>
            {!editingUserId && <label>Password <input type="password" value={staffForm.password} onChange={(e) => setStaffForm((f) => ({ ...f, password: e.target.value }))} placeholder="default: staff123" /></label>}
            {editingUserId && <label>New password (optional) <input type="password" value={staffForm.password} onChange={(e) => setStaffForm((f) => ({ ...f, password: e.target.value }))} placeholder="leave blank to keep" /></label>}
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn}>{editingUserId ? 'Save' : 'Add'}</button>
              <button type="button" className={styles.cancelBtn} onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {mode === 'doctor' && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>{editingDoctorId ? 'Edit Doctor' : 'Add Doctor'}</h2>
          <form onSubmit={handleDoctorSubmit} className={styles.form}>
            <label>Name <input value={doctorForm.name} onChange={(e) => setDoctorForm((f) => ({ ...f, name: e.target.value }))} required /></label>
            <label>Email <input type="email" value={doctorForm.email} onChange={(e) => setDoctorForm((f) => ({ ...f, email: e.target.value }))} required /></label>
            {!editingDoctorId && <label>Password <input type="password" value={doctorForm.password} onChange={(e) => setDoctorForm((f) => ({ ...f, password: e.target.value }))} placeholder="default: doctor123" /></label>}
            {editingDoctorId && <label>New password (optional) <input type="password" value={doctorForm.password} onChange={(e) => setDoctorForm((f) => ({ ...f, password: e.target.value }))} /></label>}
            <label>Department <select value={doctorForm.departmentId} onChange={(e) => setDoctorForm((f) => ({ ...f, departmentId: e.target.value }))} required>
              <option value="">Select</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select></label>
            <label>Specialization <input value={doctorForm.specialization} onChange={(e) => setDoctorForm((f) => ({ ...f, specialization: e.target.value }))} required /></label>
            <label>Qualification <input value={doctorForm.qualification} onChange={(e) => setDoctorForm((f) => ({ ...f, qualification: e.target.value }))} /></label>
            <label>Experience (years) <input type="number" min={0} value={doctorForm.experienceYears} onChange={(e) => setDoctorForm((f) => ({ ...f, experienceYears: parseInt(e.target.value, 10) || 0 }))} /></label>
            <label>Consultation fee <input type="number" min={0} value={doctorForm.consultationFee} onChange={(e) => setDoctorForm((f) => ({ ...f, consultationFee: parseInt(e.target.value, 10) || 0 }))} /></label>
            <label>Bio <input value={doctorForm.bio} onChange={(e) => setDoctorForm((f) => ({ ...f, bio: e.target.value }))} /></label>
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn}>{editingDoctorId ? 'Save' : 'Add'}</button>
              <button type="button" className={styles.cancelBtn} onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Staff</h2>
        <div className={styles.grid}>
          {staffList.map((u) => (
            <div key={u.id} className={styles.card}>
              <span className={styles.role}>staff</span>
              <h3>{u.name}</h3>
              <p>{u.email}</p>
              <div className={styles.cardActions}>
                <button type="button" className={styles.editBtn} onClick={() => openEditStaff(u)}>Edit</button>
                <button type="button" className={styles.delBtn} onClick={() => handleDeleteUser(u.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Doctors</h2>
        <div className={styles.grid}>
          {doctorUsers.map((u) => {
            const doc = doctors.find((d) => d.userId === u.id);
            const dept = departments.find((d) => d.id === doc?.departmentId);
            return (
              <div key={u.id} className={styles.card}>
                <span className={styles.role}>doctor</span>
                <h3>{u.name}</h3>
                <p>{u.email}</p>
                {doc && <p className={styles.spec}>{doc.specialization} · {dept?.name}</p>}
                {doc && (
                  <div className={styles.cardActions}>
                    <button type="button" className={styles.editBtn} onClick={() => openEditDoctor(u)}>Edit</button>
                    <button type="button" className={styles.delBtn} onClick={() => handleDeleteDoctor(doc.id)}>Remove</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Admin</h2>
        <div className={styles.grid}>
          {users.filter((u) => u.role === 'admin').map((u) => (
            <div key={u.id} className={styles.card}>
              <span className={styles.role}>admin</span>
              <h3>{u.name}</h3>
              <p>{u.email}</p>
              <p className={styles.muted}>Cannot be removed.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
