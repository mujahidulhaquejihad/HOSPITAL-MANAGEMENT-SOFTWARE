import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import styles from './Layout.module.css';

export default function Layout() {
  const { user, logout, isAdmin, isDoctor, isStaff, isPatient } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLang = () => setLang(lang === 'en' ? 'bn' : 'en');

  return (
    <div className={styles.layout}>
      <div className={styles.headerWrap}>
        <header className={styles.header}>
          <button type="button" className={styles.menuBtn} onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            <span className={styles.menuIcon} />
            <span className={styles.menuIcon} />
            <span className={styles.menuIcon} />
          </button>
          <NavLink to="/dashboard" className={styles.logo}>
            <img src="/Meridian.png" alt="Meridian General Hospital" className={styles.logoImg} />
          </NavLink>
          <button type="button" className={styles.langBtn} onClick={toggleLang} aria-label="Switch language">
            {lang === 'en' ? t('lang_bangla') : t('lang_name')}
          </button>
          <div className={styles.user}>
            <span className={styles.role}>{user?.role}</span>
            <span className={styles.name}>{user?.name}</span>
            <button type="button" className={styles.logoutBtn} onClick={handleLogout}>{t('log_out')}</button>
          </div>
        </header>
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} aria-hidden={!menuOpen}>
        <Link to="/" onClick={() => setMenuOpen(false)}>{t('home')}</Link>
        <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>{t('dashboard')}</NavLink>
        <NavLink to="/dashboard/doctors" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>{t('doctors')}</NavLink>
        {isPatient && <NavLink to="/dashboard/book" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>{t('book_appointment')}</NavLink>}
        <NavLink to="/dashboard/appointments" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>{t('appointments')}</NavLink>
        <NavLink to="/dashboard/reports" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>{t('online_report_nav')}</NavLink>
        <NavLink to="/dashboard/profile" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>{t('my_profile')}</NavLink>
        {(isAdmin || isStaff || isDoctor) && <NavLink to="/dashboard/patients" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>{t('patients')}</NavLink>}
        {(isAdmin || isStaff) && <NavLink to="/dashboard/staff" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>{t('staff')}</NavLink>}
        {(isAdmin || isStaff) && <NavLink to="/dashboard/admin" className={({ isActive }) => (isActive ? styles.navActive : '')} onClick={() => setMenuOpen(false)}>{t('admin')}</NavLink>}
        </nav>
      </div>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
