
import React from 'react';
import { User } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface HeaderProps {
  currentUser: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onNavigateToLanding: () => void;
  page: 'marketplace' | 'dashboard';
  onNavigate: (page: 'marketplace' | 'dashboard') => void;
}

const Logo = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group" onClick={() => window.location.href = '/'}>
        <div className="relative w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <img 
                src="images/logo2.png"
                alt="Akoub Logo" 
                className="w-full h-full object-contain p-1 group-hover:scale-110 transition duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://img.icons8.com/color/96/date-palm.png';
                }}
            />
        </div>
        <span className="font-bold text-2xl text-gray-800 tracking-tight group-hover:text-green-700 transition">{t('akoub')}</span>
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ currentUser, onLoginClick, onLogout, onNavigateToLanding, page, onNavigate }) => {
  const { t, language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const navButtonClasses = "py-2 px-3 rounded-lg transition duration-300";
  const activeNavClasses = "text-green-700 font-bold bg-green-50";
  const inactiveNavClasses = "text-gray-600 hover:text-green-700 font-semibold";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Logo />
        <nav className="flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          {currentUser && (
            <div className="hidden md:flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
               <button
                onClick={() => onNavigate('marketplace')}
                className={`${navButtonClasses} ${page === 'marketplace' ? activeNavClasses : inactiveNavClasses}`}
              >
                {t('marketplace')}
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`${navButtonClasses} ${page === 'dashboard' ? activeNavClasses : inactiveNavClasses}`}
              >
                {t('dashboard')}
              </button>
            </div>
          )}

          <button
            onClick={(e) => { e.preventDefault(); onNavigateToLanding(); }}
            className={`${navButtonClasses} ${inactiveNavClasses} hidden sm:block`}
          >
            {t('backToLanding')}
          </button>
          <button
            onClick={toggleLanguage}
            className={`${navButtonClasses} ${inactiveNavClasses} text-sm`}
          >
            {language === 'ar' ? 'English' : 'العربية'}
          </button>
          
          {currentUser ? (
            <div className="flex items-center space-x-2 md:space-x-4 rtl:space-x-reverse">
              <span className="text-gray-700 hidden sm:block font-bold">{t('welcomeUser', { name: currentUser.name.split(' ')[0] })}</span>
              <button
                onClick={onLogout}
                className="bg-red-50 text-red-600 font-bold py-2 px-4 rounded-lg hover:bg-red-600 hover:text-white transition duration-300"
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-green-600 text-white font-bold py-2 px-6 rounded-xl hover:bg-green-700 shadow-lg transition duration-300 transform hover:scale-105 active:scale-95"
            >
              {t('loginSignup')}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
