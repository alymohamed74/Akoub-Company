
import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import LandingHeader from './LandingHeader';
import LandingFooter from './LandingFooter';
import FloatingButtons from './FloatingButtons';

import service1 from '../images/datesPlatform.jpeg';
import service2 from '../images/artificialModels.jpeg';
import service3 from '../images/countTrees.jpeg';
import service4 from '../images/sprayingPesticides.jpeg';


interface LandingPageProps {
  onNavigateToMarketplace: () => void;
}

const ServiceCard: React.FC<{ imgSrc: string; title: string; desc: string; }> = ({ imgSrc, title, desc }) => {
    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        const currentSrc = target.src;
        
        // Extension fallback logic
        if (currentSrc.includes('.jpeg')) {
            target.src = currentSrc.replace('.jpeg', '.jpg');
        } else if (currentSrc.includes('.jpg')) {
            target.src = currentSrc.replace('.jpg', '.png');
        } else {
            // Ultimate fallback to placeholder
            target.src = `https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=60&w=400`;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:translate-y-[-8px] transition-transform duration-300 flex flex-col h-full">
            <img 
                src={imgSrc} 
                alt={title} 
                className="w-full h-56 object-cover" 
                onError={handleImgError}
            />
            <div className="p-6 flex-grow">
                <h3 className="text-2xl font-bold text-green-700 mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
            </div>
        </div>
    );
};

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToMarketplace }) => {
  const { t } = useTranslation();

  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
                     url('/images/cover-site.jpeg')`
  };

  const visionStyle = {
    backgroundImage: `linear-gradient(rgba(6, 78, 59, 0), rgba(6, 78, 59, 0.85)), 
                     url('/images/ourVision.jpeg')`
  };

  return (
    <div className="bg-white text-gray-800 font-cairo overflow-x-hidden">
      <LandingHeader onNavigateToMarketplace={onNavigateToMarketplace} />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[80vh] bg-cover bg-center flex items-center justify-center text-white" style={heroStyle}>
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-2xl">{t('landing_hero_title')}</h1>
            <div className="mt-8 flex justify-center">
                 <button onClick={onNavigateToMarketplace} className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-green-700 transition shadow-lg transform hover:scale-105">
                    {t('landing_header_enter_marketplace')}
                 </button>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-16 md:py-24 px-4 container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-green-800">{t('landing_about_title')}</h2>
          <div className="w-24 h-1 bg-green-700 mx-auto mb-8"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">{t('landing_about_p1')}</p>
          <div className="bg-gray-50 p-8 md:p-12 rounded-3xl shadow-inner max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-gray-800">{t('landing_about_specializations_title')}</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right space-y-0 text-gray-700">
                <li className="flex items-start bg-white p-4 rounded-xl shadow-sm"><span className="text-green-500 text-xl ml-3">&#10003;</span><p className="text-sm md:text-base">{t('landing_about_spec1')}</p></li>
                <li className="flex items-start bg-white p-4 rounded-xl shadow-sm"><span className="text-green-500 text-xl ml-3">&#10003;</span><p className="text-sm md:text-base">{t('landing_about_spec2')}</p></li>
                <li className="flex items-start bg-white p-4 rounded-xl shadow-sm"><span className="text-green-500 text-xl ml-3">&#10003;</span><p className="text-sm md:text-base">{t('landing_about_spec3')}</p></li>
                <li className="flex items-start bg-white p-4 rounded-xl shadow-sm"><span className="text-green-500 text-xl ml-3">&#10003;</span><p className="text-sm md:text-base">{t('landing_about_spec4')}</p></li>
            </ul>
          </div>
        </section>
        
        {/* Services Section */}
        <section id="services" className="py-16 md:py-24 px-4 bg-gray-50">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold mb-4 text-green-800">{t('landing_services_title')}</h2>
                <div className="w-24 h-1 bg-green-700 mx-auto mb-12"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <ServiceCard 
                        imgSrc={service1}  
                        title={t('landing_service_dates_title')} 
                        desc={t('landing_service_dates_desc')} 
                    />
                    <ServiceCard 
                        imgSrc={service2}  
                        title={t('landing_service_1_title')} 
                        desc={t('landing_service_1_desc')} 
                    />
                    <ServiceCard 
                        imgSrc={service3}  
                        title={t('landing_service_2_title')} 
                        desc={t('landing_service_2_desc')} 
                    />
                    <ServiceCard 
                        imgSrc={service4}  
                        title={t('landing_service_3_title')} 
                        desc={t('landing_service_3_desc')} 
                    />
                </div>
            </div>
        </section>
        
        {/* Vision Section */}
        <section id="vision" className="relative py-24 px-4 bg-cover bg-center bg-fixed text-white" style={visionStyle}>
            <div className="relative z-10 container mx-auto text-center py-12">
                <h2 className="text-5xl font-bold mb-6">{t('landing_vision_title')}</h2>
                 <div className="w-32 h-1.5 bg-white mx-auto mb-10 rounded-full"></div>
                <p className="text-2xl max-w-4xl mx-auto leading-relaxed italic">{t('landing_vision_text')}</p>
            </div>
        </section>

        {/* Goals Section */}
        <section id="goals" className="py-20 md:py-32 px-4 container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4 text-green-800">{t('landing_goals_title')}</h2>
            <div className="w-24 h-1 bg-green-700 mx-auto mb-10"></div>
            <p className="text-xl text-gray-700 max-w-5xl mx-auto leading-loose">{t('landing_goals_text')}</p>
        </section>

      </main>
      
      <FloatingButtons />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
