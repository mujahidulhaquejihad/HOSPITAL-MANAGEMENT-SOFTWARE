import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './SendQuery.module.css';

export default function SendQuery() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className={styles.wrap}>
      <section className={styles.section}>
        <div className={styles.container}>
          <h1 className={styles.title}>{t('send_query_title')}</h1>
          <p className={styles.subtitle}>{t('send_query_sub')}</p>
          {sent ? (
            <div className={styles.success}>{t('query_success')}</div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                placeholder={t('your_name')}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <input
                type="email"
                placeholder={t('email')}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
              <input
                type="tel"
                placeholder={t('phone')}
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
              <textarea
                placeholder={t('your_message')}
                rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                required
              />
              <button type="submit" className={styles.submit}>{t('send_query_btn')}</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
