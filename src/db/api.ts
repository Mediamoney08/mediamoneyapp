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
  Category,
  Subcategory,
  PaymentMethod,
  PaymentProof,
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

export const addWalletTransaction = async (
  userId: string,
  amount: number,
  type: string,
  description?: string,
  orderId?: string
): Promise<void> => {
  // Get current balance
  const { data: profile } = await supabase
    .from('profiles')
    .select('wallet_balance')
    .eq('id', userId)
    .single();

  const currentBalance = profile?.wallet_balance || 0;
  const newBalance = currentBalance + amount;

  // Update profile balance
  await supabase
    .from('profiles')
    .update({ wallet_balance: newBalance })
    .eq('id', userId);

  // Create transaction record
  await supabase
    .from('wallet_transactions')
    .insert({
      user_id: userId,
      amount,
      type,
      description: description || null,
      order_id: orderId || null,
      balance_after: newBalance,
    });
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

export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  metadata?: any
): Promise<void> => {
  await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      title,
      message,
      metadata: metadata || null,
      is_read: false,
    });
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

// ============ Categories ============
export const getCategories = async (serviceType?: ServiceCategory): Promise<Category[]> => {
  let query = supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (serviceType) {
    query = query.eq('service_type', serviceType);
  }

  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getCategory = async (id: string): Promise<Category | null> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// ============ Subcategories ============
export const getSubcategories = async (categoryId: string): Promise<Subcategory[]> => {
  const { data, error} = await supabase
    .from('subcategories')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('display_order');

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// ============ Products by Category/Subcategory ============
export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getProductsBySubcategory = async (subcategoryId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('subcategory_id', subcategoryId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// ============ Payment Methods ============
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// ============ Payment Proofs ============
export const createPaymentProof = async (proof: {
  payment_method_id: string;
  amount: number;
  currency?: string;
  transaction_id?: string;
  transaction_details?: string;
  proof_image_url?: string;
}): Promise<PaymentProof> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('payment_proofs')
    .insert({
      user_id: user.id,
      ...proof,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getPaymentProofs = async (userId: string): Promise<PaymentProof[]> => {
  const { data, error } = await supabase
    .from('payment_proofs')
    .select(`
      *,
      payment_method:payment_methods(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getAllPaymentProofs = async (): Promise<PaymentProof[]> => {
  const { data, error } = await supabase
    .from('payment_proofs')
    .select(`
      *,
      payment_method:payment_methods(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const updatePaymentProofStatus = async (
  proofId: string,
  status: 'approved' | 'rejected',
  adminNotes?: string
): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('payment_proofs')
    .update({
      status,
      admin_notes: adminNotes || null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', proofId);

  if (error) throw error;

  // If approved, add balance to user's wallet
  if (status === 'approved') {
    const { data: proof } = await supabase
      .from('payment_proofs')
      .select('user_id, amount')
      .eq('id', proofId)
      .single();

    if (proof) {
      await addWalletTransaction(
        proof.user_id,
        proof.amount,
        'deposit',
        `Payment approved - ${adminNotes || 'Manual deposit'}`
      );
    }
  }
};

// ============ Wallet Purchase ============
export const purchaseWithWallet = async (
  productId: string,
  quantity: number = 1,
  playerId?: string
): Promise<Order> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get product details
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (productError) throw productError;
  if (!product) throw new Error('Product not found');
  if (product.stock_quantity < quantity) throw new Error('Insufficient stock');

  const totalAmount = product.price * quantity;

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('wallet_balance')
    .eq('id', user.id)
    .single();

  if (profileError) throw profileError;
  if (!profile) throw new Error('Profile not found');
  if (profile.wallet_balance < totalAmount) throw new Error('Insufficient wallet balance');

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      items: [{
        product_id: product.id,
        name: product.name,
        price: product.price * 100, // Convert to cents
        quantity,
        image_url: product.image_url,
      }],
      total_amount: totalAmount,
      currency: product.currency,
      status: 'completed',
      player_id: playerId || null,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Deduct from wallet
  await addWalletTransaction(
    user.id,
    -totalAmount,
    'purchase',
    `Purchase: ${product.name}`,
    order.id
  );

  // Update stock
  await supabase
    .from('products')
    .update({ stock_quantity: product.stock_quantity - quantity })
    .eq('id', productId);

  // Create notification
  await createNotification(
    user.id,
    'order_completed',
    'Order Completed',
    `Your order for ${product.name} has been completed successfully.`
  );

  return order;
};
