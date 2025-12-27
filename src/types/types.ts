export type UserRole = 'user' | 'admin';
export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type NotificationType = 
  | 'order_created'
  | 'order_processing'
  | 'order_completed' 
  | 'order_failed'
  | 'order_rejected'
  | 'order_canceled' 
  | 'order_refunded' 
  | 'balance_added'
  | 'wallet_credited' 
  | 'wallet_debited' 
  | 'payment_approved' 
  | 'payment_rejected' 
  | 'service_added'
  | 'service_available'
  | 'service_unavailable'
  | 'price_update'
  | 'price_increased'
  | 'price_decreased'
  | 'website_update'
  | 'news'
  | 'system'
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

// Stock Management Types
export type StockStatus = 'available' | 'reserved' | 'sold';

export interface StockItem {
  id: string;
  product_id: string;
  code: string;
  status: StockStatus;
  reserved_by: string | null;
  reserved_at: string | null;
  sold_to: string | null;
  sold_at: string | null;
  order_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface StockUpload {
  id: string;
  product_id: string;
  uploaded_by: string;
  total_items: number;
  successful_items: number;
  failed_items: number;
  notes: string | null;
  created_at: string;
}

// API Key Management Types
export type ApiKeyVersion = 'v1' | 'v2';
export type ApiKeyStatus = 'active' | 'inactive';

export interface ApiPermissions {
  orders?: {
    edit_link?: boolean;
    resend_order?: boolean;
    get_order_list?: boolean;
    view_provider_charge?: boolean;
    view_external_id?: boolean;
    view_provider_response?: boolean;
    view_provider_url?: boolean;
    change_status?: boolean;
    cancel_and_refund?: boolean;
    set_partial?: boolean;
    pull_orders?: boolean;
    update_orders?: boolean;
    request_cancel?: boolean;
    pull_cancel_tasks?: boolean;
    reject_cancel?: boolean;
  };
  refill?: {
    pull_refill_tasks?: boolean;
    change_refill_status?: boolean;
  };
  payments?: {
    add_payment?: boolean;
    get_payment_list?: boolean;
    view_user_details?: boolean;
  };
  users?: {
    add_user?: boolean;
    get_user_list?: boolean;
    view_email?: boolean;
    view_balance?: boolean;
    view_spent?: boolean;
    view_user_details?: boolean;
  };
  tickets?: {
    get_ticket_list?: boolean;
    get_ticket?: boolean;
    reply_to_ticket?: boolean;
    add_ticket?: boolean;
  };
}

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  note: string | null;
  version: ApiKeyVersion;
  status: ApiKeyStatus;
  permissions: ApiPermissions;
  created_by: string | null;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
}

// Provider types
export type ApiType = 'rest' | 'graphql' | 'soap';

export interface Provider {
  id: string;
  name: string;
  description: string | null;
  api_endpoint: string;
  api_key: string | null;
  api_type: ApiType;
  is_active: boolean;
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// User Level types
export interface UserLevel {
  id: string;
  name: string;
  description: string | null;
  discount_percentage: number;
  min_spent: number;
  color: string;
  priority: number;
  benefits: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Custom Rate types
export interface CustomRate {
  id: string;
  user_id: string;
  product_id: string;
  custom_price: number;
  discount_percentage: number | null;
  note: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Global Settings types
export interface GlobalSetting {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updated_at: string;
}

// Extended Product with pricing fields
export interface ProductWithPricing extends Product {
  provider_id: string | null;
  provider_product_id: string | null;
  base_price: number | null;
  profit_margin: number;
  use_global_margin: boolean;
}

// Extended Profile with user level
export interface ProfileWithLevel extends Profile {
  user_level_id: string | null;
  total_spent: number;
  user_level?: UserLevel;
}

// Price calculation result
export interface PriceCalculation {
  base_price: number;
  profit_margin: number;
  price_with_margin: number;
  user_level_discount: number;
  custom_rate: number | null;
  final_price: number;
  savings: number;
  discount_percentage: number;
  discount_reason: string | null;
}

// Product Field Types
export interface ProductField {
  id: string;
  product_id: string;
  field_name: string;
  field_value: string;
  field_order: number;
  created_at: string;
  updated_at: string;
}

// Site Settings Types
export type SettingType = 'text' | 'image' | 'video' | 'json';

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_type: SettingType;
  created_at: string;
  updated_at: string;
}

// Banner Types
export type BannerMediaType = 'image' | 'gif';

export interface SiteBanner {
  id: string;
  title: string;
  media_url: string;
  media_type: BannerMediaType;
  link_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Product with fields
export interface ProductWithFields extends Product {
  fields?: ProductField[];
}
