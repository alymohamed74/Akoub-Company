
import React from 'react';
import { User, UserType, Product, RFQ, Bid, Order } from '../types';
import BuyerDashboard from './BuyerDashboard';
import SellerDashboard from './SellerDashboard';
import { useTranslation } from '../i18n/LanguageContext';

interface DashboardProps {
  user: User;
  products: Product[];
  rfqs: RFQ[];
  bids: Bid[];
  orders: Order[];
  onAddProduct: (newProductData: Omit<Product, 'id'>) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddRfq: (newRfqData: Omit<RFQ, 'id' | 'createdAt'>) => void;
  onUpdateRfq: (updatedRfq: RFQ) => void;
  onDeleteRfq: (rfqId: string) => void;
  onAddBid: (newBidData: Omit<Bid, 'id' | 'createdAt'>) => void;
  onUpdateBid: (updatedBid: Bid) => void;
  onAddOrder: (newOrder: Order) => void;
  onUpdateOrder: (updatedOrder: Order) => void;
  initialRfqId?: string | null;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { 
    user, products, rfqs, bids, orders,
    onAddProduct, onUpdateProduct, onDeleteProduct, 
    onAddRfq, onUpdateRfq, onDeleteRfq, 
    onAddBid, onUpdateBid,
    onAddOrder, onUpdateOrder,
    initialRfqId
  } = props;
  
  const { t } = useTranslation();
  const isBuyer = user.type === UserType.Buyer;

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-3xl font-bold text-gray-800">{t('dashboard')}</h2>
        <p className="text-gray-600">{t('welcomeBack', { name: user.name })}</p>
      </div>
      {isBuyer ? 
        <BuyerDashboard 
          user={user} 
          rfqs={rfqs} 
          bids={bids}
          orders={orders}
          onAddRfq={onAddRfq}
          onUpdateRfq={onUpdateRfq}
          onDeleteRfq={onDeleteRfq}
          onUpdateBid={onUpdateBid}
          onAddOrder={onAddOrder}
          onUpdateOrder={onUpdateOrder}
        /> : 
        <SellerDashboard 
          user={user} 
          products={products}
          rfqs={rfqs}
          bids={bids}
          orders={orders}
          /* FIX: Use correct destructured prop names for product management handlers */
          onAddProduct={onAddProduct}
          onUpdateProduct={onUpdateProduct}
          onDeleteProduct={onDeleteProduct}
          onAddBid={onAddBid}
          onUpdateOrder={onUpdateOrder}
          initialRfqId={initialRfqId}
        />}
    </div>
  );
};

export default Dashboard;
