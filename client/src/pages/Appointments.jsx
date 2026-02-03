import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { roleHeaders } from '../api/adminApi';
import { time24To12, TIME_SLOTS_12H } from '../utils/timeFormat';
import styles from './Appointments.module.css';

export default function Appointments() {
  const { user, isDoctor, isPatient, isStaff, isAdmin } = useAuth();
  const [list, setList] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [createForm, setCreateForm] = useState({
    mode: 'anyone',
    patientId: '',
    patientName: '',
    patientPhone: '',
    doctorId: '',
    date: '',
    time: '09:00',
    notes: '',
  });
  const [editForm, setEditForm] = useState({ date: '', time: '', status: 'scheduled', notes: '' });

  const staffCanManage = isStaff || isAdmin;
  const canCreateAppointment = isAdmin || isStaff || isDoctor;

  const loadAppointments = () => {
    const params = new URLSearchParams();
    if (user?.role === 'doctor' && user?.doctorId) params.set('doctorId', user.doctorId);
    if (user?.role === 'patient' && user?.patientId) params.set('patientId', user.patientId);
    if (user?.role) params.set('role', user.role);
    fetch(`/api/appointments?${params}`, { headers: roleHeaders() })
      .then((r) => (r.ok ? r.json() : Promise.resolve([])))
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch(() => setList([]));
  };

  useEffect(() => {
    if (!user) return;
    loadAppointments();
    if (canCreateAppointment) {
      fetch('/api/patients', { headers: roleHeaders() })
        .then((r) => (r.ok ? r.json() : Promise.resolve([])))
        .then((data) => setPatients(Array.isArray(data) ? data : []))
        .catch(() => setPatients([]));
      fetch('/api/doctors')
        .then((r) => r.json())
        .then(setDoctors)
        .catch(() => setDoctors([]));
    }
  }, [user?.role, user?.doctorId, user?.patientId, canCreateAppointment]);

  const filtered = filter === 'all' ? list : list.filter((a) => a.status === filter);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    const isExisting = createForm.mode === 'existing';
    if (isExisting && !createForm.patientId) {
      setMessage({ type: 'error', text: 'Please select a patient.' });
      return;
    }
    if (!isExisting && (!createForm.patientName?.trim() || !createForm.patientPhone?.trim())) {
      setMessage({ type: 'error', text: 'Please enter patient name and phone.' });
      return;
    }
    try {
      const body = {
        doctorId: createForm.doctorId,
        date: createForm.date,
        time: createForm.time,
        notes: createForm.notes || '',
      };
      if (isExisting) body.patientId = createForm.patientId;
      else {
        body.patientName = createForm.patientName.trim();
        body.patientPhone = createForm.patientPhone.trim();
      }
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: roleHeaders(),
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to create');
      setMessage({ type: 'success', text: 'Appointment created.' });
      setShowCreate(false);
      setCreateForm({ mode: 'anyone', patientId: '', patientName: '', patientPhone: '', doctorId: '', date: '', time: '09:00', notes: '' });
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
        {canCreateAppointment && (
          <button type="button" className={styles.addBtn} onClick={() => setShowCreate(true)}>Create appointment</button>
        )}
      </div>

      {message.text && (
        <div className={message.type === 'success' ? styles.success : styles.error}>{message.text}</div>
      )}

      {showCreate && canCreateAppointment && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Create appointment</h2>
          <form onSubmit={handleCreateSubmit} className={styles.form}>
            <fieldset className={styles.fieldset}>
              <legend>Patient</legend>
              <label className={styles.radioLabel}>
                <input type="radio" name="patientMode" checked={createForm.mode === 'anyone'} onChange={() => setCreateForm((f) => ({ ...f, mode: 'anyone', patientId: '' }))} />
                Anyone (enter name &amp; phone)
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="patientMode" checked={createForm.mode === 'existing'} onChange={() => setCreateForm((f) => ({ ...f, mode: 'existing', patientName: '', patientPhone: '' }))} />
                Existing patient (select from list)
              </label>
            </fieldset>
            {createForm.mode === 'anyone' ? (
              <>
                <label>Patient name <input value={createForm.patientName} onChange={(e) => setCreateForm((f) => ({ ...f, patientName: e.target.value }))} placeholder="Full name" required={createForm.mode === 'anyone'} /></label>
                <label>Patient phone <input type="tel" value={createForm.patientPhone} onChange={(e) => setCreateForm((f) => ({ ...f, patientPhone: e.target.value }))} placeholder="+880 1XXX XXXXXX" required={createForm.mode === 'anyone'} /></label>
              </>
            ) : (
              <label>Patient <select value={createForm.patientId} onChange={(e) => setCreateForm((f) => ({ ...f, patientId: e.target.value }))}>
                <option value="">Select patient</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.name} – {p.email}</option>)}
              </select></label>
            )}
            <label>Doctor <select value={createForm.doctorId} onChange={(e) => setCreateForm((f) => ({ ...f, doctorId: e.target.value }))} required>
              <option value="">Select doctor</option>
              {doctors.map((d) => <option key={d.id} value={d.id}>{d.doctorName} – {d.specialization}</option>)}
            </select></label>
            <label>Date <input type="date" value={createForm.date} onChange={(e) => setCreateForm((f) => ({ ...f, date: e.target.value }))} required min={new Date().toISOString().slice(0, 10)} /></label>
            <label>Time <select value={createForm.time} onChange={(e) => setCreateForm((f) => ({ ...f, time: e.target.value }))}>
              {TIME_SLOTS_12H.map((slot) => <option key={slot.value} value={slot.value}>{slot.label}</option>)}
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
              {TIME_SLOTS_12H.map((slot) => <option key={slot.value} value={slot.value}>{slot.label}</option>)}
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
                <td>{time24To12(a.time)}</td>
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
