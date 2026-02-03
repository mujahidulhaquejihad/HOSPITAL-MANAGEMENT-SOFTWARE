import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { roleHeaders } from '../api/adminApi';
import styles from './Patients.module.css';

const emptyPatient = { name: '', email: '', password: 'patient123', dateOfBirth: '', bloodGroup: '', phone: '', address: '', emergencyContact: '' };

export default function Patients() {
  const { isAdmin, isStaff, isDoctor } = useAuth();
  const canManagePatients = isAdmin || isStaff || isDoctor;
  const [list, setList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyPatient);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const searchLower = searchQuery.trim().toLowerCase();
  const filteredList = searchLower
    ? list.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(searchLower) ||
          (p.email || '').toLowerCase().includes(searchLower) ||
          (p.phone || '').toLowerCase().includes(searchLower) ||
          (p.address || '').toLowerCase().includes(searchLower) ||
          (p.emergencyContact || '').toLowerCase().includes(searchLower) ||
          (p.bloodGroup || '').toLowerCase().includes(searchLower) ||
          (p.dateOfBirth || '').toLowerCase().includes(searchLower)
      )
    : list;

  const load = () =>
    fetch('/api/patients', { headers: roleHeaders() })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setList(Array.isArray(d) ? d : []))
      .catch(() => setList([]));

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyPatient);
    setShowForm(true);
    setMessage({ type: '', text: '' });
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      email: p.email,
      password: '',
      dateOfBirth: p.dateOfBirth || '',
      bloodGroup: p.bloodGroup || '',
      phone: p.phone || '',
      address: p.address || '',
      emergencyContact: p.emergencyContact || '',
    });
    setShowForm(true);
    setMessage({ type: '', text: '' });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyPatient);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    const body = { ...form };
    if (!body.password && editingId) delete body.password;
    try {
      if (editingId) {
        const res = await fetch(`/api/patients/${editingId}`, { method: 'PATCH', headers: roleHeaders(), body: JSON.stringify(body) });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
        setMessage({ type: 'success', text: 'Patient updated.' });
      } else {
        const res = await fetch('/api/patients', { method: 'POST', headers: roleHeaders(), body: JSON.stringify(body) });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
        setMessage({ type: 'success', text: 'Patient added.' });
      }
      await load();
      closeForm();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Request failed' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this patient? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/patients/${id}`, { method: 'DELETE', headers: roleHeaders() });
      if (!res.ok) throw new Error('Failed');
      await load();
      setMessage({ type: 'success', text: 'Patient removed.' });
    } catch {
      setMessage({ type: 'error', text: 'Could not remove patient.' });
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>Patients</h1>
          <p className={styles.subtitle}>Patient records. Admin and doctors can add, edit, or remove patients.</p>
        </div>
        {canManagePatients && (
          <button type="button" className={styles.addBtn} onClick={openAdd}>Add Patient</button>
        )}
      </div>

      {message.text && (
        <div className={message.type === 'success' ? styles.success : styles.error}>{message.text}</div>
      )}

      <div className={styles.searchWrap}>
        <label className={styles.searchLabel}>
          <span className={styles.searchLabelText}>Search patients</span>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Name, email, phone, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search patients"
          />
        </label>
        {searchQuery.trim() && (
          <span className={styles.searchMeta}>
            {filteredList.length} of {list.length} patients
          </span>
        )}
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>{editingId ? 'Edit Patient' : 'Add Patient'}</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label>Name <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required /></label>
            <label>Email <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required /></label>
            {!editingId && <label>Password <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="default: patient123" /></label>}
            <label>Date of birth <input type="date" value={form.dateOfBirth} onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))} /></label>
            <label>Blood group <input value={form.bloodGroup} onChange={(e) => setForm((f) => ({ ...f, bloodGroup: e.target.value }))} placeholder="e.g. O+" /></label>
            <label>Phone <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></label>
            <label>Address <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} /></label>
            <label>Emergency contact <input value={form.emergencyContact} onChange={(e) => setForm((f) => ({ ...f, emergencyContact: e.target.value }))} /></label>
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn}>{editingId ? 'Save' : 'Add'}</button>
              <button type="button" className={styles.cancelBtn} onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

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
              {canManagePatients && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredList.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>{p.phone}</td>
                <td>{p.dateOfBirth}</td>
                <td>{p.bloodGroup}</td>
                <td>{p.address}</td>
                <td>{p.emergencyContact}</td>
                {canManagePatients && (
                  <td>
                    <button type="button" className={styles.editBtn} onClick={() => openEdit(p)}>Edit</button>
                    <button type="button" className={styles.delBtn} onClick={() => handleDelete(p.id)}>Remove</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredList.length === 0 && !showForm && (
        <p className={styles.empty}>
          {list.length === 0 ? 'No patients found.' : 'No patients match your search.'}
        </p>
      )}
    </div>
  );
}
