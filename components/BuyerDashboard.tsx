
import React, { useState, useEffect } from 'react';
import { User, RFQ, Bid, RfqStatus, BidStatus, Order, OrderStatus } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import RfqForm from './RfqForm';
import OrderDetails from './OrderDetails';
import FilterBar from './FilterBar';

interface BuyerDashboardProps {
  user: User;
  rfqs: RFQ[];
  bids: Bid[];
  orders: Order[];
  onAddRfq: (newRfqData: Omit<RFQ, 'id' | 'createdAt'>) => void;
  onUpdateRfq: (updatedRfq: RFQ) => void;
  onDeleteRfq: (rfqId: string) => void;
  onUpdateBid: (updatedBid: Bid) => void;
  onAddOrder: (newOrder: Order) => void;
  onUpdateOrder: (updatedOrder: Order) => void;
}

const StatusBadge: React.FC<{ status: RfqStatus | string }> = ({ status }) => {
    const { t } = useTranslation();
    const baseClasses = "px-3 py-1 text-sm font-semibold rounded-full";
    const statusClasses: Record<string, string> = {
        [RfqStatus.Open]: "bg-green-100 text-green-800",
        [RfqStatus.Closed]: "bg-gray-100 text-gray-800",
        [OrderStatus.PendingPayment]: "bg-yellow-100 text-yellow-800",
        [OrderStatus.Processing]: "bg-blue-100 text-blue-800",
        [OrderStatus.Shipped]: "bg-indigo-100 text-indigo-800",
        [OrderStatus.Completed]: "bg-green-200 text-green-900",
        [OrderStatus.Disputed]: "bg-red-100 text-red-900",
    };
    const translatedStatus = t(status.toLowerCase()) || status;
    return <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-100'}`}>{translatedStatus}</span>;
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ 
    user, rfqs, bids, orders, 
    onAddRfq, onUpdateRfq, onDeleteRfq, onUpdateBid,
    onAddOrder, onUpdateOrder 
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'rfqs' | 'orders'>('rfqs');
  
  // Track selection state locally
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedRfqId, setSelectedRfqId] = useState<string | null>(null);
  
  // Selection objects
  const selectedRfq = rfqs.find(r => r.id === selectedRfqId);
  const activeOrder = orders.find(o => o.id === selectedOrderId);

  // Filters
  const [rfqSearch, setRfqSearch] = useState('');
  const [rfqStatus, setRfqStatus] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('all');

  // Derived filtered lists
  const myRfqs = rfqs.filter(r => 
    r.buyerId === user.id &&
    (rfqStatus === 'all' || r.status === rfqStatus) &&
    r.productName.toLowerCase().includes(rfqSearch.toLowerCase())
  );

  const myOrders = orders.filter(o => 
    o.buyerId === user.id &&
    (orderStatus === 'all' || o.status === orderStatus) &&
    (o.productName.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.includes(orderSearch))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRfq, setEditingRfq] = useState<RFQ | null>(null);

  // Root-level sync: If RFQ is removed from props, clear local selection
  useEffect(() => {
    if (selectedRfqId && !rfqs.some(r => r.id === selectedRfqId)) {
        setSelectedRfqId(null);
    }
  }, [rfqs, selectedRfqId]);

  const getBidsForRfq = (rfqId: string): Bid[] => bids.filter(b => b.rfqId === rfqId);
  
  const handleAcceptBid = (bid: Bid, rfq: RFQ) => {
      if (window.confirm(`${t('acceptBid')}؟`)) {
          const newOrderId = `order-${Date.now()}`;
          const newOrder: Order = {
              id: newOrderId,
              rfqId: rfq.id,
              bidId: bid.id,
              buyerId: user.id,
              sellerId: bid.sellerId,
              sellerCode: bid.sellerCode,
              productName: rfq.productName,
              quantityKg: rfq.quantityKg,
              pricePerKg: bid.pricePerKg,
              totalPrice: rfq.quantityKg * bid.pricePerKg,
              status: OrderStatus.PendingPayment,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              messages: [],
              shippingDetails: {}
          };
          
          // Execute global state updates first
          onAddOrder(newOrder);
          onUpdateBid({ ...bid, status: BidStatus.Accepted });
          onUpdateRfq({ ...rfq, status: RfqStatus.Closed });

          // Local navigation logic
          setActiveTab('orders'); 
          setSelectedOrderId(newOrderId); // This tells the UI to show the timeline immediately
      }
  };

  const handleDeleteClick = (e: React.MouseEvent, rfqId: string) => {
      e.preventDefault();
      e.stopPropagation(); // ROOT FIX: Stop event bubbling to parent div
      if (window.confirm(t('confirmDeleteRfq'))) {
          onDeleteRfq(rfqId);
          if (selectedRfqId === rfqId) {
              setSelectedRfqId(null);
          }
      }
  };

  // View switch: Show OrderDetails if an order is selected and exists
  if (selectedOrderId && activeOrder) {
      return (
          <OrderDetails 
            order={activeOrder} 
            currentUser={user} 
            onUpdateOrder={onUpdateOrder} 
            onBack={() => setSelectedOrderId(null)} 
          />
      );
  }

  return (
    <div className="animate-fade-in">
        {isFormOpen && (
            <RfqForm 
                existingRfq={editingRfq}
                onSave={(data) => {
                  if (editingRfq) onUpdateRfq({ ...editingRfq, ...data });
                  else onAddRfq({ ...data, buyerId: user.id, buyerName: user.name, status: RfqStatus.Open });
                }}
                onClose={() => setIsFormOpen(false)}
            />
        )}
        
        <div className="mb-6 border-b border-gray-200 flex space-x-6 rtl:space-x-reverse">
            <button onClick={() => {setActiveTab('rfqs'); setSelectedOrderId(null);}} className={`pb-2 font-bold text-lg transition-colors ${activeTab === 'rfqs' ? 'border-b-4 border-green-600 text-green-700' : 'text-gray-500 hover:text-gray-700'}`}>
                {t('myRFQs')}
            </button>
            <button onClick={() => {setActiveTab('orders'); setSelectedOrderId(null);}} className={`pb-2 font-bold text-lg transition-colors ${activeTab === 'orders' ? 'border-b-4 border-green-600 text-green-700' : 'text-gray-500 hover:text-gray-700'}`}>
                {t('orders')} ({myOrders.length})
            </button>
        </div>

        {activeTab === 'rfqs' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">طلباتي النشطة</h3>
                        <button onClick={() => { setEditingRfq(null); setIsFormOpen(true); }} className="bg-green-600 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-green-700 transition shadow-lg">
                            +
                        </button>
                    </div>

                    <FilterBar 
                        searchPlaceholder="ابحث في طلباتك..."
                        searchTerm={rfqSearch}
                        onSearchChange={setRfqSearch}
                        statusFilter={rfqStatus}
                        onStatusChange={setRfqStatus}
                        statusOptions={[
                            { label: 'مفتوح', value: RfqStatus.Open },
                            { label: 'مغلق', value: RfqStatus.Closed }
                        ]}
                    />

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {myRfqs.length > 0 ? myRfqs.map(rfq => (
                            <div key={rfq.id} onClick={() => setSelectedRfqId(rfq.id)} className={`p-4 rounded-xl border-2 cursor-pointer transition ${selectedRfqId === rfq.id ? 'bg-green-50 border-green-500 shadow-md' : 'bg-gray-50 border-transparent hover:border-green-200'}`}>
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-gray-800">{rfq.productName}</h4>
                                    <StatusBadge status={rfq.status} />
                                </div>
                                <p className="text-sm text-gray-500 mt-2">{rfq.quantityKg} كجم - {rfq.qualityGrade}</p>
                                <div className="mt-3 flex gap-4">
                                    <button onClick={(e) => { e.stopPropagation(); setEditingRfq(rfq); setIsFormOpen(true); }} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition">✏️ {t('edit')}</button>
                                    <button onClick={(e) => handleDeleteClick(e, rfq.id)} className="text-xs font-bold text-red-600 hover:text-red-800 transition">🗑️ {t('delete')}</button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 text-gray-400">
                                <p>لا توجد طلبات تطابق الفلترة</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
                    <h3 className="text-2xl font-bold mb-6">العروض المستلمة</h3>
                    {selectedRfq ? (
                        <div className="space-y-4">
                            <h4 className="text-green-700 font-bold border-b pb-2 text-lg">عروض لـ: {selectedRfq.productName}</h4>
                            {getBidsForRfq(selectedRfq.id).length > 0 ? getBidsForRfq(selectedRfq.id).map(bid => (
                                <div key={bid.id} className="p-6 border border-gray-100 rounded-2xl bg-gray-50 flex justify-between items-center shadow-sm hover:shadow-md transition">
                                    <div>
                                        <p className="font-bold text-lg text-gray-800 mb-1">بائع #{bid.sellerCode}</p>
                                        <p className="text-green-600 font-black text-2xl">{t('pricePerKg', { price: bid.pricePerKg })}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleAcceptBid(bid, selectedRfq)}
                                        disabled={selectedRfq.status !== RfqStatus.Open}
                                        className="bg-green-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-green-700 transition disabled:bg-gray-400 shadow-lg transform hover:-translate-y-1"
                                    >
                                        {t('acceptBid')}
                                    </button>
                                </div>
                            )) : <div className="text-center py-20 text-gray-400"><p>لا توجد عروض لهذا الطلب بعد</p></div>}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
                            <span className="text-6xl mb-6">🔍</span>
                            <p className="text-lg">اختر طلباً من القائمة الجانبية لمراجعة عروض المزارعين.</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'orders' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h3 className="text-2xl font-bold">{t('orders')}</h3>
                    <FilterBar 
                        searchPlaceholder="ابحث باسم المنتج أو رقم الصفقة..."
                        searchTerm={orderSearch}
                        onSearchChange={setOrderSearch}
                        statusFilter={orderStatus}
                        onStatusChange={setOrderStatus}
                        statusOptions={[
                            { label: t('pending_payment'), value: OrderStatus.PendingPayment },
                            { label: t('processing'), value: OrderStatus.Processing },
                            { label: t('shipped'), value: OrderStatus.Shipped },
                            { label: t('completed'), value: OrderStatus.Completed }
                        ]}
                        className="mb-0 w-full md:w-[500px]"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {myOrders.length > 0 ? myOrders.map(order => (
                        <div key={order.id} onClick={() => setSelectedOrderId(order.id)} className="border border-gray-100 rounded-2xl p-6 hover:shadow-xl cursor-pointer flex flex-col md:flex-row justify-between items-center bg-white hover:bg-green-50 transition gap-4">
                            <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-black text-xl text-gray-800">{order.productName}</h4>
                                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">ID: {order.id.split('-')[1]}</span>
                                </div>
                                <p className="text-sm text-gray-600">{order.quantityKg} كجم | بائع: {order.sellerCode}</p>
                                <p className="text-xs text-gray-400 mt-3">تحديث: {new Date(order.updatedAt).toLocaleDateString('ar-EG')}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <StatusBadge status={order.status} />
                                <span className="font-black text-green-700 text-2xl">{t('priceEGP', {price: order.totalPrice.toLocaleString()})}</span>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-400 text-lg">لا توجد صفقات تطابق معايير البحث.</p>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default BuyerDashboard;
