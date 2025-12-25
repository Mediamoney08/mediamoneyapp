export type UserRole = 'user' | 'admin';
export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type NotificationType = 'order_completed' | 'order_failed' | 'price_update' | 'news' | 'system';
export type ServiceCategory = 'game' | 'app' | 'streaming' | 'gift_card';

export interface Profile {
  id: string;
  email: string | null;
  username: string | null;
  role: UserRole;
  wallet_balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: ServiceCategory;
  price: number;
  currency: string;
  image_url: string | null;
  stock_quantity: number;
  is_active: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  items: OrderItem[];
  total_amount: number;
  currency: string;
  status: OrderStatus;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  player_id: string | null;
  fulfillment_data: any;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  description: string | null;
  order_id: string | null;
  balance_after: number;
  created_at: string;
}

export interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: TicketStatus;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string | null;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  metadata: any;
  created_at: string;
}

export interface CheckoutRequest {
  items: OrderItem[];
  currency?: string;
  payment_method_types?: string[];
  player_id?: string;
}

export interface CheckoutResponse {
  url: string;
  sessionId: string;
  orderId: string;
}

export interface PaymentVerificationResponse {
  verified: boolean;
  status: string;
  sessionId: string;
  paymentIntentId?: string;
  amount?: number;
  currency?: string;
  customerEmail?: string;
  customerName?: string;
  orderUpdated?: boolean;
}
