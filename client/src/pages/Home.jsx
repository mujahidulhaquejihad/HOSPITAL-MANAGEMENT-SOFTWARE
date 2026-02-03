import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import styles from './Home.module.css';

export default function Home() {
  const { t } = useLanguage();
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>{t('welcome_title')}</h2>
          <p className={styles.heroSub}>{t('welcome_sub')}</p>
          <div className={styles.heroCtas}>
            <Link to="/doctors" className={styles.heroCta}>{t('find_doctor')}</Link>
            <Link to="/login?redirect=%2Fdashboard%2Fbook" className={styles.heroCta}>{t('request_appointment')}</Link>
            <Link to="/login?redirect=%2Fdashboard%2Freports" className={styles.heroCta}>{t('online_report')}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
