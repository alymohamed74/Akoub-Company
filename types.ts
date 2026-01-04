
export enum UserType {
  Buyer = 'buyer',
  Seller = 'seller',
}

export interface User {
  id: string;
  name: string;
  type: UserType;
  code?: string; // e.g., AKOUB03 for sellers
  email?: string;
  mobile?: string;
  nationalId?: string;
  commercialRecord?: string;
  taxCard?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  grades: string[];
  pricePerKg: number;
  sellerId: string;
  sellerName?: string; // Optional for display
}

export enum RfqStatus {
  Open = 'مفتوح',
  Closed = 'مغلق',
}

export interface RFQ {
  id: string;
  buyerId: string;
  buyerName: string;
  productName: string;
  quantityKg: number;
  qualityGrade: string;
  status: RfqStatus;
  createdAt: string;
}

export enum BidStatus {
    Pending = 'معلق',
    Accepted = 'مقبول',
    Rejected = 'مرفوض'
}

export interface Bid {
    id: string;
    rfqId: string;
    sellerId: string;
    sellerCode: string;
    pricePerKg: number;
    status: BidStatus;
    createdAt: string;
}

// --- NEW TYPES FOR ORDER MANAGEMENT ---

export enum OrderStatus {
  PendingPayment = 'pending_payment', // Buyer needs to pay/agree
  Processing = 'processing', // Seller is preparing
  Shipped = 'shipped', // Seller shipped
  Delivered = 'delivered', // Arrived at location
  Completed = 'completed', // Buyer confirmed receipt & quality
  Disputed = 'disputed' // Issue raised
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface ShippingDetails {
  shippingDate?: string;
  estimatedArrival?: string;
  carrier?: string; // or Driver Name
  trackingNumber?: string; // or Driver Phone
  packagingType?: string;
  shippingCost?: number;
}

export interface Order {
  id: string;
  rfqId: string;
  bidId: string;
  buyerId: string;
  sellerId: string;
  sellerCode: string;
  productName: string;
  quantityKg: number;
  pricePerKg: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  shippingDetails?: ShippingDetails;
  messages: Message[];
  contractUrl?: string; // Mock link
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'rfq' | 'bid' | 'order';
}
