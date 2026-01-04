
import { Product, User, UserType, RFQ, RfqStatus, Bid, BidStatus, Order, OrderStatus } from './types';

export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'شركة الاستيراد المتحدة', type: UserType.Buyer, email: 'buyer1@test.com' },
  { id: 'user-2', name: 'مزارع الوادي الجديد', type: UserType.Seller, code: 'AKOUB03', email: 'seller1@test.com' },
  { id: 'user-3', name: 'شركة التوزيع الحديثة', type: UserType.Buyer, email: 'buyer2@test.com' },
  { id: 'user-4', name: 'تعاونية تمور سيوة', type: UserType.Seller, code: 'AKOUB07', email: 'seller2@test.com' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'تمر مجدول فاخر',
    description: 'يتميز بحجمه الكبير ولونه الداكن وقوامه الطري الشبيه بالكراميل. منتقى بعناية من أجود مزارعنا.',
    imageUrl: 'images/mjdoel.jpg',
    grades: ['سوبر فاخر', 'نخب أول'],
    pricePerKg: 150,
    sellerId: 'user-2',
  },
  {
    id: 'prod-2',
    name: 'تمر سيوي واحاتي',
    description: 'أفضل أنواع تمور واحة سيوة، غني بالسكريات الطبيعية وقوام متماسك مثالي للتخزين والتصدير.',
    imageUrl: 'images/sewi.jpg',
    grades: ['فرز أول ممتاز', 'درجة ثانية'],
    pricePerKg: 65,
    sellerId: 'user-4',
  },
  {
    id: 'prod-3',
    name: 'بلح برحي طازج',
    description: 'بلح برحي طازج (خلال)، يتميز بمذاقه الحلو المقرمش ولونه الذهبي الجذاب. إنتاج الموسم الحالي.',
    imageUrl: 'images/barhi.jpg',
    grades: ['درجة أولى (طازج)'],
    pricePerKg: 80,
    sellerId: 'user-2',
  },
  {
    id: 'prod-4',
    name: 'تمر دجلة نور',
    description: 'التمر الذهبي نصف الجاف، يتميز بمذاقه الشبيه بالعسل وقوامه الفريد. مثالي للضيافة.',
    imageUrl: 'images/degla.jpg',
    grades: ['تصدير فاخر'],
    pricePerKg: 110,
    sellerId: 'user-4',
  },
];

export const MOCK_RFQS: RFQ[] = [
    {
      id: 'rfq-1',
      buyerId: 'user-1',
      buyerName: 'شركة الاستيراد المتحدة',
      productName: 'تمر مجدول',
      quantityKg: 5000,
      qualityGrade: 'فاخر',
      status: RfqStatus.Open,
      createdAt: '2024-08-01T10:00:00Z'
    },
    {
      id: 'rfq-2',
      buyerId: 'user-3',
      buyerName: 'شركة التوزيع الحديثة',
      productName: 'تمر صعيدي',
      quantityKg: 10000,
      qualityGrade: 'درجة أولى',
      status: RfqStatus.Open,
      createdAt: '2024-08-05T14:30:00Z'
    }
];

export const MOCK_BIDS: Bid[] = [
    {
        id: 'bid-1',
        rfqId: 'rfq-1',
        sellerId: 'user-2',
        sellerCode: 'AKOUB03',
        pricePerKg: 120,
        status: BidStatus.Pending,
        createdAt: '2024-08-02T11:00:00Z'
    }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'order-1',
    rfqId: 'rfq-2',
    bidId: 'bid-3',
    buyerId: 'user-3',
    sellerId: 'user-2',
    sellerCode: 'AKOUB03',
    productName: 'تمر صعيدي',
    quantityKg: 10000,
    pricePerKg: 45,
    totalPrice: 450000,
    status: OrderStatus.Processing,
    createdAt: '2024-08-06T10:00:00Z',
    updatedAt: '2024-08-07T09:00:00Z',
    messages: [],
    shippingDetails: {}
  }
];
