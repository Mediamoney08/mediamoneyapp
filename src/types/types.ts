export type UserRole = 'user' | 'admin';
export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type NotificationType = 
  | 'order_completed' 
  | 'order_canceled' 
  | 'order_refunded' 
  | 'wallet_credited' 
  | 'wallet_debited' 
  | 'payment_approved' 
  | 'payment_rejected' 
  | 'api_key_changed' 
  | 'system_announcement';
export type ServiceCategory = 'game' | 'app' | 'streaming' | 'gift_card';
export type PaymentProofStatus = 'pending' | 'approved' | 'rejected';

export interface Category {
  id: string;
  name: string;
  service_type: ServiceCategory;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  instructions: string | null;
  account_details: any;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PaymentProof {
  id: string;
  user_id: string;
  payment_method_id: string;
  amount: number;
  currency: string;
  transaction_id: string | null;
  transaction_details: string | null;
  proof_image_url: string | null;
  status: PaymentProofStatus;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  payment_method?: PaymentMethod;
}

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
  category_id: string | null;
  service_name: string | null; // e.g., "Global", "Prime", "Prime Plus"
  price: number;
  currency: string;
  image_url: string | null;
  stock_quantity: number;
  is_active: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
  category_info?: Category;
}

export interface AdminSettings {
  id: string;
  key: string;
  value: any;
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

export interface Banner {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  link_url: string | null;
  background_color: string;
  text_color: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
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
