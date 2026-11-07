import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../lib/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Default to PT-BR as requested by the user
  const [lang, setLang] = useState('pt');

  useEffect(() => {
    const saved = localStorage.getItem('psl_lang');
    if (saved && (saved === 'pt' || saved === 'en' || saved === 'py')) {
      setLang(saved);
    } else {
      setLang('pt');
    }
  }, []);

  const changeLang = (newLang) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('psl_lang', newLang);
    }
  };

  const t = translations[lang] || translations.pt;

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
