
import React, { useState } from 'react';
import { Order, OrderStatus, User, UserType } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface OrderDetailsProps {
    order: Order;
    currentUser: User;
    onUpdateOrder: (order: Order) => void;
    onBack: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, currentUser, onUpdateOrder, onBack }) => {
    const { t } = useTranslation();
    const isBuyer = currentUser.type === UserType.Buyer;
    
    // State for Shipping Form
    const [shippingForm, setShippingForm] = useState({
        carrier: order.shippingDetails?.carrier || '',
        trackingNumber: order.shippingDetails?.trackingNumber || '',
        shippingDate: order.shippingDetails?.shippingDate || '',
        packagingType: order.shippingDetails?.packagingType || '',
        shippingCost: order.shippingDetails?.shippingCost || 0
    });

    const [isContractVisible, setIsContractVisible] = useState(false);

    const handleStatusUpdate = (newStatus: OrderStatus) => {
        onUpdateOrder({ ...order, status: newStatus, updatedAt: new Date().toISOString() });
    };

    const handleShippingUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedOrder: Order = {
            ...order,
            shippingDetails: shippingForm,
            status: OrderStatus.Shipped,
            updatedAt: new Date().toISOString()
        };
        onUpdateOrder(updatedOrder);
        alert(t('shippingInfo') + ' ' + t('save'));
    };

    const getStatusStep = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PendingPayment: return 1;
            case OrderStatus.Processing: return 2;
            case OrderStatus.Shipped: return 3;
            case OrderStatus.Delivered: return 4;
            case OrderStatus.Completed: return 5;
            default: return 0;
        }
    };

    const currentStep = getStatusStep(order.status);

    const ActionBanner = () => {
        if (isBuyer && order.status === OrderStatus.PendingPayment) {
            return (
                <div className="bg-yellow-50 border-r-4 border-yellow-500 p-6 mb-6 rounded-l shadow-sm animate-pulse">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <p className="font-bold text-yellow-800 text-lg">{t('buyerActionPay')}</p>
                            <p className="text-yellow-700 mt-1">برجاء تأكيد تحويل المبلغ لحساب المنصة (Escrow) لبدء التجهيز.</p>
                        </div>
                        <button 
                            onClick={() => handleStatusUpdate(OrderStatus.Processing)} 
                            className="bg-yellow-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-yellow-700 font-bold transition transform hover:scale-105"
                        >
                             ✓ {t('confirmAction')}
                        </button>
                    </div>
                </div>
            );
        }
        if (!isBuyer && order.status === OrderStatus.Processing) {
            return (
                <div className="bg-blue-50 border-r-4 border-blue-500 p-6 mb-6 rounded-l shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <p className="font-bold text-blue-800 text-lg">{t('sellerActionShip')}</p>
                            <p className="text-blue-700 mt-1">المشتري قام بتأكيد الدفع. يرجى تجهيز الطلب وتحديث بيانات الشحن أدناه.</p>
                        </div>
                    </div>
                </div>
            );
        }
        if (isBuyer && order.status === OrderStatus.Shipped) {
             return (
                <div className="bg-green-50 border-r-4 border-green-500 p-6 mb-6 rounded-l shadow-sm animate-pulse">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <p className="font-bold text-green-800 text-lg">{t('confirmReceipt')}</p>
                            <p className="text-green-700 mt-1">بمجرد استلام الشحنة والتأكد من الجودة، اضغط تأكيد لتحويل المبلغ للبائع.</p>
                        </div>
                         <button 
                            onClick={() => handleStatusUpdate(OrderStatus.Completed)} 
                            className="bg-green-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-green-700 font-bold transition transform hover:scale-105"
                        >
                             ✓ {t('confirmAction')}
                        </button>
                    </div>
                </div>
            );
        }
        return null;
    };

    const Timeline = () => (
        <div className="w-full py-8 px-4 bg-gray-50 rounded-xl mb-8">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
                {[OrderStatus.PendingPayment, OrderStatus.Processing, OrderStatus.Shipped, OrderStatus.Completed].map((stepStatus, index) => {
                    const stepNum = index + 1;
                    const isActive = stepNum <= currentStep;
                    const isCompleted = stepNum < currentStep;
                    return (
                        <React.Fragment key={stepStatus}>
                            <div className="relative flex flex-col items-center flex-1">
                                <div className={`rounded-full transition-all duration-500 h-12 w-12 flex items-center justify-center border-4 z-10 ${isActive ? 'bg-green-600 border-green-200 text-white shadow-lg scale-110' : 'bg-white border-gray-200 text-gray-400'}`}>
                                    {isCompleted ? '✓' : stepNum}
                                </div>
                                <div className={`absolute top-14 text-center w-32 text-xs font-bold ${isActive ? 'text-green-700' : 'text-gray-400'}`}>
                                    {t(stepStatus)}
                                </div>
                            </div>
                            {index < 3 && (
                                <div className={`flex-auto border-t-4 transition-colors duration-500 ${isActive && currentStep > stepNum ? 'border-green-500' : 'border-gray-200'}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
            {/* Header */}
            <div className="bg-green-800 p-6 text-white flex justify-between items-center">
                <button onClick={onBack} className="flex items-center gap-2 font-bold hover:bg-green-700 px-4 py-2 rounded-lg transition">
                   <span className="text-2xl">→</span> {t('dashboard')}
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-bold">{t('orderDetails', { id: order.id.split('-')[1] })}</h2>
                    <p className="text-green-200 text-sm">{order.productName} - {order.quantityKg} كجم</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-inner ${order.status === OrderStatus.Completed ? 'bg-green-500 text-white' : 'bg-yellow-400 text-yellow-900'}`}>
                    {t(order.status)}
                </span>
            </div>

            <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
                
                <Timeline />
                
                <ActionBanner />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Details Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                            <span>📦</span> ملخص الصفقة
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-500">المنتج:</span>
                                <span className="font-bold text-gray-800">{order.productName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">الكمية:</span>
                                <span className="font-bold text-gray-800">{order.quantityKg} كجم</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">سعر الوحدة:</span>
                                <span className="font-bold text-gray-800">{t('pricePerKg', { price: order.pricePerKg })}</span>
                            </div>
                            <div className="pt-4 border-t flex justify-between items-center">
                                <span className="text-gray-600 font-bold">الإجمالي:</span>
                                <span className="text-2xl font-black text-green-700">{t('priceEGP', { price: order.totalPrice.toLocaleString() })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Info Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                            <span>🚚</span> بيانات الشحن والتوصيل
                        </h3>
                        
                        {isBuyer ? (
                            order.shippingDetails?.shippingDate ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">شركة الشحن/السائق:</span>
                                        <span className="font-bold">{order.shippingDetails.carrier}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">رقم التتبع/الجوال:</span>
                                        <span className="font-bold text-blue-600 underline">{order.shippingDetails.trackingNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">تاريخ الوصول المتوقع:</span>
                                        <span className="font-bold text-green-600">{order.shippingDetails.shippingDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">التعبئة:</span>
                                        <span className="font-bold">{order.shippingDetails.packagingType}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-4">
                                    <p>بانتظار قيام البائع بشحن الطلب وتحديث البيانات.</p>
                                </div>
                            )
                        ) : (
                            <form onSubmit={handleShippingUpdate} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs text-gray-500 mb-1">شركة الشحن / السائق</label>
                                        <input type="text" required value={shippingForm.carrier} onChange={e => setShippingForm({...shippingForm, carrier: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="مثلاً: شركة الفرسان" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">رقم التتبع / هاتف السائق</label>
                                        <input type="text" required value={shippingForm.trackingNumber} onChange={e => setShippingForm({...shippingForm, trackingNumber: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="01xxxxxxxxx" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">تاريخ الشحن/التسليم</label>
                                        <input type="date" required value={shippingForm.shippingDate} onChange={e => setShippingForm({...shippingForm, shippingDate: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500" />
                                    </div>
                                </div>
                                <button type="submit" disabled={order.status === OrderStatus.Completed} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md disabled:bg-gray-300">
                                    تحديث بيانات الشحن ونقل الحالة
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Contract Section */}
                <div className="bg-gray-100 rounded-2xl p-8 text-center border-2 border-dashed border-gray-300">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">العقد الذكي الموثق</h3>
                    <p className="text-gray-600 mb-6">تم توليد عقد إلكتروني يحفظ حقوق الطرفين وموثق عبر منصة عكوب.</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => setIsContractVisible(true)} className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition flex items-center gap-2">
                            <span>📄</span> {t('viewContract')}
                        </button>
                        <button onClick={() => alert('جاري التحميل...')} className="bg-white border-2 border-gray-800 text-gray-800 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition flex items-center gap-2">
                            <span>⬇️</span> {t('downloadContract')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Contract Modal */}
            {isContractVisible && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setIsContractVisible(false)}>
                    <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-10 relative" onClick={e => e.stopPropagation()}>
                         <button onClick={() => setIsContractVisible(false)} className="absolute top-6 left-6 text-3xl text-gray-400 hover:text-red-500 transition">&times;</button>
                         <div className="text-center mb-10 border-b pb-8">
                             <h2 className="text-4xl font-serif font-bold text-gray-900 mb-2">عقد بيع تمور إلكتروني</h2>
                             <p className="text-sm text-gray-500 uppercase tracking-widest">موثق رقم: {order.id}</p>
                         </div>
                         <div className="space-y-8 text-gray-800 leading-relaxed text-lg">
                             <div className="p-4 bg-gray-50 rounded-lg">
                                <p><strong>الطرف الأول (المشتري):</strong> {order.buyerId}</p>
                                <p><strong>الطرف الثاني (البائع):</strong> رمز {order.sellerCode}</p>
                             </div>
                             <p><strong>موضوع التعاقد:</strong> يلتزم الطرف الثاني بتوريد كمية {order.quantityKg} كجم من {order.productName} للطرف الأول، طبقاً للمواصفات المتفق عليها في طلب عرض السعر.</p>
                             <p><strong>القيمة المالية:</strong> القيمة الإجمالية للعقد هي {order.totalPrice.toLocaleString()} جنيهاً مصرياً، تُدفع عبر منصة عكوب وتُحفظ كأمانة حتى استلام الطرف الأول للبضاعة.</p>
                             <p><strong>الضمانات:</strong> تضمن المنصة جودة المنتج ومطابقته للمواصفات، وفي حالة النزاع يتم التحكيم عبر خبراء المنصة.</p>
                             <p className="pt-10 text-center font-bold text-gray-400 italic">تم التوقيع إلكترونياً عند قبول العرض وتأكيد الدفع</p>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
