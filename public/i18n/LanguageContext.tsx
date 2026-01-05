import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [translations, setTranslations] = useState<{ [key in Language]: any } | null>(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        // Use fetch to load JSON files for better browser compatibility
        const [arResponse, enResponse] = await Promise.all([
          fetch('/i18n/ar.json'),
          fetch('/i18n/en.json')
        ]);
        
        const arData = await arResponse.json();
        const enData = await enResponse.json();
        
        setTranslations({ ar: arData, en: enData });
      } catch (error) {
        console.error("Failed to load translation files:", error);
      }
    };

    fetchTranslations();
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }) => {
    if (!translations) {
      return key; // Return key as fallback while translations are loading
    }
    let translation = translations[language]?.[key] || key;
    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        translation = translation.replace(`{{${placeholder}}}`, String(replacements[placeholder]));
      });
    }
    return translation;
  }, [language, translations]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
