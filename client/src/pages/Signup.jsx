import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import styles from './Signup.module.css';

export default function Signup() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    bloodGroup: '',
    phone: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onlyDigitsAndPlus = (s) => /^[\d+\s\-()]*$/.test(s) && (s.replace(/\D/g, '').length >= 10);
  const sanitizePhone = (v) => v.replace(/[^\d+\s\-()]/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!/\d/.test(form.password) || !/[a-zA-Z]/.test(form.password)) {
      setError('Password must contain both letters and numbers');
      return;
    }
    if (form.phone.trim() && !onlyDigitsAndPlus(form.phone)) {
      setError(t('invalid_phone'));
      return;
    }
    if (form.emergencyContactPhone.trim() && !onlyDigitsAndPlus(form.emergencyContactPhone)) {
      setError(t('invalid_phone'));
      return;
    }
    setLoading(true);
    try {
      const email = form.email.trim().toLowerCase();
      const password = form.password.trim();
      const emergencyContact =
        [form.emergencyContactName.trim(), form.emergencyContactPhone.trim()].filter(Boolean).length > 0
          ? [form.emergencyContactName.trim(), form.emergencyContactPhone.trim()].join(' – ')
          : undefined;
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email,
          password,
          dateOfBirth: form.dateOfBirth || undefined,
          bloodGroup: form.bloodGroup || undefined,
          phone: form.phone.trim() || undefined,
          address: form.address || undefined,
          emergencyContact,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <Link to="/" className={styles.logoWrap}>
            <img src="/Meridian.png" alt="Meridian General Hospital" className={styles.logoImg} />
          </Link>
          <h1 className={styles.title}>{t('account_created')}</h1>
          <p className={styles.subtitle}>{t('account_created_sub')}</p>
          <div className={styles.successBox}>
            <p><strong>{t('login_id_email')}</strong> {form.email}</p>
            <p>{t('use_password')}</p>
          </div>
          <Link to="/login" className={styles.submit}>{t('go_to_login')}</Link>
        </div>
      </div>
    );
  }

  return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
        <Link to="/" className={styles.backLink}>{t('back_to_home_link')}</Link>
        <Link to="/" className={styles.logoWrap}>
          <img src="/Meridian.png" alt="Meridian General Hospital" className={styles.logoImg} />
        </Link>
        <h1 className={styles.title}>{t('patient_signup')}</h1>
        <p className={styles.subtitle}>{t('signup_sub')}</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          <label>{t('full_name')} <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required placeholder="Your name" /></label>
          <label>{t('login_id_email_label')} <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required placeholder="you@example.com" /></label>
          <label>{t('password_label')} <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required placeholder="At least 8 characters, letters and numbers" minLength={8} /></label>
          <label>{t('confirm_password')} <input type="password" value={form.confirmPassword} onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))} required placeholder="Same as above" /></label>
          <label>{t('date_of_birth')} <input type="date" value={form.dateOfBirth} onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))} /></label>
          <label>
            {t('blood_group')}
            <select value={form.bloodGroup} onChange={(e) => setForm((f) => ({ ...f, bloodGroup: e.target.value }))}>
              <option value="">{t('select_blood_group')}</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </label>
          <label>{t('phone')} <input type="tel" inputMode="numeric" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: sanitizePhone(e.target.value) }))} placeholder="+880 1XXX XXXXXX" pattern="[\d+\s\-()]*" title={t('numbers_only')} /></label>
          <label>{t('address')} <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="City, area" /></label>
          <fieldset className={styles.emergencyFieldset}>
            <legend>{t('emergency_contact')}</legend>
            <label>{t('emergency_contact_name')} <input value={form.emergencyContactName} onChange={(e) => setForm((f) => ({ ...f, emergencyContactName: e.target.value }))} placeholder={t('full_name')} /></label>
            <label>{t('emergency_contact_phone')} <input type="tel" inputMode="numeric" value={form.emergencyContactPhone} onChange={(e) => setForm((f) => ({ ...f, emergencyContactPhone: sanitizePhone(e.target.value) }))} placeholder="+880 1XXX XXXXXX" pattern="[\d+\s\-()]*" title={t('numbers_only')} /></label>
          </fieldset>
          <button type="submit" disabled={loading} className={styles.submit}>
            {loading ? t('creating') : t('create_account_btn')}
          </button>
        </form>
        <p className={styles.loginLink}>{t('already_have')} <Link to="/login">{t('log_in')}</Link></p>
      </div>
    </div>
  );
}
