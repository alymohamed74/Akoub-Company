
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface ProductFormProps {
    existingProduct: Product | null;
    onSave: (productData: Omit<Product, 'id' | 'sellerId' | 'sellerName'>) => void;
    onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ existingProduct, onSave, onClose }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [pricePerKg, setPricePerKg] = useState('');
    const [grades, setGrades] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (existingProduct) {
            setName(existingProduct.name);
            setDescription(existingProduct.description);
            setPricePerKg(existingProduct.pricePerKg.toString());
            setGrades(existingProduct.grades.join(', '));
            setImageUrl(existingProduct.imageUrl);
        } else {
            setName('');
            setDescription('');
            setPricePerKg('');
            setGrades('');
            setImageUrl('images/placeholder.jpg');
        }
    }, [existingProduct]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name,
            description,
            pricePerKg: parseFloat(pricePerKg),
            grades: grades.split(',').map(g => g.trim()).filter(g => g !== ''),
            imageUrl,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl animate-scale-in" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-800">{existingProduct ? t('editProduct') : t('addNewProduct')}</h3>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{t('productName')}</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none transition" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{t('productDescription')}</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} required className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none transition h-24" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">{t('pricePerKgLabelShort') || 'السعر للكيلو'}</label>
                                <input type="number" value={pricePerKg} onChange={e => setPricePerKg(e.target.value)} required className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">{t('qualityGrades')}</label>
                                <input type="text" value={grades} onChange={e => setGrades(e.target.value)} placeholder={t('qualityGradesPlaceholder')} className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none transition" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{t('productImage')}</label>
                            <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-green-500 outline-none transition text-xs" />
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button type="submit" className="flex-1 bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 shadow-lg transition transform hover:-translate-y-1">
                            {t('save')}
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-xl hover:bg-gray-200 transition">
                            {t('cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductForm;
