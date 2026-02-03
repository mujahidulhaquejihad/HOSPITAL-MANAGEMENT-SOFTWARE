import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getPatientStories } from '../data/patientStories';
import styles from './Stories.module.css';

export default function Stories() {
  const { t } = useLanguage();
  const stories = useMemo(() => getPatientStories(), []);

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
          <h1 className={styles.title}>{t('stories_title')}</h1>
          <p className={styles.subtitle}>{t('stories_sub')}</p>

          <div className={styles.list}>
            {stories.map((story) => (
              <article key={story.id} id={story.id} className={styles.card}>
                <span className={styles.patientMeta}>{story.patientName}{story.city ? ` · ${story.city}` : ''}</span>
                <h2 className={styles.cardTitle}>{story.title}</h2>
                <span className={styles.date}>{story.date}</span>
                <p className={styles.summary}>{story.summary}</p>
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
