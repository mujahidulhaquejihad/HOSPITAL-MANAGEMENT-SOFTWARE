import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import styles from './Specialities.module.css';

// Map speciality display name to API department name (for linking to doctors)
const SPECIALITY_TO_DEPT_NAME = {
  'Accident & Emergency': 'Emergency',
  'Cardiology Care Centre': 'Cardiology',
  'Neurology': 'Neurology',
  'Orthopaedics': 'Orthopedics',
  'Paediatrics': 'Pediatrics',
  'General Medicine': 'General Medicine',
  'Dermatology': 'Dermatology',
  'Internal Medicine': 'General Medicine',
  'Critical Care Units': 'Emergency',
};

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

export default function Specialities() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetch('/api/departments')
      .then((r) => r.json())
      .then(setDepartments)
      .catch(() => setDepartments([]));
  }, []);

  const getDepartmentId = (specialityName) => {
    const deptName = SPECIALITY_TO_DEPT_NAME[specialityName];
    if (!deptName) return null;
    const dept = departments.find((d) => d.name === deptName);
    return dept ? dept.id : null;
  };

  const handleSpecialityClick = (name) => {
    const departmentId = getDepartmentId(name);
    const query = departmentId ? `?departmentId=${encodeURIComponent(departmentId)}` : '';
    if (user) {
      navigate(`/dashboard/doctors${query}`);
    } else {
      navigate(`/doctors${query}`);
    }
  };

  return (
    <div className={styles.wrap}>
      <section className={styles.section}>
        <div className={styles.container}>
          <h1 className={styles.title}>{t('specialities_title')}</h1>
          <p className={styles.subtitle}>{t('specialities_sub')}</p>
          <div className={styles.grid}>
            {SPECIALITIES.map((name) => (
              <button
                key={name}
                type="button"
                className={styles.card}
                onClick={() => handleSpecialityClick(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <div className={styles.ctaWrap}>
            <Link to={user ? '/dashboard/doctors' : '/doctors'} className={styles.cta}>{t('find_doctor')}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
