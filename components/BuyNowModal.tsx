
import React from 'react';
import { Product } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface BuyNowModalProps {
  product: Product;
  quantity: number;
  onClose: () => void;
}

const BuyNowModal: React.FC<BuyNowModalProps> = ({ product, quantity, onClose }) => {
  const { t } = useTranslation();
  const totalPrice = product.pricePerKg * quantity;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h2 className="text-2xl font-bold text-green-800">{t('orderSummary')}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <span className="font-semibold text-gray-600">{t('product')}:</span>
              <span className="font-bold text-lg text-gray-800 float-right">{product.name}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">{t('quantity')}:</span>
              <span className="font-bold text-lg text-gray-800 float-right">{t('quantityKg', { quantity })}</span>
            </div>
            <div className="bg-green-50 p-3 rounded-md">
              <span className="font-semibold text-gray-700">{t('totalPrice')}:</span>
              <span className="font-bold text-2xl text-green-700 float-right">{t('priceEGP', { price: totalPrice.toFixed(2) })}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
             <h3 className="text-xl font-bold text-gray-800 mb-3">{t('paymentAndContact')}</h3>
             <p className="text-gray-600 mb-4">{t('paymentAndContactInstruction')}</p>
             <div className="space-y-2 text-gray-700">
                <p><strong>{t('landing_contact_phone')}:</strong> <a href="tel:01110411170" className="text-green-600 hover:underline">01110411170</a></p>
                <p><strong>{t('landing_contact_email')}:</strong> <a href="mailto:info@akoub-agri.com" className="text-green-600 hover:underline">info@akoub-agri.com</a></p>
             </div>
             <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">{t('paymentMethods')}</h4>
                <div className="flex space-x-4 rtl:space-x-reverse text-sm">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{t('bankTransfer')}</span>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">{t('vodafoneCash')}</span>
                </div>
             </div>
          </div>
          
          <div className="mt-6 text-center">
            <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition duration-300">
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNowModal;
