import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '../data/translations';

const STORAGE_KEY = 'hospital_lang';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'bn' ? 'bn' : 'en';
    } catch {
      return 'en';
    }
  });

  const setLang = useCallback((next) => {
    const value = next === 'bn' ? 'bn' : 'en';
    setLangState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
      if (typeof document !== 'undefined') document.documentElement.lang = value;
    } catch {}
  }, []);

  React.useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key) => {
      const dict = translations[lang];
      return dict && key in dict ? dict[key] : (translations.en[key] ?? key);
    },
    [lang]
  );

  const value = { lang, setLang, t, isBangla: lang === 'bn' };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
