import React, { useState } from 'react';
import { useNavigate, Navigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

function getRedirectPath(searchParams) {
  const redirect = searchParams.get('redirect');
  if (!redirect || typeof redirect !== 'string') return '/dashboard';
  const path = redirect.trim();
  if (path.startsWith('/') && !path.startsWith('//')) return path;
  return '/dashboard';
}

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = getRedirectPath(searchParams);
  if (user) return <Navigate to={redirectTo} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirectTo);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Link to="/" className={styles.backLink}>← Back to home</Link>
        <h1 className={styles.title}>Meridian General Hospital</h1>
        <p className={styles.subtitle}>Hospital Management Portal</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </label>
          <button type="submit" disabled={loading} className={styles.submit}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <div className={styles.demo}>
          <p><strong>Demo logins</strong></p>
          <p>Admin: admin@hospital.com / admin123</p>
          <p>Doctor: dr.drayeshasiddika@hospital.com / doctor123</p>
          <p>Staff: maria.akter@hospital.com / staff123</p>
          <p>Patient: rokeya.begum1@email.com / patient123</p>
        </div>
      </div>
    </div>
  );
}
