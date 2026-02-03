import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import styles from './AboutUs.module.css';

export default function AboutUs() {
  const { t } = useLanguage();
  return (
    <div className={styles.wrap}>
      <section className={styles.section}>
        <div className={styles.container}>
          <h1 className={styles.title}>{t('about_title')}</h1>
          <p className={styles.lead}>{t('about_lead')}</p>
          <p className={styles.body}>{t('about_body')}</p>
          <ul className={styles.list}>
            <li>{t('why_list_1')}</li>
            <li>{t('why_list_2')}</li>
            <li>{t('why_list_3')}</li>
            <li>{t('why_list_4')}</li>
            <li>{t('why_list_5')}</li>
          </ul>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <h2 className={styles.heading}>{t('visitors_guide')}</h2>
          <div className={styles.guide}>
            <p><strong>Visiting hours:</strong> 10:00 AM – 8:00 PM (general wards). ICU visitors by arrangement.</p>
            <p><strong>Parking:</strong> Available at the basement and adjacent lot. Follow signs to Meridian General.</p>
            <p><strong>What to bring:</strong> Valid ID, previous reports (if any), and insurance card if applicable.</p>
            <p><strong>Registration:</strong> Ground floor reception. For appointments, login to the portal or call 10678.</p>
            <p><strong>Emergency:</strong> 24/7 Emergency entrance. Dial 10678 or +880 1710-000000.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.heading}>{t('corporate_services')}</h2>
          <p className={styles.body}>{t('corporate_body')}</p>
          <p className={styles.body}>
            <strong>{t('operating_hours')}</strong> 9:00 AM to 5:00 PM (except government holidays). We offer comprehensive healthcare management to address customized needs.
          </p>
        </div>
      </section>

      <div className={styles.ctaWrap}>
        <Link to="/doctors" className={styles.cta}>{t('find_doctor')}</Link>
        <Link to="/contact" className={styles.ctaOutline}>{t('send_query_cta')}</Link>
      </div>
    </div>
  );
}
