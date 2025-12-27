-- ============================================
-- RECHARGE HUB - COMPLETE DATABASE SETUP
-- ============================================
-- 
-- This script contains all database migrations for the Recharge Hub application.
-- Run this script in your Supabase SQL Editor to set up the complete database schema.
--
-- Project: Recharge Hub
-- Database: Supabase PostgreSQL
-- Version: 1.0
-- Last Updated: 2025-12-27
--
-- INSTRUCTIONS:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/hbqeslmfietqvdbkaqsy
-- 2. Go to SQL Editor
-- 3. Create a New Query
-- 4. Copy and paste this entire file
-- 5. Click "Run" to execute
--
-- This script will create:
-- - All database tables
-- - Row Level Security (RLS) policies
-- - Database functions and triggers
-- - Initial data and configurations
--
-- Estimated execution time: 30-60 seconds
--
-- ============================================

-- Create user role enum
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Create order status enum
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');

-- Create ticket status enum
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- Create notification type enum
CREATE TYPE notification_type AS ENUM ('order_completed', 'order_failed', 'price_update', 'news', 'system');

-- Create service category enum
CREATE TYPE service_category AS ENUM ('game', 'app', 'streaming', 'gift_card');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT UNIQUE,
  role user_role NOT NULL DEFAULT 'user'::user_role,
  wallet_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category service_category NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  image_url TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status order_status NOT NULL DEFAULT 'pending'::order_status,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  customer_email TEXT,
  customer_name TEXT,
  player_id TEXT,
  fulfillment_data JSONB,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create wallet transactions table
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  balance_after NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create tickets table
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status ticket_status NOT NULL DEFAULT 'open'::ticket_status,
  admin_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_stripe_session_id ON public.orders(stripe_session_id);
CREATE INDEX idx_wallet_transactions_user_id ON public.wallet_transactions(user_id);
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Create helper function to check admin
CREATE OR REPLACE FUNCTION is_admin(uid UUID)
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Create trigger function to sync users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  INSERT INTO profiles (id, email, username, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
  );
  RETURN NEW;
END;
$$;

-- Create trigger for user sync
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON public.profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Products policies
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Orders policies
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Service role can manage orders" ON public.orders
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Wallet transactions policies
CREATE POLICY "Users can view their own transactions" ON public.wallet_transactions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON public.wallet_transactions
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Service role can manage transactions" ON public.wallet_transactions
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Tickets policies
CREATE POLICY "Users can view their own tickets" ON public.tickets
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets" ON public.tickets
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all tickets" ON public.tickets
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications" ON public.notifications
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- ============================================
-- Migration: 00002_add_categories_and_payment_methods.sql
-- ============================================


-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  service_type service_category NOT NULL,
  description TEXT,
  image_url TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add category and subcategory references to products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL;

-- Create payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  instructions TEXT,
  account_details JSONB,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payment status enum
DO $$ BEGIN
  CREATE TYPE payment_proof_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create payment proofs table (for manual verification)
