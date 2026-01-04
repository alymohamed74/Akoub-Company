
import React, { useState, useEffect } from 'react';
import { User, RFQ, RfqStatus, Product, Bid, BidStatus, Order, OrderStatus } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import OrderDetails from './OrderDetails';
import FilterBar from './FilterBar';
import ProductForm from './ProductForm';

interface SellerDashboardProps {
  user: User;
  products: Product[];
  rfqs: RFQ[];
  bids: Bid[];
  orders: Order[];
  onAddProduct: (newProductData: Omit<Product, 'id'>) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddBid: (newBidData: Omit<Bid, 'id' | 'createdAt'>) => void;
  onUpdateOrder: (updatedOrder: Order) => void;
  initialRfqId?: string | null;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ 
    user, products, rfqs, bids, orders, 
    onAddProduct, onUpdateProduct, onDeleteProduct, onAddBid, onUpdateOrder,
    initialRfqId
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'rfqs' | 'orders' | 'products'>('rfqs');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // States for product management
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [rfqSearch, setRfqSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('all');

  const [selectedRfqId, setSelectedRfqId] = useState<string | null>(initialRfqId || null);

  // Sync initialRfqId if it changes (e.g., navigating from home multiple times)
  useEffect(() => {
    if (initialRfqId) {
        setSelectedRfqId(initialRfqId);
        setActiveTab('rfqs');
    }
  }, [initialRfqId]);

  // Filter lists
  const openRfqs = rfqs.filter(r => 
    r.status === RfqStatus.Open && 
    r.productName.toLowerCase().includes(rfqSearch.toLowerCase())
  );

  const myOrders = orders.filter(o => 
    o.sellerId === user.id &&
    (orderStatus === 'all' || o.status === orderStatus) &&
    (o.productName.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.includes(orderSearch))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const myProducts = products.filter(p => p.sellerId === user.id);

  const activeOrder = orders.find(o => o.id === selectedOrderId);
  const selectedRfq = rfqs.find(r => r.id === selectedRfqId);

  const handleSubmitBid = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pricePerKg = formData.get('price') as string;

    if (selectedRfq && user.code) {
      onAddBid({
        rfqId: selectedRfq.id,
        sellerId: user.id,
        sellerCode: user.code,
        pricePerKg: parseFloat(pricePerKg),
        status: BidStatus.Pending,
      });
      setSelectedRfqId(null);
      alert(t('bidSubmittedSuccessfully'));
      e.currentTarget.reset();
    }
  }

  const hasAlreadyBid = (rfqId: string) => bids.some(bid => bid.rfqId === rfqId && bid.sellerId === user.id);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleDeleteProductClick = (productId: string) => {
    if (window.confirm(t('confirmDeleteProduct'))) {
      onDeleteProduct(productId);
    }
  };

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
        <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8 rtl:space-x-reverse">
                <button onClick={() => setActiveTab('rfqs')} className={`pb-2 font-bold text-lg transition-colors ${activeTab === 'rfqs' ? 'border-b-4 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}>{t('newRFQs')}</button>
                <button onClick={() => setActiveTab('orders')} className={`pb-2 font-bold text-lg transition-colors ${activeTab === 'orders' ? 'border-b-4 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}>{t('orders')} ({myOrders.length})</button>
                <button onClick={() => setActiveTab('products')} className={`pb-2 font-bold text-lg transition-colors ${activeTab === 'products' ? 'border-b-4 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}>{t('myProducts')}</button>
            </nav>
        </div>

        {activeTab === 'rfqs' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h3 className="text-xl font-bold mb-4">طلبات السوق</h3>
                    <FilterBar searchPlaceholder="ابحث في طلبات المشتري..." searchTerm={rfqSearch} onSearchChange={setRfqSearch} />
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {openRfqs.length > 0 ? openRfqs.map(rfq => (
                            <div key={rfq.id} onClick={() => setSelectedRfqId(rfq.id)} className={`p-5 rounded-2xl border-2 cursor-pointer transition ${selectedRfqId === rfq.id ? 'bg-green-50 border-green-500 shadow-sm' : 'bg-white border-gray-100 hover:border-green-200'}`}>
                                <h4 className="font-black text-gray-800 text-lg mb-1">{rfq.productName}</h4>
                                <div className="flex flex-col text-sm text-gray-600 gap-1">
                                    <span>📦 الكمية: {rfq.quantityKg} كجم</span>
                                    <span>💎 الجودة: {rfq.qualityGrade}</span>
                                </div>
                                {hasAlreadyBid(rfq.id) && (
                                    <div className="mt-3 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full w-fit">تم تقديم عرضك ✓</div>
                                )}
                            </div>
                        )) : <div className="text-center py-10 text-gray-400">لا توجد طلبات مفتوحة حالياً</div>}
                    </div>
                </div>
                
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[500px] flex flex-col">
                    {selectedRfq ? (
                        <div className="animate-fade-in">
                            <h3 className="text-3xl font-black text-gray-800 mb-2">تقديم عرض لـ: {selectedRfq.productName}</h3>
                            <p className="text-gray-500 mb-8 border-b pb-4">مشتري: {selectedRfq.buyerName} | الكمية: {selectedRfq.quantityKg} كجم</p>
                            
                            {hasAlreadyBid(selectedRfq.id) ? (
                                <div className="p-10 bg-yellow-50 text-yellow-800 rounded-2xl text-center border border-yellow-100">
                                    <span className="text-4xl block mb-4">📢</span>
                                    <p className="text-xl font-bold">لقد قمت بتقديم عرض لهذا الطلب بالفعل.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitBid} className="space-y-8 max-w-md">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <label className="block font-black text-gray-700 mb-4 text-lg">السعر لكل كجم (بالجنيه)</label>
                                        <div className="relative">
                                            <input type="number" name="price" required className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none text-3xl font-black text-green-700 transition" placeholder="0.00" />
                                            <span className="absolute left-5 inset-y-0 flex items-center font-bold text-gray-400 text-xl">EGP</span>
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full bg-green-600 text-white font-black py-5 rounded-2xl hover:bg-green-700 shadow-xl transition transform hover:-translate-y-1 text-xl">إرسال العرض</button>
                                </form>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center flex-grow text-gray-400">
                            <span className="text-7xl mb-6">🎯</span>
                            <p className="text-xl">اختر طلباً من القائمة الجانبية لبدء تقديم عروض أسعارك.</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'orders' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h3 className="text-2xl font-bold">إدارة الصفقات والعمليات</h3>
                    <FilterBar 
                        searchPlaceholder="ابحث باسم المشتري أو رقم الصفقة..." 
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
                                <p className="text-sm text-gray-600">{order.quantityKg} كجم | مشتري: {order.buyerId}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`px-6 py-2 rounded-xl text-sm font-bold shadow-inner ${order.status === 'completed' ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-700'}`}>{t(order.status)}</span>
                                <span className="font-black text-green-700 text-2xl">{t('priceEGP', {price: order.totalPrice.toLocaleString()})}</span>
                            </div>
                        </div>
                    )) : <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200"><p className="text-gray-400 text-lg">لا توجد صفقات حالية تطابق البحث.</p></div>}
                </div>
            </div>
        )}

        {activeTab === 'products' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold">{t('myProducts')}</h3>
                    <button onClick={() => { setEditingProduct(null); setIsProductFormOpen(true); }} className="bg-green-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-700 transition shadow-lg">
                        + {t('addNewProduct')}
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myProducts.length > 0 ? myProducts.map(product => (
                        <div key={product.id} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover" />
                            <div className="p-4">
                                <h4 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h4>
                                <p className="text-sm text-gray-500 mb-3 h-10 overflow-hidden line-clamp-2">{product.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-green-700 font-black">{t('priceEGP', {price: product.pricePerKg})} / كجم</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditProduct(product)} className="text-blue-600 font-bold text-sm hover:bg-blue-50 px-3 py-1.5 rounded-lg transition">✏️ {t('edit')}</button>
                                        <button onClick={() => handleDeleteProductClick(product.id)} className="text-red-600 font-bold text-sm hover:bg-red-50 px-3 py-1.5 rounded-lg transition">🗑️ {t('delete')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                            <p className="text-lg">لم تقم بإضافة أي منتجات للعرض في المنصة بعد.</p>
                        </div>
                    )}
                </div>

                {isProductFormOpen && (
                    <ProductForm 
                        existingProduct={editingProduct}
                        onSave={(data) => {
                            if (editingProduct) onUpdateProduct({ ...editingProduct, ...data });
                            else onAddProduct({ ...data, sellerId: user.id, sellerName: user.name });
                        }}
                        onClose={() => setIsProductFormOpen(false)}
                    />
                )}
            </div>
        )}
    </div>
  );
};

export default SellerDashboard;
