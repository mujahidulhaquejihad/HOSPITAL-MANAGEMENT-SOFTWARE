import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './BookAppointment.module.css';

export default function BookAppointment() {
  const [searchParams] = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctorId');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState(preselectedDoctorId || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetch('/api/doctors')
      .then((r) => r.json())
      .then(setDoctors)
      .catch(() => setDoctors([]));
  }, []);

  useEffect(() => {
    if (preselectedDoctorId && doctors.length) setDoctorId(preselectedDoctorId);
  }, [preselectedDoctorId, doctors]);

  const patientId = user?.patientId;
  if (!patientId) return null;

  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, doctorId, date, time, notes }),
      });
      if (!res.ok) throw new Error('Failed to book');
      setMessage({ type: 'success', text: 'Appointment booked successfully.' });
      setDate('');
      setTime('09:00');
      setNotes('');
      setTimeout(() => navigate('/dashboard/appointments'), 1500);
    } catch {
      setMessage({ type: 'error', text: 'Could not book appointment. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctor = doctors.find((d) => d.id === doctorId);

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Book an appointment</h1>
      <p className={styles.subtitle}>Choose your preferred doctor and date and time.</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {message.text && (
          <div className={message.type === 'success' ? styles.success : styles.error}>{message.text}</div>
        )}
        <label>
          Doctor
          <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
            <option value="">Select a doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.doctorName} – {d.specialization} (${d.consultationFee})
              </option>
            ))}
          </select>
        </label>
        {selectedDoctor && (
          <p className={styles.doctorInfo}>
            {selectedDoctor.doctorName}, {selectedDoctor.qualification} · {selectedDoctor.departmentName}
          </p>
        )}
        <label>
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required min={new Date().toISOString().slice(0, 10)} />
        </label>
        <label>
          Time
          <select value={time} onChange={(e) => setTime(e.target.value)}>
            {timeSlots.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Notes (optional)
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Brief reason for visit..." />
        </label>
        <button type="submit" disabled={loading} className={styles.submit}>
          {loading ? 'Booking…' : 'Book appointment'}
        </button>
      </form>
    </div>
  );
}
