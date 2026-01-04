
import React, { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';

interface LandingHeaderProps {
    onNavigateToMarketplace: () => void;
}

const Logo = () => {
    const { t } = useTranslation();
    
    return (
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className=" p-1 rounded-xl shadow-md overflow-hidden w-10 h-10 flex items-center justify-center">
              <img 
                src="images/logo2.png" 
                alt="Akoub Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://img.icons8.com/color/96/date-palm.png';
                }}
              />
          </div>
          <span className="font-bold text-2xl text-white select-none tracking-wide">{t('akoub')}</span>
      </div>
    );
};

const LandingHeader: React.FC<LandingHeaderProps> = ({ onNavigateToMarketplace }) => {
    const { t, language, setLanguage } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleLanguage = () => {
        setLanguage(language === 'ar' ? 'en' : 'ar');
    };
    
    const navLinks = (
        <>
            <button
                onClick={onNavigateToMarketplace}
                className="w-full md:w-auto text-left md:text-center block px-6 py-2.5 text-lg font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 shadow-md transition duration-300 transform hover:scale-105"
            >
                {t('landing_header_enter_marketplace')}
            </button>
            <button
                onClick={toggleLanguage}
                className="w-full md:w-auto text-left md:text-center block px-4 py-2 text-lg text-gray-300 hover:text-white transition duration-300 font-semibold"
            >
                {language === 'ar' ? 'English' : 'العربية'}
            </button>
        </>
    );

    return (
        <header className="bg-green-900 bg-opacity-90 backdrop-blur-md text-white sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center">
                    <Logo />
                </div>
                
                <nav className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
                    {navLinks}
                </nav>

                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none p-2 rounded-lg hover:bg-green-800">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                        </svg>
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden px-4 pt-2 pb-6 space-y-3 border-t border-green-800 animate-fade-in bg-green-900">
                    {navLinks}
                </div>
            )}
        </header>
    );
};

export default LandingHeader;
