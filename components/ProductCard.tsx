
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface ProductCardProps {
  product: Product;
  onBuyNowClick: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuyNowClick }) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState<number | ''>(1);

  const totalPrice = useMemo(() => {
    if (quantity === '' || quantity <= 0) {
      return 0;
    }
    return product.pricePerKg * quantity;
  }, [quantity, product.pricePerKg]);

  const handleBuyNow = () => {
      if (typeof quantity === 'number' && quantity > 0) {
          onBuyNowClick(product, quantity);
      } else {
          alert(t('enterValidQuantity'));
      }
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    // Fallback to high quality Unsplash if local image is missing
    target.src = ``;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full border border-gray-100">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover transition duration-500 hover:scale-110" 
            onError={handleImageError}
        />
        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {t('available')}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h4 className="text-xl font-bold text-green-800 mb-2">{product.name}</h4>
        <p className="text-gray-600 mb-4 flex-grow line-clamp-3 text-sm">{product.description}</p>
        
        <div className="mb-4 flex items-center justify-between">
            <span className="font-bold text-xl text-green-700">{t('pricePerKg', { price: product.pricePerKg })}</span>
            <span className="text-xs text-gray-400">EGP / KG</span>
        </div>
        
        <div className="mb-4">
            <label htmlFor={`quantity-${product.id}`} className="block text-sm font-bold text-gray-700 mb-2">{t('quantityKgLabelShort')}</label>
            <div className="flex items-center">
                <input 
                    type="number" 
                    id={`quantity-${product.id}`}
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                    className="block w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                    placeholder={t('enterQuantity')}
                />
            </div>
        </div>
        
        <div className="mb-6 p-3 bg-green-50 rounded-lg border border-green-100 flex justify-between items-center">
            <span className="text-sm font-bold text-green-800">{t('totalPrice')}: </span>
            <span className="font-black text-xl text-green-700">{t('priceEGP', { price: totalPrice.toLocaleString() })}</span>
        </div>

        <button 
            onClick={handleBuyNow}
            disabled={!quantity || quantity <= 0}
            className="w-full mt-auto bg-green-600 text-white font-black py-3 px-4 rounded-xl hover:bg-green-700 transition shadow-lg transform active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {t('buyNow')}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
