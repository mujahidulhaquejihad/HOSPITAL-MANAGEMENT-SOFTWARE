import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Packages.module.css';

const PACKAGES = [
  { id: 'pre-ramadan', title: 'Pre-Ramadan Health Check Package', tag: 'PRE - RAMADAN', description: 'Comprehensive health check before Ramadan. Includes fasting glucose, lipid profile, kidney and liver function, and general wellness tests.' },
  { id: 'executive', title: 'Executive Health Check (Male / Female)', tag: 'EXECUTIVE', description: 'Full executive screening: cardiac markers, diabetes panel, thyroid, CBC, urine analysis, chest X-ray, ECG, and physician consultation.' },
  { id: 'heart-men', title: 'Heart Check (For Men)', tag: 'HEART CHECK', description: 'Cardiac-focused package: lipid profile, troponin, ECG, echocardiogram (if advised), and cardiologist consultation.' },
  { id: 'heart-women', title: 'Heart Check (For Women)', tag: 'HEART CHECK', description: 'Heart health package for women: lipid profile, blood sugar, ECG, and cardiologist consultation.' },
  { id: 'whole-body-men-45plus', title: 'Whole Body Check (Men 45+)', tag: 'WHOLE BODY', description: 'Complete health screening for men above 45: PSA, diabetes, heart, kidney, liver, CBC, and physician review.' },
  { id: 'whole-body-men-below45', title: 'Whole Body Check (Men Below 45)', tag: 'WHOLE BODY', description: 'Full body check for men under 45: routine blood, liver, kidney, sugar, lipid, and doctor consultation.' },
  { id: 'whole-body-women-45plus', title: 'Whole Body Check (Women 45+)', tag: 'WHOLE BODY', description: 'Comprehensive screening for women 45+: mammography, bone density, thyroid, cardiac, and gynaecology review.' },
  { id: 'whole-body-women-below45', title: 'Whole Body Check (Women Below 45)', tag: 'WHOLE BODY', description: 'Full check-up for women under 45: CBC, sugar, lipid, thyroid, and general physician consultation.' },
];

export default function Packages() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>Meridian General Hospital</Link>
          <Link to="/login" className={styles.loginBtn}>Login</Link>
        </div>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>Health Check Packages</h1>
        <p className={styles.subtitle}>Choose a package that fits your needs. Login to request a package or book an appointment.</p>
        <div className={styles.list}>
          {PACKAGES.map((pkg) => (
            <article key={pkg.id} id={pkg.id} className={styles.card}>
              <span className={styles.tag}>{pkg.tag}</span>
              <h2 className={styles.cardTitle}>{pkg.title}</h2>
              <p className={styles.desc}>{pkg.description}</p>
              <Link to="/login" className={styles.cta}>Request this package</Link>
            </article>
          ))}
        </div>
        <div className={styles.footerCta}>
          <Link to="/" className={styles.backLink}>← Back to home</Link>
        </div>
      </main>
    </div>
  );
}
