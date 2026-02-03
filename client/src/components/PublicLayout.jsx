import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import styles from './PublicLayout.module.css';

export default function PublicLayout() {
  const { lang, setLang, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const toggleLang = () => setLang(lang === 'en' ? 'bn' : 'en');

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <button type="button" className={styles.langBtn} onClick={toggleLang} aria-label={lang === 'en' ? 'Switch to Bangla' : 'Switch to English'} title={lang === 'en' ? t('view_in_bangla') : t('view_in_english')}>
            {lang === 'en' ? t('lang_bangla') : t('lang_name')}
          </button>
          <Link to="/login" className={styles.topBarLogin}>{t('patient_portal')}</Link>
        </div>
      </div>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={styles.menuIcon} />
            <span className={styles.menuIcon} />
            <span className={styles.menuIcon} />
          </button>
          <Link to="/" className={styles.logo} onClick={closeMenu}>
            <img src="/Meridian.png" alt="Meridian General Hospital" className={styles.logoImg} />
          </Link>
          <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} aria-hidden={!menuOpen}>
            <NavLink to="/" end onClick={closeMenu}>{t('nav_home')}</NavLink>
            <NavLink to="/about" onClick={closeMenu}>{t('nav_about')}</NavLink>
            <NavLink to="/doctors" onClick={closeMenu}>{t('find_doctor')}</NavLink>
            <NavLink to="/specialities" onClick={closeMenu}>{t('nav_specialities')}</NavLink>
            <NavLink to="/packages" onClick={closeMenu}>{t('nav_health_check')}</NavLink>
            <NavLink to="/stories" onClick={closeMenu}>{t('nav_stories')}</NavLink>
            <NavLink to="/contact" onClick={closeMenu}>{t('nav_send_query')}</NavLink>
          </nav>
          <div className={styles.headerRight}>
            <Link to="/signup" className={styles.signupBtn} onClick={closeMenu}>{t('sign_up')}</Link>
            <Link to="/login" className={styles.loginBtn} onClick={closeMenu}>{t('login')}</Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLinks}>
            <Link to="/doctors">{t('find_doctor_link')}</Link>
            <Link to="/login?redirect=%2Fdashboard%2Fbook">{t('request_appointment_link')}</Link>
            <Link to="/login?redirect=%2Fdashboard%2Freports">{t('online_report_link')}</Link>
            <Link to="/contact">{t('send_query_link')}</Link>
            <Link to="/about">{t('nav_about')}</Link>
            <Link to="/specialities">{t('nav_specialities')}</Link>
            <Link to="/packages">{t('nav_health_check')}</Link>
            <Link to="/stories">{t('nav_stories')}</Link>
          </div>
          <div className={styles.footerAddress}>
            <strong>{t('footer_dhaka')}</strong><br />
            {t('footer_address')}
          </div>
          <div className={styles.footerContact}>
            <p><strong>{t('footer_one_stop')}</strong> 10678</p>
            <p><strong>{t('email')}:</strong> info@meridiangeneral.com.bd</p>
          </div>
          <p className={styles.footerCopy}>© {t('copyright')} {new Date().getFullYear()} Meridian General Hospital. {t('all_rights')}</p>
        </div>
      </footer>
    </div>
  );
}
