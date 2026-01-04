import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-green-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>{t('copyright', { year: new Date().getFullYear() })}</p>
        <div className="mt-2">
          <a href="#" className="hover:underline mx-2">{t('privacyPolicy')}</a>
          <a href="#" className="hover:underline mx-2">{t('termsOfUse')}</a>
          <a href="#" className="hover:underline mx-2">{t('contactUs')}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
