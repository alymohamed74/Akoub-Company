
import React, { useState, useEffect } from 'react';
import { User, UserType, Product, RFQ, Bid, Order, RfqStatus, BidStatus } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import LoginModal from './components/LoginModal';
import LandingPage from './components/LandingPage';
import BuyNowModal from './components/BuyNowModal';
import { MOCK_USERS, MOCK_PRODUCTS, MOCK_RFQS, MOCK_BIDS, MOCK_ORDERS } from './constants';
import { LanguageProvider, useTranslation } from './i18n/LanguageContext';

const AppContent: React.FC = () => {
  const [view, setView] = useState<'landing' | 'marketplace'>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [page, setPage] = useState<'marketplace' | 'dashboard'>('marketplace');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [rfqs, setRfqs] = useState<RFQ[]>(MOCK_RFQS);
  const [bids, setBids] = useState<Bid[]>(MOCK_BIDS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);
  const [selectedProductForBuyNow, setSelectedProductForBuyNow] = useState<{product: Product, quantity: number} | null>(null);

  const [preSelectedRfqId, setPreSelectedRfqId] = useState<string | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleLogin = (userType: UserType) => {
    const user = MOCK_USERS.find(u => u.type === userType);
    if (user) setCurrentUser(user);
    setIsLoginModalOpen(false);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage('marketplace');
    setPreSelectedRfqId(null);
  }
  
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setPreSelectedRfqId(null);
  };
  const handleNavigateToLanding = () => setView('landing');

  const handleGoToDashboard = (rfqId?: string) => {
    if (rfqId) setPreSelectedRfqId(rfqId);
    setPage('dashboard');
  };

  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
    setProducts(prev => [{ id: `prod-${Date.now()}`, ...newProductData }, ...prev]);
  };
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleAddRfq = (newRfqData: Omit<RFQ, 'id' | 'createdAt'>) => {
    setRfqs(prev => [{ id: `rfq-${Date.now()}`, createdAt: new Date().toISOString(), ...newRfqData }, ...prev]);
  };
  const handleUpdateRfq = (updatedRfq: RFQ) => {
    setRfqs(prev => prev.map(r => r.id === updatedRfq.id ? updatedRfq : r));
  };
  const handleDeleteRfq = (rfqId: string) => {
    setRfqs(prev => prev.filter(r => r.id !== rfqId));
    setBids(prev => prev.filter(b => b.rfqId !== rfqId));
  };

  const handleAddBid = (newBidData: Omit<Bid, 'id' | 'createdAt'>) => {
    setBids(prev => [{ id: `bid-${Date.now()}`, createdAt: new Date().toISOString(), ...newBidData }, ...prev]);
  };
  
  const handleUpdateBid = (updatedBid: Bid) => {
    setBids(prev => prev.map(b => b.id === updatedBid.id ? updatedBid : b));
  };

  const handleAddOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const handleOpenBuyNowModal = (product: Product, quantity: number) => {
    setSelectedProductForBuyNow({ product, quantity });
    setIsBuyNowModalOpen(true);
  };
  const handleCloseBuyNowModal = () => {
    setIsBuyNowModalOpen(false);
    setSelectedProductForBuyNow(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50 text-green-800">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-semibold">{t('loadingAkoub')}</p>
        </div>
      </div>
    );
  }
  
  if (view === 'landing') {
    return <LandingPage onNavigateToMarketplace={() => setView('marketplace')} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Header 
        currentUser={currentUser} 
        onLoginClick={openLoginModal} 
        onLogout={handleLogout} 
        onNavigateToLanding={handleNavigateToLanding}
        page={page}
        onNavigate={setPage}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {page === 'dashboard' && currentUser ? (
          <Dashboard 
            user={currentUser} 
            products={products}
            rfqs={rfqs}
            bids={bids}
            orders={orders}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddRfq={handleAddRfq}
            onUpdateRfq={handleUpdateRfq}
            onDeleteRfq={handleDeleteRfq}
            onAddBid={handleAddBid}
            onUpdateBid={handleUpdateBid}
            onAddOrder={handleAddOrder}
            onUpdateOrder={handleUpdateOrder}
            initialRfqId={preSelectedRfqId}
          />
        ) : (
          <HomePage 
            currentUser={currentUser}
            onGetStartedClick={openLoginModal} 
            products={products} 
            rfqs={rfqs} 
            onBuyNowClick={handleOpenBuyNowModal}
            onBidClick={handleGoToDashboard}
          />
        )}
      </main>
      <Footer />
      {isLoginModalOpen && <LoginModal onClose={closeLoginModal} onLogin={handleLogin} />}
      {isBuyNowModalOpen && selectedProductForBuyNow && (
        <BuyNowModal product={selectedProductForBuyNow.product} quantity={selectedProductForBuyNow.quantity} onClose={handleCloseBuyNowModal} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
