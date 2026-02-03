import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Stories.module.css';

const STORIES = [
  { id: 'spinal-disc', title: 'Successful Treatment of Spinal Disc Issues (PLID)', date: '14 January 2026', summary: 'A patient with severe lower back pain and leg numbness was diagnosed with prolapsed intervertebral disc (PLID). After careful evaluation, our orthopaedic team performed a minimally invasive procedure. The patient recovered well and returned to normal activities within weeks.' },
  { id: 'head-injury-bike', title: 'Successful Treatment of Severe Head Injury Following Bike Accident', date: '08 January 2026', summary: 'A young adult was brought to our Emergency after a bike accident with significant head injury. Our neurosurgery and critical care teams worked together. After surgery and intensive care, the patient made a full recovery and was discharged with follow-up care.' },
  { id: 'congenital-heart', title: "Successful Treatment of a Child's Congenital Heart Defect", date: '23 December 2025', summary: 'A child with a congenital heart defect received comprehensive care at our Paediatric Cardiology unit. The team performed a corrective procedure. The child is now thriving with regular follow-ups.' },
  { id: 'knee-surgery', title: 'Successful Knee Surgery', date: '03 December 2025', summary: 'A patient with chronic knee pain and limited mobility underwent knee replacement surgery at Meridian General. Our orthopaedic team ensured a smooth procedure and rehabilitation. The patient now walks without pain.' },
  { id: 'head-injury', title: 'Successful Treatment of Head Injury', date: '03 December 2025', summary: 'A patient with head injury was stabilised in our Emergency and then treated by our neurosurgery team. With timely intervention and post-operative care, the patient recovered fully and was discharged.' },
];

export default function Stories() {
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
        <h1 className={styles.title}>Our Patients Share Their Stories</h1>
        <p className={styles.subtitle}>Real stories from patients who received care at Meridian General Hospital.</p>
        <div className={styles.list}>
          {STORIES.map((story) => (
            <article key={story.id} id={story.id} className={styles.card}>
              <h2 className={styles.cardTitle}>{story.title}</h2>
              <span className={styles.date}>{story.date}</span>
              <p className={styles.summary}>{story.summary}</p>
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
