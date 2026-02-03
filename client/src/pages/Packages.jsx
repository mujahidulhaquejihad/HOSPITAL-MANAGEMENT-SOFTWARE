import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import styles from './Packages.module.css';

const PACKAGES = [
  {
    id: 'pre-ramadan',
    title: 'Pre-Ramadan Health Check Package',
    tag: 'PRE - RAMADAN',
    price: 3500,
    includes: [
      'Fasting blood glucose',
      'Lipid profile (cholesterol, triglycerides)',
      'Kidney function (creatinine, urea)',
      'Liver function (ALT, AST, bilirubin)',
      'Complete blood count (CBC)',
      'Urine routine',
      'General physician consultation',
    ],
  },
  {
    id: 'executive',
    title: 'Executive Health Check (Male / Female)',
    tag: 'EXECUTIVE',
    price: 12000,
    includes: [
      'Cardiac markers (troponin, lipid profile)',
      'Diabetes panel (fasting glucose, HbA1c)',
      'Thyroid function (TSH)',
      'Complete blood count (CBC)',
      'Urine analysis',
      'Chest X-ray',
      'ECG',
      'Physician consultation & report review',
    ],
  },
  {
    id: 'heart-men',
    title: 'Heart Check (For Men)',
    tag: 'HEART CHECK',
    price: 5500,
    includes: [
      'Lipid profile (total cholesterol, LDL, HDL, triglycerides)',
      'Troponin',
      'ECG',
      'Echocardiogram (if advised)',
      'Cardiologist consultation',
    ],
  },
  {
    id: 'heart-women',
    title: 'Heart Check (For Women)',
    tag: 'HEART CHECK',
    price: 4500,
    includes: [
      'Lipid profile',
      'Fasting blood sugar',
      'ECG',
      'Cardiologist consultation',
    ],
  },
  {
    id: 'whole-body-men-45plus',
    title: 'Whole Body Check (Men 45+)',
    tag: 'WHOLE BODY',
    price: 15000,
    includes: [
      'PSA (prostate screening)',
      'Diabetes panel',
      'Cardiac markers & lipid profile',
      'Kidney & liver function',
      'Complete blood count (CBC)',
      'Thyroid (TSH)',
      'Urine routine',
      'Chest X-ray',
      'ECG',
      'Physician review & consultation',
    ],
  },
  {
    id: 'whole-body-men-below45',
    title: 'Whole Body Check (Men Below 45)',
    tag: 'WHOLE BODY',
    price: 8500,
    includes: [
      'Routine blood (CBC, sugar, lipid)',
      'Liver function',
      'Kidney function',
      'Thyroid (TSH)',
      'Urine routine',
      'General physician consultation',
    ],
  },
  {
    id: 'whole-body-women-45plus',
    title: 'Whole Body Check (Women 45+)',
    tag: 'WHOLE BODY',
    price: 18000,
    includes: [
      'Mammography',
      'Bone density (DEXA)',
      'Thyroid & cardiac markers',
      'Diabetes & lipid profile',
      'CBC, kidney & liver function',
      'Gynaecology consultation',
      'Physician review & report',
    ],
  },
  {
    id: 'whole-body-women-below45',
    title: 'Whole Body Check (Women Below 45)',
    tag: 'WHOLE BODY',
    price: 7500,
    includes: [
      'Complete blood count (CBC)',
      'Blood sugar & lipid profile',
      'Thyroid (TSH)',
      'Liver & kidney function',
      'Urine routine',
      'General physician consultation',
    ],
  },
];

export default function Packages() {
  const { t } = useLanguage();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className={styles.wrap}>
      <section className={styles.section}>
        <div className={styles.inner}>
          <h1 className={styles.title}>{t('packages_title')}</h1>
          <p className={styles.subtitle}>{t('packages_sub')}</p>
          <div className={styles.list}>
            {PACKAGES.map((pkg) => (
              <article key={pkg.id} id={pkg.id} className={styles.card}>
                <span className={styles.tag}>{pkg.tag}</span>
                <h2 className={styles.cardTitle}>{pkg.title}</h2>
                <div className={styles.priceWrap}>
                  <span className={styles.priceLabel}>{t('package_price')}</span>
                  <span className={styles.price}>৳{pkg.price.toLocaleString()}</span>
                </div>
                <div className={styles.includesWrap}>
                  <h3 className={styles.includesTitle}>{t('package_includes')}</h3>
                  <ul className={styles.includesList}>
                    {pkg.includes.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.bookingWrap}>
                  <span className={styles.bookingLabel}>{t('package_booking_options')}</span>
                  <div className={styles.bookingBtns}>
                    <Link to={`/login?redirect=${encodeURIComponent('/dashboard/book')}`} className={styles.ctaPrimary}>
                      {t('request_package')}
                    </Link>
                    <Link to="/doctors" className={styles.ctaSecondary}>{t('find_doctor')}</Link>
                  </div>
                  <p className={styles.bookingNote}>{t('package_booking_note')}</p>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.footerCta}>
            <Link to="/" className={styles.backLink}>{t('back_to_home')}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
