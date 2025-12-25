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
