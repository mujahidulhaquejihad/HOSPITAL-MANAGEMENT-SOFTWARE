import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Home.module.css';

function scrollToSection(id) {
  if (!id) return;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const SPECIALITIES = [
  'Accident & Emergency',
  'Cardiology Care Centre',
  'Neurology',
  'Orthopaedics',
  'Paediatrics',
  'General Medicine',
  'Dermatology',
  'Internal Medicine',
  'Diagnostic & Interventional Radiology',
  'ENT & Head Neck Surgery',
  'Gastroenterology & Hepatology',
  'Obstetrics and Gynaecology',
  'Ophthalmology',
  'Lab Medicine',
  'Critical Care Units',
  'Physical Medicine & Rehabilitation',
  'Dental & Maxillofacial Surgery',
  'Psychiatry',
  'Nephrology',
  'Respiratory Medicine',
];

const HEALTH_PACKAGES = [
  { id: 'pre-ramadan', title: 'Pre-Ramadan Health Check Package', tag: 'PRE - RAMADAN' },
  { id: 'executive', title: 'Executive Health Check (Male / Female)', tag: 'EXECUTIVE' },
  { id: 'heart-men', title: 'Heart Check (For Men)', tag: 'HEART CHECK' },
  { id: 'heart-women', title: 'Heart Check (For Women)', tag: 'HEART CHECK' },
  { id: 'whole-body-men-45plus', title: 'Whole Body Check (Men 45+)', tag: 'WHOLE BODY' },
  { id: 'whole-body-men-below45', title: 'Whole Body Check (Men Below 45)', tag: 'WHOLE BODY' },
  { id: 'whole-body-women-45plus', title: 'Whole Body Check (Women 45+)', tag: 'WHOLE BODY' },
  { id: 'whole-body-women-below45', title: 'Whole Body Check (Women Below 45)', tag: 'WHOLE BODY' },
];

const PATIENT_STORIES = [
  { id: 'spinal-disc', title: 'Successful Treatment of Spinal Disc Issues (PLID)', date: '14 January 2026' },
  { id: 'head-injury-bike', title: 'Successful Treatment of Severe Head Injury Following Bike Accident', date: '08 January 2026' },
  { id: 'congenital-heart', title: "Successful Treatment of a Child's Congenital Heart Defect", date: '23 December 2025' },
  { id: 'knee-surgery', title: 'Successful Knee Surgery', date: '03 December 2025' },
  { id: 'head-injury', title: 'Successful Treatment of Head Injury', date: '03 December 2025' },
];

export default function Home() {
  const location = useLocation();
  const [querySent, setQuerySent] = useState(false);
  const [queryForm, setQueryForm] = useState({ name: '', email: '', phone: '', message: '' });

  // Scroll to section when hash in URL (e.g. /#about or after clicking header link)
  useEffect(() => {
    const hash = location.hash.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }, [location.pathname, location.hash]);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    scrollToSection(sectionId);
    window.history.pushState(null, '', `/#${sectionId}`);
  };

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    setQuerySent(true);
    setQueryForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <span>English</span>
          <Link to="/login" className={styles.topBarLogin}>Patient Portal</Link>
        </div>
      </div>

      {/* Main header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.logo}>
            <Link to="/">Meridian General Hospital</Link>
          </h1>
          <nav className={styles.nav}>
            <a href="/#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a>
            <a href="/#about" onClick={(e) => handleNavClick(e, 'about')}>About Us</a>
            <a href="/#specialities" onClick={(e) => handleNavClick(e, 'specialities')}>Specialities</a>
            <a href="/#health-check" onClick={(e) => handleNavClick(e, 'health-check')}>Health Check</a>
            <a href="/#stories" onClick={(e) => handleNavClick(e, 'stories')}>Patient Stories</a>
            <a href="/#query" onClick={(e) => handleNavClick(e, 'query')}>Send Query</a>
          </nav>
          <div className={styles.headerRight}>
            <Link to="/login" className={styles.loginBtn}>Login</Link>
          </div>
        </div>
      </header>

      {/* Hero / CTA strip */}
      <section className={styles.hero} id="home">
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>Welcome to Meridian General Hospital Dhaka</h2>
          <p className={styles.heroSub}>Quality healthcare. Compassionate service. Your health, our priority.</p>
          <div className={styles.heroCtas}>
            <Link to="/login?redirect=%2Fdashboard%2Fdoctors" className={styles.heroCta}>Find a Doctor</Link>
            <Link to="/login?redirect=%2Fdashboard%2Fbook" className={styles.heroCta}>Request an Appointment</Link>
            <Link to="/login?redirect=%2Fdashboard%2Freports" className={styles.heroCta}>Online Report</Link>
            <Link to="/#visitors-guide" className={styles.heroCta}>Patient & Visitors Guide</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={styles.section} id="about">
        <div className={styles.container}>
          <h2 className={styles.sectionHead}>Why Choose Meridian General Hospital Dhaka</h2>
          <p className={styles.whyBody}>
            Meridian General Hospital Dhaka is a multidisciplinary super-specialty tertiary care hospital committed to international standards of care. We combine advanced medical technology with compassionate service. The hospital is equipped with state-of-the-art facilities, cutting-edge diagnostic services, and modern surgical techniques, and is staffed by a team of experienced physicians, trained nurses, and skilled technicians across various medical disciplines.
          </p>
          <ul className={styles.whyList}>
            <li>Multi-specialty tertiary care</li>
            <li>Experienced specialist doctors and dedicated staff</li>
            <li>Modern diagnostic and surgical facilities</li>
            <li>24/7 Emergency & Critical Care</li>
            <li>Patient-centred, compassionate care</li>
          </ul>
        </div>
      </section>

      {/* Our Specialities */}
      <section className={styles.sectionAlt} id="specialities">
        <div className={styles.container}>
          <h2 className={styles.sectionHead}>Our Specialities</h2>
          <div className={styles.specGrid}>
            {SPECIALITIES.map((name) => (
              <div key={name} className={styles.specCard}>{name}</div>
            ))}
          </div>
          <div className={styles.specCta}>
            <Link to="/login?redirect=%2Fdashboard%2Fdoctors" className={styles.linkBtn}>Find a Doctor</Link>
          </div>
        </div>
      </section>

      {/* Health Check Packages */}
      <section className={styles.section} id="health-check">
        <div className={styles.container}>
          <h2 className={styles.sectionHead}>Health Check Packages</h2>
          <div className={styles.packageGrid}>
            {HEALTH_PACKAGES.map((pkg) => (
              <div key={pkg.id} className={styles.packageCard}>
                <span className={styles.packageTag}>{pkg.tag}</span>
                <h3 className={styles.packageTitle}>{pkg.title}</h3>
                <Link to={`/packages#${pkg.id}`} className={styles.seePackage}>See Package</Link>
              </div>
            ))}
          </div>
          <div className={styles.specCta}>
            <Link to="/packages" className={styles.linkBtn}>View All Packages</Link>
          </div>
        </div>
      </section>

      {/* Ask Meridian / Send Query */}
      <section className={styles.sectionAlt} id="query">
        <div className={styles.container}>
          <h2 className={styles.sectionHead}>Ask Meridian</h2>
          <p className={styles.askSub}>Looking for quality care? We are here to support you.</p>
          {querySent ? (
            <div className={styles.querySuccess}>
              Thank you. Your query has been received. We will get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleQuerySubmit} className={styles.queryForm}>
              <input type="text" placeholder="Your Name" value={queryForm.name} onChange={(e) => setQueryForm((f) => ({ ...f, name: e.target.value }))} required />
              <input type="email" placeholder="Email" value={queryForm.email} onChange={(e) => setQueryForm((f) => ({ ...f, email: e.target.value }))} required />
              <input type="tel" placeholder="Phone" value={queryForm.phone} onChange={(e) => setQueryForm((f) => ({ ...f, phone: e.target.value }))} />
              <textarea placeholder="Your Message" rows={4} value={queryForm.message} onChange={(e) => setQueryForm((f) => ({ ...f, message: e.target.value }))} required />
              <button type="submit" className={styles.submitBtn}>Send Query</button>
            </form>
          )}
        </div>
      </section>

      {/* Patient Stories */}
      <section className={styles.section} id="stories">
        <div className={styles.container}>
          <h2 className={styles.sectionHead}>Our Patients Share Their Stories</h2>
          <div className={styles.storiesGrid}>
            {PATIENT_STORIES.map((story) => (
              <div key={story.id} className={styles.storyCard}>
                <h3 className={styles.storyTitle}>{story.title}</h3>
                <span className={styles.storyDate}>{story.date}</span>
                <Link to={`/stories#${story.id}`} className={styles.readMore}>Read More</Link>
              </div>
            ))}
          </div>
          <div className={styles.specCta}>
            <Link to="/stories" className={styles.linkBtn}>View All Stories</Link>
          </div>
        </div>
      </section>

      {/* Patient & Visitors Guide */}
      <section className={styles.sectionAlt} id="visitors-guide">
        <div className={styles.container}>
          <h2 className={styles.sectionHead}>Patient & Visitors Guide</h2>
          <div className={styles.visitorsContent}>
            <p className={styles.body}><strong>Visiting hours:</strong> 10:00 AM – 8:00 PM (general wards). ICU visitors by arrangement.</p>
            <p className={styles.body}><strong>Parking:</strong> Available at the basement and adjacent lot. Follow signs to Meridian General.</p>
            <p className={styles.body}><strong>What to bring:</strong> Valid ID, previous reports (if any), and insurance card if applicable.</p>
            <p className={styles.body}><strong>Registration:</strong> Ground floor reception. For appointments, login to the portal or call 10678.</p>
            <p className={styles.body}><strong>Emergency:</strong> 24/7 Emergency entrance. Dial 10678 or +880 1710-000000.</p>
          </div>
        </div>
      </section>

      {/* Corporate / Service info */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <h2 className={styles.sectionHead}>Corporate Services</h2>
          <p className={styles.body}>
            For the convenience of corporate clients, Meridian General Hospital operates a dedicated One-Stop Service Desk. This ensures prompt assistance and streamlined experiences for referral patients and corporate patients. <strong>Operating hours:</strong> 9:00 AM to 5:00 PM (except government holidays). We offer comprehensive healthcare management to address customized needs.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLinks}>
            <Link to="/login?redirect=%2Fdashboard%2Fdoctors">Find a Doctor</Link>
            <Link to="/login?redirect=%2Fdashboard%2Fbook">Request an Appointment</Link>
            <Link to="/login?redirect=%2Fdashboard%2Freports">Online Report</Link>
            <a href="/#query" onClick={(e) => handleNavClick(e, 'query')}>Send Query</a>
            <a href="/#about" onClick={(e) => handleNavClick(e, 'about')}>About Us</a>
            <a href="/#specialities" onClick={(e) => handleNavClick(e, 'specialities')}>Specialities</a>
            <a href="/#health-check" onClick={(e) => handleNavClick(e, 'health-check')}>Health Check</a>
            <a href="/#stories" onClick={(e) => handleNavClick(e, 'stories')}>Patient Stories</a>
          </div>
          <div className={styles.footerAddress}>
            <strong>Dhaka</strong><br />
            Meridian General Hospital Dhaka, Plot # 81, Block-E, Bashundhara R/A, Dhaka 1229, Bangladesh.
          </div>
          <div className={styles.footerContact}>
            <p><strong>One-Stop Service:</strong> 10678</p>
            <p><strong>Email:</strong> info@meridiangeneral.com.bd</p>
          </div>
          <p className={styles.footerCopy}>© Copyright {new Date().getFullYear()} Meridian General Hospital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