CREATE TABLE IF NOT EXISTS payment_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_method_id UUID NOT NULL REFERENCES payment_methods(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  transaction_id TEXT,
  transaction_details TEXT,
  proof_image_url TEXT,
  status payment_proof_status DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_service_type ON categories(service_type);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_subcategories_category ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_user ON payment_proofs(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_status ON payment_proofs(status);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_proofs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for subcategories (public read)
CREATE POLICY "Anyone can view active subcategories"
  ON subcategories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage subcategories"
  ON subcategories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for payment methods (public read)
CREATE POLICY "Anyone can view active payment methods"
  ON payment_methods FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage payment methods"
  ON payment_methods FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for payment proofs
CREATE POLICY "Users can view own payment proofs"
  ON payment_proofs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create payment proofs"
  ON payment_proofs FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all payment proofs"
  ON payment_proofs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update payment proofs"
  ON payment_proofs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subcategories_updated_at BEFORE UPDATE ON subcategories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_proofs_updated_at BEFORE UPDATE ON payment_proofs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- Migration: 00003_restructure_for_admin_system.sql
-- ============================================


-- Add service_name to products (e.g., "Global", "Prime", "Prime Plus")
ALTER TABLE products ADD COLUMN IF NOT EXISTS service_name TEXT;

-- Remove subcategory_id (not needed in new structure)
ALTER TABLE products DROP COLUMN IF EXISTS subcategory_id;

-- Update categories table to ensure image_url exists
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create admin_settings table for site configuration
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on admin_settings
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Admin can manage settings
CREATE POLICY "Admins can manage settings"
ON admin_settings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Everyone can read settings
CREATE POLICY "Everyone can read settings"
ON admin_settings FOR SELECT
USING (true);

-- Insert default site settings
INSERT INTO admin_settings (key, value) VALUES
  ('site_name', '"Recharge Hub"'::jsonb),
  ('site_description', '"Your one-stop destination for game top-ups, streaming subscriptions, and digital gift cards"'::jsonb),
  ('contact_phone', '"+961 81 330 930"'::jsonb),
  ('contact_phone_2', '"+961 70 388 557"'::jsonb),
  ('contact_email', '"support@rechargehub.com"'::jsonb),
  ('currency', '"USD"'::jsonb),
  ('currency_symbol', '"$"'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Update existing products with service names based on their names
UPDATE products 
SET service_name = CASE
  WHEN name LIKE '%Global%' THEN 'Global'
  WHEN name LIKE '%Prime%' THEN 'Prime'
  WHEN name LIKE '%Premium%' THEN 'Premium'
  WHEN name LIKE '%Basic%' THEN 'Basic'
  WHEN name LIKE '%Standard%' THEN 'Standard'
  ELSE 'Standard'
END
WHERE service_name IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_service_name ON products(service_name);
CREATE INDEX IF NOT EXISTS idx_categories_service_type ON categories(service_type);

SELECT 'Migration completed successfully' as status;


-- ============================================
-- Migration: 00004_add_notifications_and_banners.sql
-- ============================================

-- Create notification type enum (if not exists)
DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM (
    'order_completed',
    'order_canceled',
    'order_refunded',
    'wallet_credited',
    'wallet_debited',
    'payment_approved',
    'payment_rejected',
    'api_key_changed',
    'system_announcement'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Create banners table
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  link_url TEXT,
  background_color TEXT DEFAULT '#3b82f6',
  text_color TEXT DEFAULT '#ffffff',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for banners
CREATE INDEX idx_banners_active ON public.banners(is_active);
CREATE INDEX idx_banners_order ON public.banners(display_order);

-- RLS Policies for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- System can insert notifications (via service role or triggers)
CREATE POLICY "System can insert notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for banners
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Everyone can view active banners
CREATE POLICY "Anyone can view active banners"
  ON public.banners
  FOR SELECT
  USING (is_active = true);

-- Admins can view all banners
CREATE POLICY "Admins can view all banners"
  ON public.banners
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can insert banners
CREATE POLICY "Admins can insert banners"
  ON public.banners
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can update banners
CREATE POLICY "Admins can update banners"
  ON public.banners
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can delete banners
CREATE POLICY "Admins can delete banners"
  ON public.banners
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert sample banners
INSERT INTO public.banners (title, content, background_color, text_color, display_order, is_active) VALUES
  ('Welcome to Recharge Hub', '🎉 Get 10% bonus on your first recharge! Use code: WELCOME10', '#8b5cf6', '#ffffff', 1, true),
  ('New Games Added', '🎮 PUBG Mobile, Free Fire, and Mobile Legends now available!', '#3b82f6', '#ffffff', 2, true),
  ('24/7 Support', '💬 Need help? Our support team is available 24/7 via ticket system', '#10b981', '#ffffff', 3, true);

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type notification_type,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, data)
  VALUES (p_user_id, p_type, p_title, p_message, p_data)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create notification when order status changes
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify on status change
  IF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
    -- Order completed
    IF NEW.status = 'completed' THEN
      PERFORM create_notification(
        NEW.user_id,
        'order_completed',
        'Order Completed',
        'Your order #' || SUBSTRING(NEW.id::TEXT, 1, 8) || ' has been completed successfully!',
        jsonb_build_object('order_id', NEW.id, 'amount', NEW.total_amount)
      );
    -- Order canceled
    ELSIF NEW.status = 'cancelled' THEN
      PERFORM create_notification(
        NEW.user_id,
        'order_canceled',
        'Order Canceled',
        'Your order #' || SUBSTRING(NEW.id::TEXT, 1, 8) || ' has been canceled.',
        jsonb_build_object('order_id', NEW.id, 'amount', NEW.total_amount)
      );
    -- Order refunded
    ELSIF NEW.status = 'refunded' THEN
      PERFORM create_notification(
        NEW.user_id,
        'order_refunded',
        'Order Refunded',
        'Your order #' || SUBSTRING(NEW.id::TEXT, 1, 8) || ' has been refunded. Amount credited to your wallet.',
        jsonb_build_object('order_id', NEW.id, 'amount', NEW.total_amount)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for order status changes
DROP TRIGGER IF EXISTS trigger_notify_order_status ON public.orders;
CREATE TRIGGER trigger_notify_order_status
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_status_change();

-- Trigger to create notification when payment proof is approved/rejected
CREATE OR REPLACE FUNCTION notify_payment_proof_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify on status change
  IF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
    -- Payment approved
    IF NEW.status = 'approved' THEN
      PERFORM create_notification(
        NEW.user_id,
        'payment_approved',
        'Payment Approved',
        'Your payment of $' || NEW.amount || ' has been approved and credited to your wallet!',
        jsonb_build_object('payment_proof_id', NEW.id, 'amount', NEW.amount)
      );
    -- Payment rejected
    ELSIF NEW.status = 'rejected' THEN
      PERFORM create_notification(
        NEW.user_id,
        'payment_rejected',
        'Payment Rejected',
        'Your payment submission has been rejected. Please check admin notes and try again.',
        jsonb_build_object('payment_proof_id', NEW.id, 'amount', NEW.amount, 'admin_notes', NEW.admin_notes)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for payment proof status changes
DROP TRIGGER IF EXISTS trigger_notify_payment_proof ON public.payment_proofs;
CREATE TRIGGER trigger_notify_payment_proof
  AFTER UPDATE ON public.payment_proofs
  FOR EACH ROW
  EXECUTE FUNCTION notify_payment_proof_status();


-- ============================================
-- Migration: 00005_add_banners_and_triggers.sql
-- ============================================

-- Create banners table
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  link_url TEXT,
  background_color TEXT DEFAULT '#3b82f6',
  text_color TEXT DEFAULT '#ffffff',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_banners_active ON public.banners(is_active);
CREATE INDEX idx_banners_order ON public.banners(display_order);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners"
  ON public.banners FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all banners"
  ON public.banners FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert banners"
  ON public.banners FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update banners"
  ON public.banners FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete banners"
  ON public.banners FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

INSERT INTO public.banners (title, content, background_color, text_color, display_order, is_active) VALUES
  ('Welcome to Recharge Hub', '🎉 Get 10% bonus on your first recharge! Use code: WELCOME10', '#8b5cf6', '#ffffff', 1, true),
  ('New Games Added', '🎮 PUBG Mobile, Free Fire, and Mobile Legends now available!', '#3b82f6', '#ffffff', 2, true),
  ('24/7 Support', '💬 Need help? Our support team is available 24/7 via ticket system', '#10b981', '#ffffff', 3, true);

CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type notification_type,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, metadata)
  VALUES (p_user_id, p_type, p_title, p_message, p_data)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
    IF NEW.status = 'completed' THEN
      PERFORM create_notification(
        NEW.user_id,
        'order_completed',
        'Order Completed',
        'Your order #' || SUBSTRING(NEW.id::TEXT, 1, 8) || ' has been completed successfully!',
        jsonb_build_object('order_id', NEW.id, 'amount', NEW.total_amount)
      );
    ELSIF NEW.status = 'cancelled' THEN
      PERFORM create_notification(
        NEW.user_id,
        'order_canceled',
        'Order Canceled',
        'Your order #' || SUBSTRING(NEW.id::TEXT, 1, 8) || ' has been canceled.',
        jsonb_build_object('order_id', NEW.id, 'amount', NEW.total_amount)
      );
    ELSIF NEW.status = 'refunded' THEN
      PERFORM create_notification(
        NEW.user_id,
        'order_refunded',
        'Order Refunded',
        'Your order #' || SUBSTRING(NEW.id::TEXT, 1, 8) || ' has been refunded. Amount credited to your wallet.',
        jsonb_build_object('order_id', NEW.id, 'amount', NEW.total_amount)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_order_status ON public.orders;
CREATE TRIGGER trigger_notify_order_status
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_status_change();

CREATE OR REPLACE FUNCTION notify_payment_proof_status()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
    IF NEW.status = 'approved' THEN
      PERFORM create_notification(
        NEW.user_id,
        'payment_approved',
        'Payment Approved',
        'Your payment of $' || NEW.amount || ' has been approved and credited to your wallet!',
        jsonb_build_object('payment_proof_id', NEW.id, 'amount', NEW.amount)
      );
    ELSIF NEW.status = 'rejected' THEN
      PERFORM create_notification(
        NEW.user_id,
        'payment_rejected',
        'Payment Rejected',
        'Your payment submission has been rejected. Please check admin notes and try again.',
        jsonb_build_object('payment_proof_id', NEW.id, 'amount', NEW.amount, 'admin_notes', NEW.admin_notes)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_payment_proof ON public.payment_proofs;
CREATE TRIGGER trigger_notify_payment_proof
  AFTER UPDATE ON public.payment_proofs
  FOR EACH ROW
  EXECUTE FUNCTION notify_payment_proof_status();

-- ============================================
-- Migration: 00006_add_stock_and_api_keys.sql
-- ============================================

-- Stock Management System
CREATE TABLE IF NOT EXISTS stock_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  reserved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reserved_at TIMESTAMPTZ,
  sold_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  sold_at TIMESTAMPTZ,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stock_items_product ON stock_items(product_id);
CREATE INDEX idx_stock_items_status ON stock_items(status);
CREATE INDEX idx_stock_items_order ON stock_items(order_id);

CREATE TABLE IF NOT EXISTS stock_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_items INTEGER NOT NULL,
  successful_items INTEGER DEFAULT 0,
  failed_items INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  note TEXT,
  version TEXT NOT NULL DEFAULT 'v2' CHECK (version IN ('v1', 'v2')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  permissions JSONB NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_keys_key ON api_keys(key);
CREATE INDEX idx_api_keys_status ON api_keys(status);

ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage stock items"
  ON stock_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can view their purchased stock"
  ON stock_items
  FOR SELECT
  TO authenticated
  USING (sold_to = auth.uid());

ALTER TABLE stock_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage stock uploads"
  ON stock_uploads
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage API keys"
  ON api_keys
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE OR REPLACE FUNCTION update_stock_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stock_items_updated_at
  BEFORE UPDATE ON stock_items
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_items_updated_at();

CREATE OR REPLACE FUNCTION update_api_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_api_keys_updated_at();

-- ============================================
-- Migration: 00007_pricing_system.sql
-- ============================================

-- Providers table: Store API provider information
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  api_endpoint TEXT NOT NULL,
  api_key TEXT,
  api_type TEXT NOT NULL DEFAULT 'rest',
  is_active BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User levels table: Define user tiers with benefits
CREATE TABLE IF NOT EXISTS user_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_percentage DECIMAL(5,2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  min_spent DECIMAL(10,2) DEFAULT 0,
  color TEXT DEFAULT '#gray',
  priority INTEGER DEFAULT 0,
  benefits JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Custom rates table: User-specific pricing overrides
CREATE TABLE IF NOT EXISTS custom_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  custom_price DECIMAL(10,2) NOT NULL CHECK (custom_price >= 0),
  discount_percentage DECIMAL(5,2),
  note TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Add fields to products table
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS provider_product_id TEXT,
  ADD COLUMN IF NOT EXISTS base_price DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS profit_margin DECIMAL(5,2) DEFAULT 10 CHECK (profit_margin >= 0),
  ADD COLUMN IF NOT EXISTS use_global_margin BOOLEAN DEFAULT true;

-- Add user_level_id to profiles table
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS user_level_id UUID REFERENCES user_levels(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS total_spent DECIMAL(10,2) DEFAULT 0;

-- Global settings table for profit margin
CREATE TABLE IF NOT EXISTS global_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default global profit margin
INSERT INTO global_settings (key, value, description)
VALUES ('global_profit_margin', '10', 'Default profit margin percentage for all products')
ON CONFLICT (key) DO NOTHING;

-- Insert default user levels
INSERT INTO user_levels (name, description, discount_percentage, min_spent, color, priority) VALUES
  ('Bronze', 'Entry level - No discount', 0, 0, '#CD7F32', 1),
  ('Silver', 'Silver level - 5% discount', 5, 100, '#C0C0C0', 2),
  ('Gold', 'Gold level - 10% discount', 10, 500, '#FFD700', 3),
  ('Platinum', 'Platinum level - 15% discount', 15, 1000, '#E5E4E2', 4),
  ('Diamond', 'Diamond level - 20% discount', 20, 5000, '#B9F2FF', 5)
ON CONFLICT (name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_providers_active ON providers(is_active);
CREATE INDEX IF NOT EXISTS idx_user_levels_priority ON user_levels(priority DESC);
CREATE INDEX IF NOT EXISTS idx_custom_rates_user ON custom_rates(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_rates_product ON custom_rates(product_id);
CREATE INDEX IF NOT EXISTS idx_products_provider ON products(provider_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_level ON profiles(user_level_id);

-- RLS Policies
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage providers"
  ON providers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active user levels"
  ON user_levels
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage user levels"
  ON user_levels
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

ALTER TABLE custom_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own custom rates"
  ON custom_rates
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all custom rates"
  ON custom_rates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view global settings"
  ON global_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage global settings"
  ON global_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to calculate user's final price for a product
CREATE OR REPLACE FUNCTION calculate_user_price(
  p_user_id UUID,
  p_product_id UUID
)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  v_base_price DECIMAL(10,2);
  v_profit_margin DECIMAL(5,2);
  v_use_global_margin BOOLEAN;
  v_global_margin DECIMAL(5,2);
  v_price_with_margin DECIMAL(10,2);
  v_custom_rate DECIMAL(10,2);
  v_user_level_discount DECIMAL(5,2);
  v_final_price DECIMAL(10,2);
BEGIN
  SELECT 
    COALESCE(base_price, price) as base,
    profit_margin,
    use_global_margin
  INTO v_base_price, v_profit_margin, v_use_global_margin
  FROM products
  WHERE id = p_product_id;

  IF v_use_global_margin THEN
    SELECT value::DECIMAL INTO v_global_margin
    FROM global_settings
    WHERE key = 'global_profit_margin';
    v_profit_margin := COALESCE(v_global_margin, 10);
  END IF;

  v_price_with_margin := v_base_price * (1 + v_profit_margin / 100);

  SELECT custom_price INTO v_custom_rate
  FROM custom_rates
  WHERE user_id = p_user_id
    AND product_id = p_product_id
    AND is_active = true;

  IF v_custom_rate IS NOT NULL THEN
    RETURN v_custom_rate;
  END IF;

  SELECT ul.discount_percentage INTO v_user_level_discount
  FROM profiles p
  JOIN user_levels ul ON p.user_level_id = ul.id
  WHERE p.id = p_user_id
    AND ul.is_active = true;

  IF v_user_level_discount IS NOT NULL AND v_user_level_discount > 0 THEN
    v_final_price := v_price_with_margin * (1 - v_user_level_discount / 100);
  ELSE
    v_final_price := v_price_with_margin;
  END IF;

  RETURN ROUND(v_final_price, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-upgrade user level based on spending
CREATE OR REPLACE FUNCTION auto_upgrade_user_level()
RETURNS TRIGGER AS $$
DECLARE
  v_new_level_id UUID;
BEGIN
  SELECT id INTO v_new_level_id
  FROM user_levels
  WHERE min_spent <= NEW.total_spent
    AND is_active = true
  ORDER BY priority DESC
  LIMIT 1;

  IF v_new_level_id IS NOT NULL AND v_new_level_id != COALESCE(NEW.user_level_id, '00000000-0000-0000-0000-000000000000'::UUID) THEN
    NEW.user_level_id := v_new_level_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_upgrade_user_level ON profiles;
CREATE TRIGGER trigger_auto_upgrade_user_level
  BEFORE UPDATE OF total_spent ON profiles
  FOR EACH ROW
  WHEN (NEW.total_spent IS DISTINCT FROM OLD.total_spent)
  EXECUTE FUNCTION auto_upgrade_user_level();

-- Function to update total_spent when order is completed
CREATE OR REPLACE FUNCTION update_user_spending()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE profiles
    SET total_spent = COALESCE(total_spent, 0) + NEW.total_amount
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_spending ON orders;
CREATE TRIGGER trigger_update_user_spending
  AFTER UPDATE ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
  EXECUTE FUNCTION update_user_spending();

-- ============================================
-- Migration: 00008_add_price_details_function.sql
-- ============================================

-- Create function to get detailed price calculation
CREATE OR REPLACE FUNCTION get_price_details(
  p_user_id UUID,
  p_product_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_base_price DECIMAL(10,2);
  v_profit_margin DECIMAL(5,2);
  v_use_global_margin BOOLEAN;
  v_global_margin DECIMAL(5,2);
  v_price_with_margin DECIMAL(10,2);
  v_custom_rate DECIMAL(10,2);
  v_user_level_discount DECIMAL(5,2);
  v_final_price DECIMAL(10,2);
  v_savings DECIMAL(10,2);
  v_discount_percentage DECIMAL(5,2);
  v_discount_reason TEXT;
BEGIN
  -- Get product pricing info
  SELECT 
    COALESCE(base_price, price) as base,
    profit_margin,
    use_global_margin
  INTO v_base_price, v_profit_margin, v_use_global_margin
  FROM products
  WHERE id = p_product_id;

  -- Get global margin if needed
  IF v_use_global_margin THEN
    SELECT value::DECIMAL INTO v_global_margin
    FROM global_settings
    WHERE key = 'global_profit_margin';
    v_profit_margin := COALESCE(v_global_margin, 10);
  END IF;

  -- Calculate price with margin
  v_price_with_margin := v_base_price * (1 + v_profit_margin / 100);

  -- Check for custom rate
  SELECT custom_price INTO v_custom_rate
  FROM custom_rates
  WHERE user_id = p_user_id 
    AND product_id = p_product_id
    AND is_active = true;

  IF v_custom_rate IS NOT NULL THEN
    v_final_price := v_custom_rate;
    v_savings := v_price_with_margin - v_final_price;
    v_discount_percentage := (v_savings / v_price_with_margin) * 100;
    v_discount_reason := 'Custom Rate';
  ELSE
    -- Get user level discount
    SELECT COALESCE(ul.discount_percentage, 0)
    INTO v_user_level_discount
    FROM profiles p
    LEFT JOIN user_levels ul ON p.user_level_id = ul.id
    WHERE p.id = p_user_id;

    -- Apply user level discount
    v_final_price := v_price_with_margin * (1 - v_user_level_discount / 100);
    v_savings := v_price_with_margin - v_final_price;
    v_discount_percentage := v_user_level_discount;
    
    IF v_user_level_discount > 0 THEN
      SELECT ul.name INTO v_discount_reason
      FROM profiles p
      LEFT JOIN user_levels ul ON p.user_level_id = ul.id
      WHERE p.id = p_user_id;
      v_discount_reason := v_discount_reason || ' Level Discount';
    ELSE
      v_discount_reason := NULL;
    END IF;
  END IF;

  -- Return JSON object
  RETURN json_build_object(
    'base_price', v_base_price,
    'profit_margin', v_profit_margin,
    'price_with_margin', v_price_with_margin,
    'user_level_discount', COALESCE(v_user_level_discount, 0),
    'custom_rate', v_custom_rate,
    'final_price', v_final_price,
    'savings', COALESCE(v_savings, 0),
    'discount_percentage', COALESCE(v_discount_percentage, 0),
    'discount_reason', v_discount_reason
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Migration: 00009_add_dynamic_features.sql
-- ============================================

-- Create product_fields table for dynamic custom fields
CREATE TABLE IF NOT EXISTS product_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_value TEXT NOT NULL,
  field_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_fields_product_id ON product_fields(product_id);

-- Create site_settings table for logo and other site configurations
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type TEXT DEFAULT 'text',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default logo setting
INSERT INTO site_settings (setting_key, setting_value, setting_type)
VALUES ('site_logo', 'https://via.placeholder.com/150x50?text=MediaMoney', 'image')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO site_settings (setting_key, setting_value, setting_type)
VALUES ('site_logo_type', 'image', 'text')
ON CONFLICT (setting_key) DO NOTHING;

-- Create ads/banners table
CREATE TABLE IF NOT EXISTS site_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT DEFAULT 'image',
  link_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for active banners
CREATE INDEX IF NOT EXISTS idx_site_banners_active ON site_banners(is_active, display_order);

-- Insert sample banners
INSERT INTO site_banners (title, media_url, media_type, display_order, is_active)
VALUES 
  ('Welcome Banner', 'https://via.placeholder.com/1200x100?text=Welcome+to+MediaMoney', 'image', 1, true),
  ('Special Offer', 'https://via.placeholder.com/1200x100?text=Special+Offers+Available', 'image', 2, true)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE product_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_banners ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_fields
CREATE POLICY "Anyone can view product fields"
  ON product_fields FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage product fields"
  ON product_fields FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for site_settings
CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site settings"
  ON site_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for site_banners
CREATE POLICY "Anyone can view active banners"
  ON site_banners FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all banners"
  ON site_banners FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage banners"
  ON site_banners FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- Migration: 00010_create_missing_tables.sql
-- ============================================

-- Create missing tables

-- Payments table (if not exists)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  transaction_id TEXT,
  proof_url TEXT,
  notes TEXT,
  admin_notes TEXT,
  processed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ticket replies table
CREATE TABLE IF NOT EXISTS ticket_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  is_admin_reply BOOLEAN DEFAULT false,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  interval TEXT NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL,
  next_billing_date TIMESTAMP NOT NULL,
  last_billing_date TIMESTAMP,
  amount DECIMAL(10, 2) NOT NULL,
  player_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Drip feed orders table
CREATE TABLE IF NOT EXISTS drip_feed_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  total_quantity INTEGER NOT NULL,
  delivered_quantity INTEGER DEFAULT 0,
  delivery_speed INTEGER NOT NULL,
  status TEXT DEFAULT 'processing' NOT NULL,
  next_delivery_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Refill requests table
CREATE TABLE IF NOT EXISTS refill_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' NOT NULL,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Affiliates table
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  referral_code TEXT UNIQUE NOT NULL,
  commission_rate DECIMAL(5, 2) DEFAULT 5.00,
  total_earnings DECIMAL(10, 2) DEFAULT 0.00,
  total_referrals INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Child panels table
CREATE TABLE IF NOT EXISTS child_panels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  panel_name TEXT NOT NULL,
  domain TEXT,
  api_access BOOLEAN DEFAULT true,
  revenue_share DECIMAL(5, 2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Custom rates table (ensure it exists with correct structure)
CREATE TABLE IF NOT EXISTS custom_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  custom_price DECIMAL(10, 2),
  discount_percentage DECIMAL(5, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_ticket_replies_ticket_id ON ticket_replies(ticket_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_drip_feed_orders_order_id ON drip_feed_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_refill_requests_order_id ON refill_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_refill_requests_user_id ON refill_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_referral_code ON affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_child_panels_owner_id ON child_panels(owner_id);

-- ============================================
-- Migration: 00011_setup_rls_policies_corrected.sql
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE drip_feed_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE refill_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_panels ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Categories policies (public read, admin write)
DROP POLICY IF EXISTS "Anyone can view active categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Anyone can view active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products policies (public read, admin write)
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Orders policies
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all orders" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Payments policies
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Users can create own payments" ON payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
DROP POLICY IF EXISTS "Admins can update all payments" ON payments;
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all payments" ON payments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can create notifications" ON notifications FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Banners policies (public read, admin write)
DROP POLICY IF EXISTS "Anyone can view active banners" ON banners;
DROP POLICY IF EXISTS "Admins can manage banners" ON banners;
CREATE POLICY "Anyone can view active banners" ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage banners" ON banners FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Tickets policies
DROP POLICY IF EXISTS "Users can view own tickets" ON tickets;
DROP POLICY IF EXISTS "Users can create own tickets" ON tickets;
DROP POLICY IF EXISTS "Users can update own tickets" ON tickets;
DROP POLICY IF EXISTS "Admins can view all tickets" ON tickets;
DROP POLICY IF EXISTS "Admins can update all tickets" ON tickets;
CREATE POLICY "Users can view own tickets" ON tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own tickets" ON tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tickets" ON tickets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all tickets" ON tickets FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all tickets" ON tickets FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- Migration: 00012_create_api_system_tables_corrected.sql
-- ============================================

-- Create API usage tracking table
CREATE TABLE IF NOT EXISTS api_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time INTEGER,
  ip_address TEXT,
  user_agent TEXT,
  request_body JSONB,
  response_body JSONB,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create API rate limiting table
CREATE TABLE IF NOT EXISTS api_rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE NOT NULL UNIQUE,
  requests_per_minute INTEGER DEFAULT 60,
  requests_per_hour INTEGER DEFAULT 1000,
  requests_per_day INTEGER DEFAULT 10000,
  current_minute_count INTEGER DEFAULT 0,
  current_hour_count INTEGER DEFAULT 0,
  current_day_count INTEGER DEFAULT 0,
  minute_reset_at TIMESTAMP DEFAULT NOW(),
  hour_reset_at TIMESTAMP DEFAULT NOW(),
  day_reset_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create webhook logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_id UUID REFERENCES webhooks(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status_code INTEGER,
  response_body TEXT,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create API endpoints documentation table
CREATE TABLE IF NOT EXISTS api_endpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  endpoint TEXT NOT NULL UNIQUE,
  method TEXT NOT NULL,
  description TEXT,
  request_schema JSONB,
  response_schema JSONB,
  requires_auth BOOLEAN DEFAULT true,
  rate_limit INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_api_key_id ON api_usage_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created_at ON api_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_api_key_id ON api_rate_limits(api_key_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_is_active ON webhooks(is_active);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_webhook_id ON webhook_logs(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs(created_at);

-- Enable RLS
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_endpoints ENABLE ROW LEVEL SECURITY;

-- RLS Policies for API usage logs (users can view their own, admins can view all)
CREATE POLICY "Users can view own API usage" ON api_usage_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM api_keys WHERE api_keys.id = api_usage_logs.api_key_id AND api_keys.created_by = auth.uid())
);
CREATE POLICY "Admins can view all API usage" ON api_usage_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can insert API usage logs" ON api_usage_logs FOR INSERT WITH CHECK (true);

-- RLS Policies for API rate limits
CREATE POLICY "Users can view own rate limits" ON api_rate_limits FOR SELECT USING (
  EXISTS (SELECT 1 FROM api_keys WHERE api_keys.id = api_rate_limits.api_key_id AND api_keys.created_by = auth.uid())
);
CREATE POLICY "Admins can manage rate limits" ON api_rate_limits FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for webhooks
CREATE POLICY "Users can view own webhooks" ON webhooks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own webhooks" ON webhooks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all webhooks" ON webhooks FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for webhook logs
CREATE POLICY "Users can view own webhook logs" ON webhook_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM webhooks WHERE webhooks.id = webhook_logs.webhook_id AND webhooks.user_id = auth.uid())
);
CREATE POLICY "Admins can view all webhook logs" ON webhook_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can insert webhook logs" ON webhook_logs FOR INSERT WITH CHECK (true);

-- RLS Policies for API endpoints (public read, admin write)
CREATE POLICY "Anyone can view active API endpoints" ON api_endpoints FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage API endpoints" ON api_endpoints FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Function to generate API key
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS TEXT AS $$
DECLARE
  key TEXT;
BEGIN
  key := 'rh_' || encode(gen_random_bytes(32), 'hex');
  RETURN key;
END;
$$ LANGUAGE plpgsql;

-- Function to generate API secret
CREATE OR REPLACE FUNCTION generate_api_secret()
RETURNS TEXT AS $$
DECLARE
  secret TEXT;
BEGIN
  secret := encode(gen_random_bytes(48), 'hex');
  RETURN secret;
END;
$$ LANGUAGE plpgsql;

-- Function to check rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(p_api_key_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_rate_limit RECORD;
  v_now TIMESTAMP := NOW();
BEGIN
  SELECT * INTO v_rate_limit FROM api_rate_limits WHERE api_key_id = p_api_key_id;
  
  IF NOT FOUND THEN
    -- Create default rate limit
    INSERT INTO api_rate_limits (api_key_id) VALUES (p_api_key_id);
    RETURN true;
  END IF;
  
  -- Reset counters if time windows have passed
  IF v_now > v_rate_limit.minute_reset_at THEN
    UPDATE api_rate_limits 
    SET current_minute_count = 0, minute_reset_at = v_now + INTERVAL '1 minute'
    WHERE api_key_id = p_api_key_id;
    v_rate_limit.current_minute_count := 0;
  END IF;
  
  IF v_now > v_rate_limit.hour_reset_at THEN
    UPDATE api_rate_limits 
    SET current_hour_count = 0, hour_reset_at = v_now + INTERVAL '1 hour'
    WHERE api_key_id = p_api_key_id;
    v_rate_limit.current_hour_count := 0;
  END IF;
  
  IF v_now > v_rate_limit.day_reset_at THEN
    UPDATE api_rate_limits 
    SET current_day_count = 0, day_reset_at = v_now + INTERVAL '1 day'
    WHERE api_key_id = p_api_key_id;
    v_rate_limit.current_day_count := 0;
  END IF;
  
  -- Check if limits are exceeded
  IF v_rate_limit.current_minute_count >= v_rate_limit.requests_per_minute THEN
    RETURN false;
  END IF;
  
  IF v_rate_limit.current_hour_count >= v_rate_limit.requests_per_hour THEN
    RETURN false;
  END IF;
  
  IF v_rate_limit.current_day_count >= v_rate_limit.requests_per_day THEN
    RETURN false;
  END IF;
  
  -- Increment counters
  UPDATE api_rate_limits 
  SET 
    current_minute_count = current_minute_count + 1,
    current_hour_count = current_hour_count + 1,
    current_day_count = current_day_count + 1
  WHERE api_key_id = p_api_key_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Migration: 00013_create_2fa_and_security_tables.sql
-- ============================================

-- Create 2FA secrets table
CREATE TABLE IF NOT EXISTS two_factor_auth (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  secret TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT false,
  backup_codes TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  enabled_at TIMESTAMP,
  last_used_at TIMESTAMP
);

-- Create login history table
CREATE TABLE IF NOT EXISTS login_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  location TEXT,
  device_type TEXT,
  success BOOLEAN DEFAULT true,
  failure_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create security events table
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  description TEXT,
  ip_address TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create email change requests table
CREATE TABLE IF NOT EXISTS email_change_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  old_email TEXT NOT NULL,
  new_email TEXT NOT NULL,
  verification_token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP
);

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  used_at TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_two_factor_auth_user_id ON two_factor_auth(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_created_at ON login_history(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_email_change_requests_user_id ON email_change_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_email_change_requests_token ON email_change_requests(verification_token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);

-- Enable RLS
ALTER TABLE two_factor_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for two_factor_auth
CREATE POLICY "Users can view own 2FA settings" ON two_factor_auth FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own 2FA settings" ON two_factor_auth FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all 2FA settings" ON two_factor_auth FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for login_history
CREATE POLICY "Users can view own login history" ON login_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert login history" ON login_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all login history" ON login_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for security_events
CREATE POLICY "Users can view own security events" ON security_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert security events" ON security_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all security events" ON security_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for email_change_requests
CREATE POLICY "Users can view own email change requests" ON email_change_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own email change requests" ON email_change_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own email change requests" ON email_change_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all email change requests" ON email_change_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for password_reset_tokens
CREATE POLICY "Users can view own password reset tokens" ON password_reset_tokens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage password reset tokens" ON password_reset_tokens FOR ALL WITH CHECK (true);

-- Function to generate backup codes
CREATE OR REPLACE FUNCTION generate_backup_codes()
RETURNS TEXT[] AS $$
DECLARE
  codes TEXT[];
  i INTEGER;
BEGIN
  codes := ARRAY[]::TEXT[];
  FOR i IN 1..10 LOOP
    codes := array_append(codes, upper(substring(md5(random()::text) from 1 for 8)));
  END LOOP;
  RETURN codes;
END;
$$ LANGUAGE plpgsql;

-- Function to log security event
CREATE OR REPLACE FUNCTION log_security_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_description TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO security_events (user_id, event_type, description, ip_address, metadata)
  VALUES (p_user_id, p_event_type, p_description, p_ip_address, p_metadata)
  RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql;

-- Function to log login attempt
CREATE OR REPLACE FUNCTION log_login_attempt(
  p_user_id UUID,
  p_ip_address TEXT,
  p_user_agent TEXT,
  p_success BOOLEAN,
  p_failure_reason TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_login_id UUID;
BEGIN
  INSERT INTO login_history (user_id, ip_address, user_agent, success, failure_reason)
  VALUES (p_user_id, p_ip_address, p_user_agent, p_success, p_failure_reason)
  RETURNING id INTO v_login_id;
  
  RETURN v_login_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Migration: 00014_add_security_enhancements.sql
-- ============================================

-- Create rate limiting table for security operations
CREATE TABLE IF NOT EXISTS security_rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  operation_type TEXT NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  window_start TIMESTAMP DEFAULT NOW(),
  blocked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, operation_type, window_start)
);

-- Create index for rate limiting
CREATE INDEX IF NOT EXISTS idx_security_rate_limits_user_op ON security_rate_limits(user_id, operation_type);
CREATE INDEX IF NOT EXISTS idx_security_rate_limits_ip_op ON security_rate_limits(ip_address, operation_type);
CREATE INDEX IF NOT EXISTS idx_security_rate_limits_window ON security_rate_limits(window_start);

-- Enable RLS
ALTER TABLE security_rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policy for rate limits (system only)
CREATE POLICY "System can manage rate limits" ON security_rate_limits FOR ALL WITH CHECK (true);

-- Function to check rate limit
CREATE OR REPLACE FUNCTION check_security_rate_limit(
  p_user_id UUID,
  p_ip_address TEXT,
  p_operation_type TEXT,
  p_max_attempts INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 15
)
RETURNS BOOLEAN AS $$
DECLARE
  v_attempt_count INTEGER;
  v_blocked_until TIMESTAMP;
  v_window_start TIMESTAMP;
BEGIN
  v_window_start := NOW() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Check if user is currently blocked
  SELECT blocked_until INTO v_blocked_until
  FROM security_rate_limits
  WHERE user_id = p_user_id
    AND operation_type = p_operation_type
    AND blocked_until > NOW()
  ORDER BY blocked_until DESC
  LIMIT 1;
  
  IF v_blocked_until IS NOT NULL THEN
    RETURN false;
  END IF;
  
  -- Get attempt count in current window
  SELECT COALESCE(SUM(attempt_count), 0) INTO v_attempt_count
  FROM security_rate_limits
  WHERE user_id = p_user_id
    AND operation_type = p_operation_type
    AND window_start > v_window_start;
  
  -- If exceeded, block user
  IF v_attempt_count >= p_max_attempts THEN
    INSERT INTO security_rate_limits (user_id, ip_address, operation_type, attempt_count, blocked_until)
    VALUES (p_user_id, p_ip_address, p_operation_type, 1, NOW() + (p_window_minutes || ' minutes')::INTERVAL);
    RETURN false;
  END IF;
  
  -- Record attempt
  INSERT INTO security_rate_limits (user_id, ip_address, operation_type, attempt_count)
  VALUES (p_user_id, p_ip_address, p_operation_type, 1)
  ON CONFLICT (user_id, operation_type, window_start) 
  DO UPDATE SET attempt_count = security_rate_limits.attempt_count + 1;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify backup code
CREATE OR REPLACE FUNCTION verify_backup_code(
  p_user_id UUID,
  p_code TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_stored_codes TEXT[];
  v_code_hash TEXT;
  v_code_exists BOOLEAN;
BEGIN
  -- Hash the provided code
  v_code_hash := encode(digest(p_code, 'sha256'), 'hex');
  
  -- Get stored backup codes
  SELECT backup_codes INTO v_stored_codes
  FROM two_factor_auth
  WHERE user_id = p_user_id
    AND is_enabled = true;
  
  IF v_stored_codes IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if code exists
  v_code_exists := v_code_hash = ANY(v_stored_codes);
  
  IF v_code_exists THEN
    -- Remove used code
    UPDATE two_factor_auth
    SET backup_codes = array_remove(backup_codes, v_code_hash),
        last_used_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Log usage
    PERFORM log_security_event(
      p_user_id,
      'backup_code_used',
      'Backup code used for authentication',
      NULL
    );
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add password history table
CREATE TABLE IF NOT EXISTS password_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_history_user_id ON password_history(user_id);
CREATE INDEX IF NOT EXISTS idx_password_history_created_at ON password_history(created_at);

-- Enable RLS
ALTER TABLE password_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy (system only)
CREATE POLICY "System can manage password history" ON password_history FOR ALL WITH CHECK (true);

-- Function to add password to history
CREATE OR REPLACE FUNCTION add_password_to_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Store password hash in history
  INSERT INTO password_history (user_id, password_hash)
  VALUES (NEW.id, NEW.encrypted_password);
  
  -- Keep only last 5 passwords
  DELETE FROM password_history
  WHERE user_id = NEW.id
    AND id NOT IN (
      SELECT id FROM password_history
      WHERE user_id = NEW.id
      ORDER BY created_at DESC
      LIMIT 5
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for password history (if auth.users table is accessible)
-- Note: This may not work with Supabase Auth, but included for completeness

-- Add session tracking table
CREATE TABLE IF NOT EXISTS active_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  last_activity TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_active_sessions_user_id ON active_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_token ON active_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_active_sessions_expires ON active_sessions(expires_at);

-- Enable RLS
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sessions
CREATE POLICY "Users can view own sessions" ON active_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions" ON active_sessions FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "System can manage sessions" ON active_sessions FOR ALL WITH CHECK (true);

-- Function to clean expired sessions
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM active_sessions WHERE expires_at < NOW();
  DELETE FROM security_rate_limits WHERE window_start < NOW() - INTERVAL '24 hours';
  DELETE FROM password_reset_tokens WHERE expires_at < NOW();
  DELETE FROM email_change_requests WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add input validation function
CREATE OR REPLACE FUNCTION validate_email(p_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN p_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add username validation function
CREATE OR REPLACE FUNCTION validate_username(p_username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Username must be 3-30 characters, alphanumeric and underscores only
  RETURN p_username ~* '^[A-Za-z0-9_]{3,30}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update profiles table with validation
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_username_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_username_check 
  CHECK (validate_username(username));

-- Add constraint for email format (if not already exists)
-- Note: Supabase Auth handles email validation, but we add it for profiles table
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_email_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_email_check 
  CHECK (email IS NULL OR validate_email(email));

-- Create function to log login attempt with rate limiting
CREATE OR REPLACE FUNCTION log_login_with_rate_limit(
  p_user_id UUID,
  p_ip_address TEXT,
  p_user_agent TEXT,
  p_success BOOLEAN,
  p_failure_reason TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_login_id UUID;
  v_rate_limit_ok BOOLEAN;
  v_failed_attempts INTEGER;
BEGIN
  -- Log the attempt
  INSERT INTO login_history (user_id, ip_address, user_agent, success, failure_reason)
  VALUES (p_user_id, p_ip_address, p_user_agent, p_success, p_failure_reason)
  RETURNING id INTO v_login_id;
  
  -- If failed, check rate limit
  IF NOT p_success THEN
    -- Count recent failed attempts
    SELECT COUNT(*) INTO v_failed_attempts
    FROM login_history
    WHERE user_id = p_user_id
      AND success = false
      AND created_at > NOW() - INTERVAL '15 minutes';
    
    -- Check rate limit
    v_rate_limit_ok := check_security_rate_limit(
      p_user_id,
      p_ip_address,
      'login_attempt',
      5,
      15
    );
    
    IF NOT v_rate_limit_ok THEN
      -- Log security event
      PERFORM log_security_event(
        p_user_id,
        'account_locked',
        'Account temporarily locked due to multiple failed login attempts',
        p_ip_address
      );
      
      RETURN jsonb_build_object(
        'success', false,
        'locked', true,
        'message', 'Account temporarily locked due to multiple failed attempts'
      );
    END IF;
    
    IF v_failed_attempts >= 3 THEN
      RETURN jsonb_build_object(
        'success', false,
        'locked', false,
        'warning', true,
        'message', 'Multiple failed attempts detected. Account will be locked after 5 attempts.'
      );
    END IF;
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'login_id', v_login_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Migration: 00015_add_multi_currency_support.sql
-- ============================================

-- Create currencies table
CREATE TABLE IF NOT EXISTS currencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  exchange_rate DECIMAL(10, 6) DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create exchange rates history table
CREATE TABLE IF NOT EXISTS exchange_rates_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  currency_code TEXT NOT NULL,
  rate DECIMAL(10, 6) NOT NULL,
  source TEXT DEFAULT 'manual',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create user preferences table for language and currency
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  language TEXT DEFAULT 'en',
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'UTC',
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default currencies
INSERT INTO currencies (code, name, symbol, exchange_rate, is_active) VALUES
  ('USD', 'US Dollar', '$', 1.0, true),
  ('EUR', 'Euro', '€', 0.92, true),
  ('GBP', 'British Pound', '£', 0.79, true),
  ('JPY', 'Japanese Yen', '¥', 149.50, true),
  ('CNY', 'Chinese Yuan', '¥', 7.24, true),
  ('AUD', 'Australian Dollar', 'A$', 1.52, true),
  ('CAD', 'Canadian Dollar', 'C$', 1.35, true),
  ('CHF', 'Swiss Franc', 'CHF', 0.88, true),
  ('INR', 'Indian Rupee', '₹', 83.12, true),
  ('KRW', 'South Korean Won', '₩', 1320.50, true),
  ('BRL', 'Brazilian Real', 'R$', 4.97, true),
  ('RUB', 'Russian Ruble', '₽', 92.50, true),
  ('MXN', 'Mexican Peso', '$', 17.15, true),
  ('SAR', 'Saudi Riyal', '﷼', 3.75, true),
  ('AED', 'UAE Dirham', 'د.إ', 3.67, true),
  ('TRY', 'Turkish Lira', '₺', 32.15, true),
  ('SGD', 'Singapore Dollar', 'S$', 1.34, true),
  ('HKD', 'Hong Kong Dollar', 'HK$', 7.82, true),
  ('SEK', 'Swedish Krona', 'kr', 10.35, true),
  ('NOK', 'Norwegian Krone', 'kr', 10.75, true)
ON CONFLICT (code) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_currencies_code ON currencies(code);
CREATE INDEX IF NOT EXISTS idx_currencies_active ON currencies(is_active);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_history_currency ON exchange_rates_history(currency_code);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_history_created ON exchange_rates_history(created_at);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Enable RLS
ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for currencies (public read)
CREATE POLICY "Anyone can view active currencies" ON currencies FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage currencies" ON currencies FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for exchange_rates_history (public read)
CREATE POLICY "Anyone can view exchange rates history" ON exchange_rates_history FOR SELECT USING (true);
CREATE POLICY "Admins can manage exchange rates" ON exchange_rates_history FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all preferences" ON user_preferences FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Function to convert currency
CREATE OR REPLACE FUNCTION convert_currency(
  p_amount DECIMAL,
  p_from_currency TEXT,
  p_to_currency TEXT
)
RETURNS DECIMAL AS $$
DECLARE
  v_from_rate DECIMAL;
  v_to_rate DECIMAL;
  v_result DECIMAL;
BEGIN
  -- Get exchange rates
  SELECT exchange_rate INTO v_from_rate FROM currencies WHERE code = p_from_currency AND is_active = true;
  SELECT exchange_rate INTO v_to_rate FROM currencies WHERE code = p_to_currency AND is_active = true;
  
  IF v_from_rate IS NULL OR v_to_rate IS NULL THEN
    RAISE EXCEPTION 'Invalid currency code';
  END IF;
  
  -- Convert to USD first, then to target currency
  v_result := (p_amount / v_from_rate) * v_to_rate;
  
  RETURN ROUND(v_result, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get user's preferred currency
CREATE OR REPLACE FUNCTION get_user_currency(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_currency TEXT;
BEGIN
  SELECT currency INTO v_currency FROM user_preferences WHERE user_id = p_user_id;
  RETURN COALESCE(v_currency, 'USD');
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get user's preferred language
CREATE OR REPLACE FUNCTION get_user_language(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_language TEXT;
BEGIN
  SELECT language INTO v_language FROM user_preferences WHERE user_id = p_user_id;
  RETURN COALESCE(v_language, 'en');
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to update exchange rates
CREATE OR REPLACE FUNCTION update_exchange_rate(
  p_currency_code TEXT,
  p_new_rate DECIMAL,
  p_source TEXT DEFAULT 'manual'
)
RETURNS void AS $$
BEGIN
  -- Update currency table
  UPDATE currencies 
  SET exchange_rate = p_new_rate, updated_at = NOW()
  WHERE code = p_currency_code;
  
  -- Log to history
  INSERT INTO exchange_rates_history (currency_code, rate, source)
  VALUES (p_currency_code, p_new_rate, p_source);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default preferences on user creation
CREATE OR REPLACE FUNCTION create_default_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id, language, currency)
  VALUES (NEW.id, 'en', 'USD')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_create_user_preferences
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_user_preferences();

-- Update profiles table to support currency
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_currency TEXT DEFAULT 'USD';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';

-- Function to format currency
CREATE OR REPLACE FUNCTION format_currency(
  p_amount DECIMAL,
  p_currency_code TEXT
)
RETURNS TEXT AS $$
DECLARE
  v_symbol TEXT;
  v_formatted TEXT;
BEGIN
  SELECT symbol INTO v_symbol FROM currencies WHERE code = p_currency_code;
  
  IF v_symbol IS NULL THEN
    v_symbol := p_currency_code;
  END IF;
  
  v_formatted := v_symbol || ' ' || TO_CHAR(p_amount, 'FM999,999,999.00');
  
  RETURN v_formatted;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- Migration: 00016_fix_profile_creation_trigger.sql
-- ============================================


-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;

-- Recreate the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  -- Count existing profiles
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  
  -- Insert new profile
  INSERT INTO public.profiles (id, email, username, role, wallet_balance, currency)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END,
    0,
    'USD'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger for INSERT (when user signs up)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create trigger for UPDATE (when user confirms email)
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;


-- ============================================
-- Migration: 00017_add_profile_insert_policy.sql
-- ============================================


-- Allow users to insert their own profile (one-time only)
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also allow service_role to insert profiles (for triggers)
CREATE POLICY "Service role can insert profiles"
  ON public.profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);
