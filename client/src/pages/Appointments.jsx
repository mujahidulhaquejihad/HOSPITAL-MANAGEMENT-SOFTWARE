import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { roleHeaders } from '../api/adminApi';
import styles from './Appointments.module.css';

const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

export default function Appointments() {
  const { user, isDoctor, isPatient, isStaff, isAdmin } = useAuth();
  const [list, setList] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [createForm, setCreateForm] = useState({ patientId: '', doctorId: '', date: '', time: '09:00', notes: '' });
  const [editForm, setEditForm] = useState({ date: '', time: '', status: 'scheduled', notes: '' });

  const staffCanManage = isStaff || isAdmin;

  const loadAppointments = () => {
    const params = new URLSearchParams();
    if (user?.role === 'doctor' && user?.doctorId) params.set('doctorId', user.doctorId);
    if (user?.role === 'patient' && user?.patientId) params.set('patientId', user.patientId);
    if (user?.role) params.set('role', user.role);
    fetch(`/api/appointments?${params}`)
      .then((r) => r.json())
      .then(setList)
      .catch(() => setList([]));
  };

  useEffect(() => {
    loadAppointments();
    if (staffCanManage) {
      fetch('/api/patients').then((r) => r.json()).then(setPatients).catch(() => setPatients([]));
      fetch('/api/doctors').then((r) => r.json()).then(setDoctors).catch(() => setDoctors([]));
    }
  }, [user?.role, user?.doctorId, user?.patientId, staffCanManage]);

  const filtered = filter === 'all' ? list : list.filter((a) => a.status === filter);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: roleHeaders(),
        body: JSON.stringify({
          patientId: createForm.patientId,
          doctorId: createForm.doctorId,
          date: createForm.date,
          time: createForm.time,
          notes: createForm.notes || '',
        }),
      });
      if (!res.ok) throw new Error('Failed to create');
      setMessage({ type: 'success', text: 'Appointment created.' });
      setShowCreate(false);
      setCreateForm({ patientId: '', doctorId: '', date: '', time: '09:00', notes: '' });
      loadAppointments();
    } catch {
      setMessage({ type: 'error', text: 'Could not create appointment.' });
    }
  };

  const openEdit = (apt) => {
    setEditingId(apt.id);
    setEditForm({ date: apt.date, time: apt.time, status: apt.status, notes: apt.notes || '' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch(`/api/appointments/${editingId}`, {
        method: 'PATCH',
        headers: roleHeaders(),
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed to update');
      setMessage({ type: 'success', text: 'Appointment updated.' });
      setEditingId(null);
      loadAppointments();
    } catch {
      setMessage({ type: 'error', text: 'Could not update appointment.' });
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <h1 className={styles.title}>Appointments</h1>
        {staffCanManage && (
          <button type="button" className={styles.addBtn} onClick={() => setShowCreate(true)}>Create appointment (for patient)</button>
        )}
      </div>

      {message.text && (
        <div className={message.type === 'success' ? styles.success : styles.error}>{message.text}</div>
      )}

      {showCreate && staffCanManage && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Create appointment for patient</h2>
          <form onSubmit={handleCreateSubmit} className={styles.form}>
            <label>Patient <select value={createForm.patientId} onChange={(e) => setCreateForm((f) => ({ ...f, patientId: e.target.value }))} required>
              <option value="">Select patient</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.name} – {p.email}</option>)}
            </select></label>
            <label>Doctor <select value={createForm.doctorId} onChange={(e) => setCreateForm((f) => ({ ...f, doctorId: e.target.value }))} required>
              <option value="">Select doctor</option>
              {doctors.map((d) => <option key={d.id} value={d.id}>{d.doctorName} – {d.specialization}</option>)}
            </select></label>
            <label>Date <input type="date" value={createForm.date} onChange={(e) => setCreateForm((f) => ({ ...f, date: e.target.value }))} required min={new Date().toISOString().slice(0, 10)} /></label>
            <label>Time <select value={createForm.time} onChange={(e) => setCreateForm((f) => ({ ...f, time: e.target.value }))}>
              {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select></label>
            <label>Notes <input value={createForm.notes} onChange={(e) => setCreateForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Optional" /></label>
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn}>Create</button>
              <button type="button" className={styles.cancelBtn} onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {editingId && (staffCanManage || isDoctor) && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Edit appointment</h2>
          <form onSubmit={handleEditSubmit} className={styles.form}>
            <label>Date <input type="date" value={editForm.date} onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))} required /></label>
            <label>Time <select value={editForm.time} onChange={(e) => setEditForm((f) => ({ ...f, time: e.target.value }))}>
              {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select></label>
            <label>Status <select value={editForm.status} onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}>
              <option value="scheduled">scheduled</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
            </select></label>
            <label>Notes <input value={editForm.notes} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))} /></label>
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn}>Save</button>
              <button type="button" className={styles.cancelBtn} onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.toolbar}>
        <span>Filter:</span>
        {['all', 'scheduled', 'completed', 'cancelled'].map((f) => (
          <button key={f} type="button" className={filter === f ? styles.active : ''} onClick={() => setFilter(f)}>{f}</button>
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
              {(staffCanManage || isDoctor) && <th>Actions</th>}
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
                {(staffCanManage || isDoctor) && (
                  <td>
                    <button type="button" className={styles.editBtn} onClick={() => openEdit(a)}>Edit</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && <p className={styles.empty}>No appointments found.</p>}
    </div>
  );
}
