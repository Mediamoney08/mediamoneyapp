// MediaMoney API Functions - Updated 2025-12-25
import { supabase } from './supabase';
import type {
  Profile,
  Product,
  Order,
  WalletTransaction,
  Ticket,
  Notification,
  NotificationType,
  Banner,
  CheckoutRequest,
  CheckoutResponse,
  PaymentVerificationResponse,
  ServiceCategory,
  Category,
  Subcategory,
  PaymentMethod,
  PaymentProof,
  StockItem,
  StockStatus,
  StockUpload,
  ApiKey,
  ApiKeyVersion,
  ApiKeyStatus,
  ApiPermissions,
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
// ============ Products by Category ============
export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category_info:categories(name, service_type, image_url)
    `)
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('service_name', { ascending: true });

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

// Alias for backward compatibility
export const getAllPaymentProofsAdmin = getAllPaymentProofs;

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

// ============================================
// ADMIN MANAGEMENT FUNCTIONS
// ============================================

// ============ Category Management ============
export const getAllCategoriesAdmin = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createCategory = async (category: Partial<Category>): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// ============ Product Management ============
export const getAllProductsAdmin = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category_info:categories(name, service_type, image_url)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createProduct = async (product: Partial<Product>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// ============ User Management ============
export const getAllUsers = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const updateUserProfile = async (id: string, updates: Partial<Profile>): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateUserBalance = async (userId: string, amount: number, description: string): Promise<void> => {
  // Get current balance
  const profile = await getProfile(userId);
  if (!profile) throw new Error('User not found');

  const newBalance = profile.wallet_balance + amount;

  // Update balance
  await supabase
    .from('profiles')
    .update({ wallet_balance: newBalance })
    .eq('id', userId);

  // Add transaction
  await addWalletTransaction(userId, amount, amount > 0 ? 'credit' : 'debit', description);

  // Send notification
  await createNotification(
    userId,
    amount > 0 ? 'wallet_credited' : 'wallet_debited',
    'Balance Updated',
    `Your wallet balance has been ${amount > 0 ? 'increased' : 'decreased'} by $${Math.abs(amount).toFixed(2)}. ${description}`
  );
};

// ============ Order Management ============
export const getAllOrdersAdmin = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      user:profiles(username, email),
      items:order_items(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;

  // Send notification to user
  const order = data as Order;
  if (order.user_id) {
    let notificationType: NotificationType = 'order_completed';
    if (status === 'cancelled') notificationType = 'order_canceled';
    else if (status === 'refunded') notificationType = 'order_refunded';
    
    await createNotification(
      order.user_id,
      notificationType,
      'Order Status Updated',
      `Your order #${order.id.substring(0, 8)} status has been updated to: ${status}`
    );
  }

  return data;
};

export const refundOrder = async (orderId: string): Promise<void> => {
  // Get order details
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (orderError) throw orderError;

  // Refund to wallet
  await updateUserBalance(order.user_id, order.total_amount, `Refund for order #${orderId.substring(0, 8)}`);

  // Update order status
  await updateOrderStatus(orderId, 'refunded');
};

