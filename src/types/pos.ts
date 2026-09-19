export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  barcode?: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discount?: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  loyaltyPoints?: number;
}

export type PaymentMethod = 'cash' | 'card' | 'qr_code' | 'store_credit';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'completed' | 'pending' | 'refunded';
  createdAt: string;
  cashierId?: string;
}

export interface PosStats {
  todaySales: number;
  ordersCount: number;
  activeRegisters: number;
  lowStockAlerts: number;
}
