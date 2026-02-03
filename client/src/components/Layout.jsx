import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

export default function Layout() {
  const { user, logout, isAdmin, isDoctor, isStaff, isPatient } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.layout}>
      <div className={styles.headerWrap}>
        <header className={styles.header}>
          <button type="button" className={styles.menuBtn} onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            <span className={styles.menuIcon} />
            <span className={styles.menuIcon} />
            <span className={styles.menuIcon} />
          </button>
          <h1 className={styles.logo}>
            <NavLink to="/dashboard">Meridian General</NavLink>
          </h1>
          <div className={styles.user}>
            <span className={styles.role}>{user?.role}</span>
            <span className={styles.name}>{user?.name}</span>
            <button type="button" className={styles.logoutBtn} onClick={handleLogout}>Log out</button>
          </div>
        </header>
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} aria-hidden={!menuOpen}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
        <NavLink to="/dashboard/doctors" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>Doctors</NavLink>
        {isPatient && <NavLink to="/dashboard/book" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>Book Appointment</NavLink>}
        <NavLink to="/dashboard/appointments" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>Appointments</NavLink>
        <NavLink to="/dashboard/reports" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>Online Report</NavLink>
        {(isAdmin || isStaff || isDoctor) && <NavLink to="/dashboard/patients" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>Patients</NavLink>}
        {isAdmin && <NavLink to="/dashboard/staff" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>Staff</NavLink>}
        {isAdmin && <NavLink to="/dashboard/admin" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>Admin</NavLink>}
        </nav>
      </div>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
