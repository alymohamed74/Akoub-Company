
import React, { useState, useEffect } from 'react';
import { RFQ } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface RfqFormProps {
    existingRfq: RFQ | null;
    onSave: (rfqData: Omit<RFQ, 'id' | 'createdAt' | 'buyerId' | 'buyerName' | 'status'>) => void;
    onClose: () => void;
}

const RfqForm: React.FC<RfqFormProps> = ({ existingRfq, onSave, onClose }) => {
    const { t } = useTranslation();
    const [productName, setProductName] = useState('');
    const [quantityKg, setQuantityKg] = useState('');
    const [qualityGrade, setQualityGrade] = useState('');

    useEffect(() => {
        if (existingRfq) {
            setProductName(existingRfq.productName);
            setQuantityKg(existingRfq.quantityKg.toString());
            setQualityGrade(existingRfq.qualityGrade);
        } else {
            setProductName('');
            setQuantityKg('');
            setQualityGrade('');
        }
    }, [existingRfq]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            productName,
            quantityKg: parseFloat(quantityKg),
            qualityGrade,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h3 className="text-xl font-bold mb-4">{existingRfq ? t('editRfq') : t('createRfq')}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('productName')}</label>
                            <input type="text" value={productName} onChange={e => setProductName(e.target.value)} required className="mt-1 w-full p-2 border rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('quantityKgLabelShort')}</label>
                            <input type="number" value={quantityKg} onChange={e => setQuantityKg(e.target.value)} required className="mt-1 w-full p-2 border rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('qualityGrade', { qualityGrade: '' })}</label>
                            <input type="text" value={qualityGrade} onChange={e => setQualityGrade(e.target.value)} required placeholder={t('qualityGradesPlaceholder')} className="mt-1 w-full p-2 border rounded-md shadow-sm" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">{t('cancel')}</button>
                        <button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">{t('save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RfqForm;
