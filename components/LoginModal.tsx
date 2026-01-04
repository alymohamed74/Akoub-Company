
import React, { useState } from 'react';
import { UserType, User } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (userType: UserType, userData?: User) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserType>(UserType.Buyer);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    nationalId: '',
    commercialRecord: '',
    taxCard: '',
    password: '',
    confirmPassword: ''
  });
  
  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = () => {
    if (!formData.mobile || formData.mobile.length < 10) {
      alert(t('fillRequiredFields'));
      return;
    }
    // Simulate sending OTP
    alert(t('otpSentAlert'));
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (otpValue === '1234') {
      setIsOtpVerified(true);
      // alert(t('otpVerified'));
    } else {
      alert(t('invalidOtp'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'login') {
      // Simple login mock
      onLogin(role);
    } else {
      // Registration Logic
      if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
        alert(t('fillRequiredFields'));
        return;
      }
      
      if (!isOtpVerified) {
        alert(t('invalidOtp'));
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert(t('passwordsDontMatch'));
        return;
      }

      // Create new user object
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: formData.name,
        type: role,
        email: formData.email,
        mobile: formData.mobile,
        code: role === UserType.Seller ? `AKOUB${Math.floor(Math.random() * 100)}` : undefined,
        nationalId: formData.nationalId,
        commercialRecord: formData.commercialRecord,
        taxCard: formData.taxCard
      };

      alert(t('accountCreatedSuccess'));
      onLogin(role); // In real app, pass user object
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg transform transition-all max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-800">{mode === 'login' ? t('login') : t('register')}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
             {/* Role Selection */}
             <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('iAmA')}</label>
                <div className="flex gap-4">
                    <label className={`flex-1 cursor-pointer p-3 border rounded-lg text-center transition-all ${role === UserType.Buyer ? 'bg-green-50 border-green-500 text-green-700 font-bold' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <input type="radio" name="role" value={UserType.Buyer} checked={role === UserType.Buyer} onChange={() => setRole(UserType.Buyer)} className="hidden" />
                        {t('buyerRole')}
                    </label>
                    <label className={`flex-1 cursor-pointer p-3 border rounded-lg text-center transition-all ${role === UserType.Seller ? 'bg-green-50 border-green-500 text-green-700 font-bold' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <input type="radio" name="role" value={UserType.Seller} checked={role === UserType.Seller} onChange={() => setRole(UserType.Seller)} className="hidden" />
                        {t('sellerRole')}
                    </label>
                </div>
            </div>

            {mode === 'register' && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('fullName')}</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('nationalId')} <span className="text-gray-400 text-xs">{t('optional')}</span></label>
                        <input type="text" name="nationalId" value={formData.nationalId} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500" />
                    </div>
                </>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700">{mode === 'login' ? t('email') + ' / ' + t('mobileNumber') : t('email')}</label>
                <input type="text" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500" required />
            </div>

            {mode === 'register' && (
                 <div>
                    <label className="block text-sm font-medium text-gray-700">{t('mobileNumber')}</label>
                    <div className="flex gap-2 mt-1">
                        <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="flex-1 p-2 border rounded-md focus:ring-green-500 focus:border-green-500" required disabled={isOtpVerified} />
                        <button type="button" onClick={handleSendOtp} disabled={otpSent || isOtpVerified} className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm disabled:bg-gray-400 whitespace-nowrap">
                            {otpSent ? t('otpSentAlert').replace('1234', '...') : t('sendOtp')}
                        </button>
                    </div>
                    {otpSent && !isOtpVerified && (
                        <div className="mt-2 flex gap-2 animate-fade-in">
                            <input type="text" value={otpValue} onChange={(e) => setOtpValue(e.target.value)} placeholder={t('otpPlaceholder')} className="flex-1 p-2 border rounded-md border-blue-300" />
                            <button type="button" onClick={handleVerifyOtp} className="bg-green-600 text-white px-3 py-2 rounded-md text-sm">
                                {t('verifyOtp')}
                            </button>
                        </div>
                    )}
                    {isOtpVerified && <p className="text-green-600 text-sm mt-1 font-semibold">✓ {t('otpVerified')}</p>}
                </div>
            )}

            {mode === 'register' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('commercialRecord')} <span className="text-gray-400 text-xs">{t('optional')}</span></label>
                            <input type="text" name="commercialRecord" value={formData.commercialRecord} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('taxCard')} <span className="text-gray-400 text-xs">{t('optional')}</span></label>
                            <input type="text" name="taxCard" value={formData.taxCard} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500" />
                        </div>
                    </div>
                </>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700">{t('password')}</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500" required />
            </div>

            {mode === 'register' && (
                 <div>
                    <label className="block text-sm font-medium text-gray-700">{t('confirmPassword')}</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500" required />
                </div>
            )}

            <div className="pt-4">
                <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 text-lg"
                >
                {mode === 'login' ? t('login') : t('register')}
                </button>
            </div>
          </form>

          <div className="mt-6 text-center border-t pt-4">
            <button 
                onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setFormData({ ...formData, password: '', confirmPassword: '' });
                }} 
                className="text-green-700 font-semibold hover:underline"
            >
              {mode === 'login' ? t('dontHaveAccount') : t('alreadyHaveAccount')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
