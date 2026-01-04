
import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';

const LandingFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-start">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2 inline-block">{t('akoub')}</h3>
            <p className="text-gray-400 text-lg">{t('landing_hero_title')}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2 inline-block">{t('landing_contact_title')}</h3>
            <ul className="space-y-4">
              <li className="flex items-center justify-center md:justify-start group">
                <svg className="w-6 h-6 ml-3 text-green-500 group-hover:scale-110 transition" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                <a href={`tel:${t('landing_contact_phone')}`} className="hover:text-white transition text-lg">{t('landing_contact_phone')}</a>
              </li>
              <li className="flex items-center justify-center md:justify-start group">
                <svg className="w-6 h-6 ml-3 text-green-500 group-hover:scale-110 transition" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                <a href={`mailto:${t('landing_contact_email')}`} className="hover:text-white transition text-lg">{t('landing_contact_email')}</a>
              </li>
              {/* <li className="flex items-center justify-center md:justify-start">
                <svg className="w-6 h-6 ml-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                <span className="text-lg">{t('landing_contact_location')}</span>
              </li> */}
            </ul>
          </div>
          <div>
             <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2 inline-block">موقعنا</h3>
             <div className="rounded-2xl overflow-hidden h-60 shadow-2xl border border-gray-700">
                <img 
                    src="images/map.jpg" 
                    alt="Map" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500" 
                />
             </div>
          </div>
        </div>
      </div>
      <div className="bg-black py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 font-bold">
          <p>{t('landing_footer_copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
