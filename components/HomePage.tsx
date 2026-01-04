
import React, { useState } from 'react';
import { Product, RFQ, RfqStatus, User, UserType } from '../types';
import ProductCard from './ProductCard';
import { useTranslation } from '../i18n/LanguageContext';
import FilterBar from './FilterBar';

interface HomePageProps {
    currentUser: User | null;
    onGetStartedClick: () => void;
    products: Product[];
    rfqs: RFQ[];
    onBuyNowClick: (product: Product, quantity: number) => void;
    onBidClick: (rfqId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ currentUser, onGetStartedClick, products, rfqs, onBuyNowClick, onBidClick }) => {
  const { t, language } = useTranslation();
  
  // Filtering States
  const [productSearch, setProductSearch] = useState('');
  const [rfqSearch, setRfqSearch] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.description.toLowerCase().includes(productSearch.toLowerCase())
  );

  const openRfqs = rfqs.filter(r => 
    r.status === RfqStatus.Open && 
    (r.productName.toLowerCase().includes(rfqSearch.toLowerCase()) || 
     r.buyerName.toLowerCase().includes(rfqSearch.toLowerCase()))
  );
  
  const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const locale = language === 'ar' ? 'ar-EG' : 'en-US';
      return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleRfqButtonClick = (rfqId: string) => {
    if (!currentUser) {
        onGetStartedClick();
        return;
    }

    if (currentUser.type === UserType.Seller) {
        onBidClick(rfqId);
    } else {
        alert("عذرا تقديم عروض الأسعار خاصه بحسابات البائع فقط");
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Conditionally render Hero Section only if NOT logged in */}
      {!currentUser && (
        <section className="text-center py-16 bg-green-100 rounded-lg shadow-inner mb-12">
          <h2 className="text-4xl font-bold text-green-800 mb-4">{t('akoubPlatformForDatesTrading')}</h2>
          <p className="text-xl text-green-700 mb-8 max-w-3xl mx-auto px-4">
            {t('safeAndReliableMarket')}
          </p>
          <button 
              onClick={onGetStartedClick}
              className="bg-yellow-500 text-green-900 font-bold py-4 px-10 rounded-xl text-lg hover:bg-yellow-600 transition duration-300 shadow-lg transform hover:scale-105"
          >
              {t('getStarted')}
          </button>
        </section>
      )}

      <section className="py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h3 className="text-3xl font-bold text-gray-800">{t('availableDatesTypes')}</h3>
            <FilterBar 
                searchPlaceholder="ابحث عن نوع تمر..." 
                searchTerm={productSearch} 
                onSearchChange={setProductSearch}
                className="mb-0 w-full md:w-80"
            />
        </div>
        
        {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onBuyNowClick={onBuyNowClick} />
              ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-gray-50 rounded-xl">
                <p className="text-gray-500 text-lg">لا توجد نتائج مطابقة لبحثك في المنتجات.</p>
            </div>
        )}
      </section>

      <section className="py-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 px-4">
            <h3 className="text-3xl font-bold text-gray-800">{t('openRFQs')}</h3>
            <FilterBar 
                searchPlaceholder="ابحث في طلبات الشراء..." 
                searchTerm={rfqSearch} 
                onSearchChange={setRfqSearch}
                className="mb-0 w-full md:w-80"
            />
        </div>
        
        <div className="space-y-4 max-w-5xl mx-auto">
          {openRfqs.length > 0 ? openRfqs.map(rfq => (
             <div key={rfq.id} className="border border-gray-100 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 hover:bg-green-50 transition shadow-sm hover:shadow-md">
                <div>
                    <p className="font-black text-xl text-gray-800 mb-1">{rfq.productName}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">⚖️ {t('quantityRequested', { quantityKg: rfq.quantityKg })}</span>
                        <span className="flex items-center gap-1">⭐ {t('qualityGrade', { qualityGrade: rfq.qualityGrade })}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">{t('buyer', { name: rfq.buyerName })} | {t('createdDate', { date: formatDate(rfq.createdAt) })}</p>
                </div>
                <button 
                  onClick={() => handleRfqButtonClick(rfq.id)}
                  className="bg-green-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-700 transition shadow-md w-full sm:w-auto"
                >
                    {t('submitABid')}
                </button>
            </div>
          )) : <p className="text-gray-500 text-center py-12">{t('noOpenRFQs')}</p>}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
