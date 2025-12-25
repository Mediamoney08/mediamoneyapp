import { supabase } from './supabase';
import type {
  Profile,
  Product,
  Order,
  WalletTransaction,
  Ticket,
  Notification,
  CheckoutRequest,
  CheckoutResponse,
  PaymentVerificationResponse,
  ServiceCategory,
} from '@/types/types';

// Profile APIs
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Product APIs
export const getProducts = async (category?: ServiceCategory): Promise<Product[]> => {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getProduct = async (productId: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// Order APIs
export const getOrders = async (userId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getOrder = async (orderId: string): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// Wallet Transaction APIs
export const getWalletTransactions = async (userId: string): Promise<WalletTransaction[]> => {
  const { data, error } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// Ticket APIs
export const getTickets = async (userId: string): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createTicket = async (userId: string, subject: string, message: string): Promise<Ticket> => {
  const { data, error } = await supabase
    .from('tickets')
    .insert({
      user_id: userId,
      subject,
      message,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Notification APIs
export const getNotifications = async (userId: string): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .or(`user_id.eq.${userId},user_id.is.null`)
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);
  
  if (error) throw error;
};

export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  
  if (error) throw error;
};

// Payment APIs
export const createCheckoutSession = async (request: CheckoutRequest): Promise<CheckoutResponse> => {
  const { data, error } = await supabase.functions.invoke<{ code: string; message: string; data: CheckoutResponse }>('create_stripe_checkout', {
    body: JSON.stringify(request),
  });

  if (error) {
    const errorMsg = await error?.context?.text();
    console.error('Edge function error in create_stripe_checkout:', errorMsg || error?.message);
    throw new Error(errorMsg || error?.message || 'Failed to create checkout session');
  }

  if (data?.code !== 'SUCCESS') {
    throw new Error(data?.message || 'Failed to create checkout session');
  }

  return data.data;
};

export const verifyPayment = async (sessionId: string): Promise<PaymentVerificationResponse> => {
  const { data, error } = await supabase.functions.invoke<{ code: string; message: string; data: PaymentVerificationResponse }>('verify_stripe_payment', {
    body: JSON.stringify({ sessionId }),
  });

  if (error) {
    const errorMsg = await error?.context?.text();
    console.error('Edge function error in verify_stripe_payment:', errorMsg || error?.message);
    throw new Error(errorMsg || error?.message || 'Failed to verify payment');
  }

  if (data?.code !== 'SUCCESS') {
    throw new Error(data?.message || 'Failed to verify payment');
  }

  return data.data;
};

// Admin APIs
export const getAllProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const updateUserRole = async (userId: string, role: 'user' | 'admin'): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);
  
  if (error) throw error;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getAllTickets = async (): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const updateTicket = async (ticketId: string, updates: Partial<Ticket>): Promise<Ticket> => {
  const { data, error } = await supabase
    .from('tickets')
    .update(updates)
    .eq('id', ticketId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