// ============ Payment Method Management ============
export const getAllPaymentMethodsAdmin = async (): Promise<PaymentMethod[]> => {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createPaymentMethod = async (method: Partial<PaymentMethod>): Promise<PaymentMethod> => {
  const { data, error } = await supabase
    .from('payment_methods')
    .insert(method)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod> => {
  const { data, error } = await supabase
    .from('payment_methods')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePaymentMethod = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// ============ Site Settings Management ============
export const getSiteSetting = async (key: string): Promise<any> => {
  const { data, error } = await supabase
    .from('admin_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();

  if (error) throw error;
  return data?.value;
};

export const updateSiteSetting = async (key: string, value: any): Promise<void> => {
  const { error } = await supabase
    .from('admin_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) throw error;
};

// ==================== Notification Functions ====================

export const getUserNotifications = async (userId: string, limit: number = 50): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// Backward compatibility alias
export const getNotifications = getUserNotifications;

export const getUnreadNotificationCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw error;
  return count || 0;
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

export const deleteNotification = async (notificationId: string): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) throw error;
};

export const deleteAllNotifications = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
};

export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  metadata?: any
): Promise<Notification> => {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      title,
      message,
      metadata: metadata || null,
      is_read: false
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ==================== Banner Functions ====================

export const getActiveBanners = async (): Promise<Banner[]> => {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getAllBanners = async (): Promise<Banner[]> => {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getBannerById = async (id: string): Promise<Banner | null> => {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const createBanner = async (banner: Omit<Banner, 'id' | 'created_at' | 'updated_at'>): Promise<Banner> => {
  const { data, error } = await supabase
    .from('banners')
    .insert(banner)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateBanner = async (id: string, updates: Partial<Banner>): Promise<Banner> => {
  const { data, error } = await supabase
    .from('banners')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteBanner = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('banners')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const toggleBannerStatus = async (id: string, isActive: boolean): Promise<void> => {
  const { error } = await supabase
    .from('banners')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
};

// ==================== Stock Management Functions ====================

export const uploadStockItems = async (
  productId: string,
  codes: string[],
  uploadedBy: string,
  notes?: string
): Promise<{ success: number; failed: number; uploadId: string }> => {
  // Create upload record
  const { data: upload, error: uploadError } = await supabase
    .from('stock_uploads')
    .insert({
      product_id: productId,
      uploaded_by: uploadedBy,
      total_items: codes.length,
      notes: notes || null,
    })
    .select()
    .single();

  if (uploadError) throw uploadError;

  let successCount = 0;
  let failedCount = 0;

  // Insert stock items
  for (const code of codes) {
    try {
      const { error } = await supabase
        .from('stock_items')
        .insert({
          product_id: productId,
          code: code.trim(),
          status: 'available',
        });

      if (error) {
        failedCount++;
      } else {
        successCount++;
      }
    } catch {
      failedCount++;
    }
  }

  // Update upload record
  await supabase
    .from('stock_uploads')
    .update({
      successful_items: successCount,
      failed_items: failedCount,
    })
    .eq('id', upload.id);

  return {
    success: successCount,
    failed: failedCount,
    uploadId: upload.id,
  };
};

export const getStockItems = async (
  productId?: string,
  status?: StockStatus
): Promise<StockItem[]> => {
  let query = supabase
    .from('stock_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (productId) {
    query = query.eq('product_id', productId);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getAvailableStockCount = async (productId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('stock_items')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', productId)
    .eq('status', 'available');

  if (error) throw error;
  return count || 0;
};

export const reserveStockItem = async (
  productId: string,
  userId: string,
  orderId: string
): Promise<StockItem | null> => {
  // Get first available stock item
  const { data: availableItems, error: fetchError } = await supabase
    .from('stock_items')
    .select('*')
    .eq('product_id', productId)
    .eq('status', 'available')
    .limit(1);

  if (fetchError) throw fetchError;
  if (!availableItems || availableItems.length === 0) return null;

  const stockItem = availableItems[0];

  // Reserve it
  const { data, error } = await supabase
    .from('stock_items')
    .update({
      status: 'reserved',
      reserved_by: userId,
      reserved_at: new Date().toISOString(),
      order_id: orderId,
    })
    .eq('id', stockItem.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const markStockItemSold = async (stockItemId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('stock_items')
    .update({
      status: 'sold',
      sold_to: userId,
      sold_at: new Date().toISOString(),
    })
    .eq('id', stockItemId);

  if (error) throw error;
};

export const releaseStockItem = async (stockItemId: string): Promise<void> => {
  const { error } = await supabase
    .from('stock_items')
    .update({
      status: 'available',
      reserved_by: null,
      reserved_at: null,
      order_id: null,
    })
    .eq('id', stockItemId);

  if (error) throw error;
};

export const deleteStockItem = async (stockItemId: string): Promise<void> => {
  const { error } = await supabase
    .from('stock_items')
    .delete()
    .eq('id', stockItemId);

  if (error) throw error;
};

export const getStockUploads = async (productId?: string): Promise<StockUpload[]> => {
  let query = supabase
    .from('stock_uploads')
    .select('*')
    .order('created_at', { ascending: false });

  if (productId) {
    query = query.eq('product_id', productId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// ==================== API Key Management Functions ====================

export const generateApiKey = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'mm_'; // MediaMoney prefix
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
};

export const createApiKey = async (
  name: string,
  note: string | null,
  permissions: ApiPermissions,
  createdBy: string,
  version: ApiKeyVersion = 'v2'
): Promise<ApiKey> => {
  const key = generateApiKey();

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      key,
      name,
      note,
      version,
      permissions,
      created_by: createdBy,
      status: 'active',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getApiKeys = async (): Promise<ApiKey[]> => {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getApiKeyById = async (id: string): Promise<ApiKey | null> => {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateApiKey = async (
  id: string,
  updates: Partial<Pick<ApiKey, 'name' | 'note' | 'permissions' | 'status'>>
): Promise<ApiKey> => {
  const { data, error } = await supabase
    .from('api_keys')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteApiKey = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const toggleApiKeyStatus = async (id: string, status: ApiKeyStatus): Promise<void> => {
  const { error } = await supabase
    .from('api_keys')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
};

export const validateApiKey = async (key: string): Promise<ApiKey | null> => {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('key', key)
    .eq('status', 'active')
    .maybeSingle();

  if (error) throw error;

  // Update last_used_at
  if (data) {
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id);
  }

  return data;
};

// Get stock codes for a completed order
export const getOrderStockCodes = async (orderId: string, userId: string): Promise<StockItem[]> => {
  const { data, error } = await supabase
    .from('stock_items')
    .select('*')
    .eq('order_id', orderId)
    .eq('sold_to', userId)
    .eq('status', 'sold');

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};
