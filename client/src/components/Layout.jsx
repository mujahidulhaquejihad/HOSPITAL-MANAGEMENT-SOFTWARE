import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

export default function Layout() {
  const { user, logout, isAdmin, isDoctor, isStaff, isPatient } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
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
            <NavLink to="/">Meridian General</NavLink>
          </h1>
          <div className={styles.user}>
            <span className={styles.role}>{user?.role}</span>
            <span className={styles.name}>{user?.name}</span>
            <button type="button" className={styles.logoutBtn} onClick={handleLogout}>Log out</button>
          </div>
        </header>
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} aria-hidden={!menuOpen}>
        <NavLink to="/" end className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
        <NavLink to="/doctors" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>Doctors</NavLink>
        {isPatient && <NavLink to="/book" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>Book Appointment</NavLink>}
        <NavLink to="/appointments" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>Appointments</NavLink>
        {(isAdmin || isStaff || isDoctor) && <NavLink to="/patients" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>Patients</NavLink>}
        {isAdmin && <NavLink to="/staff" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>Staff</NavLink>}
        {isAdmin && <NavLink to="/admin" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>Admin</NavLink>}
        </nav>
      </div>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
